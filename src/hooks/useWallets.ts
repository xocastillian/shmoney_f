import { useCallback, useMemo, useState } from 'react'
import {
	createWallet as apiCreateWallet,
	listWallets,
	listWalletBalances,
	updateWallet as apiUpdateWallet,
	updateWalletStatus as apiUpdateWalletStatus,
} from '@api/client'
import type { WalletBalanceResponse, WalletCreateRequest, WalletResponse, WalletStatusUpdateRequest, WalletUpdateRequest } from '@api/types'
import { useWalletsStore } from '@/store/walletsStore'
import type { Wallet, WalletBalanceSummary } from '@/types/entities/wallet'

function mapWallet(response: WalletResponse): Wallet {
	return {
		id: response.id,
		name: response.name,
		currencyCode: response.currencyCode,
		balance: response.balance,
		color: response.color,
		type: response.type,
		status: response.status,
		debetOrCredit: response.debetOrCredit,
	}
}

function mapWalletBalance(response: WalletBalanceResponse): WalletBalanceSummary {
	return {
		currencyCode: response.currencyCode,
		totalBalance: response.totalBalance,
	}
}

export function useWallets() {
	const wallets = useWalletsStore(state => state.wallets)
	const loading = useWalletsStore(state => state.loading)
	const balances = useWalletsStore(state => state.balances)
	const balancesLoading = useWalletsStore(state => state.balancesLoading)
	const setWallets = useWalletsStore(state => state.setWallets)
	const addWallet = useWalletsStore(state => state.addWallet)
	const updateWalletStatusInStore = useWalletsStore(state => state.updateWalletStatus)
	const setLoading = useWalletsStore(state => state.setLoading)
	const setBalances = useWalletsStore(state => state.setBalances)
	const setBalancesLoading = useWalletsStore(state => state.setBalancesLoading)
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

	const fetchWalletBalances = useCallback(async () => {
		setBalancesLoading(true)
		try {
			const data = await listWalletBalances()
			const mapped = data.map(mapWalletBalance)
			setBalances(mapped)
			setError(null)
			return mapped
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Не удалось загрузить балансы кошельков'
			setError(message)
			throw err
		} finally {
			setBalancesLoading(false)
		}
	}, [setBalances, setBalancesLoading])

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

	const isBusy = useMemo(() => loading || actionLoading, [loading, actionLoading])

	const updateWallet = useCallback(
		async (walletId: number, payload: WalletUpdateRequest) => {
			setActionLoading(true)
			try {
				const updated = await apiUpdateWallet(walletId, payload)
				const mapped = mapWallet(updated)
				addWallet(mapped)
				setError(null)
				return mapped
			} catch (err) {
				const message = err instanceof Error ? err.message : 'Не удалось обновить кошелёк'
				setError(message)
				throw err
			} finally {
				setActionLoading(false)
			}
		},
		[addWallet]
	)

	const updateWalletStatus = useCallback(
		async (walletId: number, payload: WalletStatusUpdateRequest) => {
			setActionLoading(true)
			try {
				const updated = await apiUpdateWalletStatus(walletId, payload)
				const mapped = mapWallet(updated)
				updateWalletStatusInStore(walletId, mapped.status)
				setError(null)
				return mapped
			} catch (err) {
				const message = err instanceof Error ? err.message : 'Не удалось обновить статус кошелька'
				setError(message)
				throw err
			} finally {
				setActionLoading(false)
			}
		},
		[updateWalletStatusInStore]
	)

	return {
		wallets,
		loading,
		balances,
		balancesLoading,
		actionLoading,
		isBusy,
		error,
		fetchWallets,
		fetchWalletBalances,
		clearWallets,
		createWallet,
		updateWallet,
		updateWalletStatus,
	}
}
