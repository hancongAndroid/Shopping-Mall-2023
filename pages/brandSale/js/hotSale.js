let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]

let pageNum = 1
let isLoading = false		//判断瀑布流是否加载中

pageStatistics() 			// 页面统计
getUserInfo(sourcePlatform)	// 获取用户信息
// 广点通渠道统计
// gdt('track', 'VIEW_CONTENT', {});// 浏览

// 获取 推荐商品
getRecommendProductList()
function getRecommendProductList() {
	http('GET', `/mallv2/subjectsController/getActivitiesGoods`,{
		activeType: 'TODAY_HOT',
		id: 55
	}).then((res) => {
		let productList = res.data
		let html = ''
		$.each(productList, (index, item) => {
			if (index > 2) return
			html += `<div class="p-item" onclick="window.open('../productDetail/brandSaleProductDetail.html?productId=${item.id}', '_self')">
						<img class="img" src="${item.productImg}?x-oss-process=image/resize,w_260,m_lfit" >
						<div class="price">${item.price}</div>
						<div class="price2">价格￥${item.originalPrice}</div>
					</div>`
		})
		$('#recommendList').append(html)
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
		id: 105,
		pageSize: 10,
		pageNum
	}).then((res) => {
		isLoading = false
		let productList = res.data.list
		// console.log('商品:', productList)
		if (productList.length == 0) isLoading = true
		pageNum ++
		
		// 商品数据渲染
		productListBrand(productList, $('#productList'))
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