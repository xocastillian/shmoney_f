import { useCallback, useState } from 'react'
import { getAnalytics } from '@/api/client'
import type { AnalyticsResponse } from '@/api/types'
import { useAnalyticsStore } from '@/store/analyticsStore'
import type { Analytics } from '@/types/entities/analytics'

export interface AnalyticsParams {
	from?: Date | string
	to?: Date | string
	categoryIds?: number[]
}

const mapAnalytics = (response: AnalyticsResponse): Analytics => ({
	period: {
		from: response.period.from,
		to: response.period.to,
	},
	currencyCode: response.currencyCode,
	totalExpense: response.totalExpense,
	totalIncome: response.totalIncome,
	cashFlowAmount: response.cashFlowAmount,
	cashFlowPercent: response.cashFlowPercent,
	totalExpenseTransactions: response.totalExpenseTransactions,
	categories:
		response.categories?.map(category => ({
			categoryId: category.categoryId,
			categoryName: category.categoryName,
			categoryColor: category.categoryColor,
			amount: category.amount,
			percent: category.percent,
			transactionCount: category.transactionCount ?? 0,
		})) ?? [],
	topCategories:
		response.topCategories?.map(category => ({
			categoryId: category.categoryId,
			categoryName: category.categoryName,
			categoryColor: category.categoryColor,
			amount: category.amount,
			percent: category.percent,
			transactionCount: category.transactionCount ?? 0,
		})) ?? [],
})

export function useAnalytics() {
	const analytics = useAnalyticsStore(state => state.analytics)
	const loading = useAnalyticsStore(state => state.loading)
	const setAnalytics = useAnalyticsStore(state => state.setAnalytics)
	const setLoading = useAnalyticsStore(state => state.setLoading)
	const clearStore = useAnalyticsStore(state => state.clear)
	const [error, setError] = useState<string | null>(null)

	const fetchAnalytics = useCallback(
		async (params?: AnalyticsParams) => {
			setLoading(true)
			try {
				const response = await getAnalytics(params)
				const mapped = mapAnalytics(response)
				setAnalytics(mapped)
				setError(null)
				return mapped
			} catch (err) {
				const message = err instanceof Error ? err.message : 'Не удалось загрузить аналитику'
				setError(message)
				throw err
			} finally {
				setLoading(false)
			}
		},
		[setAnalytics, setLoading]
	)

	const clear = useCallback(() => {
		clearStore()
		setError(null)
	}, [clearStore])

	return {
		analytics,
		loading,
		error,
		fetchAnalytics,
		clear,
	}
}

export default useAnalytics
