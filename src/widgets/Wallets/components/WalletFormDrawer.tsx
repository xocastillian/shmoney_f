import { X } from 'lucide-react'
import { useId } from 'react'
import type { FormEvent } from 'react'
import Drawer from '@/components/Drawer/Drawer'
import { WalletForm } from './WalletForm'
import type { CurrencyOption } from './types'
import type { WalletType } from '@/types/entities/wallet'

interface WalletFormDrawerProps {
	open: boolean
	onClose: () => void
	onSubmit: (event: FormEvent<HTMLFormElement>) => void
	name: string
	onNameChange: (value: string) => void
	currencyCode: string
	currencyOptions: readonly CurrencyOption[]
	onOpenCurrencyPicker: () => void
	onOpenTypePicker: () => void
	selectedType: WalletType
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
	currencyOptions,
	onOpenCurrencyPicker,
	onOpenTypePicker,
	selectedType,
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
				<div className='flex items-center justify-between gap-3 p-3'>
					<button type='button' onClick={onClose} className='rounded-full p-2' aria-label='Закрыть'>
						<X />
					</button>
					<button
						type='submit'
						form={formId}
						className='
                        rounded-md px-4 py-2 text-sm font-medium 
                        bg-accent-orange text-text-dark 
                        disabled:bg-background-muted disabled:text-accent-orange disabled:opacity-50 
                        transition-colors duration-300 ease-in-out
                      '
						disabled={submitDisabled}
					>
						Готово
					</button>
				</div>

				<WalletForm
					name={name}
					onNameChange={onNameChange}
					currencyCode={currencyCode}
					currencyOptions={currencyOptions}
					onSubmit={onSubmit}
					onOpenCurrencyPicker={onOpenCurrencyPicker}
					onOpenTypePicker={onOpenTypePicker}
					selectedType={selectedType}
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
