import { useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import MobileDateTimePickerField from '@/components/DateTimePicker/MobileDateTimePickerField'
import { formatDateTimeLocal } from '@/utils/date'
import { useTranslation } from '@/i18n'

interface BudgetMonthSwitcherProps {
	currentMonth: Date
	locale: string
	onChange: (nextMonth: Date) => void
	disableFuture?: boolean
	className?: string
}

const isSameMonth = (left: Date, right: Date) => left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth()
const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1)

const BudgetMonthSwitcher = ({ currentMonth, locale, onChange, disableFuture = true, className }: BudgetMonthSwitcherProps) => {
	const now = new Date()
	const isCurrentMonth = isSameMonth(currentMonth, now)
	const monthValue = useMemo(() => formatDateTimeLocal(startOfMonth(currentMonth)), [currentMonth])
	const maxSelectableDate = disableFuture ? startOfMonth(now) : undefined
	const { t } = useTranslation()

	const handleChange = (direction: 'prev' | 'next') => {
		if (direction === 'next' && disableFuture && isCurrentMonth) {
			return
		}
		const next = new Date(currentMonth)
		next.setDate(1)
		next.setMonth(currentMonth.getMonth() + (direction === 'next' ? 1 : -1))
		onChange(next)
	}

	return (
		<div className={cn('flex items-center gap-3 bg-background-muted py-2', className)}>
			<button
				type='button'
				onClick={() => handleChange('prev')}
				className='p-2 text-text transition hover:bg-background-muted active:scale-95'
				aria-label='Предыдущий месяц'
			>
				<ChevronLeft />
			</button>

			<MobileDateTimePickerField
				value={monthValue}
				onChange={value => {
					const next = startOfMonth(new Date(value))
					onChange(next)
				}}
				clearLabel={t('common.reset')}
				locale={locale}
				precision='month'
				maxDate={maxSelectableDate}
				clearable
				onClear={() => onChange(startOfMonth(new Date()))}
				renderTrigger={({ open, displayText, disabled: triggerDisabled }) => (
					<p
						role='button'
						tabIndex={0}
						onClick={() => {
							if (!triggerDisabled) open()
						}}
						onKeyDown={event => {
							if (triggerDisabled) return
							if (event.key === 'Enter' || event.key === ' ') {
								event.preventDefault()
								open()
							}
						}}
						aria-disabled={triggerDisabled}
						className='flex-1 cursor-pointer select-none text-center text-base font-medium capitalize outline-none focus-visible:ring-2 focus-visible:ring-offset-2'
						aria-label='Выбрать месяц'
					>
						{displayText}
					</p>
				)}
			/>

			<button
				type='button'
				onClick={() => handleChange('next')}
				disabled={disableFuture && isCurrentMonth}
				className='p-2 text-text transition disabled:text-label disabled:pointer-events-none'
				aria-label='Следующий месяц'
			>
				<ChevronRight />
			</button>
		</div>
	)
}

export default BudgetMonthSwitcher
