import { CircleDollarSign, FileText, Wallet as WalletIcon, Trash, FolderHeart, CalendarClock } from 'lucide-react'
import type { ChangeEvent, FormEvent, ReactNode } from 'react'
import { formatDecimalForDisplay, sanitizeDecimalInput } from '@/utils/number'
import TransactionTypeTabs, { type TransactionTypeTabValue } from '@/components/Transactions/TransactionTypeTabs'
import { useTranslation } from '@/i18n'
import MobileDateTimePickerField from '@/components/DateTimePicker/MobileDateTimePickerField'

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
	submitDisabled?: boolean
	submitting?: boolean
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
	submitDisabled = false,
	submitting = false,
}: TransactionFormProps) => {
	const { t, locale } = useTranslation()
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

	const submitButtonLabel = (() => {
		if (mode === 'edit') return submitting ? t('transactions.drawer.saving') : t('transactions.drawer.save')
		return submitting ? t('transactions.drawer.creating') : t('transactions.drawer.create')
	})()

	return (
		<>
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
									placeholder={t('transactions.form.amount')}
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
								<span className={fromWalletSelected ? 'text-text' : 'text-label'}>
									{fromWalletSelected ? fromWalletLabel : t('transactions.form.from')}
								</span>
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
									<span className={toWalletSelected ? 'text-text' : 'text-label'}>
										{toWalletSelected ? toWalletLabel : t('transactions.form.to')}
									</span>
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
									<span className={categorySelected ? 'text-text' : 'text-label'}>
										{categorySelected ? categoryLabel : t('transactions.form.categoryFallback')}
									</span>
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
									placeholder={t('transactions.form.description')}
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
								placeholder={t('transactions.form.date')}
								locale={locale}
								maxDate={maxDate}
							/>
						</div>
					</div>
				</div>
			</form>

			<div className='fixed left-0 right-0 bottom-0 z-[70] border-t border-divider bg-background-muted p-3 h-[95px]'>
				<div className='mx-auto flex items-center gap-3 h-10 max-w-3xl w-full'>
					{onDelete ? (
						<>
							<button
								type='button'
								onClick={onDelete}
								disabled={deleteDisabled}
								className='flex items-center gap-3 w-1/2 rounded-lg px-4 py-2 text-sm font-medium border border-danger text-danger bg-transparent disabled:opacity-50 justify-center'
							>
								<Trash className='text-danger w-5 h-5' />
								{t('common.delete')}
							</button>

							<button
								type='submit'
								form={formId}
								className='w-1/2 rounded-lg px-4 py-2 text-sm font-medium bg-accent text-text-dark disabled:bg-background-muted disabled:text-accent disabled:opacity-50 transition-colors duration-300 ease-in-out'
								disabled={submitDisabled}
								aria-busy={submitting}
							>
								{submitButtonLabel}
							</button>
						</>
					) : (
						<div className='w-full h-10'>
							<button
								type='submit'
								form={formId}
								className='w-full h-full rounded-lg px-4 py-2 text-sm font-medium bg-accent text-text-dark disabled:bg-background-secondary disabled:text-accent disabled:opacity-50 transition-colors duration-300 ease-in-out'
								disabled={submitDisabled}
								aria-busy={submitting}
							>
								{submitButtonLabel}
							</button>
						</div>
					)}
				</div>
			</div>
		</>
	)
}

export default TransactionForm
