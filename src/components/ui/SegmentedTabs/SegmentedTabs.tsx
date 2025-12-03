import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface SegmentedTabOption<T extends string | number> {
	value: T
	label: ReactNode
	disabled?: boolean
}

interface SegmentedTabsProps<T extends string | number> {
	value: T
	options: Array<SegmentedTabOption<T>>
	onChange?: (value: T) => void
	className?: string
}

const SegmentedTabs = <T extends string | number>({ value, options, onChange, className }: SegmentedTabsProps<T>) => {
	if (options.length === 0) {
		return null
	}

	return (
		<div className={cn('flex bg-background-muted p-1', className)}>
			{options.map(option => {
				const isActive = option.value === value
				return (
					<button
						key={option.value}
						type='button'
						onClick={() => {
							if (option.disabled) return
							onChange?.(option.value)
						}}
						className={cn(
							'flex-1 rounded-lg px-3 py-2 text-sm transition-colors',
							isActive ? 'bg-background text-accent shadow-sm' : 'text-label',
							option.disabled && 'cursor-not-allowed opacity-60'
						)}
						disabled={option.disabled}
						aria-pressed={isActive}
					>
						{option.label}
					</button>
				)
			})}
		</div>
	)
}

export default SegmentedTabs
