import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTelegramAuth } from '@/hooks/useTelegramAuth'
import AuthDiagnostics from '@/components/auth/auth-diagnostics'
import Wallets from '@/widgets/Wallets/Wallets'
import ExchangeRates from '@/widgets/ExchangeRates/ExchangeRates'
import TransactionsWidget from '@/components/Transactions/TransactionsWidget'
import TransactionsDrawer from '@/components/Transactions/TransactionsDrawer'
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
	const [isLoadingMoreFeed, setIsLoadingMoreFeed] = useState(false)
	const isLoadingMoreFeedRef = useRef(false)

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
		void fetchTransactionFeed().catch(() => undefined)
	}, [
		authenticated,
		fetchWallets,
		fetchExchangeRates,
		fetchCategories,
		fetchTransactionFeed,
		clearWallets,
		clearRates,
		resetCategories,
		clearTransactions,
	])

	const handleLoadMoreFeed = useCallback(async () => {
		const nextPage = feedMeta.next
		if (isLoadingMoreFeedRef.current || nextPage == null) return

		isLoadingMoreFeedRef.current = true
		setIsLoadingMoreFeed(true)

		try {
			await fetchTransactionFeed({ page: nextPage }, { append: true })
		} catch {
			// ошибки обрабатываются в хуке
		} finally {
			setIsLoadingMoreFeed(false)
			isLoadingMoreFeedRef.current = false
		}
	}, [feedMeta.next, fetchTransactionFeed])

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
					/>
				</>
			)}
		</div>
	)
}

export default HomeScreen
