import { useEffect, useMemo, useState, useCallback } from 'react'
import Loader from '@/components/ui/Loader/Loader'
import { useAnalytics } from '@/hooks/useAnalytics'
import { useTranslation } from '@/i18n'
import { useTelegramAuth } from '@/hooks/useTelegramAuth'
import CategoryPieChart, { type CategoryPieChartDatum } from '@/components/ui/CategoryPieChart/CategoryPieChart'

interface ChartCategoryDatum extends Record<string, unknown> {
	name: string
	value: number
	color: string
	percent: number
	transactionCount?: number
}

type ChartDatumWithFormatted = ChartCategoryDatum & CategoryPieChartDatum

const localeMap: Record<string, string> = {
	ru: 'ru-RU',
	en: 'en-US',
}

const StatisticsScreen = () => {
	const { analytics, loading, error, fetchAnalytics, clear } = useAnalytics()
	const { locale, t } = useTranslation()
	const { status } = useTelegramAuth({ auto: true })
	const authenticated = useMemo(() => status === 'authenticated', [status])

	useEffect(() => {
		if (!authenticated) {
			clear()
			return
		}

		if (analytics) return
		void fetchAnalytics().catch(() => undefined)
	}, [authenticated, analytics, fetchAnalytics, clear])

	const chartData = useMemo<ChartCategoryDatum[]>(
		() =>
			analytics?.categories.map(category => ({
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

	const totalAmount = useMemo(() => chartData.reduce((sum, item) => sum + item.value, 0), [chartData])
	const totalFormatted = currencyFormatter.format(totalAmount)

	const hasData = formattedData.length > 0
	const [activeSliceIndex, setActiveSliceIndex] = useState<number | null>(null)
	const activeSlice = typeof activeSliceIndex === 'number' ? formattedData[activeSliceIndex] : null

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

	return (
		<div className='flex min-h-full items-center justify-center p-3 pb-24'>
			{loading ? (
				<div className='flex h-64 items-center justify-center'>
					<Loader />
				</div>
			) : error ? (
				<div className='text-center text-sm text-danger'>{error}</div>
			) : hasData ? (
				<div className='w-full rounded-xl bg-background-muted py-3'>
					<div className='mb-3 border-b border-divider pb-3 px-3'>
						<h2 className='text-base'>{t('statistics.categories.title')}</h2>
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
						<div className='px-3 ml-auto w-fit'>
							<button
								type='button'
								className='rounded-md px-4 py-2 text-sm font-medium bg-accent text-text-dark disabled:bg-background-muted disabled:text-accent disabled:opacity-50 transition-colors duration-300 ease-in-out'
							>
								{activeSlice ? showSelectedLabel : showAllLabel}
							</button>
						</div>
					</div>
				</div>
			) : null}
		</div>
	)
}

export default StatisticsScreen
