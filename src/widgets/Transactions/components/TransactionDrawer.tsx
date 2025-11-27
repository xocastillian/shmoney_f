import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Drawer from '@/components/Drawer/Drawer'
import Loader from '@/components/ui/Loader/Loader'
import { TransactionForm } from './TransactionForm'
import TransactionWalletPickerDrawer from './TransactionWalletPickerDrawer'
import { currencyIconMap } from '@/widgets/Wallets/types'
import { getWalletIcon, type WalletPickerOption } from '@/utils/wallet'
import type { Wallet } from '@/types/entities/wallet'
import type { Category } from '@/types/entities/category'
import type { TransactionTypeTabValue } from '@/components/Transactions/TransactionTypeTabs'
import CategoriesDrawer from '@/widgets/Categories/components/CategoriesDrawer'
import AddOrEditCategoryDrawer from '@/widgets/Categories/components/AddOrEditCategoryDrawer'
import { useTranslation } from '@/i18n'

const lucideIconMap = LucideIcons as unknown as Record<string, LucideIcon | undefined>

interface TransactionDrawerProps {
	open: boolean
	onClose: () => void
	formId: string
	amount: string
	onAmountChange: (value: string) => void
	fromWallet: Wallet | null
	toWallet: Wallet | null
	availableFromWallets: WalletPickerOption[]
	availableToWallets: WalletPickerOption[]
	onSelectFromWallet: (walletId: number) => void
	onSelectToWallet: (walletId: number) => void
	transactionType: TransactionTypeTabValue
	onTransactionTypeChange: (type: TransactionTypeTabValue) => void
	selectedCategory: Category | null
	onSelectCategory: (category: Category | null) => void
	description: string
	onDescriptionChange: (value: string) => void
	dateTime: string
	onDateTimeChange: (value: string) => void
	onSubmit: (event: FormEvent<HTMLFormElement>) => void
	submitDisabled: boolean
	submitting: boolean
	error: string | null
	mode?: 'create' | 'edit'
	onDelete?: () => void
}

