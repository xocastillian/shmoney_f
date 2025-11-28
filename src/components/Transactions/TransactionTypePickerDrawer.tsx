import { Check, X } from 'lucide-react'
import Drawer from '@/components/Drawer/Drawer'
import type { TransactionFilterType } from './filters'
import { useTranslation } from '@/i18n'

const typeOptions: { value: TransactionFilterType; labelKey: string }[] = [
	{ value: '', labelKey: 'transactions.filters.type.all' },
	{ value: 'EXPENSE', labelKey: 'transactions.filters.type.expense' },
	{ value: 'INCOME', labelKey: 'transactions.filters.type.income' },
	{ value: 'TRANSFER', labelKey: 'transactions.filters.type.transfer' },
]

interface TransactionTypePickerDrawerProps {
	open: boolean
	onClose: () => void
	selectedType: TransactionFilterType
	onSelect: (type: TransactionFilterType) => void
	title?: string
}

export default function TransactionTypePickerDrawer({ open, onClose, selectedType, onSelect, title }: TransactionTypePickerDrawerProps) {
	const { t } = useTranslation()

	return (
		<Drawer open={open} onClose={onClose} className='max-h-[70vh] rounded-t-lg bg-background-secondary'>
			<div className='flex h-full flex-col'>
				<div className='flex justify-end p-3'>
					<button type='button' onClick={onClose} className='p-2' aria-label={t('common.close')}>
						<X />
					</button>
				</div>

				<div className='flex flex-1 flex-col'>
					<h2 className='mb-4 px-3 text-sm font-medium text-label'>{title ?? t('transactions.filters.type.title')}</h2>
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
										<span className='text-text'>{t(option.labelKey)}</span>
										{isSelected && <Check className='ml-auto text-accent' size={16} />}
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
