import { useEffect } from 'react'
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
}

const CloseIcon = LucideIcons.X
const lucideIconMap = LucideIcons as unknown as Record<string, LucideIcon | undefined>

const CategoriesDrawer = ({ open, onClose, onSelect, onAdd }: CategoriesDrawerProps) => {
	const { categories, loading, fetchCategories } = useCategories()

	useEffect(() => {
		if (!open) return
		if (categories.length === 0 && !loading) {
			fetchCategories().catch(() => {})
		}
	}, [categories.length, fetchCategories, loading, open])

	const hasCategories = categories.length > 0

	return (
		<Drawer open={open} onClose={onClose} className='max-h-[100vh]' overlayClassName='bg-black/80 backdrop-blur-sm'>
			<div className='flex h-full flex-col'>
				<div className='flex justify-end p-3'>
					<button type='button' onClick={onClose} className='rounded-full' aria-label='Закрыть'>
						<CloseIcon />
					</button>
				</div>

				<div className='flex-1 overflow-y-auto'>
					{hasCategories && (
						<>
							<h2 className='mb-3 text-sm font-medium text-label px-3'>Категории</h2>
							<div className='overflow-hidden bg-background-muted'>
								{categories.map(category => {
									const IconComponent = category.icon ? lucideIconMap[category.icon] : undefined
									const initials = category.name.slice(0, 2).toUpperCase()

									return (
										<button
											key={category.id}
											type='button'
											onClick={() => onSelect?.(category)}
											className='w-full border-b border-divider text-left last:border-b-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-orange'
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
				</div>

				<div className='border-t border-divider p-4'>
					<button
						type='button'
						onClick={() => onAdd?.()}
						className='w-full rounded-xl bg-accent-orange py-3 text-base font-medium text-text-dark transition-opacity duration-150 active:opacity-80'
					>
						Добавить категорию
					</button>
				</div>
			</div>
		</Drawer>
	)
}

export default CategoriesDrawer
