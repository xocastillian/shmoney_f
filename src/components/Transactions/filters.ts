export type TransactionFilterType = '' | 'EXPENSE' | 'INCOME' | 'TRANSFER'

export interface TransactionsFilterState {
	type: TransactionFilterType
	from: string
	to: string
}
