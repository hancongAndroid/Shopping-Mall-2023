let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]

let pageNum = 1
let isLoading = false		//判断瀑布流是否加载中

pageStatistics() 			// 页面统计
// 广点通渠道统计
// gdt('track', 'VIEW_CONTENT', {});// 浏览

let brandId = getUrlKey('brandId')	// 品牌信息
let productId = getUrlKey('id')		// 商品列表

// url有传brandId就分开获取 品牌信息和商品列表
if (brandId) {
	getBrandIfo()
	getProductList()
} else {
	getBrandIfoAndProductList()
}

// 获取 品牌信息
function getBrandIfo() {
	http('GET', `/mallv2/brand/pavilion/info`, {
		id: brandId,
		pageSize: 10,
		pageNum: 1
	}).then((res) => {
		isLoading = false
		let data = res.data
		
		// 品牌信息
		$('#wrapper').css('background-image', `url(${data.brandBgimage}?x-oss-process=image/resize,w_750,m_lfit)`)
		$('#brandLogo').attr('src', `${data.brandLogo}?x-oss-process=image/resize,w_100,m_lfit`)
		$('#brandName').text(data.brandName)
		$('#discount').text(data.discount)
		$('#brandStory').text(data.brandStory)
		
	}, err => {
		console.log(err)
	})
}

// 获取 商品列表
function getProductList() {
	if (isLoading) return
	isLoading = true
	http('GET', `/mallv2/subjectsController/getProducts`, {
		id: productId,
		pageSize: 10,
		pageNum
	}).then((res) => {
		isLoading = false
		let data = res.data
		let productList = data.list
		// console.log('商品:', productList)
		if (productList.length == 0) isLoading = true
		pageNum ++
		
		// 商品数据渲染
		productListBrand(productList, $('#productList'))
		
	}, err => {
		console.log(err)
	})
}

// 获取 品牌信息 和 商品列表（只有一个id的情况）
function getBrandIfoAndProductList() {
	if (isLoading) return
	isLoading = true
	http('GET', `/mallv2/brand/pavilion/info`, {
		id: productId,
		pageSize: 10,
		pageNum: 1
	}).then((res) => {
		isLoading = false
		let data = res.data
		let productList = data.brandProducts
		if (productList.length == 0) isLoading = true
		// 该品牌暂无在售商品
		if (pageNum == 1 && productList.length == 0) {
			layer.open({
				content: '该品牌暂无在售商品',
				skin: 'msg',
				time: 1.5
			})
		}
		pageNum ++
		
		// 品牌信息
		$('#wrapper').css('background-image', `url(${data.brandBgimage}?x-oss-process=image/resize,w_750,m_lfit)`)
		$('#brandLogo').attr('src', `${data.brandLogo}?x-oss-process=image/resize,w_100,m_lfit`)
		$('#brandName').text(data.brandName)
		$('#discount').text(data.discount)
		$('#brandStory').text(data.brandStory)
		
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
		}
	})
})