import Header from '@/components/header'
import { useTelegramAuth } from '@/hooks/useTelegramAuth'
import { useMemo } from 'react'
import AuthDiagnostics from '@/components/auth/auth-diagnostics'

function App() {
	const { status, error, isInTelegram, login } = useTelegramAuth({ auto: true })

	const authenticated = useMemo(() => status === 'authenticated', [status])

	return (
		<div className='min-h-screen p-5 flex flex-col gap-4 max-w-md mx-auto'>
			<Header />

			{!authenticated && error ? (
				<AuthDiagnostics status={status} error={error ?? null} isInTelegram={isInTelegram} onLogin={data => login(data)} />
			) : (
				<div>работает сучка вон твоя ава даже есть</div>
			)}
		</div>
	)
}

export default App
