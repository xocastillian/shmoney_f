import { cn } from '@/lib/utils'
import type { Budget } from '@/types/entities/budget'

interface BudgetCardProps {
	budget: Budget
	formatCurrency: (value: number, currencyCode: string) => string
	formatRange: (start: Date, end: Date) => string
	t: (key: string) => string
	onClick?: () => void
}

export const BudgetCard = ({ budget, formatCurrency, onClick }: BudgetCardProps) => {
	const percentValue = Number.isFinite(budget.percentSpent) ? budget.percentSpent : 0
	const clampedPercent = Math.min(100, Math.max(0, percentValue))
	const progressColorClass =
		percentValue > 100 ? 'bg-danger' : percentValue > 75 ? 'bg-orange-500' : percentValue > 50 ? 'bg-yellow-400' : 'bg-accent'

	return (
		<article
			className={cn(
				'border-b border-divider bg-background-muted p-3',
				onClick && 'cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent'
			)}
			role={onClick ? 'button' : undefined}
			tabIndex={onClick ? 0 : undefined}
			onClick={onClick}
		>
			<div className='mb-3 flex items-center justify-between gap-2'>
				<h3 className='text-base font-semibold text-text'>{budget.name}</h3>
				<span>{Math.round(percentValue)}%</span>
			</div>

			<div className='h-2 rounded-full mb-2 bg-background-muted-2'>
				<div className={cn('h-full rounded-full transition-all', progressColorClass)} style={{ width: `${clampedPercent}%` }} />
			</div>

			<div className='flex items-center justify-between text-sm text-label'>
				<span>{formatCurrency(budget.spentAmount, budget.currencyCode)}</span>
				<span>{formatCurrency(budget.amountLimit, budget.currencyCode)}</span>
			</div>
		</article>
	)
}
