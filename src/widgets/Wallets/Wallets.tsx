import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Carousel } from '@/components/ui/Carousel'
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
import { useTranslation } from '@/i18n'

interface WalletsProps {
	wallets: Wallet[]
	loading?: boolean
}

const defaultWalletType = WalletType.CASH

const Wallets = ({ wallets, loading = false }: WalletsProps) => {
	const { createWallet, updateWallet, deleteWallet, actionLoading, fetchWalletBalances } = useWallets()
	const { t } = useTranslation()
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
			setFormError(t('wallets.form.errors.nameRequired'))
			return
		}

		if (trimmedCurrency.length === 0) {
			setFormError(t('wallets.form.errors.currencyRequired'))
			return
		}

		if (Number.isNaN(parsedBalance)) {
			setFormError(t('wallets.form.errors.balanceInvalid'))
			return
		}

		if (parsedBalance < 0) {
			setFormError(t('wallets.form.errors.balanceNegative'))
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
			await fetchWalletBalances()
			setFormError(null)
			setOpen(false)
		} catch (err) {
			const defaultMessage = isEditing ? t('wallets.errors.saveFailed') : t('wallets.errors.createFailed')
			const message = err instanceof Error ? err.message : defaultMessage
			setFormError(message)
		}
	}

	const handleDelete = async () => {
		if (!isEditing || editingWalletId === null) return
		const confirmed = window.confirm(t('wallets.form.confirmDelete'))
		if (!confirmed) return
		try {
			await deleteWallet(editingWalletId)
			setFormError(null)
			setOpen(false)
			await fetchWalletBalances()
		} catch (err) {
			const message = err instanceof Error ? err.message : t('wallets.errors.deleteFailed')
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

	const pages = useMemo(() => {
		const items: Array<Wallet | null> = [...wallets, null]
		const result: Array<Array<Wallet | null>> = []

		for (let index = 0; index < items.length; index += 2) {
			result.push(items.slice(index, index + 2))
		}

		return result
	}, [wallets])

	const shouldRenderSkeleton = loading

	return (
		<>
			{shouldRenderSkeleton ? (
				<WalletsSkeleton />
			) : (
				<Carousel pageClassName='grid grid-cols-2 gap-[10px]' dots>
					{pages.map((page, pageIndex) => (
						<div key={`wallets-page-${pageIndex}`}>
							{page.map((item, itemIndex) => {
								if (!item && item !== null) {
									return null
								}

								if (item === null) {
									return <AddWalletCard key={`add-card-${pageIndex}-${itemIndex}`} onClick={handleAddWalletClick} />
								}

								return (
									<WalletCard
										key={item.id}
										name={item.name}
										balance={item.balance}
										currencyCode={item.currencyCode}
										color={item.color}
										type={item.type}
										onClick={() => handleWalletClick(item)}
									/>
								)
							})}
						</div>
					))}
				</Carousel>
			)}

			<WalletFormDrawer
				open={open}
				onClose={() => setOpen(false)}
				onSubmit={handleSubmit}
				name={name}
				onNameChange={value => {
					setName(value)
					setFormError(null)
				}}
				submitting={actionLoading}
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
				title={isEditing ? t('wallets.form.editTitle') : t('wallets.form.createTitle')}
				submitLabel={isEditing ? t('wallets.form.save') : t('wallets.form.ready')}
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

function WalletsSkeleton() {
	return (
		<div className='grid grid-cols-2 gap-[10px]'>
			{Array.from({ length: 2 }).map((_, index) => (
				<div
					key={`wallet-skeleton-${index}`}
					className='min-h-[110px] h-[110px] rounded-xl bg-background-muted p-3 animate-pulse flex flex-col gap-3'
				>
					<div className='h-7 w-7 rounded-full bg-background-muted-2/60' />
					<div className='mt-auto flex flex-col gap-2'>
						<div className='h-3 w-3/4 rounded bg-background-muted-2/60' />
						<div className='h-5 w-full rounded bg-background-muted-2/60' />
					</div>
				</div>
			))}
		</div>
	)
}

export default Wallets
