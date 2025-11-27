import { useMemo } from 'react'
import { useExchangeRates } from '@/hooks/useExchangeRates'

const numberFormatter = new Intl.NumberFormat('ru-RU', {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
})

const ExchangeRates = () => {
	const { rates, loading, error } = useExchangeRates()
	const hasRates = rates.length > 0
	const title = useMemo(() => 'Курсы валют', [])

	return (
		<section className='mt-4 rounded-xl bg-background-muted p-3 shadow-sm backdrop-blur'>
			<div className='mb-3 flex items-center justify-between gap-2 border-b pb-3 border-divider'>
				<h2 className='text-base'>{title}</h2>
				{loading && <span className='text-xs '>Обновление...</span>}
			</div>

			{error && <div className='mb-2 text-sm text-red-400'>{error}</div>}

			{hasRates ? (
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
				<div className='text-sm '>{loading ? 'Загрузка курсов…' : 'Курсы пока недоступны'}</div>
			)}
		</section>
	)
}

export default ExchangeRates
