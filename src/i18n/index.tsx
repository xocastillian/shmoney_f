import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { en, type TranslationDictionary } from './translations/en'
import { ru } from './translations/ru'

const translations = {
	en,
	ru,
}

export type Locale = keyof typeof translations
export type TranslationKey = keyof TranslationDictionary

interface I18nContextValue {
	locale: Locale
	setLocale: (locale: Locale) => void
	t: (key: TranslationKey | string, options?: { defaultValue?: string }) => string
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined)

interface I18nProviderProps {
	children: ReactNode
	initialLocale?: Locale
}

const defaultLocale: Locale = 'ru'

export const I18nProvider = ({ children, initialLocale = defaultLocale }: I18nProviderProps) => {
	const [locale, setLocale] = useState<Locale>(initialLocale)

	const translate = useCallback<I18nContextValue['t']>(
		(key, options) => {
			const dictionary = translations[locale] ?? translations[defaultLocale]
			return dictionary[key as TranslationKey] ?? options?.defaultValue ?? key
		},
		[locale]
	)

	const value = useMemo<I18nContextValue>(
		() => ({
			locale,
			setLocale,
			t: translate,
		}),
		[locale, translate]
	)

	return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export const useTranslation = () => {
	const context = useContext(I18nContext)
	if (!context) {
		throw new Error('useTranslation must be used within I18nProvider')
	}
	return context
}

export const availableLocales = Object.keys(translations) as Locale[]
