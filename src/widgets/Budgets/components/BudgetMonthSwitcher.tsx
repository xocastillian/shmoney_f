import { useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import MobileDateTimePickerField from '@/components/DateTimePicker/MobileDateTimePickerField'
import { formatDateTimeLocal } from '@/utils/date'
import { useTranslation } from '@/i18n'

interface BudgetMonthSwitcherProps {
	currentDate: Date
	locale: string
	onChange: (nextDate: Date) => void
	disableFuture?: boolean
	className?: string
	mode?: 'MONTH' | 'WEEK' | 'YEAR'
}

const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1)
const startOfWeek = (date: Date) => {
	const base = new Date(date)
	const day = base.getDay()
	const diff = (day + 6) % 7
	base.setHours(0, 0, 0, 0)
	base.setDate(base.getDate() - diff)
	return base
}
const endOfWeek = (date: Date) => {
	const end = startOfWeek(date)
	end.setDate(end.getDate() + 6)
	end.setHours(23, 59, 59, 999)
	return end
}
const startOfYear = (date: Date) => new Date(date.getFullYear(), 0, 1)

const isCurrentPeriod = (mode: 'MONTH' | 'WEEK' | 'YEAR', value: Date, now: Date) => {
	if (mode === 'MONTH') {
		return value.getFullYear() === now.getFullYear() && value.getMonth() === now.getMonth()
	}
	if (mode === 'YEAR') {
		return value.getFullYear() === now.getFullYear()
	}
	const start = startOfWeek(value)
	const end = endOfWeek(value)
	return now >= start && now <= end
}

const BudgetMonthSwitcher = ({ currentDate, locale, onChange, disableFuture = true, className, mode = 'MONTH' }: BudgetMonthSwitcherProps) => {
	const now = new Date()
	const normalizedDate = useMemo(() => {
		if (mode === 'MONTH') return startOfMonth(currentDate)
		if (mode === 'YEAR') return startOfYear(currentDate)
		return startOfWeek(currentDate)
	}, [currentDate, mode])
	const isCurrent = isCurrentPeriod(mode, normalizedDate, now)
	const { t } = useTranslation()

	const handleChange = (direction: 'prev' | 'next') => {
		if (direction === 'next' && disableFuture && isCurrent) {
			return
		}
		const delta = direction === 'next' ? 1 : -1
		let next = new Date(normalizedDate)
		if (mode === 'MONTH') {
			next.setMonth(next.getMonth() + delta)
			next = startOfMonth(next)
		} else if (mode === 'YEAR') {
			next.setFullYear(next.getFullYear() + delta)
			next = startOfYear(next)
		} else {
			next.setDate(next.getDate() + delta * 7)
			next = startOfWeek(next)
		}
		onChange(next)
	}

	const renderLabel = () => {
		if (mode === 'MONTH') {
			const monthValue = formatDateTimeLocal(normalizedDate)
			const maxSelectableDate = disableFuture ? startOfMonth(now) : undefined
			return (
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
							aria-label='Выбрать период'
						>
							{displayText}
						</p>
					)}
				/>
			)
		}

		if (mode === 'YEAR') {
			return <p className='flex-1 text-center text-base font-medium'>{normalizedDate.getFullYear()}</p>
		}

		const start = startOfWeek(normalizedDate)
		const end = endOfWeek(normalizedDate)
		const formatter = new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'short' })
		return (
			<p className='flex-1 text-center text-base font-medium'>
				{formatter.format(start)} — {formatter.format(end)}
			</p>
		)
	}

	const nextDisabled = disableFuture && isCurrent

	return (
		<div className={cn('flex items-center gap-3 bg-background-muted py-2', className)}>
			<button
				type='button'
				onClick={() => handleChange('prev')}
				className='p-2 text-text transition hover:bg-background-muted active:scale-95'
				aria-label='Предыдущий период'
			>
				<ChevronLeft />
			</button>

			{renderLabel()}

			<button
				type='button'
				onClick={() => handleChange('next')}
				disabled={nextDisabled}
				className='p-2 text-text transition disabled:text-label disabled:pointer-events-none'
				aria-label='Следующий период'
			>
				<ChevronRight />
			</button>
		</div>
	)
}

export default BudgetMonthSwitcher
