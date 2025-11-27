import { useMemo } from 'react'
import type { ExchangeRate } from '@/types/entities/exchangeRate'
import { useTranslation } from '@/i18n'

const numberFormatter = new Intl.NumberFormat('ru-RU', {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
})

interface ExchangeRatesProps {
	rates: ExchangeRate[]
	loading?: boolean
	error?: string | null
}

const ExchangeRates = ({ rates, loading = false, error = null }: ExchangeRatesProps) => {
	const { t } = useTranslation()
	const hasRates = rates.length > 0
	const shouldRenderSkeleton = loading
	const title = useMemo(() => t('exchangeRates.title'), [t])

	if (shouldRenderSkeleton) {
		return <ExchangeRatesSkeleton />
	}

	return (
		<section className='rounded-xl bg-background-muted p-3 shadow-sm backdrop-blur'>
			<div className='mb-3 flex items-center justify-between gap-2 border-b pb-3 border-divider'>
				<h2 className='text-base'>{title}</h2>
			</div>

			{error && <div className='mb-2 text-sm text-danger'>{error}</div>}

			{!hasRates ? (
				<ul className='flex items-center justify-between'>
					{rates.map(rate => (
						<li key={`${rate.sourceCurrency}-${rate.targetCurrency}`} className='flex flex-col items-center'>
							<span className=' text-xs'>
								{rate.sourceCurrency}/{rate.targetCurrency}
							</span>

							<span className='text-lg font-semibold'>{numberFormatter.format(rate.rate)}</span>
						</li>
					))}
				</ul>
			) : (
				<div className='text-sm '>{t('exchangeRates.unavailable')}</div>
			)}
		</section>
	)
}

const ExchangeRatesSkeleton = () => {
	return (
		<section className='rounded-xl bg-background-muted p-3 shadow-sm backdrop-blur animate-pulse'>
			<div className='mb-3 flex items-center justify-between '>
				<div className='h-5 w-28 rounded bg-background-muted-2/60' />
			</div>
			<ul className='flex items-center justify-between'>
				{Array.from({ length: 1 }).map((_, index) => (
					<li key={`rates-skeleton-${index}`} className='flex flex-col items-center gap-2 w-full'>
						<div className='h-3 w-16 rounded bg-background-muted-2/60' />
						<div className='h-5 w-20 rounded bg-background-muted-2/60' />
					</li>
				))}
			</ul>
		</section>
	)
}

export default ExchangeRates
