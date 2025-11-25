export const endpoints = {
	auth: {
		telegram: '/auth/telegram',
		refresh: '/auth/refresh',
	},
	users: {
		base: '/users',
		byId: (id: number | string) => `/users/${id}`,
	},
	wallets: {
		base: '/wallets',
		byId: (id: number | string) => `/wallets/${id}`,
	},
	categories: {
		base: '/categories',
		byId: (id: number | string) => `/categories/${id}`,
		subcategories: (categoryId: number | string) => `/categories/${categoryId}/subcategories`,
		subcategoryById: (categoryId: number | string, subcategoryId: number | string) => `/categories/${categoryId}/subcategories/${subcategoryId}`,
	},
	transactions: {
		base: '/wallet-transactions',
	},
	currencies: {
		base: '/currencies',
	},
	rates: {
		base: '/exchange-rates',
		convert: '/exchange-rates/convert',
		all: '/exchange-rates/all',
	},
} as const
