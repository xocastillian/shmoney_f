import { create } from 'zustand'
import type { Analytics } from '@/types/entities/analytics'

interface AnalyticsState {
	analytics: Analytics | null
	loading: boolean
	setAnalytics: (analytics: Analytics | null) => void
	setLoading: (loading: boolean) => void
	clear: () => void
}

export const useAnalyticsStore = create<AnalyticsState>(set => ({
	analytics: null,
	loading: false,
	setAnalytics: analytics => set({ analytics }),
	setLoading: loading => set({ loading }),
	clear: () => set({ analytics: null, loading: false }),
}))
