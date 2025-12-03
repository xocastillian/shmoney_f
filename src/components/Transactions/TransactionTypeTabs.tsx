import { useTranslation } from '@/i18n'
import SegmentedTabs from '@/components/ui/SegmentedTabs/SegmentedTabs'

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

	const optionsLocal = tabsToRender.map(option => ({
		value: option,
		label: t(labelKeyMap[option]),
	}))

	return <SegmentedTabs value={value} options={optionsLocal} onChange={onChange} className={className} />
}

export default TransactionTypeTabs
