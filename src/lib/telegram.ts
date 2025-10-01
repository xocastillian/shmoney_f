export function getTelegramWebApp(): TelegramWebApp | null {
  return typeof window !== 'undefined' && window.Telegram ? window.Telegram.WebApp : null;
}

export function getInitData(): string | null {
  const wa = getTelegramWebApp();
  return wa?.initData ?? null;
}

export function ready(): void {
  const wa = getTelegramWebApp();
  if (wa) wa.ready();
}

export function isInTelegram(): boolean {
  return getTelegramWebApp() !== null;
}

