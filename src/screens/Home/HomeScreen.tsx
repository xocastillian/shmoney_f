import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTelegramAuth } from '@/hooks/useTelegramAuth'
import AuthDiagnostics from '@/components/auth/auth-diagnostics'
import Wallets from '@/widgets/Wallets/Wallets'
import ExchangeRates from '@/widgets/ExchangeRates/ExchangeRates'
import TransactionsWidget from '@/components/Transactions/TransactionsWidget'
import TransactionsDrawer from '@/components/Transactions/TransactionsDrawer'
import TransactionsFilterDrawer from '@/components/Transactions/TransactionsFilterDrawer'
import type { TransactionsFilterState } from '@/components/Transactions/filters'
import { useWallets } from '@/hooks/useWallets'
import { useExchangeRates } from '@/hooks/useExchangeRates'
import { useCategories } from '@/hooks/useCategories'
import useTransactions from '@/hooks/useTransactions'
import type { Wallet } from '@/types/entities/wallet'
import type { Category } from '@/types/entities/category'

const HomeScreen = () => {
	const { status, error: authError, isInTelegram, login } = useTelegramAuth({ auto: true })
	const authenticated = useMemo(() => status === 'authenticated', [status])
	const { wallets, loading: walletsLoading, error: walletsError, fetchWallets, clearWallets } = useWallets()
	const { fetchExchangeRates, clearRates } = useExchangeRates()
	const { categories, fetchCategories, clearCategories: resetCategories } = useCategories()
	const { feed, feedMeta, feedLoading, feedError, fetchTransactionFeed, clearTransactions } = useTransactions()
	const [isTransactionsDrawerOpen, setTransactionsDrawerOpen] = useState(false)
	const [isFiltersDrawerOpen, setFiltersDrawerOpen] = useState(false)
	const [isLoadingMoreFeed, setIsLoadingMoreFeed] = useState(false)
	const isLoadingMoreFeedRef = useRef(false)
	const [feedFilters, setFeedFilters] = useState<TransactionsFilterState>({
		type: '',
		from: '',
		to: '',
	})

	const feedQueryParams = useMemo(() => {
		const params: Parameters<typeof fetchTransactionFeed>[0] = {}
		if (feedFilters.type) {
			params.type = feedFilters.type
		}
		if (feedFilters.from) {
			params.from = new Date(feedFilters.from).toISOString()
		}
		if (feedFilters.to) {
			params.to = new Date(feedFilters.to).toISOString()
		}
		return params
	}, [feedFilters])

	const handleFeedFiltersChange = useCallback((changes: Partial<TransactionsFilterState>) => {
		setFeedFilters(prev => ({ ...prev, ...changes }))
	}, [])

	const handleResetFeedFilters = useCallback(() => {
		setFeedFilters({ type: '', from: '', to: '' })
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
		void fetchTransactionFeed(feedQueryParams).catch(() => undefined)
	}, [authenticated, fetchTransactionFeed, feedQueryParams])

	const handleLoadMoreFeed = useCallback(async () => {
		const nextPage = feedMeta.next
		if (isLoadingMoreFeedRef.current || nextPage == null) return

		isLoadingMoreFeedRef.current = true
		setIsLoadingMoreFeed(true)

		try {
			await fetchTransactionFeed({ ...feedQueryParams, page: nextPage }, { append: true })
		} catch {
			// ошибки обрабатываются в хуке
		} finally {
			setIsLoadingMoreFeed(false)
			isLoadingMoreFeedRef.current = false
		}
	}, [feedMeta.next, fetchTransactionFeed, feedQueryParams])

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
						onOpenDrawer={() => setTransactionsDrawerOpen(true)}
					/>
					<TransactionsDrawer
						open={isTransactionsDrawerOpen}
						onClose={() => setTransactionsDrawerOpen(false)}
						items={feed}
						walletById={walletById}
						categoryById={categoryById}
						hasMore={feedMeta.next != null}
						loadingMore={isLoadingMoreFeed}
						onLoadMore={handleLoadMoreFeed}
						onOpenFilters={() => setFiltersDrawerOpen(true)}
					/>
					<TransactionsFilterDrawer
						open={isFiltersDrawerOpen}
						onClose={() => setFiltersDrawerOpen(false)}
						filters={feedFilters}
						onFiltersChange={handleFeedFiltersChange}
						onResetFilters={handleResetFeedFilters}
					/>
				</>
			)}
		</div>
	)
}

export default HomeScreen
