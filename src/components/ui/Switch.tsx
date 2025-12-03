import { cn } from '@/lib/utils'

interface SwitchProps {
	checked: boolean
	onChange: (value: boolean) => void
	label?: string
	className?: string
	disabled?: boolean
}

export const Switch = ({ checked, onChange, label, className, disabled = false }: SwitchProps) => {
	return (
		<button
			type='button'
			onClick={() => {
				if (!disabled) onChange(!checked)
			}}
			className={cn('p-5 -m-5 disabled:cursor-not-allowed disabled:text-disable', className)}
			disabled={disabled}
		>
			<span className='flex h-5 w-10 items-center rounded-full bg-divider p-0.5'>
				<span
					className={cn(
						'h-4 w-4 rounded-full transition-transform',
						checked ? 'translate-x-5' : 'translate-x-0',
						disabled ? 'bg-disable' : checked ? 'bg-accent' : 'bg-text'
					)}
				/>
			</span>
			{label && <span className='text-sm text-text'>{label}</span>}
		</button>
	)
}

export default Switch
