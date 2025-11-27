import { BanknoteArrowDown } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { TransactionFeedItem } from '@api/types'
import type { Wallet } from '@/types/entities/wallet'
import type { Category } from '@/types/entities/category'
import { categoryIconMap } from '@/widgets/Categories/icons'
import { useTranslation } from '@/i18n'

interface TransactionListItemProps {
	item: TransactionFeedItem
	walletById?: Record<number, Wallet>
	categoryById?: Record<number, Category>
	onClick?: (item: TransactionFeedItem) => void
}

export const TransactionListItem = ({ item, walletById = {}, categoryById = {}, onClick }: TransactionListItemProps) => {
	const { t, locale } = useTranslation()
	const category = item.categoryId ? categoryById[item.categoryId] : undefined
	const wallet = item.walletId ? walletById[item.walletId] : undefined
	const counterpartyWallet = item.counterpartyWalletId ? walletById[item.counterpartyWalletId] : undefined
	const typeLabel = item.entryType === 'TRANSFER' ? t('transactions.item.transfer') : category?.name ?? t('transactions.item.transaction')
	const timeLabel = item.occurredAt ? new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' }).format(new Date(item.occurredAt)) : ''
	const walletLabel = wallet?.name ?? item.walletId ?? '—'
	const counterpartyLabel = counterpartyWallet?.name ?? item.counterpartyWalletId ?? null
	const walletDisplay = item.entryType === 'TRANSFER' && counterpartyLabel ? `${walletLabel} → ${counterpartyLabel}` : walletLabel
	const categoryIconName = category?.icon
	const CategoryIcon: LucideIcon =
		item.entryType === 'TRANSFER' ? BanknoteArrowDown : (categoryIconName && categoryIconMap[categoryIconName]) || BanknoteArrowDown
	const categoryColor = category?.color || '#9CA3AF'
	const amountClass = item.categoryType === 'EXPENSE' ? 'text-danger' : item.categoryType === 'INCOME' ? 'text-access' : 'text-text'
	const amountPrefix = item.categoryType === 'EXPENSE' ? '-' : item.categoryType === 'INCOME' ? '+' : ''

	return (
		<li className='text-sm'>
			<button
				type='button'
				onClick={() => onClick?.(item)}
				className='w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent'
			>
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
							<div className={`text-base font-semibold ${amountClass}`}>
								{amountPrefix}
								{item.amount.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {item.currencyCode}
							</div>
							<span className='text-xs text-label'>{timeLabel}</span>
						</div>
					</div>
				</div>
			</button>
		</li>
	)
}

export default TransactionListItem
