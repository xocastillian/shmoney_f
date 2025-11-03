import { useMemo, useState } from 'react'
import { Home as HomeIcon, BarChart2, Wallet, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import HomeScreen from '@/screens/Home/HomeScreen'
import StatisticsScreen from '@/screens/Statistics/StatisticsScreen'
import BudgetsScreen from '@/screens/Budgets/BudgetsScreen'
import SettingsScreen from '@/screens/Settings/SettingsScreen'
import { BottomNav, type BottomNavTab } from '@/components/ui/BottomNav'

type TabKey = 'home' | 'statistics' | 'budgets' | 'settings'

function App() {
	const [activeTab, setActiveTab] = useState<TabKey>('home')
	const tabs = useMemo<BottomNavTab[]>(
		() => [
			{ key: 'home', label: 'Главная', icon: HomeIcon },
			{ key: 'statistics', label: 'Статистика', icon: BarChart2 },
			{ key: 'create', variant: 'action' as const },
			{ key: 'budgets', label: 'Бюджеты', icon: Wallet },
			{ key: 'settings', label: 'Настройки', icon: Settings },
		],
		[]
	)

	return (
		<div className='relative min-h-screen bg-background text-foreground'>
			<main>
				<section className={cn('min-h-screen', activeTab === 'home' ? 'block' : 'hidden')}>
					<HomeScreen />
				</section>

				<section className={cn('min-h-screen', activeTab === 'statistics' ? 'block' : 'hidden')}>
					<StatisticsScreen />
				</section>

				<section className={cn('min-h-screen', activeTab === 'budgets' ? 'block' : 'hidden')}>
					<BudgetsScreen />
				</section>

				<section className={cn('min-h-screen', activeTab === 'settings' ? 'block' : 'hidden')}>
					<SettingsScreen />
				</section>
			</main>

			<BottomNav
				tabs={tabs}
				activeKey={activeTab}
				onTabChange={value => setActiveTab(value as TabKey)}
				onCreate={() => {
					console.log('Открыть создание транзакции')
				}}
			/>
		</div>
	)
}

export default App
