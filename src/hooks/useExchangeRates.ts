import { useCallback, useState } from 'react'
import { listExchangeRates as apiListExchangeRates } from '@api/client'
import type { ExchangeRateResponse } from '@api/types'
import type { ExchangeRate } from '@/types/entities/exchangeRate'
import { useExchangeRatesStore } from '@/store/exchangeRatesStore'

function mapExchangeRate(response: ExchangeRateResponse): ExchangeRate {
	return {
		sourceCurrency: response.sourceCurrency,
		targetCurrency: response.targetCurrency,
		rate: response.rate,
	}
}

export function useExchangeRates() {
	const rates = useExchangeRatesStore(state => state.rates)
	const loading = useExchangeRatesStore(state => state.loading)
	const setRates = useExchangeRatesStore(state => state.setRates)
	const setLoading = useExchangeRatesStore(state => state.setLoading)
	const clearRatesStore = useExchangeRatesStore(state => state.clear)
	const [error, setError] = useState<string | null>(null)

	const fetchExchangeRates = useCallback(
		async (params?: { to?: string }) => {
			setLoading(true)
			try {
				const data = await apiListExchangeRates(params)
				const mapped = data.map(mapExchangeRate)
				setRates(mapped)
				setError(null)
				return mapped
			} catch (err) {
				const message = err instanceof Error ? err.message : 'Не удалось загрузить курсы валют'
				setError(message)
				throw err
			} finally {
				setLoading(false)
			}
		},
		[setLoading, setRates]
	)

	const clearRates = useCallback(() => {
		clearRatesStore()
		setError(null)
	}, [clearRatesStore])

	return {
		rates,
		loading,
		error,
		fetchExchangeRates,
		clearRates,
	}
}

export default useExchangeRates
