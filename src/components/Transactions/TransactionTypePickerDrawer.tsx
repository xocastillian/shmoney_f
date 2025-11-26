import { Check, X } from 'lucide-react'
import Drawer from '@/components/Drawer/Drawer'
import type { TransactionFilterType } from './filters'

const typeOptions: { value: TransactionFilterType; label: string }[] = [
	{ value: '', label: 'Все операции' },
	{ value: 'EXPENSE', label: 'Расходы' },
	{ value: 'INCOME', label: 'Доходы' },
	{ value: 'TRANSFER', label: 'Переводы' },
]

interface TransactionTypePickerDrawerProps {
	open: boolean
	onClose: () => void
	selectedType: TransactionFilterType
	onSelect: (type: TransactionFilterType) => void
	title?: string
}

export default function TransactionTypePickerDrawer({ open, onClose, selectedType, onSelect, title = 'Тип операции' }: TransactionTypePickerDrawerProps) {
	return (
		<Drawer open={open} onClose={onClose} className='max-h-[70vh] rounded-t-lg bg-background-secondary'>
			<div className='flex h-full flex-col'>
				<div className='flex justify-end p-3'>
					<button type='button' onClick={onClose} aria-label='Закрыть'>
						<X />
					</button>
				</div>

				<div className='flex flex-1 flex-col'>
					<h2 className='mb-4 px-3 text-sm font-medium text-label'>{title}</h2>
					<div className='bg-background-muted'>
						{typeOptions.map(option => {
							const isSelected = option.value === selectedType
							return (
								<button
									key={option.value || 'all'}
									type='button'
									onClick={() => {
										onSelect(option.value)
										onClose()
									}}
									className='w-full border-b border-divider text-left last:border-b-0 focus:outline-none focus-visible:bg-background-muted'
								>
									<div className='flex h-16 items-center px-3'>
										<span className='text-text'>{option.label}</span>
										{isSelected && <Check className='ml-auto text-primary' size={16} />}
									</div>
								</button>
							)
						})}
					</div>
				</div>
			</div>
		</Drawer>
	)
}
