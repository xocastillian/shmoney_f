import { type ComponentType, type ReactNode } from 'react'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BottomNavBaseTab {
	key: string
	onClick?: () => void
}

interface BottomNavDefaultTab extends BottomNavBaseTab {
	label: string
	icon: ComponentType<{ className?: string }>
	variant?: 'default'
}

interface BottomNavActionTab extends BottomNavBaseTab {
	variant: 'action'
	icon?: ComponentType<{ className?: string }>
	ariaLabel?: string
}

export type BottomNavTab = BottomNavDefaultTab | BottomNavActionTab

interface BottomNavProps {
	tabs: BottomNavTab[]
	activeKey: string
	onTabChange: (key: string) => void
	onCreate?: () => void
	createButtonContent?: ReactNode
	className?: string
}

export const BottomNav = ({ tabs, activeKey, onTabChange, onCreate, createButtonContent, className }: BottomNavProps) => {
	const columns = tabs.length > 0 ? tabs.length : 1

	return (
		<nav className={cn('fixed inset-x-0 bottom-0', className)}>
			<div className='relative mx-auto flex h-[95px] max-w-screen-sm items-start pt-4 justify-between bg-black/80 backdrop-blur-sm'>
				<div className='grid w-full items-center justify-items-center' style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
					{tabs.map(tab => {
						if (tab.variant === 'action') {
							const ActionIcon = tab.icon ?? Plus
							const content = createButtonContent ?? (ActionIcon ? <ActionIcon className='h-6 w-6' /> : <Plus className='h-6 w-6' />)

							return (
								<button
									key={tab.key}
									type='button'
									onClick={() => {
										onCreate?.()
										tab.onClick?.()
									}}
									className='flex items-center justify-center rounded-full bg-accent p-3 text-background'
									aria-label={tab.ariaLabel ?? 'Добавить элемент'}
								>
									{content}
								</button>
							)
						}

						const Icon = tab.icon
						const isActive = tab.key === activeKey

						return (
							<button
								key={tab.key}
								type='button'
								onClick={() => {
									onTabChange(tab.key)
									tab.onClick?.()
								}}
								className={cn(
									'flex flex-col items-center justify-between gap-1 text-xs font-medium transition-colors',
									isActive ? 'text-accent' : ''
								)}
							>
								<Icon className='h-6 w-6' />
								<span className='text-[10px]'>{tab.label}</span>
							</button>
						)
					})}
				</div>
			</div>
		</nav>
	)
}

export default BottomNav
