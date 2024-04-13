<script setup>
	import { computed, ref } from 'vue'
	import feedList from './components/feed-list.vue'
	import { doctorListApi, feedListApi } from '../../services/doctor.js'
	import doctorList from './components/doctor-list.vue'

	// 获取安全区域数据
	const { safeAreaInsets } = uni.getSystemInfoSync()

	// 标签页索引值
	const tabIndex = ref(0)
	// 标签页数据
	const feedTabs = ref([
		{
			label: '推荐',
			type: 'recommend',
			current: 1,
			hasMore: true,
			list: [],
			rendered: true,
		},
		{
			label: '关注',
			type: 'like',
			current: 1,
			hasMore: true,
			list: [],
			rendered: false,
		},
		{
			label: '减脂',
			type: 'fatReduction',
			current: 1,
			hasMore: true,
			list: [],
			rendered: false,
		},
		{
			label: '饮食',
			type: 'food',
			current: 1,
			hasMore: true,
			list: [],
			rendered: false,
		},
	])

	// 医生列表
	const doctorItems = ref([])

	// 类型数据
	const feedType = computed(() => feedTabs.value[tabIndex.value].type)

	// 页码数据
	const feedCurrent = computed(() => feedTabs.value[tabIndex.value].current)

	// 每页条数
	const feedPageSize = ref(5)

	// 切换标签页
	function onFeedTabChange({ index }) {
		tabIndex.value = index

		// 只有组件未被加载时才请求数据（保证只有一次）
		if (!feedTabs.value[tabIndex.value].rendered) getFeedList()

		// 标记组件是否被渲染过
		feedTabs.value[tabIndex.value].rendered = true
	}

	// 滚动加载更多数据
	function onScrollToLower() {
		// hasMore 为 true 时才去请求
		if (feedTabs.value[tabIndex.value].hasMore) getFeedList()
	}

	// 首页列表数据
	async function getFeedList() {
		const { code, data, message } = await feedListApi({
			type: feedType.value,
			current: feedCurrent.value,
			pageSize: feedPageSize.value,
		})
		// 检测接口是否调用成功
		if (code !== 10000) return uni.utils.toast(message)

		// 过滤掉 html 标签
		data.rows.forEach((row) => {
			row.content = row.content.replace(/<[^>]+>/g, '')
		})

		// 将调取的数据放到不同的list中
		// 根据索引值区分放到哪一个list
		const list = feedTabs.value[tabIndex.value].list
		feedTabs.value[tabIndex.value].list = [...list, ...data.rows]

		// 列表数据的页码
		let current = feedTabs.value[tabIndex.value].current

		// 页码加一,保证下一页的请求
		feedTabs.value[tabIndex.value].current = current + 1

		// 判断是否有更多数据
		feedTabs.value[tabIndex.value].hasMore = current + 1 <= data.pageTotal
	}
	getFeedList()

	// 获取医生列表数据
	async function getDoctorList() {
		const { data, code, message } = await doctorListApi()
		if (code !== 10000) return uni.utils.toast(message)

		doctorItems.value = data.rows
	}
	getDoctorList()
</script>

<template>
	<scroll-page @scrolltolower="onScrollToLower">
		<view
			class="index-page"
			:style="{ backgroundPositionY: -48 + safeAreaInsets.top + 'px' }"
		>
			<!-- 页面导航 -->
			<view
				:style="{ paddingTop: safeAreaInsets.top + 'px' }"
				class="page-navbar"
			>
				优医
			</view>

			<!-- 搜索栏 -->
			<view class="search-bar">
				<input
					placeholder-class="input-placeholder"
					placeholder="搜一搜: 疾病/症状/医生/健康知识"
					class="input"
					type="text"
				/>
				<view class="icon-search">
					<uni-icons size="22" color="#C3C3C5" type="search" />
				</view>
			</view>
			<!-- 快速入口 -->
			<view class="quick-entry">
				<navigator
					hover-class="none"
					class="quick-entry-item"
					url="/subpkg_consult/quickly/index?type=1"
				>
					<image
						class="quick-entry-icon"
						src="/static/images/quick-entry-1.png"
					/>
					<text class="label">问医生</text>
					<text class="small">按科室查问医生</text>
				</navigator>
				<navigator
					hover-class="none"
					class="quick-entry-item"
					url="/subpkg_consult/quickly/index?type=2"
				>
					<image
						class="quick-entry-icon"
						src="/static/images/quick-entry-2.png"
					/>
					<text class="label">极速问诊</text>
					<text class="small">20s医生极速回复</text>
				</navigator>
				<navigator hover-class="none" class="quick-entry-item">
					<image
						class="quick-entry-icon"
						src="/static/images/quick-entry-3.png"
					/>
					<text class="label">开药门诊</text>
					<text class="small">线上买药更方便</text>
				</navigator>
			</view>
			<!-- 快速查看 -->
			<view class="quick-view">
				<navigator
					hover-class="none"
					class="quick-view-item"
					url="/subpkg_medicine/order_list/index"
				>
					<image
						class="quick-view-icon"
						src="/static/images/quick-view-1.png"
					/>
					<text class="label">药品订单</text>
				</navigator>
				<navigator
					hover-class="none"
					class="quick-view-item"
					url="/subpkg_archive/list/index"
				>
					<image
						class="quick-view-icon"
						src="/static/images/quick-view-2.png"
					/>
					<text class="label">健康档案</text>
				</navigator>
				<navigator hover-class="none" class="quick-view-item">
					<image
						class="quick-view-icon"
						src="/static/images/quick-view-3.png"
					/>
					<text class="label">我的处方</text>
				</navigator>
				<navigator hover-class="none" class="quick-view-item">
					<image
						class="quick-view-icon"
						src="/static/images/quick-view-4.png"
					/>
					<text class="label">疾病查询</text>
				</navigator>
			</view>
			<!-- 广告位 -->
			<view class="banner-placeholder">
				<swiper
					class="uni-swiper"
					indicator-dots
					indicator-color="#ffffff99"
					indicator-active-color="#fff"
					circular
				>
					<swiper-item>
						<navigator hover-class="none" class="navigator" url=" ">
							<image class="banner-image" src="/static/images/banner-1.png" />
						</navigator>
					</swiper-item>
					<swiper-item>
						<navigator hover-class="none" class="navigator" url=" ">
							<image
								class="banner-image"
								src="/static/images/banner-1.png"
								mode="aspectFill"
							/>
						</navigator>
					</swiper-item>
				</swiper>
			</view>

			<!-- 首页列表 -->
			<view
				class="doctor-feeds"
				:style="{ marginTop: -safeAreaInsets.top + 'px' }"
			>
				<custom-sticky :offset-top="safeAreaInsets.top + 'px'">
					<custom-tabs @click="onFeedTabChange" :list="feedTabs" />
				</custom-sticky>

				<view
					v-for="(feed, index) in feedTabs"
					:key="feed.type"
					v-show="tabIndex === index"
				>
					<doctor-list
						:list="doctorItems"
						v-show="feedType === 'recommend'"
					></doctor-list>
					<feed-list :list="feed.list" v-if="feed.rendered" />
				</view>
			</view>
		</view>
	</scroll-page>
</template>

<style lang="scss">
	@import './index.scss';
</style>
