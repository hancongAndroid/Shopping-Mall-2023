let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]

let specialId = 6	//类目ID
let pageNum = 1
let isLoading = false		// 判断瀑布流是否加载中
let tabNavBoxTop 			// 导航位置

pageStatistics() 			// 页面统计
getUserInfo(sourcePlatform)	// 获取用户信息
// 广点通渠道统计
// gdt('track', 'VIEW_CONTENT', {});// 浏览

// 获取 排行榜
getRankingProductInfo()
function getRankingProductInfo() {
	http('GET', `/mallv2/h5/score/getProductListByPage`, {
		columnId: 9,
		pageSize: 30,
		pageNum: 1,
		flag: 0
	}).then((res) => {
		let seniorityList = res.data //兑换排行
		// 数据渲染
		let html = ''
		$.each(seniorityList, (index, item) => {
			// 无库存去掉链接
			let oDiv = ''
			if (item.stock == 0) {
				oDiv = `<div class="product-item-ranking">`
			} else {
				oDiv = `<div class="product-item-ranking" onclick="window.open('../productDetail/productDetail.html?productId=${item.id}', '_self')">`
			}
			html += `${oDiv}
					<img class="cover-img" src="${item.productImg}">
					<!--<img class="end-img" src="https://img.quanminyanxuan.com/other/1b5eb188ec434ea9aa56a2e27f49dd3b.png">-->
					<i class="icon-ranking">${index + 1}</i>
					<div class="product-info">
						<div class="name">${item.productName}</div>
						<div class="sell-ratio">
							<div class="left">
								<div class="inner" style="width: ${Math.round(Math.random() * (90 - 60)) + 60}%">
									<span class="txt">已兑${item.volumeStr}件</span>
									<img class="icon-hot" src="https://img.quanminyanxuan.com/other/74859a8fcd2b49798e3034b1764692b3.png" >
								</div>
							</div>
						</div>
						<div class="bottom">
							<p class="o-price">价格￥${item.originalPrice}</p>
							<div class="price-wrap">
								<img class="product-img" src="https://img.quanminyanxuan.com/other/31e1cac4d7a84564b291486178127bed.png">
								<span class="product-text">${item.activityMax}</span>
								<span class="product-card">卡券</span>
								<span class="product-yuan">+${item.price}元</span>
							</div>
						</div>
					</div>
				</div>`
			})
		$('#rankingProductList').append(html)
		tabNavBoxTop = $('#tabNavBox').offset().top
	}, err => {
		console.log(err)
	})
}

// 获取 5个列表商品 数据
getProductInfo()
function getProductInfo() {
	if (isLoading) return
	isLoading = true
	http('GET', `/mallv2/product/specialProductList`, {
		specialId: specialId,
		pageSize: 30,
		pageNum,
		activityType: 'CASH_SCORE'
	}).then((res) => {
		isLoading = false
		let productList = res.data.list
		console.log('列表:', productList)
		if (productList.length == 0) isLoading = true
		pageNum ++
		
		// 数据渲染
		productListScore(productList.sort(randomSort), $('#productList'))
	}, err => {
		console.log(err)
	})
}

// 部分dom操作
$(function () {
	
	// 选项卡切换商品列表
	$('#tabNavBox').on('click', '.tab-item', function() {
		let _index = $(this).index()
		$(this).addClass('tab-item-active').siblings().removeClass('tab-item-active')

		// 请求商品数据
		let special = $(this).data('special')
		if (special == specialId) return
		$('#productList').html('')
		pageNum = 1
		isLoading = false
		specialId = special
		getProductInfo()
		$('html, body').scrollTop(tabNavBoxTop)
		
		// 导航偏移
		$('#tabNavBox .tab-top-nav').animate({
			scrollLeft: 80 * (_index - 2) + 30
		}, 500)
	})
	
	// 页面滚动事件
	$(window).on('scroll', function () {
		let scrollTop = $(this).scrollTop()
		let wHeight = $(this).height()
		let dHeight =$(document).height() - 300
		
		// 滚动到底部
		if (scrollTop + wHeight > dHeight) {
			getProductInfo()
			isLoading = true
		}
	})
	
})