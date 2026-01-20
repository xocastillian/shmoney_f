import type { Setting } from '@/types/entities/setting'
import { CircleDollarSign, FolderHeart, Languages, Wallet, UserRound } from 'lucide-react'
import { useTranslation } from '@/i18n'
import { useMemo } from 'react'

interface SettingsOptions {
	onCategoriesPress: () => void
	onLanguagePress: () => void
	onCurrencyPress: () => void
	onArchivedWalletsPress: () => void
	onDebtorsPress: () => void
	languageValue?: string
	currencyValue?: string
}

export const useSettingsList = ({
	onCategoriesPress,
	onLanguagePress,
	onCurrencyPress,
	onArchivedWalletsPress,
	onDebtorsPress,
	languageValue,
	currencyValue,
}: SettingsOptions): Setting[] => {
	const { t } = useTranslation()

	return useMemo(
		() => [
			{
				title: t('settings.mainCurrency'),
				onClick: onCurrencyPress,
				icon: CircleDollarSign,
				value: currencyValue,
			},
			{
				title: t('settings.categories'),
				onClick: onCategoriesPress,
				icon: FolderHeart,
			},
			{
				title: t('settings.debtors'),
				onClick: onDebtorsPress,
				icon: UserRound,
			},
			{
				title: t('settings.wallets'),
				onClick: onArchivedWalletsPress,
				icon: Wallet,
			},
			{
				title: t('settings.language'),
				onClick: onLanguagePress,
				icon: Languages,
				value: languageValue,
			},
		],
		[onArchivedWalletsPress, onCategoriesPress, onCurrencyPress, onDebtorsPress, onLanguagePress, currencyValue, languageValue, t]
	)
}
