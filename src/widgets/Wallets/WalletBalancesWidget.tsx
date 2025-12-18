import { useEffect, useMemo, useState } from 'react'
import type { Wallet, WalletBalanceSummary } from '@/types/entities/wallet'
import { WalletDebetOrCredit, WalletStatus } from '@/types/entities/wallet'
import { useTranslation } from '@/i18n'
import SegmentedTabs, { type SegmentedTabOption } from '@/components/ui/SegmentedTabs/SegmentedTabs'

interface WalletBalancesWidgetProps {
	balances: WalletBalanceSummary[]
	wallets: Wallet[]
	loading?: boolean
	error?: string | null
}

type BalanceTabValue = 'ALL' | WalletDebetOrCredit

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

const WalletBalancesWidget = ({ balances, wallets, loading = false, error = null }: WalletBalancesWidgetProps) => {
	const { t } = useTranslation()
	const [activeTab, setActiveTab] = useState<BalanceTabValue>('ALL')

	const computedAllBalances = useMemo(() => aggregateBalances(wallets), [wallets])
	const debitBalances = useMemo(() => aggregateBalances(wallets, WalletDebetOrCredit.DEBET), [wallets])
	const creditBalances = useMemo(() => aggregateBalances(wallets, WalletDebetOrCredit.CREDIT), [wallets])
	const hasDebit = debitBalances.length > 0
	const hasCredit = creditBalances.length > 0

	const tabOptions = useMemo(() => {
		const tabs: Array<SegmentedTabOption<BalanceTabValue>> = [{ value: 'ALL', label: t('wallets.section.all') }]
		if (hasDebit) tabs.push({ value: WalletDebetOrCredit.DEBET, label: t('wallets.section.debet') })
		if (hasCredit) tabs.push({ value: WalletDebetOrCredit.CREDIT, label: t('wallets.section.credit') })
		return tabs
	}, [hasCredit, hasDebit, t])

	useEffect(() => {
		if (!tabOptions.some(tab => tab.value === activeTab)) {
			setActiveTab(tabOptions[0]?.value ?? 'ALL')
		}
	}, [activeTab, tabOptions])

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

			{tabOptions.length > 1 && (
				<div className='mb-3'>
					<SegmentedTabs value={activeTab} options={tabOptions} onChange={value => setActiveTab(value)} className='bg-background-muted-2 -mx-3' />
				</div>
			)}

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
