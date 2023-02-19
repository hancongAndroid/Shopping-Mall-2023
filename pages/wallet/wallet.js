let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]

let pageNum = 1
let isLoading = false		//判断瀑布流是否加载中

// 第一次进页面商品不随机
let flag = 1
let firstIntoWallet = localStorage.getItem('firstIntoWallet')
if (!firstIntoWallet) {
	localStorage.setItem('firstIntoWallet', 1)
	flag = 0
}

pageStatistics() 			// 页面统计
getUserInfo(sourcePlatform)	// 获取用户信息

// 获取钱包
;(function() {
	http('GET', `/mallv2/h5/walletdeduct/account`).then((res) => {
		let userInfo = res.data
		$('#amount').text(userInfo.amount)
	}, err => {
		console.log(err)
	})
})()

// 获取 商品列表
getProductList()
function getProductList() {
	if (isLoading) return
	isLoading = true
	http('GET', `/mallv2/activity/getActivityList`, {
		pageNum,
		pageSize: 14,
		activityType: 'GUESS_LIKE'
	}).then((res) => {
		isLoading = false
		let productList = res.data
		console.log('瀑:', productList)
		if (productList.length == 0) isLoading = true
		pageNum ++
		
		// 商品数据渲染
		productListGuess(productList, $('#productList'))
	}, err => {
		console.log(err)
	})
}

// 部分dom操作
$(function () {
	
	// 立即使用
	$('#btnUse').on('click', function(){
		let productBoxTop = $('.product-header').offset().top + 3
		$('html, body').scrollTop(productBoxTop)
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