import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { CarouselDots } from './CarouselDots'

interface CarouselProps {
	children: ReactNode
	className?: string
	contentClassName?: string
	pageClassName?: string
	snapAlignment?: 'start' | 'center' | 'end'
	dots?: boolean
}

export const Carousel = ({ children, className, contentClassName, pageClassName, snapAlignment = 'start', dots = true }: CarouselProps) => {
	const pages = useMemo(() => Children.toArray(children), [children])
	const pageCount = pages.length
	const [activeIndex, setActiveIndex] = useState(0)
	const activeIndexRef = useRef(0)
	const scrollContainerRef = useRef<HTMLDivElement>(null)

	const scrollToPage = useCallback(
		(index: number) => {
			const container = scrollContainerRef.current
			if (!container || pageCount === 0) return

			const clampedIndex = Math.max(0, Math.min(index, pageCount - 1))

			activeIndexRef.current = clampedIndex
			setActiveIndex(clampedIndex)

			const target = clampedIndex * container.clientWidth

			container.scrollTo({
				left: target,
				behavior: 'smooth',
			})
		},
		[pageCount]
	)

	useEffect(() => {
		const container = scrollContainerRef.current
		if (!container) return

		const handleScroll = () => {
			if (container.clientWidth === 0) return

			const newIndex = Math.round(container.scrollLeft / container.clientWidth)

			if (newIndex !== activeIndexRef.current) {
				activeIndexRef.current = newIndex
				setActiveIndex(newIndex)
			}
		}

		container.addEventListener('scroll', handleScroll)
		handleScroll()

		return () => {
			container.removeEventListener('scroll', handleScroll)
		}
	}, [pageCount])

	useEffect(() => {
		if (pageCount === 0) {
			activeIndexRef.current = 0
			setActiveIndex(0)
			return
		}

		const maxIndex = pageCount - 1
		const currentIndex = activeIndexRef.current

		if (currentIndex > maxIndex) {
			scrollToPage(maxIndex)
		} else {
			scrollToPage(currentIndex)
		}
	}, [pageCount, scrollToPage])

	const handleWheel = useCallback(
		(event: WheelEvent) => {
			const container = scrollContainerRef.current
			if (!container || pageCount <= 1) return
			if (container.scrollWidth <= container.clientWidth) return

			if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return

			event.preventDefault()

			if (event.deltaY > 0 && activeIndexRef.current < pageCount - 1) {
				scrollToPage(activeIndexRef.current + 1)
			} else if (event.deltaY < 0 && activeIndexRef.current > 0) {
				scrollToPage(activeIndexRef.current - 1)
			}
		},
		[pageCount, scrollToPage]
	)

	useEffect(() => {
		const container = scrollContainerRef.current
		if (!container) return

		container.addEventListener('wheel', handleWheel, { passive: false })

		return () => {
			container.removeEventListener('wheel', handleWheel)
		}
	}, [handleWheel])

	const processedPages = useMemo(() => {
		const snapAlignmentClass = snapAlignment === 'center' ? 'snap-center' : snapAlignment === 'end' ? 'snap-end' : 'snap-start'

		return pages.map((page, index) => {
			const key = (isValidElement(page) && page.key) || index
			const combinedClassName = cn('flex-none w-full snap-always', snapAlignmentClass, pageClassName)

			if (isValidElement(page)) {
				const element = page as ReactElement<{ className?: string }>
				return cloneElement(element, {
					key,
					className: cn(combinedClassName, element.props.className),
				})
			}

			return (
				<div key={key} className={combinedClassName}>
					{page}
				</div>
			)
		})
	}, [pageClassName, pages, snapAlignment])

	return (
		<>
			<div
				ref={scrollContainerRef}
				className={cn(
					'overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden',
					className
				)}
			>
				<div className={cn('flex gap-[10px]', contentClassName)}>{processedPages}</div>
			</div>

			{dots && <CarouselDots count={pageCount} activeIndex={activeIndex} onSelect={scrollToPage} className={'mt-3'} />}
		</>
	)
}
