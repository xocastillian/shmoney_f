import { useEffect, useMemo, useState } from 'react'
import { useTelegramAuth } from '@/hooks/useTelegramAuth'
import { listWallets, listCurrencies, createWallet } from '@api/client'
import type { WalletResponse, CurrencyResponse } from '@api/types'
import { subscribe, clearLogs } from '@/lib/logger'
import type { LogEntry } from '@/lib/logger'
import { baseURL as apiBase } from '@api/http'
import { getInitData, isInTelegram as isInTg } from '@/lib/telegram'

function App() {
	const { status, error, isInTelegram, login } = useTelegramAuth({ auto: true })
	const [manualInit, setManualInit] = useState<string>('')
	const [wallets, setWallets] = useState<WalletResponse[] | null>(null)
	const [currencies, setCurrencies] = useState<CurrencyResponse[] | null>(null)
	const [pending, setPending] = useState<boolean>(false)
	const [createName, setCreateName] = useState<string>('Test Wallet')
	const [createCurrency, setCreateCurrency] = useState<string>('USD')

	const authenticated = useMemo(() => status === 'authenticated', [status])
	const [logs, setLogs] = useState<LogEntry[]>([])

	useEffect(() => {
		const unsub = subscribe(setLogs)
		return () => unsub()
	}, [])

	useEffect(() => {
		// reset data when status changes
		setWallets(null)
		setCurrencies(null)
	}, [status])

	async function loadWallets() {
		setPending(true)
		try {
			const data = await listWallets()
			setWallets(data)
		} finally {
			setPending(false)
		}
	}

	async function loadCurrencies() {
		setPending(true)
		try {
			const data = await listCurrencies()
			setCurrencies(data)
		} finally {
			setPending(false)
		}
	}

	async function createDummyWallet() {
		setPending(true)
		try {
			await createWallet({ name: createName, currencyCode: createCurrency })
			await loadWallets()
		} finally {
			setPending(false)
		}
	}

	return (
		<div className='min-h-screen p-6 flex flex-col gap-4 max-w-3xl mx-auto'>
			<header className='flex items-center justify-between'>
				<h1 className='text-xl font-semibold'>Shmoney • Telegram Mini App</h1>
				<div className='text-sm opacity-70'>{isInTelegram ? 'Opened in Telegram' : 'Browser mode'}</div>
			</header>

			<section className='rounded-lg border p-4 space-y-3'>
				<div className='text-sm'>
					Auth status: <b>{status}</b>
				</div>
				{error && <div className='text-sm text-red-600'>{error}</div>}
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
							className='px-4 py-2 rounded bg-black text-white disabled:opacity-50'
							onClick={() => login(manualInit)}
							disabled={manualInit.trim().length === 0 || status === 'authenticating'}
						>
							Login with pasted initData
						</button>
					</div>
				)}
				{isInTelegram && (
					<details className='mt-2'>
						<summary className='cursor-pointer text-sm underline'>Show current Telegram initData</summary>
						<pre className='text-xs bg-neutral-100 p-2 rounded overflow-auto whitespace-pre-wrap break-words'>{getInitData()}</pre>
					</details>
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

				<div className='flex gap-2 flex-wrap'>
					<button
						className='px-3 py-2 rounded bg-neutral-900 text-white disabled:opacity-50'
						onClick={loadWallets}
						disabled={!authenticated || pending}
					>
						Load wallets
					</button>
					<button
						className='px-3 py-2 rounded bg-neutral-900 text-white disabled:opacity-50'
						onClick={loadCurrencies}
						disabled={!authenticated || pending}
					>
						Load currencies
					</button>
				</div>

				<div className='flex gap-2 items-center flex-wrap'>
					<input className='border rounded px-2 py-1' placeholder='Wallet name' value={createName} onChange={e => setCreateName(e.target.value)} />
					<input
						className='border rounded px-2 py-1 w-28'
						placeholder='Currency'
						value={createCurrency}
						onChange={e => setCreateCurrency(e.target.value.toUpperCase())}
					/>
					<button
						className='px-3 py-2 rounded bg-blue-600 text-white disabled:opacity-50'
						onClick={createDummyWallet}
						disabled={!authenticated || pending}
					>
						Create wallet
					</button>
				</div>

				<div className='grid gap-3'>
					{wallets && <pre className='text-xs bg-neutral-100 p-3 rounded overflow-auto'>{JSON.stringify(wallets, null, 2)}</pre>}
					{currencies && <pre className='text-xs bg-neutral-100 p-3 rounded overflow-auto'>{JSON.stringify(currencies, null, 2)}</pre>}
					<div className='space-y-2'>
						<div className='flex items-center justify-between'>
							<div className='text-sm font-medium'>Debug log</div>
							<button className='text-xs underline' onClick={() => clearLogs()}>
								clear
							</button>
						</div>
						<pre className='text-xs bg-neutral-50 p-3 rounded h-64 overflow-auto'>
							{logs.map(l => `${l.time} [${l.level}] ${l.message}` + (l.details ? `\n  ${JSON.stringify(l.details)}` : '')).join('\n')}
						</pre>
					</div>
				</div>
			</section>
		</div>
	)
}

export default App
