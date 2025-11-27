import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getInitData, isInTelegram, ready, extractUserFromInitData } from '@/lib/telegram'
import { telegramLogin } from '@api/client'
import { logDebug, logError, logInfo } from '@/lib/logger'
import { useAuthStore, type AuthStatus } from '@/store/authStore'

export function useTelegramAuth(options?: { auto?: boolean }) {
	const auto = options?.auto ?? true
	const [status, setStatus] = useState<AuthStatus>('idle')
	const [error, setError] = useState<string | null>(null)
	const setStoreStatus = useAuthStore(s => s.setStatus)
	const setStoreError = useAuthStore(s => s.setError)
	const setStoreUser = useAuthStore(s => s.setUser)
	const setStoreLoading = useAuthStore(s => s.setLoading)
	const canAutoLogin = useMemo(() => auto && isInTelegram(), [auto])
	const autoOnceRef = useRef(false)

	const login = useCallback(async (initData?: string) => {
		try {
			setStatus('authenticating')
			setStoreStatus('authenticating')
			setStoreLoading(true)
			const data = initData ?? getInitData()
			if (!data) throw new Error('Telegram initData is not available')
			ready()
			logInfo('Starting telegram login', { initDataLen: data.length })
			await telegramLogin({ initData: data })
			const parsedUser = extractUserFromInitData(data)
			setStoreUser(parsedUser)
			setStatus('authenticated')
			setStoreStatus('authenticated')
			setError(null)
			setStoreError(null)
			setStoreLoading(false)
			logInfo('Telegram login success')
		} catch (e) {
			const msg = e instanceof Error ? e.message : 'Login failed'
			setError(msg)
			setStoreError(msg)
			setStatus('error')
			setStoreStatus('error')
			setStoreLoading(false)
			logError('Telegram login failed', { message: msg })
		}
	}, []) // eslint-disable-line

	useEffect(() => {
		if (status !== 'idle') return
		if (!canAutoLogin) return
		if (autoOnceRef.current) return
		autoOnceRef.current = true
		logDebug('Auto login in Telegram webview')
		void login()
	}, [canAutoLogin, login, status])

	return { status, error, isInTelegram: isInTelegram(), login }
}
