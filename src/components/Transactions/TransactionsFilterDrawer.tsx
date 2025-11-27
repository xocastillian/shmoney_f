import { useCallback, useEffect, useMemo, useState } from 'react'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { ClockFading, FolderHeart, ListFilter, RotateCcw, Wallet as WalletIcon, X } from 'lucide-react'
import Drawer from '@/components/Drawer/Drawer'
import type { TransactionsFilterState, TransactionFilterType, TransactionPeriodFilter } from './filters'
import TransactionTypePickerDrawer from './TransactionTypePickerDrawer'
import TransactionWalletPickerDrawer from '@/widgets/Transactions/components/TransactionWalletPickerDrawer'
import CategoriesDrawer from '@/widgets/Categories/components/CategoriesDrawer'
import type { Wallet } from '@/types/entities/wallet'
import type { Category } from '@/types/entities/category'
import { typeIcons } from '@/widgets/Wallets/types'
import { formatDateDisplay } from '@/utils/date'
import PeriodFilterDrawer from './PeriodFilterDrawer'
import { periodOptions } from './filters'
import { useTranslation } from '@/i18n'

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
	title,
	wallets = [],
	categories = [],
}: TransactionsFilterDrawerProps) => {
	const { t, locale } = useTranslation()
	const [isTypePickerOpen, setTypePickerOpen] = useState(false)
	const [isWalletPickerOpen, setWalletPickerOpen] = useState(false)
	const [isCategoryPickerOpen, setCategoryPickerOpen] = useState(false)
	const [isPeriodPickerOpen, setPeriodPickerOpen] = useState(false)

	useEffect(() => {
		if (!open) {
			setTypePickerOpen(false)
			setWalletPickerOpen(false)
			setCategoryPickerOpen(false)
			setPeriodPickerOpen(false)
		}
	}, [open])

	const walletPickerOptions = useMemo(
		() => wallets.map(wallet => ({ id: wallet.id, name: wallet.name, color: wallet.color, type: wallet.type })),
		[wallets]
	)
	const selectedWallet = filters.walletId ? walletPickerOptions.find(wallet => wallet.id === filters.walletId) ?? null : null
	const walletLabel = selectedWallet?.name ?? t('transactions.filters.wallet.all')
	const walletTextClass = selectedWallet ? 'text-text' : 'text-label'
	const WalletIconComponent = selectedWallet?.type ? typeIcons[selectedWallet.type] ?? WalletIcon : WalletIcon
	const walletIconClassName = selectedWallet ? 'mr-3 h-6 w-6' : 'mr-3 text-label'
	const walletIconStyle = selectedWallet?.color ? { color: selectedWallet.color } : undefined
	const selectedCategory = filters.categoryId ? categories.find(category => category.id === filters.categoryId) ?? null : null
	const categoryLabel = selectedCategory?.name ?? t('transactions.filters.category.all')
	const categoryTextClass = selectedCategory ? 'text-text' : 'text-label'
	const categoryTextStyle = selectedCategory?.color ? { color: selectedCategory.color } : undefined
	const lucideIconMap = LucideIcons as unknown as Record<string, LucideIcon | undefined>
	const CategoryIcon = selectedCategory?.icon ? lucideIconMap[selectedCategory.icon] : undefined

	const selectedPeriodOption = periodOptions.find(option => option.value === filters.period && option.value !== '')

	const formatDateValue = useCallback(
		(value: string) => {
			if (!value) return null
			const parsed = new Date(value)
			if (Number.isNaN(parsed.getTime())) return null
			return formatDateDisplay(parsed, locale)
		},
		[locale]
	)

	const periodLabel = useMemo(() => {
		if (selectedPeriodOption) return t(selectedPeriodOption.labelKey)
		const fromLabel = formatDateValue(filters.from)
		const toLabel = formatDateValue(filters.to)
		if (fromLabel || toLabel) {
			return [fromLabel ?? '—', toLabel ?? '—'].join(' — ')
		}
		return t('transactions.filters.period.placeholder')
	}, [filters.from, filters.to, selectedPeriodOption, formatDateValue, t])

	const hasPeriodFilters = Boolean(filters.period || filters.from || filters.to)

	const handlePeriodChange = useCallback(
		(next: TransactionPeriodFilter) => {
			onFiltersChange({ period: next, from: '', to: '' })
		},
		[onFiltersChange]
	)

	const handleDateChange = useCallback(
		(field: 'from' | 'to', value: string) => {
			onFiltersChange({ [field]: value, period: '' } as Partial<TransactionsFilterState>)
		},
		[onFiltersChange]
	)

	return (
		<>
			<Drawer open={open} onClose={onClose} className='max-h-full rounded-lg bg-background'>
				<div className='flex h-full flex-col'>
					<div className='flex justify-end p-3'>
						<button type='button' onClick={onClose} className='rounded-full p-2' aria-label={t('common.close')}>
							<X />
						</button>
					</div>

					<div className='flex flex-1 flex-col'>
						<h2 className='mb-4 px-3 text-sm font-medium text-label'>{title ?? t('transactions.filters.title')}</h2>

						<div className='relative border-b border-divider bg-background-muted'>
							<button
								type='button'
								className='flex h-16 w-full items-center px-3 pr-10 text-left focus:outline-none focus-visible:bg-background-muted disabled:cursor-not-allowed disabled:opacity-60'
								onClick={() => setTypePickerOpen(true)}
							>
								<ListFilter className='mr-3 text-label' />

								<span className='text-label' style={{ color: filters.type ? 'var(--text)' : '' }}>
									{filters.type === 'EXPENSE' && t('transactions.filters.type.expense')}
									{filters.type === 'INCOME' && t('transactions.filters.type.income')}
									{filters.type === 'TRANSFER' && t('transactions.filters.type.transfer')}
									{!filters.type && t('transactions.filters.type.all')}
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
									aria-label={t('transactions.filters.type.reset')}
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
									aria-label={t('transactions.filters.wallet.reset')}
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
								<span className={categoryTextClass} style={categoryTextStyle}>
									{categoryLabel}
								</span>
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
									aria-label={t('transactions.filters.category.reset')}
								>
									<X className='h-4 w-4' />
								</button>
							)}
						</div>

						<div className='relative border-b border-divider bg-background-muted'>
							<button
								type='button'
								onClick={() => setPeriodPickerOpen(true)}
								className='flex h-16 w-full items-center px-3 pr-10 text-left focus:outline-none focus-visible:bg-background-muted'
							>
								<ClockFading className='mr-3 text-label' />
								<span className={hasPeriodFilters ? 'text-text' : 'text-label'}>{periodLabel}</span>
							</button>
							{hasPeriodFilters && (
								<button
									type='button'
									className='absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-label hover:text-text'
									onClick={event => {
										event.stopPropagation()
										event.preventDefault()
										onFiltersChange({ period: '', from: '', to: '' })
									}}
									aria-label={t('transactions.filters.period.reset')}
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
									{t('transactions.filters.resetButton')}
								</button>
							</div>
						)}
					</div>
				</div>
			</Drawer>

			<TransactionTypePickerDrawer
				open={isTypePickerOpen}
				onClose={() => setTypePickerOpen(false)}
				selectedType={filters.type as TransactionFilterType}
				onSelect={type => onFiltersChange({ type })}
			/>

			<TransactionWalletPickerDrawer
				open={isWalletPickerOpen}
				onClose={() => setWalletPickerOpen(false)}
				title={t('transactions.filters.walletPicker.title')}
				wallets={walletPickerOptions}
				selectedWalletId={filters.walletId ?? null}
				onSelect={walletId => {
					onFiltersChange({ walletId: walletId === filters.walletId ? null : walletId })
					setWalletPickerOpen(false)
				}}
				emptyStateLabel={t('transactions.filters.walletPicker.empty')}
				showAllOption
				allOptionLabel={t('transactions.filters.wallet.all')}
				onSelectAll={() => {
					onFiltersChange({ walletId: null })
					setWalletPickerOpen(false)
				}}
			/>

			<CategoriesDrawer
				open={isCategoryPickerOpen}
				onClose={() => setCategoryPickerOpen(false)}
				selectable
				selectedCategoryId={filters.categoryId ?? null}
				showAddButton={false}
				onSelect={category => {
					onFiltersChange({ categoryId: category.id === filters.categoryId ? null : category.id })
					setCategoryPickerOpen(false)
				}}
				onSelectAll={() => {
					onFiltersChange({ categoryId: null })
					setCategoryPickerOpen(false)
				}}
				className='max-h-[70vh] bg-background-secondary rounded-t-lg'
				allOptionLabel={t('transactions.filters.category.all')}
			/>

			<PeriodFilterDrawer
				open={isPeriodPickerOpen}
				onClose={() => setPeriodPickerOpen(false)}
				from={filters.from}
				to={filters.to}
				period={filters.period}
				onPeriodChange={handlePeriodChange}
				onDateChange={handleDateChange}
			/>
		</>
	)
}

export default TransactionsFilterDrawer
