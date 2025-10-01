import { endpoints } from './endpoints'
import { get } from './http'
import { UserResponseSchema } from './schemas'
import { WalletResponseSchema } from './schemas'
import { WalletTransactionResponseSchema } from './schemas'
import type { UserResponse, WalletResponse, WalletTransactionResponse } from './types'

export async function listUsers(): Promise<UserResponse[]> {
	const data = await get<unknown>(endpoints.users.base)
	return UserResponseSchema.array().parse(data)
}

export async function listAllWallets(): Promise<WalletResponse[]> {
	const data = await get<unknown>(endpoints.wallets.base)
	return WalletResponseSchema.array().parse(data)
}

export async function listAllTransactions(): Promise<WalletTransactionResponse[]> {
	const data = await get<unknown>(endpoints.transactions.base)
	return WalletTransactionResponseSchema.array().parse(data)
}
