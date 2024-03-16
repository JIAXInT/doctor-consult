import Request from 'luch-request'

// 实例化网络请求模块
const http = new Request({
	// 接口基地址
	baseURL: 'https://t1ps66c7na.hk.aircode.run',
	custom: {
		loading: true,
	},
})

// 请求拦截器
http.interceptors.request.use((config) => {
	// config => 请求时的参数，包含请求头等

	if (config.custom.loading) {
		uni.showLoading({
			title: '正在加载...',
			mask: true,
		})
	}

	// 使局部的头信息覆盖全局的头信息
	config.header = {
		Authorization: '111111',
		...config.header,
	}

	return config
})

// 响应拦截器
http.interceptors.response.use(
	function ({ data, statusCode }) {
		uni.hideLoading()

		return data
	},
	function (error) {
		uni.hideLoading()

		return Promise.reject(error)
	}
)

export { http }
