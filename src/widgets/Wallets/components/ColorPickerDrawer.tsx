import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/i18n'
import Drawer from '@/components/Drawer/Drawer'

interface ColorPickerDrawerProps {
	open: boolean
	onClose: () => void
	colors: readonly string[]
	onSelect: (color: string) => void
	selectedColor: string
}

export function ColorPickerDrawer({ open, onClose, colors, onSelect, selectedColor }: ColorPickerDrawerProps) {
	const { t } = useTranslation()

	return (
		<Drawer open={open} onClose={onClose} className='h-[70vh] rounded-t-lg bg-background-secondary'>
			<div className='flex h-full flex-col'>
				<div className='flex justify-between items-center p-3 border-b border-divider'>
					<h1 className='text-lg font-medium'>{t('wallets.form.colorPickerTitle')}</h1>

					<button type='button' onClick={onClose} className='rounded-full p-2'>
						<X />
					</button>
				</div>

				<div className='flex flex-col px-4 flex-1 overflow-y-auto pb-10 py-5'>
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
