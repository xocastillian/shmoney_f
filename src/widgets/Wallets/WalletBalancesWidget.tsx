import type { WalletBalanceSummary } from '@/types/entities/wallet'

interface WalletBalancesWidgetProps {
	balances: WalletBalanceSummary[]
	loading?: boolean
	error?: string | null
}

const WalletBalancesWidget = ({ balances, loading = false, error = null }: WalletBalancesWidgetProps) => {
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

	if (!balances.length) {
		return (
			<section className='rounded-xl bg-background-muted p-6 text-center text-sm text-label shadow-sm backdrop-blur'>
				Здесь будет общий баланс
			</section>
		)
	}

	return (
		<section className='rounded-xl bg-background-muted p-3 shadow-sm backdrop-blur'>
			<div className='mb-3 border-b pb-3 border-divider'>
				<h2 className='text-base'>Баланс</h2>
			</div>

			<ul className='space-y-2'>
				{balances.map(balance => (
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
