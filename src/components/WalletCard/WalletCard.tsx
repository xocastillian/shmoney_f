import { useMemo, type ReactNode } from 'react'

export interface WalletCardProps {
	name: string
	balance: number
	currencyCode: string
	footer?: ReactNode
	color: string
}

const WalletCard = ({ name, balance, currencyCode, footer }: WalletCardProps) => {
	const formattedBalance = useMemo(() => {
		try {
			return new Intl.NumberFormat('ru-RU', {
				style: 'currency',
				currency: currencyCode,
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			}).format(balance)
		} catch {
			return `${balance.toLocaleString('ru-RU', {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			})} ${currencyCode}`
		}
	}, [balance, currencyCode])

	return (
		<div className='flex flex-col p-3 rounded-xl gap-1 min-h-[76px] bg-background-muted'>
			<span className='text-sm uppercase'>{name}</span>
			<span className='text-lg uppercase'>{formattedBalance}</span>
			{footer}
		</div>
	)
}

export default WalletCard
