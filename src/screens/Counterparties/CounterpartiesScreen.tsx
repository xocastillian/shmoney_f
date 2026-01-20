import { useEffect, useMemo, useState } from 'react'
import { UserRound } from 'lucide-react'
import { useTranslation } from '@/i18n'
import useDebts from '@/hooks/useDebts'
import { DebtCounterpartyStatus } from '@/types/entities/debt'
import Loader from '@/components/ui/Loader/Loader'
import SegmentedTabs from '@/components/ui/SegmentedTabs/SegmentedTabs'

type CounterpartyTab = 'LENT' | 'BORROWED'

const CounterpartiesScreen = () => {
	const { counterparties, fetchCounterparties, counterpartiesLoading, counterpartiesError } = useDebts()
	const { t } = useTranslation()

	const [activeTab, setActiveTab] = useState<CounterpartyTab>('LENT')

	useEffect(() => {
		void fetchCounterparties().catch(() => undefined)
	}, [fetchCounterparties])

	const filteredCounterparties = useMemo(() => {
		return counterparties.filter(counterparty => (activeTab === 'LENT' ? counterparty.owedToMe > 0 : counterparty.iOwe > 0))
	}, [activeTab, counterparties])

	const activeCounterparties = useMemo(
		() => filteredCounterparties.filter(counterparty => counterparty.status === DebtCounterpartyStatus.ACTIVE),
		[filteredCounterparties],
	)

	const tabOptions = useMemo(
		() => [
			{ value: 'LENT' as const, label: t('debts.tabs.lent') },
			{ value: 'BORROWED' as const, label: t('debts.tabs.borrowed') },
		],
		[t],
	)

	return (
		<div className='min-h-full px-3 pb-28'>
			<header className='sticky top-0 z-20 bg-background'>
				<div className='flex items-center justify-between py-3'>
					<h1 className='text-lg font-medium'>{t('debts.drawer.title')}</h1>
				</div>

				<SegmentedTabs value={activeTab} options={tabOptions} onChange={value => setActiveTab(value)} className='rounded-xl mb-3' />
			</header>

			{counterpartiesLoading ? (
				<div className='flex justify-center py-10'>
					<Loader />
				</div>
			) : counterpartiesError ? (
				<div className='text-sm text-danger'>{counterpartiesError}</div>
			) : filteredCounterparties.length === 0 ? (
				<div className='text-sm text-label text-center'>{t('debts.empty')}</div>
			) : (
				<div className='space-y-4'>
					{activeCounterparties.length > 0 && (
						<section>
							<div className='overflow-hidden rounded-xl bg-background-muted'>
								{activeCounterparties.map(counterparty => (
									<div key={counterparty.id} className='flex justify-between h-16 w-full items-center border-b border-divider px-3 last:border-b-0'>
										<div className='flex text-left items-center'>
											<UserRound className='mr-3 h-6 w-6' color={counterparty.color || '#f89a04'} />

											<span className='text-text'>{counterparty.name}</span>
										</div>

										<div>
											<span className='text-lg mr-2'>
												{counterparty.iOwe > 0 ? counterparty.iOwe.toLocaleString() : counterparty.owedToMe.toLocaleString()}
											</span>
											<span className='text-label text-lg'>{counterparty.currencyCode}</span>
										</div>
									</div>
								))}
							</div>
						</section>
					)}
				</div>
			)}
		</div>
	)
}

export default CounterpartiesScreen
