import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { initials } from '@/helpers/initials'
import { useAuthStore } from '@/store/auth'
import { useMemo } from 'react'

export function Header() {
	const user = useAuthStore(s => s.user)

	const displayName = useMemo(() => {
		if (!user) return ''
		const fn = user.firstName ?? ''
		const ln = user.lastName ?? ''
		const full = (fn + ' ' + ln).trim()
		return full || user.username || 'User'
	}, [user])

	return (
		<header className='flex items-center justify-between border-b pb-3'>
			<div className='text-base font-semibold'>Shmoney</div>
			{user && (
				<div className='flex items-center gap-3'>
					<Avatar>
						{user.photoUrl ? (
							<AvatarImage src={user.photoUrl} alt={initials(displayName, user.username)} />
						) : (
							<AvatarFallback>{initials(displayName, user.username)}</AvatarFallback>
						)}
					</Avatar>
				</div>
			)}
		</header>
	)
}

export default Header
