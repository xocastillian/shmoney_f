import { X } from 'lucide-react'
import Drawer from '@/components/Drawer/Drawer'
import { cn } from '@/lib/utils'

interface ColorPickerDrawerProps {
	open: boolean
	onClose: () => void
	colors: readonly string[]
	onSelect: (color: string) => void
	selectedColor: string
}

export function ColorPickerDrawer({ open, onClose, colors, onSelect, selectedColor }: ColorPickerDrawerProps) {
	return (
		<Drawer
			open={open}
			onClose={onClose}
			className='max-h-[70vh] rounded-t-lg !bg-background-secondary'
			overlayClassName='bg-black/80 backdrop-blur-sm'
		>
			<div className='flex h-full flex-col'>
				<div className='flex justify-end p-3'>
					<button type='button' onClick={onClose} className='rounded-full'>
						<X />
					</button>
				</div>

				<div className='flex flex-1 flex-col px-4 pb-6'>
					<h2 className='mb-4 text-sm font-medium text-label'>Выбор цвета</h2>
					<div className='grid grid-cols-4 gap-3 gap-y-7 place-items-center'>
						{colors.map(color => (
							<button
								key={color}
								type='button'
								onClick={() => onSelect(color)}
								className={cn(
									'h-8 w-8 rounded-full border border-divider transition-transform duration-150 focus:outline-none',
									selectedColor === color ? 'scale-110' : 'hover:scale-110'
								)}
								style={{
									backgroundColor: color,
									boxShadow: selectedColor === color ? '0 0 0 2px #fff, 0 0 0 4px rgba(15, 23, 42, 0.35)' : 'none',
								}}
								aria-label={`Выбрать цвет ${color}`}
							/>
						))}
					</div>
				</div>
			</div>
		</Drawer>
	)
}

export default ColorPickerDrawer
