export const endpoints = {
	auth: {
		telegram: '/api/auth/telegram',
		refresh: '/api/auth/refresh',
	},
	users: {
		base: '/api/users',
		byId: (id: number | string) => `/api/users/${id}`,
	},
	wallets: {
		base: '/api/wallets',
		byId: (id: number | string) => `/api/wallets/${id}`,
	},
	walletTransactions: {
		base: '/api/wallet-transactions',
		byId: (id: number | string) => `/api/wallet-transactions/${id}`,
	},
	categoryTransactions: {
		base: '/api/category-transactions',
		byId: (id: number | string) => `/api/category-transactions/${id}`,
	},
	categories: {
		base: '/api/categories',
		byId: (id: number | string) => `/api/categories/${id}`,
		subcategories: (categoryId: number | string) => `/api/categories/${categoryId}/subcategories`,
		subcategoryById: (categoryId: number | string, subcategoryId: number | string) => `/api/categories/${categoryId}/subcategories/${subcategoryId}`,
	},
	transactionsFeed: {
		base: '/api/transactions',
	},
	currencies: {
		base: '/api/currencies',
	},
	rates: {
		base: '/api/exchange-rates',
		convert: '/api/exchange-rates/convert',
		all: '/api/exchange-rates/all',
	},
} as const
