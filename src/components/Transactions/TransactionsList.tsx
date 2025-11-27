import { format } from 'date-fns'
import type { TransactionFeedItem } from '@api/types'
import type { Category } from '@/types/entities/category'
import type { Wallet } from '@/types/entities/wallet'
import TransactionListItem from './TransactionListItem'
import { useTranslation } from '@/i18n'

export interface TransactionsListProps {
	items: TransactionFeedItem[]
	walletById?: Record<number, Wallet>
	categoryById?: Record<number, Category>
	limit?: number
	onItemClick?: (item: TransactionFeedItem) => void
}

export const TransactionsList = ({ items, walletById = {}, categoryById = {}, limit, onItemClick }: TransactionsListProps) => {
	const { t, locale } = useTranslation()
	const normalizedLimit = typeof limit === 'number' && limit > 0 ? limit : null
	const visibleItems = normalizedLimit ? items.slice(0, normalizedLimit) : items

	if (!visibleItems.length) {
		return null
	}

	const grouped = visibleItems.reduce<Record<string, TransactionFeedItem[]>>((acc, item) => {
		const key = item.occurredAt ? format(new Date(item.occurredAt), 'yyyy-MM-dd') : 'unknown'
		acc[key] ||= []
		acc[key].push(item)
		return acc
	}, {})

	const sortedDates = Object.keys(grouped).sort((a, b) => (a > b ? -1 : 1))

	return (
		<div className='space-y-3'>
			{sortedDates.map(dateKey => {
				const itemsForDate = grouped[dateKey]
				const dateLabel =
					dateKey === 'unknown'
						? t('transactions.list.unknownDate')
						: new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long' }).format(new Date(dateKey))

				return (
					<div key={dateKey} className='bg-background-muted-2 px-3 pb-3 p-3'>
						<div className='text-xs font-bold uppercase text-label mb-4'>{dateLabel}</div>
						<ul className='space-y-5'>
							{itemsForDate.map(item => (
								<TransactionListItem
									key={`${item.entryType}-${item.id}`}
									item={item}
									walletById={walletById}
									categoryById={categoryById}
									onClick={onItemClick}
								/>
							))}
						</ul>
					</div>
				)
			})}
		</div>
	)
}

export default TransactionsList
