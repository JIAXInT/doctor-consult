<!-- subpkg_archive/form/index.vue -->
<script setup>
	import { ref } from 'vue'
	import {
		addPatientApi,
		patientDetailApi,
		updatePatientApi,
	} from '@/services/patient'

	const props = defineProps({ id: String })

	// 表单数据
	const formData = ref({
		name: '',
		idCard: '11010119890512132X',
		gender: 1,
		defaultFlag: 1,
	})

	// 表单组件
	const formRef = ref()

	// 表单验证规则
	const formRules = {
		name: {
			rules: [
				{ required: true, errorMessage: '请填写患者姓名' },
				{
					pattern: '^[\u4e00-\u9fa5]{2,5}$',
					errorMessage: '患者姓名为2-5位中文',
				},
			],
		},
		idCard: {
			rules: [
				{ required: true, errorMessage: '请输入身份证号' },
				{
					pattern:
						'^[1-9]\\d{5}(?:18|19|20)\\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\\d|30|31)\\d{3}[\\dXx]$',
					errorMessage: '身份证号格式不正确',
				},
			],
		},
		gender: {
			rules: [
				{ required: true, errorMessage: '请勾选患者姓名' },
				{
					validateFunction(rule, value, data, callback) {
						// 检测身份证号第17位是否为偶数
						if (data.idCard.slice(16, 17) % 2 !== value) {
							callback('选择的性别与身份号中性别不一致')
						}
						return true
					},
				},
			],
		},
	}

	// 是否为默认就诊人
	function onSwitchChange(ev) {
		console.log(ev)
		// 是否设置为默认就诊患人
		formData.value.defaultFlag = ev.detail.value ? 1 : 0
	}

	// 提交表单数据
	async function onFormSubmit() {
		try {
			// 表单验证
			await formRef.value.validate()

			// 区分是添加患者还是编辑患者
			props.id ? updatePatient() : addPatient()
		} catch (e) {
			//TODO handle the exception
		}
	}

	// 修改患者
	async function updatePatient() {
		const { code, message } = await updatePatientApi(formData.value)
		if (code !== 10000) return uni.utils.toast(message)

		uni.navigateBack()
	}

	// 添加患者
	async function addPatient() {
		// 调用接口
		const { code, message } = await addPatientApi(formData.value)
		// 检测接口是否调用成功
		if (code !== 10000) return uni.utils.toast(message)

		uni.navigateBack()
	}

	// 获取患者详情
	async function getPatientDetail() {
		// 根据id区分当前页面是添加患者还是修改患者
		if (!props.id) return

		// 动态修改导航栏文字
		uni.setNavigationBarTitle({
			title: '编辑患者',
		})

		const {
			data: { genderValue, age, ...rest },
			code,
			message,
		} = await patientDetailApi(props.id)
		if (code !== 10000) return uni.utils.toast(message)

		formData.value = rest
	}

	getPatientDetail()

	console.log(`测试用身份证号数据：
	110101198307212600
	110101196107145504
	11010119890512132X
	110101196501023433
	110101197806108758
	110101198702171378
	110101198203195893`)
</script>

<template>
	<scroll-page>
		<view class="archive-page">
			<uni-forms
				border
				ref="formRef"
				:model="formData"
				:rules="formRules"
				label-width="220rpx"
			>
				<uni-forms-item label="患者姓名" name="name">
					<uni-easyinput
						v-model="formData.name"
						placeholder-style="color: #C3C3C5; font-size: 32rpx"
						:styles="{ color: '#121826' }"
						:input-border="false"
						:clearable="false"
						placeholder="请填写真实姓名"
					/>
				</uni-forms-item>
				<uni-forms-item label="患者身份证号" name="idCard">
					<uni-easyinput
						v-model="formData.idCard"
						placeholder-style="color: #C3C3C5; font-size: 32rpx"
						:styles="{ color: '#121826' }"
						:input-border="false"
						:clearable="false"
						placeholder="请填写身份证号"
					/>
				</uni-forms-item>
				<uni-forms-item label="患者性别" name="gender">
					<uni-data-checkbox
						v-model="formData.gender"
						selectedColor="#16C2A3"
						:localdata="[
							{ text: '男', value: 1 },
							{ text: '女', value: 0 },
						]"
					/>
				</uni-forms-item>
				<uni-forms-item label="默认就诊人">
					<view class="uni-switch">
						<switch
							checked
							color="#20c6b2"
							style="transform: scale(0.7)"
							@change="onSwitchChange"
							:checked="formData.defaultFlag === 1"
						/>
					</view>
				</uni-forms-item>
				<button class="uni-button" @click="onFormSubmit">保存</button>
			</uni-forms>
		</view>
	</scroll-page>
</template>

<style lang="scss">
	@import './index.scss';
</style>
