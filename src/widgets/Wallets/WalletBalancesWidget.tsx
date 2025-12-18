import { useMemo } from 'react'
import type { Wallet, WalletBalanceSummary } from '@/types/entities/wallet'
import { WalletDebetOrCredit, WalletStatus } from '@/types/entities/wallet'
import { useTranslation } from '@/i18n'
import type { WalletTabValue } from './Wallets'

interface WalletBalancesWidgetProps {
	balances: WalletBalanceSummary[]
	wallets: Wallet[]
	activeTab: WalletTabValue
	loading?: boolean
	error?: string | null
}

const aggregateBalances = (wallets: Wallet[], type?: WalletDebetOrCredit): WalletBalanceSummary[] => {
	const totals = new Map<string, number>()
	for (const wallet of wallets) {
		if (wallet.status !== WalletStatus.ACTIVE) continue
		if (type && wallet.debetOrCredit !== type) continue
		totals.set(wallet.currencyCode, (totals.get(wallet.currencyCode) ?? 0) + wallet.balance)
	}
	return Array.from(totals.entries()).map(([currencyCode, totalBalance]) => ({
		currencyCode,
		totalBalance,
	}))
}

const WalletBalancesWidget = ({ balances, wallets, activeTab, loading = false, error = null }: WalletBalancesWidgetProps) => {
	const { t } = useTranslation()
	const computedAllBalances = useMemo(() => aggregateBalances(wallets), [wallets])
	const debitBalances = useMemo(() => aggregateBalances(wallets, WalletDebetOrCredit.DEBET), [wallets])
	const creditBalances = useMemo(() => aggregateBalances(wallets, WalletDebetOrCredit.CREDIT), [wallets])

	const displayBalances =
		activeTab === 'ALL'
			? computedAllBalances.length > 0
				? computedAllBalances
				: balances
			: activeTab === WalletDebetOrCredit.DEBET
			? debitBalances
			: creditBalances

	const shouldRenderSkeleton = loading

	if (shouldRenderSkeleton) {
		return <WalletBalancesSkeleton />
	}

	if (error) {
		return (
			<div className='mt-3 text-sm text-danger' role='alert'>
				{error}
			</div>
		)
	}

	if (!displayBalances.length) {
		return (
			<section className='rounded-xl bg-background-muted p-6 text-center text-sm text-label shadow-sm backdrop-blur'>
				{t('wallets.balancePlaceholder')}
			</section>
		)
	}

	return (
		<section className='rounded-xl bg-background-muted p-3 shadow-sm backdrop-blur'>
			<div className='mb-3 border-b pb-3 border-divider'>
				<h2 className='text-base'>{t('wallets.balanceTitle')}</h2>
			</div>

			<ul className='space-y-2'>
				{displayBalances.map(balance => (
					<li key={balance.currencyCode} className='text-2xl'>
						<span className='font-medium mr-2'>{balance.totalBalance.toLocaleString()}</span>
						<span className='text-label'>{balance.currencyCode}</span>
					</li>
				))}
			</ul>
		</section>
	)
}

const WalletBalancesSkeleton = () => {
	return (
		<section className='rounded-xl bg-background-muted p-3 shadow-sm backdrop-blur animate-pulse'>
			<ul className='space-y-2'>
				{Array.from({ length: 1 }).map((_, index) => (
					<li key={`wallet-balance-skeleton-${index}`} className='flex items-center gap-3'>
						<div className='h-28 w-28 rounded bg-background-muted-2/60' />
						<div className='h-4 w-12 rounded bg-background-muted-2/60' />
					</li>
				))}
			</ul>
		</section>
	)
}

export default WalletBalancesWidget
