import { useCallback, useEffect, useMemo, useState } from 'react'
import { ClockFading, FolderHeart, ListFilter, RotateCcw, UserRound, Wallet as WalletIcon, X } from 'lucide-react'
import type { TransactionsFilterState, TransactionFilterType, TransactionPeriodFilter } from './filters'
import TransactionTypePickerDrawer from './TransactionTypePickerDrawer'
import WalletsDrawer from '@/widgets/Wallets/components/WalletsDrawer'
import CategoriesDrawer from '@/widgets/Categories/components/CategoriesDrawer'
import DebtCounterpartiesDrawer from '@/widgets/Debts/components/DebtCounterpartiesDrawer'
import { type Wallet, WalletStatus } from '@/types/entities/wallet'
import { type Category, CategoryStatus } from '@/types/entities/category'
import { formatDateDisplay } from '@/utils/date'
import PeriodFilterDrawer from './PeriodFilterDrawer'
import { periodOptions } from './filters'
import { useTranslation } from '@/i18n'
import Switch from '@/components/ui/Switch'
import useDebts from '@/hooks/useDebts'
import Drawer from '../Drawer/Drawer'

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
	const [isDebtCounterpartyPickerOpen, setDebtCounterpartyPickerOpen] = useState(false)
	const [isPeriodPickerOpen, setPeriodPickerOpen] = useState(false)
	const { counterparties } = useDebts()

	useEffect(() => {
		if (!open) {
			setTypePickerOpen(false)
			setWalletPickerOpen(false)
			setCategoryPickerOpen(false)
			setDebtCounterpartyPickerOpen(false)
			setPeriodPickerOpen(false)
		}
	}, [open])

	const walletPickerOptions = useMemo(
		() =>
			wallets
				.filter(wallet => (wallet.status ?? WalletStatus.ACTIVE) === WalletStatus.ACTIVE)
				.map(wallet => ({
					id: wallet.id,
					name: wallet.name,
					color: wallet.color,
					type: wallet.type,
					status: wallet.status,
					debetOrCredit: wallet.debetOrCredit,
				})),
		[wallets],
	)
	const selectedWallets = useMemo(
		() => walletPickerOptions.filter(wallet => filters.walletIds.includes(wallet.id)),
		[walletPickerOptions, filters.walletIds],
	)
	const walletLabel = useMemo(() => {
		if (selectedWallets.length === 0) return t('transactions.filters.wallet.all')
		const names = selectedWallets.map(wallet => wallet.name)
		const baseLabel = names.slice(0, 2).join(', ')
		return names.length > 2 ? `${baseLabel} +${names.length - 2}` : baseLabel
	}, [selectedWallets, t])
	const walletTextClass = selectedWallets.length ? 'text-text' : 'text-label'
	const WalletIconComponent = WalletIcon
	const walletIconClassName = 'mr-3 text-label'
	const activeCategories = useMemo(() => categories.filter(category => category.status === CategoryStatus.ACTIVE), [categories])
	const selectedCategories = useMemo(
		() => activeCategories.filter(category => filters.categoryIds.includes(category.id)),
		[activeCategories, filters.categoryIds],
	)
	const categoryLabel = useMemo(() => {
		if (selectedCategories.length === 0) return t('transactions.filters.category.all')
		const names = selectedCategories.map(category => category.name)
		const baseLabel = names.slice(0, 2).join(', ')
		return names.length > 2 ? `${baseLabel} +${names.length - 2}` : baseLabel
	}, [selectedCategories, t])
	const categoryTextClass = selectedCategories.length ? 'text-text' : 'text-label'
	const selectedDebtCounterparties = useMemo(
		() => counterparties.filter(counterparty => filters.debtCounterpartyIds.includes(counterparty.id)),
		[counterparties, filters.debtCounterpartyIds],
	)
	const debtCounterpartyLabel = useMemo(() => {
		if (selectedDebtCounterparties.length === 0) return t('transactions.filters.debt.counterparty.all')
		const names = selectedDebtCounterparties.map(counterparty => counterparty.name)
		const baseLabel = names.slice(0, 2).join(', ')
		return names.length > 2 ? `${baseLabel} +${names.length - 2}` : baseLabel
	}, [selectedDebtCounterparties, t])
	const debtCounterpartyTextClass = selectedDebtCounterparties.length ? 'text-text' : 'text-label'
	const isDebtBorrowed = filters.debtDirection === 'BORROWED'
	const isDebtLent = filters.debtDirection === 'LENT'

	const selectedPeriodOption = periodOptions.find(option => option.value === filters.period && option.value !== '')

	const formatDateValue = useCallback(
		(value: string) => {
			if (!value) return null
			const parsed = new Date(value)
			if (Number.isNaN(parsed.getTime())) return null
			return formatDateDisplay(parsed, locale)
		},
		[locale],
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
		[onFiltersChange],
	)

	const handleDateChange = useCallback(
		(field: 'from' | 'to', value: string) => {
			onFiltersChange({ [field]: value, period: '' } as Partial<TransactionsFilterState>)
		},
		[onFiltersChange],
	)

	const handleTypeSelect = useCallback(
		(type: TransactionFilterType) => {
			if (type !== 'DEBT') {
				onFiltersChange({ type, debtCounterpartyIds: [], debtDirection: '' })
				return
			}
			onFiltersChange({ type })
		},
		[onFiltersChange],
	)

	return (
		<>
			<Drawer open={open} onClose={onClose} className='bg-background-secondary rounded-t-lg' swipeable={false}>
				<div className='flex h-full flex-col'>
					<div className='flex justify-between items-center p-3'>
						<h2 className='text-lg font-medium'>{title ?? t('transactions.filters.title')}</h2>

						<button type='button' onClick={onClose} className='rounded-full p-2' aria-label={t('common.close')}>
							<X />
						</button>
					</div>

					<div className='flex flex-1 flex-col pb-10'>
						<div className='relative border-b border-t border-divider bg-background-muted'>
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
									{filters.type === 'DEBT' && t('transactions.filters.type.debt')}
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
										onFiltersChange({ type: '', debtCounterpartyIds: [], debtDirection: '' })
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
								<WalletIconComponent className={walletIconClassName} />
								<span className={walletTextClass}>{walletLabel}</span>
							</button>
							{filters.walletIds.length > 0 && (
								<button
									type='button'
									className='absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-label hover:text-text'
									onClick={event => {
										event.stopPropagation()
										event.preventDefault()
										onFiltersChange({ walletIds: [] })
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
								<FolderHeart className='mr-3 text-label' />
								<span className={categoryTextClass}>{categoryLabel}</span>
							</button>
							{filters.categoryIds.length > 0 && (
								<button
									type='button'
									className='absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-label hover:text-text'
									onClick={event => {
										event.stopPropagation()
										event.preventDefault()
										onFiltersChange({ categoryIds: [] })
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

						{filters.type === 'DEBT' && (
							<>
								<div className='border-b border-divider bg-background-muted'>
									<div className='flex h-16 items-center justify-between px-3'>
										<span className='text-text'>{t('transactions.filters.debt.borrowed')}</span>
										<Switch checked={isDebtBorrowed} onChange={checked => onFiltersChange({ debtDirection: checked ? 'BORROWED' : '' })} />
									</div>
								</div>

								<div className='border-b border-divider bg-background-muted'>
									<div className='flex h-16 items-center justify-between px-3'>
										<span className='text-text'>{t('transactions.filters.debt.lent')}</span>
										<Switch checked={isDebtLent} onChange={checked => onFiltersChange({ debtDirection: checked ? 'LENT' : '' })} />
									</div>
								</div>

								<div className='relative border-b border-divider bg-background-muted'>
									<button
										type='button'
										onClick={() => setDebtCounterpartyPickerOpen(true)}
										className='flex h-16 w-full items-center px-3 pr-10 text-left focus:outline-none focus-visible:bg-background-muted'
									>
										<UserRound className='mr-3 text-label' />
										<span className={debtCounterpartyTextClass}>{debtCounterpartyLabel}</span>
									</button>
									{filters.debtCounterpartyIds.length > 0 && (
										<button
											type='button'
											className='absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-label hover:text-text'
											onClick={event => {
												event.stopPropagation()
												event.preventDefault()
												onFiltersChange({ debtCounterpartyIds: [] })
											}}
											aria-label={t('transactions.filters.debt.counterparty.reset')}
										>
											<X className='h-4 w-4' />
										</button>
									)}
								</div>
							</>
						)}

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
				onSelect={handleTypeSelect}
			/>

			<WalletsDrawer
				open={isWalletPickerOpen}
				onClose={() => setWalletPickerOpen(false)}
				title={t('transactions.filters.walletPicker.title')}
				wallets={walletPickerOptions}
				selectedWalletId={null}
				multiSelect
				selectedWalletIds={filters.walletIds}
				onToggleWallet={walletId => {
					const exists = filters.walletIds.includes(walletId)
					const next = exists ? filters.walletIds.filter(id => id !== walletId) : [...filters.walletIds, walletId]
					onFiltersChange({ walletIds: next })
				}}
				onSelect={() => {}}
				emptyStateLabel={t('transactions.filters.walletPicker.empty')}
				showAllOption
				allOptionLabel={t('transactions.filters.wallet.all')}
				onSelectAll={() => {
					onFiltersChange({ walletIds: [] })
				}}
				showCheckIcon
			/>

			<CategoriesDrawer
				open={isCategoryPickerOpen}
				onClose={() => setCategoryPickerOpen(false)}
				showArchived={false}
				multiSelect
				selectedCategoryIds={filters.categoryIds}
				onToggleCategory={category => {
					const exists = filters.categoryIds.includes(category.id)
					const next = exists ? filters.categoryIds.filter(id => id !== category.id) : [...filters.categoryIds, category.id]
					onFiltersChange({ categoryIds: next })
				}}
				showAddButton={false}
				onSelectAll={() => {
					onFiltersChange({ categoryIds: [] })
				}}
				allOptionLabel={t('transactions.filters.category.all')}
			/>

			<DebtCounterpartiesDrawer
				open={isDebtCounterpartyPickerOpen}
				onClose={() => setDebtCounterpartyPickerOpen(false)}
				showArchived={false}
				multiSelect
				selectedCounterpartyIds={filters.debtCounterpartyIds}
				onToggleCounterparty={counterparty => {
					const exists = filters.debtCounterpartyIds.includes(counterparty.id)
					const next = exists ? filters.debtCounterpartyIds.filter(id => id !== counterparty.id) : [...filters.debtCounterpartyIds, counterparty.id]
					onFiltersChange({ debtCounterpartyIds: next })
				}}
				showAddButton={false}
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
