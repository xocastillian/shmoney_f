import { useEffect, useState } from 'react'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import Drawer from '@/components/Drawer/Drawer'
import { useCategories } from '@/hooks/useCategories'
import type { Category } from '@/types/entities/category'

interface CategoriesDrawerProps {
	open: boolean
	onClose: () => void
	onSelect?: (category: Category) => void
	onAdd?: () => void
	showAddButton?: boolean
	className?: string
	showAllOption?: boolean
	allOptionLabel?: string
	onSelectAll?: () => void
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
	showAllOption = false,
	allOptionLabel = 'Все категории',
	onSelectAll,
}: CategoriesDrawerProps) => {
	const { categories, loading, fetchCategories } = useCategories()
	const [initialized, setInitialized] = useState(false)

	useEffect(() => {
		if (!open || initialized || loading) return

		fetchCategories()
			.then(() => setInitialized(true))
			.catch(() => setInitialized(true))
	}, [fetchCategories, initialized, loading, open])

	const hasCategories = categories.length > 0

	return (
		<Drawer open={open} onClose={onClose} className={`max-h-[100vh] ${className}`} overlayClassName='bg-black/80 backdrop-blur-sm'>
			<div className='flex h-full flex-col'>
				<div className='flex justify-end p-3'>
					<button type='button' onClick={onClose} className='p-2' aria-label='Закрыть'>
						<CloseIcon />
					</button>
				</div>

				<div className='flex-1 overflow-y-auto'>
					{hasCategories && (
						<>
							<h2 className='mb-3 px-3 text-sm font-medium text-label'>Категории</h2>
							<div className='overflow-hidden bg-background-muted'>
								{showAllOption && (
									<button
										type='button'
										onClick={() => onSelectAll?.()}
										className='w-full border-b border-divider text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-orange'
									>
										<div className='flex h-16 items-center px-3'>
											<LucideIcons.FolderHeart className='mr-3 text-label' />
											<span className='text-text'>{allOptionLabel}</span>
										</div>
									</button>
								)}
								{categories.map(category => {
									const IconComponent = category.icon ? lucideIconMap[category.icon] : undefined
									const initials = category.name.slice(0, 2).toUpperCase()

									return (
										<button
											key={category.id}
											type='button'
											onClick={() => onSelect?.(category)}
											className='w-full border-b border-divider text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-orange'
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
								<span className='text-access'>Добавить категорию</span>
							</button>
						</div>
					)}
				</div>
			</div>
		</Drawer>
	)
}

export default CategoriesDrawer
