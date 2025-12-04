import { z } from 'zod'
import { WalletStatus, WalletType } from '@/types/entities/wallet'
import { CategoryStatus } from '@/types/entities/category'
import { BudgetPeriodType, BudgetStatus, BudgetType } from '@/types/entities/budget'

export const WalletTypeSchema = z.enum(WalletType)
export const WalletStatusSchema = z.enum(WalletStatus)
export const CategoryTransactionTypeSchema = z.enum(['EXPENSE', 'INCOME'])
export const CategoryStatusSchema = z.enum(CategoryStatus)
export const BudgetPeriodTypeSchema = z.enum(BudgetPeriodType)
export const BudgetTypeSchema = z.enum(BudgetType)
export const BudgetStatusSchema = z.enum(BudgetStatus)

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

export const WalletResponseSchema = z.object({
	id: z.number().int(),
	ownerId: z.number().int(),
	name: z.string(),
	currencyCode: z.string(),
	color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
	type: WalletTypeSchema,
	status: WalletStatusSchema,
	balance: z.coerce.number(),
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

export const WalletCreateRequestSchema = z.object({
	name: z.string().min(1).max(50),
	currencyCode: z.string().min(1).max(10),
	balance: z.coerce.number().min(0),
	color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
	type: WalletTypeSchema,
	ownerId: z.number().int().positive().optional(),
})

export const WalletUpdateRequestSchema = z.object({
	name: z.string().max(50).optional(),
	currencyCode: z.string().max(10).optional(),
	color: z
		.string()
		.regex(/^#[0-9A-Fa-f]{6}$/)
		.optional(),
	type: WalletTypeSchema.optional(),
	balance: z.coerce.number().min(0).optional(),
	ownerId: z.number().int().positive().optional(),
})

export const WalletBalanceResponseSchema = z.object({
	currencyCode: z.string(),
	totalBalance: z.coerce.number(),
})

export const WalletStatusUpdateRequestSchema = z.object({
	status: WalletStatusSchema,
})

export const WalletTransactionRequestSchema = z.object({
	fromWalletId: z.number().int(),
	toWalletId: z.number().int(),
	amount: z.number().positive(),
	description: z.string().optional(),
	executedAt: z.coerce.date().nullable().optional(),
})

export const WalletTransactionUpdateRequestSchema = z.object({
	fromWalletId: z.number().int().optional(),
	toWalletId: z.number().int().optional(),
	amount: z.number().positive().optional(),
	description: z.string().max(255).optional(),
	executedAt: z.coerce.date().nullable().optional(),
})

export const WalletTransactionResponseSchema = z.object({
	id: z.number().int(),
	fromWalletId: z.number().int(),
	fromWalletName: z.string(),
	toWalletId: z.number().int(),
	toWalletName: z.string(),
	sourceAmount: z.coerce.number(),
	sourceCurrencyCode: z.string(),
	targetAmount: z.coerce.number(),
	targetCurrencyCode: z.string(),
	exchangeRate: z.coerce.number(),
	description: z.string().nullable().optional(),
	executedAt: z.coerce.date().nullable(),
	createdAt: z.coerce.date().nullable(),
})

export const CategoryTransactionResponseSchema = z.object({
	id: z.number().int(),
	walletId: z.number().int(),
	walletName: z.string(),
	categoryId: z.number().int(),
	categoryName: z.string(),
	type: CategoryTransactionTypeSchema,
	amount: z.coerce.number(),
	currencyCode: z.string(),
	description: z.string().nullable().optional(),
	occurredAt: z.coerce.date(),
	createdAt: z.coerce.date().nullable(),
	updatedAt: z.coerce.date().nullable(),
})

export const CategoryTransactionCreateRequestSchema = z.object({
	walletId: z.number().int().positive(),
	categoryId: z.number().int().positive(),
	type: CategoryTransactionTypeSchema,
	amount: z.number().positive(),
	occurredAt: z.coerce.date(),
	description: z.string().max(255).optional(),
})

export const CategoryTransactionUpdateRequestSchema = z.object({
	walletId: z.number().int().positive().optional(),
	categoryId: z.number().int().positive().optional(),
	type: CategoryTransactionTypeSchema.optional(),
	amount: z.number().positive().optional(),
	occurredAt: z.coerce.date().optional(),
	description: z.string().max(255).optional(),
})

export const CategoryTransactionPageResponseSchema = z.object({
	count: z.number().int(),
	next: z.number().int().nullable().optional(),
	previous: z.number().int().nullable().optional(),
	results: CategoryTransactionResponseSchema.array(),
})

export const TransactionFeedTypeSchema = z.enum(['TRANSFER', 'EXPENSE', 'INCOME'])

export const TransactionFeedItemSchema = z.object({
	id: z.number().int(),
	entryType: z.string(),
	categoryType: CategoryTransactionTypeSchema.nullable(),
	walletId: z.number().int().nullable(),
	counterpartyWalletId: z.number().int().nullable(),
	categoryId: z.number().int().nullable(),
	amount: z.coerce.number(),
	currencyCode: z.string(),
	description: z.string().nullable().optional(),
	occurredAt: z.coerce.date(),
	createdAt: z.coerce.date(),
})

export const TransactionFeedResponseSchema = z.object({
	count: z.number().int(),
	next: z.number().int().nullable().optional(),
	previous: z.number().int().nullable().optional(),
	results: TransactionFeedItemSchema.array(),
})

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
	rate: z.coerce.number(),
})

export const ExchangeRateListResponseSchema = z.array(ExchangeRateResponseSchema)

export const CurrencyConversionResponseSchema = z.object({
	amount: z.coerce.number(),
	sourceCurrency: z.string(),
	targetCurrency: z.string(),
	rate: z.coerce.number(),
	convertedAmount: z.coerce.number(),
})

export const SettingsResponseSchema = z.object({
	defaultLanguage: z.string(),
	mainCurrency: z.string(),
	supportedLanguages: z.array(z.string()),
	supportedCurrencies: z.array(z.string()),
})

export const SettingsUpdateRequestSchema = z
	.object({
		language: z.string().optional(),
		mainCurrency: z.string().optional(),
	})
	.refine(data => typeof data.language === 'string' || typeof data.mainCurrency === 'string', {
		message: 'Settings update requires language or mainCurrency',
	})

export const CategoryResponseSchema = z.object({
	id: z.number().int(),
	name: z.string(),
	color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
	icon: z.string(),
	status: CategoryStatusSchema,
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
})

export const CategoryCreateRequestSchema = z.object({
	name: z.string().min(1).max(100),
	color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
	icon: z.string().min(1).max(100),
})

export const CategoryUpdateRequestSchema = z.object({
	name: z.string().max(100).optional(),
	color: z
		.string()
		.regex(/^#[0-9A-Fa-f]{6}$/)
		.optional(),
	icon: z.string().max(100).optional(),
})

export const CategoryStatusUpdateRequestSchema = z.object({
	status: CategoryStatusSchema,
})

export const BudgetResponseSchema = z.object({
	id: z.number().int(),
	name: z.string(),
	periodType: BudgetPeriodTypeSchema,
	periodStart: z.coerce.date(),
	periodEnd: z.coerce.date(),
	budgetType: BudgetTypeSchema,
	currencyCode: z.string(),
	amountLimit: z.coerce.number(),
	spentAmount: z.coerce.number(),
	percentSpent: z.coerce.number(),
	status: BudgetStatusSchema,
	categoryIds: z.array(z.number().int()),
	closedAt: z.coerce.date().nullable().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
})

export const BudgetCreateRequestSchema = z.object({
	name: z.string().min(1).max(100),
	periodType: BudgetPeriodTypeSchema,
	periodStart: z.coerce.date().optional(),
	periodEnd: z.coerce.date().optional(),
	budgetType: BudgetTypeSchema,
	categoryIds: z.array(z.number().int().positive()).nonempty(),
	currencyCode: z.string().min(3).max(10),
	amountLimit: z.coerce.number().positive(),
})

export const BudgetUpdateRequestSchema = z.object({
	name: z.string().max(100).optional(),
	periodType: BudgetPeriodTypeSchema.optional(),
	periodStart: z.coerce.date().optional(),
	periodEnd: z.coerce.date().optional(),
	budgetType: BudgetTypeSchema.optional(),
	categoryIds: z.array(z.number().int().positive()).nonempty().optional(),
	currencyCode: z.string().min(3).max(10).optional(),
	amountLimit: z.coerce.number().positive().optional(),
})
