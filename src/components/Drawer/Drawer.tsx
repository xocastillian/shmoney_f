import { useEffect, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface DrawerProps {
	open: boolean
	onClose: () => void
	children: ReactNode
	className?: string
	overlayClassName?: string
}

export default function Drawer({ open, onClose, children, className, overlayClassName }: DrawerProps) {
	useEffect(() => {
		const prev = document.body.style.overflow
		document.body.style.overflow = open ? 'hidden' : prev
		return () => {
			document.body.style.overflow = prev
		}
	}, [open])

	return (
		<div className={cn('fixed inset-0 z-50 flex flex-col justify-end', open ? 'pointer-events-auto' : 'pointer-events-none')} aria-hidden={!open}>
			<div
				className={cn(
					'absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ease-out',
					open ? 'opacity-100' : 'opacity-0',
					overlayClassName
				)}
				onClick={onClose}
			/>

			<div
				role='dialog'
				aria-modal='true'
				className={cn(
					'relative w-full h-full overflow-y-auto overscroll-contain bg-background shadow-lg',
					'transform transition-transform duration-300 ease-out will-change-transform',
					open ? 'translate-y-0' : 'translate-y-full',
					className
				)}
				onClick={e => e.stopPropagation()}
			>
				{children}
			</div>
		</div>
	)
}
