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
				'background-muted-2': 'var(--background-muted-2)',
				divider: 'var(--divider)',
				'text-dark': 'var(--text-dark)',
				'background-secondary': 'var(--background-secondary)',
				danger: 'var(--danger)',
				access: 'var(--access)',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
}
