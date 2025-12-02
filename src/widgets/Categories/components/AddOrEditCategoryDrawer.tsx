import { useEffect, useId, useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import Loader from '@/components/ui/Loader/Loader'
import type { Category } from '@/types/entities/category'
import { CategoryStatus } from '@/types/entities/category'
import ColorPickerDrawer from '@/widgets/Wallets/components/ColorPickerDrawer'
import { colorOptions } from '@/widgets/Wallets/constants'
import IconPickerDrawer from './IconPickerDrawer'
import CategoryForm from './CategoryForm'
import { categoryIconOptions } from '../icons'
import useCategories from '@/hooks/useCategories'
import { useTranslation } from '@/i18n'
import { createPortal } from 'react-dom'
import Drawer from '@/components/Drawer/Drawer'

export type CategoryFormValues = Pick<Category, 'name' | 'color' | 'icon'>

interface AddOrEditCategoryDrawerProps {
	open: boolean
	onClose: () => void
	initialCategory?: Category
	onSubmit?: (values: CategoryFormValues) => void
	title?: string
	submitting?: boolean
}

const DEFAULT_ICON = categoryIconOptions[0]?.key ?? 'apple'
const DEFAULT_COLOR = colorOptions[0] ?? '#F97316'

const AddOrEditCategoryDrawer = ({ open, onClose, initialCategory, onSubmit, title, submitting = false }: AddOrEditCategoryDrawerProps) => {
	const [name, setName] = useState('')
	const [color, setColor] = useState(DEFAULT_COLOR)
	const [icon, setIcon] = useState(DEFAULT_ICON)
	const [isColorPickerOpen, setColorPickerOpen] = useState(false)
	const [isIconPickerOpen, setIconPickerOpen] = useState(false)
	const [internalSubmitting, setSubmitting] = useState(false)
	const formId = useId()
	const { createCategory, updateCategory, updateCategoryStatus } = useCategories()
	const { t } = useTranslation()
	const computedTitle = title ?? (initialCategory ? t('categories.drawer.editTitle') : t('categories.drawer.newTitle'))
	const isEditMode = Boolean(initialCategory)
	const isBusy = internalSubmitting || submitting
	const currentStatus = initialCategory?.status ?? CategoryStatus.ACTIVE

	useEffect(() => {
		if (!open) {
			setColorPickerOpen(false)
			return
		}

		setName(initialCategory?.name ?? '')
		setColor(initialCategory?.color ?? DEFAULT_COLOR)
		setIcon(initialCategory?.icon ?? DEFAULT_ICON)
	}, [initialCategory, open])

	const isSubmitDisabled = isBusy || !name.trim() || !color || !icon

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		if (isSubmitDisabled) return

		const payload = {
			name: name.trim(),
			color,
			icon,
		}

		try {
			setSubmitting(true)
			const saved = isEditMode && initialCategory ? await updateCategory(initialCategory.id, payload) : await createCategory(payload)

			onSubmit?.({
				name: saved.name,
				color: saved.color,
				icon: saved.icon,
			})

			onClose()
		} catch {
			// ошибки обрабатываются внутри useCategories
		} finally {
			setSubmitting(false)
		}
	}

	const handleSelectColor = (nextColor: string) => {
		setColor(nextColor)
		setColorPickerOpen(false)
	}

	const handleSelectIcon = (nextIcon: string) => {
		setIcon(nextIcon)
		setIconPickerOpen(false)
	}

	const handleToggleStatus = async () => {
		if (!initialCategory || isBusy) return
		const nextStatus = currentStatus === CategoryStatus.ARCHIVED ? CategoryStatus.ACTIVE : CategoryStatus.ARCHIVED

		try {
			setSubmitting(true)
			await updateCategoryStatus(initialCategory.id, { status: nextStatus })
			onSubmit?.({
				name: initialCategory.name,
				color: initialCategory.color,
				icon: initialCategory.icon,
			})
			onClose()
		} catch {
			// ошибки уже обработаны внутри useCategories
		} finally {
			setSubmitting(false)
		}
	}

	const statusActionType = currentStatus === CategoryStatus.ARCHIVED ? 'unarchive' : 'archive'

	return (
		<>
			<Drawer open={open} onClose={onClose} className='rounded-t-lg bg-background-secondary h-[100vh]' swipeable={false}>
				<div className='flex h-full flex-col'>
					<div className='flex items-center justify-between gap-3 p-3 border-b border-divider'>
						<h1 className='font-medium text-lg'>{computedTitle}</h1>
						<button type='button' onClick={onClose} className='rounded-full p-2' aria-label={t('categories.drawer.close')}>
							<X />
						</button>
					</div>

					<div className='flex-1 overflow-y-auto py-3'>
						<CategoryForm
							formId={formId}
							name={name}
							onNameChange={setName}
							color={color}
							onOpenColorPicker={() => setColorPickerOpen(true)}
							icon={icon}
							onOpenIconPicker={() => setIconPickerOpen(true)}
							onToggleStatus={isEditMode ? handleToggleStatus : undefined}
							disableStatusAction={isBusy}
							statusActionType={statusActionType}
							onSubmit={handleSubmit}
							submitLabel={t('common.save')}
							submitDisabled={isSubmitDisabled}
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

			{open &&
				isBusy &&
				typeof document !== 'undefined' &&
				createPortal(
					<div className='fixed inset-0 z-[999999] bg-black/80 backdrop-blur-sm flex items-center justify-center pointer-events-auto'>
						<div className='p-2'>
							<Loader />
						</div>
					</div>,
					document.body
				)}
		</>
	)
}

export default AddOrEditCategoryDrawer
