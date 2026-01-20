import { endpoints } from './endpoints'
import { get, post, patch, del } from './http'
import {
	AuthResponseSchema,
	CurrencyConversionResponseSchema,
	CurrencyResponseSchema,
	ExchangeRateListResponseSchema,
	ExchangeRateResponseSchema,
	TelegramAuthRequestSchema,
	WalletCreateRequestSchema,
	WalletResponseSchema,
	WalletBalanceResponseSchema,
	WalletStatusUpdateRequestSchema,
	WalletTransactionRequestSchema,
	WalletTransactionResponseSchema,
	WalletTransactionUpdateRequestSchema,
	WalletUpdateRequestSchema,
	CategoryResponseSchema,
	CategoryCreateRequestSchema,
	CategoryUpdateRequestSchema,
	CategoryStatusUpdateRequestSchema,
	CategoryTransactionResponseSchema,
	CategoryTransactionCreateRequestSchema,
	CategoryTransactionUpdateRequestSchema,
	CategoryTransactionPageResponseSchema,
	TransactionFeedResponseSchema,
	SettingsResponseSchema,
	SettingsUpdateRequestSchema,
	BudgetResponseSchema,
	BudgetCreateRequestSchema,
	BudgetUpdateRequestSchema,
	AnalyticsResponseSchema,
	DebtCounterpartyResponseSchema,
	DebtCounterpartyCreateRequestSchema,
	DebtCounterpartyUpdateRequestSchema,
	DebtTransactionResponseSchema,
	DebtTransactionCreateRequestSchema,
	DebtTransactionUpdateRequestSchema,
	DebtTransactionPageResponseSchema,
	DebtSummaryResponseSchema,
} from './schemas'
import type {
	AuthResponse,
	CurrencyConversionResponse,
	CurrencyResponse,
	ExchangeRateListResponse,
	ExchangeRateResponse,
	WalletCreateRequest,
	WalletResponse,
	WalletBalanceResponse,
	WalletStatusUpdateRequest,
	WalletTransactionRequest,
	WalletTransactionResponse,
	WalletTransactionUpdateRequest,
	WalletUpdateRequest,
	CategoryResponse,
	CategoryCreateRequest,
	CategoryUpdateRequest,
	CategoryStatusUpdateRequest,
	CategoryTransactionResponse,
	CategoryTransactionCreateRequest,
	CategoryTransactionUpdateRequest,
	CategoryTransactionPageResponse,
	TransactionFeedResponse,
	SettingsResponse,
	SettingsUpdateRequest,
	BudgetResponse,
	BudgetCreateRequest,
	BudgetUpdateRequest,
	AnalyticsResponse,
	DebtCounterpartyResponse,
	DebtCounterpartyCreateRequest,
	DebtCounterpartyUpdateRequest,
	DebtTransactionResponse,
	DebtTransactionCreateRequest,
	DebtTransactionUpdateRequest,
	DebtTransactionPageResponse,
	DebtSummaryResponse,
} from './types'
import type { BudgetPeriodType } from '@/types/entities/budget'

export async function telegramLogin(params: { initData: string }): Promise<AuthResponse> {
	const body = TelegramAuthRequestSchema.parse(params)
	const data = await post<AuthResponse>(endpoints.auth.telegram, body)
	const parsed = AuthResponseSchema.parse(data)
	return parsed
}

export async function listWallets(): Promise<WalletResponse[]> {
	const data = await get<unknown>(endpoints.wallets.base)
	return WalletResponseSchema.array().parse(data)
}

export async function getWallet(id: number): Promise<WalletResponse> {
	const data = await get<unknown>(endpoints.wallets.byId(id))
	return WalletResponseSchema.parse(data)
}

export async function listWalletBalances(): Promise<WalletBalanceResponse[]> {
	const data = await get<unknown>(endpoints.wallets.balances)
	return WalletBalanceResponseSchema.array().parse(data)
}

export async function createWallet(payload: WalletCreateRequest): Promise<WalletResponse> {
	const body = WalletCreateRequestSchema.parse(payload)
	const data = await post<unknown>(endpoints.wallets.base, body)
	return WalletResponseSchema.parse(data)
}

