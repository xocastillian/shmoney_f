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
	[WalletType.CASH]: 'wallets.form.type.cash',
	[WalletType.BANK_CARD]: 'wallets.form.type.bankCard',
	[WalletType.SAVINGS_ACCOUNT]: 'wallets.form.type.savingsAccount',
	[WalletType.CRYPTO]: 'wallets.form.type.crypto',
	[WalletType.INVESTMENT_ACCOUNT]: 'wallets.form.type.investmentAccount',
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
