import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import type { Category } from '@/types/entities/category'
import SettingsItem from '@/components/SettingsItem/SettingsItem'
import CategoriesDrawer from '@/widgets/Categories/components/CategoriesDrawer'
import AddOrEditCategoryDrawer from '@/widgets/Categories/components/AddOrEditCategoryDrawer'
import { useSettingsList } from './settings'
import { useCategories } from '@/hooks/useCategories'
import LanguageSettingsDrawer from './components/LanguageSettingsDrawer'
import { useSettings } from '@/hooks/useSettings'
import { useTranslation } from '@/i18n'
import { useWallets } from '@/hooks/useWallets'
import { WalletStatus, WalletType } from '@/types/entities/wallet'
import WalletsDrawer from '@/widgets/Wallets/components/WalletsDrawer'
import WalletFormDrawer from '@/widgets/Wallets/components/WalletFormDrawer'
import { ColorPickerDrawer } from '@/widgets/Wallets/components/ColorPickerDrawer'
import { TypePickerDrawer } from '@/widgets/Wallets/components/TypePickerDrawer'
import { CurrencyPickerDrawer } from '@/widgets/Wallets/components/CurrencyPickerDrawer'
import { colorOptions, currencyOptions } from '@/widgets/Wallets/constants'
import { sanitizeDecimalInput } from '@/utils/number'
import { SettingsIcon } from 'lucide-react'

const defaultWalletType = WalletType.CASH

