import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getInitData, isInTelegram, ready } from '@/lib/telegram'
import { telegramLogin } from '@api/client'
import { logDebug, logError, logInfo } from '@/lib/logger'

type AuthStatus = 'idle' | 'authenticating' | 'authenticated' | 'error'

export function useTelegramAuth(options?: { auto?: boolean }) {
	const auto = options?.auto ?? true
	const [status, setStatus] = useState<AuthStatus>('idle')
	const [error, setError] = useState<string | null>(null)

	const canAutoLogin = useMemo(() => auto && isInTelegram(), [auto])
  const autoOnceRef = useRef(false)

	const login = useCallback(async (initData?: string) => {
		try {
			setStatus('authenticating')
			const data = initData ?? getInitData()
			if (!data) throw new Error('Telegram initData is not available')
			ready()
			logInfo('Starting telegram login', { initDataLen: data.length })
			await telegramLogin({ initData: data })
			setStatus('authenticated')
			setError(null)
			logInfo('Telegram login success')
		} catch (e) {
			const msg = e instanceof Error ? e.message : 'Login failed'
			setError(msg)
			setStatus('error')
			logError('Telegram login failed', { message: msg })
		}
	}, [])

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
