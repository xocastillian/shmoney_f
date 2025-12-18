import { useEffect, useMemo, useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import { X } from 'lucide-react'
import Drawer from '@/components/Drawer/Drawer'
import { useTranslation } from '@/i18n'
import Button from '@/components/ui/Button/Button'

interface CustomColorPickerDrawerProps {
	open: boolean
	onClose: () => void
	initialColor: string
	onSelect: (color: string) => void
}

const FALLBACK_COLOR = '#F97316'
const HEX_PATTERN = /^#[0-9A-Fa-f]{6}$/

const normalizeColor = (value: string): string | null => {
	if (HEX_PATTERN.test(value)) {
		return value.toUpperCase()
	}
	return null
}

export function CustomColorPickerDrawer({ open, onClose, initialColor, onSelect }: CustomColorPickerDrawerProps) {
	const { t } = useTranslation()
	const normalizedInitial = useMemo(() => normalizeColor(initialColor) ?? FALLBACK_COLOR, [initialColor])
	const [color, setColor] = useState(normalizedInitial)
	const [inputValue, setInputValue] = useState(normalizedInitial.replace('#', ''))

	useEffect(() => {
		if (!open) return
		const sanitized = normalizeColor(initialColor) ?? FALLBACK_COLOR
		setColor(sanitized)
		setInputValue(sanitized.replace('#', ''))
	}, [initialColor, open])

	const handleApply = () => {
		const sanitized = normalizeColor(`#${inputValue}`) ?? normalizeColor(color)
		if (!sanitized) {
			return
		}
		onSelect(sanitized)
		onClose()
	}

	return (
		<Drawer open={open} onClose={onClose} className='h-[75vh] rounded-t-lg bg-background-secondary' swipeable={false}>
			<div className='flex h-full flex-col'>
				<div className='flex items-center justify-between gap-3 border-b border-divider p-3'>
					<h2 className='text-lg font-medium'>{t('wallets.form.customColorTitle')}</h2>
					<button type='button' onClick={onClose} className='rounded-full p-2' aria-label={t('wallets.form.close')}>
						<X />
					</button>
				</div>

				<div className='flex flex-1 flex-col gap-4 p-3 pb-10'>
					<div>
						<HexColorPicker
							style={{ width: '100%' }}
							color={color}
							onChange={nextColor => {
								const normalized = normalizeColor(nextColor) ?? FALLBACK_COLOR
								setColor(normalized)
								setInputValue(normalized.replace('#', ''))
							}}
						/>
					</div>

					<div className='flex flex-col gap-2'>
						<span className='text-xs uppercase text-label'>{t('wallets.form.customColorPreview')}</span>
						<div className='flex items-center gap-3 rounded-xl border border-divider bg-background-muted px-3 py-3'>
							<div className='h-10 w-10 rounded-full border border-divider' style={{ backgroundColor: color }} />
							<span className='font-mono text-sm text-text'>{color}</span>
						</div>
					</div>

					<div className='mt-auto'>
						<Button text={t('wallets.form.customColorApply')} onClick={handleApply} className='py-3' />
					</div>
				</div>
			</div>
		</Drawer>
	)
}

export default CustomColorPickerDrawer
