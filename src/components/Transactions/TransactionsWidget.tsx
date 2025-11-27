import type { TransactionFeedItem } from '@api/types'
import Button from '../ui/Button/Button'
import TransactionsList, { type TransactionsListProps } from './TransactionsList'

export interface TransactionsWidgetProps extends Omit<TransactionsListProps, 'items'> {
	items: TransactionFeedItem[]
	loading?: boolean
	error?: string | null
	onOpenDrawer?: () => void
}

export const TransactionsWidget = ({
	items,
	loading = false,
	error = null,
	walletById = {},
	categoryById = {},
	onOpenDrawer,
	onItemClick,
	limit = 5,
}: TransactionsWidgetProps) => {
	const shouldRenderSkeleton = loading

	if (shouldRenderSkeleton) {
		return <TransactionsWidgetSkeleton />
	}

	if (error) {
		return (
			<div className='mt-3 text-sm text-danger' role='alert'>
				{error}
			</div>
		)
	}

	if (!items.length) {
		return (
			<section className='rounded-xl bg-background-muted p-6 text-center text-sm text-label shadow-sm backdrop-blur'>Здесь будут транзакции</section>
		)
	}

	return (
		<section className='rounded-xl bg-background-muted py-3 shadow-sm backdrop-blur'>
			<div className='mb-3 flex items-center justify-between gap-2 px-3'>
				<h2 className='text-base border-b border-divider pb-3 w-full'>Последние транзакции</h2>
			</div>

			<TransactionsList items={items} walletById={walletById} categoryById={categoryById} limit={limit} onItemClick={onItemClick} />

			<div className='mt-3 px-3 ml-auto w-fit'>
				<Button text='Показать все' onClick={onOpenDrawer} />
			</div>
		</section>
	)
}

const TransactionsWidgetSkeleton = () => {
	return (
		<section className='rounded-xl bg-background-muted py-3 shadow-sm backdrop-blur animate-pulse'>
			<div className='mb-3 flex items-center justify-between gap-2 px-3'>
				<div className='h-5 w-32 rounded bg-background-muted-2/60' />
			</div>

			<ul className='space-y-3 px-3'>
				{Array.from({ length: 1 }).map((_, index) => (
					<li key={`transactions-skeleton-${index}`} className='flex flex-col '>
						<div className='flex items-center justify-between'>
							<div className='h-4 w-48 rounded bg-background-muted-2/60' />
							<div className='h-4 w-16 rounded bg-background-muted-2/60' />
						</div>
						<div className='flex items-center justify-between'>
							<div className='h-3 w-32 rounded bg-background-muted-2/60' />
							<div className='h-3 w-20 rounded bg-background-muted-2/60' />
						</div>
					</li>
				))}
			</ul>

			<div className='mt-3 px-3 ml-auto w-fit'>
				<div className='h-9 w-32 rounded-full bg-background-muted-2/60' />
			</div>
		</section>
	)
}

export default TransactionsWidget
