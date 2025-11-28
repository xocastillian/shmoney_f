import { Info, Palette, Shapes, Trash } from 'lucide-react'
import type { ChangeEvent, FormEvent } from 'react'
import { categoryIconMap } from '../icons'
import { useTranslation } from '@/i18n'

interface CategoryFormProps {
	formId: string
	title: string
	name: string
	onNameChange: (value: string) => void
	color: string
	onOpenColorPicker: () => void
	icon: string
	onOpenIconPicker: () => void
	onDelete?: () => void
	disableDelete?: boolean
	onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

const CategoryForm = ({
	formId,
	title,
	name,
	onNameChange,
	color,
	onOpenColorPicker,
	icon,
	onOpenIconPicker,
	onDelete,
	disableDelete,
	onSubmit,
}: CategoryFormProps) => {
	const { t } = useTranslation()

	return (
		<form id={formId} className='flex h-full flex-col gap-5' onSubmit={onSubmit}>
			<div>
				<h2 className='mb-3 px-3 text-sm font-medium text-label'>{title}</h2>
				<div className='overflow-hidden bg-background-muted'>
					<div className='border-b border-divider'>
						<div className='flex h-16 items-center px-3'>
							<Info className='mr-3 text-label' />
							<input
								className='flex-1 bg-transparent text-text placeholder:text-label outline-none'
								placeholder={t('categories.form.namePlaceholder')}
								value={name}
								onChange={(event: ChangeEvent<HTMLInputElement>) => onNameChange(event.target.value)}
								maxLength={100}
							/>
						</div>
					</div>

					<div className='border-b border-divider'>
						<button type='button' className='flex h-16 w-full items-center px-3 text-left' onClick={onOpenColorPicker}>
							<Palette className='mr-3 text-label transition-colors' style={{ color }} />
							<span className='text-text'>{t('categories.form.color')}</span>
						</button>
					</div>

					<div className='border-b border-divider'>
						<button type='button' className='flex h-16 w-full items-center px-3 text-left' onClick={onOpenIconPicker}>
							{(() => {
								const IconComponent = categoryIconMap[icon]
								return IconComponent ? <IconComponent className='mr-3 h-6 w-6 text-label' /> : <Shapes className='mr-3 text-label' />
							})()}
							<span className='text-text'>{t('categories.form.icon')}</span>
						</button>
					</div>

					{onDelete && (
						<div className='border-b border-divider'>
							<button
								type='button'
								onClick={onDelete}
								className='flex h-16 w-full items-center px-3 text-left disabled:opacity-60'
								disabled={disableDelete}
							>
								<Trash className='mr-3 text-danger' />
								<span className='text-danger'>{t('categories.form.delete')}</span>
							</button>
						</div>
					)}
				</div>
			</div>
		</form>
	)
}

export default CategoryForm
