import { useEffect, useMemo, useState } from 'react'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { FolderHeart, ListFilter, RotateCcw, Wallet as WalletIcon, X } from 'lucide-react'
import Drawer from '@/components/Drawer/Drawer'
import MobileDateTimePickerField from '@/components/DateTimePicker/MobileDateTimePickerField'
import type { TransactionsFilterState, TransactionFilterType } from './filters'
import TransactionTypePickerDrawer from './TransactionTypePickerDrawer'
import TransactionWalletPickerDrawer from '@/widgets/Transactions/components/TransactionWalletPickerDrawer'
import CategoriesDrawer from '@/widgets/Categories/components/CategoriesDrawer'
import type { Wallet } from '@/types/entities/wallet'
import type { Category } from '@/types/entities/category'
import { typeIcons } from '@/widgets/Wallets/types'

interface TransactionsFilterDrawerProps {
	open: boolean
	onClose: () => void
	filters: TransactionsFilterState
	onFiltersChange: (changes: Partial<TransactionsFilterState>) => void
	onResetFilters?: () => void
	title?: string
	wallets: Wallet[]
	categories: Category[]
}

const TransactionsFilterDrawer = ({
	open,
	onClose,
	filters,
	onFiltersChange,
	onResetFilters,
	title = 'Фильтры',
	wallets = [],
	categories = [],
}: TransactionsFilterDrawerProps) => {
	const [isTypePickerOpen, setTypePickerOpen] = useState(false)
	const [isWalletPickerOpen, setWalletPickerOpen] = useState(false)
	const [isCategoryPickerOpen, setCategoryPickerOpen] = useState(false)

	useEffect(() => {
		if (!open) {
			setTypePickerOpen(false)
			setWalletPickerOpen(false)
			setCategoryPickerOpen(false)
		}
	}, [open])

	const walletPickerOptions = useMemo(
		() => wallets.map(wallet => ({ id: wallet.id, name: wallet.name, color: wallet.color, type: wallet.type })),
		[wallets]
	)
	const selectedWallet = filters.walletId ? walletPickerOptions.find(wallet => wallet.id === filters.walletId) ?? null : null
	const walletLabel = selectedWallet?.name ?? 'Все кошельки'
	const walletTextClass = selectedWallet ? 'text-text' : 'text-label'
	const WalletIconComponent = selectedWallet?.type ? typeIcons[selectedWallet.type] ?? WalletIcon : WalletIcon
	const walletIconClassName = selectedWallet ? 'mr-3 h-6 w-6' : 'mr-3 text-label'
	const walletIconStyle = selectedWallet?.color ? { color: selectedWallet.color } : undefined
	const selectedCategory = filters.categoryId ? categories.find(category => category.id === filters.categoryId) ?? null : null
	const categoryLabel = selectedCategory?.name ?? 'Все категории'
	const categoryTextClass = selectedCategory ? 'text-text' : 'text-label'
	const lucideIconMap = LucideIcons as unknown as Record<string, LucideIcon | undefined>
	const CategoryIcon = selectedCategory?.icon ? lucideIconMap[selectedCategory.icon] : undefined

	return (
		<Drawer open={open} onClose={onClose} className='max-h-full rounded-lg bg-background'>
			<div className='flex h-full flex-col'>
				<div className='flex justify-end p-3'>
					<button type='button' onClick={onClose} className='rounded-full p-2' aria-label='Закрыть'>
						<X />
					</button>
				</div>

				<div className='flex flex-1 flex-col'>
					<h2 className='mb-4 px-3 text-sm font-medium text-label'>{title}</h2>

					<div className='relative border-b border-divider bg-background-muted'>
						<button
							type='button'
							className='flex h-16 w-full items-center px-3 pr-10 text-left focus:outline-none focus-visible:bg-background-muted disabled:cursor-not-allowed disabled:opacity-60'
							onClick={() => setTypePickerOpen(true)}
						>
							<ListFilter className='mr-3 text-label' />

							<span className='text-label' style={{ color: filters.type ? 'var(--text)' : '' }}>
								{filters.type === 'EXPENSE' && 'Расходы'}
								{filters.type === 'INCOME' && 'Доходы'}
								{filters.type === 'TRANSFER' && 'Переводы'}
								{!filters.type && 'Все операции'}
							</span>
						</button>
						{filters.type && (
							<button
								type='button'
								className='absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-label hover:text-text'
								onClick={event => {
									event.stopPropagation()
									event.preventDefault()
									onFiltersChange({ type: '' })
								}}
								aria-label='Сбросить тип'
							>
								<X className='h-4 w-4' />
							</button>
						)}
					</div>

					<div className='relative border-b border-divider bg-background-muted'>
						<button
							type='button'
							onClick={() => setWalletPickerOpen(true)}
							className='flex h-16 w-full items-center px-3 pr-10 text-left focus:outline-none focus-visible:bg-background-muted'
						>
							<WalletIconComponent className={walletIconClassName} style={walletIconStyle} />
							<span className={walletTextClass}>{walletLabel}</span>
						</button>
						{selectedWallet && (
							<button
								type='button'
								className='absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-label hover:text-text'
								onClick={event => {
									event.stopPropagation()
									event.preventDefault()
									onFiltersChange({ walletId: null })
								}}
								aria-label='Сбросить кошелёк'
							>
								<X className='h-4 w-4' />
							</button>
						)}
					</div>

					<div className='relative border-b border-divider bg-background-muted'>
						<button
							type='button'
							onClick={() => setCategoryPickerOpen(true)}
							className='flex h-16 w-full items-center px-3 pr-10 text-left focus:outline-none focus-visible:bg-background-muted'
						>
							{CategoryIcon ? (
								<CategoryIcon className='mr-3 h-6 w-6' color={selectedCategory?.color || '#f89a04'} />
							) : (
								<FolderHeart className='mr-3 text-label' />
							)}
							<span className={categoryTextClass}>{categoryLabel}</span>
						</button>
						{selectedCategory && (
							<button
								type='button'
								className='absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-label hover:text-text'
								onClick={event => {
									event.stopPropagation()
									event.preventDefault()
									onFiltersChange({ categoryId: null })
								}}
								aria-label='Сбросить категорию'
							>
								<X className='h-4 w-4' />
							</button>
						)}
					</div>

					<div className='relative border-b border-divider bg-background-muted'>
						<MobileDateTimePickerField
							value={filters.from}
							onChange={value => onFiltersChange({ from: value })}
							placeholder='Дата начала'
							precision='day'
							className='pr-10'
						/>
						{filters.from && (
							<button
								type='button'
								className='absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-label hover:text-text'
								onClick={event => {
									event.stopPropagation()
									event.preventDefault()
									onFiltersChange({ from: '' })
								}}
								aria-label='Сбросить дату начала'
							>
								<X className='h-4 w-4' />
							</button>
						)}
					</div>

					<div className='relative border-b border-divider bg-background-muted'>
						<MobileDateTimePickerField
							value={filters.to}
							onChange={value => onFiltersChange({ to: value })}
							placeholder='Дата окончания'
							precision='day'
							className='pr-10'
						/>
						{filters.to && (
							<button
								type='button'
								className='absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-label hover:text-text'
								onClick={event => {
									event.stopPropagation()
									event.preventDefault()
									onFiltersChange({ to: '' })
								}}
								aria-label='Сбросить дату окончания'
							>
								<X className='h-4 w-4' />
							</button>
						)}
					</div>

					{onResetFilters && (
						<div className='border-b border-divider bg-background-muted'>
							<button
								type='button'
								className='flex h-16 w-full items-center px-3 text-left focus:outline-none focus-visible:bg-background-muted disabled:cursor-not-allowed disabled:opacity-60 text-danger'
								onClick={() => {
									onResetFilters()
								}}
							>
								<RotateCcw className='mr-3 text-danger' />
								Сбросить
							</button>
						</div>
					)}
				</div>

				<TransactionTypePickerDrawer
					open={isTypePickerOpen}
					onClose={() => setTypePickerOpen(false)}
					selectedType={filters.type as TransactionFilterType}
					onSelect={type => onFiltersChange({ type })}
				/>
				<TransactionWalletPickerDrawer
					open={isWalletPickerOpen}
					onClose={() => setWalletPickerOpen(false)}
					title='Выберите кошелёк'
					wallets={walletPickerOptions}
					selectedWalletId={filters.walletId ?? null}
					onSelect={walletId => {
						onFiltersChange({ walletId: walletId === filters.walletId ? null : walletId })
						setWalletPickerOpen(false)
					}}
					emptyStateLabel='Нет доступных кошельков'
					showAllOption
					onSelectAll={() => {
						onFiltersChange({ walletId: null })
						setWalletPickerOpen(false)
					}}
				/>
				<CategoriesDrawer
					open={isCategoryPickerOpen}
					onClose={() => setCategoryPickerOpen(false)}
					showAllOption
					showAddButton={false}
					onSelect={category => {
						onFiltersChange({ categoryId: category.id === filters.categoryId ? null : category.id })
						setCategoryPickerOpen(false)
					}}
					onSelectAll={() => {
						onFiltersChange({ categoryId: null })
						setCategoryPickerOpen(false)
					}}
					className='max-h-[70vh] bg-background-secondary'
				/>
			</div>
		</Drawer>
	)
}

export default TransactionsFilterDrawer