export async function updateWallet(id: number, payload: WalletUpdateRequest): Promise<WalletResponse> {
	const body = WalletUpdateRequestSchema.parse(payload)
	const data = await patch<unknown>(endpoints.wallets.byId(id), body)
	return WalletResponseSchema.parse(data)
}

export async function updateWalletStatus(id: number, payload: WalletStatusUpdateRequest): Promise<WalletResponse> {
	const body = WalletStatusUpdateRequestSchema.parse(payload)
	const data = await patch<unknown>(endpoints.wallets.status(id), body)
	return WalletResponseSchema.parse(data)
}

export async function listWalletTransactions(params?: { walletId?: number }): Promise<WalletTransactionResponse[]> {
	const query = typeof params?.walletId === 'number' ? `?walletId=${params.walletId}` : ''
	const data = await get<unknown>(`${endpoints.walletTransactions.base}${query}`)
	return WalletTransactionResponseSchema.array().parse(data)
}

export async function createWalletTransaction(payload: WalletTransactionRequest): Promise<WalletTransactionResponse> {
	const body = WalletTransactionRequestSchema.parse(payload)
	const data = await post<unknown>(endpoints.walletTransactions.base, body)
	return WalletTransactionResponseSchema.parse(data)
}

export async function getWalletTransaction(id: number): Promise<WalletTransactionResponse> {
	const data = await get<unknown>(endpoints.walletTransactions.byId(id))
	return WalletTransactionResponseSchema.parse(data)
}

export async function updateWalletTransaction(id: number, payload: WalletTransactionUpdateRequest): Promise<WalletTransactionResponse> {
	const body = WalletTransactionUpdateRequestSchema.parse(payload)
	const data = await patch<unknown>(endpoints.walletTransactions.byId(id), body)
	return WalletTransactionResponseSchema.parse(data)
}

export async function deleteWalletTransaction(id: number): Promise<void> {
	await del<void>(endpoints.walletTransactions.byId(id))
}

export async function listCurrencies(): Promise<CurrencyResponse[]> {
	const data = await get<unknown>(endpoints.currencies.base)
	return CurrencyResponseSchema.array().parse(data)
}

export async function getRate(params: { from: string; to: string }): Promise<ExchangeRateResponse> {
	const url = `${endpoints.rates.base}?from=${encodeURIComponent(params.from)}&to=${encodeURIComponent(params.to)}`
	const data = await get<unknown>(url)
	return ExchangeRateResponseSchema.parse(data)
}

export async function listExchangeRates(params?: { to?: string }): Promise<ExchangeRateListResponse> {
	const targetCurrency = params?.to ?? 'KZT'
	const url = `${endpoints.rates.all}?to=${encodeURIComponent(targetCurrency)}`
	const data = await get<unknown>(url)
	return ExchangeRateListResponseSchema.parse(data)
}

export async function convertCurrency(params: { from: string; to: string; amount: number }): Promise<CurrencyConversionResponse> {
	const url = `${endpoints.rates.convert}?from=${encodeURIComponent(params.from)}&to=${encodeURIComponent(params.to)}&amount=${params.amount}`
	const data = await get<unknown>(url)
	return CurrencyConversionResponseSchema.parse(data)
}

export async function listCategories(): Promise<CategoryResponse[]> {
	const data = await get<unknown>(endpoints.categories.base)
	return CategoryResponseSchema.array().parse(data)
}

export async function createCategory(payload: CategoryCreateRequest): Promise<CategoryResponse> {
	const body = CategoryCreateRequestSchema.parse(payload)
	const data = await post<unknown>(endpoints.categories.base, body)
	return CategoryResponseSchema.parse(data)
}

export async function updateCategory(id: number, payload: CategoryUpdateRequest): Promise<CategoryResponse> {
	const body = CategoryUpdateRequestSchema.parse(payload)
	const data = await patch<unknown>(endpoints.categories.byId(id), body)
	return CategoryResponseSchema.parse(data)
}

