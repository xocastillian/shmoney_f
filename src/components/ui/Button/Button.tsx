import type { FC } from 'react'

interface ButtonProps {
	text: string
	onClick?: () => void
	className?: string
}

const Button: FC<ButtonProps> = ({ text, onClick, className }) => {
	return (
		<button
			className={`rounded-lg px-4 py-2 text-sm font-medium bg-accent text-text-dark disabled:bg-background-muted disabled:text-accent disabled:opacity-50 transition-colors duration-300 ease-in-out w-full ${className}`}
			onClick={onClick}
		>
			{text}
		</button>
	)
}

export default Button
