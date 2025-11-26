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
import { disableVerticalSwipes, enableVerticalSwipes, isInTelegram } from '@/lib/telegram'

type TabKey = 'home' | 'statistics' | 'budgets' | 'settings'

const getCurrentDateTimeString = () => formatDateTimeLocal(new Date())

function App() {
	const [activeTab, setActiveTab] = useState<TabKey>('home')
	const [transactionDrawerOpen, setTransactionDrawerOpen] = useState(false)
	const formId = useId()
	const { wallets, fetchWallets } = useWallets()
	const { createWalletTransaction, createCategoryTransaction } = useTransactions()
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

	useEffect(() => {
		if (!isInTelegram()) return

		disableVerticalSwipes()
		return () => {
			enableVerticalSwipes()
		}
	}, [])

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
		setTransactionType('TRANSFER')
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

	const handleSubmit = useCallback(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault()
			const isTransfer = transactionType === 'TRANSFER'
			if (submitDisabled || fromWalletId === null || (isTransfer ? toWalletId === null : selectedCategory === null)) {
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
				if (isTransfer) {
					await createWalletTransaction({
						fromWalletId,
						toWalletId: toWalletId!,
						amount: parsedAmount,
						description: description.trim() || undefined,
						executedAt,
					})
				} else {
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
				handleDrawerClose()
			} catch (err) {
				const message = err instanceof Error ? err.message : 'Не удалось создать транзакцию'
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
			createWalletTransaction,
			createCategoryTransaction,
			fetchWallets,
			handleDrawerClose,
		]
	)

	return (
		<div className='relative min-h-screen bg-background'>
			<main>
				<section className={cn('min-h-screen', activeTab === 'home' ? 'block' : 'hidden')}>
					<HomeScreen />
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
					clearTransactionError()
					setFormError(null)
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
			/>
		</div>
	)
}

export default App
