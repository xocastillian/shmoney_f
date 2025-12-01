import type { Setting } from '@/types/entities/setting'
import { BanknoteX, FolderHeart, Languages } from 'lucide-react'
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
				title: t('settings.archivedWallets'),
				onClick: onArchivedWalletsPress,
				icon: BanknoteX,
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
