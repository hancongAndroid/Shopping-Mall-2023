let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]
let pageNum = 1

pageStatistics() 			// 页面统计
getUserInfo(sourcePlatform)	// 获取用户信息
// 广点通渠道统计
// gdt('track', 'VIEW_CONTENT', {});// 浏览

// 获取 品牌商品 1
// ;(function () {
// 	http('GET', `/mallv2/brand/pavilion/info`, {
// 		id: 284,
// 		pageSize: 3,
// 		pageNum: 1
// 	}).then((res) => {
// 		let productList = res.data.brandProducts
// 		let html = ''
// 		$.each(productList, (index, item) => {
// 			html += `<div class="product-item">
// 						<img class="img" src="${item.productImg}" >
// 						<div class="info">
// 							<i class="label">特卖价</i>
// 							<div class="price">
// 								<span class="price1">￥<span class="num">${item.price}</span></span>
// 								<span class="price2">${tofixed(parseInt(item.originalPrice) / item.price)}折</span>
// 							</div>
// 						</div>
// 					</div>`
// 		})
// 		$('#brand-sale-product-1').append(html)
// 	}, err => {
// 		console.log(err)
// 	})
// })()

// 获取 品牌列表
let brandIdArr = []
getProductList()
function getProductList() {
	http('GET', `/mallv2/subjectsController/getSubjectsInfo/2`).then((res) => {
		let productList = res.data.subjectPlateDtos
		let html = ''
		console.log('品牌',productList)
		$.each(productList, (index, item) => {
			// if (index > productList.length - 4) return
			html += `<div class="brand-sale-item" onclick="window.open('../brandSale/brandClassify.html?id=${item.brandId}', '_self')">
					<div class="brand-sale-top">
						<div class="logo">
							<img class="logo-img" src="${item.productSubjectPlateList.length > 0 && item.productSubjectPlateList[0].brandLogo}" >
						</div>
						<span class="name">${item.title}</span>
						<span class="btn">进入专场</span>
					</div>
					<div class="brand-sale-product" id="brand-sale-product-${item.brandId}">`
					
					if (item.productSubjectPlateList.length > 0) {
						$.each(item.productSubjectPlateList, (index1, item1) => {
							if (index1 > 2) return false 
							html += `<div class="product-item">
										<img class="img" src="${item1.productImg}" >
										<div class="info">
											<i class="label">特卖价</i>
											<div class="price">
												<span class="price1">￥<span class="num">${item1.price}</span></span>
												<span class="price2">${tofixed(item1.price / parseInt(item1.originalPrice) * 10)}折</span>
											</div>
										</div>
									</div>`
						})
					}
			html += `</div>
				</div>`
		})
		$('#brandSaleList').append(html)
	}, err => {
		console.log(err)
	})
}

// 保留小数
function tofixed(num) {
	return num.toFixed(1)
}

// 获取 商品列表 数据
getProductList1()
function getProductList1() {
	http('GET', `/mallv2/subjectsController/getProducts`, {
		id: 104,
		pageSize: 50,
		pageNum
	}).then((res) => {
		let productList = res.data.list
		// console.log('商品:', productList)
		pageNum ++
		
		// 商品数据渲染
		productListBrand(productList, $('#productList1'))
	}, err => {
		console.log(err)
	})
}

// 获取 商品列表 数据
getProductList2()
function getProductList2() {
	http('GET', `/mallv2/subjectsController/getProducts`, {
		id: 105,
		pageSize: 50,
		pageNum
	}).then((res) => {
		let productList = res.data.list
		// console.log('商品:', productList)
		pageNum ++
		
		// 商品数据渲染
		productListBrand(productList, $('#productList2'))
	}, err => {
		console.log(err)
	})
}

// 获取 商品列表 数据
getProductList3()
function getProductList3() {
	http('GET', `/mallv2/subjectsController/getProducts`, {
		id: 116,
		pageSize: 50,
		pageNum
	}).then((res) => {
		let productList = res.data.list
		// console.log('商品:', productList)
		pageNum ++
		
		// 商品数据渲染
		productListBrand(productList, $('#productList3'))
	}, err => {
		console.log(err)
	})
}

// 部分dom操作
$(function () {
	
	// 跳转品牌清仓
	$(document).on('click', '#saleZero', function () {
		window.open('../brandSale/brandClearance.html', '_self')
	})
	
	// 品牌清仓跳转品牌页
	$(document).on('click', '#saleZero .p-item', function (e) {
		id = $(this).data('id')
		window.open('../brandSale/brandClassify.html?id=' + id, '_self')
		e.stopPropagation()	//阻止事件冒泡即可
	})
	
	// 选项卡切换商品列表
	$('#tabtxBox').on('click', '.scroll-view-item', function() {
		$(this).addClass('active').siblings().removeClass('active')
		let tabtxWrapTop = $('#tabtxWrap').offset().top - 20
		$('html, body').scrollTop(tabtxWrapTop)
		$('.product-column').removeClass('dn')
		
		// 跳到对应商品列表
		let productBoxTop = $('.product-box-scroll').eq($(this).index()).offset().top
		$('html, body').scrollTop(productBoxTop-50)
	})
	
	// 页面滚动事件
	$(window).on('scroll', function () {
		let scrollTop = $(this).scrollTop()
		let wHeight = $(this).height()
		let dHeight =$(document).height() - 300
		
		// 滚动商品列表，相应的选项卡选中
		$('.product-box-scroll').each(function (i, e) {
			let productBoxTop = $('.product-box-scroll').eq(i+1).offset().top - 120
			if (productBoxTop > scrollTop) {
				$('.tab-item').eq(i).addClass('active').siblings().removeClass('active')
				return false
			}
		})
		
		// 滚动到底部
		// if (scrollTop + wHeight > dHeight) {
		// 	getProductList3()
		// 	isLoading = true
		// }
	})

})