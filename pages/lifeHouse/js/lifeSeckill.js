let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]

let pageNum = 1
let isLoading = false		//判断瀑布流是否加载中

// 第一次进页面商品不随机
let flag = 1
let firstIntoLifeSeckill = localStorage.getItem('firstIntoLifeSeckill')
if (!firstIntoLifeSeckill) {
	localStorage.setItem('firstIntoLifeSeckill', 1)
	flag = 0
}

pageStatistics() 			// 页面统计
getUserInfo(sourcePlatform)	// 获取用户信息

// 获取 商品列表 数据
getProductList()
function getProductList() {
	if (isLoading) return
	isLoading = true
	http('GET', `/mallv2/subjectsController/getProducts`, {
		pageNum,
		pageSize: 10,
		id: 102
	}).then((res) => {
		isLoading = false
		let productList = res.data.list
		// console.log('商品:', productList)
		if (productList.length == 0) isLoading = true
		pageNum ++
		
		let html = ''
		$.each(productList, (index, item) => {
			// 无库存去掉链接
			let oDiv = ''
			if (item.stock == 0) {
				oDiv = `<div class="product-item">`
			} else {
				oDiv = `<div class="product-item product-item-click" data-id=${item.id}>`
			}
			html += `${oDiv}
						<img class="cover-img" src="${item.productImg}" >
						${item.stock == 0 ? '<img class="end-img" src="https://img.quanminyanxuan.com/other/1b5eb188ec434ea9aa56a2e27f49dd3b.png">' : ''}
						<div class="product-info">
							<div class="name">
								<img class="icon" src="https://img.quanminyanxuan.com/other/3d73ee07e4db4c3683b594fc86c7777a.png">
								${item.productName}
							</div>
							<div class="sell-ratio">
								<!--<div class="left">
									<div class="inner" style="width: ${item.percentage}%">
										<span class="txt">已抢${item.percentage}%</span>
									</div>
								</div>-->
								<div class="right">仅剩${filterStock(item.virtualStock)}件</div>
							</div>
							<div class="bottom">
								<div class="bottom-l">
									<div class="price">
										<span class="price1">￥<span class="num">${item.price}</span></span>
										<span class="price2">￥${item.originalPrice}</span>
									</div>
								</div>
								<div class="btn-add-o">去抢购</div>
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
		$('.time-item').eq(0).find('.txt').text('已抢购')
		$('.time-item').eq(2).find('.txt').text('即将开场')
	}
	else if (curHour >= 20) {
		$('.time-item').eq(2).addClass('active').find('.txt').text('秒杀中').end().siblings().removeClass('active')
		$('.time-item').eq(0).find('.txt').text('已抢购')
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
	
	// 跳转详情页
	$(document).on('click', '.product-item-click', function () {
		id = $(this).data('id')
		window.open('../productDetail/livingProductDetail.html?productId=' + id, '_self')
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