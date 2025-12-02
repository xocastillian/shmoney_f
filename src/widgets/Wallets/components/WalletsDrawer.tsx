import { Check, Plus, Wallet as WalletIcon, X } from 'lucide-react'
import { typeIcons } from '@/widgets/Wallets/types'
import type { WalletType } from '@/types/entities/wallet'
import { useTranslation } from '@/i18n'
import Drawer from '@/components/Drawer/Drawer'
import Loader from '@/components/ui/Loader/Loader'

interface WalletsDrawerProps {
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
	loading?: boolean
	showCheckIcon?: boolean
	showAddButton?: boolean
	onAdd?: () => void
}

export const WalletsDrawer = ({
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
	loading = false,
	showCheckIcon = false,
	showAddButton = false,
	onAdd,
}: WalletsDrawerProps) => {
	const { t } = useTranslation()

	return (
		<Drawer open={open} onClose={onClose} className='h-[100vh] rounded-t-lg bg-background-secondary' swipeable={false}>
			<div className='flex h-full flex-col'>
				<div className='flex items-center justify-between p-3'>
					<h2 className='text-lg font-medium'>{title}</h2>
					<button type='button' onClick={onClose} className='rounded-full p-2' aria-label={t('common.close')}>
						<X />
					</button>
				</div>

				<div className='flex flex-1 flex-col overflow-y-auto'>
					{loading ? (
						<div className='flex flex-1 items-center justify-center px-3'>
							<Loader />
						</div>
					) : wallets.length === 0 ? (
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
										className='w-full border-b border-divider text-left'
									>
										<div className='flex h-16 items-center px-3'>
											<Icon className={iconClassName} style={iconStyle} />
											<span className='text-text'>{wallet.name}</span>
											{isSelected && showCheckIcon && <Check className='ml-auto text-accent' size={16} />}
										</div>
									</button>
								)
							})}
						</div>
					)}

					{showAddButton && (
						<div className='border-b border-divider bg-background-muted'>
							<button type='button' onClick={() => onAdd?.()} className='flex h-16 w-full items-center px-3'>
								<Plus className='mr-3 text-access' />
								<span className='text-access'>{t('wallets.drawer.add')}</span>
							</button>
						</div>
					)}
				</div>
			</div>
		</Drawer>
	)
}

export default WalletsDrawer
