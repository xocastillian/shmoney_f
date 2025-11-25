import { X } from 'lucide-react'

import Drawer from '@/components/Drawer/Drawer'
import { categoryIconOptions } from '../icons'

interface IconPickerDrawerProps {
	open: boolean
	onClose: () => void
	selectedIcon: string
	onSelect: (icon: string) => void
}

const IconPickerDrawer = ({ open, onClose, selectedIcon, onSelect }: IconPickerDrawerProps) => {
	return (
		<Drawer
			open={open}
			onClose={onClose}
			className='max-h-[85vh] rounded-t-lg !bg-background-secondary'
			overlayClassName='bg-black/80 backdrop-blur-sm'
		>
			<div className='flex h-full flex-col'>
				<div className='flex justify-end p-3'>
					<button type='button' onClick={onClose} className='rounded-full'>
						<X />
					</button>
				</div>

				<div className='flex-1 overflow-y-auto px-4 pb-4'>
					<h2 className='mb-4 text-sm font-medium text-label'>Выбор иконки</h2>
					<div className='grid grid-cols-4 gap-3'>
						{categoryIconOptions.map(({ key, Icon }) => {
							const isActive = selectedIcon === key
							return (
								<button
									key={key}
									type='button'
									onClick={() => onSelect(key)}
									className={`flex flex-col items-center rounded-xl border px-3 py-3 text-xs transition-colors ${
										isActive ? 'border-accent-orange text-text' : 'border-transparent text-label'
									}`}
								>
									<Icon className='h-6 w-6' />
								</button>
							)
						})}
					</div>
				</div>
			</div>
		</Drawer>
	)
}

export default IconPickerDrawer
