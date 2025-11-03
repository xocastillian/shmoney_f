import { useCallback, useEffect, useMemo, useState, useId, type FormEvent } from 'react'
import { X } from 'lucide-react'
import Drawer from '@/components/Drawer/Drawer'
import { useWallets } from '@/hooks/useWallets'
import { TransactionForm } from './TransactionForm'
import TransactionWalletPickerDrawer from './TransactionWalletPickerDrawer'
import { currencyIconMap } from '@/widgets/Wallets/types'
import { formatDateTimeLocal } from '@/utils/date'
import { getWalletIcon, mapWalletsToPickerOptions, type WalletPickerOption } from '@/utils/wallet'

interface TransactionDrawerProps {
	open: boolean
	onClose: () => void
	onSubmit?: (payload: { amount: number; fromWalletId: number; toWalletId: number; description: string; date: string }) => void
}

const getCurrentDateTimeString = () => formatDateTimeLocal(new Date())

export const TransactionDrawer = ({ open, onClose, onSubmit }: TransactionDrawerProps) => {
	const formId = useId()
	const { wallets, fetchWallets } = useWallets()
	const [amount, setAmount] = useState('')
	const [fromWalletId, setFromWalletId] = useState<number | null>(null)
	const [toWalletId, setToWalletId] = useState<number | null>(null)
	const [description, setDescription] = useState('')
	const [dateTime, setDateTime] = useState(getCurrentDateTimeString)
	const [fromPickerOpen, setFromPickerOpen] = useState(false)
	const [toPickerOpen, setToPickerOpen] = useState(false)

	const resetFormState = useCallback(() => {
		setAmount('')
		setDescription('')
		setDateTime(getCurrentDateTimeString())
		setFromWalletId(null)
		setToWalletId(null)
		setFromPickerOpen(false)
		setToPickerOpen(false)
	}, [])

	useEffect(() => {
		if (open && wallets.length === 0) {
			void fetchWallets()
		}
	}, [open, wallets.length, fetchWallets])

	useEffect(() => {
		if (!open) {
			resetFormState()
			return
		}

		setFromWalletId(prev => prev ?? wallets[0]?.id ?? null)
	}, [open, wallets, resetFormState])

	useEffect(() => {
		if (fromWalletId !== null && toWalletId === fromWalletId) {
			setToWalletId(null)
		}
	}, [fromWalletId, toWalletId])

	const fromWallet = wallets.find(wallet => wallet.id === fromWalletId) ?? null
	const toWallet = wallets.find(wallet => wallet.id === toWalletId) ?? null

	const availableFromWallets: WalletPickerOption[] = useMemo(() => mapWalletsToPickerOptions(wallets), [wallets])

	const availableToWallets = useMemo(() => {
		return mapWalletsToPickerOptions(wallets.filter(wallet => wallet.id !== fromWalletId))
	}, [wallets, fromWalletId])

	const fromWalletPickerDisabled = availableFromWallets.length === 0
	const toWalletPickerDisabled = availableToWallets.length === 0

	const amountValid = useMemo(() => {
		if (amount.trim().length === 0) return false
		const parsed = Number(amount.replace(',', '.'))
		return !Number.isNaN(parsed) && parsed > 0
	}, [amount])

	const dateValid = dateTime.trim().length > 0

	const submitDisabled = fromWalletId === null || toWalletId === null || !amountValid || !dateValid

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		if (submitDisabled || fromWalletId === null || toWalletId === null) return

		const parsedAmount = Number(amount.replace(',', '.'))
		if (Number.isNaN(parsedAmount) || parsedAmount <= 0) return

		onSubmit?.({
			amount: parsedAmount,
			fromWalletId: fromWalletId,
			toWalletId: toWalletId,
			description: description.trim(),
			date: dateTime,
		})
		onClose()
	}

	return (
		<>
			<Drawer open={open} onClose={onClose}>
				<div className='flex h-full flex-col'>
					<div className='flex items-center justify-between gap-3 p-3'>
						<button type='button' onClick={onClose} className='rounded-full p-2' aria-label='Закрыть'>
							<X />
						</button>
						<button
							type='submit'
							form={formId}
							className='rounded-md px-4 py-2 text-sm font-medium bg-accent-orange text-text-dark disabled:bg-background-muted disabled:text-accent-orange disabled:opacity-50 transition-colors duration-300 ease-in-out'
							disabled={submitDisabled}
						>
							Создать
						</button>
					</div>

					<TransactionForm
						formId={formId}
						onSubmit={handleSubmit}
						title='Новая транзакция'
						amount={amount}
						onAmountChange={value => setAmount(value)}
						fromWalletCurrencyIcon={fromWallet?.currencyCode ? currencyIconMap[fromWallet.currencyCode] ?? null : null}
						fromWalletIcon={getWalletIcon(fromWallet)}
						fromWalletLabel={fromWallet?.name ?? (fromWalletPickerDisabled ? 'Нет доступных кошельков' : 'Выберите кошелёк')}
						fromWalletSelected={fromWalletId !== null}
						onOpenFromWalletPicker={() => setFromPickerOpen(true)}
						fromWalletPickerDisabled={fromWalletPickerDisabled}
						toWalletIcon={getWalletIcon(toWallet)}
						toWalletLabel={toWallet?.name ?? (toWalletPickerDisabled ? 'Нет доступных кошельков' : 'Выберите получателя')}
						toWalletSelected={toWalletId !== null}
						onOpenToWalletPicker={() => setToPickerOpen(true)}
						toWalletPickerDisabled={toWalletPickerDisabled}
						description={description}
						onDescriptionChange={value => setDescription(value.slice(0, 30))}
						dateTime={dateTime}
						onDateTimeChange={setDateTime}
					/>
				</div>
			</Drawer>

			<TransactionWalletPickerDrawer
				open={fromPickerOpen}
				onClose={() => setFromPickerOpen(false)}
				title='Выберите исходный кошелёк'
				wallets={availableFromWallets}
				selectedWalletId={fromWalletId}
				onSelect={walletId => {
					setFromWalletId(walletId)
					setFromPickerOpen(false)
				}}
			/>

			<TransactionWalletPickerDrawer
				open={toPickerOpen}
				onClose={() => setToPickerOpen(false)}
				title='Выберите получателя'
				wallets={availableToWallets}
				selectedWalletId={toWalletId}
				onSelect={walletId => {
					setToWalletId(walletId)
					setToPickerOpen(false)
				}}
				emptyStateLabel='Нет доступных кошельков для перевода'
			/>
		</>
	)
}

export default TransactionDrawer
