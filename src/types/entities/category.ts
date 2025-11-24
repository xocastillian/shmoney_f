export type CategoryEntryType = 'EXPENSE' | 'INCOME'

export interface Subcategory {
	id: number
	name: string
	color: string
	icon: string
	createdAt: Date | null
	updatedAt: Date | null
}

export interface Category {
	id: number
	name: string
	color: string
	icon: string
	subcategories: Subcategory[]
	createdAt: Date | null
	updatedAt: Date | null
}
