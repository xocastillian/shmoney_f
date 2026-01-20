import { useEffect, useMemo, useRef } from 'react'
import * as LucideIcons from 'lucide-react'
import { useTranslation } from '@/i18n'
import Drawer from '@/components/Drawer/Drawer'
import useDebts from '@/hooks/useDebts'
import type { DebtCounterparty } from '@/types/entities/debt'
import { DebtCounterpartyStatus } from '@/types/entities/debt'

interface DebtCounterpartiesDrawerProps {
	open: boolean
	onClose: () => void
	onSelect?: (counterparty: DebtCounterparty) => void
	onAdd?: () => void
	showAddButton?: boolean
	className?: string
	selectable?: boolean
	selectedCounterpartyId?: number | null
	multiSelect?: boolean
	selectedCounterpartyIds?: number[]
	onToggleCounterparty?: (counterparty: DebtCounterparty) => void
	showArchived?: boolean
}

const CloseIcon = LucideIcons.X

const DebtCounterpartiesDrawer = ({
	open,
	onClose,
	onSelect,
	onAdd,
	showAddButton = true,
	className,
	selectable = false,
	selectedCounterpartyId = null,
	multiSelect = false,
	selectedCounterpartyIds = [],
	onToggleCounterparty,
	showArchived = true,
}: DebtCounterpartiesDrawerProps) => {
	const { counterparties, fetchCounterparties } = useDebts()
	const wasOpenRef = useRef(false)
	const { t } = useTranslation()

	useEffect(() => {
		if (!open) {
			wasOpenRef.current = false
			return
		}
		if (wasOpenRef.current) return
		wasOpenRef.current = true
		fetchCounterparties().catch(() => undefined)
	}, [fetchCounterparties, open])

	const activeCounterparties = useMemo(
		() => counterparties.filter(counterparty => counterparty.status === DebtCounterpartyStatus.ACTIVE),
		[counterparties],
	)
	const archivedCounterparties = useMemo(
		() => (showArchived ? counterparties.filter(counterparty => counterparty.status === DebtCounterpartyStatus.ARCHIVED) : []),
		[counterparties, showArchived],
	)
	const hasActiveCounterparties = activeCounterparties.length > 0
	const hasArchivedCounterparties = archivedCounterparties.length > 0

	const renderCounterpartyRow = (counterparty: DebtCounterparty) => {
		const isSelected = multiSelect ? selectedCounterpartyIds.includes(counterparty.id) : selectable && selectedCounterpartyId === counterparty.id
		const CounterpartyIcon = LucideIcons.UserRound

		return (
			<button
				key={counterparty.id}
				type='button'
				onClick={() => {
					if (multiSelect && onToggleCounterparty) {
						onToggleCounterparty(counterparty)
					} else {
						onSelect?.(counterparty)
					}
				}}
				className='w-full border-b border-divider text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent'
			>
				<div className='flex h-16 items-center px-3'>
					<CounterpartyIcon className='mr-3 h-6 w-6' color={counterparty.color || '#f89a04'} />
					<span className='text-text'>{counterparty.name}</span>
					{isSelected && (
						<div className='ml-auto flex items-center gap-2'>
							<LucideIcons.Check className='text-accent' size={16} />
						</div>
					)}
				</div>
			</button>
		)
	}

	return (
		<Drawer open={open} onClose={onClose} className={`rounded-t-lg bg-background-secondary ${className}`} swipeable={false}>
			<div className='flex h-full flex-col'>
				<div className='flex justify-between p-3 items-center border-b border-divider'>
					<h1 className='text-lg font-medium'>{t('debts.drawer.title')}</h1>
					<button type='button' onClick={onClose} className='p-2' aria-label={t('debts.drawer.close')}>
						<CloseIcon />
					</button>
				</div>

				<div className='flex-1 overflow-y-auto pb-10'>
					<div className='overflow-hidden'>
						{hasActiveCounterparties && (
							<div>
								<h2 className='p-3 text-sm'>{t('debts.drawer.active')}</h2>
								<div className='border-t border-divider bg-background-muted'>{activeCounterparties.map(renderCounterpartyRow)}</div>
							</div>
						)}

						{hasArchivedCounterparties && (
							<div>
								<h2 className='p-3 text-sm'>{t('debts.drawer.archived')}</h2>
								<div className='border-t border-divider bg-background-muted'>{archivedCounterparties.map(renderCounterpartyRow)}</div>
							</div>
						)}
					</div>

					{showAddButton && (
						<div>
							<h2 className='p-3 text-sm'>{t('common.actions')}</h2>

							<div className='border-b border-t border-divider bg-background-muted'>
								<button type='button' onClick={() => onAdd?.()} className='flex h-16 items-center px-3 w-full'>
									<LucideIcons.Plus className='mr-3 text-access' />
									<span className='text-access'>{t('debts.drawer.add')}</span>
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</Drawer>
	)
}

export default DebtCounterpartiesDrawer
