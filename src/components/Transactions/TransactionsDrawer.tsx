import { useCallback, useRef, type UIEvent } from 'react'
import { Filter, X } from 'lucide-react'
import type { TransactionFeedItem } from '@api/types'
import TransactionsList, { type TransactionsListProps } from './TransactionsList'
import Loader from '../ui/Loader/Loader'
import { useTranslation } from '@/i18n'
import Drawer from '../Drawer/Drawer'

export interface TransactionsDrawerProps extends TransactionsListProps {
	open: boolean
	onClose: () => void
	title?: string
	hasMore?: boolean
	loadingMore?: boolean
	onLoadMore?: () => void
	onOpenFilters?: () => void
	filtersActive?: boolean
	initialLoading?: boolean
	error?: string | null
	onItemClick?: (item: TransactionFeedItem) => void
}

const SCROLL_THRESHOLD_PX = 120

const TransactionsDrawer = ({
	open,
	onClose,
	title,
	items,
	walletById,
	categoryById,
	hasMore = false,
	loadingMore = false,
	onLoadMore,
	onOpenFilters,
	filtersActive = false,
	initialLoading = false,
	error = null,
	onItemClick,
}: TransactionsDrawerProps) => {
	const scrollDebounceRef = useRef<number | null>(null)
	const { t } = useTranslation()

	const handleScroll = useCallback(
		(event: UIEvent<HTMLDivElement>) => {
			if (!hasMore || loadingMore || !onLoadMore) return

			const target = event.currentTarget
			const distanceToBottom = target.scrollHeight - target.scrollTop - target.clientHeight
			if (distanceToBottom >= SCROLL_THRESHOLD_PX) return

			if (scrollDebounceRef.current !== null) {
				window.clearTimeout(scrollDebounceRef.current)
			}
			scrollDebounceRef.current = window.setTimeout(() => {
				onLoadMore()
				scrollDebounceRef.current = null
			}, 250)
		},
		[hasMore, loadingMore, onLoadMore]
	)

	return (
		<Drawer open={open} onClose={onClose} className='h-[100vh] rounded-t-lg bg-background-secondary'>
			<div className='flex h-full flex-col'>
				<header className='flex items-center justify-between gap-3 p-3'>
					<h2 className='text-lg font-semibold'>{title}</h2>
					<div className='flex items-center gap-2'>
						{onOpenFilters && (
							<button type='button' onClick={onOpenFilters} className='rounded-full p-2' aria-label='Открыть фильтры'>
								<Filter className={`h-5 w-5 ${filtersActive ? 'text-accent' : ''}`} />
							</button>
						)}
						<button type='button' onClick={onClose} className='rounded-full p-2' aria-label='Закрыть'>
							<X />
						</button>
					</div>
				</header>

				{initialLoading ? (
					<div className='fixed inset-0 z-30 bg-black/80 backdrop-blur-sm'>
						<div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
							<Loader />
						</div>
					</div>
				) : items.length === 0 ? (
					<div className='flex flex-1 items-center justify-center px-3 pb-10 text-lg '>{t('transactions.placeholder')}</div>
				) : (
					<div className='flex-1 overflow-y-auto pb-10' onScroll={handleScroll}>
						<TransactionsList items={items} walletById={walletById} categoryById={categoryById} onItemClick={onItemClick} />
					</div>
				)}
				{error && <div className='px-3 pb-4 text-sm text-danger'>{error}</div>}
			</div>
		</Drawer>
	)
}

export default TransactionsDrawer
