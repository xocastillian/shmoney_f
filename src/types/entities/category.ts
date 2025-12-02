export type CategoryEntryType = 'EXPENSE' | 'INCOME'

export const CategoryStatus = {
	ACTIVE: 'ACTIVE',
	ARCHIVED: 'ARCHIVED',
} as const

export type CategoryStatus = (typeof CategoryStatus)[keyof typeof CategoryStatus]

export interface Category {
	id: number
	name: string
	color: string
	icon: string
	status: CategoryStatus
	createdAt: Date | null
	updatedAt: Date | null
}
