export type TransactionFilterType = '' | 'EXPENSE' | 'INCOME' | 'TRANSFER'

export type TransactionPeriodFilter = '' | 'TODAY' | 'LAST_7_DAYS' | 'LAST_MONTH' | 'LAST_6_MONTHS' | 'LAST_YEAR'

export const periodOptions: Array<{ value: TransactionPeriodFilter; labelKey: string }> = [
	{ value: '', labelKey: 'transactions.filters.period.pick' },
	{ value: 'TODAY', labelKey: 'transactions.filters.period.today' },
	{ value: 'LAST_7_DAYS', labelKey: 'transactions.filters.period.last7Days' },
	{ value: 'LAST_MONTH', labelKey: 'transactions.filters.period.lastMonth' },
	{ value: 'LAST_6_MONTHS', labelKey: 'transactions.filters.period.last6Months' },
	{ value: 'LAST_YEAR', labelKey: 'transactions.filters.period.lastYear' },
]

export interface TransactionsFilterState {
	type: TransactionFilterType
	from: string
	to: string
	period: TransactionPeriodFilter
	walletId: number | null
	categoryId: number | null
}
