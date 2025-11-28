import { Check, X } from 'lucide-react'
import { walletTypeLabels, walletTypeOrder, WalletType } from '@/types/entities/wallet'
import { typeIcons } from '../types'
import { useTranslation } from '@/i18n'
import DrawerWrapper from '@/components/DrawerWrapper/DrawerWrapper'

interface TypePickerDrawerProps {
	open: boolean
	onClose: () => void
	selectedType: WalletType
	onSelect: (type: WalletType) => void
}

export function TypePickerDrawer({ open, onClose, selectedType, onSelect }: TypePickerDrawerProps) {
	const { t } = useTranslation()

	return (
		<DrawerWrapper open={open} onClose={onClose} className='rounded-t-lg bg-background-secondary'>
			<div className='flex h-full flex-col'>
				<div className='flex justify-end p-3'>
					<button type='button' onClick={onClose} className='rounded-full p-2' aria-label={t('wallets.form.close')}>
						<X />
					</button>
				</div>

				<div className='flex flex-col pb-10'>
					<h2 className='mb-4 px-3 text-sm font-medium text-label'>{t('wallets.form.typeTitle')}</h2>
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
										<span className='text-text'>{t(walletTypeLabels[type])}</span>
										{isSelected && <Check className='ml-auto text-accent' size={16} />}
									</div>
								</button>
							)
						})}
					</div>
				</div>
			</div>
		</DrawerWrapper>
	)
}

export default TypePickerDrawer
