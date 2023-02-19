let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]

let pageNum = 1
let isLoading = false		//判断瀑布流是否加载中
let columnId = 0
let flag = 1

// 获取金额请求相应补贴金商品
var aumont = getUrlKey('aumont')
if (aumont) {
	console.log(aumont,'aumont')
	if (aumont == 500) {
		flag = 1
		$('#bannerImg').attr('src', 'https://img.quanminyanxuan.com/other/2edd01874b2849b79baf1f2ac34764a8.png')
	} else if (aumont == 1000) {
		flag = 2
		$('#bannerImg').attr('src', 'https://img.quanminyanxuan.com/other/b540800a1985407683d3e0f91009ca5d.png')
	} else if (aumont == 2000) {
		flag = 3
		$('#bannerImg').attr('src', 'https://img.quanminyanxuan.com/other/98d2d76b9163453ca9070ba1bb0802e6.png')
	}
}else{
	$('#bannerImg').attr('src', 'https://img.quanminyanxuan.com/other/2edd01874b2849b79baf1f2ac34764a8.png')
}

timer()						// 倒计时
pageStatistics() 			// 页面统计
getUserInfo(sourcePlatform)	// 获取用户信息

// 获取 瀑布流商品 数据
getColumnProductList()
function getColumnProductList() {
	if (isLoading) return
	http('GET', `/mallv2/h5/oldfornew/queryOldForNewListByPage`, {
		columnId,
		pageNum,
		pageSize: 30,
		flag
	}).then((res) => {
		isLoading = false
		let productList = res.data
		console.log('瀑布流商品:', productList)
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
		let dHeight =$(document).height() - 300
		
		// 滚动到底部
		if (scrollTop + wHeight > dHeight) {
			getColumnProductList()
			isLoading = true
		}
	})
})