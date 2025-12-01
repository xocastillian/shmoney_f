import { X } from 'lucide-react'
import { useId } from 'react'
import type { FormEvent } from 'react'
import Loader from '@/components/ui/Loader/Loader'
import { WalletForm } from './WalletForm'
import type { CurrencyOption } from '../types'
import type { WalletType } from '@/types/entities/wallet'
import Drawer from '@/components/Drawer/Drawer'

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
	title: string
	submitLabel?: string
	onDelete?: () => void
	disableDelete?: boolean
	submitting?: boolean
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
	title,
	submitLabel = 'Готово',
	onDelete,
	disableDelete = false,
	submitting = false,
}: WalletFormDrawerProps) {
	const formId = useId()

	return (
		<Drawer open={open} onClose={onClose} className='bg-background-secondary rounded-t-lg' swipeable={false}>
			<div className='flex h-full flex-col'>
				<div className='flex items-center justify-between gap-3 p-3 flex-none sticky top-0 z-20 bg-background-secondary border-b border-divider'>
					<h2 className='text-lg font-medium text-text'>{title}</h2>
					<button type='button' onClick={onClose} className='rounded-full p-2' aria-label='Закрыть'>
						<X />
					</button>
				</div>

				{error && (
					<div className='px-3 pb-2 text-sm text-danger' role='alert'>
						{error}
					</div>
				)}

				<div className='overflow-auto flex-1 px-0 py-3'>
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
						onDelete={onDelete}
						disableDelete={disableDelete}
						submitLabel={submitLabel}
						submitDisabled={submitDisabled}
					/>
				</div>
			</div>

			{open && submitting && (
				<div className='fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm'>
					<div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
						<Loader />
					</div>
				</div>
			)}
		</Drawer>
	)
}

export default WalletFormDrawer
