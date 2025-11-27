import { Calculator, CircleDollarSign, Info, Palette, Trash } from 'lucide-react'
import type { ChangeEvent, FormEvent, KeyboardEvent } from 'react'
import { currencyIconMap, typeIcons, type CurrencyOption } from '../types'
import { walletTypeLabels, WalletType } from '@/types/entities/wallet'
import { formatDecimalForDisplay, sanitizeDecimalInput } from '@/utils/number'

interface WalletFormProps {
	name: string
	onNameChange: (value: string) => void
	currencyCode: string
	currencyOptions: readonly CurrencyOption[]
	onSubmit: (event: FormEvent<HTMLFormElement>) => void
	onOpenCurrencyPicker: () => void
	onOpenColorPicker: () => void
	selectedColor: string
	selectedType: WalletType
	onOpenTypePicker: () => void
	balance: string
	onBalanceChange: (value: string) => void
	error: string | null
	formId: string
	title: string
	onDelete?: () => void
	disableDelete?: boolean
}

export function WalletForm({
	name,
	onNameChange,
	currencyCode,
	currencyOptions,
	onSubmit,
	onOpenCurrencyPicker,
	onOpenColorPicker,
	selectedColor,
	selectedType,
	onOpenTypePicker,
	balance,
	onBalanceChange,
	error,
	formId,
	title,
	onDelete,
	disableDelete = false,
}: WalletFormProps) {
	const handleColorPickerKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault()
			onOpenColorPicker()
		}
	}

	const handleTypePickerKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault()
			onOpenTypePicker()
		}
	}

	const handleCurrencyPickerKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault()
			onOpenCurrencyPicker()
		}
	}

	const colorStyle = selectedColor ? { color: selectedColor } : undefined
	const typeLabel = walletTypeLabels[selectedType]
	const SelectedTypeIcon = typeIcons[selectedType]
	const selectedCurrency = currencyOptions.find(option => option.value === currencyCode)
	const currencyLabel = selectedCurrency?.label ?? currencyCode
	const currencyIcon = currencyIconMap[currencyCode]
	const formattedBalance = formatDecimalForDisplay(balance)

	const handleBalanceChange = (event: ChangeEvent<HTMLInputElement>) => {
		const sanitized = sanitizeDecimalInput(event.target.value)
		const digitCount = sanitized.replace(/\./g, '').length
		if (digitCount > 9) return
		onBalanceChange(sanitized)
	}

	return (
		<form id={formId} className='flex flex-1 flex-col' onSubmit={onSubmit}>
			<div>
				<h1 className='text-sm px-3 mb-3'>{title}</h1>
				<div className='bg-background-muted'>
					<div className='border-b border-divider'>
						<div className='flex items-center px-3 h-16'>
							<Info className='mr-3 text-label' />
							<input
								className='flex-1 bg-transparent text-text placeholder:text-label outline-none'
								placeholder='Название'
								value={name}
								onChange={event => onNameChange(event.target.value)}
								maxLength={15}
							/>
						</div>
					</div>

					<div className='border-b border-divider'>
						<div
							className='flex h-16 cursor-pointer items-center px-3'
							role='button'
							tabIndex={0}
							onClick={onOpenCurrencyPicker}
							onKeyDown={handleCurrencyPickerKeyDown}
						>
							{currencyIcon ? <img src={currencyIcon} alt='' className='mr-3 h-6 w-6' /> : <CircleDollarSign className='mr-3 text-label' />}
							<span className='text-text'>{currencyLabel}</span>
						</div>
					</div>

					<div className='border-b border-divider'>
						<div className='flex items-center px-3 h-16'>
							<Calculator className='mr-3 text-label' />
							<input
								className='flex-1 bg-transparent placeholder:text-label outline-none'
								type='text'
								inputMode='decimal'
								placeholder='Баланс'
								value={formattedBalance}
								onChange={handleBalanceChange}
								autoComplete='off'
							/>
						</div>
					</div>

					<div className='border-b border-divider'>
						<div
							className='flex h-16 cursor-pointer items-center px-3'
							role='button'
							tabIndex={0}
							onClick={onOpenTypePicker}
							onKeyDown={handleTypePickerKeyDown}
						>
							<SelectedTypeIcon className='mr-3 text-label' />
							<span className='text-text'>{typeLabel}</span>
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
							<Palette className='mr-3 text-label transition-colors' style={colorStyle} />
							<span className='text-label transition-colors' style={colorStyle}>
								Цвет
							</span>
						</div>
					</div>

					{onDelete && (
						<div className='border-b border-divider'>
							<button className='flex h-16 cursor-pointer items-center px-3 w-full' type='button' onClick={onDelete} disabled={disableDelete}>
								<Trash className='mr-3 text-danger' />
								<span className='text-danger'>Удалить кошелёк</span>
							</button>
						</div>
					)}
				</div>
			</div>

			{error && <p className='px-3 text-xs text-danger'>{error}</p>}
		</form>
	)
}

export default WalletForm
