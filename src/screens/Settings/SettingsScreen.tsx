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
import WalletDrawer from '@/widgets/Wallets/components/WalletDrawer'
import { ColorPickerDrawer } from '@/widgets/Wallets/components/ColorPickerDrawer'
import { TypePickerDrawer } from '@/widgets/Wallets/components/TypePickerDrawer'
import { CurrencyPickerDrawer } from '@/widgets/Wallets/components/CurrencyPickerDrawer'
import { colorOptions, currencyOptions } from '@/widgets/Wallets/constants'
import { sanitizeDecimalInput } from '@/utils/number'
import { useAnalytics } from '@/hooks/useAnalytics'

const defaultWalletType = WalletType.CASH
const fallbackCurrencyCode = currencyOptions[0]?.value ?? 'USD'

const SettingsScreen = () => {
	const [isCategoriesDrawerOpen, setCategoriesDrawerOpen] = useState(false)
	const [isAddCategoryDrawerOpen, setAddCategoryDrawerOpen] = useState(false)
	const [isLanguageDrawerOpen, setLanguageDrawerOpen] = useState(false)
	const [isCurrencyDrawerOpen, setCurrencyDrawerOpen] = useState(false)
	const [isArchivedWalletsDrawerOpen, setArchivedWalletsDrawerOpen] = useState(false)
	const [editingCategory, setEditingCategory] = useState<Category | null>(null)
	const [isWalletFormOpen, setWalletFormOpen] = useState(false)
	const [editingWalletId, setEditingWalletId] = useState<number | null>(null)
	const [walletFormName, setWalletFormName] = useState('')
	const [walletFormCurrencyCode, setWalletFormCurrencyCode] = useState(fallbackCurrencyCode)
	const [walletFormBalance, setWalletFormBalance] = useState('')
	const [walletFormColor, setWalletFormColor] = useState(colorOptions[0])
	const [walletFormType, setWalletFormType] = useState<WalletType>(defaultWalletType)
	const [walletFormError, setWalletFormError] = useState<string | null>(null)
	const [walletFormStatus, setWalletFormStatus] = useState<WalletStatus>(WalletStatus.ACTIVE)
	const [colorPickerOpen, setColorPickerOpen] = useState(false)
	const [typePickerOpen, setTypePickerOpen] = useState(false)
	const [walletCurrencyPickerOpen, setWalletCurrencyPickerOpen] = useState(false)
	const { actionLoading: categoriesSubmitting } = useCategories()
	const {
		supportedLanguages,
		supportedCurrencies,
		mainCurrency,
		language,
		loading: settingsLoading,
		error: settingsError,
		changeLanguage,
		changeMainCurrency,
	} = useSettings()
	const currencyPickerOptions = useMemo(() => {
		if (!supportedCurrencies.length) {
			return currencyOptions
		}
		return supportedCurrencies.map(code => {
			const existing = currencyOptions.find(option => option.value === code)
			return existing ?? { value: code, label: `wallets.currency.${code.toLowerCase()}` }
		})
	}, [supportedCurrencies])
	const defaultCurrencyCode = useMemo(() => mainCurrency ?? supportedCurrencies[0] ?? fallbackCurrencyCode, [mainCurrency, supportedCurrencies])
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
	const { fetchAnalytics: refreshAnalytics } = useAnalytics()
	const { t } = useTranslation()

	const openCategoriesDrawer = useCallback(() => setCategoriesDrawerOpen(true), [])
	const closeCategoriesDrawer = useCallback(() => setCategoriesDrawerOpen(false), [])
	const openLanguageDrawer = useCallback(() => setLanguageDrawerOpen(true), [])
	const closeLanguageDrawer = useCallback(() => setLanguageDrawerOpen(false), [])
	const openCurrencyDrawer = useCallback(() => setCurrencyDrawerOpen(true), [])
	const closeCurrencyDrawer = useCallback(() => setCurrencyDrawerOpen(false), [])
	const openArchivedWalletsDrawer = useCallback(() => setArchivedWalletsDrawerOpen(true), [])
	const closeArchivedWalletsDrawer = useCallback(() => setArchivedWalletsDrawerOpen(false), [])
	const currencyLabel = useMemo(() => {
		const code = mainCurrency ?? defaultCurrencyCode
		if (!code) return undefined
		const option = currencyPickerOptions.find(item => item.value === code)
		return option ? t(option.label) : code
	}, [currencyPickerOptions, defaultCurrencyCode, mainCurrency, t])
	const languageLabel = useMemo(() => (language ? language.toUpperCase() : undefined), [language])

	const settings = useSettingsList({
		onCategoriesPress: openCategoriesDrawer,
		onLanguagePress: openLanguageDrawer,
		onCurrencyPress: openCurrencyDrawer,
		onArchivedWalletsPress: openArchivedWalletsDrawer,
		currencyValue: currencyLabel,
		languageValue: languageLabel,
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
		setWalletFormCurrencyCode(defaultCurrencyCode)
		setWalletFormBalance('')
		setWalletFormColor(colorOptions[0])
		setWalletFormType(defaultWalletType)
		setWalletFormStatus(WalletStatus.ACTIVE)
		setWalletFormError(null)
		setWalletFormOpen(true)
		setArchivedWalletsDrawerOpen(false)
	}, [defaultCurrencyCode])

	const closeWalletForm = useCallback(() => {
		setWalletFormOpen(false)
		setEditingWalletId(null)
		setWalletFormStatus(WalletStatus.ACTIVE)
	}, [])

	useEffect(() => {
		if (!isWalletFormOpen) {
			setColorPickerOpen(false)
			setWalletCurrencyPickerOpen(false)
			setTypePickerOpen(false)
		}
	}, [isWalletFormOpen])

	useEffect(() => {
		if (!isWalletFormOpen && editingWalletId === null) {
			setWalletFormCurrencyCode(defaultCurrencyCode)
		}
	}, [defaultCurrencyCode, editingWalletId, isWalletFormOpen])

	const handleSelectMainCurrency = useCallback(
		async (code: string) => {
			try {
				await changeMainCurrency(code)
				setCurrencyDrawerOpen(false)
			} catch {
				// errors handled in hook
			}
		},
		[changeMainCurrency]
	)

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
		void refreshAnalytics().catch(() => undefined)
	}, [refreshAnalytics])

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

			<CurrencyPickerDrawer
				open={isCurrencyDrawerOpen}
				onClose={closeCurrencyDrawer}
				options={currencyPickerOptions}
				selectedCode={mainCurrency ?? defaultCurrencyCode}
				onSelect={handleSelectMainCurrency}
				loading={settingsLoading}
			/>

			<WalletsDrawer
				open={isArchivedWalletsDrawerOpen}
				onClose={closeArchivedWalletsDrawer}
				title={t('settings.wallets')}
				wallets={wallets}
				selectedWalletId={editingWalletId}
				onSelect={handleWalletClick}
				emptyStateLabel={t('settings.wallets.empty')}
				loading={walletsLoading}
				showAllOption={false}
				showAddButton
				onAdd={handleAddWallet}
			/>

			<WalletDrawer
				open={isWalletFormOpen}
				onClose={closeWalletForm}
				onSubmit={handleWalletFormSubmit}
				name={walletFormName}
				onNameChange={value => {
					setWalletFormName(value)
					setWalletFormError(null)
				}}
				currencyCode={walletFormCurrencyCode}
				currencyOptions={currencyPickerOptions}
				onOpenCurrencyPicker={() => setWalletCurrencyPickerOpen(true)}
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
				open={walletCurrencyPickerOpen}
				onClose={() => setWalletCurrencyPickerOpen(false)}
				options={currencyPickerOptions}
				selectedCode={walletFormCurrencyCode}
				onSelect={code => {
					setWalletFormCurrencyCode(code)
					setWalletCurrencyPickerOpen(false)
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
