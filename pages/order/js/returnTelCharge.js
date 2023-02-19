let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]

let pageNum = 1
let isLoading = false		//判断瀑布流是否加载中

// 获取金额请求相应送话费商品
var amount = getUrlKey('amount')
if (amount) {
	if (amount == 30) {
		$('#bannerImg').attr('src', 'https://img.quanminyanxuan.com/other/927ac3f4efe9436081bed9177eb96993.png')
	} else if (amount == 100) {
		$('#bannerImg').attr('src', 'https://img.quanminyanxuan.com/other/9a4a4f39a0bb41f1bdc8e8c673fab429.png')
	} else if (amount == 200) {
		$('#bannerImg').attr('src', 'https://img.quanminyanxuan.com/other/16185d1d9a0e4ac69ddd77420ffeb717.png')
	}
}else{
	$('#bannerImg').attr('src', 'https://img.quanminyanxuan.com/other/2edd01874b2849b79baf1f2ac34764a8.png')
}

pageStatistics() 			// 页面统计
getUserInfo(sourcePlatform)	// 获取用户信息

// 获取 商品列表 数据
getProductList()
function getProductList() {
	if (isLoading) return
	http('GET', `/mallv2/activity/getActivityList`, {
		pageNum,
		pageSize: 30,
		activityType: 'RECHARGE_COUPON',
		activityMax: amount
	}).then((res) => {
		isLoading = false
		let productList = res.data
		console.log('商品:', productList)
		if (productList.length == 0) isLoading = true
		pageNum ++
		
		// 商品数据渲染
		productListRecharge(productList, $('#productList'))
	}, err => {
		console.log(err)
	})
}

// 部分dom操作
$(function () {
	
	// 规则弹窗
	$('#ruleShow').on('click', function() {
		$('#ruleBox').removeClass('dn')
	})
	$('#ruleHide').on('click', function() {
		$('#ruleBox').addClass('dn')
	})
	
	// 页面滚动事件
	$(window).on('scroll', function () {
		let scrollTop = $(this).scrollTop()
		let wHeight = $(this).height()
		let dHeight =$(document).height() - 300
		
		// 滚动到底部
		if (scrollTop + wHeight > dHeight) {
			getProductList()
			isLoading = true
		}
	})

})