import { create } from 'zustand'
import type { TelegramUserInfo } from '@/lib/telegram'

export type AuthStatus = 'idle' | 'authenticating' | 'authenticated' | 'error'

interface AuthStore {
	status: AuthStatus
	error: string | null
	user: TelegramUserInfo | null
	setStatus: (s: AuthStatus) => void
	setError: (e: string | null) => void
	setUser: (u: TelegramUserInfo | null) => void
	reset: () => void
}

export const useAuthStore = create<AuthStore>(set => ({
	status: 'idle',
	error: null,
	user: null,
	setStatus: s => set({ status: s }),
	setError: e => set({ error: e }),
	setUser: u => set({ user: u }),
	reset: () => set({ status: 'idle', error: null, user: null }),
}))
