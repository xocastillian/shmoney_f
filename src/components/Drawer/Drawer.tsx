import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface DrawerProps {
	open: boolean
	onClose: () => void
	children: ReactNode
	className?: string
	overlayClassName?: string
	swipeable?: boolean
}

export default function Drawer({ open, onClose, children, className, overlayClassName, swipeable = true }: DrawerProps) {
	const rootRef = useRef<HTMLDivElement | null>(null)
	const contentRef = useRef<HTMLDivElement | null>(null)
	const startYRef = useRef(0)
	const lastYRef = useRef(0)
	const lastTimeRef = useRef(0)
	const draggingRef = useRef(false)
	const pointerIdRef = useRef<number | null>(null)
	const [translateY, setTranslateY] = useState(0)
	const [isDragging, setIsDragging] = useState(false)
	const animTimeoutRef = useRef<number | null>(null)

	useEffect(() => {
		const prev = document.body.style.overflow
		document.body.style.overflow = open ? 'hidden' : prev
		return () => {
			document.body.style.overflow = prev
		}
	}, [open])

	useEffect(() => {
		return () => {
			if (animTimeoutRef.current) {
				window.clearTimeout(animTimeoutRef.current)
				animTimeoutRef.current = null
			}
		}
	}, [])

	useEffect(() => {
		if (!open) {
			setTranslateY(0)
			setIsDragging(false)
			draggingRef.current = false
			if (animTimeoutRef.current) {
				window.clearTimeout(animTimeoutRef.current)
				animTimeoutRef.current = null
			}
		}
	}, [open])

	const getHeight = () => Math.max(1, contentRef.current?.clientHeight ?? window.innerHeight)

	const onPointerDown = (e: React.PointerEvent) => {
		if (!swipeable) return
		pointerIdRef.current = e.pointerId
		startYRef.current = e.clientY
		lastYRef.current = e.clientY
		lastTimeRef.current = performance.now()
		draggingRef.current = false
		try {
			;(e.target as Element).setPointerCapture?.(e.pointerId)
		} catch {
			// ignore
		}
	}

	const onPointerMove = (e: React.PointerEvent) => {
		if (!swipeable) return
		if (pointerIdRef.current === null) return
		if (e.pointerId !== pointerIdRef.current) return

		const curY = e.clientY
		const dy = curY - startYRef.current
		const now = performance.now()

		if (!draggingRef.current) {
			const contentEl = contentRef.current
			if (dy > 8 && contentEl && contentEl.scrollTop <= 0) {
				draggingRef.current = true
				setIsDragging(true)
				e.preventDefault()
			} else {
				return
			}
		}

		e.preventDefault()
		lastYRef.current = curY
		lastTimeRef.current = now

		const translate = Math.max(0, dy)
		setTranslateY(translate)
	}

	const onPointerUp = (e: React.PointerEvent) => {
		if (!swipeable) return
		if (pointerIdRef.current !== null && e.pointerId !== pointerIdRef.current) return
		try {
			;(e.target as Element).releasePointerCapture?.(e.pointerId)
		} catch {
			// ignore
		}

		if (!draggingRef.current) {
			pointerIdRef.current = null
			return
		}

		const curY = e.clientY
		const now = performance.now()
		const dyFromStart = curY - startYRef.current
		const lastDy = curY - lastYRef.current
		const dt = Math.max(1, now - lastTimeRef.current)
		const velocity = (lastDy / dt) * 1000

		const height = getHeight()
		const threshold = height * 0.3
		const velocityThreshold = 1000

		const shouldClose = dyFromStart > threshold || velocity > velocityThreshold

		if (shouldClose) {
			setIsDragging(false)
			requestAnimationFrame(() => {
				setTranslateY(height)
				animTimeoutRef.current = window.setTimeout(() => {
					onClose()
					setTranslateY(0)
					setIsDragging(false)
					draggingRef.current = false
					animTimeoutRef.current = null
				}, 300)
			})
		} else {
			setIsDragging(false)
			requestAnimationFrame(() => {
				setTranslateY(0)
				animTimeoutRef.current = window.setTimeout(() => {
					setIsDragging(false)
					draggingRef.current = false
					animTimeoutRef.current = null
				}, 300)
			})
		}

		pointerIdRef.current = null
	}

	const onPointerCancel = () => {
		if (!swipeable) return
		pointerIdRef.current = null
		if (draggingRef.current) {
			setTranslateY(0)
			setIsDragging(false)
			draggingRef.current = false
		}
	}

	const handleOverlayClick = () => {
		if (isDragging || translateY > 0) return
		onClose()
	}

	const height = getHeight()
	const normalized = Math.max(0, Math.min(1, 1 - translateY / height))
	const overlayOpacity = open ? normalized : 0
	const baseBlurPx = 6
	const blurPx = overlayOpacity * baseBlurPx
	const overlayTransition = isDragging ? 'none' : 'opacity 300ms ease-out, backdrop-filter 300ms ease-out'

	const translateStyle = swipeable && (isDragging || translateY > 0) ? { transform: `translateY(${translateY}px)` } : undefined

	return (
		<div
			ref={rootRef}
			className={cn('fixed inset-0 z-50 flex flex-col justify-end', open ? 'pointer-events-auto' : 'pointer-events-none')}
			aria-hidden={!open}
		>
			<div
				className={cn('absolute inset-0 bg-black/70', overlayClassName)}
				onClick={handleOverlayClick}
				style={{
					opacity: overlayOpacity,
					transition: overlayTransition,
					backdropFilter: `blur(${blurPx}px)`,
					WebkitBackdropFilter: `blur(${blurPx}px)`,
					pointerEvents: overlayOpacity > 0 ? 'auto' : 'none',
				}}
			/>

			<div
				role='dialog'
				aria-modal='true'
				ref={contentRef}
				onPointerDown={swipeable ? onPointerDown : undefined}
				onPointerMove={swipeable ? onPointerMove : undefined}
				onPointerUp={swipeable ? onPointerUp : undefined}
				onPointerCancel={swipeable ? onPointerCancel : undefined}
				onClick={e => e.stopPropagation()}
				className={cn(
					'relative w-full h-full overflow-y-auto overscroll-contain bg-background shadow-lg',
					'transform will-change-transform',
					isDragging ? 'transition-none' : 'transition-transform duration-300 ease-out',
					!isDragging && !open ? 'translate-y-full' : undefined,
					!isDragging && open ? 'translate-y-0' : undefined,
					className
				)}
				style={translateStyle}
			>
				{children}
			</div>
		</div>
	)
}
