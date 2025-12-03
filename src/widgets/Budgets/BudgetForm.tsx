import { type ChangeEvent, type FormEvent, type KeyboardEvent } from 'react'
import { Calculator, CalendarRange, Check, DollarSign, FolderHeart, Info, ListChecks, RefreshCcw, Trash2, X } from 'lucide-react'
import { useTranslation } from '@/i18n'
import { cn } from '@/lib/utils'
import { MobileDateTimePickerField } from '@/components/DateTimePicker/MobileDateTimePickerField'
import Switch from '@/components/ui/Switch'
import { BudgetPeriodType as BudgetPeriodTypeEnum, BudgetType as BudgetTypeEnum } from '@/types/entities/budget'
import type { BudgetPeriodType, BudgetType } from '@/types/entities/budget'
import type { Category } from '@/types/entities/category'
import { formatDecimalForDisplay, sanitizeDecimalInput } from '@/utils/number'
import { formatDateTimeLocal } from '@/utils/date'

interface BudgetFormProps {
	formId: string
	name: string
	onNameChange: (value: string) => void
	amount: string
	onAmountChange: (value: string) => void
	currencyLabel: string
	currencyIcon?: string | null
	onOpenCurrencyPicker: () => void
	periodTypeLabel: string
	onOpenPeriodTypePicker: () => void
	periodType: BudgetPeriodType
	budgetType: BudgetType
	onBudgetTypeToggle: (type: BudgetType) => void
	periodStart: string
	onPeriodStartChange: (value: string) => void
	periodEnd: string
	onPeriodEndChange: (value: string) => void
	categories: Category[]
	selectedCategoryIds: number[]
	onOpenCategoriesPicker: () => void
	onSubmit: (event: FormEvent<HTMLFormElement>) => void
	submitDisabled?: boolean
	locale?: string
	error?: string | null
	mode?: 'create' | 'edit'
	isClosed?: boolean
	onCloseBudget?: () => void
	closeBudgetDisabled?: boolean
	onDeleteBudget?: () => void
	deleteBudgetDisabled?: boolean
	onOpenBudget?: () => void
	openBudgetDisabled?: boolean
}