export const TransactionDrawer = ({
	open,
	onClose,
	formId,
	amount,
	onAmountChange,
	fromWallet,
	toWallet,
	availableFromWallets,
	availableToWallets,
	onSelectFromWallet,
	onSelectToWallet,
	transactionType,
	onTransactionTypeChange,
	selectedCategory,
	onSelectCategory,
	description,
	onDescriptionChange,
	dateTime,
	onDateTimeChange,
	onSubmit,
	submitDisabled,
	submitting,
	error,
	mode = 'create',
	onDelete,
}: TransactionDrawerProps) => {
	const [fromPickerOpen, setFromPickerOpen] = useState(false)
	const [toPickerOpen, setToPickerOpen] = useState(false)
	const [categoryPickerOpen, setCategoryPickerOpen] = useState(false)
	const [isAddCategoryDrawerOpen, setAddCategoryDrawerOpen] = useState(false)
	const [editingCategory, setEditingCategory] = useState<Category | null>(null)
	const { t } = useTranslation()

	useEffect(() => {
		if (!open) {
			setFromPickerOpen(false)
			setToPickerOpen(false)
			setCategoryPickerOpen(false)
			setAddCategoryDrawerOpen(false)
			setEditingCategory(null)
		}
	}, [open])

	const handleOpenAddCategoryDrawer = () => {
		setEditingCategory(null)
		setAddCategoryDrawerOpen(true)
	}

	const closeAddCategoryDrawer = () => {
		setEditingCategory(null)
		setAddCategoryDrawerOpen(false)
	}

	const handleSubmitCategory = () => {
		setEditingCategory(null)
		setAddCategoryDrawerOpen(false)
	}

	const fromWalletCurrencyIcon = useMemo(() => (fromWallet?.currencyCode ? currencyIconMap[fromWallet.currencyCode] ?? null : null), [fromWallet])
	const fromWalletIcon = useMemo(() => getWalletIcon(fromWallet), [fromWallet])
	const toWalletIcon = useMemo(() => getWalletIcon(toWallet), [toWallet])
	const fromWalletLabel =
		fromWallet?.name ?? (availableFromWallets.length === 0 ? t('transactions.drawer.noWallets') : t('transactions.drawer.selectWallet'))
	const toWalletLabel =
		toWallet?.name ?? (availableToWallets.length === 0 ? t('transactions.drawer.noWallets') : t('transactions.drawer.selectRecipient'))
	const submitButtonLabel = useMemo(() => {
		if (mode === 'edit') {
			return submitting ? t('transactions.drawer.saving') : t('transactions.drawer.save')
		}
		return submitting ? t('transactions.drawer.creating') : t('transactions.drawer.create')
	}, [mode, submitting, t])
	const categoryIconNode = useMemo(() => {
		if (!selectedCategory) return null
		const IconComponent = selectedCategory.icon ? lucideIconMap[selectedCategory.icon] : undefined
		const initials = selectedCategory.name.slice(0, 2).toUpperCase()
		if (IconComponent) {
			return <IconComponent className='mr-3 h-6 w-6' color={selectedCategory.color || '#f89a04'} />
		}
		return (
			<span className='mr-3 text-lg font-semibold' style={{ color: selectedCategory.color || '#f89a04' }}>
				{initials}
			</span>
		)
	}, [selectedCategory])
	const categoryLabel = selectedCategory?.name ?? t('transactions.drawer.category')
	const formTitle = mode === 'edit' ? t('transactions.drawer.editTitle') : t('transactions.drawer.newTitle')
	const maxTransactionDate = new Date()

	return (
		<>
			<Drawer open={open} onClose={onClose}>
				<div className='flex h-full flex-col'>
					<div className='flex items-center justify-between gap-3 p-3'>
						<button type='button' onClick={onClose} className='rounded-full p-2' aria-label={t('transactions.drawer.close')}>
							<X />
						</button>
						<button
							type='submit'
							form={formId}
							className='rounded-md px-4 py-2 text-sm font-medium bg-accent text-text-dark disabled:bg-background-muted disabled:text-accent disabled:opacity-50 transition-colors duration-300 ease-in-out'
							disabled={submitDisabled}
							aria-busy={submitting}
						>
							{submitButtonLabel}
						</button>
					</div>

					{error && (
						<div className='px-3 pb-2 text-sm text-danger' role='alert'>
							{error}
						</div>
					)}

					<TransactionForm
						formId={formId}
						onSubmit={onSubmit}
						title={formTitle}
						mode={mode}
						onDelete={onDelete}
						deleteDisabled={submitting}
						transactionType={transactionType}
						onTransactionTypeChange={onTransactionTypeChange}
						amount={amount}
						onAmountChange={onAmountChange}
						fromWalletCurrencyIcon={fromWalletCurrencyIcon}
						fromWalletIcon={fromWalletIcon}
						fromWalletLabel={fromWalletLabel}
						fromWalletSelected={Boolean(fromWallet)}
						onOpenFromWalletPicker={() => setFromPickerOpen(true)}
						fromWalletPickerDisabled={availableFromWallets.length === 0}
						toWalletIcon={toWalletIcon}
						toWalletLabel={toWalletLabel}
						toWalletSelected={Boolean(toWallet)}
						onOpenToWalletPicker={() => setToPickerOpen(true)}
						toWalletPickerDisabled={availableToWallets.length === 0}
						categoryLabel={categoryLabel}
						categorySelected={Boolean(selectedCategory)}
						categoryIcon={categoryIconNode}
						onOpenCategoryPicker={() => setCategoryPickerOpen(true)}
						categoryPickerDisabled={transactionType === 'TRANSFER'}
						description={description}
						onDescriptionChange={onDescriptionChange}
						dateTime={dateTime}
						onDateTimeChange={onDateTimeChange}
						maxDate={maxTransactionDate}
					/>
				</div>
			</Drawer>

			<TransactionWalletPickerDrawer
				open={fromPickerOpen}
				onClose={() => setFromPickerOpen(false)}
				title={t('transactions.drawer.selectFromWallet')}
				wallets={availableFromWallets}
				selectedWalletId={fromWallet?.id ?? null}
				onSelect={walletId => {
					onSelectFromWallet(walletId)
					setFromPickerOpen(false)
				}}
			/>

			<TransactionWalletPickerDrawer
				open={toPickerOpen}
				onClose={() => setToPickerOpen(false)}
				title={t('transactions.drawer.selectRecipient')}
				wallets={availableToWallets}
				selectedWalletId={toWallet?.id ?? null}
				onSelect={walletId => {
					onSelectToWallet(walletId)
					setToPickerOpen(false)
				}}
				emptyStateLabel={t('transactions.drawer.noTransferWallets')}
			/>

			<CategoriesDrawer
				open={categoryPickerOpen}
				onClose={() => setCategoryPickerOpen(false)}
				selectable
				selectedCategoryId={selectedCategory?.id ?? null}
				onSelect={category => {
					onSelectCategory(category)
					setCategoryPickerOpen(false)
				}}
				onAdd={() => {
					setCategoryPickerOpen(false)
					handleOpenAddCategoryDrawer()
				}}
				className='max-h-[70vh] bg-background-secondary rounded-t-lg'
			/>

			<AddOrEditCategoryDrawer
				open={isAddCategoryDrawerOpen}
				onClose={closeAddCategoryDrawer}
				initialCategory={editingCategory ?? undefined}
				onSubmit={handleSubmitCategory}
				title={editingCategory ? t('categories.drawer.editTitle') : t('categories.drawer.newTitle')}
				submitting={submitting}
			/>

			{open && submitting && (
				<div className='fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm'>
					<div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
						<Loader />
					</div>
				</div>
			)}
		</>
	)
}

export default TransactionDrawer
