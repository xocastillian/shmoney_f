export const formatDateTimeLocal = (date: Date) => {
	const pad = (value: number, length = 2) => value.toString().padStart(length, '0')

	const year = date.getFullYear()
	const month = pad(date.getMonth() + 1)
	const day = pad(date.getDate())
	const hours = pad(date.getHours())
	const minutes = pad(date.getMinutes())
	const seconds = pad(date.getSeconds())
	const millis = pad(date.getMilliseconds(), 3)

	return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${millis}`
}

const FULL_DISPLAY_OPTIONS: Intl.DateTimeFormatOptions = {
	day: '2-digit',
	month: 'long',
	year: 'numeric',
	hour: '2-digit',
	minute: '2-digit',
	hour12: false,
}

export const formatDateTimeDisplay = (date: Date, locale = 'ru-RU') => {
	const formatter = new Intl.DateTimeFormat(locale, FULL_DISPLAY_OPTIONS)
	const parts = formatter.formatToParts(date)
	const map = new Map(parts.filter(part => part.type !== 'literal').map(part => [part.type, part.value]))
	const day = map.get('day') ?? ''
	const month = map.get('month') ?? ''
	const year = map.get('year') ?? ''
	const hour = map.get('hour') ?? ''
	const minute = map.get('minute') ?? ''

	return `${day} ${month} ${year}, ${hour}:${minute}`
}

const DATE_ONLY_DISPLAY_OPTIONS: Intl.DateTimeFormatOptions = {
	day: '2-digit',
	month: 'long',
	year: 'numeric',
}

export const formatDateDisplay = (date: Date, locale = 'ru-RU') => {
	const formatter = new Intl.DateTimeFormat(locale, DATE_ONLY_DISPLAY_OPTIONS)
	return formatter.format(date)
}
