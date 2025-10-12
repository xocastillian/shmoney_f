import { Check, X } from 'lucide-react'

import Drawer from '@/components/Drawer/Drawer'
import { walletTypeLabels, walletTypeOrder, WalletType } from '@/types/entities/wallet'
import { typeIcons } from './types'

interface TypePickerDrawerProps {
	open: boolean
	onClose: () => void
	selectedType: WalletType
	onSelect: (type: WalletType) => void
}

export function TypePickerDrawer({ open, onClose, selectedType, onSelect }: TypePickerDrawerProps) {
	return (
		<Drawer
			open={open}
			onClose={onClose}
			className='max-h-[70vh] rounded-t-lg !bg-background-secondary'
			overlayClassName='bg-black/80 backdrop-blur-sm'
		>
			<div className='flex h-full flex-col'>
				<div className='flex justify-end p-3'>
					<button type='button' onClick={onClose} className='rounded-full' aria-label='Закрыть'>
						<X />
					</button>
				</div>

				<div className='flex flex-1 flex-col'>
					<h2 className='mb-4 px-3 text-sm font-medium text-label'>Тип кошелька</h2>
					<div className='bg-background-muted'>
						{walletTypeOrder.map(type => {
							const isSelected = type === selectedType
							const Icon = typeIcons[type]
							return (
								<button
									key={type}
									type='button'
									onClick={() => onSelect(type)}
									aria-pressed={isSelected}
									className='w-full border-b border-divider text-left last:border-b-0 focus:outline-none focus-visible:bg-background-muted'
								>
									<div className='flex h-16 items-center px-3'>
										<Icon className='mr-3 text-label' />
										<span className='text-text'>{walletTypeLabels[type]}</span>
										{isSelected && <Check className='ml-auto text-primary' size={16} />}
									</div>
								</button>
							)
						})}
					</div>
				</div>
			</div>
		</Drawer>
	)
}

export default TypePickerDrawer
