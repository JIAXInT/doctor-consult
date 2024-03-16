<template>
	<view>
		<button @click="onButtonClick" type="primary">测试请求</button>
	</view>
</template>

<script setup>
	import { http } from '@/utils/http.js'

	async function onButtonClick() {
		const res = await http.request({
			url: '/echo',
		})

		console.log(res)
		uni.utils.toast('test')
	}
</script>

<style lang="scss"></style>
