import type { Setting } from '@/types/entities/setting'
import { FolderHeart, Languages, SunMoon } from 'lucide-react'
import { useTranslation } from '@/i18n'
import { useMemo } from 'react'

interface SettingsOptions {
	onCategoriesPress: () => void
	onLanguagePress: () => void
}

export const useSettingsList = ({ onCategoriesPress, onLanguagePress }: SettingsOptions): Setting[] => {
	const { t } = useTranslation()

	return useMemo(
		() => [
			{
				title: t('settings.categories'),
				onClick: onCategoriesPress,
				icon: FolderHeart,
			},
			{
				title: t('settings.language'),
				onClick: onLanguagePress,
				icon: Languages,
			},
			{
				title: t('settings.theme'),
				onClick: () => {},
				icon: SunMoon,
				disabled: true,
			},
		],
		[onCategoriesPress, onLanguagePress, t]
	)
}
