import { Plus } from 'lucide-react'

export interface AddWalletCardProps {
	onClick?: () => void
}

export const AddWalletCard = ({ onClick }: AddWalletCardProps) => {
	return (
		<div
			className='flex min-h-[110px] h-[110px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-accent bg-card p-3'
			onClick={onClick}
		>
			<Plus className='text-accent' />
		</div>
	)
}
