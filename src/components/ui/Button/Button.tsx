import type { FC } from 'react'

interface ButtonProps {
	text: string
	onClick?: () => void
}

const Button: FC<ButtonProps> = ({ text, onClick }) => {
	return (
		<button
			className='rounded-md px-4 py-2 text-sm font-medium bg-accent-orange text-text-dark disabled:bg-background-muted disabled:text-accent-orange disabled:opacity-50 transition-colors duration-300 ease-in-out'
			onClick={onClick}
		>
			{text}
		</button>
	)
}

export default Button
