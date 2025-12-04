import { useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { cn } from '@/lib/utils'

export interface CategoryPieChartWidgetDatum extends Record<string, unknown> {
	name: string
	value: number
	color: string
	formattedValue: string
	transactionCount?: number
	categoryId?: number
}

interface CategoryPieChartWidgetProps<T extends CategoryPieChartWidgetDatum = CategoryPieChartWidgetDatum> {
	data: T[]
	defaultLabel: string
	fallbackValue: string
	className?: string
	containerClassName?: string
	title?: string
	emptyLabel?: string
	showActions?: boolean
	actionLabel?: string
	actionButtonClassName?: string
	actionDisabled?: boolean
	onActionClick?: () => void
	activeIndex?: number | null
	onActiveSliceChange?: (slice: T | null, index: number | null) => void
}

const CategoryPieChartWidget = <T extends CategoryPieChartWidgetDatum>({
	data,
	defaultLabel,
	fallbackValue,
	className,
	containerClassName,
	title,
	emptyLabel,
	showActions = false,
	actionLabel,
	actionButtonClassName,
	actionDisabled = false,
	onActionClick,
	activeIndex: controlledActiveIndex,
	onActiveSliceChange,
}: CategoryPieChartWidgetProps<T>) => {
	const [uncontrolledActiveIndex, setUncontrolledActiveIndex] = useState<number | null>(null)
	const isControlled = typeof controlledActiveIndex !== 'undefined'
	const activeIndex = isControlled ? controlledActiveIndex : uncontrolledActiveIndex

	const activeSlice = typeof activeIndex === 'number' ? data[activeIndex] : null

	const handleSliceClick = (index: number) => {
		const nextIndex = activeIndex === index ? null : index
		if (!isControlled) {
			setUncontrolledActiveIndex(nextIndex)
		}
		onActiveSliceChange?.(typeof nextIndex === 'number' ? data[nextIndex] ?? null : null, nextIndex)
	}

	return (
		<div className={cn('w-full rounded-xl bg-background-muted py-3', containerClassName)}>
			{data.length === 0 ? (
				<div className='flex items-center justify-center px-6 text-center text-sm text-label'>{emptyLabel}</div>
			) : (
				<>
					{title && (
						<div className='mb-3 px-3'>
							<h2 className='text-base border-b border-divider pb-3 w-full'>{title}</h2>
						</div>
					)}
					<div className='flex flex-col items-center gap-3'>
						<div className='bg-background-muted-2 w-full'>
							<div className={cn('relative h-[300px] w-full', className)}>
								<div className='pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center'>
									<span className='font-medium text-label text-sm'>{activeSlice?.name ?? defaultLabel}</span>
									<span className='font-semibold text-base'>{activeSlice?.formattedValue ?? fallbackValue}</span>
								</div>
								<ResponsiveContainer width='100%' height='100%'>
									<PieChart accessibilityLayer={false}>
										<Pie
											data={data}
											dataKey='value'
											nameKey='name'
											innerRadius={100}
											outerRadius={130}
											paddingAngle={1}
											labelLine={false}
											isAnimationActive={false}
											onClick={(_, index) => handleSliceClick(index)}
										>
											{data.map((entry, index) => (
												<Cell
													key={`${entry.name}-${index}`}
													fill={entry.color}
													stroke='none'
													opacity={activeIndex === null || activeIndex === index ? 1 : 0.2}
													style={{ transition: 'opacity 200ms ease' }}
												/>
											))}
										</Pie>
									</PieChart>
								</ResponsiveContainer>
							</div>
						</div>

						{showActions && actionLabel && data.length > 0 && (
							<div className='w-full px-3'>
								<button
									type='button'
									onClick={onActionClick}
									disabled={actionDisabled}
									className={cn(
										'w-full rounded-md bg-accent px-4 py-2 text-sm font-medium text-text-dark transition-colors duration-300 ease-in-out disabled:bg-background-muted disabled:text-accent disabled:opacity-50',
										actionButtonClassName
									)}
								>
									{actionLabel}
								</button>
							</div>
						)}
					</div>
				</>
			)}
		</div>
	)
}

export default CategoryPieChartWidget
