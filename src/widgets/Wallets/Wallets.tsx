import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { AddWalletCard } from '@/components/WalletCard/AddWalletCard'
import WalletCard from '@/components/WalletCard/WalletCard'
import type { Wallet } from '@/types/entities/wallet'
import { useWallets } from '@/hooks/useWallets'
import { WalletFormDrawer } from './components/WalletFormDrawer'
import { ColorPickerDrawer } from './components/ColorPickerDrawer'
import { TypePickerDrawer } from './components/TypePickerDrawer'
import { CurrencyPickerDrawer } from './components/CurrencyPickerDrawer'
import type { CurrencyOption } from './components/types'
import { WalletType } from '@/types/entities/wallet'

const currencyOptions: CurrencyOption[] = [
	{ value: 'USD', label: 'Доллар USD' },
	{ value: 'KZT', label: 'Тенге KZT' },
	{ value: 'EUR', label: 'Евро EUR' },
	{ value: 'CNY', label: 'Юань CNY' },
	{ value: 'AED', label: 'Дирхам AED' },
]

const colorOptions: readonly string[] = [
	// oranges
	'#FDBA74',
	'#FB923C',
	'#F97316',
	'#EA580C',
	// greens
	'#BBF7D0',
	'#86EFAC',
	'#4ADE80',
	'#22C55E',
	// blues
	'#BAE6FD',
	'#7DD3FC',
	'#38BDF8',
	'#0EA5E9',
	// reds
	'#FCA5A5',
	'#F87171',
	'#EF4444',
	'#DC2626',
	// purples
	'#E9D5FF',
	'#D8B4FE',
	'#C084FC',
	'#A855F7',
	// pinks
	'#FBCFE8',
	'#F9A8D4',
	'#F472B6',
	'#EC4899',
]

interface WalletsProps {
	wallets: Wallet[]
}

const defaultWalletType = WalletType.CASH

const Wallets = ({ wallets }: WalletsProps) => {
	const { createWallet, actionLoading } = useWallets()
	const [open, setOpen] = useState(false)
	const [name, setName] = useState('')
	const [currencyCode, setCurrencyCode] = useState(currencyOptions[0].value)
	const [balance, setBalance] = useState('')
	const [formError, setFormError] = useState<string | null>(null)
	const [colorPickerOpen, setColorPickerOpen] = useState(false)
	const [selectedColor, setSelectedColor] = useState<string>(colorOptions[0])
	const [typePickerOpen, setTypePickerOpen] = useState(false)
	const [selectedType, setSelectedType] = useState<WalletType>(defaultWalletType)
	const [currencyPickerOpen, setCurrencyPickerOpen] = useState(false)

	useEffect(() => {
		if (!open) {
			setName('')
			setCurrencyCode(currencyOptions[0].value)
			setBalance('')
			setFormError(null)
			setColorPickerOpen(false)
			setSelectedColor(colorOptions[0])
			setTypePickerOpen(false)
			setSelectedType(defaultWalletType)
			setCurrencyPickerOpen(false)
		}
	}, [open])

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const trimmedName = name.trim()
		const trimmedCurrency = currencyCode.trim().toUpperCase()
		const trimmedBalance = balance.trim()
		const parsedBalance = Number.parseFloat(trimmedBalance)

		if (trimmedName.length === 0) {
			setFormError('Введите название кошелька')
			return
		}

		if (trimmedCurrency.length === 0) {
			setFormError('Укажите валюту')
			return
		}

		if (Number.isNaN(parsedBalance)) {
			setFormError('Введите корректный баланс')
			return
		}

		if (parsedBalance < 0) {
			setFormError('Баланс не может быть отрицательным')
			return
		}

		try {
			await createWallet({
				name: trimmedName,
				currencyCode: trimmedCurrency,
				balance: parsedBalance,
				color: selectedColor,
				type: selectedType,
			})
			setFormError(null)
			setOpen(false)
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Не удалось создать кошелёк'
			setFormError(message)
		}
	}

	const submitDisabled = useMemo(() => {
		const trimmedName = name.trim()
		const trimmedCurrency = currencyCode.trim()
		const trimmedBalance = balance.trim()
		const parsedBalance = Number.parseFloat(trimmedBalance)
		const balanceValid = trimmedBalance.length > 0 && !Number.isNaN(parsedBalance) && parsedBalance >= 0

		return actionLoading || trimmedName.length === 0 || trimmedCurrency.length === 0 || !balanceValid
	}, [actionLoading, name, currencyCode, balance])

	return (
		<>
			<div className='grid grid-cols-2 gap-[10px]'>
				{wallets.map(wallet => (
					<WalletCard key={wallet.id} name={wallet.name} balance={wallet.balance} currencyCode={wallet.currencyCode} color={wallet.color} />
				))}

				<AddWalletCard onClick={() => setOpen(true)} />
			</div>

			<WalletFormDrawer
				open={open}
				onClose={() => setOpen(false)}
				onSubmit={handleSubmit}
				name={name}
				onNameChange={value => {
					setName(value)
					setFormError(null)
				}}
				currencyCode={currencyCode}
				currencyOptions={currencyOptions}
				onOpenCurrencyPicker={() => setCurrencyPickerOpen(true)}
				onOpenTypePicker={() => setTypePickerOpen(true)}
				selectedType={selectedType}
				onOpenColorPicker={() => setColorPickerOpen(true)}
				selectedColor={selectedColor}
				balance={balance}
				onBalanceChange={value => {
					setBalance(value)
					setFormError(null)
				}}
				error={formError}
				submitDisabled={submitDisabled}
			/>

			<ColorPickerDrawer
				open={colorPickerOpen}
				onClose={() => setColorPickerOpen(false)}
				colors={colorOptions}
				selectedColor={selectedColor}
				onSelect={color => {
					setSelectedColor(color)
					setColorPickerOpen(false)
					setFormError(null)
				}}
			/>

			<CurrencyPickerDrawer
				open={currencyPickerOpen}
				onClose={() => setCurrencyPickerOpen(false)}
				options={currencyOptions}
				selectedCode={currencyCode}
				onSelect={code => {
					setCurrencyCode(code)
					setCurrencyPickerOpen(false)
					setFormError(null)
				}}
			/>

			<TypePickerDrawer
				open={typePickerOpen}
				onClose={() => setTypePickerOpen(false)}
				selectedType={selectedType}
				onSelect={type => {
					setSelectedType(type)
					setTypePickerOpen(false)
					setFormError(null)
				}}
			/>
		</>
	)
}

export default Wallets
