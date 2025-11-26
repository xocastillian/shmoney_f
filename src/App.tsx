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
import { useCreateTransaction } from '@/hooks/useCreateTransaction'
import { formatDateTimeLocal } from '@/utils/date'
import { mapWalletsToPickerOptions } from '@/utils/wallet'
import type { Wallet } from '@/types/entities/wallet'
import type { WalletTransactionResponse } from '@api/types'
import { disableVerticalSwipes, enableVerticalSwipes, isInTelegram } from '@/lib/telegram'

type TabKey = 'home' | 'statistics' | 'budgets' | 'settings'

const getCurrentDateTimeString = () => formatDateTimeLocal(new Date())

function App() {
	const [activeTab, setActiveTab] = useState<TabKey>('home')
	const [transactionDrawerOpen, setTransactionDrawerOpen] = useState(false)
	const formId = useId()
	const { wallets, fetchWallets } = useWallets()
	const { createTransaction, loading: transactionLoading, error: transactionError, clearError } = useCreateTransaction()
	const [amount, setAmount] = useState('')
	const [fromWalletId, setFromWalletId] = useState<number | null>(null)
	const [toWalletId, setToWalletId] = useState<number | null>(null)
	const [description, setDescription] = useState('')
	const [dateTime, setDateTime] = useState(getCurrentDateTimeString)
	const [formError, setFormError] = useState<string | null>(null)

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

	const resetForm = useCallback(() => {
		setAmount('')
		setDescription('')
		setDateTime(getCurrentDateTimeString())
		setFromWalletId(null)
		setToWalletId(null)
		setFormError(null)
		clearError()
	}, [clearError])

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

	const submitDisabled = transactionLoading || !amountValid || !dateValid || fromWalletId === null || toWalletId === null
	const combinedError = formError ?? transactionError

	const handleDrawerClose = useCallback(() => {
		setTransactionDrawerOpen(false)
		resetForm()
	}, [resetForm])

	const handleAmountChange = useCallback(
		(value: string) => {
			setAmount(value)
			setFormError(null)
			clearError()
		},
		[clearError]
	)

	const handleDescriptionChange = useCallback(
		(value: string) => {
			setDescription(value.slice(0, 30))
			setFormError(null)
			clearError()
		},
		[clearError]
	)

	const handleDateTimeChange = useCallback(
		(value: string) => {
			setDateTime(value)
			setFormError(null)
			clearError()
		},
		[clearError]
	)

	const handleSelectFromWallet = useCallback((walletId: number) => {
		setFromWalletId(walletId)
	}, [])

	const handleSelectToWallet = useCallback((walletId: number) => {
		setToWalletId(walletId)
	}, [])

	const handleTransactionCreated = useCallback((transaction: WalletTransactionResponse) => {
		console.log('Создана транзакция', transaction)
	}, [])

	const handleSubmit = useCallback(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault()
			if (submitDisabled || fromWalletId === null || toWalletId === null) return

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

			try {
				const transaction = await createTransaction({
					fromWalletId,
					toWalletId,
					amount: parsedAmount,
					description: description.trim() || undefined,
					executedAt,
				})

				handleTransactionCreated(transaction)
				void fetchWallets().catch(() => undefined)
				handleDrawerClose()
			} catch {
				// Ошибка обработана в хукe useCreateTransaction
			}
		},
		[
			submitDisabled,
			fromWalletId,
			toWalletId,
			amount,
			dateTime,
			description,
			createTransaction,
			handleTransactionCreated,
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
					clearError()
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
				description={description}
				onDescriptionChange={handleDescriptionChange}
				dateTime={dateTime}
				onDateTimeChange={handleDateTimeChange}
				onSubmit={handleSubmit}
				submitDisabled={submitDisabled}
				submitting={transactionLoading}
				error={combinedError}
			/>
		</div>
	)
}

export default App
