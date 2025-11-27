import { Check, X } from 'lucide-react'
import Drawer from '@/components/Drawer/Drawer'
import Loader from '@/components/ui/Loader/Loader'
import { useTranslation } from '@/i18n'

interface LanguageSettingsDrawerProps {
	open: boolean
	onClose: () => void
	languages: string[]
	selectedLanguage: string | null
	loading?: boolean
	error?: string | null
	onSelect: (language: string) => void
}

export const LanguageSettingsDrawer = ({ open, onClose, languages, selectedLanguage, loading = false, onSelect }: LanguageSettingsDrawerProps) => {
	const { t } = useTranslation()
	const handleClose = () => {
		if (loading) return
		onClose()
	}

	return (
		<Drawer
			open={open}
			onClose={handleClose}
			className='max-h-[70vh] rounded-t-lg !bg-background-secondary'
			overlayClassName='bg-black/80 backdrop-blur-sm'
		>
			<div className='flex h-full flex-col'>
				<div className='flex justify-end p-3'>
					<button type='button' onClick={handleClose} className='rounded-full p-2' aria-label='Закрыть'>
						<X />
					</button>
				</div>

				<div className='flex flex-1 flex-col'>
					<h2 className='mb-4 px-3 text-sm font-medium text-label'>{t('settings.language')}</h2>
					<div className='bg-background-muted'>
						{languages.map(language => {
							const isSelected = language === selectedLanguage
							return (
								<button
									key={language}
									type='button'
									onClick={() => onSelect(language)}
									aria-pressed={isSelected}
									className='w-full border-b border-divider text-left last:border-b-0 focus:outline-none focus-visible:bg-background-muted'
									disabled={loading}
								>
									<div className='flex h-16 items-center px-3'>
										<span className='text-text uppercase'>{language}</span>
										{isSelected && <Check className='ml-auto' size={16} />}
									</div>
								</button>
							)
						})}
					</div>
				</div>

				{loading && (
					<div className='fixed inset-0 z-30 bg-black/80 backdrop-blur-sm'>
						<div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
							<Loader />
						</div>
					</div>
				)}
			</div>
		</Drawer>
	)
}

export default LanguageSettingsDrawer
