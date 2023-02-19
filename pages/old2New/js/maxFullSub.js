let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]

let columnId = 0
let pageNum = 1
let isLoading = false		//判断瀑布流是否加载中
let headImgArr = []			//用户头像


pageStatistics() 			// 页面统计
getUserInfo(sourcePlatform)	// 获取用户信息
// 广点通渠道统计
// gdt('track', 'VIEW_CONTENT', {});// 浏览

// 获取 瀑布流商品
getProductList()
function getProductList() {
	if (isLoading) return
	isLoading = true
	http('GET', `/mallv2/app/oldfornew/queryOldForNewColumnList2`, {
		columnId: 154,
		pageNum,
		pageSize: 20,
		activityType: 'OLD_FOR_NEW'
	}).then((res) => {
		isLoading = false
		let productList = res.data.columnList[0].productList
		if (productList.length == 0) isLoading = true
		pageNum ++
		
		// 商品数据渲染
		productListShow(productList, $('#productList'))
	}, err => {
		console.log(err)
	})
}
		
// 部分dom操作
$(function () {

	// 页面滚动事件
	$(window).on('scroll', function () {
		let scrollTop = $(this).scrollTop()
		let wHeight = $(this).height()
		let dHeight = $(document).height() -300
		
		// 滚动到底部
		if (scrollTop + wHeight > dHeight) {
			getProductList()
		}
	})
	
})