import { create } from 'zustand'
import type { Budget } from '@/types/entities/budget'

interface BudgetsState {
	budgets: Budget[]
	loading: boolean
	setBudgets: (budgets: Budget[]) => void
	upsertBudget: (budget: Budget) => void
	setLoading: (loading: boolean) => void
	clear: () => void
}

export const useBudgetsStore = create<BudgetsState>(set => ({
	budgets: [],
	loading: false,
	setBudgets: budgets => set({ budgets }),
	upsertBudget: budget =>
		set(state => {
			const exists = state.budgets.some(b => b.id === budget.id)
			return {
				budgets: exists ? state.budgets.map(b => (b.id === budget.id ? budget : b)) : [...state.budgets, budget],
			}
		}),
	setLoading: loading => set({ loading }),
	clear: () => set({ budgets: [], loading: false }),
}))
