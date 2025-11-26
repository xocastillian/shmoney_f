import { z } from 'zod'
import {
	AuthResponseSchema,
	RefreshRequestSchema,
	TelegramAuthRequestSchema,
	UserResponseSchema,
	WalletResponseSchema,
	WalletCreateRequestSchema,
	WalletUpdateRequestSchema,
	WalletTransactionRequestSchema,
	WalletTransactionResponseSchema,
	WalletTransactionUpdateRequestSchema,
	CurrencyResponseSchema,
	ExchangeRateResponseSchema,
	ExchangeRateListResponseSchema,
	CurrencyConversionResponseSchema,
	CategoryResponseSchema,
	CategoryCreateRequestSchema,
	CategoryUpdateRequestSchema,
	SubcategoryResponseSchema,
	SubcategoryCreateRequestSchema,
	SubcategoryUpdateRequestSchema,
	CategoryTransactionTypeSchema,
	CategoryTransactionResponseSchema,
	CategoryTransactionCreateRequestSchema,
	CategoryTransactionUpdateRequestSchema,
	CategoryTransactionPageResponseSchema,
	TransactionFeedItemSchema,
	TransactionFeedResponseSchema,
	TransactionFeedTypeSchema,
} from './schemas'

export type AuthResponse = z.infer<typeof AuthResponseSchema>
export type RefreshRequest = z.infer<typeof RefreshRequestSchema>
export type TelegramAuthRequest = z.infer<typeof TelegramAuthRequestSchema>

export type UserResponse = z.infer<typeof UserResponseSchema>
export type WalletResponse = z.infer<typeof WalletResponseSchema>
export type WalletCreateRequest = z.infer<typeof WalletCreateRequestSchema>
export type WalletUpdateRequest = z.infer<typeof WalletUpdateRequestSchema>

export type WalletTransactionRequest = z.infer<typeof WalletTransactionRequestSchema>
export type WalletTransactionResponse = z.infer<typeof WalletTransactionResponseSchema>
export type WalletTransactionUpdateRequest = z.infer<typeof WalletTransactionUpdateRequestSchema>

export type CurrencyResponse = z.infer<typeof CurrencyResponseSchema>
export type ExchangeRateResponse = z.infer<typeof ExchangeRateResponseSchema>
export type ExchangeRateListResponse = z.infer<typeof ExchangeRateListResponseSchema>
export type CurrencyConversionResponse = z.infer<typeof CurrencyConversionResponseSchema>
export type CategoryResponse = z.infer<typeof CategoryResponseSchema>
export type CategoryCreateRequest = z.infer<typeof CategoryCreateRequestSchema>
export type CategoryUpdateRequest = z.infer<typeof CategoryUpdateRequestSchema>
export type SubcategoryResponse = z.infer<typeof SubcategoryResponseSchema>
export type SubcategoryCreateRequest = z.infer<typeof SubcategoryCreateRequestSchema>
export type SubcategoryUpdateRequest = z.infer<typeof SubcategoryUpdateRequestSchema>
export type CategoryTransactionType = z.infer<typeof CategoryTransactionTypeSchema>
export type CategoryTransactionResponse = z.infer<typeof CategoryTransactionResponseSchema>
export type CategoryTransactionCreateRequest = z.infer<typeof CategoryTransactionCreateRequestSchema>
export type CategoryTransactionUpdateRequest = z.infer<typeof CategoryTransactionUpdateRequestSchema>
export type CategoryTransactionPageResponse = z.infer<typeof CategoryTransactionPageResponseSchema>
export type TransactionFeedItem = z.infer<typeof TransactionFeedItemSchema>
export type TransactionFeedResponse = z.infer<typeof TransactionFeedResponseSchema>
export type TransactionFeedType = z.infer<typeof TransactionFeedTypeSchema>
