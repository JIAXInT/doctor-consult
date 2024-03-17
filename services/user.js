import { http } from '@/utils/http.js'

export const verifyCodeApi = (data) => {
	return http.get('/code', { params: data })
}

export const loginByMobileApi = (data) => {
	return http.post('login', data)
}
