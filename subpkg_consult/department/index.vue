<!-- subpkg_consult/department/index.vue -->
<script setup>
	import { ref, computed } from 'vue'
	import { departmentListApi } from '@/services/consult'

	const props = defineProps({
		type: String,
		illnessType: String,
	})

	// 科室列表数据
	const departmentList = ref([])

	// 高亮状态的科室索引
	const tabIndex = ref(0)

	// 二级科室数据
	const childDepartmentList = computed(() => {
		return departmentList.value[tabIndex.value]?.child
	})

	// 切换高亮状态
	function onTopDeparmentClick(index) {
		tabIndex.value = index

		console.log(departmentList.value, index)
	}

	// 获取科室列表
	async function getDepartmentList() {
		const { code, data, message } = await departmentListApi()
		if (code !== 10000) uni.utils.toast(message)

		// 接受数据并渲染
		departmentList.value = data
	}
	getDepartmentList()
</script>

<template>
	<view class="department-page">
		<scroll-view scroll-y class="department-primary">
			<view
				v-for="(department, index) in departmentList"
				:key="department.id"
				@click="onTopDeparmentClick(index)"
				:class="{ active: tabIndex === index }"
				class="department-item"
			>
				{{ department.name }}
			</view>
			<view class="department-item"></view>
		</scroll-view>
		<!-- 二级科室 -->
		<scroll-view class="department-secondary">
			<navigator
				v-for="childDepartment in childDepartmentList"
				:key="childDepartment.id"
				hover-class="none"
				:url="`/subpkg_consult/description/index?type=${props.type}&illnessType=${props.illnessType}&depId=${childDepartment.id}`"
				class="department-item"
			>
				{{ childDepartment.name }}
			</navigator>
		</scroll-view>
	</view>
</template>

<style lang="scss">
	@import './index.scss';
</style>
