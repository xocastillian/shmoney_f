import { useCallback, useMemo, useState } from 'react'
import {
	archiveDebtCounterparty,
	createDebtCounterparty,
	createDebtTransaction,
	deleteDebtTransaction,
	getDebtCounterparty,
	getDebtSummary,
	getDebtTransaction,
	listDebtCounterparties,
	listDebtHistory,
	listDebtTransactions,
	updateDebtTransaction,
	restoreDebtCounterparty,
	updateDebtCounterparty,
} from '@api/client'
import type {
	DebtCounterpartyCreateRequest,
	DebtCounterpartyResponse,
	DebtCounterpartyUpdateRequest,
	DebtSummaryResponse,
	DebtTransactionCreateRequest,
	DebtTransactionUpdateRequest,
	DebtTransactionResponse,
} from '@api/types'
import { useDebtsStore } from '@/store/debtsStore'
import type { DebtCounterparty, DebtCounterpartyStatus, DebtSummary, DebtTransaction, DebtTransactionDirection } from '@/types/entities/debt'

function mapCounterparty(response: DebtCounterpartyResponse): DebtCounterparty {
	return {
		id: response.id,
		name: response.name,
		color: response.color ?? null,
		currencyCode: response.currencyCode,
		owedToMe: response.owedToMe,
		iOwe: response.iOwe,
		status: response.status,
		createdAt: response.createdAt ?? null,
		updatedAt: response.updatedAt ?? null,
	}
}

function mapTransaction(response: DebtTransactionResponse): DebtTransaction {
	return {
		id: response.id,
		counterpartyId: response.counterpartyId,
		counterpartyName: response.counterpartyName,
		walletId: response.walletId,
		direction: response.direction,
		amount: response.amount,
		currencyCode: response.currencyCode,
		description: response.description ?? null,
		occurredAt: response.occurredAt,
		createdAt: response.createdAt ?? null,
	}
}

function mapSummary(response: DebtSummaryResponse): DebtSummary {
	return {
		currencyCode: response.currencyCode,
		totalOwedToMe: response.totalOwedToMe,
		totalIOwe: response.totalIOwe,
		counterparties: response.counterparties.map(item => ({
			id: item.id,
			name: item.name,
			owedToMe: item.owedToMe,
			iOwe: item.iOwe,
			owedToMeShare: item.owedToMeShare,
			iOweShare: item.iOweShare,
		})),
	}
}

