import { z } from 'zod'

// Auth
export const AuthResponseSchema = z.object({
	accessToken: z.string().min(1),
	accessTokenExpiresAt: z.coerce.date().nullable().optional(),
	refreshToken: z.string().min(1),
	refreshTokenExpiresAt: z.coerce.date().nullable().optional(),
})

export const RefreshRequestSchema = z.object({
	refreshToken: z.string().min(1),
})

export const TelegramAuthRequestSchema = z.object({
	initData: z.string().min(1),
})

// Users
export const WalletResponseSchema = z.object({
	id: z.number().int(),
	ownerId: z.number().int(),
	name: z.string(),
	currencyCode: z.string(),
	balance: z.number(),
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
})

export const UserResponseSchema = z.object({
	id: z.number().int(),
	telegramUserId: z.number().int(),
	telegramUsername: z.string(),
	telegramLanguageCode: z.string().nullable().optional(),
	role: z.string(),
	subscriptionActive: z.boolean(),
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
	wallets: z.array(WalletResponseSchema),
})

export const UserUpdateRequestSchema = z.object({
	telegramUsername: z.string().optional(),
	telegramLanguageCode: z.string().optional(),
	role: z.string().optional(),
	subscriptionActive: z.boolean().optional(),
})

// Wallets
export const WalletCreateRequestSchema = z.object({
	name: z.string().min(1).max(50),
	currencyCode: z.string().min(1).max(10),
	ownerId: z.number().int().positive().optional(),
})

export const WalletUpdateRequestSchema = z.object({
	name: z.string().max(50).optional(),
	currencyCode: z.string().max(10).optional(),
	ownerId: z.number().int().positive().optional(),
})

// Transactions
export const WalletTransactionRequestSchema = z.object({
	fromWalletId: z.number().int(),
	toWalletId: z.number().int(),
	amount: z.number().positive(),
	description: z.string().optional(),
	executedAt: z.coerce.date().nullable().optional(),
})

export const WalletTransactionResponseSchema = z.object({
	id: z.number().int(),
	fromWalletId: z.number().int(),
	fromWalletName: z.string(),
	toWalletId: z.number().int(),
	toWalletName: z.string(),
	sourceAmount: z.number(),
	sourceCurrencyCode: z.string(),
	targetAmount: z.number(),
	targetCurrencyCode: z.string(),
	exchangeRate: z.number(),
	description: z.string().nullable().optional(),
	executedAt: z.coerce.date().nullable(),
	createdAt: z.coerce.date().nullable(),
})

// Currencies & rates
export const CurrencyResponseSchema = z.object({
	id: z.number().int(),
	code: z.string(),
	name: z.string(),
	decimalPrecision: z.number().int(),
	active: z.boolean(),
})

export const ExchangeRateResponseSchema = z.object({
	sourceCurrency: z.string(),
	targetCurrency: z.string(),
	rate: z.number(),
})

export const CurrencyConversionResponseSchema = z.object({
	amount: z.number(),
	sourceCurrency: z.string(),
	targetCurrency: z.string(),
	rate: z.number(),
	convertedAmount: z.number(),
})
