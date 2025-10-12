import { WalletType } from '@/types/entities/wallet'
import { Bitcoin, ChartLine, CreditCard, PiggyBank, Wallet as WalletIcon } from 'lucide-react'
import type { ComponentType } from 'react'
import dirhamIcon from '@/assets/currencyIcons/currency-dirham.svg'
import dollarIcon from '@/assets/currencyIcons/currency-dollar.svg'
import euroIcon from '@/assets/currencyIcons/currency-euro.svg'
import tengeIcon from '@/assets/currencyIcons/currency-tenge.svg'
import yuanIcon from '@/assets/currencyIcons/currency-yuan.svg'

export interface CurrencyOption {
	value: string
	label: string
}

export const typeIcons: Record<WalletType, ComponentType<{ className?: string }>> = {
	[WalletType.CASH]: WalletIcon,
	[WalletType.BANK_CARD]: CreditCard,
	[WalletType.SAVINGS_ACCOUNT]: PiggyBank,
	[WalletType.CRYPTO]: Bitcoin,
	[WalletType.INVESTMENT_ACCOUNT]: ChartLine,
}

export const currencyIconMap: Record<string, string> = {
	USD: dollarIcon,
	KZT: tengeIcon,
	EUR: euroIcon,
	CNY: yuanIcon,
	AED: dirhamIcon,
}
