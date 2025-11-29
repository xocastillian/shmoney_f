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
	submitDisabled?: boolean
	submitting?: boolean
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
	disableDelete = false,
	onSubmit,
	submitDisabled = false,
	submitting = false,
}: CategoryFormProps) => {
	const { t } = useTranslation()

	return (
		<>
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
					</div>
				</div>
			</form>

			<div className='fixed left-0 right-0 bottom-0 z-[70] border-t border-divider bg-background-muted p-3 h-[95px] pointer-events-auto'>
				<div className='mx-auto flex items-center gap-3 h-10 max-w-3xl w-full'>
					{onDelete ? (
						<>
							<button
								type='button'
								onClick={onDelete}
								disabled={disableDelete}
								className='flex items-center gap-3 w-1/2 h-full rounded-lg px-4 py-2 text-sm font-medium border border-danger text-danger bg-transparent disabled:opacity-50 justify-center'
							>
								<Trash className='text-danger w-5 h-5' />
								{t('common.delete')}
							</button>

							<button
								type='submit'
								form={formId}
								className='w-1/2 h-full rounded-lg px-4 py-2 text-sm font-medium bg-accent text-text-dark disabled:bg-background-secondary disabled:text-accent disabled:opacity-50 transition-colors duration-300 ease-in-out'
								disabled={submitDisabled}
								aria-busy={submitting}
							>
								{t('common.save')}
							</button>
						</>
					) : (
						<div className='w-full h-10'>
							<button
								type='submit'
								form={formId}
								className='w-full h-full rounded-lg px-4 py-2 text-sm font-medium bg-accent text-text-dark disabled:bg-background-secondary disabled:text-accent disabled:opacity-50 transition-colors duration-300 ease-in-out'
								disabled={submitDisabled}
								aria-busy={submitting}
							>
								{t('common.save')}
							</button>
						</div>
					)}
				</div>
			</div>
		</>
	)
}

export default CategoryForm
