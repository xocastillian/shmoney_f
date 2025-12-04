import { useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { cn } from '@/lib/utils'

export interface CategoryPieChartDatum extends Record<string, unknown> {
	name: string
	value: number
	color: string
	formattedValue: string
	transactionCount?: number
}

interface CategoryPieChartProps<T extends CategoryPieChartDatum = CategoryPieChartDatum> {
	data: T[]
	defaultLabel: string
	fallbackValue: string
	className?: string
	activeIndex?: number | null
	onActiveSliceChange?: (slice: T | null, index: number | null) => void
}

const CategoryPieChart = <T extends CategoryPieChartDatum>({
	data,
	defaultLabel,
	fallbackValue,
	className,
	activeIndex: controlledActiveIndex,
	onActiveSliceChange,
}: CategoryPieChartProps<T>) => {
	const [uncontrolledActiveIndex, setUncontrolledActiveIndex] = useState<number | null>(null)
	const isControlled = typeof controlledActiveIndex !== 'undefined'
	const activeIndex = isControlled ? controlledActiveIndex : uncontrolledActiveIndex

	if (!data.length) {
		return null
	}

	const activeSlice = typeof activeIndex === 'number' ? data[activeIndex] : null

	const handleSliceClick = (index: number) => {
		const nextIndex = activeIndex === index ? null : index
		if (!isControlled) {
			setUncontrolledActiveIndex(nextIndex)
		}
		onActiveSliceChange?.(typeof nextIndex === 'number' ? data[nextIndex] ?? null : null, nextIndex)
	}

	return (
		<div className={cn('relative h-64 w-full', className)}>
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
						innerRadius={90}
						outerRadius={125}
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
	)
}

export default CategoryPieChart
