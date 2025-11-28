import { Drawer } from 'vaul'
import { cn } from '@/lib/utils'

interface DrawerWrapperProps {
	children?: React.ReactNode
	open: boolean
	onClose: () => void
	className?: string
}

export default function DrawerWrapper({ children, open, onClose, className }: DrawerWrapperProps) {
	return (
		<Drawer.Root open={open} onOpenChange={onClose} modal={true}>
			<Drawer.Portal>
				<Drawer.Overlay className={cn('bg-black/80 backdrop-blur-sm fixed inset-0 z-50')} />
				<Drawer.Content className={cn('fixed bottom-0 left-0 right-0 z-50 outline-none bg-background', className)}>
					<div className='w-full h-full rounded-t-lg'>{children}</div>
				</Drawer.Content>
			</Drawer.Portal>
		</Drawer.Root>
	)
}