const BudgetForm = ({
	formId,
	name,
	onNameChange,
	amount,
	onAmountChange,
	currencyLabel,
	currencyIcon,
	onOpenCurrencyPicker,
	periodTypeLabel,
	onOpenPeriodTypePicker,
	periodType,
	budgetType,
	onBudgetTypeToggle,
	periodStart,
	onPeriodStartChange,
	periodEnd,
	onPeriodEndChange,
	categories,
	selectedCategoryIds,
	onOpenCategoriesPicker,
	onSubmit,
	submitDisabled = false,
	locale,
	error,
	mode = 'create',
	isClosed = false,
	onCloseBudget,
	closeBudgetDisabled = false,
	onDeleteBudget,
	deleteBudgetDisabled = false,
	onOpenBudget,
	openBudgetDisabled = false,
}: BudgetFormProps) => {
	const { t } = useTranslation()
	const formattedBalance = formatDecimalForDisplay(amount)
	const isCustomPeriod = periodType === BudgetPeriodTypeEnum.CUSTOM
	const isOneTime = budgetType === BudgetTypeEnum.ONE_TIME
	const isReadOnly = mode === 'edit' && isClosed
	const selectedCategoryNames = selectedCategoryIds.map(id => categories.find(category => category.id === id)?.name ?? String(id))
	const categoriesLabel =
		selectedCategoryNames.length === 0
			? t('budgets.form.categories.empty')
			: selectedCategoryNames.slice(0, 2).join(', ') + (selectedCategoryNames.length > 2 ? ` +${selectedCategoryNames.length - 2}` : '')
	const handleCurrencyPickerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault()
			if (!isReadOnly) {
				onOpenCurrencyPicker()
			}
		}
	}

	const handleAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
		const rawValue = event.target.value.replace(/^[+-]/, '')
		let sanitized = sanitizeDecimalInput(rawValue)
		if (sanitized.startsWith('.')) {
			sanitized = `0${sanitized}`
		}
		const digitCount = sanitized.replace(/\./g, '').length
		if (digitCount > 9 || isReadOnly) return
		onAmountChange(sanitized)
	}

	return (
		<form id={formId} className='flex flex-1 flex-col' onSubmit={onSubmit}>
			<div>
				<h2 className='p-3 text-sm'>{t('common.general')}</h2>
				<div className='overflow-hidden bg-background-muted'>
					<div className='border-t border-b border-divider'>
						<div className='flex h-16 items-center px-3'>
							<Info className={cn('mr-3 text-label', isReadOnly && 'text-disable')} />
							<input
								className={cn('flex-1 bg-transparent text-text placeholder:text-label outline-none disabled:cursor-not-allowed', isReadOnly && 'text-disable placeholder:text-disable')}
								placeholder={t('budgets.form.namePlaceholder')}
								value={name}
								onChange={(event: ChangeEvent<HTMLInputElement>) => onNameChange(event.target.value)}
								maxLength={100}
								disabled={isReadOnly}
							/>
						</div>
					</div>

					<div className='border-b border-divider'>
						<button
							type='button'
							className={cn('flex h-16 w-full items-center px-3 text-left disabled:cursor-not-allowed', isReadOnly && 'text-disable')}
							onClick={onOpenCurrencyPicker}
							onKeyDown={handleCurrencyPickerKeyDown}
							disabled={isReadOnly}
						>
							{currencyIcon ? <img src={currencyIcon} alt='' className={cn('mr-3 h-6 w-6', isReadOnly && 'text-disable')} /> : <DollarSign className={cn('mr-3 text-label', isReadOnly && 'text-disable')} />}
							<span className={cn('text-text', isReadOnly && 'text-disable')}>{currencyLabel}</span>
						</button>
					</div>

					<div className='border-b border-divider'>
						<div className='flex h-16 items-center px-3'>
							<Calculator className={cn('mr-3 text-label', isReadOnly && 'text-disable')} />
							<input
								className={cn('flex-1 bg-transparent text-text placeholder:text-label outline-none', isReadOnly && 'text-disable placeholder:text-disable')}
								type='text'
								inputMode='decimal'
								placeholder={t('budgets.form.amount')}
								value={formattedBalance}
								onChange={handleAmountChange}
								autoComplete='off'
								disabled={isReadOnly}
							/>
						</div>
					</div>

					<div className='border-b border-divider flex items-center justify-between px-3 h-16'>
						<div className='flex items-center gap-3'>
							<ListChecks className={cn('text-label', isReadOnly && 'text-disable')} />
							<span className={cn('text-text', isReadOnly && 'text-disable')}>{t('budgets.form.budgetType')}</span>
						</div>
						<Switch
							checked={isOneTime}
							onChange={checked => onBudgetTypeToggle(checked ? BudgetTypeEnum.ONE_TIME : BudgetTypeEnum.RECURRING)}
							disabled={isReadOnly}
						/>
					</div>

					<div className='border-b border-divider'>
						<button
							type='button'
							className={cn('flex h-16 w-full items-center px-3 text-left disabled:cursor-not-allowed', isReadOnly && 'text-disable')}
							onClick={onOpenPeriodTypePicker}
							disabled={isReadOnly}
						>
							<CalendarRange className={cn('mr-3 text-label', isReadOnly && 'text-disable')} />
							<span className={cn('text-text', isReadOnly && 'text-disable')}>{periodTypeLabel}</span>
						</button>
					</div>

					{isCustomPeriod && (
						<div className='border-b border-divider bg-background-muted flex'>
							<div className='w-1/2'>
								<MobileDateTimePickerField
									value={periodStart}
									onChange={onPeriodStartChange}
									placeholder={t('budgets.form.period.start')}
									precision='day'
									locale={locale}
									clearable
									onClear={() => onPeriodStartChange(formatDateTimeLocal(new Date()))}
									disabled={isReadOnly}
								/>
							</div>
							<div className='w-1/2'>
								<MobileDateTimePickerField
									value={periodEnd}
									onChange={onPeriodEndChange}
									placeholder={t('budgets.form.period.end')}
									precision='day'
									locale={locale}
									clearable
									onClear={() => onPeriodEndChange(formatDateTimeLocal(new Date()))}
									disabled={isReadOnly}
								/>
							</div>
						</div>
					)}
				</div>
			</div>

			<div className='bg-background-muted border-b border-divider'>
				<button
					type='button'
					className={cn('flex h-16 w-full items-center px-3 text-left disabled:cursor-not-allowed', isReadOnly && 'text-disable')}
					onClick={onOpenCategoriesPicker}
					disabled={isReadOnly}
				>
					<FolderHeart className={cn('mr-3 text-label', isReadOnly && 'text-disable')} />
					<span className={cn('text-text', selectedCategoryIds.length === 0 && 'text-label', isReadOnly && 'text-disable')}>{categoriesLabel}</span>
				</button>
			</div>

			{error && <p className='px-3 py-2 text-sm text-danger'>{error}</p>}

			<h2 className='p-3 text-sm'>{t('common.actions')}</h2>

			{!isReadOnly && (
				<div className='border-t border-b border-divider bg-background-muted'>
					<button
						type='submit'
						className={cn('flex h-16 w-full items-center px-3 text-access disabled:text-label transition-colors')}
						disabled={submitDisabled}
					>
						<Check className={cn('mr-3 transition-colors', submitDisabled ? 'text-label' : 'text-access')} />
						<span>{t('budgets.form.submit')}</span>
					</button>
				</div>
			)}

			{mode === 'edit' && isClosed && onOpenBudget && (
				<div className='border-b border-divider bg-background-muted'>
					<button
						type='button'
						onClick={onOpenBudget}
						className='flex h-16 w-full items-center px-3 text-left disabled:opacity-60'
						disabled={openBudgetDisabled}
					>
						<RefreshCcw className={cn('mr-3', openBudgetDisabled ? 'text-label' : 'text-accent')} />
						<span className={openBudgetDisabled ? 'text-label' : 'text-accent'}>{t('budgets.form.openBudget')}</span>
					</button>
				</div>
			)}

			{mode === 'edit' && !isClosed && onCloseBudget && (
				<div className='border-b border-divider bg-background-muted'>
					<button
						type='button'
						onClick={onCloseBudget}
						className='flex h-16 w-full items-center px-3 text-left disabled:opacity-60'
						disabled={closeBudgetDisabled}
					>
						<X className={cn('mr-3', closeBudgetDisabled ? 'text-label' : 'text-danger')} />
						<span className={closeBudgetDisabled ? 'text-label' : 'text-danger'}>{t('budgets.form.closeBudget')}</span>
					</button>
				</div>
			)}

			{mode === 'edit' && onDeleteBudget && (
				<div className='border-b border-divider bg-background-muted'>
					<button
						type='button'
						onClick={onDeleteBudget}
						className='flex h-16 w-full items-center px-3 text-left disabled:opacity-60'
						disabled={deleteBudgetDisabled}
					>
						<Trash2 className={cn('mr-3', deleteBudgetDisabled ? 'text-label' : 'text-danger')} />
						<span className={deleteBudgetDisabled ? 'text-label' : 'text-danger'}>{t('budgets.form.deleteBudget')}</span>
					</button>
				</div>
			)}
		</form>
	)
}

export default BudgetForm
