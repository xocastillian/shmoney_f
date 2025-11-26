export const serializeUtcDate = (value: string | Date) => {
	if (!value) return ''

	const date = value instanceof Date ? value : new Date(value)
	if (Number.isNaN(date.getTime())) {
		return ''
	}

	return date.toISOString().replace(/\.\d{3}Z$/, 'Z')
}
