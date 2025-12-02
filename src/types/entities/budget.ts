export const BudgetPeriodType = {
	MONTH: 'MONTH',
	WEEK: 'WEEK',
	YEAR: 'YEAR',
	CUSTOM: 'CUSTOM',
} as const

export type BudgetPeriodType = (typeof BudgetPeriodType)[keyof typeof BudgetPeriodType]

export const BudgetType = {
	ONE_TIME: 'ONE_TIME',
	RECURRING: 'RECURRING',
} as const

export type BudgetType = (typeof BudgetType)[keyof typeof BudgetType]

export const BudgetStatus = {
	ACTIVE: 'ACTIVE',
	CLOSED: 'CLOSED',
} as const

export type BudgetStatus = (typeof BudgetStatus)[keyof typeof BudgetStatus]

export type Budget = {
	id: number
	name: string
	periodType: BudgetPeriodType
	periodStart: Date
	periodEnd: Date
	budgetType: BudgetType
	currencyCode: string
	amountLimit: number
	spentAmount: number
	percentSpent: number
	status: BudgetStatus
	categoryIds: number[]
	closedAt: Date | null
	createdAt: Date | null
	updatedAt: Date | null
}
