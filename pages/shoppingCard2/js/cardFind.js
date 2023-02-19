let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]
let pageNum = 1
let isLoading = false		//判断瀑布流是否加载中

let dayArr = [30, 60, 90, 180]	// 近多少天最低价

pageStatistics() 			// 页面统计
getUserInfo(sourcePlatform)	// 获取用户信息

// 获取 商品列表 数据
getProductList()
function getProductList() {
	if (isLoading) return
	http('GET', `/mallv2/h5/shoppingcard/queryListByPage`, {
		columnId: 80,
		pageSize: 10,
		pageNum,
		flag: 1
	}).then((res) => {
		isLoading = false
		let productList = res.data
		// console.log('瀑', productList)
		if (productList.length == 0) isLoading = true
		pageNum ++
		
		let html = ''
		$.each(productList, (index, item) => {
			html += `<div class="product-item" onclick="window.open('../productDetail/cardProductDetail.html?productId=${item.id}', '_self')">
						<img class="cover-img" src="${item.productImg}" >
						<div class="product-info">
							<div class="name">${item.productName}</div>
							<div class="label">
								<div class="label1"><img class="icon" src="https://img.quanminyanxuan.com/other/8e09e81e4e524ac0a5f68264ea125fa5.png">买贵必赔</div>
								<div class="label2 border">近${dayArr[parseInt(Math.random()*dayArr.length,10)]}天最低价</div>
							</div>
							<div class="bottom">
								<div class="price">
									<span class="price1">￥<span class="num">${item.curPrice}</span></span>
									<span class="price2">￥${item.originalPrice}</span>
								</div>
								<div class="btn">去查看</div>
							</div>
						</div>
					</div>`
		})
		$('#productList').append(html)
	}, err => {
		console.log(err)
	})
}

// 获取 banner 数据
getBannerList()
function getBannerList() {
	http('GET', `/mallv2/h5/shoppingcard/queryListByPage`, {
		columnId: 79,
		pageSize: 10,
		pageNum: 1,
		flag: 0
	}).then((res) => {
		let bannertList = res.data
		console.log('banner', bannertList)
		
		let html = ''
		$.each(bannertList, (index, item) => {
			html += `<div class="swiper-slide" onclick="window.open('../productDetail/cardProductDetail.html?productId=${item.id}', '_self')"><img src="${item.sceneImg}" /></div>`
		})
		$('#bannerImg').append(html)
		new Swiper ('.swiper-container-banner', {
			autoplay: {
				delay: 2500,
				disableOnInteraction: false
			},								
			speed: 500,
			loop: true,
			pagination: {
				el: '.swiper-pagination-banner'
			} 
		})
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
		let dHeight =$(document).height() -300
		
		// 滚动到底部
		if ((scrollTop + wHeight) > dHeight) {
			getProductList()
			isLoading = true
		}
	})

})