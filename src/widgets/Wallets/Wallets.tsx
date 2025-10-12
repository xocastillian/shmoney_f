import { useEffect, useMemo, useRef, useState } from 'react'
import type { WheelEvent } from 'react'
import type { FormEvent } from 'react'
import { AddWalletCard } from '@/components/WalletCard/AddWalletCard'
import WalletCard from '@/components/WalletCard/WalletCard'
import type { Wallet } from '@/types/entities/wallet'
import { useWallets } from '@/hooks/useWallets'
import { WalletFormDrawer } from './components/WalletFormDrawer'
import { ColorPickerDrawer } from './components/ColorPickerDrawer'
import { TypePickerDrawer } from './components/TypePickerDrawer'
import { CurrencyPickerDrawer } from './components/CurrencyPickerDrawer'
import { WalletType } from '@/types/entities/wallet'
import { sanitizeDecimalInput } from '@/utils/number'
import { colorOptions, currencyOptions } from './constants'

interface WalletsProps {
	wallets: Wallet[]
}

const defaultWalletType = WalletType.CASH

const Wallets = ({ wallets }: WalletsProps) => {
	const { createWallet, updateWallet, deleteWallet, actionLoading } = useWallets()
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
	const [editingWalletId, setEditingWalletId] = useState<number | null>(null)

	const isEditing = editingWalletId !== null

	const resetFormState = () => {
		setName('')
		setCurrencyCode(currencyOptions[0].value)
		setBalance('')
		setFormError(null)
		setColorPickerOpen(false)
		setSelectedColor(colorOptions[0])
		setTypePickerOpen(false)
		setSelectedType(defaultWalletType)
		setCurrencyPickerOpen(false)
		setEditingWalletId(null)
	}

	useEffect(() => {
		if (!open) {
			resetFormState()
		}
	}, [open])

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const trimmedName = name.trim()
		const trimmedCurrency = currencyCode.trim().toUpperCase()
		const sanitizedBalance = sanitizeDecimalInput(balance)
		const parsedBalance = sanitizedBalance.length > 0 ? Number.parseFloat(sanitizedBalance) : NaN

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
			if (isEditing && editingWalletId !== null) {
				await updateWallet(editingWalletId, {
					name: trimmedName,
					currencyCode: trimmedCurrency,
					color: selectedColor,
					type: selectedType,
					balance: parsedBalance,
				})
			} else {
				await createWallet({
					name: trimmedName,
					currencyCode: trimmedCurrency,
					balance: parsedBalance,
					color: selectedColor,
					type: selectedType,
				})
			}
			setFormError(null)
			setOpen(false)
		} catch (err) {
			const defaultMessage = isEditing ? 'Не удалось сохранить кошелёк' : 'Не удалось создать кошелёк'
			const message = err instanceof Error ? err.message : defaultMessage
			setFormError(message)
		}
	}

	const handleDelete = async () => {
		if (!isEditing || editingWalletId === null) return
		const confirmed = window.confirm('Реально?')
		if (!confirmed) return
		try {
			await deleteWallet(editingWalletId)
			setFormError(null)
			setOpen(false)
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Не удалось удалить кошелёк'
			setFormError(message)
		}
	}

	const submitDisabled = useMemo(() => {
		const trimmedName = name.trim()
		const trimmedCurrency = currencyCode.trim()
		const sanitizedBalance = sanitizeDecimalInput(balance)
		const parsedBalance = sanitizedBalance.length > 0 ? Number.parseFloat(sanitizedBalance) : NaN
		const balanceValid = sanitizedBalance.length > 0 && !Number.isNaN(parsedBalance) && parsedBalance >= 0

		return actionLoading || trimmedName.length === 0 || trimmedCurrency.length === 0 || !balanceValid
	}, [actionLoading, name, currencyCode, balance])

	const handleAddWalletClick = () => {
		resetFormState()
		setOpen(true)
	}

	const handleWalletClick = (wallet: Wallet) => {
		setEditingWalletId(wallet.id)
		setName(wallet.name)
		setCurrencyCode(wallet.currencyCode)
		setBalance(sanitizeDecimalInput(String(wallet.balance)))
		setSelectedColor(wallet.color || colorOptions[0])
		setSelectedType(wallet.type || defaultWalletType)
		setFormError(null)
		setColorPickerOpen(false)
		setCurrencyPickerOpen(false)
		setTypePickerOpen(false)
		setOpen(true)
	}

	const columns = []
	const items = [...wallets, null]

	for (let index = 0; index < items.length; index += 2) {
		columns.push(items.slice(index, index + 2))
	}

	const scrollContainerRef = useRef<HTMLDivElement>(null)

	const handleHorizontalScroll = (event: WheelEvent<HTMLDivElement>) => {
		const container = scrollContainerRef.current
		if (!container) return
		if (container.scrollWidth <= container.clientWidth) return

		if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
			event.preventDefault()
			container.scrollBy({
				left: event.deltaY,
				behavior: 'smooth',
			})
		}
	}

	return (
		<>
			<div
				className='overflow-x-auto overflow-y-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'
				ref={scrollContainerRef}
				onWheel={handleHorizontalScroll}
			>
				<div className='flex gap-[10px] pb-2'>
					{columns.map((column, columnIndex) => (
						<div key={`column-${columnIndex}`} className='flex-none basis-[calc(50%-5px)] grid items-start gap-[10px]'>
							{column.map((item, rowIndex) =>
								item ? (
									<WalletCard
										key={item.id}
										name={item.name}
										balance={item.balance}
										currencyCode={item.currencyCode}
										color={item.color}
										type={item.type}
										onClick={() => handleWalletClick(item)}
									/>
								) : (
									<AddWalletCard key={`add-card-${columnIndex}-${rowIndex}`} onClick={handleAddWalletClick} />
								)
							)}
						</div>
					))}
				</div>
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
				title={isEditing ? 'Редактирование кошелька' : 'Создание кошелька'}
				submitLabel={isEditing ? 'Сохранить' : 'Готово'}
				onDelete={isEditing ? handleDelete : undefined}
				disableDelete={actionLoading}
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
