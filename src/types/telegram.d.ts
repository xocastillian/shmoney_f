declare global {
	interface TelegramWebAppInitDataUnsafe {
		initData: string
	}

	interface TelegramWebApp {
		initData: string
		ready: () => void
	}

	interface TelegramNamespace {
		WebApp: TelegramWebApp
	}

	interface Window {
		Telegram?: TelegramNamespace
	}
}

export {}
