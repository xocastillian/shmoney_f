/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: ['./index.html', './src/**/*.{ts,tsx}'],
	theme: {
		extend: {
			colors: {
				background: 'var(--background)',
				text: 'var(--text)',
				card: 'var(--card)',
				label: 'var(--label)',
				'accent-orange': 'var(--accent-orange)',
				'background-muted': 'var(--background-muted)',
				divider: 'var(--divider)',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
}
