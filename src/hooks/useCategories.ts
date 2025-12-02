import { useCallback, useMemo, useState } from 'react'
import {
	createCategory as apiCreateCategory,
	listCategories,
	updateCategory as apiUpdateCategory,
	updateCategoryStatus as apiUpdateCategoryStatus,
} from '@api/client'
import type { CategoryCreateRequest, CategoryResponse, CategoryUpdateRequest, CategoryStatusUpdateRequest } from '@api/types'
import { useCategoriesStore } from '@/store/categoriesStore'
import type { Category } from '@/types/entities/category'

function mapCategory(response: CategoryResponse): Category {
	return {
		id: response.id,
		name: response.name,
		color: response.color,
		icon: response.icon,
		status: response.status,
		createdAt: response.createdAt ?? null,
		updatedAt: response.updatedAt ?? null,
	}
}

export function useCategories() {
	const categories = useCategoriesStore(state => state.categories)
	const loading = useCategoriesStore(state => state.loading)
	const setCategories = useCategoriesStore(state => state.setCategories)
	const upsertCategory = useCategoriesStore(state => state.upsertCategory)
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

	const updateCategoryStatus = useCallback(
		async (categoryId: number, payload: CategoryStatusUpdateRequest) => {
			setActionLoading(true)
			try {
				const updated = await apiUpdateCategoryStatus(categoryId, payload)
				const mapped = mapCategory(updated)
				upsertCategory(mapped)
				setError(null)
				return mapped
			} catch (err) {
				const message = err instanceof Error ? err.message : 'Не удалось обновить статус категории'
				setError(message)
				throw err
			} finally {
				setActionLoading(false)
			}
		},
		[upsertCategory]
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
		createCategory,
		updateCategory,
		updateCategoryStatus,
		clearCategories,
	}
}

export default useCategories
