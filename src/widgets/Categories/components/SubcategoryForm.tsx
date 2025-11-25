import { Info, Palette, Shapes } from 'lucide-react'
import type { ChangeEvent, FormEvent } from 'react'
import { categoryIconMap } from '../icons'

interface SubcategoryFormProps {
	formId: string
	title: string
	categoryName?: string
	name: string
	onNameChange: (value: string) => void
	color: string
	onOpenColorPicker: () => void
	onOpenIconPicker: () => void
	icon: string
	onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

const SubcategoryForm = ({
	formId,
	title,
	categoryName,
	name,
	onNameChange,
	color,
	onOpenColorPicker,
	onOpenIconPicker,
	icon,
	onSubmit,
}: SubcategoryFormProps) => {
	return (
		<form id={formId} className='flex h-full flex-col gap-5' onSubmit={onSubmit}>
			<div>
				<h2 className='mb-1 px-3 text-xs font-medium uppercase tracking-wide text-label'>{title}</h2>
				{categoryName && <p className='px-3 text-sm text-label'>Категория: {categoryName}</p>}
				<div className='mt-3 overflow-hidden bg-background-muted'>
					<div className='border-b border-divider'>
						<div className='flex h-16 items-center px-3'>
							<Info className='mr-3 text-label' />
							<input
								className='flex-1 bg-transparent text-text placeholder:text-label outline-none'
								placeholder='Название подкатегории'
								value={name}
								onChange={(event: ChangeEvent<HTMLInputElement>) => onNameChange(event.target.value)}
								maxLength={100}
							/>
						</div>
					</div>

					<div className='border-b border-divider'>
						<button type='button' className='flex h-16 w-full items-center px-3 text-left' onClick={onOpenColorPicker}>
							<Palette className='mr-3 text-label transition-colors' style={{ color }} />
							<span className='text-text' style={{ color }}>
								Цвет
							</span>
						</button>
					</div>

					<div className='border-b border-divider'>
						<button type='button' className='flex h-16 w-full items-center px-3 text-left' onClick={onOpenIconPicker}>
							{(() => {
								const IconComponent = categoryIconMap[icon]
								return IconComponent ? <IconComponent className='mr-3 h-6 w-6 text-label' /> : <Shapes className='mr-3 text-label' />
							})()}
							<span className='text-text'>Иконка</span>
						</button>
					</div>
				</div>
			</div>
		</form>
	)
}

export default SubcategoryForm