export async function updateCategoryStatus(id: number, payload: CategoryStatusUpdateRequest): Promise<CategoryResponse> {
	const body = CategoryStatusUpdateRequestSchema.parse(payload)
	const data = await patch<unknown>(endpoints.categories.status(id), body)
	return CategoryResponseSchema.parse(data)
}

export async function listCategoryTransactions(params?: {
	page?: number
	size?: number
	walletId?: number
	categoryId?: number
	type?: string
	from?: Date | string
	to?: Date | string
}): Promise<CategoryTransactionPageResponse> {
	const query = new URLSearchParams()
	if (typeof params?.page === 'number') query.set('page', String(params.page))
	if (typeof params?.size === 'number') query.set('size', String(params.size))
	if (typeof params?.walletId === 'number') query.set('walletId', String(params.walletId))
	if (typeof params?.categoryId === 'number') query.set('categoryId', String(params.categoryId))
	if (params?.type) query.set('type', params.type)
	if (params?.from) query.set('from', new Date(params.from).toISOString())
	if (params?.to) query.set('to', new Date(params.to).toISOString())
	const queryString = query.toString()
	const url = queryString ? `${endpoints.categoryTransactions.base}?${queryString}` : endpoints.categoryTransactions.base
	const data = await get<unknown>(url)
	return CategoryTransactionPageResponseSchema.parse(data)
}

export async function createCategoryTransaction(payload: CategoryTransactionCreateRequest): Promise<CategoryTransactionResponse> {
	const body = CategoryTransactionCreateRequestSchema.parse(payload)
	const data = await post<unknown>(endpoints.categoryTransactions.base, body)
	return CategoryTransactionResponseSchema.parse(data)
}

export async function getCategoryTransaction(id: number): Promise<CategoryTransactionResponse> {
	const data = await get<unknown>(endpoints.categoryTransactions.byId(id))
	return CategoryTransactionResponseSchema.parse(data)
}

export async function getSettings(): Promise<SettingsResponse> {
	const data = await get<unknown>(endpoints.settings.base)
	return SettingsResponseSchema.parse(data)
}

export async function updateSettings(payload: SettingsUpdateRequest): Promise<SettingsResponse> {
	const body = SettingsUpdateRequestSchema.parse(payload)
	const data = await patch<unknown>(endpoints.settings.base, body)
	return SettingsResponseSchema.parse(data)
}

export async function updateCategoryTransaction(id: number, payload: CategoryTransactionUpdateRequest): Promise<CategoryTransactionResponse> {
	const body = CategoryTransactionUpdateRequestSchema.parse(payload)
	const data = await patch<unknown>(endpoints.categoryTransactions.byId(id), body)
	return CategoryTransactionResponseSchema.parse(data)
}

export async function deleteCategoryTransaction(id: number): Promise<void> {
	await del<void>(endpoints.categoryTransactions.byId(id))
}

export async function listBudgets(params?: {
	status?: string
	from?: Date | string
	to?: Date | string
	periodType?: BudgetPeriodType
}): Promise<BudgetResponse[]> {
	const query = new URLSearchParams()
	if (params?.status) query.set('status', params.status)
	if (params?.from) query.set('from', new Date(params.from).toISOString())
	if (params?.to) query.set('to', new Date(params.to).toISOString())
	if (params?.periodType) query.set('periodType', params.periodType)
	const queryString = query.toString()
	const url = queryString ? `${endpoints.budgets.base}?${queryString}` : endpoints.budgets.base
	const data = await get<unknown>(url)
	return BudgetResponseSchema.array().parse(data)
}

export async function getBudget(id: number): Promise<BudgetResponse> {
	const data = await get<unknown>(endpoints.budgets.byId(id))
	return BudgetResponseSchema.parse(data)
}

