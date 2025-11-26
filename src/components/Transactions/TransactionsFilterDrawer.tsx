import { useState } from 'react'
import { ListFilter, RotateCcw, X } from 'lucide-react'
import Drawer from '@/components/Drawer/Drawer'
import MobileDateTimePickerField from '@/components/DateTimePicker/MobileDateTimePickerField'
import type { TransactionsFilterState, TransactionFilterType } from './filters'
import TransactionTypePickerDrawer from './TransactionTypePickerDrawer'

interface TransactionsFilterDrawerProps {
	open: boolean
	onClose: () => void
	filters: TransactionsFilterState
	onFiltersChange: (changes: Partial<TransactionsFilterState>) => void
	onResetFilters?: () => void
	title?: string
}

const TransactionsFilterDrawer = ({ open, onClose, filters, onFiltersChange, onResetFilters, title = 'Фильтры' }: TransactionsFilterDrawerProps) => {
	const [isTypePickerOpen, setTypePickerOpen] = useState(false)

	return (
		<Drawer open={open} onClose={onClose} className='max-h-[70vh] rounded-lg bg-background-secondary'>
			<div className='flex h-full flex-col'>
				<div className='flex justify-end p-3'>
					<button type='button' onClick={onClose} aria-label='Закрыть'>
						<X />
					</button>
				</div>

				<div className='flex flex-1 flex-col'>
					<h2 className='mb-4 px-3 text-sm font-medium text-label'>{title}</h2>

					<div className='border-b border-divider bg-background-muted'>
						<button
							type='button'
							className='flex h-16 w-full items-center px-3 text-left focus:outline-none focus-visible:bg-background-muted disabled:cursor-not-allowed disabled:opacity-60'
							onClick={() => setTypePickerOpen(true)}
						>
							<ListFilter className='mr-3 text-label' />

							<span className='text-label'>
								{filters.type === 'EXPENSE' && 'Расходы'}
								{filters.type === 'INCOME' && 'Доходы'}
								{filters.type === 'TRANSFER' && 'Переводы'}
								{!filters.type && 'Все операции'}
							</span>
						</button>
					</div>

					<div className='border-b border-divider bg-background-muted'>
						<MobileDateTimePickerField value={filters.from} onChange={value => onFiltersChange({ from: value })} placeholder='Дата начала' />
					</div>

					<div className='border-b border-divider bg-background-muted'>
						<MobileDateTimePickerField value={filters.to} onChange={value => onFiltersChange({ to: value })} placeholder='Дата окончания' />
					</div>

					{onResetFilters && (
						<div className='border-b border-divider bg-background-muted'>
							<button
								type='button'
								className='flex h-16 w-full items-center px-3 text-left focus:outline-none focus-visible:bg-background-muted disabled:cursor-not-allowed disabled:opacity-60 text-danger'
								onClick={onResetFilters}
							>
								<RotateCcw className='mr-3 text-danger' />
								Сбросить
							</button>
						</div>
					)}
				</div>

				<TransactionTypePickerDrawer
					open={isTypePickerOpen}
					onClose={() => setTypePickerOpen(false)}
					selectedType={filters.type as TransactionFilterType}
					onSelect={type => onFiltersChange({ type })}
				/>
			</div>
		</Drawer>
	)
}

export default TransactionsFilterDrawer
