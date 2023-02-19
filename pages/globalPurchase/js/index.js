let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]

let columnId = 95
let pageNum = 1
let isLoading = false		//判断瀑布流是否加载中

pageStatistics() 			// 页面统计
getUserInfo(sourcePlatform)	// 获取用户信息

// 获取 直营精选 数据
getDirectProductList()
function getDirectProductList() {
	http('GET', `/mallv2/subjectsController/getActivitiesGoods`, {
		activeType: 'DIRECT_PIC',
		id: 58
	}).then((res) => {
		let data = res.data
		let html = ''
		$.each(data, (index, item) => {
			html += `<div class="p-item" onclick="window.open('../productDetail/guessProductDetail.html?productId=${item.id}', '_self')">
						<img class="img" src="${item.productImg}" >
						<!--<img class="icon-state" src="https://img.quanminyanxuan.com/other/9ffe0d02dcc2407d8729653da15c0fe6.png" >-->
						<div class="info">
							<span class="name">${item.productName}</span>
							<span class="label">${index == 0 ? '种草' : '月销'}${filterVolume(item.volumeStr)}件</span>
							<span class="txt">精选价</span>
							<span class="price">${item.price}<span class="oprice">￥${item.originalPrice}</span></span>
						</div>
					</div>`
		})
		$('#recProduct1').html(html)
		
	}, err => {
		console.log(err)
	})
}

// 获取 大牌特惠 数据
getTopbrandProductList()
function getTopbrandProductList() {
	http('GET', `/mallv2/subjectsController/getActivitiesGoods`, {
		activeType: 'TOPBRAND_DISCOUNTS',
		id: 57
	}).then((res) => {
		let data = res.data
		let html = ''
		$.each(data, (index, item) => {
			html += `<div class="p-item" onclick="window.open('../productDetail/guessProductDetail.html?productId=${item.id}', '_self')">
						<img class="img" src="${item.productImg}" >
						<!--<img class="icon-state" src="https://img.quanminyanxuan.com/other/9ffe0d02dcc2407d8729653da15c0fe6.png" >-->
						<div class="info">
							<span class="name">${item.productName}</span>
							<span class="label">直降<br>¥${item.originalPrice - item.price}</span>
							<span class="price">${item.price}</span>
						</div>
					</div>`
		})
		$('#recProduct2').html(html)
		
	}, err => {
		console.log(err)
	})
}

// 获取 导航 数据
getNavigationList()
function getNavigationList() {
	http('GET', `/mallv2/subjectsController/getSubjectsInfo/3`).then((res) => {
		let data = res.data.subjectPlateDtos
		let html = ''
		$.each(data, (index, item) => {
			html += `<li class="nav-item ${index == 0 ? 'active' : ''}" data-id="${item.id}">${item.title}</li>`
		})
		$('#navigation').html(html)
		
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
		id: columnId
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
	
	// 选项卡切换商品列表
	$('#navigation').on('click', '.nav-item', function() {
		if ($(this).hasClass('active')) return	//点击当前无操作
		pageNum = 1
		isLoading = false
		$(this).addClass('active').siblings().removeClass('active')
		columnId = $(this).data('id')
		$('#productList').html('')
		$('html, body').scrollTop($('.product-wrap').offset().top + 10)
		getProductList()
	})
	
	// 返回顶部
	// $('#backTop').on('click', function() {
	// 	$('html, body').animate({
	// 		scrollTop: 0
	// 	}, 500)
	// })
	
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