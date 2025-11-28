import { Check, Wallet as WalletIcon, X } from 'lucide-react'
import Drawer from '@/components/Drawer/Drawer'
import { typeIcons } from '@/widgets/Wallets/types'
import type { WalletType } from '@/types/entities/wallet'
import { useTranslation } from '@/i18n'

interface TransactionWalletPickerDrawerProps {
	open: boolean
	onClose: () => void
	title: string
	wallets: Array<{ id: number; name: string; color?: string | null; type?: WalletType | null }>
	selectedWalletId: number | null
	onSelect: (walletId: number) => void
	emptyStateLabel?: string
	showAllOption?: boolean
	allOptionLabel?: string
	onSelectAll?: () => void
}

export const TransactionWalletPickerDrawer = ({
	open,
	onClose,
	title,
	wallets,
	selectedWalletId,
	onSelect,
	emptyStateLabel,
	showAllOption = false,
	allOptionLabel,
	onSelectAll,
}: TransactionWalletPickerDrawerProps) => {
	const { t } = useTranslation()
	return (
		<Drawer
			open={open}
			onClose={onClose}
			className='max-h-[70vh] rounded-t-lg !bg-background-secondary'
			overlayClassName='bg-black/80 backdrop-blur-sm'
		>
			<div className='flex h-full flex-col'>
				<div className='flex justify-end p-3'>
					<button type='button' onClick={onClose} className='rounded-full p-2' aria-label={t('common.close')}>
						<X />
					</button>
				</div>

				<div className='flex flex-1 flex-col pb-10 overflow-y-auto'>
					<h2 className='mb-4 px-3 text-sm font-medium text-label'>{title}</h2>

					{wallets.length === 0 ? (
						<div className='flex flex-1 items-center justify-center px-3 text-sm text-label'>
							{emptyStateLabel ?? t('transactions.filters.walletPicker.empty')}
						</div>
					) : (
						<div className='bg-background-muted'>
							{showAllOption && (
								<button
									type='button'
									onClick={() => {
										onSelectAll?.()
									}}
									className='w-full border-b border-divider text-left focus:outline-none focus-visible:bg-background-muted'
								>
									<div className='flex h-16 items-center px-3'>
										<WalletIcon className='mr-3 h-6 w-6 text-label' />
										<span className='text-text'>{allOptionLabel ?? t('transactions.filters.wallet.all')}</span>
										{selectedWalletId == null && <Check className='ml-auto text-accent' size={16} />}
									</div>
								</button>
							)}
							{wallets.map(wallet => {
								const isSelected = wallet.id === selectedWalletId
								const Icon = wallet.type ? typeIcons[wallet.type] ?? WalletIcon : WalletIcon
								const iconStyle = wallet.color ? { color: wallet.color } : undefined
								const iconClassName = wallet.color ? 'mr-3 h-6 w-6' : 'mr-3 h-6 w-6 text-label'

								return (
									<button
										key={wallet.id}
										type='button'
										onClick={() => onSelect(wallet.id)}
										aria-pressed={isSelected}
										className='w-full border-b border-divider text-left last:border-b-0 focus:outline-none focus-visible:bg-background-muted'
									>
										<div className='flex h-16 items-center px-3'>
											<Icon className={iconClassName} style={iconStyle} />
											<span className='text-text'>{wallet.name}</span>
											{isSelected && <Check className='ml-auto text-accent' size={16} />}
										</div>
									</button>
								)
							})}
						</div>
					)}
				</div>
			</div>
		</Drawer>
	)
}

export default TransactionWalletPickerDrawer
