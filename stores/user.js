import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore(
	'user',
	() => {
		const token = ref('')

		// 默认跳转到首页面
		const recirectURL = ref('/pages/index/index')

		// 跳转页面的方式
		const openType = ref('switchTab')

		return { token, recirectURL, openType }
	},
	{
		persist: {
			path: ['token', 'recirectURL', 'openType'], //数据持久化
		},
	}
)
