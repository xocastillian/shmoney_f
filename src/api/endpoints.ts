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
  transactions: {
    base: '/api/wallet-transactions',
  },
  currencies: {
    base: '/api/currencies',
  },
  rates: {
    base: '/api/exchange-rates',
    convert: '/api/exchange-rates/convert',
  },
  static: {
    telegramHtml: '/telegram.html',
  },
} as const;
