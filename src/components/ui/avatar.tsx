import * as React from 'react'

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
	className?: string
}

export function Avatar(props: AvatarProps) {
	const { className, ...rest } = props

	return (
		<span
			data-slot='avatar'
			className={['relative inline-flex h-9 w-9 shrink-0 overflow-hidden rounded-full border border-border bg-secondary', className ?? ''].join(' ')}
			{...rest}
		/>
	)
}

export interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
	className?: string
}

export function AvatarImage(props: AvatarImageProps) {
	const { className, alt = '', ...rest } = props

	return <img alt={alt} className={['aspect-square h-full w-full object-cover', className ?? ''].join(' ')} {...rest} />
}

export interface AvatarFallbackProps extends React.HTMLAttributes<HTMLSpanElement> {
	className?: string
}

export function AvatarFallback(props: AvatarFallbackProps) {
	const { className, children, ...rest } = props

	return (
		<span
			className={['flex h-full w-full items-center justify-center bg-muted text-muted-foreground text-xs font-medium', className ?? ''].join(' ')}
			{...rest}
		>
			{children}
		</span>
	)
}
