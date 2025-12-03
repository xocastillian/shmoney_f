import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import Drawer from '@/components/Drawer/Drawer'
import { useTranslation } from '@/i18n'
import { useBudgets } from '@/hooks/useBudgets'
import { useCategories } from '@/hooks/useCategories'
import type { BudgetPeriodType, BudgetType, Budget } from '@/types/entities/budget'
import { BudgetPeriodType as PeriodTypeEnum, BudgetType as BudgetTypeEnum } from '@/types/entities/budget'
import { CategoryStatus } from '@/types/entities/category'
import type { Category } from '@/types/entities/category'
import { currencyOptions } from '@/widgets/Wallets/constants'
import { sanitizeDecimalInput } from '@/utils/number'
import { formatDateTimeLocal } from '@/utils/date'
import CurrencyPickerDrawer from '@/widgets/Wallets/components/CurrencyPickerDrawer'
import PeriodTypePickerDrawer from './components/PeriodTypePickerDrawer'
import BudgetForm from './BudgetForm'
import CategoriesDrawer from '@/widgets/Categories/components/CategoriesDrawer'
import { currencyIconMap } from '@/widgets/Wallets/types'
import Loader from '@/components/ui/Loader/Loader'

interface BudgetDrawerProps {
	open: boolean
	onClose: () => void
	budget?: Budget | null
}

const defaultPeriodType = PeriodTypeEnum.MONTH
const defaultBudgetType = BudgetTypeEnum.RECURRING

