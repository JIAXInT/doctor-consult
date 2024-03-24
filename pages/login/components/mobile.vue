<!-- pages/login/components/mobile.vue -->
<script setup>
	import { ref } from 'vue'
	import { loginByMobileApi, verifyCodeApi } from '@/services/user'
	import { useUserStore } from '@/stores/user.js'

	// 用户相关数据
	const userStore = useUserStore()

	// 表单数据
	const formData = ref({
		mobile: '13230000038',
		code: '',
	})

	// 验证表单数据的规则
	const formRules = {
		mobile: {
			rules: [
				{ required: true, errorMessage: '请填写手机号码' },
				{ pattern: '^1\\d{10}$', errorMessage: '手机号码格式不正确' },
			],
		},
		code: {
			rules: [
				{ required: true, errorMessage: '请输入验证码' },
				{ pattern: '^\\d{6}$', errorMessage: '验证码格式不正确' },
			],
		},
	}

	// 获取组件实例
	const formRef = ref()

	// 定义是否同意协议
	const isAgree = ref(false)

	// 是否显示倒计时
	const showCountdown = ref(false)
	const buttonText = ref('获取验证码')
	async function onTextButtonClick() {
		try {
			// 验证手机号是否合法
			await formRef.value.validateField(['mobile'])

			// 调用接口获取验证码
			const { code, data, message } = await verifyCodeApi({
				mobile: formData.value.mobile,
				type: 'login',
			})

			// 验证接口是否调用成功
			if (code !== 10000) return uni.utils.toast(message)

			// 开始倒计时
			showCountdown.value = true
		} catch (e) {
			//TODO handle the exception
		}
	}
	function onCountdownTimeup() {
		showCountdown.value = false
		buttonText.value = '再次获取验证码'
	}

	// 提交表单
	async function onFormSubmit() {
		if (!isAgree.value) return uni.utils.toast('请勾选协议')
		try {
			const result = await formRef.value.validate()
			const { code, data, message } = await loginByMobileApi(result)

			// 检测接口是否调用成功
			if (code !== 10000) return uni.utils.toast(message)

			// 将token存入pinia
			userStore.token = data.token

			// 跳转页面
			uni[userStore.openType]({ url: userStore.recirectURL })
		} catch (error) {
			console.log(error)
		}
	}
</script>

<template>
	<uni-forms
		class="login-form"
		:rules="formRules"
		:model="formData"
		ref="formRef"
	>
		<uni-forms-item name="mobile">
			<uni-easyinput
				:input-border="false"
				:clearable="false"
				v-model="formData.mobile"
				placeholder="请输入手机号"
				placeholder-style="color: #C3C3C5"
			/>
		</uni-forms-item>
		<uni-forms-item name="code">
			<uni-easyinput
				:input-border="false"
				:clearable="false"
				v-model="formData.code"
				placeholder="请输入验证码"
				placeholder-style="color: #C3C3C5"
			/>
			<view v-if="showCountdown" class="text-button">
				<custom-countdown
					:show-day="false"
					:show-hour="false"
					:show-minute="false"
					:second="10"
					color="#16c2a3"
					@timeup="onCountdownTimeup"
				></custom-countdown
				>秒后重新获取
			</view>
			<text v-else @click="onTextButtonClick" class="text-button">{{
				buttonText
			}}</text>
		</uni-forms-item>

		<view class="agreement">
			<radio
				@click="isAgree = !isAgree"
				:checked="isAgree"
				color="#16C2A3"
			/>
			我已同意
			<text class="link">用户协议</text>
			及
			<text class="link">隐私协议</text>
		</view>

		<button @click="onFormSubmit" class="uni-button">登 录</button>
	</uni-forms>
</template>

<script>
	export default {
		options: {
			styleIsolation: 'shared',
		},
	}
</script>

<style lang="scss">
	@import './styles.scss';
</style>