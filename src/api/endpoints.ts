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
		status: (id: number | string) => `/api/wallets/${id}/status`,
		balances: '/api/wallets/balances',
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
		status: (id: number | string) => `/api/categories/${id}/status`,
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
	settings: {
		base: '/api/settings',
	},
	budgets: {
		base: '/api/budgets',
		byId: (id: number | string) => `/api/budgets/${id}`,
		close: (id: number | string) => `/api/budgets/${id}/close`,
		open: (id: number | string) => `/api/budgets/${id}/open`,
	},
} as const
