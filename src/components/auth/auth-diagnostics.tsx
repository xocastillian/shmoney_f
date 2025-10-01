import { useEffect, useMemo, useState } from 'react'
import { subscribe, clearLogs } from '@/lib/logger'
import type { LogEntry } from '@/lib/logger'
import { baseURL as apiBase } from '@api/http'
import { getInitData, isInTelegram as isInTg } from '@/lib/telegram'
import type { AuthStatus } from '@/store/auth'

interface Props {
	status: AuthStatus
	error: string | null | undefined
	isInTelegram: boolean
	onLogin: (initData: string) => void
}

export function AuthDiagnostics({ status, error, isInTelegram, onLogin }: Props) {
	const [logs, setLogs] = useState<LogEntry[]>([])
	const [manualInit, setManualInit] = useState<string>('')
	const authenticated = useMemo(() => status === 'authenticated', [status])

	useEffect(() => {
		const unsub = subscribe(setLogs)
		return () => unsub()
	}, [])

	if (authenticated) return null

	return (
		<>
			<section className='rounded-lg border p-4 space-y-3'>
				<div className='text-sm'>
					Auth status: <b>{status}</b>
				</div>
				{error && <div className='text-sm text-red-500'>{String(error)}</div>}
				{!isInTelegram && (
					<div className='space-y-2'>
						<label className='text-sm'>initData (paste from Telegram):</label>
						<textarea
							className='w-full border rounded p-2 text-sm'
							rows={3}
							value={manualInit}
							onChange={e => setManualInit(e.target.value)}
							placeholder='Paste Telegram WebApp initData here'
						/>
						<button
							className='px-4 py-2 rounded bg-primary text-primary-foreground disabled:opacity-50'
							onClick={() => onLogin(manualInit)}
							disabled={manualInit.trim().length === 0 || status === 'authenticating'}
						>
							Login with pasted initData
						</button>
					</div>
				)}
			</section>

			<section className='rounded-lg border p-4 space-y-3'>
				<div className='text-xs opacity-70'>
					<div>Origin: {typeof window !== 'undefined' ? window.location.origin : 'n/a'}</div>
					<div>Axios baseURL: {apiBase || '(same-origin)'}</div>
					<div>VITE_API_URL: {import.meta.env.VITE_API_URL || '-'}</div>
					<div>VITE_DEV_API_TARGET: {import.meta.env.VITE_DEV_API_TARGET || '-'}</div>
					<div>Telegram initData: {isInTg() ? (getInitData()?.length || 0) + ' chars' : 'n/a'}</div>
				</div>
				{isInTg() && (
					<details className='mt-2'>
						<summary className='cursor-pointer text-sm underline'>Show current Telegram initData</summary>
						<pre className='text-xs bg-neutral-100/20 p-2 rounded overflow-auto whitespace-pre-wrap break-words'>{getInitData()}</pre>
					</details>
				)}
				<div className='space-y-2'>
					<div className='flex items-center justify-between'>
						<div className='text-sm font-medium'>Debug log</div>
						<button className='text-xs underline' onClick={() => clearLogs()}>
							clear
						</button>
					</div>
					<pre className='text-xs bg-neutral-100/10 p-3 rounded h-64 overflow-auto'>
						{logs.map(l => `${l.time} [${l.level}] ${l.message}` + (l.details ? `\n  ${JSON.stringify(l.details)}` : '')).join('\n')}
					</pre>
				</div>
			</section>
		</>
	)
}

export default AuthDiagnostics
