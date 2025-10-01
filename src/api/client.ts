import { endpoints } from './endpoints'
import { get, post, patch, del } from './http'
import {
	AuthResponseSchema,
	CurrencyConversionResponseSchema,
	CurrencyResponseSchema,
	ExchangeRateResponseSchema,
	TelegramAuthRequestSchema,
	WalletCreateRequestSchema,
	WalletResponseSchema,
	WalletTransactionRequestSchema,
	WalletTransactionResponseSchema,
	WalletUpdateRequestSchema,
} from './schemas'
import type {
	AuthResponse,
	CurrencyConversionResponse,
	CurrencyResponse,
	ExchangeRateResponse,
	WalletCreateRequest,
	WalletResponse,
	WalletTransactionRequest,
	WalletTransactionResponse,
	WalletUpdateRequest,
} from './types'

// Auth via Telegram initData
export async function telegramLogin(params: { initData: string }): Promise<AuthResponse> {
	const body = TelegramAuthRequestSchema.parse(params)
	const data = await post<AuthResponse>(endpoints.auth.telegram, body)
	const parsed = AuthResponseSchema.parse(data)
	return parsed
}

// Wallets (current user sees own wallets)
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

// Transactions
export async function createTransaction(payload: WalletTransactionRequest): Promise<WalletTransactionResponse> {
	const body = WalletTransactionRequestSchema.parse(payload)
	const data = await post<unknown>(endpoints.transactions.base, body)
	return WalletTransactionResponseSchema.parse(data)
}

export async function listTransactionsByWallet(walletId: number): Promise<WalletTransactionResponse[]> {
	const data = await get<unknown>(`${endpoints.transactions.base}?walletId=${walletId}`)
	return WalletTransactionResponseSchema.array().parse(data)
}

// Currencies & rates
export async function listCurrencies(): Promise<CurrencyResponse[]> {
	const data = await get<unknown>(endpoints.currencies.base)
	return CurrencyResponseSchema.array().parse(data)
}

export async function getRate(params: { from: string; to: string }): Promise<ExchangeRateResponse> {
	const url = `${endpoints.rates.base}?from=${encodeURIComponent(params.from)}&to=${encodeURIComponent(params.to)}`
	const data = await get<unknown>(url)
	return ExchangeRateResponseSchema.parse(data)
}

export async function convertCurrency(params: { from: string; to: string; amount: number }): Promise<CurrencyConversionResponse> {
	const url = `${endpoints.rates.convert}?from=${encodeURIComponent(params.from)}&to=${encodeURIComponent(params.to)}&amount=${params.amount}`
	const data = await get<unknown>(url)
	return CurrencyConversionResponseSchema.parse(data)
}
