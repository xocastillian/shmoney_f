import type { Setting } from '@/types/entities/setting'
import { FolderHeart, Languages, Wallet } from 'lucide-react'
import { useTranslation } from '@/i18n'
import { useMemo } from 'react'

interface SettingsOptions {
	onCategoriesPress: () => void
	onLanguagePress: () => void
	onArchivedWalletsPress: () => void
}

export const useSettingsList = ({ onCategoriesPress, onLanguagePress, onArchivedWalletsPress }: SettingsOptions): Setting[] => {
	const { t } = useTranslation()

	return useMemo(
		() => [
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
			},
		],
		[onCategoriesPress, onLanguagePress, onArchivedWalletsPress, t]
	)
}
