import { Calculator, CircleDollarSign, Info, Palette } from 'lucide-react'
import type { FormEvent, KeyboardEvent } from 'react'
import type { CurrencyOption } from './types'

interface WalletFormProps {
	name: string
	onNameChange: (value: string) => void
	currencyCode: string
	onCurrencyChange: (value: string) => void
	currencyOptions: readonly CurrencyOption[]
	onSubmit: (event: FormEvent<HTMLFormElement>) => void
	onOpenColorPicker: () => void
	selectedColor: string
	balance: string
	onBalanceChange: (value: string) => void
	error: string | null
	formId: string
}

export function WalletForm({
	name,
	onNameChange,
	currencyCode,
	onCurrencyChange,
	currencyOptions,
	onSubmit,
	onOpenColorPicker,
	selectedColor,
	balance,
	onBalanceChange,
	error,
	formId,
}: WalletFormProps) {
	const handleColorPickerKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault()
			onOpenColorPicker()
		}
	}

	const colorChipStyle = selectedColor ? { backgroundColor: selectedColor } : undefined

	return (
		<form id={formId} className='flex flex-1 flex-col gap-4' onSubmit={onSubmit}>
			<div>
				<h1 className='text-sm px-3 mb-3'>Создание кошелька</h1>
				<div className='bg-background-muted'>
					<div className='border-b border-divider'>
						<div className='flex items-center px-3 h-16'>
							<Info className='mr-3 text-label' />
							<input
								className='flex-1 bg-transparent text-label placeholder:text-label outline-none'
								placeholder='Название'
								value={name}
								onChange={event => onNameChange(event.target.value)}
							/>
						</div>
					</div>

					<div className='border-b border-divider'>
						<div className='flex items-center px-3 h-16'>
							<CircleDollarSign className='mr-3 text-label' />
							<select
								className='flex-1 bg-transparent text-label outline-none'
								value={currencyCode}
								onChange={event => onCurrencyChange(event.target.value)}
							>
								{currencyOptions.map(option => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
							</select>
						</div>
					</div>

					<div className='border-b border-divider'>
						<div className='flex items-center px-3 h-16'>
							<Calculator className='mr-3 text-label' />
							<input
								className='flex-1 bg-transparent placeholder:text-label outline-none'
								type='number'
								inputMode='decimal'
								placeholder='Баланс'
								value={balance}
								onChange={event => onBalanceChange(event.target.value)}
								min='0'
								step='0.01'
							/>
						</div>
					</div>

					<div className='border-b border-divider'>
						<div
							className='flex h-16 cursor-pointer items-center px-3'
							role='button'
							tabIndex={0}
							onClick={onOpenColorPicker}
							onKeyDown={handleColorPickerKeyDown}
						>
							<Palette className='mr-3 text-label transition-colors' />
							<span className='text-label transition-colors'>Цвет</span>
							<span className='ml-auto h-6 w-6 rounded-full border border-divider' style={colorChipStyle} aria-hidden='true' />
						</div>
					</div>
				</div>
			</div>

			{error && <p className='px-3 text-xs text-red-500'>{error}</p>}
		</form>
	)
}

export default WalletForm