export const BudgetDrawer = ({ open, onClose, budget = null }: BudgetDrawerProps) => {
	const { t, locale } = useTranslation()
	const { createBudget, updateBudget, closeBudget, actionLoading } = useBudgets()
	const { categories, fetchCategories } = useCategories()
	const [initialized, setInitialized] = useState(false)
	const [name, setName] = useState('')
	const [amount, setAmount] = useState('')
	const [currencyCode, setCurrencyCode] = useState(currencyOptions[0].value)
	const [periodType, setPeriodType] = useState<BudgetPeriodType>(defaultPeriodType)
	const [budgetType, setBudgetType] = useState<BudgetType>(defaultBudgetType)
	const [periodStart, setPeriodStart] = useState('')
	const [periodEnd, setPeriodEnd] = useState('')
	const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([])
	const [currencyPickerOpen, setCurrencyPickerOpen] = useState(false)
	const [periodPickerOpen, setPeriodPickerOpen] = useState(false)
	const [categoriesPickerOpen, setCategoriesPickerOpen] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const isEditMode = Boolean(budget)
	const drawerTitle = isEditMode ? t('budgets.drawer.editTitle') : t('budgets.drawer.title')
	const handleDrawerClose = useCallback(() => {
		if (actionLoading) return
		onClose()
	}, [actionLoading, onClose])

	useEffect(() => {
		if (open && !initialized) {
			fetchCategories()
				.then(() => setInitialized(true))
				.catch(() => setInitialized(true))
		}
	}, [open, fetchCategories, initialized])

	const resetState = useCallback(() => {
		setName('')
		setAmount('')
		setCurrencyCode(currencyOptions[0].value)
		setPeriodType(defaultPeriodType)
		setBudgetType(defaultBudgetType)
		setPeriodStart('')
		setPeriodEnd('')
		setSelectedCategoryIds([])
		setError(null)
		setCategoriesPickerOpen(false)
	}, [])

	useEffect(() => {
		if (!open) {
			resetState()
		}
	}, [open, resetState])

	const handleToggleCategory = useCallback((categoryId: number) => {
		setSelectedCategoryIds(prev => (prev.includes(categoryId) ? prev.filter(id => id !== categoryId) : [...prev, categoryId]))
	}, [])

	const availableCategories = useMemo(() => categories.filter(category => category.status === CategoryStatus.ACTIVE), [categories])

	const handleSelectAllCategories = useCallback(
		(categoriesToSelect?: Category[]) => {
			const source = categoriesToSelect ?? availableCategories
			setSelectedCategoryIds(source.map(category => category.id))
		},
		[availableCategories]
	)

	useEffect(() => {
		if (!open) return
		if (budget) {
			setName(budget.name)
			setAmount(sanitizeDecimalInput(String(budget.amountLimit)))
			setCurrencyCode(budget.currencyCode)
			setPeriodType(budget.periodType)
			setBudgetType(budget.budgetType)
			setPeriodStart(budget.periodType === PeriodTypeEnum.CUSTOM && budget.periodStart ? formatDateTimeLocal(budget.periodStart) : '')
			setPeriodEnd(budget.periodType === PeriodTypeEnum.CUSTOM && budget.periodEnd ? formatDateTimeLocal(budget.periodEnd) : '')
			setSelectedCategoryIds(budget.categoryIds)
			setError(null)
		} else {
			resetState()
		}
	}, [budget, open, resetState])

	const handleBudgetTypeToggle = (nextType: BudgetType) => {
		setBudgetType(nextType)
		if (nextType === BudgetTypeEnum.RECURRING && periodType === PeriodTypeEnum.CUSTOM) {
			setPeriodType(defaultPeriodType)
			setPeriodStart('')
			setPeriodEnd('')
		}
	}

	const submitDisabled = useMemo(() => {
		const hasName = name.trim().length > 0
		const normalizedAmount = sanitizeDecimalInput(amount)
		const amountNumber = normalizedAmount.length > 0 ? Number.parseFloat(normalizedAmount) : NaN
		const amountValid = !Number.isNaN(amountNumber) && amountNumber > 0
		const hasCategories = selectedCategoryIds.length > 0
		const requiresPeriod = periodType == PeriodTypeEnum.CUSTOM
		const periodValid = !requiresPeriod || (periodStart && periodEnd)
		return actionLoading || !hasName || !amountValid || !hasCategories || !periodValid
	}, [name, amount, selectedCategoryIds, periodType, periodStart, periodEnd, actionLoading])

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const trimmedName = name.trim()
		const normalizedAmount = sanitizeDecimalInput(amount)
		const amountNumber = normalizedAmount.length > 0 ? Number.parseFloat(normalizedAmount) : NaN

		if (!trimmedName) {
			setError(t('budgets.form.errors.name'))
			return
		}
		if (Number.isNaN(amountNumber) || amountNumber <= 0) {
			setError(t('budgets.form.errors.amount'))
			return
		}
		if (selectedCategoryIds.length === 0) {
			setError(t('budgets.form.errors.categories'))
			return
		}
		if (periodType == PeriodTypeEnum.CUSTOM && (!periodStart || !periodEnd)) {
			setError(t('budgets.form.errors.period'))
			return
		}

		try {
			if (isEditMode && budget) {
				await updateBudget(budget.id, {
					name: trimmedName,
					periodType,
					periodStart: periodType == PeriodTypeEnum.CUSTOM && periodStart ? new Date(periodStart) : undefined,
					periodEnd: periodType == PeriodTypeEnum.CUSTOM && periodEnd ? new Date(periodEnd) : undefined,
					budgetType,
					categoryIds: selectedCategoryIds,
					currencyCode,
					amountLimit: amountNumber,
				})
			} else {
				await createBudget({
					name: trimmedName,
					periodType,
					periodStart: periodType == PeriodTypeEnum.CUSTOM && periodStart ? new Date(periodStart) : undefined,
					periodEnd: periodType == PeriodTypeEnum.CUSTOM && periodEnd ? new Date(periodEnd) : undefined,
					budgetType,
					categoryIds: selectedCategoryIds,
					currencyCode,
					amountLimit: amountNumber,
				})
			}
			setError(null)
			onClose()
		} catch (err) {
			const message = err instanceof Error ? err.message : t('wallets.errors.saveFailed')
			setError(message)
		}
	}

	const handleCloseBudget = useCallback(async () => {
		if (!budget) return
		try {
			await closeBudget(budget.id)
			setError(null)
			onClose()
		} catch (err) {
			const message = err instanceof Error ? err.message : t('budgets.form.errors.close')
			setError(message)
		}
	}, [budget, closeBudget, onClose, t])

	const periodTypeLabel = t(
		{
			[PeriodTypeEnum.CUSTOM]: 'budgets.period.custom',
			[PeriodTypeEnum.WEEK]: 'budgets.period.week',
			[PeriodTypeEnum.MONTH]: 'budgets.period.month',
			[PeriodTypeEnum.YEAR]: 'budgets.period.year',
		}[periodType]
	)
	const currencyOption = currencyOptions.find(option => option.value === currencyCode)
	const currencyLabel = currencyOption ? t(currencyOption.label) : currencyCode
	const currencyIcon = currencyIconMap[currencyCode] ?? null

	return (
		<>
			<Drawer open={open} onClose={handleDrawerClose} className='rounded-t-lg bg-background-secondary' swipeable={false}>
				<div className='flex h-full flex-col'>
					<div className='flex items-center justify-between border-b border-divider p-3'>
						<h1 className='text-lg font-medium'>{drawerTitle}</h1>
						<button type='button' onClick={handleDrawerClose} className='p-2' aria-label='Close'>
							<X />
						</button>
					</div>

					<div className='flex-1 overflow-y-auto pb-10'>
						<BudgetForm
							formId='budget-form'
							name={name}
							onNameChange={setName}
							amount={amount}
							onAmountChange={setAmount}
							currencyLabel={currencyLabel}
							currencyIcon={currencyIcon}
							onOpenCurrencyPicker={() => setCurrencyPickerOpen(true)}
							periodTypeLabel={periodTypeLabel}
							onOpenPeriodTypePicker={() => setPeriodPickerOpen(true)}
							periodType={periodType}
							budgetType={budgetType}
							onBudgetTypeToggle={handleBudgetTypeToggle}
							periodStart={periodStart}
							onPeriodStartChange={setPeriodStart}
							periodEnd={periodEnd}
							onPeriodEndChange={setPeriodEnd}
							categories={availableCategories}
							selectedCategoryIds={selectedCategoryIds}
							onOpenCategoriesPicker={() => setCategoriesPickerOpen(true)}
							onSubmit={handleSubmit}
							submitDisabled={submitDisabled}
							locale={locale}
							error={error}
							mode={isEditMode ? 'edit' : 'create'}
							onCloseBudget={isEditMode ? handleCloseBudget : undefined}
							closeBudgetDisabled={actionLoading}
						/>
					</div>

					{actionLoading && (
						<div className='fixed inset-0 z-30 bg-black/80 backdrop-blur-sm'>
							<div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
								<Loader />
							</div>
						</div>
					)}
				</div>
			</Drawer>

			<CurrencyPickerDrawer
				open={currencyPickerOpen}
				onClose={() => setCurrencyPickerOpen(false)}
				options={currencyOptions}
				selectedCode={currencyCode}
				onSelect={code => {
					setCurrencyCode(code)
					setCurrencyPickerOpen(false)
				}}
			/>

			<PeriodTypePickerDrawer
				open={periodPickerOpen}
				onClose={() => setPeriodPickerOpen(false)}
				selectedType={periodType}
				onSelect={type => {
					setPeriodType(type)
					if (type != PeriodTypeEnum.CUSTOM) {
						setPeriodStart('')
						setPeriodEnd('')
					}
					setPeriodPickerOpen(false)
				}}
				allowCustom={budgetType === BudgetTypeEnum.ONE_TIME}
			/>

			<CategoriesDrawer
				open={categoriesPickerOpen}
				onClose={() => setCategoriesPickerOpen(false)}
				showAddButton={false}
				selectable
				multiSelect
				selectedCategoryIds={selectedCategoryIds}
				onToggleCategory={category => handleToggleCategory(category.id)}
				showArchived={false}
				allOptionLabel={t('budgets.form.categories.all')}
				onSelectAll={handleSelectAllCategories}
			/>
		</>
	)
}

export default BudgetDrawer
