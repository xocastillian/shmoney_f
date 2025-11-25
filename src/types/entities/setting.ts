import type { LucideProps } from 'lucide-react'

type IconComponent = React.ComponentType<LucideProps>

export type Setting = {
	title: string
	onClick: () => void
	icon?: IconComponent
	disabled?: boolean
}