export function useDebts() {
	const {
		counterparties,
		transactions,
		transactionsMeta,
		summary,
		counterpartiesLoading,
		transactionsLoading,
		summaryLoading,
		counterpartiesError,
		transactionsError,
		summaryError,
		setCounterparties,
		upsertCounterparty,
		setTransactions,
		appendTransactions,
		upsertTransaction,
		removeTransaction,
		setSummary,
		setCounterpartiesLoading,
		setTransactionsLoading,
		setSummaryLoading,
		setCounterpartiesError,
		setTransactionsError,
		setSummaryError,
		clearAll,
	} = useDebtsStore()

	const [actionLoading, setActionLoading] = useState(false)

	const fetchCounterparties = useCallback(
		async (params?: { status?: DebtCounterpartyStatus }) => {
			setCounterpartiesLoading(true)
			try {
				const data = await listDebtCounterparties(params)
				const mapped = data.map(mapCounterparty)
				setCounterparties(mapped)
				setCounterpartiesError(null)
				return mapped
			} catch (error) {
				const message = error instanceof Error ? error.message : 'Не удалось загрузить контрагентов'
				setCounterpartiesError(message)
				throw error
			} finally {
				setCounterpartiesLoading(false)
			}
		},
		[setCounterparties, setCounterpartiesLoading, setCounterpartiesError],
	)

	const fetchCounterparty = useCallback(async (id: number) => {
		const data = await getDebtCounterparty(id)
		return mapCounterparty(data)
	}, [])

	const createCounterparty = useCallback(
		async (payload: DebtCounterpartyCreateRequest) => {
			setActionLoading(true)
			try {
				const created = await createDebtCounterparty(payload)
				const mapped = mapCounterparty(created)
				upsertCounterparty(mapped)
				setCounterpartiesError(null)
				return mapped
			} catch (error) {
				const message = error instanceof Error ? error.message : 'Не удалось создать контрагента'
				setCounterpartiesError(message)
				throw error
			} finally {
				setActionLoading(false)
			}
		},
		[upsertCounterparty, setCounterpartiesError],
	)

	const updateCounterparty = useCallback(
		async (id: number, payload: DebtCounterpartyUpdateRequest) => {
			setActionLoading(true)
			try {
				const updated = await updateDebtCounterparty(id, payload)
				const mapped = mapCounterparty(updated)
				upsertCounterparty(mapped)
				setCounterpartiesError(null)
				return mapped
			} catch (error) {
				const message = error instanceof Error ? error.message : 'Не удалось обновить контрагента'
				setCounterpartiesError(message)
				throw error
			} finally {
				setActionLoading(false)
			}
		},
		[upsertCounterparty, setCounterpartiesError],
	)

	const archiveCounterparty = useCallback(
		async (id: number) => {
			setActionLoading(true)
			try {
				const archived = await archiveDebtCounterparty(id)
				const mapped = mapCounterparty(archived)
				upsertCounterparty(mapped)
				setCounterpartiesError(null)
				return mapped
			} catch (error) {
				const message = error instanceof Error ? error.message : 'Не удалось архивировать контрагента'
				setCounterpartiesError(message)
				throw error
			} finally {
				setActionLoading(false)
			}
		},
		[upsertCounterparty, setCounterpartiesError],
	)

	const restoreCounterparty = useCallback(
		async (id: number) => {
			setActionLoading(true)
			try {
				const restored = await restoreDebtCounterparty(id)
				const mapped = mapCounterparty(restored)
				upsertCounterparty(mapped)
				setCounterpartiesError(null)
				return mapped
			} catch (error) {
				const message = error instanceof Error ? error.message : 'Не удалось восстановить контрагента'
				setCounterpartiesError(message)
				throw error
			} finally {
				setActionLoading(false)
			}
		},
		[upsertCounterparty, setCounterpartiesError],
	)

	const fetchTransactions = useCallback(
		async (
			params?: {
				page?: number
				size?: number
				counterpartyId?: number
				direction?: DebtTransactionDirection
				from?: Date | string
				to?: Date | string
			},
			options?: { append?: boolean },
		) => {
			const skipGlobalLoading = Boolean(options?.append)
			if (!skipGlobalLoading) {
				setTransactionsLoading(true)
			}
			try {
				const page = await listDebtTransactions(params)
				const mapped = page.results.map(mapTransaction)
				const meta = { count: page.count, next: page.next ?? null, previous: page.previous ?? null }
				if (options?.append) {
					appendTransactions(mapped, meta)
				} else {
					setTransactions(mapped, meta)
				}
				setTransactionsError(null)
				return mapped
			} catch (error) {
				const message = error instanceof Error ? error.message : 'Не удалось загрузить операции'
				setTransactionsError(message)
				throw error
			} finally {
				if (!skipGlobalLoading) {
					setTransactionsLoading(false)
				}
			}
		},
		[appendTransactions, setTransactions, setTransactionsLoading, setTransactionsError],
	)

	const fetchHistory = useCallback(
		async (
			params?: {
				page?: number
				size?: number
				counterpartyId?: number
				direction?: DebtTransactionDirection
				from?: Date | string
				to?: Date | string
			},
			options?: { append?: boolean },
		) => {
			const skipGlobalLoading = Boolean(options?.append)
			if (!skipGlobalLoading) {
				setTransactionsLoading(true)
			}
			try {
				const page = await listDebtHistory(params)
				const mapped = page.results.map(mapTransaction)
				const meta = { count: page.count, next: page.next ?? null, previous: page.previous ?? null }
				if (options?.append) {
					appendTransactions(mapped, meta)
				} else {
					setTransactions(mapped, meta)
				}
				setTransactionsError(null)
				return mapped
			} catch (error) {
				const message = error instanceof Error ? error.message : 'Не удалось загрузить историю'
				setTransactionsError(message)
				throw error
			} finally {
				if (!skipGlobalLoading) {
					setTransactionsLoading(false)
				}
			}
		},
		[appendTransactions, setTransactions, setTransactionsLoading, setTransactionsError],
	)

	const createTransaction = useCallback(
		async (payload: DebtTransactionCreateRequest) => {
			setActionLoading(true)
			try {
				const created = await createDebtTransaction(payload)
				const mapped = mapTransaction(created)
				upsertTransaction(mapped)
				setTransactionsError(null)
				return mapped
			} catch (error) {
				const message = error instanceof Error ? error.message : 'Не удалось создать операцию'
				setTransactionsError(message)
				throw error
			} finally {
				setActionLoading(false)
			}
		},
		[upsertTransaction, setTransactionsError],
	)

	const updateTransaction = useCallback(
		async (id: number, payload: DebtTransactionUpdateRequest) => {
			setActionLoading(true)
			try {
				const updated = await updateDebtTransaction(id, payload)
				const mapped = mapTransaction(updated)
				upsertTransaction(mapped)
				setTransactionsError(null)
				return mapped
			} catch (error) {
				const message = error instanceof Error ? error.message : 'Не удалось обновить операцию'
				setTransactionsError(message)
				throw error
			} finally {
				setActionLoading(false)
			}
		},
		[upsertTransaction, setTransactionsError],
	)

	const deleteTransaction = useCallback(
		async (id: number) => {
			setActionLoading(true)
			try {
				await deleteDebtTransaction(id)
				removeTransaction(id)
				setTransactionsError(null)
			} catch (error) {
				const message = error instanceof Error ? error.message : 'Не удалось удалить операцию'
				setTransactionsError(message)
				throw error
			} finally {
				setActionLoading(false)
			}
		},
		[removeTransaction, setTransactionsError],
	)

	const fetchTransaction = useCallback(async (id: number) => {
		const data = await getDebtTransaction(id)
		return mapTransaction(data)
	}, [])


	const fetchSummary = useCallback(async () => {
		setSummaryLoading(true)
		try {
			const data = await getDebtSummary()
			const mapped = mapSummary(data)
			setSummary(mapped)
			setSummaryError(null)
			return mapped
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Не удалось загрузить сводку'
			setSummaryError(message)
			throw error
		} finally {
			setSummaryLoading(false)
		}
	}, [setSummary, setSummaryLoading, setSummaryError])

	const clearDebts = useCallback(() => {
		clearAll()
		setCounterpartiesError(null)
		setTransactionsError(null)
		setSummaryError(null)
	}, [clearAll, setCounterpartiesError, setSummaryError, setTransactionsError])

	const isBusy = useMemo(
		() => counterpartiesLoading || transactionsLoading || summaryLoading || actionLoading,
		[counterpartiesLoading, transactionsLoading, summaryLoading, actionLoading],
	)

	return {
		counterparties,
		transactions,
		transactionsMeta,
		summary,
		counterpartiesLoading,
		transactionsLoading,
		summaryLoading,
		actionLoading,
		isBusy,
		counterpartiesError,
		transactionsError,
		summaryError,
		fetchCounterparties,
		fetchCounterparty,
		createCounterparty,
		updateCounterparty,
		archiveCounterparty,
		restoreCounterparty,
		fetchTransactions,
		fetchHistory,
		createTransaction,
		updateTransaction,
		deleteTransaction,
		fetchTransaction,
		fetchSummary,
		clearDebts,
	}
}

export default useDebts
