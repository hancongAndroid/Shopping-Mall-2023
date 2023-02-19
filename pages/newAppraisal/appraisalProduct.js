let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]

let pageNum = 1
let isLoading = false		//判断瀑布流是否加载中
let specialId = 6

pageStatistics() 			// 页面统计
getUserInfo(sourcePlatform)	// 获取用户信息

// 获取 商品列表 数据
// getProductList()
function getProductList() {
	if (isLoading) return
	http('GET', ``, {
		// specialId,
		// pageSize: 30,
		// pageNum,
		// activityType: 'NORMAL'
	}).then((res) => {
		isLoading = false
		let productList = res.data.list
		console.log('商品:', productList)
		if (productList.length == 0) isLoading = true
		pageNum ++
		
		let html = ''
		$.each(productList, (index, item) => {
			html += ``
		})
		$('#productList').append(html)
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
			// getProductList()
			isLoading = true
		}
	})

})