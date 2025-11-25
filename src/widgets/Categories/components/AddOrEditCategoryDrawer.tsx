import { useEffect, useId, useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import Drawer from '@/components/Drawer/Drawer'
import type { Category } from '@/types/entities/category'
import ColorPickerDrawer from '@/widgets/Wallets/components/ColorPickerDrawer'
import { colorOptions } from '@/widgets/Wallets/constants'
import CategoryForm from './CategoryForm'

export type CategoryFormValues = Pick<Category, 'name' | 'color' | 'icon'>

interface AddOrEditCategoryDrawerProps {
	open: boolean
	onClose: () => void
	initialCategory?: Partial<Category>
	onSubmit?: (values: CategoryFormValues) => void
	title?: string
}

const DEFAULT_ICON = 'CircleDollarSign'
const DEFAULT_COLOR = colorOptions[0] ?? '#F97316'

const AddOrEditCategoryDrawer = ({ open, onClose, initialCategory, onSubmit, title = 'Новая категория' }: AddOrEditCategoryDrawerProps) => {
	const [name, setName] = useState('')
	const [color, setColor] = useState(DEFAULT_COLOR)
	const [icon, setIcon] = useState(DEFAULT_ICON)
	const [isColorPickerOpen, setColorPickerOpen] = useState(false)
	const formId = useId()

	useEffect(() => {
		if (!open) {
			setColorPickerOpen(false)
			return
		}

		setName(initialCategory?.name ?? '')
		setColor(initialCategory?.color ?? DEFAULT_COLOR)
		setIcon(initialCategory?.icon ?? DEFAULT_ICON)
	}, [initialCategory, open])

	const isSubmitDisabled = !name.trim() || !color || !icon

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		if (isSubmitDisabled) return

		onSubmit?.({
			name: name.trim(),
			color,
			icon,
		})
	}

	const handleSelectColor = (nextColor: string) => {
		setColor(nextColor)
		setColorPickerOpen(false)
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
							Сохранить
						</button>
					</div>

					<div className='flex-1 overflow-y-auto'>
						<CategoryForm
							formId={formId}
							title={title}
							name={name}
							onNameChange={setName}
							color={color}
							onOpenColorPicker={() => setColorPickerOpen(true)}
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
		</>
	)
}

export default AddOrEditCategoryDrawer
