import { useCallback, useMemo, useState } from 'react'
import { createWallet as apiCreateWallet, deleteWallet as apiDeleteWallet, listWallets } from '@api/client'
import type { WalletCreateRequest, WalletResponse } from '@api/types'
import { useWalletsStore } from '@/store/walletsStore'
import type { Wallet } from '@/types/entities/wallet'

function mapWallet(response: WalletResponse): Wallet {
	return {
		id: response.id,
		name: response.name,
		currencyCode: response.currencyCode,
		balance: response.balance,
		color: response.color,
	}
}

export function useWallets() {
	const wallets = useWalletsStore(state => state.wallets)
	const loading = useWalletsStore(state => state.loading)
	const setWallets = useWalletsStore(state => state.setWallets)
	const addWallet = useWalletsStore(state => state.addWallet)
	const removeWallet = useWalletsStore(state => state.removeWallet)
	const setLoading = useWalletsStore(state => state.setLoading)
	const clearWalletsStore = useWalletsStore(state => state.clear)

	const clearWallets = useCallback(() => {
		clearWalletsStore()
		setError(null)
	}, [clearWalletsStore])

	const [error, setError] = useState<string | null>(null)
	const [actionLoading, setActionLoading] = useState(false)

	const fetchWallets = useCallback(async () => {
		setLoading(true)
		try {
			const data = await listWallets()
			const mapped = data.map(mapWallet)
			setWallets(mapped)
			setError(null)
			return mapped
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Не удалось загрузить кошельки'
			setError(message)
			throw err
		} finally {
			setLoading(false)
		}
	}, [setLoading, setWallets])

	const createWallet = useCallback(
		async (payload: WalletCreateRequest) => {
			setActionLoading(true)
			try {
				const created = await apiCreateWallet(payload)
				const mapped = mapWallet(created)
				addWallet(mapped)
				setError(null)
				return mapped
			} catch (err) {
				const message = err instanceof Error ? err.message : 'Не удалось создать кошелёк'
				setError(message)
				throw err
			} finally {
				setActionLoading(false)
			}
		},
		[addWallet]
	)

	const deleteWallet = useCallback(
		async (walletId: number) => {
			setActionLoading(true)
			try {
				await apiDeleteWallet(walletId)
				removeWallet(walletId)
				setError(null)
			} catch (err) {
				const message = err instanceof Error ? err.message : 'Не удалось удалить кошелёк'
				setError(message)
				throw err
			} finally {
				setActionLoading(false)
			}
		},
		[removeWallet]
	)

	const isBusy = useMemo(() => loading || actionLoading, [loading, actionLoading])

	return {
		wallets,
		loading,
		actionLoading,
		isBusy,
		error,
		fetchWallets,
		clearWallets,
		createWallet,
		deleteWallet,
	}
}
