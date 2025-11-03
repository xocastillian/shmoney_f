import { CalendarClock, CircleDollarSign, FileText, Wallet as WalletIcon } from 'lucide-react'
import type { ChangeEvent, FormEvent, ReactNode } from 'react'
import { formatDecimalForDisplay, sanitizeDecimalInput } from '@/utils/number'

interface TransactionFormProps {
	formId: string
	onSubmit: (event: FormEvent<HTMLFormElement>) => void
	title: string
	amount: string
	onAmountChange: (value: string) => void
	fromWalletCurrencyIcon?: string | null
	fromWalletIcon?: ReactNode
	fromWalletLabel: string
	fromWalletSelected: boolean
	onOpenFromWalletPicker: () => void
	fromWalletPickerDisabled?: boolean
	toWalletLabel: string
	toWalletSelected: boolean
	onOpenToWalletPicker: () => void
	toWalletIcon?: ReactNode
	toWalletPickerDisabled?: boolean
	description: string
	onDescriptionChange: (value: string) => void
	dateTime: string
	onDateTimeChange: (value: string) => void
}

export const TransactionForm = ({
	formId,
	onSubmit,
	title,
	amount,
	onAmountChange,
	fromWalletCurrencyIcon,
	fromWalletIcon,
	fromWalletLabel,
	fromWalletSelected,
	onOpenFromWalletPicker,
	fromWalletPickerDisabled = false,
	toWalletLabel,
	toWalletSelected,
	onOpenToWalletPicker,
	toWalletIcon,
	toWalletPickerDisabled = false,
	description,
	onDescriptionChange,
	dateTime,
	onDateTimeChange,
}: TransactionFormProps) => {
	const formattedAmount = formatDecimalForDisplay(amount)

	const handleAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
		const sanitized = sanitizeDecimalInput(event.target.value)
		const digitCount = sanitized.replace(/\./g, '').length
		if (digitCount > 9) return
		onAmountChange(sanitized)
	}

	return (
		<form id={formId} onSubmit={onSubmit} className='flex flex-1 flex-col gap-4'>
			<div>
				<h1 className='mb-3 px-3 text-sm'>{title}</h1>

				<div className='bg-background-muted'>
					<div className='border-b border-divider'>
						<div className='flex h-16 items-center px-3'>
							{fromWalletCurrencyIcon ? (
								<img src={fromWalletCurrencyIcon} alt='' className='mr-3 h-6 w-6' />
							) : (
								<CircleDollarSign className='mr-3 text-label' />
							)}
							<input
								className='flex-1 bg-transparent placeholder:text-label outline-none'
								type='text'
								inputMode='decimal'
								placeholder='Сумма'
								value={formattedAmount}
								onChange={handleAmountChange}
								autoComplete='off'
							/>
						</div>
					</div>

					<button
						type='button'
						onClick={onOpenFromWalletPicker}
						className='w-full border-b border-divider text-left focus:outline-none focus-visible:bg-background-muted disabled:cursor-not-allowed disabled:opacity-60'
						disabled={fromWalletPickerDisabled}
					>
						<div className='flex h-16 items-center px-3'>
							{fromWalletIcon ?? <WalletIcon className='mr-3 text-label' />}
							<span className={fromWalletSelected ? 'text-text' : 'text-label'}>{fromWalletSelected ? fromWalletLabel : 'Откуда'}</span>
						</div>
					</button>

					<button
						type='button'
						onClick={onOpenToWalletPicker}
						className='w-full border-b border-divider text-left focus:outline-none focus-visible:bg-background-muted disabled:cursor-not-allowed disabled:opacity-60'
						disabled={toWalletPickerDisabled}
					>
						<div className='flex h-16 items-center px-3'>
							{toWalletIcon ?? <WalletIcon className='mr-3 text-label' />}
							<span className={toWalletSelected ? 'text-text' : 'text-label'}>{toWalletSelected ? toWalletLabel : 'Куда'}</span>
						</div>
					</button>

					<div className='border-b border-divider'>
						<div className='flex h-16 items-center gap-3 px-3'>
							<FileText className='text-label' />
							<input
								type='text'
								value={description}
								onChange={event => onDescriptionChange(event.target.value)}
								maxLength={30}
								className='flex-1 bg-transparent text-sm text-text placeholder:text-label outline-none'
								placeholder='Описание (опционально)'
								autoComplete='off'
							/>
							<span className='text-[11px] text-label'>{description.length}/30</span>
						</div>
					</div>

					<div className='border-b border-divider'>
						<div className='flex h-16 items-center gap-3 px-3'>
							<CalendarClock className='text-label' />
							<input
								type='datetime-local'
								value={dateTime}
								onChange={event => onDateTimeChange(event.target.value)}
								className='flex-1 bg-transparent text-text outline-none [appearance:none] [text-align:left!important]'
								required
							/>
						</div>
					</div>
				</div>
			</div>
		</form>
	)
}

export default TransactionForm
