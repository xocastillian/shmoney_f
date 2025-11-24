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
	WalletUpdateRequestSchema,
	CategoryResponseSchema,
	CategoryCreateRequestSchema,
	CategoryUpdateRequestSchema,
	SubcategoryResponseSchema,
	SubcategoryCreateRequestSchema,
	SubcategoryUpdateRequestSchema,
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
	WalletUpdateRequest,
	CategoryResponse,
	CategoryCreateRequest,
	CategoryUpdateRequest,
	SubcategoryResponse,
	SubcategoryCreateRequest,
	SubcategoryUpdateRequest,
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

export async function createTransaction(payload: WalletTransactionRequest): Promise<WalletTransactionResponse> {
	const body = WalletTransactionRequestSchema.parse(payload)
	const data = await post<unknown>(endpoints.transactions.base, body)
	return WalletTransactionResponseSchema.parse(data)
}

export async function listTransactionsByWallet(walletId: number): Promise<WalletTransactionResponse[]> {
	const data = await get<unknown>(`${endpoints.transactions.base}?walletId=${walletId}`)
	return WalletTransactionResponseSchema.array().parse(data)
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
