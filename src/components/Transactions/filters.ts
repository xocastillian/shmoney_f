export type TransactionFilterType = '' | 'EXPENSE' | 'INCOME' | 'TRANSFER'

export type TransactionPeriodFilter = '' | 'TODAY' | 'LAST_7_DAYS' | 'LAST_MONTH' | 'LAST_6_MONTHS' | 'LAST_YEAR'

export const periodOptions: Array<{ value: TransactionPeriodFilter; label: string }> = [
	{ value: '', label: 'Выбрать период' },
	{ value: 'TODAY', label: 'Сегодня' },
	{ value: 'LAST_7_DAYS', label: 'Последние 7 дней' },
	{ value: 'LAST_MONTH', label: 'Последний месяц' },
	{ value: 'LAST_6_MONTHS', label: 'Последние 6 месяцев' },
	{ value: 'LAST_YEAR', label: 'Последний год' },
]

export interface TransactionsFilterState {
	type: TransactionFilterType
	from: string
	to: string
	period: TransactionPeriodFilter
	walletId: number | null
	categoryId: number | null
}
