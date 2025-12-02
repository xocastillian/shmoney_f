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
	onSelectAll?: () => void
	selectedCategoryId?: number | null
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

	const visibleCategories = useMemo(() => {
		if (!selectable) {
			return categories
		}
		return categories.filter(category => category.status === CategoryStatus.ACTIVE)
	}, [categories, selectable])

	const hasCategories = visibleCategories.length > 0

	return (
		<Drawer open={open} onClose={onClose} className={`h-[100vh] rounded-t-lg bg-background-secondary ${className}`} swipeable={false}>
			<div className='flex h-full flex-col'>
				<div className='flex justify-between p-3 items-center'>
					<h1 className='text-lg font-medium'>{t('categories.drawer.title')}</h1>
					<button type='button' onClick={onClose} className='p-2' aria-label='Закрыть'>
						<CloseIcon />
					</button>
				</div>

				<div className='flex-1 overflow-y-auto pb-10'>
					{hasCategories && (
						<>
							<div className='overflow-hidden bg-background-muted'>
								{selectable && allOptionLabel && (
									<button
										type='button'
										onClick={() => onSelectAll?.()}
										className='w-full border-b border-divider text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent'
									>
										<div className='flex h-16 items-center px-3'>
											<LucideIcons.FolderHeart className='mr-3 text-label' />
											<span className='text-text'>{allOptionLabel}</span>
											{selectable && selectedCategoryId == null && <LucideIcons.Check className='ml-auto text-accent' size={16} />}
										</div>
									</button>
								)}
								{visibleCategories.map(category => {
									const IconComponent = category.icon ? lucideIconMap[category.icon] : undefined
									const initials = category.name.slice(0, 2).toUpperCase()
									const isSelected = selectable && selectedCategoryId === category.id
									const showArchiveIcon = !selectable && category.status === CategoryStatus.ARCHIVED
									const showSelectionIcon = selectable && isSelected

									return (
										<button
											key={category.id}
											type='button'
											onClick={() => onSelect?.(category)}
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
												{(showArchiveIcon || showSelectionIcon) && (
													<div className='ml-auto flex items-center gap-2'>
														{showArchiveIcon && <LucideIcons.Archive className='text-label' size={16} />}
														{showSelectionIcon && <LucideIcons.Check className='text-accent' size={16} />}
													</div>
												)}
											</div>
										</button>
									)
								})}
							</div>
						</>
					)}

					{showAddButton && (
						<div className='border-b border-divider bg-background-muted'>
							<button type='button' onClick={() => onAdd?.()} className='flex h-16 items-center px-3 w-full'>
								<LucideIcons.Plus className='mr-3 text-access' />
								<span className='text-access'>{t('categories.drawer.add')}</span>
							</button>
						</div>
					)}
				</div>
			</div>
		</Drawer>
	)
}

export default CategoriesDrawer
