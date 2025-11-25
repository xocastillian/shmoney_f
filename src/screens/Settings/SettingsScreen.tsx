import { useCallback, useMemo, useState } from 'react'
import SettingsItem from '@/components/SettingsItem/SettingsItem'
import CategoriesDrawer from '@/widgets/Categories/components/CategoriesDrawer'
import AddOrEditCategoryDrawer from '@/widgets/Categories/components/AddOrEditCategoryDrawer'
import { createSettings } from './settings'

const SettingsScreen = () => {
	const [isCategoriesDrawerOpen, setCategoriesDrawerOpen] = useState(false)
	const [isAddCategoryDrawerOpen, setAddCategoryDrawerOpen] = useState(false)

	const openCategoriesDrawer = useCallback(() => setCategoriesDrawerOpen(true), [])
	const closeCategoriesDrawer = useCallback(() => setCategoriesDrawerOpen(false), [])

	const settings = useMemo(
		() =>
			createSettings({
				onCategoriesPress: openCategoriesDrawer,
			}),
		[openCategoriesDrawer]
	)

	const handleSelectCategory = useCallback(() => {
		setCategoriesDrawerOpen(false)
	}, [])

	const handleAddCategory = useCallback(() => {
		setAddCategoryDrawerOpen(true)
	}, [])

	const closeAddCategoryDrawer = useCallback(() => {
		setAddCategoryDrawerOpen(false)
	}, [])

	const handleSubmitCategory = useCallback(() => {
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
			<AddOrEditCategoryDrawer open={isAddCategoryDrawerOpen} onClose={closeAddCategoryDrawer} onSubmit={handleSubmitCategory} />
		</>
	)
}

export default SettingsScreen
