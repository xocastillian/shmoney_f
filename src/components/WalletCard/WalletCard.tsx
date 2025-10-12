import { useMemo } from 'react'
import { WalletType } from '@/types/entities/wallet'
import { typeIcons } from '@/widgets/Wallets/components/types'

export interface WalletCardProps {
	name: string
	balance: number
	currencyCode: string
	color: string
	type: WalletType
	onClick?: () => void
}

const WalletCard = ({ name, balance, currencyCode, color, type, onClick }: WalletCardProps) => {
	const formattedBalance = useMemo(() => {
		try {
			const formatter = new Intl.NumberFormat('ru-RU', {
				style: 'currency',
				currency: currencyCode,
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			})

			const parts = formatter.formatToParts(balance)
			const currencyPart = parts.find(part => part.type === 'currency')?.value

			if (currencyPart) {
				const numberValue = parts
					.filter(part => part.type !== 'currency')
					.map(part => part.value)
					.join('')
					.trim()

				return `${currencyPart} ${numberValue}`
			}

			return formatter.format(balance)
		} catch {
			const formattedNumber = balance.toLocaleString('ru-RU', {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			})

			return `${currencyCode} ${formattedNumber}`
		}
	}, [balance, currencyCode])

	const TypeIcon = typeIcons[type]
	const iconStyle = color ? { color } : undefined
	const iconClassName = color ? 'h-6 w-6' : 'text-label h-5 w-5'
	const cardStyle = color
		? {
				borderBottomColor: color,
				boxShadow: `0 15px 20px -25px ${color}`,
		  }
		: undefined

	return (
		<div
			className='flex p-3 rounded-xl justify-between min-h-[76px] bg-background-muted border-b-2 transition-colors'
			style={cardStyle}
			onClick={onClick}
		>
			<div className='flex flex-col items-start justify-between'>
				<span className='text-xs text-label uppercase'>{name}</span>
				<span className='text-xl uppercase'>{formattedBalance}</span>
			</div>
			{TypeIcon && <TypeIcon className={iconClassName} style={iconStyle} />}
		</div>
	)
}

export default WalletCard
