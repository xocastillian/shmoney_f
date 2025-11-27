import type { Setting } from '@/types/entities/setting'
import { FolderHeart, Languages, SunMoon } from 'lucide-react'

interface SettingsOptions {
	onCategoriesPress: () => void
	onLanguagePress: () => void
}

export const createSettings = ({ onCategoriesPress, onLanguagePress }: SettingsOptions): Setting[] => [
	{
		title: 'Категории',
		onClick: onCategoriesPress,
		icon: FolderHeart,
	},
	{
		title: 'Язык',
		onClick: onLanguagePress,
		icon: Languages,
	},
	{
		title: 'Тема',
		onClick: () => {},
		icon: SunMoon,
		disabled: true,
	},
]
