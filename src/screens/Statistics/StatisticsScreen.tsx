import { useEffect, useMemo, useState, useCallback } from 'react'
import Loader from '@/components/ui/Loader/Loader'
import { useAnalytics } from '@/hooks/useAnalytics'
import { useTranslation } from '@/i18n'
import { useTelegramAuth } from '@/hooks/useTelegramAuth'
import CategoryPieChart, { type CategoryPieChartDatum } from '@/components/ui/CategoryPieChart/CategoryPieChart'
import TransactionsDrawer from '@/components/Transactions/TransactionsDrawer'
import { getTransactionFeed } from '@api/client'
import type { TransactionFeedItem } from '@api/types'
import { useWallets } from '@/hooks/useWallets'
import { useCategories } from '@/hooks/useCategories'
import type { Wallet } from '@/types/entities/wallet'
import type { Category } from '@/types/entities/category'

interface ChartCategoryDatum extends Record<string, unknown> {
	categoryId: number
	name: string
	value: number
	color: string
	percent: number
	transactionCount?: number
}

type ChartDatumWithFormatted = ChartCategoryDatum & CategoryPieChartDatum

interface StatisticsScreenProps {
	onTransactionSelect?: (item: TransactionFeedItem) => void
}

const localeMap: Record<string, string> = {
	ru: 'ru-RU',
	en: 'en-US',
}

const getCurrentMonthRange = () => {
	const now = new Date()
	const from = new Date(now.getFullYear(), now.getMonth(), 1)
	const to = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
	return { from, to }
}

