import { useCallback, useMemo, useState } from 'react'
import type { Category } from '@/types/entities/category'
import SettingsItem from '@/components/SettingsItem/SettingsItem'
import CategoriesDrawer from '@/widgets/Categories/components/CategoriesDrawer'
import AddOrEditCategoryDrawer from '@/widgets/Categories/components/AddOrEditCategoryDrawer'
import { createSettings } from './settings'
import { useCategories } from '@/hooks/useCategories'

const SettingsScreen = () => {
	const [isCategoriesDrawerOpen, setCategoriesDrawerOpen] = useState(false)
	const [isAddCategoryDrawerOpen, setAddCategoryDrawerOpen] = useState(false)
	const [editingCategory, setEditingCategory] = useState<Category | null>(null)
	const { actionLoading: categoriesSubmitting } = useCategories()

	const openCategoriesDrawer = useCallback(() => setCategoriesDrawerOpen(true), [])
	const closeCategoriesDrawer = useCallback(() => setCategoriesDrawerOpen(false), [])

	const settings = useMemo(
		() =>
			createSettings({
				onCategoriesPress: openCategoriesDrawer,
			}),
		[openCategoriesDrawer]
	)

	const handleSelectCategory = useCallback((category: Category) => {
		setEditingCategory(category)
		setAddCategoryDrawerOpen(true)
	}, [])

	const handleAddCategory = useCallback(() => {
		setEditingCategory(null)
		setAddCategoryDrawerOpen(true)
	}, [])

	const closeAddCategoryDrawer = useCallback(() => {
		setEditingCategory(null)
		setAddCategoryDrawerOpen(false)
	}, [])

	const handleSubmitCategory = useCallback(() => {
		setEditingCategory(null)
		setAddCategoryDrawerOpen(false)
	}, [])

	return (
		<>
			<div className='p-3 text-lg font-medium'>Настройки</div>

			<div>
				{settings.map(setting => (
					<SettingsItem key={setting.title} setting={setting} />
				))}
			</div>

			<CategoriesDrawer open={isCategoriesDrawerOpen} onClose={closeCategoriesDrawer} onSelect={handleSelectCategory} onAdd={handleAddCategory} />

			<AddOrEditCategoryDrawer
				open={isAddCategoryDrawerOpen}
				onClose={closeAddCategoryDrawer}
				initialCategory={editingCategory ?? undefined}
				onSubmit={handleSubmitCategory}
				submitting={categoriesSubmitting}
				title={editingCategory ? 'Редактирование категории' : 'Новая категория'}
			/>
		</>
	)
}

export default SettingsScreen
