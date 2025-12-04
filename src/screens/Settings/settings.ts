import type { Setting } from '@/types/entities/setting'
import { CircleDollarSign, FolderHeart, Languages, Wallet } from 'lucide-react'
import { useTranslation } from '@/i18n'
import { useMemo } from 'react'

interface SettingsOptions {
	onCategoriesPress: () => void
	onLanguagePress: () => void
	onCurrencyPress: () => void
	onArchivedWalletsPress: () => void
	languageValue?: string
	currencyValue?: string
}

export const useSettingsList = ({
	onCategoriesPress,
	onLanguagePress,
	onCurrencyPress,
	onArchivedWalletsPress,
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
		[onArchivedWalletsPress, onCategoriesPress, onCurrencyPress, onLanguagePress, currencyValue, languageValue, t]
	)
}
