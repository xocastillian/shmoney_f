import { useEffect, useMemo } from 'react'
import { useTelegramAuth } from '@/hooks/useTelegramAuth'
import AuthDiagnostics from '@/components/auth/auth-diagnostics'
import Wallets from '@/widgets/Wallets/Wallets'
import ExchangeRates from '@/widgets/ExchangeRates/ExchangeRates'
import { useWallets } from '@/hooks/useWallets'
import { useExchangeRates } from '@/hooks/useExchangeRates'
import { useCategories } from '@/hooks/useCategories'

const HomeScreen = () => {
	const { status, error: authError, isInTelegram, login } = useTelegramAuth({ auto: true })
	const authenticated = useMemo(() => status === 'authenticated', [status])
	const { wallets, loading: walletsLoading, error: walletsError, fetchWallets, clearWallets } = useWallets()
	const { fetchExchangeRates, clearRates } = useExchangeRates()
	const { fetchCategories, clearCategories: resetCategories } = useCategories()

	useEffect(() => {
		if (!authenticated) {
			clearWallets()
			clearRates()
			resetCategories()
			return
		}

		void fetchWallets()
		void fetchExchangeRates().catch(() => undefined)
		void fetchCategories().catch(() => undefined)
	}, [authenticated, fetchWallets, fetchExchangeRates, fetchCategories, clearWallets, clearRates, resetCategories])

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
				</>
			)}
		</div>
	)
}

export default HomeScreen