export async function getAnalytics(params?: { from?: Date | string; to?: Date | string; categoryIds?: number[] }): Promise<AnalyticsResponse> {
	const query = new URLSearchParams()
	if (params?.from) {
		query.set('from', new Date(params.from).toISOString())
	}
	if (params?.to) {
		query.set('to', new Date(params.to).toISOString())
	}
	if (params?.categoryIds?.length) {
		for (const categoryId of params.categoryIds) {
			query.append('categoryIds', String(categoryId))
		}
	}
	const queryString = query.toString()
	const url = queryString ? `${endpoints.analytics.base}?${queryString}` : endpoints.analytics.base
	const data = await get<unknown>(url)
	return AnalyticsResponseSchema.parse(data)
}

export async function createBudget(payload: BudgetCreateRequest): Promise<BudgetResponse> {
	const body = BudgetCreateRequestSchema.parse(payload)
	const data = await post<unknown>(endpoints.budgets.base, body)
	return BudgetResponseSchema.parse(data)
}

export async function updateBudget(id: number, payload: BudgetUpdateRequest): Promise<BudgetResponse> {
	const body = BudgetUpdateRequestSchema.parse(payload)
	const data = await patch<unknown>(endpoints.budgets.byId(id), body)
	return BudgetResponseSchema.parse(data)
}

export async function closeBudget(id: number): Promise<BudgetResponse> {
	const data = await post<unknown>(endpoints.budgets.close(id), {})
	return BudgetResponseSchema.parse(data)
}

export async function openBudget(id: number): Promise<BudgetResponse> {
	const data = await post<unknown>(endpoints.budgets.open(id), {})
	return BudgetResponseSchema.parse(data)
}

export async function deleteBudget(id: number): Promise<void> {
	await del<void>(endpoints.budgets.byId(id))
}

export async function listDebtCounterparties(params?: { status?: string }): Promise<DebtCounterpartyResponse[]> {
	const query = new URLSearchParams()
	if (params?.status) query.set('status', params.status)
	const queryString = query.toString()
	const url = queryString ? `${endpoints.debts.counterparties}?${queryString}` : endpoints.debts.counterparties
	const data = await get<unknown>(url)
	return DebtCounterpartyResponseSchema.array().parse(data)
}

export async function getDebtCounterparty(id: number): Promise<DebtCounterpartyResponse> {
	const data = await get<unknown>(endpoints.debts.counterpartyById(id))
	return DebtCounterpartyResponseSchema.parse(data)
}

export async function createDebtCounterparty(payload: DebtCounterpartyCreateRequest): Promise<DebtCounterpartyResponse> {
	const body = DebtCounterpartyCreateRequestSchema.parse(payload)
	const data = await post<unknown>(endpoints.debts.counterparties, body)
	return DebtCounterpartyResponseSchema.parse(data)
}

export async function updateDebtCounterparty(id: number, payload: DebtCounterpartyUpdateRequest): Promise<DebtCounterpartyResponse> {
	const body = DebtCounterpartyUpdateRequestSchema.parse(payload)
	const data = await patch<unknown>(endpoints.debts.counterpartyById(id), body)
	return DebtCounterpartyResponseSchema.parse(data)
}

export async function archiveDebtCounterparty(id: number): Promise<DebtCounterpartyResponse> {
	const data = await post<unknown>(endpoints.debts.counterpartyArchive(id), {})
	return DebtCounterpartyResponseSchema.parse(data)
}

export async function restoreDebtCounterparty(id: number): Promise<DebtCounterpartyResponse> {
	const data = await post<unknown>(endpoints.debts.counterpartyRestore(id), {})
	return DebtCounterpartyResponseSchema.parse(data)
}

export async function listDebtTransactions(params?: {
	page?: number
	size?: number
	counterpartyId?: number
	direction?: string
	from?: Date | string
	to?: Date | string
}): Promise<DebtTransactionPageResponse> {
	const query = new URLSearchParams()
	if (typeof params?.page === 'number') query.set('page', String(params.page))
	if (typeof params?.size === 'number') query.set('size', String(params.size))
	if (typeof params?.counterpartyId === 'number') query.set('counterpartyId', String(params.counterpartyId))
	if (params?.direction) query.set('direction', params.direction)
	if (params?.from) query.set('from', new Date(params.from).toISOString())
	if (params?.to) query.set('to', new Date(params.to).toISOString())
	const queryString = query.toString()
	const url = queryString ? `${endpoints.debts.transactions}?${queryString}` : endpoints.debts.transactions
	const data = await get<unknown>(url)
	return DebtTransactionPageResponseSchema.parse(data)
}

