import { cn } from '@/lib/utils'

interface SwitchProps {
	checked: boolean
	onChange: (value: boolean) => void
	label?: string
	className?: string
}

export const Switch = ({ checked, onChange, label, className }: SwitchProps) => {
	return (
		<button type='button' onClick={() => onChange(!checked)} className={cn('p-5 -m-5', className)}>
			<span className='flex h-5 w-10 items-center rounded-full bg-divider p-0.5'>
				<span className={cn('h-4 w-4 rounded-full bg-text transition-transform', checked ? 'translate-x-5 bg-accent' : 'translate-x-0')} />
			</span>
			{label && <span className='text-sm text-text'>{label}</span>}
		</button>
	)
}

export default Switch
