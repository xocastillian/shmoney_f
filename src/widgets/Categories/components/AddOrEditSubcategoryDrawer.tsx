import { useEffect, useId, useState, type FormEvent } from 'react'
import { X } from 'lucide-react'

import Drawer from '@/components/Drawer/Drawer'
import type { Category, Subcategory } from '@/types/entities/category'
import ColorPickerDrawer from '@/widgets/Wallets/components/ColorPickerDrawer'
import { colorOptions } from '@/widgets/Wallets/constants'
import useCategories from '@/hooks/useCategories'
import SubcategoryForm from './SubcategoryForm'
import { categoryIconOptions } from '../icons'
import IconPickerDrawer from './IconPickerDrawer'

const DEFAULT_ICON = categoryIconOptions[0]?.key ?? 'apple'
const DEFAULT_COLOR = colorOptions[0] ?? '#F97316'

interface AddOrEditSubcategoryDrawerProps {
	open: boolean
	onClose: () => void
	category: Category | null
	initialSubcategory?: Subcategory
	onSuccess?: (subcategory: Subcategory) => void
}

const AddOrEditSubcategoryDrawer = ({ open, onClose, category, initialSubcategory, onSuccess }: AddOrEditSubcategoryDrawerProps) => {
	const { createSubcategory, updateSubcategory } = useCategories()
	const [name, setName] = useState('')
	const [color, setColor] = useState(DEFAULT_COLOR)
	const [icon, setIcon] = useState(DEFAULT_ICON)
	const [isColorPickerOpen, setColorPickerOpen] = useState(false)
	const [isIconPickerOpen, setIconPickerOpen] = useState(false)
	const [submitting, setSubmitting] = useState(false)
	const formId = useId()

	const isEditMode = Boolean(initialSubcategory)

	useEffect(() => {
		if (!open) {
			setColorPickerOpen(false)
			return
		}

		setName(initialSubcategory?.name ?? '')
		setColor(initialSubcategory?.color ?? DEFAULT_COLOR)
		setIcon(initialSubcategory?.icon ?? DEFAULT_ICON)
	}, [initialSubcategory, open])

	const handleSelectColor = (nextColor: string) => {
		setColor(nextColor)
		setColorPickerOpen(false)
	}

	const handleSelectIcon = (nextIcon: string) => {
		setIcon(nextIcon)
		setIconPickerOpen(false)
	}

	const isSubmitDisabled = !name.trim() || !color || !icon || !category || submitting

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		if (isSubmitDisabled || !category) return

		setSubmitting(true)
		const payload = {
			name: name.trim(),
			color,
			icon,
		}

		try {
			if (isEditMode && initialSubcategory) {
				const updated = await updateSubcategory(category.id, initialSubcategory.id, payload)
				onSuccess?.(updated)
			} else {
				const created = await createSubcategory(category.id, payload)
				onSuccess?.(created)
			}
			onClose()
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<>
			<Drawer
				open={open}
				onClose={onClose}
				className='max-h-[90vh] rounded-t-lg !bg-background-secondary'
				overlayClassName='bg-black/80 backdrop-blur-sm'
			>
				<div className='flex h-full flex-col'>
					<div className='flex items-center justify-between gap-3 p-3'>
						<button type='button' onClick={onClose} className='rounded-full' aria-label='Закрыть'>
							<X />
						</button>
						<button
							type='submit'
							form={formId}
							className='rounded-md px-4 py-2 text-sm font-medium bg-accent-orange text-text-dark disabled:bg-background-muted disabled:text-accent-orange disabled:opacity-50 transition-colors duration-300 ease-in-out'
							disabled={isSubmitDisabled}
						>
							{isEditMode ? 'Сохранить' : 'Добавить'}
						</button>
					</div>

					<div className='flex-1 overflow-y-auto'>
						<SubcategoryForm
							formId={formId}
							title={isEditMode ? 'Редактирование подкатегории' : 'Новая подкатегория'}
							categoryName={category?.name}
							name={name}
							onNameChange={setName}
							color={color}
							onOpenColorPicker={() => setColorPickerOpen(true)}
							icon={icon}
							onOpenIconPicker={() => setIconPickerOpen(true)}
							onSubmit={handleSubmit}
						/>
					</div>
				</div>
			</Drawer>

			<ColorPickerDrawer
				open={isColorPickerOpen}
				onClose={() => setColorPickerOpen(false)}
				colors={colorOptions}
				onSelect={handleSelectColor}
				selectedColor={color}
			/>

			<IconPickerDrawer open={isIconPickerOpen} onClose={() => setIconPickerOpen(false)} selectedIcon={icon} onSelect={handleSelectIcon} />
		</>
	)
}

export default AddOrEditSubcategoryDrawer
