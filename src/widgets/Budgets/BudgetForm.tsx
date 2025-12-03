import { type ChangeEvent, type FormEvent, type KeyboardEvent } from 'react'
import { Calculator, CalendarRange, Check, DollarSign, FolderHeart, Info, ListChecks, X } from 'lucide-react'
import { useTranslation } from '@/i18n'
import { cn } from '@/lib/utils'
import { MobileDateTimePickerField } from '@/components/DateTimePicker/MobileDateTimePickerField'
import Switch from '@/components/ui/Switch'
import { BudgetPeriodType as BudgetPeriodTypeEnum, BudgetType as BudgetTypeEnum } from '@/types/entities/budget'
import type { BudgetPeriodType, BudgetType } from '@/types/entities/budget'
import type { Category } from '@/types/entities/category'
import { formatDecimalForDisplay, sanitizeDecimalInput } from '@/utils/number'

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
	onCloseBudget?: () => void
	closeBudgetDisabled?: boolean
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
	onCloseBudget,
	closeBudgetDisabled = false,
}: BudgetFormProps) => {
	const { t } = useTranslation()
	const formattedBalance = formatDecimalForDisplay(amount)
	const isCustomPeriod = periodType === BudgetPeriodTypeEnum.CUSTOM
	const isOneTime = budgetType === BudgetTypeEnum.ONE_TIME
	const selectedCategoryNames = selectedCategoryIds.map(id => categories.find(category => category.id === id)?.name ?? String(id))
	const categoriesLabel =
		selectedCategoryNames.length === 0
			? t('budgets.form.categories.empty')
			: selectedCategoryNames.slice(0, 2).join(', ') + (selectedCategoryNames.length > 2 ? ` +${selectedCategoryNames.length - 2}` : '')
	const handleCurrencyPickerKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault()
			onOpenCurrencyPicker()
		}
	}

	const handleAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
		const rawValue = event.target.value.replace(/^[+-]/, '')
		let sanitized = sanitizeDecimalInput(rawValue)
		if (sanitized.startsWith('.')) {
			sanitized = `0${sanitized}`
		}
		const digitCount = sanitized.replace(/\./g, '').length
		if (digitCount > 9) return
		onAmountChange(sanitized)
	}

	return (
		<form id={formId} className='flex flex-1 flex-col' onSubmit={onSubmit}>
			<div>
				<h2 className='p-3 text-sm'>{t('common.general')}</h2>
				<div className='overflow-hidden bg-background-muted'>
					<div className='border-t border-b border-divider'>
						<div className='flex h-16 items-center px-3'>
							<Info className='mr-3 text-label' />
							<input
								className='flex-1 bg-transparent text-text placeholder:text-label outline-none'
								placeholder={t('budgets.form.namePlaceholder')}
								value={name}
								onChange={(event: ChangeEvent<HTMLInputElement>) => onNameChange(event.target.value)}
								maxLength={100}
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
							{currencyIcon ? <img src={currencyIcon} alt='' className='mr-3 h-6 w-6' /> : <DollarSign className='mr-3 text-label' />}
							<span className='text-text'>{currencyLabel}</span>
						</div>
					</div>

					<div className='border-b border-divider'>
						<div className='flex h-16 items-center px-3'>
							<Calculator className='mr-3 text-label' />
							<input
								className='flex-1 bg-transparent text-text placeholder:text-label outline-none'
								type='text'
								inputMode='decimal'
								placeholder={t('budgets.form.amount')}
								value={formattedBalance}
								onChange={handleAmountChange}
								autoComplete='off'
							/>
						</div>
					</div>

					<div className='border-b border-divider'>
						<button type='button' className='flex h-16 w-full items-center px-3 text-left' onClick={onOpenPeriodTypePicker}>
							<CalendarRange className='mr-3 text-label' />
							<span className='text-text'>{periodTypeLabel}</span>
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
								/>
							</div>
							<div className='w-1/2'>
								<MobileDateTimePickerField
									value={periodEnd}
									onChange={onPeriodEndChange}
									placeholder={t('budgets.form.period.end')}
									precision='day'
									locale={locale}
								/>
							</div>
						</div>
					)}

					<div className='border-b border-divider flex items-center justify-between px-3 h-16'>
						<div className='flex items-center gap-3'>
							<ListChecks className='text-label' />
							<span className='text-text'>{t('budgets.form.budgetType')}</span>
						</div>
						<Switch checked={isOneTime} onChange={checked => onBudgetTypeToggle(checked ? BudgetTypeEnum.ONE_TIME : BudgetTypeEnum.RECURRING)} />
					</div>
				</div>
			</div>

			<div className='bg-background-muted border-b border-divider'>
				<button type='button' className='flex h-16 w-full items-center px-3 text-left' onClick={onOpenCategoriesPicker}>
					<FolderHeart className='mr-3 text-label' />
					<span className={cn('text-text', selectedCategoryIds.length === 0 && 'text-label')}>{categoriesLabel}</span>
				</button>
			</div>

			{error && <p className='px-3 py-2 text-sm text-danger'>{error}</p>}

			<h2 className='p-3 text-sm'>{t('common.actions')}</h2>

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

			{mode === 'edit' && onCloseBudget && (
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
		</form>
	)
}

export default BudgetForm
