import { useCallback } from 'react'
import { getSettings, updateSettings } from '@/api/client'
import type { SettingsResponse } from '@/api/types'
import { useSettingsStore } from '@/store/settingsStore'

export function useSettings() {
	const defaultLanguage = useSettingsStore(state => state.defaultLanguage)
	const supportedLanguages = useSettingsStore(state => state.supportedLanguages)
	const language = useSettingsStore(state => state.language)
	const loading = useSettingsStore(state => state.loading)
	const error = useSettingsStore(state => state.error)
	const setSettings = useSettingsStore(state => state.setSettings)
	const setLanguage = useSettingsStore(state => state.setLanguage)
	const setLoading = useSettingsStore(state => state.setLoading)
	const setError = useSettingsStore(state => state.setError)
	const clear = useSettingsStore(state => state.clear)

	const fetchSettings = useCallback(async (): Promise<SettingsResponse> => {
		setLoading(true)
		try {
			const response = await getSettings()
			setSettings(response)

			const serverLang = response.defaultLanguage

			if (response.supportedLanguages.includes(serverLang)) {
				setLanguage(serverLang)
			} else if (!language || !response.supportedLanguages.includes(language)) {
				setLanguage(response.defaultLanguage)
			}

			setError(null)
			return response
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Не удалось загрузить настройки'
			setError(message)
			throw err
		} finally {
			setLoading(false)
		}
	}, [language, setError, setLanguage, setLoading, setSettings])

	const changeLanguage = useCallback(
		async (nextLanguage: string): Promise<SettingsResponse> => {
			setLoading(true)
			try {
				const response = await updateSettings({ language: nextLanguage })
				setSettings(response)
				if (response.supportedLanguages.includes(nextLanguage)) {
					setLanguage(nextLanguage)
				} else {
					setLanguage(response.defaultLanguage)
				}
				setError(null)
				return response
			} catch (err) {
				const message = err instanceof Error ? err.message : 'Не удалось обновить язык'
				setError(message)
				throw err
			} finally {
				setLoading(false)
			}
		},
		[setError, setLanguage, setLoading, setSettings]
	)

	return {
		defaultLanguage,
		supportedLanguages,
		language,
		loading,
		error,
		fetchSettings,
		setLanguage,
		changeLanguage,
		clear,
	}
}

export default useSettings
