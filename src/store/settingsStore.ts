import { create } from 'zustand'
import type { AppSettings } from '@/types/entities/appSettings'

interface SettingsState {
	defaultLanguage: string | null
	mainCurrency: string | null
	supportedLanguages: string[]
	supportedCurrencies: string[]
	language: string | null
	loading: boolean
	error: string | null
	setSettings: (settings: AppSettings) => void
	setLanguage: (language: string | null) => void
	setLoading: (loading: boolean) => void
	setError: (error: string | null) => void
	clear: () => void
}

const initialState: Omit<SettingsState, 'setSettings' | 'setLanguage' | 'setLoading' | 'setError' | 'clear'> = {
	defaultLanguage: null,
	mainCurrency: null,
	supportedLanguages: [],
	supportedCurrencies: [],
	language: null,
	loading: false,
	error: null,
}

export const useSettingsStore = create<SettingsState>(set => ({
	...initialState,
	setSettings: settings =>
		set({
			defaultLanguage: settings.defaultLanguage,
			mainCurrency: settings.mainCurrency,
			supportedLanguages: settings.supportedLanguages,
			supportedCurrencies: settings.supportedCurrencies,
		}),
	setLanguage: language => set({ language }),
	setLoading: loading => set({ loading }),
	setError: error => set({ error }),
	clear: () => set({ ...initialState }),
}))
