import { Archive, Check, Info, Palette, RotateCcw } from 'lucide-react'
import type { ChangeEvent, FormEvent } from 'react'
import { useTranslation } from '@/i18n'
import { cn } from '@/lib/utils'

interface DebtCounterpartyFormProps {
	formId: string
	name: string
	onNameChange: (value: string) => void
	color: string
	onOpenColorPicker: () => void
	onToggleStatus?: () => void
	disableStatusAction?: boolean
	statusActionType?: 'archive' | 'unarchive'
	onSubmit: (event: FormEvent<HTMLFormElement>) => void
	submitLabel?: string
	submitDisabled?: boolean
}

const DebtCounterpartyForm = ({
	formId,
	name,
	onNameChange,
	color,
	onOpenColorPicker,
	onToggleStatus,
	disableStatusAction,
	statusActionType,
	onSubmit,
	submitLabel,
	submitDisabled = false,
}: DebtCounterpartyFormProps) => {
	const { t } = useTranslation()
	const resolvedSubmitLabel = submitLabel ?? t('common.save')
	const statusActionLabel = statusActionType === 'unarchive' ? t('common.unarchive') : t('common.archive')
	const StatusIconComponent = statusActionType === 'unarchive' ? RotateCcw : Archive
	const statusActionColor = statusActionType === 'unarchive' ? 'text-accent' : 'text-danger'

	return (
		<form id={formId} className='flex h-full flex-col' onSubmit={onSubmit}>
			<div>
				<h2 className='mb-3 px-3 text-sm font-medium text-label'>{t('common.general')}</h2>

				<div className='overflow-hidden bg-background-muted'>
					<div className='border-b border-t border-divider'>
						<div className='flex h-16 items-center px-3'>
							<Info className='mr-3 text-label' />
							<input
								className='flex-1 bg-transparent text-text placeholder:text-label outline-none'
								placeholder={t('debts.form.namePlaceholder')}
								value={name}
								onChange={(event: ChangeEvent<HTMLInputElement>) => onNameChange(event.target.value)}
								maxLength={120}
							/>
						</div>
					</div>

					<div className='border-b border-divider'>
						<button type='button' className='flex h-16 w-full items-center px-3 text-left' onClick={onOpenColorPicker}>
							<Palette className='mr-3 text-label transition-colors' style={{ color }} />
							<span style={{ color }}>{t('debts.form.color')}</span>
						</button>
					</div>
				</div>
			</div>

			<h2 className='m-3 text-sm font-medium text-label'>{t('common.actions')}</h2>

			<div className='border-b border-t border-divider bg-background-muted'>
				<button type='submit' className='flex h-16 w-full items-center px-3 text-access disabled:text-label' disabled={submitDisabled}>
					<Check className={cn('mr-3 transition-colors', submitDisabled ? 'text-label' : 'text-access')} />
					<span className={cn('transition-colors', submitDisabled ? 'text-label' : 'text-access')}>{resolvedSubmitLabel}</span>
				</button>
			</div>

			{onToggleStatus && statusActionType && (
				<div className='border-b border-divider bg-background-muted'>
					<button
						type='button'
						onClick={onToggleStatus}
						className={cn('flex h-16 w-full items-center px-3 text-left', disableStatusAction && 'opacity-60')}
						disabled={disableStatusAction}
					>
						<StatusIconComponent className={cn('mr-3', statusActionColor)} />
						<span className={statusActionColor}>{statusActionLabel}</span>
					</button>
				</div>
			)}
		</form>
	)
}

export default DebtCounterpartyForm