const StatisticsScreen = ({ onTransactionSelect }: StatisticsScreenProps) => {
	const { analytics, loading, error, fetchAnalytics, clear } = useAnalytics()
	const { locale, t } = useTranslation()
	const { status } = useTelegramAuth({ auto: true })
	const { wallets, fetchWallets, clearWallets } = useWallets()
	const { categories, fetchCategories, clearCategories } = useCategories()
	const authenticated = useMemo(() => status === 'authenticated', [status])

	useEffect(() => {
		if (!authenticated) {
			clear()
			clearWallets()
			clearCategories()
			return
		}

		if (analytics) return
		void fetchAnalytics().catch(() => undefined)
	}, [authenticated, analytics, fetchAnalytics, clear, clearWallets, clearCategories])

	useEffect(() => {
		if (!authenticated) {
			return
		}

		if (!wallets.length) {
			void fetchWallets().catch(() => undefined)
		}

		if (!categories.length) {
			void fetchCategories().catch(() => undefined)
		}
	}, [authenticated, wallets.length, categories.length, fetchWallets, fetchCategories])

	const chartData = useMemo<ChartCategoryDatum[]>(
		() =>
			analytics?.categories.map(category => ({
				categoryId: category.categoryId,
				name: category.categoryName,
				value: category.amount,
				color: category.categoryColor,
				percent: category.percent,
				transactionCount: category.transactionCount ?? 0,
			})) ?? [],
		[analytics]
	)

	const resolvedLocale = localeMap[locale] ?? localeMap.ru

	const currencyFormatter = useMemo(() => {
		return new Intl.NumberFormat(resolvedLocale, {
			style: 'currency',
			currency: analytics?.currencyCode ?? 'USD',
			maximumFractionDigits: 2,
		})
	}, [analytics?.currencyCode, resolvedLocale])

	const formattedData = useMemo<ChartDatumWithFormatted[]>(
		() => chartData.map(item => ({ ...item, formattedValue: currencyFormatter.format(item.value) })),
		[chartData, currencyFormatter]
	)

	const walletById = useMemo(() => {
		const map: Record<number, Wallet> = {}
		for (const wallet of wallets) {
			map[wallet.id] = wallet
		}
		return map
	}, [wallets])

	const categoryById = useMemo(() => {
		const map: Record<number, Category> = {}
		for (const category of categories) {
			map[category.id] = category
		}
		return map
	}, [categories])

	const totalAmount = useMemo(() => chartData.reduce((sum, item) => sum + item.value, 0), [chartData])
	const totalFormatted = currencyFormatter.format(totalAmount)

	const hasData = formattedData.length > 0
	const [activeSliceIndex, setActiveSliceIndex] = useState<number | null>(null)
	const activeSlice = typeof activeSliceIndex === 'number' ? formattedData[activeSliceIndex] : null
	const [isDrawerOpen, setDrawerOpen] = useState(false)
	const [drawerItems, setDrawerItems] = useState<TransactionFeedItem[]>([])
	const [drawerLoading, setDrawerLoading] = useState(false)
	const [drawerError, setDrawerError] = useState<string | null>(null)

	useEffect(() => {
		if (!hasData) {
			setActiveSliceIndex(null)
			return
		}

		if (typeof activeSliceIndex === 'number' && activeSliceIndex >= formattedData.length) {
			setActiveSliceIndex(null)
		}
	}, [hasData, formattedData, activeSliceIndex])

	const handleSliceSelection = useCallback((_slice: ChartDatumWithFormatted | null, index: number | null) => {
		setActiveSliceIndex(typeof index === 'number' ? index : null)
	}, [])

	const defaultLabel = locale === 'en' ? 'All' : 'Все'
	const showAllLabel = useMemo(
		() => t('statistics.categories.button.showAll', { defaultValue: locale === 'en' ? 'Show all' : 'Показать все' }),
		[t, locale]
	)

	const showSelectedTemplate = useMemo(
		() =>
			t('statistics.categories.button.showSelected', {
				defaultValue: locale === 'en' ? 'Show {count} {transactionWord}' : 'Показать {count} {transactionWord}',
			}),
		[t, locale]
	)

	const countFormatter = useMemo(() => new Intl.NumberFormat(resolvedLocale), [resolvedLocale])

	const selectedTransactionsCount = activeSlice?.transactionCount ?? 0
	const getTransactionWord = useCallback(
		(count: number) => {
			const normalizedCount = Math.abs(count)
			if (locale === 'ru') {
				const mod100 = normalizedCount % 100
				if (mod100 >= 11 && mod100 <= 14) return 'транзакций'
				const mod10 = normalizedCount % 10
				if (mod10 === 1) return 'транзакцию'
				if (mod10 >= 2 && mod10 <= 4) return 'транзакции'
				return 'транзакций'
			}

			return normalizedCount === 1 ? 'transaction' : 'transactions'
		},
		[locale]
	)

	const showSelectedLabel = showSelectedTemplate
		.replace('{count}', countFormatter.format(selectedTransactionsCount))
		.replace('{transactionWord}', getTransactionWord(selectedTransactionsCount))
	const drawerTitle = activeSlice?.name ?? t('transactions.drawer.all')

	const fetchDrawerTransactions = useCallback(async (categoryId?: number | null) => {
		setDrawerLoading(true)
		setDrawerError(null)
		try {
			const { from, to } = getCurrentMonthRange()
			const response = await getTransactionFeed({
				categoryId: typeof categoryId === 'number' ? categoryId : undefined,
				from,
				to,
			})
			setDrawerItems(response.results)
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Не удалось загрузить транзакции'
			setDrawerItems([])
			setDrawerError(message)
		} finally {
			setDrawerLoading(false)
		}
	}, [])

	const handleDrawerButtonClick = useCallback(() => {
		if (!isDrawerOpen) {
			setDrawerOpen(true)
		}
	}, [isDrawerOpen])

	useEffect(() => {
		if (!isDrawerOpen) return
		void fetchDrawerTransactions(activeSlice?.categoryId ?? null)
	}, [isDrawerOpen, activeSlice?.categoryId, fetchDrawerTransactions])

	const header = (
		<header className='sticky top-0 z-20 bg-background'>
			<div className='flex items-center justify-between p-3'>
				<h1 className='text-lg font-medium'>{t('statistics.title')}</h1>
			</div>
		</header>
	)

	return (
		<div className='min-h-full bg-background overflow-y-auto'>
			{header}
			<div className='p-3 pb-24'>
				{loading ? (
					<div className='flex h-64 items-center justify-center'>
						<Loader />
					</div>
				) : error ? (
					<div className='text-center text-sm text-danger'>{error}</div>
				) : hasData ? (
					<div className='w-full rounded-xl bg-background-muted py-3'>
						<div className='mb-3 px-3'>
							<h2 className='text-base border-b border-divider pb-3 w-full'>{t('statistics.categories.title')}</h2>
						</div>
						<div className='flex flex-col items-center gap-3'>
							<div className='bg-background-muted-2 py-3 w-full'>
								<CategoryPieChart
									data={formattedData}
									defaultLabel={defaultLabel}
									fallbackValue={totalFormatted}
									className='w-full max-w-md'
									activeIndex={activeSliceIndex}
									onActiveSliceChange={handleSliceSelection}
								/>
							</div>
							<div className='px-3 w-full'>
								<button
									type='button'
									onClick={handleDrawerButtonClick}
									disabled={drawerLoading}
									className='w-full rounded-md bg-accent px-4 py-2 text-sm font-medium text-text-dark transition-colors duration-300 ease-in-out disabled:bg-background-muted disabled:text-accent disabled:opacity-50'
								>
									{activeSlice ? showSelectedLabel : showAllLabel}
								</button>
							</div>
						</div>
					</div>
				) : null}
			</div>

			<TransactionsDrawer
				open={isDrawerOpen}
				onClose={() => setDrawerOpen(false)}
				title={drawerTitle}
				items={drawerItems}
				walletById={walletById}
				categoryById={categoryById}
				initialLoading={drawerLoading}
				error={drawerError}
				onItemClick={onTransactionSelect}
			/>
		</div>
	)
}

export default StatisticsScreen
