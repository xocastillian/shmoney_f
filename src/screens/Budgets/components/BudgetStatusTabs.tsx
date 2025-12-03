import { useTranslation } from '@/i18n'
import SegmentedTabs from '@/components/ui/SegmentedTabs/SegmentedTabs'
import { BudgetStatus } from '@/types/entities/budget'

interface BudgetStatusTabsProps {
	value: BudgetStatus
	onChange: (status: BudgetStatus) => void
	className?: string
}

const BudgetStatusTabs = ({ value, onChange, className }: BudgetStatusTabsProps) => {
	const { t } = useTranslation()
	const options = [
		{ value: BudgetStatus.ACTIVE, label: t('budgets.tabs.active') },
		{ value: BudgetStatus.CLOSED, label: t('budgets.tabs.closed') },
	]

	return <SegmentedTabs value={value} options={options} onChange={onChange} className={className} />
}

export default BudgetStatusTabs
