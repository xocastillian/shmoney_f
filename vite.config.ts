import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '')
	const devProxyTarget = env.VITE_DEV_API_TARGET || env.VITE_API_URL || 'http://localhost:8080'
	const allowed = new Set<string>(['localhost', '127.0.0.1'])
	if (env.VITE_ALLOWED_HOST) allowed.add(env.VITE_ALLOWED_HOST)
	if (env.VITE_PUBLIC_URL) {
		try {
			allowed.add(new URL(env.VITE_PUBLIC_URL).host)
		} catch {
			console.log()
		}
	}
	console.log('[vite] devProxyTarget =', devProxyTarget)

	return {
		plugins: [react()],
		server: {
			host: true,
			allowedHosts: Array.from(allowed),
			proxy: {
				'/api': {
					target: devProxyTarget,
					changeOrigin: true,
					secure: true,
					headers: { 'ngrok-skip-browser-warning': 'true' },
				},
				'/v3/api-docs': {
					target: devProxyTarget,
					changeOrigin: true,
					secure: true,
					headers: { 'ngrok-skip-browser-warning': 'true' },
				},
				'/swagger-ui': {
					target: devProxyTarget,
					changeOrigin: true,
					secure: true,
					headers: { 'ngrok-skip-browser-warning': 'true' },
				},
			},
		},
		resolve: {
			alias: {
				'@': path.resolve(__dirname, 'src'),
				'@api': path.resolve(__dirname, 'src/api'),
			},
		},
	}
})
