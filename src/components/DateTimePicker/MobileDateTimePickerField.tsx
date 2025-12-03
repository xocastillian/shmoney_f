import { useMemo, useState, type ReactNode } from 'react'
import DatePicker from 'antd-mobile/es/components/date-picker'
import { Calendar, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDateDisplay, formatDateTimeDisplay, formatDateTimeLocal } from '@/utils/date'
import { useTranslation } from '@/i18n'

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
	precision?: 'minute' | 'day' | 'month'
	clearable?: boolean
	clearLabel?: string
	onClear?: () => void
	renderTrigger?: (props: {
		open: () => void
		displayText: string
		displayIcon: ReactNode
		displayTextClass: string
		disabled: boolean
		className?: string
	}) => ReactNode
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
	precision = 'minute',
	clearable = false,
	onClear,
	renderTrigger,
}: MobileDateTimePickerFieldProps) => {
	const [visible, setVisible] = useState(false)
	const { t } = useTranslation()
	const clearText = t('common.reset')

	const dateValue = useMemo(() => {
		if (!value) return null
		const parsed = new Date(value)
		return Number.isNaN(parsed.getTime()) ? null : parsed
	}, [value])

	const displayText = useMemo(() => {
		if (!dateValue) return placeholder
		if (precision === 'day') {
			return formatDateDisplay(dateValue, locale)
		}
		if (precision === 'month') {
			return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(dateValue)
		}
		return formatDateTimeDisplay(dateValue, locale)
	}, [dateValue, placeholder, locale, precision])

	const displayIcon = icon ?? <Calendar className='text-label' />
	const displayTextClass = dateValue ? 'text-text' : 'text-label'

	const handleConfirm = (next: Date) => {
		let normalized: Date
		if (precision === 'day') {
			normalized = new Date(next.getFullYear(), next.getMonth(), next.getDate())
		} else if (precision === 'month') {
			normalized = new Date(next.getFullYear(), next.getMonth(), 1)
		} else {
			normalized = next
		}
		onChange(formatDateTimeLocal(normalized))
	}

	const openPicker = () => {
		if (disabled) return
		setVisible(true)
	}

	const handleClear = () => {
		setVisible(false)
		if (onClear) {
			onClear()
		} else {
			onChange('')
		}
	}

	const triggerNode = renderTrigger ? (
		renderTrigger({ open: openPicker, displayText, displayIcon, displayTextClass, disabled, className })
	) : (
		<button
			type='button'
			onClick={openPicker}
			className={cn(
				'flex h-16 w-full items-center gap-3 px-3 text-left focus:outline-none focus-visible:bg-background-muted disabled:cursor-not-allowed disabled:opacity-60',
				className
			)}
			disabled={disabled}
		>
			{displayIcon}
			<span className={displayTextClass}>{displayText}</span>
		</button>
	)

	return (
		<>
			{triggerNode}

			<DatePicker
				visible={visible}
				value={dateValue ?? undefined}
				onClose={() => setVisible(false)}
				onCancel={clearable ? handleClear : () => setVisible(false)}
				onConfirm={next => {
					setVisible(false)
					handleConfirm(next)
				}}
				onSelect={handleConfirm}
				min={minDate}
				max={maxDate}
				precision={precision}
				cancelText={clearable ? clearText : null}
				confirmText={<X className='h-6 w-6 text-text' />}
				style={{ height: '70vh', backgroundColor: 'var(--background-secondary)' }}
			/>
		</>
	)
}

export default MobileDateTimePickerField
