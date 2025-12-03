import { useCallback, useEffect, useMemo, useState } from 'react'
import { useBudgets } from '@/hooks/useBudgets'
import { useTelegramAuth } from '@/hooks/useTelegramAuth'
import { useTranslation } from '@/i18n'
import { BudgetPeriodType, BudgetStatus } from '@/types/entities/budget'
import type { Budget } from '@/types/entities/budget'
import { BudgetCard } from '@/components/Budget/Budget'
import BudgetDrawer from '@/widgets/Budgets/BudgetDrawer'
import BudgetMonthSwitcher from '@/widgets/Budgets/components/BudgetMonthSwitcher'
import BudgetStatusTabs from '@/screens/Budgets/components/BudgetStatusTabs'
import { Plus } from 'lucide-react'
import Button from '@/components/ui/Button/Button'

const PERIOD_SECTIONS: Array<{ type: BudgetPeriodType; labelKey: string }> = [
	{ type: BudgetPeriodType.CUSTOM, labelKey: 'budgets.period.custom' },
	{ type: BudgetPeriodType.WEEK, labelKey: 'budgets.period.week' },
	{ type: BudgetPeriodType.MONTH, labelKey: 'budgets.period.month' },
	{ type: BudgetPeriodType.YEAR, labelKey: 'budgets.period.year' },
]

const localeMap: Record<string, string> = {
	ru: 'ru-RU',
	en: 'en-US',
}

const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1)
const endOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999)
const isSameMonth = (left: Date, right: Date) => left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth()

const BudgetsScreen = () => {
	const { status } = useTelegramAuth({ auto: true })
	const authenticated = useMemo(() => status === 'authenticated', [status])
	const { budgets, loading, fetchBudgets, clearBudgets } = useBudgets()
	const { t, locale } = useTranslation()
	const resolvedLocale = localeMap[locale] ?? localeMap.ru
	const [drawerOpen, setDrawerOpen] = useState(false)
	const [editingBudget, setEditingBudget] = useState<Budget | null>(null)
	const [selectedMonth, setSelectedMonth] = useState(() => startOfMonth(new Date()))
	const [statusFilter, setStatusFilter] = useState<BudgetStatus>(BudgetStatus.ACTIVE)

	const dateFormatter = useMemo(() => new Intl.DateTimeFormat(resolvedLocale, { day: '2-digit', month: 'short' }), [resolvedLocale])
	const dateWithYearFormatter = useMemo(
		() => new Intl.DateTimeFormat(resolvedLocale, { day: '2-digit', month: 'short', year: 'numeric' }),
		[resolvedLocale]
	)

	const formatCurrency = useCallback(
		(value: number, currencyCode: string) => {
			try {
				return new Intl.NumberFormat(resolvedLocale, {
					style: 'currency',
					currency: currencyCode,
					maximumFractionDigits: 2,
				}).format(value)
			} catch {
				return `${value.toFixed(2)} ${currencyCode}`
			}
		},
		[resolvedLocale]
	)

	const formatRange = useCallback(
		(start: Date, end: Date) => {
			const sameYear = start.getFullYear() === end.getFullYear()
			const startLabel = (sameYear ? dateFormatter : dateWithYearFormatter).format(start)
			const endLabel = dateWithYearFormatter.format(end)
			return `${startLabel} — ${endLabel}`
		},
		[dateFormatter, dateWithYearFormatter]
	)

	const isCurrentMonth = isSameMonth(selectedMonth, new Date())

	useEffect(() => {
		if (!authenticated) {
			clearBudgets()
			return
		}

		const from = startOfMonth(selectedMonth)
		const to = endOfMonth(selectedMonth)
		const params = {
			from: from.toISOString(),
			to: to.toISOString(),
			...(isCurrentMonth ? { status: statusFilter } : {}),
		}

		void fetchBudgets(params).catch(() => undefined)
	}, [authenticated, clearBudgets, fetchBudgets, isCurrentMonth, selectedMonth, statusFilter])

	const visibleBudgets = useMemo(() => {
		if (isCurrentMonth) {
			return budgets.filter(budget => budget.status === statusFilter)
		}
		return budgets
	}, [budgets, isCurrentMonth, statusFilter])

	const sections = useMemo(() => {
		return PERIOD_SECTIONS.map(section => ({
			...section,
			items: visibleBudgets.filter(budget => budget.periodType === section.type).sort((a, b) => a.periodStart.getTime() - b.periodStart.getTime()),
		})).filter(section => section.items.length > 0)
	}, [visibleBudgets])

	const handleOpenCreate = () => {
		setEditingBudget(null)
		setDrawerOpen(true)
	}

	const handleBudgetCardClick = (budget: Budget) => {
		if (!isCurrentMonth) return
		setEditingBudget(budget)
		setDrawerOpen(true)
	}

	const listOverlayClass = isCurrentMonth ? '' : 'opacity-60'

	return (
		<>
			<header className='sticky top-0 z-20 bg-background'>
				<div className='flex items-center justify-between p-3'>
					<h1 className='text-lg font-medium'>{t('budgets.title')}</h1>
					<button className='p-2' onClick={handleOpenCreate}>
						<Plus className='h-6 w-6' />
					</button>
				</div>
				<BudgetMonthSwitcher currentMonth={selectedMonth} locale={resolvedLocale} onChange={setSelectedMonth} />
				{isCurrentMonth && (
					<div className='pt-3 px-3'>
						<BudgetStatusTabs value={statusFilter} onChange={setStatusFilter} className='rounded-xl' />
					</div>
				)}
			</header>

			<div className={`overflow-auto pb-28 transition-opacity ${listOverlayClass}`}>
				{loading ? (
					<BudgetsSkeleton />
				) : (
					<div className='mt-3 px-3 overflow-hidden space-y-4'>
						{sections.map(section => (
							<section key={section.type} className='bg-background-muted rounded-xl py-3'>
								<div className='mb-3 flex items-center justify-between gap-2 px-3'>
									<h2 className='text-base border-b border-divider pb-3 w-full'>{t(section.labelKey)}</h2>
								</div>
								<div className='space-y-3'>
									{section.items.map(budget => (
										<BudgetCard
											key={budget.id}
											budget={budget}
											formatCurrency={formatCurrency}
											formatRange={formatRange}
											t={t}
											onClick={isCurrentMonth ? () => handleBudgetCardClick(budget) : undefined}
										/>
									))}

									<div className='mt-3 px-3 ml-auto w-fit'>
										<Button text={t('common.showMore')} onClick={() => {}} />
									</div>
								</div>
							</section>
						))}
					</div>
				)}
			</div>

			<BudgetDrawer
				open={drawerOpen}
				budget={editingBudget}
				onClose={() => {
					setDrawerOpen(false)
					setEditingBudget(null)
				}}
			/>
		</>
	)
}

const BudgetsSkeleton = () => (
	<div className='space-y-3 p-3'>
		{Array.from({ length: 3 }).map((_, index) => (
			<div key={`budget-skeleton-${index}`} className='animate-pulse rounded-2xl bg-background-muted p-4'>
				<div className='h-4 w-2/3 rounded bg-background-muted-2/60' />
				<div className='mt-4 h-2 rounded-full bg-background-muted-2/60' />
			</div>
		))}
	</div>
)

export default BudgetsScreen
