import { cn } from '@/lib/utils'
import './Loader.css'

interface LoaderProps {
	className?: string
	color?: string
	size?: number
}

const Loader = ({ className, color = 'var(--accent)', size = 40 }: LoaderProps) => {
	return (
		<div
			className={cn('loader-jelly', className)}
			role='status'
			aria-label='Загрузка'
			style={{ ['--loader-size' as string]: `${size}px`, ['--loader-color' as string]: color }}
		>
			<div className='loader-jelly-core' />
			<svg width='0' height='0' className='loader-jelly-maker' aria-hidden='true' focusable='false'>
				<defs>
					<filter id='loader-jelly-ooze'>
						<feGaussianBlur in='SourceGraphic' stdDeviation='6.25' result='blur' />
						<feColorMatrix in='blur' mode='matrix' values='1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7' result='ooze' />
						<feBlend in='SourceGraphic' in2='ooze' />
					</filter>
				</defs>
			</svg>
		</div>
	)
}

export default Loader
