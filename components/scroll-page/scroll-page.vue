<script setup>
	// 读取页面视口高度
	const { windowHeight } = uni.getSystemInfoSync()

	console.log(windowHeight)
</script>

<template>
	<scroll-view
		style="background-color: aqua"
		:style="{ height: windowHeight + 'px' }"
		scroll-y="true"
	>
		<view class="scroll-page-content">
			<slot></slot>
		</view>
	</scroll-view>
</template>

<style lang="scss">
	.scroll-page-content {
		padding-bottom: env(safe-area-inset-bottom);
	}
</style>
