export interface AnalyticsCategorySummary {
	categoryId: number
	categoryName: string
	categoryColor: string
	amount: number
	percent: number
	transactionCount?: number
	categoryIcon?: string
}

export interface AnalyticsPeriod {
	from: Date
	to: Date
}

export interface Analytics {
	period: AnalyticsPeriod
	currencyCode: string
	totalExpense: number
	totalIncome: number
	cashFlowAmount: number
	cashFlowPercent: number
	totalExpenseTransactions?: number
	categories: AnalyticsCategorySummary[]
	topCategories: AnalyticsCategorySummary[]
}
