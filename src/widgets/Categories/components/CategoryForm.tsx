import { Check, Info, Palette, Shapes, Trash } from 'lucide-react'
import type { ChangeEvent, FormEvent } from 'react'
import { categoryIconMap } from '../icons'
import { useTranslation } from '@/i18n'
import { cn } from '@/lib/utils'

interface CategoryFormProps {
	formId: string
	name: string
	onNameChange: (value: string) => void
	color: string
	onOpenColorPicker: () => void
	icon: string
	onOpenIconPicker: () => void
	onDelete?: () => void
	disableDelete?: boolean
	onSubmit: (event: FormEvent<HTMLFormElement>) => void
	submitLabel?: string
	submitDisabled?: boolean
}

const CategoryForm = ({
	formId,
	name,
	onNameChange,
	color,
	onOpenColorPicker,
	icon,
	onOpenIconPicker,
	onDelete,
	disableDelete,
	onSubmit,
	submitLabel,
	submitDisabled = false,
}: CategoryFormProps) => {
	const { t } = useTranslation()
	const resolvedSubmitLabel = submitLabel ?? t('common.save')

	return (
		<form id={formId} className='flex h-full flex-col' onSubmit={onSubmit}>
			<div>
				<h2 className='mb-3 px-3 text-sm font-medium text-label'>{t('common.general')}</h2>
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
				</div>
			</div>
			<h2 className='m-3 text-sm font-medium text-label'>{t('common.actions')}</h2>

			<div className='border-b border-divider bg-background-muted'>
				<button type='submit' className='flex h-16 w-full items-center px-3 text-access disabled:text-label' disabled={submitDisabled}>
					<Check className={cn('mr-3 transition-colors', submitDisabled ? 'text-label' : 'text-access')} />
					<span className={cn('transition-colors', submitDisabled ? 'text-label' : 'text-access')}>{resolvedSubmitLabel}</span>
				</button>
			</div>

			{onDelete && (
				<div className='border-b border-divider  bg-background-muted'>
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
		</form>
	)
}

export default CategoryForm
