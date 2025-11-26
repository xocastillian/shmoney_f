import { useMemo, useState, type ReactNode } from 'react'
import DatePicker from 'antd-mobile/es/components/date-picker'
import { Calendar, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDateTimeDisplay, formatDateTimeLocal } from '@/utils/date'

export interface MobileDateTimePickerFieldProps {
	value: string
	onChange: (value: string) => void
	placeholder?: string
	disabled?: boolean
	icon?: ReactNode
	className?: string
	locale?: string
	minDate?: Date
	maxDate?: Date
}

export const MobileDateTimePickerField = ({
	value,
	onChange,
	placeholder = 'Выберите дату и время',
	disabled = false,
	icon,
	className,
	locale = 'ru-RU',
	minDate,
	maxDate,
}: MobileDateTimePickerFieldProps) => {
	const [visible, setVisible] = useState(false)

	const dateValue = useMemo(() => {
		if (!value) return null
		const parsed = new Date(value)
		return Number.isNaN(parsed.getTime()) ? null : parsed
	}, [value])

	const displayText = useMemo(() => {
		if (!dateValue) return placeholder
		return formatDateTimeDisplay(dateValue, locale)
	}, [dateValue, placeholder, locale])

	const displayIcon = icon ?? <Calendar className='text-label' />
	const displayTextClass = dateValue ? 'text-text' : 'text-label'

	const handleConfirm = (next: Date) => {
		onChange(formatDateTimeLocal(next))
	}

	return (
		<>
			<button
				type='button'
				onClick={() => setVisible(true)}
				className={cn(
					'flex h-16 w-full items-center gap-3 px-3 text-left focus:outline-none focus-visible:bg-background-muted disabled:cursor-not-allowed disabled:opacity-60',
					className
				)}
				disabled={disabled}
			>
				{displayIcon}
				<span className={displayTextClass}>{displayText}</span>
			</button>

			<DatePicker
				visible={visible}
				value={dateValue ?? undefined}
				onClose={() => setVisible(false)}
				onCancel={() => setVisible(false)}
				onConfirm={next => {
					setVisible(false)
					handleConfirm(next)
				}}
				onSelect={handleConfirm}
				min={minDate}
				max={maxDate}
				precision='minute'
				cancelText={null}
				confirmText={<X className='h-6 w-6 text-text' />}
				style={{ height: '70vh', backgroundColor: 'var(--background-secondary)' }}
			/>
		</>
	)
}

export default MobileDateTimePickerField
