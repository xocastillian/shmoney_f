import { create } from 'zustand'
import type { DebtCounterparty, DebtSummary, DebtTransaction } from '@/types/entities/debt'

const initialMeta = { count: 0, next: null as number | null, previous: null as number | null }

interface DebtsState {
	counterparties: DebtCounterparty[]
	transactions: DebtTransaction[]
	transactionsMeta: typeof initialMeta
	summary: DebtSummary | null
	counterpartiesLoading: boolean
	transactionsLoading: boolean
	summaryLoading: boolean
	counterpartiesError: string | null
	transactionsError: string | null
	summaryError: string | null
	setCounterparties: (counterparties: DebtCounterparty[]) => void
	upsertCounterparty: (counterparty: DebtCounterparty) => void
	setTransactions: (transactions: DebtTransaction[], meta?: Partial<typeof initialMeta>) => void
	appendTransactions: (transactions: DebtTransaction[], meta?: Partial<typeof initialMeta>) => void
	upsertTransaction: (transaction: DebtTransaction) => void
	removeTransaction: (transactionId: number) => void
	setSummary: (summary: DebtSummary | null) => void
	setCounterpartiesLoading: (loading: boolean) => void
	setTransactionsLoading: (loading: boolean) => void
	setSummaryLoading: (loading: boolean) => void
	setCounterpartiesError: (error: string | null) => void
	setTransactionsError: (error: string | null) => void
	setSummaryError: (error: string | null) => void
	clearAll: () => void
}

export const useDebtsStore = create<DebtsState>(set => ({
	counterparties: [],
	transactions: [],
	transactionsMeta: initialMeta,
	summary: null,
	counterpartiesLoading: false,
	transactionsLoading: false,
	summaryLoading: false,
	counterpartiesError: null,
	transactionsError: null,
	summaryError: null,
	setCounterparties: counterparties => set({ counterparties }),
	upsertCounterparty: counterparty =>
		set(state => {
			const exists = state.counterparties.some(item => item.id === counterparty.id)
			return {
				counterparties: exists
					? state.counterparties.map(item => (item.id === counterparty.id ? counterparty : item))
					: [...state.counterparties, counterparty],
			}
		}),
	setTransactions: (transactions, meta) =>
		set({
			transactions,
			transactionsMeta: {
				count: meta?.count ?? initialMeta.count,
				next: meta?.next ?? initialMeta.next,
				previous: meta?.previous ?? initialMeta.previous,
			},
		}),
	appendTransactions: (transactions, meta) =>
		set(state => {
			const merged = [...state.transactions]
			for (const transaction of transactions) {
				const existingIndex = merged.findIndex(item => item.id === transaction.id)
				if (existingIndex >= 0) {
					merged[existingIndex] = transaction
				} else {
					merged.push(transaction)
				}
			}
			return {
				transactions: merged,
				transactionsMeta: {
					count: meta?.count ?? state.transactionsMeta.count,
					next: meta?.next ?? state.transactionsMeta.next,
					previous: meta?.previous ?? state.transactionsMeta.previous,
				},
			}
		}),
	upsertTransaction: transaction =>
		set(state => ({
			transactions: state.transactions.some(item => item.id === transaction.id)
				? state.transactions.map(item => (item.id === transaction.id ? transaction : item))
				: [transaction, ...state.transactions],
		})),
	removeTransaction: transactionId =>
		set(state => ({
			transactions: state.transactions.filter(item => item.id !== transactionId),
		})),
	setSummary: summary => set({ summary }),
	setCounterpartiesLoading: counterpartiesLoading => set({ counterpartiesLoading }),
	setTransactionsLoading: transactionsLoading => set({ transactionsLoading }),
	setSummaryLoading: summaryLoading => set({ summaryLoading }),
	setCounterpartiesError: counterpartiesError => set({ counterpartiesError }),
	setTransactionsError: transactionsError => set({ transactionsError }),
	setSummaryError: summaryError => set({ summaryError }),
	clearAll: () =>
		set({
			counterparties: [],
			transactions: [],
			transactionsMeta: initialMeta,
			summary: null,
			counterpartiesLoading: false,
			transactionsLoading: false,
			summaryLoading: false,
			counterpartiesError: null,
			transactionsError: null,
			summaryError: null,
		}),
}))
