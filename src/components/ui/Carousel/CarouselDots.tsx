import { cn } from '@/lib/utils'

interface CarouselDotsProps {
	count: number
	activeIndex: number
	onSelect?: (index: number) => void
}

export const CarouselDots = ({ count, activeIndex, onSelect }: CarouselDotsProps) => {
	if (count <= 1) {
		return null
	}

	return (
		<div className='flex items-center justify-center gap-2'>
			{Array.from({ length: count }).map((_, index) => {
				const isActive = index === activeIndex

				return (
					<button
						key={`carousel-dot-${index}`}
						type='button'
						aria-label={`Перейти к блоку ${index + 1}`}
						className={cn(
							'h-1 w-2.5 rounded-full transition-all duration-200',
							isActive ? 'bg-accent-orange scale-110' : 'bg-background-muted opacity-70 hover:opacity-100'
						)}
						onClick={() => onSelect?.(index)}
					/>
				)
			})}
		</div>
	)
}
