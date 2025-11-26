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
	WalletTransactionRequestSchema,
	WalletTransactionResponseSchema,
	WalletTransactionUpdateRequestSchema,
	WalletUpdateRequestSchema,
	CategoryResponseSchema,
	CategoryCreateRequestSchema,
	CategoryUpdateRequestSchema,
	SubcategoryResponseSchema,
	SubcategoryCreateRequestSchema,
	SubcategoryUpdateRequestSchema,
	CategoryTransactionResponseSchema,
	CategoryTransactionCreateRequestSchema,
	CategoryTransactionUpdateRequestSchema,
	CategoryTransactionPageResponseSchema,
	TransactionFeedResponseSchema,
} from './schemas'
import type {
	AuthResponse,
	CurrencyConversionResponse,
	CurrencyResponse,
	ExchangeRateListResponse,
	ExchangeRateResponse,
	WalletCreateRequest,
	WalletResponse,
	WalletTransactionRequest,
	WalletTransactionResponse,
	WalletTransactionUpdateRequest,
	WalletUpdateRequest,
	CategoryResponse,
	CategoryCreateRequest,
	CategoryUpdateRequest,
	SubcategoryResponse,
	SubcategoryCreateRequest,
	SubcategoryUpdateRequest,
	CategoryTransactionResponse,
	CategoryTransactionCreateRequest,
	CategoryTransactionUpdateRequest,
	CategoryTransactionPageResponse,
	TransactionFeedResponse,
} from './types'

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

export async function deleteWallet(id: number): Promise<void> {
	await del<void>(endpoints.wallets.byId(id))
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

export async function deleteCategory(id: number): Promise<void> {
	await del<void>(endpoints.categories.byId(id))
}

export async function listCategoryTransactions(params?: {
	page?: number
	size?: number
	walletId?: number
	categoryId?: number
	subcategoryId?: number
	type?: string
	from?: Date | string
	to?: Date | string
}): Promise<CategoryTransactionPageResponse> {
	const query = new URLSearchParams()
	if (typeof params?.page === 'number') query.set('page', String(params.page))
	if (typeof params?.size === 'number') query.set('size', String(params.size))
	if (typeof params?.walletId === 'number') query.set('walletId', String(params.walletId))
	if (typeof params?.categoryId === 'number') query.set('categoryId', String(params.categoryId))
	if (typeof params?.subcategoryId === 'number') query.set('subcategoryId', String(params.subcategoryId))
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

export async function updateCategoryTransaction(id: number, payload: CategoryTransactionUpdateRequest): Promise<CategoryTransactionResponse> {
	const body = CategoryTransactionUpdateRequestSchema.parse(payload)
	const data = await patch<unknown>(endpoints.categoryTransactions.byId(id), body)
	return CategoryTransactionResponseSchema.parse(data)
}

export async function deleteCategoryTransaction(id: number): Promise<void> {
	await del<void>(endpoints.categoryTransactions.byId(id))
}

export async function getTransactionFeed(params?: {
	page?: number
	size?: number
	type?: string
	walletId?: number
	categoryId?: number
	subcategoryId?: number
	from?: Date | string
	to?: Date | string
}): Promise<TransactionFeedResponse> {
	const query = new URLSearchParams()
	if (typeof params?.page === 'number') query.set('page', String(params.page))
	if (typeof params?.size === 'number') query.set('size', String(params.size))
	if (params?.type) query.set('type', params.type)
	if (typeof params?.walletId === 'number') query.set('walletId', String(params.walletId))
	if (typeof params?.categoryId === 'number') query.set('categoryId', String(params.categoryId))
	if (typeof params?.subcategoryId === 'number') query.set('subcategoryId', String(params.subcategoryId))
	if (params?.from) query.set('from', new Date(params.from).toISOString())
	if (params?.to) query.set('to', new Date(params.to).toISOString())
	const queryString = query.toString()
	const url = queryString ? `${endpoints.transactionsFeed.base}?${queryString}` : endpoints.transactionsFeed.base
	const data = await get<unknown>(url)
	return TransactionFeedResponseSchema.parse(data)
}

export async function listSubcategories(categoryId: number): Promise<SubcategoryResponse[]> {
	const data = await get<unknown>(endpoints.categories.subcategories(categoryId))
	return SubcategoryResponseSchema.array().parse(data)
}

export async function createSubcategory(categoryId: number, payload: SubcategoryCreateRequest): Promise<SubcategoryResponse> {
	const body = SubcategoryCreateRequestSchema.parse(payload)
	const data = await post<unknown>(endpoints.categories.subcategories(categoryId), body)
	return SubcategoryResponseSchema.parse(data)
}

export async function updateSubcategory(categoryId: number, subcategoryId: number, payload: SubcategoryUpdateRequest): Promise<SubcategoryResponse> {
	const body = SubcategoryUpdateRequestSchema.parse(payload)
	const data = await patch<unknown>(endpoints.categories.subcategoryById(categoryId, subcategoryId), body)
	return SubcategoryResponseSchema.parse(data)
}

export async function deleteSubcategory(categoryId: number, subcategoryId: number): Promise<void> {
	await del<void>(endpoints.categories.subcategoryById(categoryId, subcategoryId))
}

export const createTransaction = createWalletTransaction
export const listTransactionsByWallet = (walletId: number) => listWalletTransactions({ walletId })
