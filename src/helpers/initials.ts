export function initials(name?: string, username?: string): string {
	const src = name && name.trim().length > 0 ? name : username ?? ''
	if (!src) return 'U'
	const parts = src.split(/\s+/).filter(Boolean)
	if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
	return (parts[0][0] + parts[1][0]).toUpperCase()
}
