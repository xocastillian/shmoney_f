import { BanknoteArrowDown, UserRound } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { TransactionFeedItem } from '@api/types'
import type { Wallet } from '@/types/entities/wallet'
import type { Category } from '@/types/entities/category'
import type { DebtCounterparty } from '@/types/entities/debt'
import { categoryIconMap } from '@/widgets/Categories/icons'
import { useTranslation } from '@/i18n'

interface TransactionListItemProps {
	item: TransactionFeedItem
	walletById?: Record<number, Wallet>
	categoryById?: Record<number, Category>
	counterpartyById?: Record<number, DebtCounterparty>
	onClick?: (item: TransactionFeedItem) => void
}

export const TransactionListItem = ({ item, walletById = {}, categoryById = {}, counterpartyById = {}, onClick }: TransactionListItemProps) => {
	const { t, locale } = useTranslation()
	const category = item.categoryId ? categoryById[item.categoryId] : undefined
	const wallet = item.walletId ? walletById[item.walletId] : undefined
	const counterpartyWallet = item.counterpartyWalletId ? walletById[item.counterpartyWalletId] : undefined
	const debtCounterpartyId =
		item.entryType === 'DEBT'
			? item.debtCounterpartyId ?? item.counterpartyId ?? item.counterpartyWalletId ?? item.categoryId ?? null
			: null
	const debtCounterparty = debtCounterpartyId ? counterpartyById[debtCounterpartyId] : undefined
	const debtCounterpartyName = item.entryType === 'DEBT' ? item.counterpartyName ?? debtCounterparty?.name ?? null : null
	const debtCounterpartyColor = item.entryType === 'DEBT' ? item.counterpartyColor ?? debtCounterparty?.color ?? null : null
	const typeLabel =
		item.entryType === 'TRANSFER'
			? t('transactions.item.transfer')
			: item.entryType === 'DEBT'
				? debtCounterpartyName ?? t('transactions.tabs.debt')
				: (category?.name ?? t('transactions.item.transaction'))
	const timeLabel = item.occurredAt ? new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' }).format(new Date(item.occurredAt)) : ''
	const walletLabel = wallet?.name ?? item.walletId ?? '—'
	const counterpartyLabel = counterpartyWallet?.name ?? item.counterpartyWalletId ?? null
	const walletDisplay = item.entryType === 'TRANSFER' && counterpartyLabel ? `${walletLabel} → ${counterpartyLabel}` : walletLabel
	const categoryIconName = category?.icon
	const CategoryIcon: LucideIcon =
		item.entryType === 'TRANSFER'
			? BanknoteArrowDown
			: item.entryType === 'DEBT'
				? UserRound
				: (categoryIconName && categoryIconMap[categoryIconName]) || BanknoteArrowDown
	const categoryColor = item.entryType === 'DEBT' ? debtCounterpartyColor || '#9CA3AF' : category?.color || '#9CA3AF'
	const resolvedDebtType =
		item.entryType === 'DEBT'
			? item.debtDirection === 'BORROWED'
				? 'INCOME'
				: item.debtDirection === 'LENT'
					? 'EXPENSE'
					: item.categoryType ?? (item.amount < 0 ? 'EXPENSE' : item.amount > 0 ? 'INCOME' : null)
			: item.categoryType
	const amountClass =
		item.entryType === 'DEBT'
			? resolvedDebtType === 'INCOME'
				? 'text-access'
				: resolvedDebtType === 'EXPENSE'
					? 'text-danger'
					: 'text-text'
			: item.categoryType === 'EXPENSE'
				? 'text-danger'
				: item.categoryType === 'INCOME'
					? 'text-access'
					: 'text-text'
	const amountPrefix =
		item.entryType === 'DEBT'
			? resolvedDebtType === 'INCOME'
				? '+'
				: resolvedDebtType === 'EXPENSE'
					? '-'
					: ''
			: item.categoryType === 'EXPENSE'
				? '-'
				: item.categoryType === 'INCOME'
					? '+'
					: ''

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
							<span className='text-accent'>{walletDisplay}</span>
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