export async function getDebtTransaction(id: number): Promise<DebtTransactionResponse> {
	const data = await get<unknown>(endpoints.debts.transactionById(id))
	return DebtTransactionResponseSchema.parse(data)
}

export async function createDebtTransaction(payload: DebtTransactionCreateRequest): Promise<DebtTransactionResponse> {
	const body = DebtTransactionCreateRequestSchema.parse(payload)
	const data = await post<unknown>(endpoints.debts.transactions, body)
	return DebtTransactionResponseSchema.parse(data)
}

export async function deleteDebtTransaction(id: number): Promise<void> {
	await del<void>(endpoints.debts.transactionById(id))
}

export async function updateDebtTransaction(id: number, payload: DebtTransactionUpdateRequest): Promise<DebtTransactionResponse> {
	const body = DebtTransactionUpdateRequestSchema.parse(payload)
	const data = await patch<unknown>(endpoints.debts.transactionById(id), body)
	return DebtTransactionResponseSchema.parse(data)
}

export async function getDebtSummary(): Promise<DebtSummaryResponse> {
	const data = await get<unknown>(endpoints.debts.summary)
	return DebtSummaryResponseSchema.parse(data)
}

export async function listDebtHistory(params?: {
	page?: number
	size?: number
	counterpartyId?: number
	direction?: string
	from?: Date | string
	to?: Date | string
}): Promise<DebtTransactionPageResponse> {
	const query = new URLSearchParams()
	if (typeof params?.page === 'number') query.set('page', String(params.page))
	if (typeof params?.size === 'number') query.set('size', String(params.size))
	if (typeof params?.counterpartyId === 'number') query.set('counterpartyId', String(params.counterpartyId))
	if (params?.direction) query.set('direction', params.direction)
	if (params?.from) query.set('from', new Date(params.from).toISOString())
	if (params?.to) query.set('to', new Date(params.to).toISOString())
	const queryString = query.toString()
	const url = queryString ? `${endpoints.debts.history}?${queryString}` : endpoints.debts.history
	const data = await get<unknown>(url)
	return DebtTransactionPageResponseSchema.parse(data)
}

export async function getTransactionFeed(params?: {
	page?: number
	size?: number
	type?: string
	walletIds?: number[]
	categoryIds?: number[]
	debtCounterpartyIds?: number[]
	debtDirection?: string
	from?: Date | string
	to?: Date | string
	period?: string
}): Promise<TransactionFeedResponse> {
	const query = new URLSearchParams()
	if (typeof params?.page === 'number') query.set('page', String(params.page))
	if (typeof params?.size === 'number') query.set('size', String(params.size))
	if (params?.type) query.set('type', params.type)
	if (params?.walletIds?.length) {
		for (const walletId of params.walletIds) {
			query.append('walletId', String(walletId))
		}
	}
	if (params?.categoryIds?.length) {
		for (const categoryId of params.categoryIds) {
			query.append('categoryId', String(categoryId))
		}
	}
	if (params?.debtCounterpartyIds?.length) {
		for (const counterpartyId of params.debtCounterpartyIds) {
			query.append('debtCounterpartyId', String(counterpartyId))
		}
	}
	if (params?.debtDirection) query.set('debtDirection', params.debtDirection)
	if (params?.from) query.set('from', new Date(params.from).toISOString())
	if (params?.to) query.set('to', new Date(params.to).toISOString())
	if (params?.period) query.set('period', params.period)
	const queryString = query.toString()
	const url = queryString ? `${endpoints.transactionsFeed.base}?${queryString}` : endpoints.transactionsFeed.base
	const data = await get<unknown>(url)
	return TransactionFeedResponseSchema.parse(data)
}

export const createTransaction = createWalletTransaction
export const listTransactionsByWallet = (walletId: number) => listWalletTransactions({ walletId })
