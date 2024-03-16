import App from './App'
import '@/utils/utils.js'
import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'

export function createApp() {
	const pinia = createPinia()
	const app = createSSRApp(App)

	app.use(pinia)
	return {
		app,
	}
}