const SettingsScreen = () => {
	const [isCategoriesDrawerOpen, setCategoriesDrawerOpen] = useState(false)
	const [isAddCategoryDrawerOpen, setAddCategoryDrawerOpen] = useState(false)
	const [isLanguageDrawerOpen, setLanguageDrawerOpen] = useState(false)
	const [isArchivedWalletsDrawerOpen, setArchivedWalletsDrawerOpen] = useState(false)
	const [editingCategory, setEditingCategory] = useState<Category | null>(null)
	const [isWalletFormOpen, setWalletFormOpen] = useState(false)
	const [editingWalletId, setEditingWalletId] = useState<number | null>(null)
	const [walletFormName, setWalletFormName] = useState('')
	const [walletFormCurrencyCode, setWalletFormCurrencyCode] = useState(currencyOptions[0].value)
	const [walletFormBalance, setWalletFormBalance] = useState('')
	const [walletFormColor, setWalletFormColor] = useState(colorOptions[0])
	const [walletFormType, setWalletFormType] = useState<WalletType>(defaultWalletType)
	const [walletFormError, setWalletFormError] = useState<string | null>(null)
	const [walletFormStatus, setWalletFormStatus] = useState<WalletStatus>(WalletStatus.ACTIVE)
	const [colorPickerOpen, setColorPickerOpen] = useState(false)
	const [typePickerOpen, setTypePickerOpen] = useState(false)
	const [currencyPickerOpen, setCurrencyPickerOpen] = useState(false)
	const { actionLoading: categoriesSubmitting } = useCategories()
	const { supportedLanguages, language, loading: settingsLoading, error: settingsError, changeLanguage } = useSettings()
	const {
		wallets,
		loading: walletsLoading,
		fetchWallets,
		fetchWalletBalances,
		updateWalletStatus,
		updateWallet,
		createWallet,
		actionLoading,
	} = useWallets()
	const { t } = useTranslation()

	const openCategoriesDrawer = useCallback(() => setCategoriesDrawerOpen(true), [])
	const closeCategoriesDrawer = useCallback(() => setCategoriesDrawerOpen(false), [])
	const openLanguageDrawer = useCallback(() => setLanguageDrawerOpen(true), [])
	const closeLanguageDrawer = useCallback(() => setLanguageDrawerOpen(false), [])
	const openArchivedWalletsDrawer = useCallback(() => setArchivedWalletsDrawerOpen(true), [])
	const closeArchivedWalletsDrawer = useCallback(() => setArchivedWalletsDrawerOpen(false), [])

	const settings = useSettingsList({
		onCategoriesPress: openCategoriesDrawer,
		onLanguagePress: openLanguageDrawer,
		onArchivedWalletsPress: openArchivedWalletsDrawer,
	})

	const refreshWalletBalances = useCallback(() => {
		void fetchWalletBalances().catch(() => undefined)
	}, [fetchWalletBalances])

	useEffect(() => {
		if (!isArchivedWalletsDrawerOpen || wallets.length > 0) {
			return
		}
		void fetchWallets().catch(() => undefined)
	}, [isArchivedWalletsDrawerOpen, wallets.length, fetchWallets])

	const walletFormSubmitDisabled = useMemo(() => {
		const trimmedName = walletFormName.trim()
		const trimmedCurrency = walletFormCurrencyCode.trim()
		const sanitizedBalance = sanitizeDecimalInput(walletFormBalance)
		const parsedBalance = sanitizedBalance.length > 0 ? Number.parseFloat(sanitizedBalance) : NaN
		const balanceValid = sanitizedBalance.length > 0 && !Number.isNaN(parsedBalance) && parsedBalance >= 0

		return actionLoading || trimmedName.length === 0 || trimmedCurrency.length === 0 || !balanceValid
	}, [actionLoading, walletFormBalance, walletFormCurrencyCode, walletFormName])

	const handleWalletClick = useCallback(
		(walletId: number) => {
			const wallet = wallets.find(item => item.id === walletId)
			if (!wallet) return
			setEditingWalletId(wallet.id)
			setWalletFormName(wallet.name)
			setWalletFormCurrencyCode(wallet.currencyCode)
			setWalletFormBalance(sanitizeDecimalInput(String(wallet.balance)))
			setWalletFormColor(wallet.color || colorOptions[0])
			setWalletFormType(wallet.type || defaultWalletType)
			setWalletFormStatus(wallet.status || WalletStatus.ACTIVE)
			setWalletFormError(null)
			setWalletFormOpen(true)
		},
		[wallets]
	)

	const handleAddWallet = useCallback(() => {
		setEditingWalletId(null)
		setWalletFormName('')
		setWalletFormCurrencyCode(currencyOptions[0].value)
		setWalletFormBalance('')
		setWalletFormColor(colorOptions[0])
		setWalletFormType(defaultWalletType)
		setWalletFormStatus(WalletStatus.ACTIVE)
		setWalletFormError(null)
		setWalletFormOpen(true)
		setArchivedWalletsDrawerOpen(false)
	}, [])

	const closeWalletForm = useCallback(() => {
		setWalletFormOpen(false)
		setEditingWalletId(null)
		setWalletFormStatus(WalletStatus.ACTIVE)
	}, [])

	useEffect(() => {
		if (!isWalletFormOpen) {
			setColorPickerOpen(false)
			setCurrencyPickerOpen(false)
			setTypePickerOpen(false)
		}
	}, [isWalletFormOpen])

	const handleWalletFormSubmit = useCallback(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault()
			const trimmedName = walletFormName.trim()
			const trimmedCurrency = walletFormCurrencyCode.trim().toUpperCase()
			const sanitizedBalance = sanitizeDecimalInput(walletFormBalance)
			const parsedBalance = sanitizedBalance.length > 0 ? Number.parseFloat(sanitizedBalance) : NaN

			if (trimmedName.length === 0) {
				setWalletFormError(t('wallets.form.errors.nameRequired'))
				return
			}

			if (trimmedCurrency.length === 0) {
				setWalletFormError(t('wallets.form.errors.currencyRequired'))
				return
			}

			if (Number.isNaN(parsedBalance)) {
				setWalletFormError(t('wallets.form.errors.balanceInvalid'))
				return
			}

			if (parsedBalance < 0) {
				setWalletFormError(t('wallets.form.errors.balanceNegative'))
				return
			}

			try {
				if (editingWalletId) {
					await updateWallet(editingWalletId, {
						name: trimmedName,
						currencyCode: trimmedCurrency,
						balance: parsedBalance,
						color: walletFormColor,
						type: walletFormType,
					})
				} else {
					await createWallet({
						name: trimmedName,
						currencyCode: trimmedCurrency,
						balance: parsedBalance,
						color: walletFormColor,
						type: walletFormType,
					})
				}
				setWalletFormError(null)
				refreshWalletBalances()
				closeWalletForm()
			} catch (err) {
				const message = err instanceof Error ? err.message : t('wallets.errors.saveFailed')
				setWalletFormError(message)
			}
		},
		[
			closeWalletForm,
			createWallet,
			editingWalletId,
			refreshWalletBalances,
			t,
			updateWallet,
			walletFormBalance,
			walletFormColor,
			walletFormCurrencyCode,
			walletFormName,
			walletFormType,
		]
	)

	const handleWalletArchiveToggle = useCallback(async () => {
		if (!editingWalletId) return
		const nextStatus = walletFormStatus === WalletStatus.ARCHIVED ? WalletStatus.ACTIVE : WalletStatus.ARCHIVED
		try {
			await updateWalletStatus(editingWalletId, { status: nextStatus })
			setWalletFormStatus(nextStatus)
			setWalletFormError(null)
			refreshWalletBalances()
			closeWalletForm()
		} catch (err) {
			const message = err instanceof Error ? err.message : t('wallets.errors.saveFailed')
			setWalletFormError(message)
		}
	}, [closeWalletForm, editingWalletId, refreshWalletBalances, t, updateWalletStatus, walletFormStatus])

	const handleSelectCategory = useCallback((category: Category) => {
		setEditingCategory(category)
		setAddCategoryDrawerOpen(true)
	}, [])

	const handleAddCategory = useCallback(() => {
		setEditingCategory(null)
		setAddCategoryDrawerOpen(true)
	}, [])

	const closeAddCategoryDrawer = useCallback(() => {
		setEditingCategory(null)
		setAddCategoryDrawerOpen(false)
	}, [])

	const handleSubmitCategory = useCallback(() => {
		setEditingCategory(null)
		setAddCategoryDrawerOpen(false)
	}, [])

	const handleSelectLanguage = useCallback(
		async (nextLanguage: string) => {
			try {
				await changeLanguage(nextLanguage)
				setLanguageDrawerOpen(false)
			} catch {
				// errors handled in useSettings
			}
		},
		[changeLanguage]
	)

	return (
		<>
			<div className='p-3 flex items-center justify-between'>
				<h1 className='text-lg font-medium'>{t('settings.title')}</h1>

				<div className='p-2'>
					<SettingsIcon className='h-6 w-6' />
				</div>
			</div>

			<div className='border-t border-divider'>
				{settings.map(setting => (
					<SettingsItem key={setting.title} setting={setting} />
				))}
			</div>

			<CategoriesDrawer open={isCategoriesDrawerOpen} onClose={closeCategoriesDrawer} onSelect={handleSelectCategory} onAdd={handleAddCategory} />

			<AddOrEditCategoryDrawer
				open={isAddCategoryDrawerOpen}
				onClose={closeAddCategoryDrawer}
				initialCategory={editingCategory ?? undefined}
				onSubmit={handleSubmitCategory}
				submitting={categoriesSubmitting}
				title={editingCategory ? t('categories.drawer.editTitle') : t('categories.drawer.newTitle')}
			/>

			<LanguageSettingsDrawer
				open={isLanguageDrawerOpen}
				onClose={closeLanguageDrawer}
				languages={supportedLanguages}
				selectedLanguage={language}
				loading={settingsLoading}
				error={settingsError}
				onSelect={handleSelectLanguage}
			/>

			<WalletsDrawer
				open={isArchivedWalletsDrawerOpen}
				onClose={closeArchivedWalletsDrawer}
				title={t('settings.archivedWallets')}
				wallets={wallets}
				selectedWalletId={editingWalletId}
				onSelect={handleWalletClick}
				emptyStateLabel={t('settings.archivedWallets.empty')}
				loading={walletsLoading}
				showAllOption={false}
				showAddButton
				onAdd={handleAddWallet}
			/>

			<WalletFormDrawer
				open={isWalletFormOpen}
				onClose={closeWalletForm}
				onSubmit={handleWalletFormSubmit}
				name={walletFormName}
				onNameChange={value => {
					setWalletFormName(value)
					setWalletFormError(null)
				}}
				currencyCode={walletFormCurrencyCode}
				currencyOptions={currencyOptions}
				onOpenCurrencyPicker={() => setCurrencyPickerOpen(true)}
				onOpenTypePicker={() => setTypePickerOpen(true)}
				selectedType={walletFormType}
				onOpenColorPicker={() => setColorPickerOpen(true)}
				selectedColor={walletFormColor}
				balance={walletFormBalance}
				onBalanceChange={value => {
					setWalletFormBalance(value)
					setWalletFormError(null)
				}}
				error={walletFormError}
				submitDisabled={walletFormSubmitDisabled}
				title={t('wallets.form.editTitle')}
				submitLabel={t('wallets.form.save')}
				submitting={actionLoading}
				onArchive={editingWalletId ? handleWalletArchiveToggle : undefined}
				disableArchive={actionLoading}
				walletStatus={walletFormStatus}
			/>

			<ColorPickerDrawer
				open={colorPickerOpen}
				onClose={() => setColorPickerOpen(false)}
				colors={colorOptions}
				selectedColor={walletFormColor}
				onSelect={color => {
					setWalletFormColor(color)
					setColorPickerOpen(false)
					setWalletFormError(null)
				}}
			/>

			<CurrencyPickerDrawer
				open={currencyPickerOpen}
				onClose={() => setCurrencyPickerOpen(false)}
				options={currencyOptions}
				selectedCode={walletFormCurrencyCode}
				onSelect={code => {
					setWalletFormCurrencyCode(code)
					setCurrencyPickerOpen(false)
					setWalletFormError(null)
				}}
			/>

			<TypePickerDrawer
				open={typePickerOpen}
				onClose={() => setTypePickerOpen(false)}
				selectedType={walletFormType}
				onSelect={type => {
					setWalletFormType(type)
					setTypePickerOpen(false)
					setWalletFormError(null)
				}}
			/>
		</>
	)
}

export default SettingsScreen
