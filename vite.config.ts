import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function resolveHttpsConfig(env: Record<string, string>) {
	const keyPath = env.VITE_DEV_SSL_KEY || path.resolve(__dirname, 'app.localhost.direct+3-key.pem')
	const certPath = env.VITE_DEV_SSL_CERT || path.resolve(__dirname, 'app.localhost.direct+3.pem')

	if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
		return undefined
	}

	return {
		key: fs.readFileSync(keyPath),
		cert: fs.readFileSync(certPath),
	}
}

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '')
	const devProxyTarget = env.VITE_DEV_API_TARGET || env.VITE_API_URL || 'http://localhost:8080'
	const preferredHost = env.VITE_DEV_HOST || env.VITE_ALLOWED_HOST || 'localhost'
	const allowed = new Set<string>(['localhost', '127.0.0.1', preferredHost])
	const httpsConfig = resolveHttpsConfig(env)
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
			https: httpsConfig,
			allowedHosts: true,
			hmr: {
				protocol: 'wss',
				host: '192.168.0.17',
				port: 5173,
			},
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
		preview: {
			host: preferredHost,
			https: httpsConfig,
		},
		resolve: {
			alias: {
				'@': path.resolve(__dirname, 'src'),
				'@api': path.resolve(__dirname, 'src/api'),
			},
		},
		optimizeDeps: {
			include: ['tslib'],
		},
		build: {
			commonjsOptions: {
				include: [/node_modules/],
			},
		},
	}
})
