import { format } from 'date-fns'
import type { TransactionFeedItem } from '@api/types'

interface TransactionsListProps {
	items: TransactionFeedItem[]
	loading?: boolean
	error?: string | null
	walletNameById?: Record<number, string>
}

const typeLabelMap: Record<string, string> = {
	TRANSFER: 'Перевод',
	EXPENSE: 'Расход',
	INCOME: 'Доход',
}

export const TransactionsList = ({ items, loading = false, error = null, walletNameById = {} }: TransactionsListProps) => {
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

	if (items.length === 0) {
		return <div className='mt-3 text-sm text-muted-foreground'>Транзакции не найдены</div>
	}

	return (
		<section className='mt-4 rounded-xl bg-background-muted p-4 shadow-sm backdrop-blur'>
			<div className='mb-3 flex items-center justify-between gap-2 border-b pb-3 border-divider'>
				<h2 className='text-base'>Последние транзакции</h2>
			</div>

			<ul className='space-y-3'>
				{items.map(item => {
					const typeLabel = typeLabelMap[item.entryType] ?? item.entryType
					const formattedDate = item.occurredAt ? format(new Date(item.occurredAt), 'dd.MM.yyyy HH:mm') : ''

					return (
						<li key={`${item.entryType}-${item.id}`} className='text-sm'>
							<div className='flex items-start justify-between'>
								<div className='flex flex-col gap-1'>
									<span className='font-medium text-text'>{typeLabel}</span>
									<span className='text-label'>
										{item.walletId && walletNameById[item.walletId] ? walletNameById[item.walletId] : item.walletId ?? '—'}
									</span>
								</div>

								<div className='text-right'>
									<div className='text-base font-semibold text-text'>
										{item.amount.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {item.currencyCode}
									</div>
									<span className='text-xs text-label'>{formattedDate}</span>
								</div>
							</div>
						</li>
					)
				})}
			</ul>
		</section>
	)
}

export default TransactionsList
