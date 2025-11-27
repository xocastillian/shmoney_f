import { useCallback, useEffect, useId, useMemo, useState, type FormEvent } from 'react'
import { Home as HomeIcon, BarChart2, Wallet as WalletIcon, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import HomeScreen from '@/screens/Home/HomeScreen'
import StatisticsScreen from '@/screens/Statistics/StatisticsScreen'
import BudgetsScreen from '@/screens/Budgets/BudgetsScreen'
import SettingsScreen from '@/screens/Settings/SettingsScreen'
import { BottomNav, type BottomNavTab } from '@/components/ui/BottomNav'
import TransactionDrawer from '@/widgets/Transactions/components/TransactionDrawer'
import { useWallets } from '@/hooks/useWallets'
import useTransactions from '@/hooks/useTransactions'
import { formatDateTimeLocal } from '@/utils/date'
import { mapWalletsToPickerOptions } from '@/utils/wallet'
import type { Wallet } from '@/types/entities/wallet'
import type { Category } from '@/types/entities/category'
import type { TransactionTypeTabValue } from '@/components/Transactions/TransactionTypeTabs'
import type { TransactionFeedItem } from '@api/types'
import { disableVerticalSwipes, enableVerticalSwipes, isInTelegram } from '@/lib/telegram'
import { useCategories } from '@/hooks/useCategories'
import { useAuthStore } from '@/store/authStore'
import { useSettings } from '@/hooks/useSettings'
import Loader from './components/ui/Loader/Loader'

type TabKey = 'home' | 'statistics' | 'budgets' | 'settings'
type CategoryTransactionTypeValue = Extract<TransactionTypeTabValue, 'EXPENSE' | 'INCOME'>

const isCategoryTransactionType = (value: TransactionTypeTabValue): value is CategoryTransactionTypeValue => value === 'EXPENSE' || value === 'INCOME'

const getCurrentDateTimeString = () => formatDateTimeLocal(new Date())

function App() {
	const [activeTab, setActiveTab] = useState<TabKey>('home')
	const [transactionDrawerOpen, setTransactionDrawerOpen] = useState(false)
	const formId = useId()
	const { wallets, fetchWallets, fetchWalletBalances } = useWallets()
	const {
		createWalletTransaction,
		createCategoryTransaction,
		updateWalletTransaction,
		updateCategoryTransaction,
		deleteWalletTransaction,
		deleteCategoryTransaction,
		getWalletTransaction,
		getCategoryTransaction,
		fetchTransactionFeed,
	} = useTransactions()
	const { categories, fetchCategories: fetchCategoriesData } = useCategories()
	const authLoading = useAuthStore(state => state.loading)
	const { fetchSettings } = useSettings()
	const [amount, setAmount] = useState('')
	const [fromWalletId, setFromWalletId] = useState<number | null>(null)
	const [toWalletId, setToWalletId] = useState<number | null>(null)
	const [description, setDescription] = useState('')
	const [dateTime, setDateTime] = useState(getCurrentDateTimeString)
	const [formError, setFormError] = useState<string | null>(null)
	const [transactionType, setTransactionType] = useState<TransactionTypeTabValue>('EXPENSE')
	const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
	const [transactionSubmitting, setTransactionSubmitting] = useState(false)
	const [transactionError, setTransactionError] = useState<string | null>(null)
	const [editingTransaction, setEditingTransaction] = useState<{ kind: 'TRANSFER' | 'CATEGORY'; id: number } | null>(null)

	useEffect(() => {
		if (!isInTelegram()) return

		disableVerticalSwipes()
		return () => {
			enableVerticalSwipes()
		}
	}, [])

	useEffect(() => {
		void fetchSettings().catch(() => undefined)
	}, [fetchSettings])

	const tabs = useMemo<BottomNavTab[]>(
		() => [
			{ key: 'home', label: 'Главная', icon: HomeIcon },
			{ key: 'statistics', label: 'Статистика', icon: BarChart2 },
			{ key: 'create', variant: 'action' as const },
			{ key: 'budgets', label: 'Бюджеты', icon: WalletIcon },
			{ key: 'settings', label: 'Настройки', icon: Settings },
		],
		[]
	)

	const clearTransactionError = useCallback(() => setTransactionError(null), [])

	const resetForm = useCallback(() => {
		setAmount('')
		setDescription('')
		setDateTime(getCurrentDateTimeString())
		setFromWalletId(null)
		setToWalletId(null)
		setSelectedCategory(null)
		setTransactionType('EXPENSE')
		setFormError(null)
		setTransactionError(null)
		setTransactionSubmitting(false)
	}, [])

	useEffect(() => {
		if (!transactionDrawerOpen) return

		if (wallets.length === 0) {
			void fetchWallets().catch(() => undefined)
		}
	}, [transactionDrawerOpen, wallets.length, fetchWallets])

	useEffect(() => {
		if (categories.length === 0) {
			void fetchCategoriesData().catch(() => undefined)
		}
	}, [categories.length, fetchCategoriesData])

	useEffect(() => {
		if (!transactionDrawerOpen) return
		if (fromWalletId === null && wallets[0]) {
			setFromWalletId(wallets[0].id)
		}
	}, [transactionDrawerOpen, wallets, fromWalletId])

	useEffect(() => {
		if (fromWalletId !== null && toWalletId === fromWalletId) {
			setToWalletId(null)
		}
	}, [fromWalletId, toWalletId])

	const fromWallet = useMemo<Wallet | null>(() => wallets.find(wallet => wallet.id === fromWalletId) ?? null, [wallets, fromWalletId])
	const toWallet = useMemo<Wallet | null>(() => wallets.find(wallet => wallet.id === toWalletId) ?? null, [wallets, toWalletId])

	const availableFromWallets = useMemo(() => mapWalletsToPickerOptions(wallets), [wallets])
	const availableToWallets = useMemo(() => mapWalletsToPickerOptions(wallets.filter(wallet => wallet.id !== fromWalletId)), [wallets, fromWalletId])
	const isEditMode = Boolean(editingTransaction)

	const amountValid = useMemo(() => {
		if (amount.trim().length === 0) return false
		const parsed = Number(amount.replace(',', '.'))
		return !Number.isNaN(parsed) && parsed > 0
	}, [amount])

	const dateValid = useMemo(() => {
		if (dateTime.trim().length === 0) return false
		const parsed = new Date(dateTime)
		return !Number.isNaN(parsed.getTime())
	}, [dateTime])

	const submitDisabled =
		transactionSubmitting ||
		!amountValid ||
		!dateValid ||
		fromWalletId === null ||
		(transactionType === 'TRANSFER' ? toWalletId === null : selectedCategory === null)
	const combinedError = formError ?? transactionError

	const handleDrawerClose = useCallback(() => {
		setTransactionDrawerOpen(false)
		setEditingTransaction(null)
		resetForm()
	}, [resetForm])

	const handleAmountChange = useCallback(
		(value: string) => {
			setAmount(value)
			setFormError(null)
			clearTransactionError()
		},
		[clearTransactionError]
	)

	const handleDescriptionChange = useCallback(
		(value: string) => {
			setDescription(value.slice(0, 30))
			setFormError(null)
			clearTransactionError()
		},
		[clearTransactionError]
	)

	const handleDateTimeChange = useCallback(
		(value: string) => {
			setDateTime(value)
			setFormError(null)
			clearTransactionError()
		},
		[clearTransactionError]
	)

	const handleSelectFromWallet = useCallback(
		(walletId: number) => {
			setFromWalletId(walletId)
			setFormError(null)
			clearTransactionError()
		},
		[clearTransactionError]
	)

	const handleSelectToWallet = useCallback(
		(walletId: number) => {
			setToWalletId(walletId)
			setFormError(null)
			clearTransactionError()
		},
		[clearTransactionError]
	)

	const handleTransactionTypeChange = useCallback(
		(type: TransactionTypeTabValue) => {
			setTransactionType(type)
			setFormError(null)
			clearTransactionError()
			if (type === 'TRANSFER') {
				setSelectedCategory(null)
			} else {
				setToWalletId(null)
			}
		},
		[clearTransactionError]
	)

	const handleSelectCategory = useCallback(
		(category: Category | null) => {
			setSelectedCategory(category)
			setFormError(null)
			clearTransactionError()
		},
		[clearTransactionError]
	)

	const handleTransactionSelect = useCallback(
		async (item: TransactionFeedItem) => {
			setFormError(null)
			clearTransactionError()
			try {
				if (item.entryType === 'TRANSFER') {
					const detail = await getWalletTransaction(item.id)
					setTransactionType('TRANSFER')
					setFromWalletId(detail.fromWalletId)
					setToWalletId(detail.toWalletId)
					setAmount(detail.sourceAmount?.toString() ?? detail.targetAmount?.toString() ?? '0')
					setDescription(detail.description ?? '')
					setDateTime(formatDateTimeLocal(detail.executedAt ? new Date(detail.executedAt) : new Date()))
					setSelectedCategory(null)
					setEditingTransaction({ kind: 'TRANSFER', id: detail.id })
				} else {
					const detail = await getCategoryTransaction(item.id)
					setTransactionType(detail.type)
					setFromWalletId(detail.walletId)
					setToWalletId(null)
					const matchedCategory = categories.find(category => category.id === detail.categoryId)
					const fallbackCategory: Category = matchedCategory ?? {
						id: detail.categoryId,
						name: detail.categoryName,
						color: '#9CA3AF',
						icon: '',
						subcategories: [],
						createdAt: null,
						updatedAt: null,
					}
					setSelectedCategory(fallbackCategory)
					setAmount(detail.amount.toString())
					setDescription(detail.description ?? '')
					setDateTime(formatDateTimeLocal(new Date(detail.occurredAt)))
					setEditingTransaction({ kind: 'CATEGORY', id: detail.id })
				}
				setTransactionDrawerOpen(true)
			} catch (error) {
				const message = error instanceof Error ? error.message : 'Не удалось загрузить транзакцию'
				setTransactionError(message)
			}
		},
		[getWalletTransaction, getCategoryTransaction, categories, clearTransactionError]
	)

	const handleDeleteTransaction = useCallback(async () => {
		if (!editingTransaction) return
		setTransactionSubmitting(true)
		setTransactionError(null)
		try {
			if (editingTransaction.kind === 'TRANSFER') {
				await deleteWalletTransaction(editingTransaction.id)
			} else {
				await deleteCategoryTransaction(editingTransaction.id)
			}
			void fetchWallets().catch(() => undefined)
			void fetchWalletBalances().catch(() => undefined)
			void fetchTransactionFeed().catch(() => undefined)
			handleDrawerClose()
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Не удалось удалить транзакцию'
			setTransactionError(message)
		} finally {
			setTransactionSubmitting(false)
		}
	}, [
		editingTransaction,
		deleteWalletTransaction,
		deleteCategoryTransaction,
		fetchWalletBalances,
		fetchWallets,
		fetchTransactionFeed,
		handleDrawerClose,
	])

	const handleSubmit = useCallback(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault()
			if (submitDisabled || fromWalletId === null || (transactionType === 'TRANSFER' ? toWalletId === null : selectedCategory === null)) {
				return
			}

			const parsedAmount = Number(amount.replace(',', '.'))
			if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
				setFormError('Некорректная сумма')
				return
			}

			const executedAt = new Date(dateTime)
			if (Number.isNaN(executedAt.getTime())) {
				setFormError('Некорректная дата')
				return
			}

			setTransactionSubmitting(true)
			setTransactionError(null)

			try {
				if (editingTransaction) {
					if (editingTransaction.kind === 'TRANSFER') {
						await updateWalletTransaction(editingTransaction.id, {
							fromWalletId,
							toWalletId: toWalletId!,
							amount: parsedAmount,
							description: description.trim() || undefined,
							executedAt,
						})
					} else {
						if (!isCategoryTransactionType(transactionType)) {
							setFormError('Некорректный тип транзакции')
							return
						}
						await updateCategoryTransaction(editingTransaction.id, {
							walletId: fromWalletId,
							categoryId: selectedCategory!.id,
							type: transactionType,
							amount: parsedAmount,
							occurredAt: executedAt,
							description: description.trim() || undefined,
						})
					}
				} else if (transactionType === 'TRANSFER') {
					await createWalletTransaction({
						fromWalletId,
						toWalletId: toWalletId!,
						amount: parsedAmount,
						description: description.trim() || undefined,
						executedAt,
					})
				} else {
					if (!isCategoryTransactionType(transactionType)) {
						setFormError('Некорректный тип транзакции')
						return
					}
					await createCategoryTransaction({
						walletId: fromWalletId,
						categoryId: selectedCategory!.id,
						type: transactionType,
						amount: parsedAmount,
						occurredAt: executedAt,
						description: description.trim() || undefined,
					})
				}

				void fetchWallets().catch(() => undefined)
				void fetchWalletBalances().catch(() => undefined)
				void fetchTransactionFeed().catch(() => undefined)
				handleDrawerClose()
			} catch (err) {
				const message = err instanceof Error ? err.message : 'Не удалось сохранить транзакцию'
				setTransactionError(message)
			} finally {
				setTransactionSubmitting(false)
			}
		},
		[
			submitDisabled,
			transactionType,
			fromWalletId,
			toWalletId,
			selectedCategory,
			amount,
			dateTime,
			description,
			editingTransaction,
			createWalletTransaction,
			createCategoryTransaction,
			updateWalletTransaction,
			updateCategoryTransaction,
			fetchTransactionFeed,
			fetchWallets,
			handleDrawerClose,
			fetchWalletBalances,
		]
	)

	return (
		<div className='relative min-h-screen bg-background overflow-hidden'>
			<div className='relative z-10'>
				<main>
					<section className={cn('min-h-screen', activeTab === 'home' ? 'block' : 'hidden')}>
						<HomeScreen onTransactionSelect={handleTransactionSelect} />
					</section>

					<section className={cn('min-h-screen', activeTab === 'statistics' ? 'block' : 'hidden')}>
						<StatisticsScreen />
					</section>

					<section className={cn('min-h-screen', activeTab === 'budgets' ? 'block' : 'hidden')}>
						<BudgetsScreen />
					</section>

					<section className={cn('min-h-screen', activeTab === 'settings' ? 'block' : 'hidden')}>
						<SettingsScreen />
					</section>
				</main>

				<BottomNav
					tabs={tabs}
					activeKey={activeTab}
					onTabChange={value => setActiveTab(value as TabKey)}
					onCreate={() => {
						resetForm()
						setEditingTransaction(null)
						setTransactionDrawerOpen(true)
					}}
				/>

				<TransactionDrawer
					open={transactionDrawerOpen}
					onClose={handleDrawerClose}
					formId={formId}
					amount={amount}
					onAmountChange={handleAmountChange}
					fromWallet={fromWallet}
					toWallet={toWallet}
					availableFromWallets={availableFromWallets}
					availableToWallets={availableToWallets}
					onSelectFromWallet={handleSelectFromWallet}
					onSelectToWallet={handleSelectToWallet}
					transactionType={transactionType}
					onTransactionTypeChange={handleTransactionTypeChange}
					selectedCategory={selectedCategory}
					onSelectCategory={handleSelectCategory}
					description={description}
					onDescriptionChange={handleDescriptionChange}
					dateTime={dateTime}
					onDateTimeChange={handleDateTimeChange}
					onSubmit={handleSubmit}
					submitDisabled={submitDisabled}
					submitting={transactionSubmitting}
					error={combinedError}
					mode={isEditMode ? 'edit' : 'create'}
					onDelete={isEditMode ? handleDeleteTransaction : undefined}
				/>
			</div>

			{authLoading && (
				<div className='fixed inset-0 z-30 bg-black/80 backdrop-blur-sm'>
					<div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
						<Loader />
					</div>
				</div>
			)}
		</div>
	)
}

export default App
