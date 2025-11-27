import { useCallback, useState } from 'react'
import type { Category } from '@/types/entities/category'
import SettingsItem from '@/components/SettingsItem/SettingsItem'
import CategoriesDrawer from '@/widgets/Categories/components/CategoriesDrawer'
import AddOrEditCategoryDrawer from '@/widgets/Categories/components/AddOrEditCategoryDrawer'
import { useSettingsList } from './settings'
import { useCategories } from '@/hooks/useCategories'
import LanguageSettingsDrawer from './components/LanguageSettingsDrawer'
import { useSettings } from '@/hooks/useSettings'
import { useTranslation } from '@/i18n'

const SettingsScreen = () => {
	const [isCategoriesDrawerOpen, setCategoriesDrawerOpen] = useState(false)
	const [isAddCategoryDrawerOpen, setAddCategoryDrawerOpen] = useState(false)
	const [isLanguageDrawerOpen, setLanguageDrawerOpen] = useState(false)
	const [editingCategory, setEditingCategory] = useState<Category | null>(null)
	const { actionLoading: categoriesSubmitting } = useCategories()
	const { supportedLanguages, language, loading: settingsLoading, error: settingsError, changeLanguage } = useSettings()
	const { t } = useTranslation()

	const openCategoriesDrawer = useCallback(() => setCategoriesDrawerOpen(true), [])
	const closeCategoriesDrawer = useCallback(() => setCategoriesDrawerOpen(false), [])
	const openLanguageDrawer = useCallback(() => setLanguageDrawerOpen(true), [])
	const closeLanguageDrawer = useCallback(() => setLanguageDrawerOpen(false), [])

	const settings = useSettingsList({
		onCategoriesPress: openCategoriesDrawer,
		onLanguagePress: openLanguageDrawer,
	})

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

	const handleSelectLanguage = useCallback(
		async (nextLanguage: string) => {
			try {
				await changeLanguage(nextLanguage)
				setLanguageDrawerOpen(false)
			} catch {
				// errors handled in useSettings
			}
		},
		[changeLanguage]
	)

	return (
		<>
			<div className='p-3 text-lg font-medium'>{t('settings.title')}</div>

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
				title={editingCategory ? t('categories.drawer.editTitle') : t('categories.drawer.newTitle')}
			/>

			<LanguageSettingsDrawer
				open={isLanguageDrawerOpen}
				onClose={closeLanguageDrawer}
				languages={supportedLanguages}
				selectedLanguage={language}
				loading={settingsLoading}
				error={settingsError}
				onSelect={handleSelectLanguage}
			/>
		</>
	)
}

export default SettingsScreen
