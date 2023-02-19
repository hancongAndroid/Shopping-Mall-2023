let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]
let pageNum = 1
let isLoading = false		//判断瀑布流是否加载中
let id = getUrlKey('specialId')
let type = 'COMPOSITE'		//瀑布流排序

pageStatistics() 			// 页面统计
getUserInfo(sourcePlatform)	// 获取用户信息

// 获取 商品列表 数据
getProductList()
function getProductList() {
	if (isLoading) return
	isLoading = true
	http('POST', `/mallv2/product/getProductBySpecial`, {
		pageNum,
		pageSize: 10,
		specialId: id,
		type
	}).then((res) => {
		isLoading = false
		let productList = res.data
		// console.log('商品:', productList)
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
	
	// 选项卡切换商品列表
	let price = 'MIN'
	$('#tabBox').on('click', '.tabbar-item', function() {
		let self = $(this)
		type = self.data('type')
		if (self.hasClass('active') && type != 'PRICE') return	//点击当前无操作
		self.addClass('active').siblings().removeClass('active')
		
		// 价格排序
		if (type == 'PRICE') {
			if (price == 'MIN') {
				price = 'MAX'
				type = 'PRICE_MIN'
				$('.sort-up').attr('src', 'https://img.quanminyanxuan.com/other/eda14e42e9b941449742de6758d76871.png')
				$('.sort-down').attr('src', 'https://img.quanminyanxuan.com/other/c3c718f65a014661ba992c398fb1de7d.png')
			} else {
				price = 'MIN'
				type = 'PRICE_MAX'
				$('.sort-up').attr('src', 'https://img.quanminyanxuan.com/other/c1a28672e7044c62af6bf5e93df52a03.png')
				$('.sort-down').attr('src', 'https://img.quanminyanxuan.com/other/5bda268460594a58abfcdc5e58acf110.png')
			}
		} else {
			price = 'MIN'
			$('.sort-up').attr('src', 'https://img.quanminyanxuan.com/other/c1a28672e7044c62af6bf5e93df52a03.png')
			$('.sort-down').attr('src', 'https://img.quanminyanxuan.com/other/c3c718f65a014661ba992c398fb1de7d.png')
		}
		
		pageNum = 1
		isLoading = false
		$('#productList').html('')
		$('html, body').scrollTop(0)
		getProductList()
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