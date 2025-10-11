import { X } from 'lucide-react'
import { useId } from 'react'
import type { FormEvent } from 'react'
import Drawer from '@/components/Drawer/Drawer'
import { WalletForm } from './WalletForm'
import type { CurrencyOption } from './types'

interface WalletFormDrawerProps {
	open: boolean
	onClose: () => void
	onSubmit: (event: FormEvent<HTMLFormElement>) => void
	name: string
	onNameChange: (value: string) => void
	currencyCode: string
	onCurrencyChange: (value: string) => void
	currencyOptions: readonly CurrencyOption[]
	onOpenColorPicker: () => void
	selectedColor: string
	balance: string
	onBalanceChange: (value: string) => void
	error: string | null
	submitDisabled?: boolean
}

export function WalletFormDrawer({
	open,
	onClose,
	onSubmit,
	name,
	onNameChange,
	currencyCode,
	onCurrencyChange,
	currencyOptions,
	onOpenColorPicker,
	selectedColor,
	balance,
	onBalanceChange,
	error,
	submitDisabled = false,
}: WalletFormDrawerProps) {
	const formId = useId()

	return (
		<Drawer open={open} onClose={onClose}>
			<div className='flex h-full flex-col'>
				<div className='mb-3 flex items-center justify-between gap-3 p-3'>
					<button type='button' onClick={onClose} className='rounded-full p-2' aria-label='Закрыть'>
						<X />
					</button>
					<button
						type='submit'
						form={formId}
						className='rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-50'
						disabled={submitDisabled}
					>
						Создать кошелёк
					</button>
				</div>

				<WalletForm
					name={name}
					onNameChange={onNameChange}
					currencyCode={currencyCode}
					onCurrencyChange={onCurrencyChange}
					currencyOptions={currencyOptions}
					onSubmit={onSubmit}
					onOpenColorPicker={onOpenColorPicker}
					selectedColor={selectedColor}
					balance={balance}
					onBalanceChange={onBalanceChange}
					error={error}
					formId={formId}
				/>
			</div>
		</Drawer>
	)
}

export default WalletFormDrawer
