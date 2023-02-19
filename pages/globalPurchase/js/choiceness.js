let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]

let pageNum = 1
let isLoading = false		//判断瀑布流是否加载中

pageStatistics() 			// 页面统计
getUserInfo(sourcePlatform)	// 获取用户信息

// 获取 热门推荐 数据
getHotProductList()
function getHotProductList() {
	http('GET', `/mallv2/subjectsController/getActivitiesGoods`, {
		activeType: 'TODAY_HOT',
		id: 58
	}).then((res) => {
		let data = res.data
		let html = ''
		$.each(data, (index, item) => {
			html += `<div class="scroll-item" onclick="window.open('../productDetail/guessProductDetail.html?productId=${item.id}', '_self')">
						<img class="cover" src="${item.productImg}">
						<div class="name">${item.productName}</div>
						<div class="price">特惠价：<span class="num">${item.price}</span></div>
						<div class="btn">立即抢购</div>
					</div>`
		})
		$('#hotProductList').html(html)
		
	}, err => {
		console.log(err)
	})
}

// 获取 商品列表 数据
getProductList()
function getProductList() {
	if (isLoading) return
	isLoading = true
	http('GET', `/mallv2/subjectsController/getProducts`, {
		pageNum,
		pageSize: 10,
		id: 109
	}).then((res) => {
		isLoading = false
		let productList = res.data.list
		// console.log('商品:', productList)
		if (productList.length == 0) isLoading = true
		pageNum ++
		
		// 商品数据渲染
		productListGlobal(productList, $('#productList'))
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
			getProductList()
			isLoading = true
		}
	})
})