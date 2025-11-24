import { create } from 'zustand'
import type { Category } from '@/types/entities/category'

interface CategoriesState {
	categories: Category[]
	loading: boolean
	setCategories: (categories: Category[]) => void
	upsertCategory: (category: Category) => void
	removeCategory: (categoryId: number) => void
	setLoading: (loading: boolean) => void
	clear: () => void
}

export const useCategoriesStore = create<CategoriesState>(set => ({
	categories: [],
	loading: false,
	setCategories: categories => set({ categories }),
	upsertCategory: category =>
		set(state => {
			const exists = state.categories.some(c => c.id === category.id)
			return {
				categories: exists ? state.categories.map(c => (c.id === category.id ? category : c)) : [...state.categories, category],
			}
		}),
	removeCategory: categoryId => set(state => ({ categories: state.categories.filter(c => c.id !== categoryId) })),
	setLoading: loading => set({ loading }),
	clear: () => set({ categories: [], loading: false }),
}))
