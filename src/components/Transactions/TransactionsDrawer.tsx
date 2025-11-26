import { useCallback, useRef, type UIEvent } from 'react'
import { Filter, X } from 'lucide-react'
import Drawer from '@/components/Drawer/Drawer'
import TransactionsList, { type TransactionsListProps } from './TransactionsList'

export interface TransactionsDrawerProps extends TransactionsListProps {
	open: boolean
	onClose: () => void
	title?: string
	hasMore?: boolean
	loadingMore?: boolean
	onLoadMore?: () => void
	onOpenFilters?: () => void
}

const SCROLL_THRESHOLD_PX = 120

const TransactionsDrawer = ({
	open,
	onClose,
	title = 'Все транзакции',
	items,
	walletById,
	categoryById,
	hasMore = false,
	loadingMore = false,
	onLoadMore,
	onOpenFilters,
}: TransactionsDrawerProps) => {
	const scrollDebounceRef = useRef<number | null>(null)

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
		<Drawer open={open} onClose={onClose} className='max-h-screen rounded-t-3xl bg-background'>
			<div className='flex h-full flex-col'>
				<header className='flex items-center justify-between gap-3 p-3'>
					<h2 className='text-lg font-semibold'>{title}</h2>
					<div className='flex items-center gap-2'>
						{onOpenFilters && (
							<button type='button' onClick={onOpenFilters} className='rounded-full p-2' aria-label='Открыть фильтры'>
								<Filter className='h-5 w-5' />
							</button>
						)}
						<button type='button' onClick={onClose} className='rounded-full p-2' aria-label='Закрыть'>
							<X />
						</button>
					</div>
				</header>

				<div className='flex-1 overflow-y-auto px-3 pb-10' onScroll={handleScroll}>
					<TransactionsList items={items} walletById={walletById} categoryById={categoryById} />
					{loadingMore && <div className='py-3 text-center text-sm text-muted-foreground'>Загрузка...</div>}
				</div>
			</div>
		</Drawer>
	)
}

export default TransactionsDrawer
