// uni全局对象方法

uni.utils = {
	/**
	 * 轻提示（showToast ）
	 */

	toast(title = '数据加载失败', icon = 'none') {
		uni.showToast({
			title,
			icon,
			mask: true,
		})
	},
}
