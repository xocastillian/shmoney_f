import axios, { AxiosError } from 'axios'
import type { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'
import { refreshTokens } from './token'
import { endpoints } from './endpoints'
import { logDebug, logError } from '@/lib/logger'

declare module 'axios' {
	export interface InternalAxiosRequestConfig {
		_retry?: boolean
	}
}

const sameOrigin = Boolean(import.meta.env.VITE_DEV_API_TARGET)
export const baseURL: string = sameOrigin
  ? ''
  : (import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || '')

export const api: AxiosInstance = axios.create({
	baseURL,
	timeout: 20000,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
	},
})

api.interceptors.request.use((cfg) => {
  const payload = cfg.url?.includes('/api/auth/telegram') ? cfg.data : undefined
  logDebug('Request', { url: cfg.url, baseURL: cfg.baseURL, data: payload })
  return cfg
})

api.interceptors.response.use(
	r => r,
	async (error: AxiosError<unknown>) => {
		const { response, config } = error
		const original = config as InternalAxiosRequestConfig | undefined
		const status = response?.status
		const url = original?.url || ''

		const isAuthEndpoint = url?.includes(endpoints.auth.refresh) || url?.includes(endpoints.auth.telegram)

		if (status === 401 && original && !original._retry && !isAuthEndpoint) {
			try {
				original._retry = true
				logDebug('401 -> refresh flow', { url, baseURL })
				await refreshTokens()
				return api(original as AxiosRequestConfig)
			} catch (e) {
				logError('Refresh failed', { url, error: (e as Error).message })
				return Promise.reject(e)
			}
		}

		const data = error.response?.data
		logError('API error', { url, status, message: error.message, data })
		return Promise.reject(error)
	}
)

export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
	const res = await api.get(url, config)
	return res.data as T
}

export async function post<T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig): Promise<T> {
	const res = await api.post(url, body, config)
	return res.data as T
}

export async function patch<T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig): Promise<T> {
	const res = await api.patch(url, body, config)
	return res.data as T
}

export async function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
	const res = await api.delete(url, config)
	return res.data as T
}
