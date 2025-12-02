import { useEffect, useMemo, useState } from 'react'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useCategories } from '@/hooks/useCategories'
import type { Category } from '@/types/entities/category'
import { CategoryStatus } from '@/types/entities/category'
import { useTranslation } from '@/i18n'
import Drawer from '@/components/Drawer/Drawer'

interface CategoriesDrawerProps {
	open: boolean
	onClose: () => void
	onSelect?: (category: Category) => void
	onAdd?: () => void
	showAddButton?: boolean
	className?: string
	selectable?: boolean
	allOptionLabel?: string
	onSelectAll?: (categories?: Category[]) => void
	selectedCategoryId?: number | null
	showArchived?: boolean
	multiSelect?: boolean
	selectedCategoryIds?: number[]
	onToggleCategory?: (category: Category) => void
}

const CloseIcon = LucideIcons.X
const lucideIconMap = LucideIcons as unknown as Record<string, LucideIcon | undefined>

const CategoriesDrawer = ({
	open,
	onClose,
	onSelect,
	onAdd,
	showAddButton = true,
	className,
	selectable = false,
	allOptionLabel,
	onSelectAll,
	selectedCategoryId = null,
	showArchived = true,
	multiSelect = false,
	selectedCategoryIds = [],
	onToggleCategory,
}: CategoriesDrawerProps) => {
	const { categories, loading, fetchCategories } = useCategories()
	const [initialized, setInitialized] = useState(false)
	const { t } = useTranslation()

	useEffect(() => {
		if (!open || initialized || loading) return

		fetchCategories()
			.then(() => setInitialized(true))
			.catch(() => setInitialized(true))
	}, [fetchCategories, initialized, loading, open])

	const activeCategories = useMemo(() => categories.filter(category => category.status === CategoryStatus.ACTIVE), [categories])
	const archivedCategories = useMemo(
		() => (showArchived ? categories.filter(category => category.status === CategoryStatus.ARCHIVED) : []),
		[categories, showArchived]
	)
	const visibleCategories = useMemo(() => [...activeCategories, ...archivedCategories], [activeCategories, archivedCategories])
	const hasActiveCategories = activeCategories.length > 0
	const hasArchivedCategories = archivedCategories.length > 0
	const showAllButton = (selectable || multiSelect) && Boolean(allOptionLabel)
	const allSelected = multiSelect
		? visibleCategories.length > 0 && visibleCategories.every(category => selectedCategoryIds.includes(category.id))
		: selectable && selectedCategoryId == null

	const renderCategoryRow = (category: Category) => {
		const IconComponent = category.icon ? lucideIconMap[category.icon] : undefined
		const initials = category.name.slice(0, 2).toUpperCase()
		const isSelected = multiSelect ? selectedCategoryIds.includes(category.id) : selectable && selectedCategoryId === category.id
		const showSelectionIcon = multiSelect ? isSelected : selectable && isSelected

		const handleClick = () => {
			if (multiSelect && onToggleCategory) {
				onToggleCategory(category)
				return
			}
			onSelect?.(category)
		}

		return (
			<button
				key={category.id}
				type='button'
				onClick={handleClick}
				className='w-full border-b border-divider text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent'
			>
				<div className='flex h-16 items-center px-3'>
					<div className='mr-3'>
						{IconComponent ? (
							<IconComponent className='h-6 w-6' color={category.color || '#f89a04'} />
						) : (
							<span className='text-lg font-semibold' style={{ color: category.color }}>
								{initials}
							</span>
						)}
					</div>
					<span className='text-text'>{category.name}</span>
					{showSelectionIcon && (
						<div className='ml-auto flex items-center gap-2'>{showSelectionIcon && <LucideIcons.Check className='text-accent' size={16} />}</div>
					)}
				</div>
			</button>
		)
	}

	return (
		<Drawer open={open} onClose={onClose} className={`h-[100vh] rounded-t-lg bg-background-secondary ${className}`} swipeable={false}>
			<div className='flex h-full flex-col'>
				<div className='flex justify-between p-3 items-center border-b border-divider'>
					<h1 className='text-lg font-medium'>{t('categories.drawer.title')}</h1>
					<button type='button' onClick={onClose} className='p-2' aria-label='Закрыть'>
						<CloseIcon />
					</button>
				</div>

				<div className='flex-1 overflow-y-auto pb-3'>
					<div className='overflow-hidden'>
						{showAllButton && (
							<div className=''>
								<h2 className='mb-3 px-3 pt-3 text-sm font-medium text-label'>{t('common.general')}</h2>

								<button
									type='button'
									onClick={() => {
										if (multiSelect) {
											onSelectAll?.(visibleCategories)
										} else {
											onSelectAll?.()
										}
									}}
									className='w-full bg-background-muted border-b border-t border-divider text-left'
								>
									<div className='flex h-16 items-center px-3'>
										<LucideIcons.FolderHeart className='mr-3 text-label' />
										<span className='text-text'>{allOptionLabel}</span>
										{allSelected && <LucideIcons.Check className='ml-auto text-accent' size={16} />}
									</div>
								</button>
							</div>
						)}

						{hasActiveCategories && (
							<div>
								<h2 className='p-3 text-sm'>{t('categories.drawer.active')}</h2>
								<div className='border-t border-divider bg-background-muted'>{activeCategories.map(category => renderCategoryRow(category))}</div>
							</div>
						)}

						{hasArchivedCategories && (
							<div>
								<h2 className='p-3 text-sm'>{t('categories.drawer.archived')}</h2>
								<div className='border-t border-divider bg-background-muted'>{archivedCategories.map(category => renderCategoryRow(category))}</div>
							</div>
						)}
					</div>

					{showAddButton && (
						<div>
							<h2 className='p-3 text-sm'>{t('common.actions')}</h2>

							<div className='border-b border-t border-divider bg-background-muted'>
								<button type='button' onClick={() => onAdd?.()} className='flex h-16 items-center px-3 w-full'>
									<LucideIcons.Plus className='mr-3 text-access' />
									<span className='text-access'>{t('categories.drawer.add')}</span>
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</Drawer>
	)
}

export default CategoriesDrawer
