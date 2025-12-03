import { Check, X } from 'lucide-react'
import Drawer from '@/components/Drawer/Drawer'
import { useTranslation } from '@/i18n'
import { BudgetPeriodType } from '@/types/entities/budget'

const periodOrder: BudgetPeriodType[] = [BudgetPeriodType.CUSTOM, BudgetPeriodType.WEEK, BudgetPeriodType.MONTH, BudgetPeriodType.YEAR]

const labelMap: Record<BudgetPeriodType, string> = {
	[BudgetPeriodType.CUSTOM]: 'budgets.period.custom',
	[BudgetPeriodType.WEEK]: 'budgets.period.week',
	[BudgetPeriodType.MONTH]: 'budgets.period.month',
	[BudgetPeriodType.YEAR]: 'budgets.period.year',
}

interface PeriodTypePickerDrawerProps {
	open: boolean
	onClose: () => void
	selectedType: BudgetPeriodType
	onSelect: (type: BudgetPeriodType) => void
	allowCustom?: boolean
}

export const PeriodTypePickerDrawer = ({ open, onClose, selectedType, onSelect, allowCustom = true }: PeriodTypePickerDrawerProps) => {
	const { t } = useTranslation()
	const availablePeriods = allowCustom ? periodOrder : periodOrder.filter(period => period !== BudgetPeriodType.CUSTOM)

	return (
		<Drawer open={open} onClose={onClose} className='h-[70vh] rounded-t-lg bg-background-secondary'>
			<div className='flex h-full flex-col'>
				<div className='flex items-center justify-between p-3'>
					<h2 className='text-lg font-medium'>{t('budgets.form.periodType')}</h2>
					<button type='button' onClick={onClose} className='rounded-full p-2' aria-label='Close'>
						<X />
					</button>
				</div>

				<div className='border-t border-divider bg-background-muted'>
					{availablePeriods.map(period => {
						const isSelected = period === selectedType
						return (
							<button key={period} type='button' onClick={() => onSelect(period)} className='w-full border-b border-divider text-left'>
								<div className='flex h-16 items-center px-3'>
									<span className='text-text'>{t(labelMap[period])}</span>
									{isSelected && <Check className='ml-auto text-accent' size={16} />}
								</div>
							</button>
						)
					})}
				</div>
			</div>
		</Drawer>
	)
}

export default PeriodTypePickerDrawer
