import { useCallback, useMemo, useState } from 'react'
import {
	createCategory as apiCreateCategory,
	createSubcategory as apiCreateSubcategory,
	deleteCategory as apiDeleteCategory,
	deleteSubcategory as apiDeleteSubcategory,
	listCategories,
	listSubcategories as apiListSubcategories,
	updateCategory as apiUpdateCategory,
	updateSubcategory as apiUpdateSubcategory,
} from '@api/client'
import type {
	CategoryCreateRequest,
	CategoryResponse,
	CategoryUpdateRequest,
	SubcategoryCreateRequest,
	SubcategoryResponse,
	SubcategoryUpdateRequest,
} from '@api/types'
import { useCategoriesStore } from '@/store/categoriesStore'
import type { Category, Subcategory } from '@/types/entities/category'

function mapSubcategory(response: SubcategoryResponse): Subcategory {
	return {
		id: response.id,
		name: response.name,
		color: response.color,
		icon: response.icon,
		createdAt: response.createdAt ?? null,
		updatedAt: response.updatedAt ?? null,
	}
}

function mapCategory(response: CategoryResponse): Category {
	return {
		id: response.id,
		name: response.name,
		color: response.color,
		icon: response.icon,
		subcategories: response.subcategories.map(mapSubcategory),
		createdAt: response.createdAt ?? null,
		updatedAt: response.updatedAt ?? null,
	}
}

export function useCategories() {
	const categories = useCategoriesStore(state => state.categories)
	const loading = useCategoriesStore(state => state.loading)
	const setCategories = useCategoriesStore(state => state.setCategories)
	const upsertCategory = useCategoriesStore(state => state.upsertCategory)
	const removeCategory = useCategoriesStore(state => state.removeCategory)
	const setLoading = useCategoriesStore(state => state.setLoading)
	const clearStore = useCategoriesStore(state => state.clear)
	const [error, setError] = useState<string | null>(null)
	const [actionLoading, setActionLoading] = useState(false)

	const fetchCategories = useCallback(async () => {
		setLoading(true)
		try {
			const data = await listCategories()
			const mapped = data.map(mapCategory)
			setCategories(mapped)
			setError(null)
			return mapped
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Не удалось загрузить категории'
			setError(message)
			throw err
		} finally {
			setLoading(false)
		}
	}, [setCategories, setLoading])

	const fetchSubcategories = useCallback(
		async (categoryId: number) => {
			try {
				const data = await apiListSubcategories(categoryId)
				const mapped = data.map(mapSubcategory)
				const category = categories.find(cat => cat.id === categoryId)
				if (category) {
					upsertCategory({ ...category, subcategories: mapped })
				}
				return mapped
			} catch (err) {
				const message = err instanceof Error ? err.message : 'Не удалось загрузить подкатегории'
				setError(message)
				throw err
			}
		},
		[categories, upsertCategory]
	)

	const createCategory = useCallback(
		async (payload: CategoryCreateRequest) => {
			setActionLoading(true)
			try {
				const created = await apiCreateCategory(payload)
				const mapped = mapCategory(created)
				upsertCategory(mapped)
				setError(null)
				return mapped
			} catch (err) {
				const message = err instanceof Error ? err.message : 'Не удалось создать категорию'
				setError(message)
				throw err
			} finally {
				setActionLoading(false)
			}
		},
		[upsertCategory]
	)

	const updateCategory = useCallback(
		async (categoryId: number, payload: CategoryUpdateRequest) => {
			setActionLoading(true)
			try {
				const updated = await apiUpdateCategory(categoryId, payload)
				const mapped = mapCategory(updated)
				upsertCategory(mapped)
				setError(null)
				return mapped
			} catch (err) {
				const message = err instanceof Error ? err.message : 'Не удалось обновить категорию'
				setError(message)
				throw err
			} finally {
				setActionLoading(false)
			}
		},
		[upsertCategory]
	)

	const deleteCategory = useCallback(
		async (categoryId: number) => {
			setActionLoading(true)
			try {
				await apiDeleteCategory(categoryId)
				removeCategory(categoryId)
				setError(null)
			} catch (err) {
				const message = err instanceof Error ? err.message : 'Не удалось удалить категорию'
				setError(message)
				throw err
			} finally {
				setActionLoading(false)
			}
		},
		[removeCategory]
	)

	const createSubcategory = useCallback(
		async (categoryId: number, payload: SubcategoryCreateRequest) => {
			setActionLoading(true)
			try {
				const created = await apiCreateSubcategory(categoryId, payload)
				const mapped = mapSubcategory(created)
				const category = categories.find(cat => cat.id === categoryId)
				if (category) {
					upsertCategory({ ...category, subcategories: [...category.subcategories, mapped] })
				}
				setError(null)
				return mapped
			} catch (err) {
				const message = err instanceof Error ? err.message : 'Не удалось создать подкатегорию'
				setError(message)
				throw err
			} finally {
				setActionLoading(false)
			}
		},
		[categories, upsertCategory]
	)

	const updateSubcategory = useCallback(
		async (categoryId: number, subcategoryId: number, payload: SubcategoryUpdateRequest) => {
			setActionLoading(true)
			try {
				const updated = await apiUpdateSubcategory(categoryId, subcategoryId, payload)
				const mapped = mapSubcategory(updated)
				const category = categories.find(cat => cat.id === categoryId)
				if (category) {
					upsertCategory({
						...category,
						subcategories: category.subcategories.map(sub => (sub.id === subcategoryId ? mapped : sub)),
					})
				}
				setError(null)
				return mapped
			} catch (err) {
				const message = err instanceof Error ? err.message : 'Не удалось обновить подкатегорию'
				setError(message)
				throw err
			} finally {
				setActionLoading(false)
			}
		},
		[categories, upsertCategory]
	)

	const deleteSubcategory = useCallback(
		async (categoryId: number, subcategoryId: number) => {
			setActionLoading(true)
			try {
				await apiDeleteSubcategory(categoryId, subcategoryId)
				const category = categories.find(cat => cat.id === categoryId)
				if (category) {
					upsertCategory({
						...category,
						subcategories: category.subcategories.filter(sub => sub.id !== subcategoryId),
					})
				}
				setError(null)
			} catch (err) {
				const message = err instanceof Error ? err.message : 'Не удалось удалить подкатегорию'
				setError(message)
				throw err
			} finally {
				setActionLoading(false)
			}
		},
		[categories, upsertCategory]
	)

	const clearCategories = useCallback(() => {
		clearStore()
		setError(null)
	}, [clearStore])

	const isBusy = useMemo(() => loading || actionLoading, [loading, actionLoading])

	return {
		categories,
		loading,
		actionLoading,
		isBusy,
		error,
		fetchCategories,
		fetchSubcategories,
		createCategory,
		updateCategory,
		deleteCategory,
		createSubcategory,
		updateSubcategory,
		deleteSubcategory,
		clearCategories,
	}
}

export default useCategories
