import axios from 'axios'
import { endpoints } from './endpoints'
import { logDebug } from '@/lib/logger'

const isProd = import.meta.env.MODE === 'production'
const sameOrigin = !isProd && Boolean(import.meta.env.VITE_DEV_API_TARGET)
export const baseURL: string = sameOrigin ? '' : import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || ''
const refreshClient = axios.create({ baseURL, withCredentials: true })

let refreshingPromise: Promise<void> | null = null
let refreshAttempts = 0
const MAX_REFRESH_ATTEMPTS = 5

async function doRefresh(): Promise<void> {
	if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
		throw new Error('Max refresh attempts reached')
	}

	refreshAttempts += 1
	logDebug('Refreshing tokens', { attempt: refreshAttempts, baseURL })
	await refreshClient.post(endpoints.auth.refresh, {})
	refreshAttempts = 0
}

export function refreshTokens(): Promise<void> {
	if (!refreshingPromise) {
		refreshingPromise = doRefresh().finally(() => {
			refreshingPromise = null
		})
	}
	return refreshingPromise
}
