import { useCallback, useState } from 'react'
import { createTransaction as apiCreateTransaction } from '@api/client'
import type { WalletTransactionRequest } from '@api/types'

export function useCreateTransaction() {
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)

	const createTransaction = useCallback(async (payload: WalletTransactionRequest) => {
		setLoading(true)
		try {
			const response = await apiCreateTransaction(payload)
			setError(null)
			return response
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Не удалось создать транзакцию'
			setError(message)
			throw err
		} finally {
			setLoading(false)
		}
	}, [])

	const clearError = useCallback(() => setError(null), [])

	return {
		createTransaction,
		loading,
		error,
		clearError,
	}
}

export default useCreateTransaction
