export const WalletType = {
	CASH: 'CASH',
	BANK_CARD: 'BANK_CARD',
	SAVINGS_ACCOUNT: 'SAVINGS_ACCOUNT',
	CRYPTO: 'CRYPTO',
	INVESTMENT_ACCOUNT: 'INVESTMENT_ACCOUNT',
} as const

export type WalletType = (typeof WalletType)[keyof typeof WalletType]

export const walletTypeOrder: WalletType[] = [
	WalletType.CASH,
	WalletType.BANK_CARD,
	WalletType.SAVINGS_ACCOUNT,
	WalletType.CRYPTO,
	WalletType.INVESTMENT_ACCOUNT,
]

export const walletTypeLabels: Record<WalletType, string> = {
	[WalletType.CASH]: 'Наличные',
	[WalletType.BANK_CARD]: 'Банковская карта',
	[WalletType.SAVINGS_ACCOUNT]: 'Накопительный счёт',
	[WalletType.CRYPTO]: 'Криптокошелёк',
	[WalletType.INVESTMENT_ACCOUNT]: 'Инвестиционный счёт',
}

export type Wallet = {
	id: number
	name: string
	currencyCode: string
	balance: number
	color: string
	type: WalletType
}

export type WalletBalanceSummary = {
	currencyCode: string
	totalBalance: number
}
