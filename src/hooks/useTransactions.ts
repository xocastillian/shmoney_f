import { useCallback } from 'react'
import {
	createWalletTransaction,
	deleteWalletTransaction,
	getTransactionFeed,
	listCategoryTransactions,
	listWalletTransactions,
	updateWalletTransaction,
	createCategoryTransaction,
	getWalletTransaction,
	getCategoryTransaction,
	updateCategoryTransaction,
	deleteCategoryTransaction,
} from '@api/client'
import type {
	WalletTransactionRequest,
	WalletTransactionUpdateRequest,
	CategoryTransactionCreateRequest,
	CategoryTransactionUpdateRequest,
} from '@api/types'
import { useTransactionsStore } from '@/store/transactionsStore'

const getErrorMessage = (error: unknown) => (error instanceof Error ? error.message : 'Не удалось выполнить запрос')

export function useTransactions() {
	const {
		walletTransactions,
		categoryTransactions,
		feed,
		feedMeta,
		walletLoading,
		categoryLoading,
		feedLoading,
		walletError,
		categoryError,
		feedError,
		setWalletTransactions,
		upsertWalletTransaction,
		removeWalletTransaction,
		setCategoryTransactions,
		upsertCategoryTransaction,
		removeCategoryTransaction,
		setFeed,
		appendFeed,
		setWalletLoading,
		setCategoryLoading,
		setFeedLoading,
		setWalletError,
		setCategoryError,
		setFeedError,
		clearAll,
	} = useTransactionsStore()

	const fetchWalletTransactions = useCallback(
		async (params?: { walletId?: number }) => {
			setWalletLoading(true)
			try {
				const data = await listWalletTransactions(params)
				setWalletTransactions(data)
				setWalletError(null)
				return data
			} catch (error) {
				const message = getErrorMessage(error)
				setWalletError(message)
				throw error
			} finally {
				setWalletLoading(false)
			}
		},
		[setWalletLoading, setWalletTransactions, setWalletError]
	)

	const fetchCategoryTransactions = useCallback(
		async (params?: Parameters<typeof listCategoryTransactions>[0]) => {
			setCategoryLoading(true)
			try {
				const page = await listCategoryTransactions(params)
				setCategoryTransactions(page.results)
				setCategoryError(null)
				return page
			} catch (error) {
				const message = getErrorMessage(error)
				setCategoryError(message)
				throw error
			} finally {
				setCategoryLoading(false)
			}
		},
		[setCategoryLoading, setCategoryTransactions, setCategoryError]
	)

	const fetchTransactionFeed = useCallback(
		async (params?: Parameters<typeof getTransactionFeed>[0], options?: { append?: boolean }) => {
			const skipGlobalLoading = Boolean(options?.append)
			if (!skipGlobalLoading) {
				setFeedLoading(true)
			}
			try {
				const response = await getTransactionFeed(params)
				const meta = {
					count: response.count,
					next: response.next ?? null,
					previous: response.previous ?? null,
				}
				if (options?.append) {
					appendFeed(response.results, meta)
				} else {
					setFeed(response.results, meta)
				}
				setFeedError(null)
				return response
			} catch (error) {
				const message = getErrorMessage(error)
				setFeedError(message)
				throw error
			} finally {
				if (!skipGlobalLoading) {
					setFeedLoading(false)
				}
			}
		},
		[setFeedLoading, setFeed, appendFeed, setFeedError]
	)

	const handleCreateWalletTransaction = useCallback(
		async (payload: WalletTransactionRequest) => {
			const transaction = await createWalletTransaction(payload)
			upsertWalletTransaction(transaction)
			return transaction
		},
		[upsertWalletTransaction]
	)

	const handleUpdateWalletTransaction = useCallback(
		async (id: number, payload: WalletTransactionUpdateRequest) => {
			const transaction = await updateWalletTransaction(id, payload)
			upsertWalletTransaction(transaction)
			return transaction
		},
		[upsertWalletTransaction]
	)

	const handleDeleteWalletTransaction = useCallback(
		async (id: number) => {
			await deleteWalletTransaction(id)
			removeWalletTransaction(id)
		},
		[removeWalletTransaction]
	)

	const handleCreateCategoryTransaction = useCallback(
		async (payload: CategoryTransactionCreateRequest) => {
			const transaction = await createCategoryTransaction(payload)
			upsertCategoryTransaction(transaction)
			return transaction
		},
		[upsertCategoryTransaction]
	)

	const handleUpdateCategoryTransaction = useCallback(
		async (id: number, payload: CategoryTransactionUpdateRequest) => {
			const transaction = await updateCategoryTransaction(id, payload)
			upsertCategoryTransaction(transaction)
			return transaction
		},
		[upsertCategoryTransaction]
	)

	const handleDeleteCategoryTransaction = useCallback(
		async (id: number) => {
			await deleteCategoryTransaction(id)
			removeCategoryTransaction(id)
		},
		[removeCategoryTransaction]
	)

	const handleGetWalletTransaction = useCallback(async (id: number) => getWalletTransaction(id), [])
	const handleGetCategoryTransaction = useCallback(async (id: number) => getCategoryTransaction(id), [])

	return {
		walletTransactions,
		categoryTransactions,
		feed,
		feedMeta,
		walletLoading,
		categoryLoading,
		feedLoading,
		walletError,
		categoryError,
		feedError,
		fetchWalletTransactions,
		fetchCategoryTransactions,
		fetchTransactionFeed,
		createWalletTransaction: handleCreateWalletTransaction,
		updateWalletTransaction: handleUpdateWalletTransaction,
		deleteWalletTransaction: handleDeleteWalletTransaction,
		getWalletTransaction: handleGetWalletTransaction,
		createCategoryTransaction: handleCreateCategoryTransaction,
		updateCategoryTransaction: handleUpdateCategoryTransaction,
		deleteCategoryTransaction: handleDeleteCategoryTransaction,
		getCategoryTransaction: handleGetCategoryTransaction,
		clearTransactions: clearAll,
	}
}

export default useTransactions
