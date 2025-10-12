import { Check, X } from 'lucide-react'
import Drawer from '@/components/Drawer/Drawer'
import type { CurrencyOption } from '../types'
import { currencyIconMap } from '../types'

interface CurrencyPickerDrawerProps {
	open: boolean
	onClose: () => void
	options: readonly CurrencyOption[]
	selectedCode: string
	onSelect: (code: string) => void
}

export function CurrencyPickerDrawer({ open, onClose, options, selectedCode, onSelect }: CurrencyPickerDrawerProps) {
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
					<h2 className='mb-4 px-3 text-sm font-medium text-label'>Валюта</h2>
					<div className='bg-background-muted'>
						{options.map(option => {
							const isSelected = option.value === selectedCode
							const iconSrc = currencyIconMap[option.value]
							return (
								<button
									key={option.value}
									type='button'
									onClick={() => onSelect(option.value)}
									aria-pressed={isSelected}
									className='w-full border-b border-divider text-left last:border-b-0 focus:outline-none focus-visible:bg-background-muted'
								>
									<div className='flex h-16 items-center px-3'>
										{iconSrc && <img src={iconSrc} alt='' className='mr-3 h-6 w-6' />}
										<span className='text-text'>{option.label}</span>
										{isSelected && <Check className='ml-auto' size={16} />}
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

export default CurrencyPickerDrawer
