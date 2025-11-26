import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { BanknoteArrowDown } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { categoryIconMap } from '@/widgets/Categories/icons'
import type { TransactionFeedItem } from '@api/types'
import type { Category } from '@/types/entities/category'
import type { Wallet } from '@/types/entities/wallet'

export interface TransactionsListProps {
	items: TransactionFeedItem[]
	walletById?: Record<number, Wallet>
	categoryById?: Record<number, Category>
	limit?: number
}

export const TransactionsList = ({ items, walletById = {}, categoryById = {}, limit }: TransactionsListProps) => {
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
				const dateLabel = dateKey === 'unknown' ? 'Неизвестная дата' : format(new Date(dateKey), 'd MMMM', { locale: ru })

				return (
					<div key={dateKey} className='bg-background-muted-2 px-3 pb-3 rounded-xl p-3'>
						<div className='text-xs font-bold uppercase text-label mb-4'>{dateLabel}</div>
						<ul className='space-y-5'>
							{itemsForDate.map(item => {
								const category = item.categoryId ? categoryById[item.categoryId] : undefined
								const wallet = item.walletId ? walletById[item.walletId] : undefined
								const counterpartyWallet = item.counterpartyWalletId ? walletById[item.counterpartyWalletId] : undefined
								const typeLabel = item.entryType === 'TRANSFER' ? 'Перевод, снятие' : category?.name ?? 'Транзакция'
								const timeLabel = item.occurredAt ? format(new Date(item.occurredAt), 'HH:mm') : ''
								const walletLabel = wallet?.name ?? item.walletId ?? '—'
								const counterpartyLabel = counterpartyWallet?.name ?? item.counterpartyWalletId ?? null
								const walletDisplay = item.entryType === 'TRANSFER' && counterpartyLabel ? `${walletLabel} → ${counterpartyLabel}` : walletLabel
								const categoryIconName = category?.icon
								const CategoryIcon: LucideIcon =
									item.entryType === 'TRANSFER' ? BanknoteArrowDown : (categoryIconName && categoryIconMap[categoryIconName]) || BanknoteArrowDown
								const categoryColor = category?.color || '#9CA3AF'

								return (
									<li key={`${item.entryType}-${item.id}`} className='text-sm'>
										<div className='flex items-center gap-3'>
											<div className='flex h-[48px] w-[48px] items-center justify-center rounded-full bg-background-muted'>
												<CategoryIcon className='h-6 w-6' color={categoryColor} />
											</div>

											<div className='flex flex-1 items-start justify-between'>
												<div className='flex flex-col gap-1'>
													<span className='text-base text-text'>{typeLabel}</span>
													<span className='text-label'>{walletDisplay}</span>
												</div>

												<div className='text-right flex flex-col gap-1'>
													<div className='text-base font-semibold text-text'>
														{item.amount.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {item.currencyCode}
													</div>
													<span className='text-xs text-label'>{timeLabel}</span>
												</div>
											</div>
										</div>
									</li>
								)
							})}
						</ul>
					</div>
				)
			})}
		</div>
	)
}

export default TransactionsList
