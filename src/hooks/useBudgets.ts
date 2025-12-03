import { useCallback, useMemo, useState } from 'react'
import {
	listBudgets,
	createBudget as apiCreateBudget,
	updateBudget as apiUpdateBudget,
	closeBudget as apiCloseBudget,
	deleteBudget as apiDeleteBudget,
	openBudget as apiOpenBudget,
} from '@api/client'
import type { BudgetCreateRequest, BudgetResponse, BudgetUpdateRequest } from '@api/types'
import { useBudgetsStore } from '@/store/budgetsStore'
import type { Budget, BudgetPeriodType, BudgetStatus } from '@/types/entities/budget'

type BudgetListParams = {
	status?: BudgetStatus
	from?: Date | string
	to?: Date | string
	periodType?: BudgetPeriodType
}

function mapBudget(response: BudgetResponse): Budget {
	return {
		id: response.id,
		name: response.name,
		periodType: response.periodType,
		periodStart: response.periodStart,
		periodEnd: response.periodEnd,
		budgetType: response.budgetType,
		currencyCode: response.currencyCode,
		amountLimit: response.amountLimit,
		spentAmount: response.spentAmount,
		percentSpent: response.percentSpent,
		status: response.status,
		categoryIds: response.categoryIds ?? [],
		closedAt: response.closedAt ?? null,
		createdAt: response.createdAt ?? null,
		updatedAt: response.updatedAt ?? null,
	}
}

export function useBudgets() {
	const budgets = useBudgetsStore(state => state.budgets)
	const loading = useBudgetsStore(state => state.loading)
	const setBudgets = useBudgetsStore(state => state.setBudgets)
	const upsertBudget = useBudgetsStore(state => state.upsertBudget)
	const removeBudget = useBudgetsStore(state => state.removeBudget)
	const setLoading = useBudgetsStore(state => state.setLoading)
	const clearStore = useBudgetsStore(state => state.clear)
	const [error, setError] = useState<string | null>(null)
	const [actionLoading, setActionLoading] = useState(false)

	const fetchBudgets = useCallback(
		async (params?: BudgetListParams) => {
			setLoading(true)
			try {
				const data = await listBudgets(params)
				const mapped = data.map(mapBudget)
				setBudgets(mapped)
				setError(null)
				return mapped
			} catch (err) {
				const message = err instanceof Error ? err.message : 'Не удалось загрузить бюджеты'
				setError(message)
				throw err
			} finally {
				setLoading(false)
			}
		},
		[setBudgets, setLoading]
	)

	const fetchBudgetsRaw = useCallback(async (params?: BudgetListParams) => {
		const data = await listBudgets(params)
		return data.map(mapBudget)
	}, [])

	const createBudget = useCallback(
		async (payload: BudgetCreateRequest) => {
			setActionLoading(true)
			try {
				const created = await apiCreateBudget(payload)
				const mapped = mapBudget(created)
				upsertBudget(mapped)
				setError(null)
				return mapped
			} catch (err) {
				const message = err instanceof Error ? err.message : 'Не удалось создать бюджет'
				setError(message)
				throw err
			} finally {
				setActionLoading(false)
			}
		},
		[upsertBudget]
	)

	const updateBudget = useCallback(
		async (budgetId: number, payload: BudgetUpdateRequest) => {
			setActionLoading(true)
			try {
				const updated = await apiUpdateBudget(budgetId, payload)
				const mapped = mapBudget(updated)
				upsertBudget(mapped)
				setError(null)
				return mapped
			} catch (err) {
				const message = err instanceof Error ? err.message : 'Не удалось обновить бюджет'
				setError(message)
				throw err
			} finally {
				setActionLoading(false)
			}
		},
		[upsertBudget]
	)

	const closeBudget = useCallback(
		async (budgetId: number) => {
			setActionLoading(true)
			try {
				const closed = await apiCloseBudget(budgetId)
				const mapped = mapBudget(closed)
				upsertBudget(mapped)
				setError(null)
				void fetchBudgets().catch(() => undefined)
				return mapped
			} catch (err) {
				const message = err instanceof Error ? err.message : 'Не удалось закрыть бюджет'
				setError(message)
				throw err
			} finally {
				setActionLoading(false)
			}
		},
		[fetchBudgets, upsertBudget]
	)

	const deleteBudget = useCallback(
		async (budgetId: number) => {
			setActionLoading(true)
			try {
				await apiDeleteBudget(budgetId)
				removeBudget(budgetId)
				setError(null)
			} catch (err) {
				const message = err instanceof Error ? err.message : 'Не удалось удалить бюджет'
				setError(message)
				throw err
			} finally {
				setActionLoading(false)
			}
		},
		[removeBudget]
	)

	const openBudget = useCallback(
		async (budgetId: number) => {
			setActionLoading(true)
			try {
				const reopened = await apiOpenBudget(budgetId)
				const mapped = mapBudget(reopened)
				upsertBudget(mapped)
				setError(null)
				void fetchBudgets().catch(() => undefined)
				return mapped
			} catch (err) {
				const message = err instanceof Error ? err.message : 'Не удалось открыть бюджет'
				setError(message)
				throw err
			} finally {
				setActionLoading(false)
			}
		},
		[fetchBudgets, upsertBudget]
	)

	const clearBudgets = useCallback(() => {
		clearStore()
		setError(null)
	}, [clearStore])

	const isBusy = useMemo(() => loading || actionLoading, [loading, actionLoading])

	return {
		budgets,
		loading,
		actionLoading,
		isBusy,
		error,
		fetchBudgets,
		fetchBudgetsRaw,
		createBudget,
		updateBudget,
		closeBudget,
		openBudget,
		deleteBudget,
		clearBudgets,
	}
}

export default useBudgets
