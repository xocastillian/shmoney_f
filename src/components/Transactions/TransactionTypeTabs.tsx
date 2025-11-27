import { cn } from '@/lib/utils'
import { useTranslation } from '@/i18n'

const TRANSACTION_TABS = ['EXPENSE', 'INCOME', 'TRANSFER'] as const

export type TransactionTypeTabValue = (typeof TRANSACTION_TABS)[number]

interface TransactionTypeTabsProps {
	value: TransactionTypeTabValue
	onChange?: (value: TransactionTypeTabValue) => void
	className?: string
	options?: TransactionTypeTabValue[]
}

export const TransactionTypeTabs = ({ value = 'EXPENSE', onChange, className, options }: TransactionTypeTabsProps) => {
	const labelKeyMap: Record<TransactionTypeTabValue, string> = {
		EXPENSE: 'transactions.tabs.expense',
		INCOME: 'transactions.tabs.income',
		TRANSFER: 'transactions.tabs.transfer',
	}

	const { t } = useTranslation()
	const resolvedOptions = options && options.length > 0 ? options : TRANSACTION_TABS
	const tabsToRender = resolvedOptions.filter((option): option is TransactionTypeTabValue => TRANSACTION_TABS.includes(option))

	if (tabsToRender.length === 0) {
		return null
	}

	return (
		<div className={cn('flex bg-background-muted p-[2px]', className)}>
			{tabsToRender.map(option => {
				const isActive = option === value
				const labelKey = labelKeyMap[option]
				return (
					<button
						key={option}
						type='button'
						onClick={() => onChange?.(option)}
						className={cn('flex-1 rounded-lg px-3 py-2 text-sm', isActive ? 'bg-background text-accent' : 'text-label')}
					>
						{t(labelKey)}
					</button>
				)
			})}
		</div>
	)
}

export default TransactionTypeTabs
