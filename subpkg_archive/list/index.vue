<!-- subpkg_archive/list/index.vue -->
<script setup>
	import { ref } from 'vue'
	import { onShow } from '@dcloudio/uni-app'
	import { patientListApi, removePatientApi } from '@/services/patient'

	// 患者列表数据
	const patientList = ref([])
	const pageShow = ref(false)

	const swipeOptions = ref([
		{
			text: '删除',
			style: {
				backgroundColor: '#dd524d',
			},
		},
	])

	// 点击删除按钮
	async function onSwipeActionClick(id, index) {
		// 后端调用接口删除
		const { code, message } = await removePatientApi(id)
		if (code !== 10000) return uni.utils.toast(message)
		// 前端删除数组内的内容
		patientList.value.splice(index, 1)
	}

	// 获取患者列表
	async function getPatientList() {
		const { data, code, message } = await patientListApi()

		if (code !== 10000) return uni.utils.toast(message)

		patientList.value = data
		pageShow.value = true
	}

	// 生命周期
	onShow(() => {
		getPatientList()
	})
</script>

<template>
	<scroll-page>
		<view class="archive-page" v-if="pageShow">
			<view class="archive-tips">最多可添加6人</view>

			<uni-swipe-action>
				<uni-swipe-action-item
					v-for="(patient, index) in patientList"
					:key="patient.id"
					:right-options="swipeOptions"
					@click="onSwipeActionClick(patient.id, index)"
				>
					<view
						class="archive-card"
						:class="{ active: patient.defaultFlag === 1 }"
					>
						<view class="archive-info">
							<text class="name">{{ patient.name }}</text>
							<text class="id-card">321***********6164</text>
							<text v-if="patient.defaultFlag === 1" class="default">默认</text>
						</view>
						<view class="archive-info">
							<text class="gender">{{ patient.genderValue }}</text>
							<text class="age">{{ patient.age }}岁</text>
						</view>
						<navigator
							hover-class="none"
							class="edit-link"
							:url="'/subpkg_archive/form/index?id=' + patient.id"
						>
							<uni-icons
								type="icon-edit"
								size="20"
								color="#16C2A3"
								custom-prefix="iconfont"
							/>
						</navigator>
					</view>
				</uni-swipe-action-item>
			</uni-swipe-action>

			<!-- 添加按钮 -->
			<view v-if="patientList.length < 6" class="archive-card">
				<navigator
					class="add-link"
					hover-class="none"
					url="/subpkg_archive/form/index"
				>
					<uni-icons color="#16C2A3" size="24" type="plusempty" />
					<text class="label">添加患者</text>
				</navigator>
			</view>
		</view>
	</scroll-page>
</template>

<style lang="scss">
	@import './index.scss';
</style>
