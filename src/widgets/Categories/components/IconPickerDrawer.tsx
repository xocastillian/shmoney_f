import { X } from 'lucide-react'
import { categoryIconOptions } from '../icons'
import Drawer from '@/components/Drawer/Drawer'
import { useTranslation } from '@/i18n'

interface IconPickerDrawerProps {
	open: boolean
	onClose: () => void
	selectedIcon: string
	onSelect: (icon: string) => void
}

const IconPickerDrawer = ({ open, onClose, selectedIcon, onSelect }: IconPickerDrawerProps) => {
	const { t } = useTranslation()

	return (
		<Drawer open={open} onClose={onClose} className='h-[70vh] rounded-t-lg bg-background-secondary'>
			<div className='flex h-full flex-col'>
				<div className='flex justify-between items-center p-3 border-b border-divider'>
					<h1 className='text-lg font-medium'>{t('common.iconPicker')}</h1>

					<button type='button' onClick={onClose} className='rounded-full p-2'>
						<X />
					</button>
				</div>

				<div className='flex-1 overflow-y-auto px-4 py-3 pb-10'>
					<div className='grid grid-cols-4 gap-3'>
						{categoryIconOptions.map(({ key, Icon }) => {
							const isActive = selectedIcon === key
							return (
								<button
									key={key}
									type='button'
									onClick={() => onSelect(key)}
									className={`flex flex-col items-center rounded-xl border px-3 py-3 text-xs transition-colors ${
										isActive ? 'border-accent text-text' : 'border-transparent text-label'
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
