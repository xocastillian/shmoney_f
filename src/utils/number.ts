export function formatNumberWithSpaces(value: string): string {
	if (!value) return ''
	const cleaned = value.replace(/\D/g, '')
	if (!cleaned) return ''
	return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export function sanitizeDecimalInput(value: string): string {
	if (!value) return ''

	let sanitized = value.replace(/\s/g, '').replace(',', '.').replace(/[^0-9.]/g, '')

	const firstDotIndex = sanitized.indexOf('.')
	if (firstDotIndex !== -1) {
		const integerPart = sanitized.slice(0, firstDotIndex).replace(/\./g, '')
		const fractionalPart = sanitized.slice(firstDotIndex + 1).replace(/\./g, '')
		sanitized = `${integerPart}.${fractionalPart}`
	} else {
		sanitized = sanitized.replace(/\./g, '')
	}

	return sanitized
}

export function formatDecimalForDisplay(value: string): string {
	if (!value) return ''

	const sanitized = sanitizeDecimalInput(value)
	if (!sanitized) return ''

	const dotIndex = sanitized.indexOf('.')
	if (dotIndex === -1) {
		return formatNumberWithSpaces(sanitized)
	}

	const integerPart = sanitized.slice(0, dotIndex)
	const fractionalPart = sanitized.slice(dotIndex + 1)
	const formattedInteger = formatNumberWithSpaces(integerPart)

	if (fractionalPart.length === 0) {
		return `${formattedInteger}.`
	}

	return `${formattedInteger}.${fractionalPart}`
}
