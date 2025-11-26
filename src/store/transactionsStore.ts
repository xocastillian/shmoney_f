import { create } from 'zustand'
import type { WalletTransactionResponse, CategoryTransactionResponse, TransactionFeedItem } from '@api/types'

const initialFeedMeta = { count: 0, next: null as number | null, previous: null as number | null }

interface TransactionsState {
	walletTransactions: WalletTransactionResponse[]
	categoryTransactions: CategoryTransactionResponse[]
	feed: TransactionFeedItem[]
	feedMeta: typeof initialFeedMeta
	walletLoading: boolean
	categoryLoading: boolean
	feedLoading: boolean
	walletError: string | null
	categoryError: string | null
	feedError: string | null
	setWalletTransactions: (transactions: WalletTransactionResponse[]) => void
	upsertWalletTransaction: (transaction: WalletTransactionResponse) => void
	removeWalletTransaction: (transactionId: number) => void
	setCategoryTransactions: (transactions: CategoryTransactionResponse[]) => void
	upsertCategoryTransaction: (transaction: CategoryTransactionResponse) => void
	removeCategoryTransaction: (transactionId: number) => void
	setFeed: (items: TransactionFeedItem[], meta?: Partial<typeof initialFeedMeta>) => void
	setWalletLoading: (loading: boolean) => void
	setCategoryLoading: (loading: boolean) => void
	setFeedLoading: (loading: boolean) => void
	setWalletError: (error: string | null) => void
	setCategoryError: (error: string | null) => void
	setFeedError: (error: string | null) => void
	clearAll: () => void
}

export const useTransactionsStore = create<TransactionsState>(set => ({
	walletTransactions: [],
	categoryTransactions: [],
	feed: [],
	feedMeta: initialFeedMeta,
	walletLoading: false,
	categoryLoading: false,
	feedLoading: false,
	walletError: null,
	categoryError: null,
	feedError: null,
	setWalletTransactions: transactions => set({ walletTransactions: transactions }),
	upsertWalletTransaction: transaction =>
		set(state => ({
			walletTransactions: state.walletTransactions.some(t => t.id === transaction.id)
				? state.walletTransactions.map(t => (t.id === transaction.id ? transaction : t))
				: [transaction, ...state.walletTransactions],
		})),
	removeWalletTransaction: transactionId =>
		set(state => ({
			walletTransactions: state.walletTransactions.filter(t => t.id !== transactionId),
		})),
	setCategoryTransactions: transactions => set({ categoryTransactions: transactions }),
	upsertCategoryTransaction: transaction =>
		set(state => ({
			categoryTransactions: state.categoryTransactions.some(t => t.id === transaction.id)
				? state.categoryTransactions.map(t => (t.id === transaction.id ? transaction : t))
				: [transaction, ...state.categoryTransactions],
		})),
	removeCategoryTransaction: transactionId =>
		set(state => ({
			categoryTransactions: state.categoryTransactions.filter(t => t.id !== transactionId),
		})),
	setFeed: (items, meta) =>
		set({
			feed: items,
			feedMeta: {
				count: meta?.count ?? initialFeedMeta.count,
				next: meta?.next ?? initialFeedMeta.next,
				previous: meta?.previous ?? initialFeedMeta.previous,
			},
		}),
	setWalletLoading: walletLoading => set({ walletLoading }),
	setCategoryLoading: categoryLoading => set({ categoryLoading }),
	setFeedLoading: feedLoading => set({ feedLoading }),
	setWalletError: walletError => set({ walletError }),
	setCategoryError: categoryError => set({ categoryError }),
	setFeedError: feedError => set({ feedError }),
	clearAll: () =>
		set({
			walletTransactions: [],
			categoryTransactions: [],
			feed: [],
			feedMeta: initialFeedMeta,
			walletLoading: false,
			categoryLoading: false,
			feedLoading: false,
			walletError: null,
			categoryError: null,
			feedError: null,
		}),
}))
