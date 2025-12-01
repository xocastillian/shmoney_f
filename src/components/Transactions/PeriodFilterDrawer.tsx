import { Check, X } from 'lucide-react'
import type { TransactionPeriodFilter } from './filters'
import { periodOptions } from './filters'
import { useTranslation } from '@/i18n'
import Drawer from '../Drawer/Drawer'
import MobileDateTimePickerField from '../DateTimePicker/MobileDateTimePickerField'

interface PeriodFilterDrawerProps {
	open: boolean
	onClose: () => void
	from: string
	to: string
	period: TransactionPeriodFilter
	onPeriodChange: (period: TransactionPeriodFilter) => void
	onDateChange: (field: 'from' | 'to', value: string) => void
}

const quickPeriodOptions = periodOptions.filter(option => option.value !== '')

const PeriodFilterDrawer = ({ open, onClose, period, onPeriodChange, from, to, onDateChange }: PeriodFilterDrawerProps) => {
	const { t, locale } = useTranslation()

	return (
		<Drawer open={open} onClose={onClose} className='rounded-t-lg bg-background-secondary' swipeable={false}>
			<div className='flex h-full flex-col'>
				<div className='flex justify-between items-center p-3'>
					<h2 className='text-lg font-medium'>{t('transactions.filters.period.placeholder')}</h2>

					<button type='button' onClick={onClose} className='rounded-full p-2' aria-label={t('common.close')}>
						<X />
					</button>
				</div>

				<div className='flex flex-1 flex-col pb-10'>
					<div className='bg-background-muted'>
						<div className='flex flex-col'>
							{quickPeriodOptions.map(option => {
								const isSelected = period === option.value
								return (
									<button
										key={option.value}
										type='button'
										onClick={() => {
											onPeriodChange(isSelected ? '' : option.value)
											onClose()
										}}
										className='flex h-16 w-full items-center border-b border-divider px-3 text-left focus:outline-none focus-visible:bg-background-muted'
										aria-pressed={isSelected}
									>
										<span className={isSelected ? 'text-text' : 'text-label'}>{t(option.labelKey)}</span>
										{isSelected && <Check className='ml-auto text-accent' size={16} />}
									</button>
								)
							})}
						</div>
					</div>

					<div className='border-b border-divider bg-background-muted flex'>
						<MobileDateTimePickerField
							value={from}
							onChange={value => onDateChange('from', value)}
							placeholder={t('transactions.filters.period.start')}
							precision='day'
							locale={locale}
						/>

						<MobileDateTimePickerField
							value={to}
							onChange={value => onDateChange('to', value)}
							placeholder={t('transactions.filters.period.end')}
							precision='day'
							locale={locale}
						/>
					</div>
				</div>
			</div>
		</Drawer>
	)
}

export default PeriodFilterDrawer
