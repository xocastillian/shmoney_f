import { BanknoteX, Calculator, Check, CircleDollarSign, Info, Palette } from 'lucide-react'
import type { ChangeEvent, FormEvent, KeyboardEvent } from 'react'
import { currencyIconMap, typeIcons, type CurrencyOption } from '../types'
import { WalletType } from '@/types/entities/wallet'
import { formatDecimalForDisplay, sanitizeDecimalInput } from '@/utils/number'
import { useTranslation } from '@/i18n'
import { cn } from '@/lib/utils'

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
	onArchive?: () => void
	disableArchive?: boolean
	submitLabel?: string
	submitDisabled?: boolean
	isArchived?: boolean
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
	onArchive,
	disableArchive = false,
	submitLabel = 'Готово',
	submitDisabled = false,
	isArchived = false,
}: WalletFormProps) {
	const { t } = useTranslation()

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
	const typeLabel = t(
		`wallets.form.type.${
			selectedType === WalletType.BANK_CARD
				? 'bankCard'
				: selectedType === WalletType.SAVINGS_ACCOUNT
				? 'savingsAccount'
				: selectedType === WalletType.CRYPTO
				? 'crypto'
				: selectedType === WalletType.INVESTMENT_ACCOUNT
				? 'investmentAccount'
				: 'cash'
		}`
	)
	const SelectedTypeIcon = typeIcons[selectedType]
	const selectedCurrency = currencyOptions.find(option => option.value === currencyCode)
	const currencyLabel = selectedCurrency ? t(selectedCurrency.label) : currencyCode
	const currencyIcon = currencyIconMap[currencyCode]
	const formattedBalance = formatDecimalForDisplay(balance)
	const archiveButtonLabel = t(isArchived ? 'common.unarchive' : 'common.archive')
	const archiveButtonColor = isArchived ? 'text-accent' : 'text-danger'
	const archiveIconColor = isArchived ? 'text-accent' : 'text-danger'

	const handleBalanceChange = (event: ChangeEvent<HTMLInputElement>) => {
		const sanitized = sanitizeDecimalInput(event.target.value)
		const digitCount = sanitized.replace(/\./g, '').length
		if (digitCount > 9) return
		onBalanceChange(sanitized)
	}

	return (
		<form id={formId} className='flex flex-1 flex-col' onSubmit={onSubmit}>
			<div>
				<h1 className='text-sm px-3 mb-3'>{t('common.general')}</h1>
				<div className='border-b border-divider bg-background-muted'>
					<div className='flex items-center px-3 h-16'>
						<Info className='mr-3 text-label' />
						<input
							className='flex-1 bg-transparent text-text placeholder:text-label outline-none'
							placeholder={t('wallets.form.name')}
							value={name}
							onChange={event => onNameChange(event.target.value)}
							maxLength={15}
						/>
					</div>
				</div>

				<div className='border-b border-divider bg-background-muted'>
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

				<div className='border-b border-divider bg-background-muted'>
					<div className='flex items-center px-3 h-16'>
						<Calculator className='mr-3 text-label' />
						<input
							className='flex-1 bg-transparent placeholder:text-label outline-none'
							type='text'
							inputMode='decimal'
							placeholder={t('wallets.form.balance')}
							value={formattedBalance}
							onChange={handleBalanceChange}
							autoComplete='off'
						/>
					</div>
				</div>

				<div className='border-b border-divider bg-background-muted'>
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

				<div className='border-b border-divider bg-background-muted'>
					<div
						className='flex h-16 cursor-pointer items-center px-3'
						role='button'
						tabIndex={0}
						onClick={onOpenColorPicker}
						onKeyDown={handleColorPickerKeyDown}
					>
						<Palette className='mr-3 text-label transition-colors' style={colorStyle} />
						<span className={cn('transition-colors', selectedColor ? 'text-text' : 'text-label')} style={colorStyle}>
							{t('wallets.form.color')}
						</span>
					</div>
				</div>

				<h2 className='text-sm m-3'>{t('common.actions')}</h2>

				<div className='border-b border-divider bg-background-muted'>
					<button type='submit' className='flex h-16 w-full items-center px-3 text-access disabled:text-label' disabled={submitDisabled}>
						<Check className={cn('mr-3 transition-colors', submitDisabled ? 'text-label' : 'text-access')} />
						<span className={cn('transition-colors', submitDisabled ? 'text-label' : 'text-access')}>{submitLabel}</span>
					</button>
				</div>

				{onArchive && (
					<div className='border-b border-divider bg-background-muted'>
						<button className='flex h-16 cursor-pointer items-center px-3 w-full' type='button' onClick={onArchive} disabled={disableArchive}>
							<BanknoteX className={`mr-3 ${archiveIconColor}`} />
							<span className={archiveButtonColor}>{archiveButtonLabel}</span>
						</button>
					</div>
				)}
			</div>

			{error && <p className='px-3 text-xs text-danger'>{error}</p>}
		</form>
	)
}

export default WalletForm
