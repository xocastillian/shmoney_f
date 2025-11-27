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
	options?: TransactionTypeTabValue[]
}

export const TransactionTypeTabs = ({ value = 'EXPENSE', onChange, className, options }: TransactionTypeTabsProps) => {
	const resolvedOptions = options && options.length > 0 ? options : TRANSACTION_TABS.map(tab => tab.key)
	const tabsToRender = resolvedOptions
		.map(option => TRANSACTION_TABS.find(tab => tab.key === option) ?? null)
		.filter((tab): tab is (typeof TRANSACTION_TABS)[number] => Boolean(tab))

	if (tabsToRender.length === 0) {
		return null
	}

	return (
		<div className={cn('flex bg-background-muted p-[2px]', className)}>
			{tabsToRender.map(tab => {
				const isActive = tab.key === value
				return (
					<button
						key={tab.key}
						type='button'
						onClick={() => onChange?.(tab.key)}
						className={cn('flex-1 rounded-lg px-3 py-2 text-sm', isActive ? 'bg-background text-accent' : 'text-label')}
					>
						{tab.label}
					</button>
				)
			})}
		</div>
	)
}

export default TransactionTypeTabs
