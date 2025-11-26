import { useEffect, useMemo } from 'react'
import { useTelegramAuth } from '@/hooks/useTelegramAuth'
import AuthDiagnostics from '@/components/auth/auth-diagnostics'
import Wallets from '@/widgets/Wallets/Wallets'
import ExchangeRates from '@/widgets/ExchangeRates/ExchangeRates'
import TransactionsList from '@/components/Transactions/TransactionsList'
import { useWallets } from '@/hooks/useWallets'
import { useExchangeRates } from '@/hooks/useExchangeRates'
import { useCategories } from '@/hooks/useCategories'
import useTransactions from '@/hooks/useTransactions'

const HomeScreen = () => {
	const { status, error: authError, isInTelegram, login } = useTelegramAuth({ auto: true })
	const authenticated = useMemo(() => status === 'authenticated', [status])
	const { wallets, loading: walletsLoading, error: walletsError, fetchWallets, clearWallets } = useWallets()
	const { fetchExchangeRates, clearRates } = useExchangeRates()
	const { fetchCategories, clearCategories: resetCategories } = useCategories()
	const { feed, feedLoading, feedError, fetchTransactionFeed, clearTransactions } = useTransactions()
	const walletNameById = useMemo(() => {
		const map: Record<number, string> = {}
		for (const wallet of wallets) {
			map[wallet.id] = wallet.name
		}
		return map
	}, [wallets])

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
					<TransactionsList items={feed} loading={feedLoading} error={feedError} walletNameById={walletNameById} />
				</>
			)}
		</div>
	)
}

export default HomeScreen
