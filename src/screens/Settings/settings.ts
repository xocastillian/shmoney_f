import type { Setting } from '@/types/entities/setting'
import { FolderHeart, Languages, SunMoon } from 'lucide-react'

interface SettingsOptions {
	onCategoriesPress: () => void
}

export const createSettings = ({ onCategoriesPress }: SettingsOptions): Setting[] => [
	{
		title: 'Категории',
		onClick: onCategoriesPress,
		icon: FolderHeart,
	},
	{
		title: 'Тема',
		onClick: () => {},
		icon: SunMoon,
		disabled: true,
	},
	{
		title: 'Язык',
		onClick: () => {},
		icon: Languages,
		disabled: true,
	},
]
