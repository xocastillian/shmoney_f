import { CalendarClock, CircleDollarSign, FileText, Wallet as WalletIcon, Trash, FolderHeart } from 'lucide-react'
import type { ChangeEvent, FormEvent, ReactNode } from 'react'
import { formatDecimalForDisplay, sanitizeDecimalInput } from '@/utils/number'
import MobileDateTimePickerField from '@/components/DateTimePicker/MobileDateTimePickerField'
import TransactionTypeTabs, { type TransactionTypeTabValue } from '@/components/Transactions/TransactionTypeTabs'

interface TransactionFormProps {
	formId: string
	onSubmit: (event: FormEvent<HTMLFormElement>) => void
	title: string
	mode?: 'create' | 'edit'
	onDelete?: () => void
	deleteDisabled?: boolean
	transactionType?: TransactionTypeTabValue
	onTransactionTypeChange?: (type: TransactionTypeTabValue) => void
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
	categoryLabel?: string
	categorySelected?: boolean
	categoryIcon?: ReactNode
	onOpenCategoryPicker?: () => void
	categoryPickerDisabled?: boolean
	description: string
	onDescriptionChange: (value: string) => void
	dateTime: string
	onDateTimeChange: (value: string) => void
	maxDate?: Date
}

export const TransactionForm = ({
	formId,
	onSubmit,
	title,
	mode = 'create',
	onDelete,
	deleteDisabled = false,
	transactionType = 'TRANSFER',
	onTransactionTypeChange,
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
	categoryLabel = 'Категория',
	categorySelected = false,
	categoryIcon,
	onOpenCategoryPicker,
	categoryPickerDisabled = false,
	description,
	onDescriptionChange,
	dateTime,
	onDateTimeChange,
	maxDate,
}: TransactionFormProps) => {
	const formattedAmount = formatDecimalForDisplay(amount)
	const isEditMode = mode === 'edit'
	const isEditingTransfer = isEditMode && transactionType === 'TRANSFER'
	const shouldRenderTransactionTypeTabs = !isEditingTransfer
	const transactionTypeOptions = isEditMode && !isEditingTransfer ? (['EXPENSE', 'INCOME'] as TransactionTypeTabValue[]) : undefined

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

				{shouldRenderTransactionTypeTabs && (
					<TransactionTypeTabs value={transactionType} onChange={onTransactionTypeChange} options={transactionTypeOptions} className='mb-3' />
				)}

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

					{transactionType === 'TRANSFER' ? (
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
					) : (
						<button
							type='button'
							onClick={onOpenCategoryPicker}
							className='w-full border-b border-divider text-left focus:outline-none focus-visible:bg-background-muted disabled:cursor-not-allowed disabled:opacity-60'
							disabled={categoryPickerDisabled}
						>
							<div className='flex h-16 items-center px-3'>
								{categoryIcon ?? <FolderHeart className='mr-3 text-label' />}
								<span className={categorySelected ? 'text-text' : 'text-label'}>{categorySelected ? categoryLabel : 'Категория'}</span>
							</div>
						</button>
					)}

					<div className='border-b border-divider'>
						<div className='flex h-16 items-center gap-3 px-3'>
							<FileText className='text-label' />
							<input
								type='text'
								value={description}
								onChange={event => onDescriptionChange(event.target.value)}
								maxLength={30}
								className='flex-1 bg-transparent text-text placeholder:text-label outline-none'
								placeholder='Описание (опционально)'
								autoComplete='off'
							/>
							<span className='text-[11px] text-label'>{description.length}/30</span>
						</div>
					</div>

					<div className='border-b border-divider'>
						<MobileDateTimePickerField
							value={dateTime}
							onChange={onDateTimeChange}
							icon={<CalendarClock className={'text-label'} />}
							placeholder='Дата и время'
							maxDate={maxDate}
						/>
					</div>
				</div>
				{mode === 'edit' && onDelete && (
					<div className='border-b border-divider'>
						<button
							type='button'
							onClick={onDelete}
							className='flex h-16 items-center px-3 bg-background-muted w-full text-danger'
							disabled={deleteDisabled}
						>
							<Trash className='mr-3 text-danger' />
							Удалить
						</button>
					</div>
				)}
			</div>
		</form>
	)
}

export default TransactionForm
