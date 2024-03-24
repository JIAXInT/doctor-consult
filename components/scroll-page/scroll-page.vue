<script setup>
	// 读取页面视口高度
	const { windowHeight } = uni.getSystemInfoSync()

	// 自定义组件属性
	const scrollPageProps = defineProps({
		borderStyle: {
			type: [String, Boolean],
			default: false,
		},
		refresherEnabled: {
			type: Boolean,
			default: false,
		},
		refresherTriggered: {
			type: Boolean,
			default: false,
		},
		backgroundColor: {
			type: String,
			default: '#fff',
		},
	})

	defineEmits(['scrolltolower', 'refresherrefresh'])
</script>

<template>
	<scroll-view
		:style="{
			height: windowHeight + 'px',
			borderBottom: scrollPageProps.borderStyle,
			boxSizing: 'border-box',
			backgroundColor: scrollPageProps.backgroundColor,
		}"
		scroll-y="true"
		:refresherEnabled="scrollPageProps.refresherEnabled"
		:refresherTriggered="scrollPageProps.refresherTriggered"
		@refresherrefresh="$emit('refresherrefresh', $event)"
		@scrolltolower="$emit('scrolltolower', $event)"
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
