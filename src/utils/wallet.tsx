import type { ReactNode } from 'react'
import { Wallet as WalletIcon } from 'lucide-react'
import type { Wallet, WalletType } from '@/types/entities/wallet'
import { typeIcons } from '@/widgets/Wallets/types'

export interface WalletPickerOption {
	id: number
	name: string
	color?: string | null
	type?: WalletType | null
	status?: Wallet['status']
}

const defaultIconClassName = 'mr-3 h-6 w-6'

export const getWalletIcon = (wallet: { color?: string | null; type?: WalletType | null } | null | undefined): ReactNode => {
	if (!wallet) return undefined

	const IconComponent = wallet.type ? typeIcons[wallet.type] ?? WalletIcon : WalletIcon
	const className = wallet.color ? defaultIconClassName : `${defaultIconClassName} text-label`
	const style = wallet.color ? { color: wallet.color } : undefined

	return <IconComponent className={className} style={style} />
}

export const toWalletPickerOption = (wallet: Wallet): WalletPickerOption => ({
	id: wallet.id,
	name: wallet.name,
	color: wallet.color,
	type: wallet.type,
	status: wallet.status,
})

export const mapWalletsToPickerOptions = (wallets: readonly Wallet[]): WalletPickerOption[] => wallets.map(toWalletPickerOption)
