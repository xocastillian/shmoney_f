import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import Drawer from '@/components/Drawer/Drawer'
import { TransactionForm } from './TransactionForm'
import TransactionWalletPickerDrawer from './TransactionWalletPickerDrawer'
import { currencyIconMap } from '@/widgets/Wallets/types'
import { getWalletIcon, type WalletPickerOption } from '@/utils/wallet'
import type { Wallet } from '@/types/entities/wallet'

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
	description: string
	onDescriptionChange: (value: string) => void
	dateTime: string
	onDateTimeChange: (value: string) => void
	onSubmit: (event: FormEvent<HTMLFormElement>) => void
	submitDisabled: boolean
	submitting: boolean
	error: string | null
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
	description,
	onDescriptionChange,
	dateTime,
	onDateTimeChange,
	onSubmit,
	submitDisabled,
	submitting,
	error,
}: TransactionDrawerProps) => {
	const [fromPickerOpen, setFromPickerOpen] = useState(false)
	const [toPickerOpen, setToPickerOpen] = useState(false)

	useEffect(() => {
		if (!open) {
			setFromPickerOpen(false)
			setToPickerOpen(false)
		}
	}, [open])

	const fromWalletCurrencyIcon = useMemo(() => (fromWallet?.currencyCode ? currencyIconMap[fromWallet.currencyCode] ?? null : null), [fromWallet])
	const fromWalletIcon = useMemo(() => getWalletIcon(fromWallet), [fromWallet])
	const toWalletIcon = useMemo(() => getWalletIcon(toWallet), [toWallet])
	const fromWalletLabel = fromWallet?.name ?? (availableFromWallets.length === 0 ? 'Нет доступных кошельков' : 'Выберите кошелёк')
	const toWalletLabel = toWallet?.name ?? (availableToWallets.length === 0 ? 'Нет доступных кошельков' : 'Выберите получателя')
	const submitButtonLabel = submitting ? 'Создание...' : 'Создать'

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
						title='Новая транзакция'
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
						description={description}
						onDescriptionChange={onDescriptionChange}
						dateTime={dateTime}
						onDateTimeChange={onDateTimeChange}
					/>
				</div>
			</Drawer>

			<TransactionWalletPickerDrawer
				open={fromPickerOpen}
				onClose={() => setFromPickerOpen(false)}
				title='Выберите исходный кошелёк'
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
				title='Выберите получателя'
				wallets={availableToWallets}
				selectedWalletId={toWallet?.id ?? null}
				onSelect={walletId => {
					onSelectToWallet(walletId)
					setToPickerOpen(false)
				}}
				emptyStateLabel='Нет доступных кошельков для перевода'
			/>
		</>
	)
}

export default TransactionDrawer
