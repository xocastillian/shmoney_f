export interface TelegramUserInfo {
	id: number
	username?: string
	firstName?: string
	lastName?: string
	languageCode?: string
	photoUrl?: string
}

export function getTelegramWebApp(): TelegramWebApp | null {
	return typeof window !== 'undefined' && window.Telegram ? window.Telegram.WebApp : null
}

export function getInitData(): string | null {
	const wa = getTelegramWebApp()
	return wa?.initData ?? null
}

export function ready(): void {
	const wa = getTelegramWebApp()
	if (wa) wa.ready()
}

export function isInTelegram(): boolean {
	return getTelegramWebApp() !== null
}

export function parseInitDataString(initData: string): Record<string, string> {
	const map: Record<string, string> = {}
	const pairs = initData.split('&')

	for (const p of pairs) {
		const idx = p.indexOf('=')

		if (idx <= 0) continue
		const k = decodeURIComponent(p.slice(0, idx))
		const v = decodeURIComponent(p.slice(idx + 1))
		map[k] = v
	}

	return map
}

export function extractUserFromInitData(initData: string | null | undefined): TelegramUserInfo | null {
	if (!initData) return null

	const map = parseInitDataString(initData)
	const rawUser = map['user']

	if (!rawUser) return null

	try {
		const u = JSON.parse(rawUser) as {
			id: number
			username?: string
			first_name?: string
			last_name?: string
			language_code?: string
			photo_url?: string
		}
		return {
			id: u.id,
			username: u.username,
			firstName: u.first_name,
			lastName: u.last_name,
			languageCode: u.language_code,
			photoUrl: u.photo_url,
		}
	} catch {
		return null
	}
}

export function getTelegramUser(): TelegramUserInfo | null {
	return extractUserFromInitData(getInitData())
}
