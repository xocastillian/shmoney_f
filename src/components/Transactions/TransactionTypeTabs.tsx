import { cn } from '@/lib/utils'

const TRANSACTION_TABS = [
	{ key: 'EXPENSE', label: 'Расход' },
	{ key: 'INCOME', label: 'Доход' },
	{ key: 'TRANSFER', label: 'Перевод' },
] as const

export type TransactionTypeTabValue = (typeof TRANSACTION_TABS)[number]['key']

interface TransactionTypeTabsProps {
	value: TransactionTypeTabValue
	onChange?: (value: TransactionTypeTabValue) => void
	className?: string
}

export const TransactionTypeTabs = ({ value = 'EXPENSE', onChange, className }: TransactionTypeTabsProps) => {
	return (
		<div className={cn('flex bg-background-muted p-[2px]', className)}>
			{TRANSACTION_TABS.map(tab => {
				const isActive = tab.key === value
				return (
					<button
						key={tab.key}
						type='button'
						onClick={() => onChange?.(tab.key)}
						className={cn('flex-1 rounded-lg px-3 py-2 text-sm transition-colors', isActive ? 'bg-background text-accent-orange' : 'text-label')}
					>
						{tab.label}
					</button>
				)
			})}
		</div>
	)
}

export default TransactionTypeTabs
