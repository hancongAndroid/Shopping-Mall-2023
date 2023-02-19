let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]

let pageNum = 1
let isLoading = false		//判断瀑布流是否加载中

pageStatistics() 			// 页面统计
getUserInfo(sourcePlatform)	// 获取用户信息

// 获取 商品列表 数据
getProductList()
function getProductList() {
	if (isLoading) return
	isLoading = true
	http('GET', `/mallv2/h5/livingcenter/queryListByPage`, {
		columnId: 88,
		pageSize: 10,
		pageNum,
		flag: 0
	}).then((res) => {
		isLoading = false
		let productList = res.data
		let cartData = getCartDataFromLocal()	// 获取购物车数据
		console.log('商品:', productList)
		if (productList.length == 0) isLoading = true
		pageNum ++
		
		let html = ''
		$.each(productList, (index, item) => {
			// 购物车是否存在该商品
			let oBtn = `<div class="btn-add-o" data-id=${item.id}>加入购物车</div>`
			for (let i = 0; i < cartData.length; i++) {
				if (cartData[i].id == item.id) {
					oBtn = `<div class="btn-group">
								<i class="btn-cut" data-id=${item.id} data-type='cut'>-</i>
								<span class="num">${cartData[i].counts}</span>
								<i class="btn-add" data-id=${item.id} data-type='add'>+</i>
							</div>`
					break
				}
			}
			// 无库存去掉链接
			let oDiv = ''
			if (item.stock == 0) {
				oDiv = `<img class="cover-img" src="${item.productImg}" >`
			} else {
				oDiv = `<img class="cover-img" src="${item.productImg}" onclick="window.open('../productDetail/livingProductDetail.html?productId=${item.id}', '_self')">`
			}
			html += `<div class="product-item">
						${oDiv}
						<div class="product-info">
							<div class="name">${item.productName}</div>
							<div class="sell-ratio">
								<div class="left">
									<div class="inner" style="width: ${item.stockProgressStr}"></div>
								</div>
								<div class="right">已抢${item.stockProgressStr}</div>
							</div>
							<div class="bottom">
								<div class="bottom-l">
									<div class="price">
										<span class="price1">￥<span class="num">${item.price}</span></span>
										<span class="price2">￥${item.originalPrice}</span>
									</div>
									<div class="count">限量50件</div>
								</div>
								${oBtn}
							</div>
						</div>
					</div>`
		})
		$('#productList').append(html)
	}, err => {
		console.log(err)
	})
}

// 秒杀时间段
let timeCount
(function seckillTime() {
	let curHour = new Date().getHours()
	// let curHour = new Date().getSeconds()
	// console.log(curHour)
	if (curHour >= 8 && curHour < 12) {
		$('.time-item').eq(0).addClass('active').find('.txt').text('秒杀中').end().siblings().removeClass('active')
		$('.time-item').eq(1).find('.txt').text('即将开场')
		$('.time-item').eq(2).find('.txt').text('即将开场')
	}
	else if (curHour >= 12 && curHour < 20) {
		$('.time-item').eq(1).addClass('active').find('.txt').text('秒杀中').end().siblings().removeClass('active')
		$('.time-item').eq(0).find('.txt').text('已过期')
		$('.time-item').eq(2).find('.txt').text('即将开场')
	}
	else if (curHour >= 20) {
		$('.time-item').eq(2).addClass('active').find('.txt').text('秒杀中').end().siblings().removeClass('active')
		$('.time-item').eq(0).find('.txt').text('已过期')
		$('.time-item').eq(1).find('.txt').text('已抢购')
	}
	else {
		$('.time-item').removeClass('active').find('.txt').text('即将开场')
	}
	clearInterval(timeCount)
	timeCount = setInterval(seckillTime, 1000)
})()

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