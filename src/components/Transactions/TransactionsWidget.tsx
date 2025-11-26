import Button from '../ui/Button/Button'
import TransactionsList, { type TransactionsListProps } from './TransactionsList'

export interface TransactionsWidgetProps extends TransactionsListProps {
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
	limit = 5,
}: TransactionsWidgetProps) => {
	if (loading) {
		return <div className='mt-3 text-sm text-muted-foreground'>Загрузка транзакций...</div>
	}

	if (error) {
		return (
			<div className='mt-3 text-sm text-danger' role='alert'>
				{error}
			</div>
		)
	}

	if (!items.length) {
		return <div className='mt-3 text-sm text-muted-foreground'>Транзакции не найдены</div>
	}

	return (
		<section className='mt-4 rounded-xl bg-background-muted py-3 shadow-sm backdrop-blur'>
			<div className='mb-3 flex items-center justify-between gap-2 px-3'>
				<h2 className='text-base border-b border-divider pb-3 w-full'>Последние транзакции</h2>
			</div>

			<TransactionsList items={items} walletById={walletById} categoryById={categoryById} limit={limit} />

			<div className='mt-3 px-3 ml-auto w-fit'>
				<Button text='Показать все' onClick={onOpenDrawer} />
			</div>
		</section>
	)
}

export default TransactionsWidget
