import { cn } from '@/lib/utils'

interface CashFlowWidgetProps {
	title: string
	amountDisplay: string
	amountClassName?: string
	percentDisplay: string
	percentClassName?: string
	incomeLabel: string
	incomeDisplay: string
	expenseLabel: string
	expenseDisplay: string
	emptyLabel?: string
	hasData?: boolean
	className?: string
	contentClassName?: string
}

const CashFlowWidget = ({
	title,
	amountDisplay,
	amountClassName,
	percentDisplay,
	percentClassName,
	incomeLabel,
	incomeDisplay,
	expenseLabel,
	expenseDisplay,
	emptyLabel,
	hasData = true,
	className,
	contentClassName,
}: CashFlowWidgetProps) => {
	if (!hasData) {
		return (
			<div className={cn('w-full rounded-xl bg-background-muted py-3 shadow-sm backdrop-blur', className)}>
				<div className='mb-3 px-3'>
					<h2 className='text-base border-b border-divider pb-3 w-full'>{title}</h2>
				</div>
				<div className='px-3 text-sm text-label'>{emptyLabel}</div>
			</div>
		)
	}

	return (
		<div className={cn('w-full rounded-xl bg-background-muted py-3 shadow-sm backdrop-blur', className)}>
			<div className='mb-3 px-3'>
				<h2 className='text-base border-b border-divider pb-3 w-full'>{title}</h2>
			</div>

			<div className={cn('flex flex-col gap-3', contentClassName)}>
				<div className='bg-background-muted-2 p-3'>
					<div className='mb-5 flex items-center justify-between'>
						<span className={cn('text-2xl font-semibold', amountClassName)}>{amountDisplay}</span>
						<span className={cn('text-sm font-medium text-text-dark py-1 px-2 rounded-lg', percentClassName)}>{percentDisplay}</span>
					</div>

					<ul className='space-y-1'>
						<li className='flex items-center justify-between'>
							<span className='text-sm'>{incomeLabel}</span>
							<span className='text-base font-semibold text-access'>{incomeDisplay}</span>
						</li>
						<li className='flex items-center justify-between'>
							<span className='text-sm'>{expenseLabel}</span>
							<span className='text-base font-semibold text-danger'>{expenseDisplay}</span>
						</li>
					</ul>
				</div>
			</div>
		</div>
	)
}

export default CashFlowWidget
