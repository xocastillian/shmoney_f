import { useMemo } from 'react'
import { WalletType } from '@/types/entities/wallet'
import { typeIcons } from '@/widgets/Wallets/types'

const currencySymbols: Record<string, string> = {
	USD: '$',
	EUR: '€',
	KZT: '₸',
	CNY: '¥',
	AED: 'د.إ',
}

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
			const symbol = currencySymbols[currencyCode] ?? currencyPart ?? currencyCode
			const nonCurrencyParts = parts.filter(part => part.type !== 'currency')

			if (nonCurrencyParts.length > 0) {
				const numberValue = nonCurrencyParts
					.map(part => part.value)
					.join('')
					.trim()
				return `${symbol} ${numberValue}`
			}

			return `${symbol} ${formatter.format(balance)}`
		} catch {
			const formattedNumber = balance.toLocaleString('ru-RU', {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			})

			const symbol = currencySymbols[currencyCode] ?? currencyCode
			return `${symbol} ${formattedNumber}`
		}
	}, [balance, currencyCode])

	const TypeIcon = typeIcons[type]
	const iconStyle = color ? { color } : undefined
	const iconClassName = color ? 'h-7 w-7' : 'text-label h-7 w-7'
	const cardStyle = color
		? {
				borderBottomColor: color,
				boxShadow: `0 15px 20px -25px ${color}`,
		  }
		: undefined

	return (
		<div
			className='p-3 rounded-xl justify-between gap-1 min-h-[110px] h-[110px] bg-background-muted border-b-2 transition-colors'
			style={cardStyle}
			onClick={onClick}
		>
			{TypeIcon && <TypeIcon className={iconClassName} style={iconStyle} />}

			<div className='flex flex-col items-start gap-1 mt-2'>
				<span className='text-xs text-label uppercase'>{name}</span>
				<span className={`text-lg uppercase`}>{formattedBalance}</span>
			</div>
		</div>
	)
}

export default WalletCard
