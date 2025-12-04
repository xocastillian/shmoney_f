import { Check, X } from 'lucide-react'
import type { CurrencyOption } from '../types'
import { currencyIconMap } from '../types'
import { useTranslation } from '@/i18n'
import Drawer from '@/components/Drawer/Drawer'
import Loader from '@/components/ui/Loader/Loader'

interface CurrencyPickerDrawerProps {
	open: boolean
	onClose: () => void
	options: readonly CurrencyOption[]
	selectedCode: string
	onSelect: (code: string) => void
	loading?: boolean
}

export function CurrencyPickerDrawer({ open, onClose, options, selectedCode, onSelect, loading = false }: CurrencyPickerDrawerProps) {
	const { t } = useTranslation()

	const handleClose = () => {
		if (loading) return
		onClose()
	}

	return (
		<Drawer open={open} onClose={handleClose} className='h-[70vh] rounded-t-lg bg-background-secondary'>
			<div className='flex h-full flex-col'>
				<div className='flex justify-between items-center p-3 sticky top-0'>
					<h2 className='text-lg font-medium'>{t('wallets.form.currencyTitle')}</h2>

					<button type='button' onClick={handleClose} className='rounded-full p-2' aria-label={t('wallets.form.close')} disabled={loading}>
						<X />
					</button>
				</div>

				<div className='flex flex-col pb-10 flex-1 overflow-y-auto'>
					<div className='bg-background-muted border-t border-divider'>
						{options.map(option => {
							const isSelected = option.value === selectedCode
							const iconSrc = currencyIconMap[option.value]
							return (
								<button
									key={option.value}
									type='button'
									onClick={() => onSelect(option.value)}
									aria-pressed={isSelected}
									className='w-full border-b border-divider text-left'
									disabled={loading}
								>
									<div className='flex h-16 items-center px-3'>
										{iconSrc && <img src={iconSrc} alt='' className='mr-3 h-6 w-6' />}
										<span className='text-text'>{t(option.label)}</span>
										{isSelected && <Check className='ml-auto text-accent' size={16} />}
									</div>
								</button>
							)
						})}
					</div>
				</div>

				{loading && (
					<div className='fixed inset-0 z-30 bg-black/80 backdrop-blur-sm'>
						<div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
							<Loader />
						</div>
					</div>
				)}
			</div>
		</Drawer>
	)
}

export default CurrencyPickerDrawer
