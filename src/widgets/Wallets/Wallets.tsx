import { useCallback, useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Carousel } from '@/components/ui/Carousel'
import { AddWalletCard } from '@/components/WalletCard/AddWalletCard'
import WalletCard from '@/components/WalletCard/WalletCard'
import type { Wallet } from '@/types/entities/wallet'
import { useWallets } from '@/hooks/useWallets'
import { WalletDrawer } from './components/WalletDrawer'
import { ColorPickerDrawer } from './components/ColorPickerDrawer'
import { CustomColorPickerDrawer } from './components/CustomColorPickerDrawer'
import { TypePickerDrawer } from './components/TypePickerDrawer'
import { CurrencyPickerDrawer } from './components/CurrencyPickerDrawer'
import { WalletDebetOrCredit, WalletStatus, WalletType } from '@/types/entities/wallet'
import { sanitizeDecimalInput } from '@/utils/number'
import { colorOptions, currencyOptions } from './constants'
import { useTranslation } from '@/i18n'
import { useSettings } from '@/hooks/useSettings'

interface WalletsProps {
	wallets: Wallet[]
	loading?: boolean
}

const defaultWalletType = WalletType.CASH

const Wallets = ({ wallets, loading = false }: WalletsProps) => {
	const { createWallet, updateWallet, actionLoading, fetchWalletBalances, updateWalletStatus } = useWallets()
	const { t } = useTranslation()
	const { supportedCurrencies, mainCurrency } = useSettings()
	const fallbackCurrencyCode = currencyOptions[0]?.value ?? 'USD'
	const defaultCurrencyCode = useMemo(
		() => mainCurrency ?? supportedCurrencies[0] ?? fallbackCurrencyCode,
		[fallbackCurrencyCode, mainCurrency, supportedCurrencies]
	)
	const [open, setOpen] = useState(false)
	const [name, setName] = useState('')
	const [currencyCode, setCurrencyCode] = useState(defaultCurrencyCode)
	const [balance, setBalance] = useState('')
	const [formError, setFormError] = useState<string | null>(null)
	const [colorPickerOpen, setColorPickerOpen] = useState(false)
	const [customColorPickerOpen, setCustomColorPickerOpen] = useState(false)
	const [selectedColor, setSelectedColor] = useState<string>(colorOptions[0])
	const [typePickerOpen, setTypePickerOpen] = useState(false)
	const [selectedType, setSelectedType] = useState<WalletType>(defaultWalletType)
	const [currencyPickerOpen, setCurrencyPickerOpen] = useState(false)
	const [editingWalletId, setEditingWalletId] = useState<number | null>(null)
	const [editingWalletStatus, setEditingWalletStatus] = useState<WalletStatus>(WalletStatus.ACTIVE)
	const [selectedDebetOrCredit, setSelectedDebetOrCredit] = useState<WalletDebetOrCredit>(WalletDebetOrCredit.DEBET)

	const isEditing = editingWalletId !== null

	const currencyPickerOptions = useMemo(() => {
		if (!supportedCurrencies.length) {
			return currencyOptions
		}
		return supportedCurrencies.map(code => {
			const existing = currencyOptions.find(option => option.value === code)
			return existing ?? { value: code, label: `wallets.currency.${code.toLowerCase()}` }
		})
	}, [supportedCurrencies])

	const resetFormState = useCallback(() => {
		setName('')
		setCurrencyCode(defaultCurrencyCode)
		setBalance('')
		setFormError(null)
		setColorPickerOpen(false)
		setSelectedColor(colorOptions[0])
		setTypePickerOpen(false)
		setSelectedType(defaultWalletType)
		setCurrencyPickerOpen(false)
		setEditingWalletId(null)
		setEditingWalletStatus(WalletStatus.ACTIVE)
		setSelectedDebetOrCredit(WalletDebetOrCredit.DEBET)
	}, [defaultCurrencyCode])

	useEffect(() => {
		if (!open) {
			resetFormState()
		}
	}, [open, resetFormState])

	useEffect(() => {
		if (!open && !isEditing) {
			setCurrencyCode(defaultCurrencyCode)
		}
	}, [defaultCurrencyCode, isEditing, open])

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
					debetOrCredit: selectedDebetOrCredit,
				})
			} else {
				await createWallet({
					name: trimmedName,
					currencyCode: trimmedCurrency,
					balance: parsedBalance,
					color: selectedColor,
					type: selectedType,
					debetOrCredit: selectedDebetOrCredit,
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

	const handleArchive = async () => {
		if (!isEditing || editingWalletId === null) return

		try {
			await updateWalletStatus(editingWalletId, { status: WalletStatus.ARCHIVED })
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

	const handleAddWalletClick = useCallback(() => {
		resetFormState()
		setOpen(true)
	}, [resetFormState])

	const handleWalletClick = (wallet: Wallet) => {
		setEditingWalletId(wallet.id)
		setName(wallet.name)
		setCurrencyCode(wallet.currencyCode)
		setBalance(sanitizeDecimalInput(String(wallet.balance)))
		setSelectedColor(wallet.color || colorOptions[0])
		setSelectedType(wallet.type || defaultWalletType)
		setEditingWalletStatus(wallet.status || WalletStatus.ACTIVE)
		setSelectedDebetOrCredit(wallet.debetOrCredit ?? WalletDebetOrCredit.DEBET)
		setFormError(null)
		setColorPickerOpen(false)
		setCurrencyPickerOpen(false)
		setTypePickerOpen(false)
		setOpen(true)
	}

	const activeWallets = useMemo(() => wallets.filter(wallet => wallet.status === WalletStatus.ACTIVE), [wallets])
	const activeDebitWallets = useMemo(() => activeWallets.filter(wallet => wallet.debetOrCredit === WalletDebetOrCredit.DEBET), [activeWallets])
	const activeCreditWallets = useMemo(() => activeWallets.filter(wallet => wallet.debetOrCredit === WalletDebetOrCredit.CREDIT), [activeWallets])
	const hasDebitWallets = activeDebitWallets.length > 0
	const hasCreditWallets = activeCreditWallets.length > 0
	const firstSection = hasDebitWallets ? 'debit' : hasCreditWallets ? 'credit' : null
	const debitPages = useMemo(() => buildCarouselPages(activeDebitWallets, firstSection === 'debit'), [activeDebitWallets, firstSection])
	const creditPages = useMemo(() => buildCarouselPages(activeCreditWallets, firstSection === 'credit'), [activeCreditWallets, firstSection])
	const shouldRenderSkeleton = loading
	const shouldRenderEmptyState = !hasDebitWallets && !hasCreditWallets

	return (
		<>
			{shouldRenderSkeleton ? (
				<WalletsSkeleton />
			) : shouldRenderEmptyState ? (
				renderCarousel([[null]], 'empty', handleAddWalletClick, handleWalletClick)
			) : (
				<div className='flex flex-col gap-3'>
					{hasDebitWallets && (
						<section>
							<h2 className='mb-2 text-base font-medium tracking-wide text-text'>{t('wallets.section.debet')}</h2>
							{renderCarousel(debitPages, 'debit', handleAddWalletClick, handleWalletClick)}
						</section>
					)}
					{hasCreditWallets && (
						<section>
							<h2 className='mb-2 text-base font-medium tracking-wide text-text'>{t('wallets.section.credit')}</h2>
							{renderCarousel(creditPages, 'credit', handleAddWalletClick, handleWalletClick)}
						</section>
					)}
				</div>
			)}

			<WalletDrawer
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
				currencyOptions={currencyPickerOptions}
				onOpenCurrencyPicker={() => setCurrencyPickerOpen(true)}
				onOpenTypePicker={() => setTypePickerOpen(true)}
				selectedType={selectedType}
				onOpenColorPicker={() => setColorPickerOpen(true)}
				selectedColor={selectedColor}
				selectedDebetOrCredit={selectedDebetOrCredit}
				onDebetOrCreditChange={value => {
					setSelectedDebetOrCredit(value)
					setFormError(null)
				}}
				balance={balance}
				onBalanceChange={value => {
					setBalance(value)
					setFormError(null)
				}}
				error={formError}
				submitDisabled={submitDisabled}
				title={isEditing ? t('wallets.form.editTitle') : t('wallets.form.createTitle')}
				submitLabel={isEditing ? t('wallets.form.save') : t('wallets.form.ready')}
				onArchive={isEditing ? handleArchive : undefined}
				disableArchive={actionLoading}
				walletStatus={isEditing ? editingWalletStatus : undefined}
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
				onOpenCustomPicker={() => setCustomColorPickerOpen(true)}
			/>

			<CurrencyPickerDrawer
				open={currencyPickerOpen}
				onClose={() => setCurrencyPickerOpen(false)}
				options={currencyPickerOptions}
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

			<CustomColorPickerDrawer
				open={customColorPickerOpen}
				onClose={() => setCustomColorPickerOpen(false)}
				initialColor={selectedColor}
				onSelect={color => {
					setSelectedColor(color)
					setCustomColorPickerOpen(false)
					setColorPickerOpen(false)
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

function buildCarouselPages(wallets: Wallet[], appendAddCard: boolean): Array<Array<Wallet | null>> {
	const items: Array<Wallet | null> = appendAddCard ? [...wallets, null] : [...wallets]
	const result: Array<Array<Wallet | null>> = []

	for (let index = 0; index < items.length; index += 2) {
		result.push(items.slice(index, index + 2))
	}

	return result
}

function renderCarousel(
	pages: Array<Array<Wallet | null>>,
	keyPrefix: string,
	onAddWalletClick: () => void,
	onWalletClick: (wallet: Wallet) => void
) {
	return (
		<Carousel pageClassName='grid grid-cols-2 gap-[10px]' dots>
			{pages.map((page, pageIndex) => (
				<div key={`${keyPrefix}-page-${pageIndex}`}>
					{page.map((item, itemIndex) => {
						if (!item && item !== null) {
							return null
						}

						if (item === null) {
							return <AddWalletCard key={`${keyPrefix}-add-${pageIndex}-${itemIndex}`} onClick={onAddWalletClick} />
						}

						return (
							<WalletCard
								key={item.id}
								name={item.name}
								balance={item.balance}
								currencyCode={item.currencyCode}
								color={item.color}
								type={item.type}
								onClick={() => onWalletClick(item)}
							/>
						)
					})}
				</div>
			))}
		</Carousel>
	)
}
