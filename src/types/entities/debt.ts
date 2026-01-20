export const DebtCounterpartyStatus = {
	ACTIVE: 'ACTIVE',
	ARCHIVED: 'ARCHIVED',
} as const

export type DebtCounterpartyStatus = (typeof DebtCounterpartyStatus)[keyof typeof DebtCounterpartyStatus]

export const DebtTransactionDirection = {
	LENT: 'LENT',
	BORROWED: 'BORROWED',
} as const

export type DebtTransactionDirection = (typeof DebtTransactionDirection)[keyof typeof DebtTransactionDirection]

export type DebtCounterparty = {
	id: number
	name: string
	color: string | null
	currencyCode: string
	owedToMe: number
	iOwe: number
	status: DebtCounterpartyStatus
	createdAt: Date | null
	updatedAt: Date | null
}

export type DebtTransaction = {
	id: number
	counterpartyId: number
	counterpartyName: string
	walletId: number
	direction: DebtTransactionDirection
	amount: number
	currencyCode: string
	description: string | null
	occurredAt: Date
	createdAt: Date | null
}

export type DebtCounterpartySummary = {
	id: number
	name: string
	owedToMe: number
	iOwe: number
	owedToMeShare: number
	iOweShare: number
}

export type DebtSummary = {
	currencyCode: string
	totalOwedToMe: number
	totalIOwe: number
	counterparties: DebtCounterpartySummary[]
}
