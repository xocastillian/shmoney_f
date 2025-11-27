import { create } from 'zustand'
import type { Wallet, WalletBalanceSummary } from '@/types/entities/wallet'

interface WalletsState {
	wallets: Wallet[]
	loading: boolean
	balances: WalletBalanceSummary[]
	balancesLoading: boolean
	setWallets: (wallets: Wallet[]) => void
	addWallet: (wallet: Wallet) => void
	removeWallet: (walletId: number) => void
	setLoading: (loading: boolean) => void
	setBalances: (balances: WalletBalanceSummary[]) => void
	setBalancesLoading: (loading: boolean) => void
	clear: () => void
}

export const useWalletsStore = create<WalletsState>(set => ({
	wallets: [],
	loading: false,
	balances: [],
	balancesLoading: false,
	setWallets: wallets => set({ wallets }),
	addWallet: wallet =>
		set(state => {
			const exists = state.wallets.some(w => w.id === wallet.id)
			return {
				wallets: exists ? state.wallets.map(w => (w.id === wallet.id ? wallet : w)) : [...state.wallets, wallet],
			}
		}),
	removeWallet: walletId => set(state => ({ wallets: state.wallets.filter(w => w.id !== walletId) })),
	setLoading: loading => set({ loading }),
	setBalances: balances => set({ balances }),
	setBalancesLoading: loading => set({ balancesLoading: loading }),
	clear: () => set({ wallets: [], loading: false, balances: [], balancesLoading: false }),
}))
