import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTelegramAuth } from '@/hooks/useTelegramAuth'
import AuthDiagnostics from '@/components/auth/auth-diagnostics'
import Wallets from '@/widgets/Wallets/Wallets'
import ExchangeRates from '@/widgets/ExchangeRates/ExchangeRates'
import TransactionsWidget from '@/components/Transactions/TransactionsWidget'
import TransactionsDrawer from '@/components/Transactions/TransactionsDrawer'
import TransactionsFilterDrawer from '@/components/Transactions/TransactionsFilterDrawer'
import type { TransactionsFilterState } from '@/components/Transactions/filters'
import { getTransactionFeed } from '@/api/client'
import type { TransactionFeedItem } from '@api/types'
import { serializeUtcDate } from '@/utils/dateTime'
import { useWallets } from '@/hooks/useWallets'
import { useExchangeRates } from '@/hooks/useExchangeRates'
import { useCategories } from '@/hooks/useCategories'
import useTransactions from '@/hooks/useTransactions'
import type { Wallet } from '@/types/entities/wallet'
import type { Category } from '@/types/entities/category'

interface HomeScreenProps {
	onTransactionSelect?: (item: TransactionFeedItem) => void
}

const HomeScreen = ({ onTransactionSelect }: HomeScreenProps) => {
	const { status, error: authError, isInTelegram, login } = useTelegramAuth({ auto: true })
	const authenticated = useMemo(() => status === 'authenticated', [status])
	const { wallets, loading: walletsLoading, error: walletsError, fetchWallets, clearWallets } = useWallets()
	const { fetchExchangeRates, clearRates } = useExchangeRates()
	const { categories, fetchCategories, clearCategories: resetCategories } = useCategories()
	const { feed, feedLoading, feedError, fetchTransactionFeed, clearTransactions } = useTransactions()
	const [isTransactionsDrawerOpen, setTransactionsDrawerOpen] = useState(false)
	const [isFiltersDrawerOpen, setFiltersDrawerOpen] = useState(false)
	const [isLoadingMoreFeed, setIsLoadingMoreFeed] = useState(false)
	const isLoadingMoreFeedRef = useRef(false)
	const [feedFilters, setFeedFilters] = useState<TransactionsFilterState>({
		type: '',
		from: '',
		to: '',
		walletId: null,
		categoryId: null,
	})
	const [drawerFeed, setDrawerFeed] = useState<TransactionFeedItem[]>([])
	const [drawerNextPage, setDrawerNextPage] = useState<number | null>(null)
	const [drawerLoading, setDrawerLoading] = useState(false)
	const [drawerError, setDrawerError] = useState<string | null>(null)
	const hasActiveFeedFilters = useMemo(
		() => Boolean(feedFilters.type || feedFilters.from || feedFilters.to || feedFilters.walletId || feedFilters.categoryId),
		[feedFilters]
	)

	const feedQueryParams = useMemo(() => {
		const params: Parameters<typeof fetchTransactionFeed>[0] = {}
		if (feedFilters.type) {
			params.type = feedFilters.type
		}
		if (feedFilters.from) {
			params.from = serializeUtcDate(feedFilters.from)
		}
		if (feedFilters.to) {
			params.to = serializeUtcDate(feedFilters.to)
		}
		if (typeof feedFilters.walletId === 'number') {
			params.walletId = feedFilters.walletId
		}
		if (typeof feedFilters.categoryId === 'number') {
			params.categoryId = feedFilters.categoryId
		}
		return params
	}, [feedFilters])

	const handleFeedFiltersChange = useCallback((changes: Partial<TransactionsFilterState>) => {
		setFeedFilters(prev => ({ ...prev, ...changes }))
	}, [])

	const handleResetFeedFilters = useCallback(() => {
		setFeedFilters({ type: '', from: '', to: '', walletId: null, categoryId: null })
	}, [])

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

	useEffect(() => {
		if (!authenticated) {
			clearWallets()
			clearRates()
			resetCategories()
			clearTransactions()
			return
		}

		void fetchWallets()
		void fetchExchangeRates().catch(() => undefined)
		void fetchCategories().catch(() => undefined)
	}, [authenticated, fetchWallets, fetchExchangeRates, fetchCategories, clearWallets, clearRates, resetCategories, clearTransactions])

	useEffect(() => {
		if (!authenticated) {
			return
		}
		void fetchTransactionFeed().catch(() => undefined)
	}, [authenticated, fetchTransactionFeed])

	const loadDrawerFeed = useCallback(
		async (page = 0, append = false) => {
			if (append) {
				if (isLoadingMoreFeedRef.current) return
				isLoadingMoreFeedRef.current = true
				setIsLoadingMoreFeed(true)
			} else {
				setDrawerLoading(true)
			}

			try {
				const response = await getTransactionFeed({ ...feedQueryParams, page })
				setDrawerFeed(prev => (append ? [...prev, ...response.results] : response.results))
				setDrawerNextPage(response.next ?? null)
				setDrawerError(null)
			} catch (error) {
				const message = error instanceof Error ? error.message : 'Не удалось загрузить транзакции'
				setDrawerError(message)
			} finally {
				if (append) {
					setIsLoadingMoreFeed(false)
					isLoadingMoreFeedRef.current = false
				} else {
					setDrawerLoading(false)
				}
			}
		},
		[feedQueryParams]
	)

	useEffect(() => {
		if (!isTransactionsDrawerOpen) return
		void loadDrawerFeed(0, false)
	}, [isTransactionsDrawerOpen, loadDrawerFeed])

	const handleLoadMoreFeed = useCallback(async () => {
		if (drawerNextPage == null) return
		await loadDrawerFeed(drawerNextPage, true)
	}, [drawerNextPage, loadDrawerFeed])

	return (
		<div className='min-h-full p-3 pb-24'>
			{!authenticated ? (
				<AuthDiagnostics status={status} error={authError ?? null} isInTelegram={isInTelegram} onLogin={data => login(data)} />
			) : (
				<>
					{walletsError && <div className='text-sm text-red-400'>{walletsError}</div>}
					<Wallets wallets={wallets} />
					{walletsLoading && <div className='mt-2 text-sm text-muted-foreground'>Загрузка...</div>}
					<ExchangeRates />
					<TransactionsWidget
						items={feed}
						loading={feedLoading}
						error={feedError}
						walletById={walletById}
						categoryById={categoryById}
						onItemClick={onTransactionSelect}
						onOpenDrawer={() => setTransactionsDrawerOpen(true)}
					/>
					<TransactionsDrawer
						open={isTransactionsDrawerOpen}
						onClose={() => setTransactionsDrawerOpen(false)}
						items={drawerFeed}
						walletById={walletById}
						categoryById={categoryById}
						hasMore={drawerNextPage != null}
						loadingMore={isLoadingMoreFeed}
						initialLoading={drawerLoading}
						error={drawerError}
						onLoadMore={handleLoadMoreFeed}
						onItemClick={onTransactionSelect}
						onOpenFilters={() => setFiltersDrawerOpen(true)}
						filtersActive={hasActiveFeedFilters}
					/>
					<TransactionsFilterDrawer
						open={isFiltersDrawerOpen}
						onClose={() => setFiltersDrawerOpen(false)}
						filters={feedFilters}
						onFiltersChange={handleFeedFiltersChange}
						onResetFilters={handleResetFeedFilters}
						wallets={wallets}
						categories={categories}
					/>
				</>
			)}
		</div>
	)
}

export default HomeScreen
