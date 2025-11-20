import { create } from 'zustand'
import type { ExchangeRate } from '@/types/entities/exchangeRate'

interface ExchangeRatesState {
	rates: ExchangeRate[]
	loading: boolean
	setRates: (rates: ExchangeRate[]) => void
	setLoading: (loading: boolean) => void
	clear: () => void
}

export const useExchangeRatesStore = create<ExchangeRatesState>(set => ({
	rates: [],
	loading: false,
	setRates: rates => set({ rates }),
	setLoading: loading => set({ loading }),
	clear: () => set({ rates: [], loading: false }),
}))
