import type { FC } from 'react'
import type { Setting } from '@/types/entities/setting'

interface Props {
	setting?: Setting
}

const SettingsItem: FC<Props> = ({ setting }) => {
	const Icon = setting?.icon
	const isDisabled = Boolean(setting?.disabled)

	const handleClick = () => {
		if (!setting || isDisabled) return
		setting.onClick()
	}

	return (
		<div className={`border-b border-divider bg-background-muted${isDisabled ? ' opacity-70' : ''}`} onClick={handleClick} aria-disabled={isDisabled}>
			<div className='flex h-16 items-center px-3'>
				<div className='flex items-center'>
					{Icon && <Icon className='mr-3 h-6 w-6 text-accent' />}
					<span className='text-text'>{setting?.title}</span>
				</div>
			</div>
		</div>
	)
}

export default SettingsItem
