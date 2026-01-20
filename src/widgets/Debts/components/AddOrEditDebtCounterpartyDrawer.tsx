import { useEffect, useId, useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import { createPortal } from 'react-dom'
import Loader from '@/components/ui/Loader/Loader'
import ColorPickerDrawer from '@/widgets/Wallets/components/ColorPickerDrawer'
import { CustomColorPickerDrawer } from '@/widgets/Wallets/components/CustomColorPickerDrawer'
import { colorOptions } from '@/widgets/Wallets/constants'
import { useTranslation } from '@/i18n'
import useDebts from '@/hooks/useDebts'
import type { DebtCounterparty } from '@/types/entities/debt'
import { DebtCounterpartyStatus } from '@/types/entities/debt'
import Drawer from '@/components/Drawer/Drawer'
import DebtCounterpartyForm from './DebtCounterpartyForm'

export type DebtCounterpartyFormValues = Pick<DebtCounterparty, 'name' | 'color'>

interface AddOrEditDebtCounterpartyDrawerProps {
	open: boolean
	onClose: () => void
	initialCounterparty?: DebtCounterparty
	onSubmit?: (values: DebtCounterpartyFormValues) => void
	title?: string
	submitting?: boolean
}

const DEFAULT_COLOR = colorOptions[0] ?? '#F97316'

const AddOrEditDebtCounterpartyDrawer = ({
	open,
	onClose,
	initialCounterparty,
	onSubmit,
	title,
	submitting = false,
}: AddOrEditDebtCounterpartyDrawerProps) => {
	const [name, setName] = useState('')
	const [color, setColor] = useState(DEFAULT_COLOR)
	const [isColorPickerOpen, setColorPickerOpen] = useState(false)
	const [isCustomColorPickerOpen, setCustomColorPickerOpen] = useState(false)
	const [internalSubmitting, setSubmitting] = useState(false)
	const formId = useId()
	const { createCounterparty, updateCounterparty, archiveCounterparty, restoreCounterparty } = useDebts()
	const { t } = useTranslation()
	const computedTitle = title ?? (initialCounterparty ? t('debts.drawer.editTitle') : t('debts.drawer.newTitle'))
	const isEditMode = Boolean(initialCounterparty)
	const isBusy = internalSubmitting || submitting
	const currentStatus = initialCounterparty?.status ?? DebtCounterpartyStatus.ACTIVE

	useEffect(() => {
		if (!open) {
			setColorPickerOpen(false)
			return
		}

		setName(initialCounterparty?.name ?? '')
		setColor(initialCounterparty?.color ?? DEFAULT_COLOR)
	}, [initialCounterparty, open])

	const isSubmitDisabled = isBusy || !name.trim() || !color

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
    
		if (isSubmitDisabled) return

		const payload = {
			name: name.trim(),
			color,
		}

		try {
			setSubmitting(true)
			const saved = isEditMode && initialCounterparty ? await updateCounterparty(initialCounterparty.id, payload) : await createCounterparty(payload)

			onSubmit?.({
				name: saved.name,
				color: saved.color,
			})

			onClose()
		} catch {
			// errors handled in useDebts
		} finally {
			setSubmitting(false)
		}
	}

	const handleSelectColor = (nextColor: string) => {
		setColor(nextColor)
		setColorPickerOpen(false)
	}

	const handleToggleStatus = async () => {
		if (!initialCounterparty || isBusy) return
		const shouldRestore = currentStatus === DebtCounterpartyStatus.ARCHIVED

		try {
			setSubmitting(true)
			if (shouldRestore) {
				await restoreCounterparty(initialCounterparty.id)
			} else {
				await archiveCounterparty(initialCounterparty.id)
			}
			onSubmit?.({
				name: initialCounterparty.name,
				color: initialCounterparty.color,
			})
			onClose()
		} catch {
			// errors handled in useDebts
		} finally {
			setSubmitting(false)
		}
	}

	const statusActionType = currentStatus === DebtCounterpartyStatus.ARCHIVED ? 'unarchive' : 'archive'

	return (
		<>
			<Drawer open={open} onClose={onClose} className='rounded-t-lg bg-background-secondary' swipeable={false}>
				<div className='flex h-full flex-col'>
					<div className='flex items-center justify-between gap-3 p-3 border-b border-divider'>
						<h1 className='font-medium text-lg'>{computedTitle}</h1>
						<button type='button' onClick={onClose} className='rounded-full p-2' aria-label={t('debts.drawer.close')}>
							<X />
						</button>
					</div>

					<div className='flex-1 overflow-y-auto py-3'>
						<DebtCounterpartyForm
							formId={formId}
							name={name}
							onNameChange={setName}
							color={color}
							onOpenColorPicker={() => setColorPickerOpen(true)}
							onToggleStatus={isEditMode ? handleToggleStatus : undefined}
							disableStatusAction={isBusy}
							statusActionType={statusActionType}
							onSubmit={handleSubmit}
							submitLabel={t('common.save')}
							submitDisabled={isSubmitDisabled}
						/>
					</div>
				</div>
			</Drawer>

			<ColorPickerDrawer
				open={isColorPickerOpen}
				onClose={() => setColorPickerOpen(false)}
				colors={colorOptions}
				onSelect={handleSelectColor}
				selectedColor={color}
				onOpenCustomPicker={() => setCustomColorPickerOpen(true)}
			/>

			<CustomColorPickerDrawer
				open={isCustomColorPickerOpen}
				onClose={() => setCustomColorPickerOpen(false)}
				initialColor={color}
				onSelect={nextColor => {
					handleSelectColor(nextColor)
					setCustomColorPickerOpen(false)
				}}
			/>

			{open &&
				isBusy &&
				typeof document !== 'undefined' &&
				createPortal(
					<div className='fixed inset-0 z-[999999] bg-black/80 backdrop-blur-sm flex items-center justify-center pointer-events-auto'>
						<div className='p-2'>
							<Loader />
						</div>
					</div>,
					document.body,
				)}
		</>
	)
}

export default AddOrEditDebtCounterpartyDrawer
