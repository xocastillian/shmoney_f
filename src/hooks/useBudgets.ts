import { useCallback, useMemo, useState } from 'react'
import { listBudgets, createBudget as apiCreateBudget, updateBudget as apiUpdateBudget, closeBudget as apiCloseBudget } from '@api/client'
import type { BudgetCreateRequest, BudgetResponse, BudgetUpdateRequest } from '@api/types'
import { useBudgetsStore } from '@/store/budgetsStore'
import type { Budget, BudgetStatus } from '@/types/entities/budget'

type BudgetListParams = {
	status?: BudgetStatus
	from?: Date | string
	to?: Date | string
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
		createBudget,
		updateBudget,
		closeBudget,
		clearBudgets,
	}
}

export default useBudgets
