let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]
let pageNum = 1
let isLoading = false		//判断瀑布流是否加载中

pageStatistics() 			// 页面统计
getUserInfo(sourcePlatform)	// 获取用户信息

// 获取 购物卡 数据
getShoppingcard()
function getShoppingcard() {
	http('GET', `/mallv2/h5/shoppingcard/index`).then((res) => {
		let cardInfo = res.data
		// console.log(cardInfo)
		
		// 购物卡剩余时间
		timerCard(cardInfo.periodOfValidity.replace(/\./g, '/'))
	}, err => {
		console.log(err)
	})
}

// 获取 商品列表 数据
getProductList()
function getProductList() {
	if (isLoading) return
	http('GET', `/mallv2/h5/shoppingcard/queryListByPage`, {
		columnId: 75,
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
							<div class="sell-ratio">
								<div class="left">
									<div class="inner" style="width: ${(((item.originalPrice - item.curPrice) / item.originalPrice)*100).toFixed(0)}%"></div>
								</div>
								<div class="right">已省${(((item.originalPrice - item.curPrice) / item.originalPrice)*100).toFixed(0)}%</div>
							</div>
							<div class="bottom">
								<div class="bottom-l">
									<div class="price">
										<span class="price1">￥<span class="num">${item.curPrice}</span></span>
										<span class="price2">￥${item.originalPrice}</span>
									</div>
									<div class="count">限量${filterStock(item.virtualStock)}件</div>
								</div>
								<div class="btn">立即秒杀</div>
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
		$('.time-item').eq(0).addClass('active').find('.txt').text('抢购中').end().siblings().removeClass('active')
		$('.time-item').eq(1).find('.txt').text('即将开场')
		$('.time-item').eq(2).find('.txt').text('即将开场')
	}
	else if (curHour >= 12 && curHour < 20) {
		$('.time-item').eq(1).addClass('active').find('.txt').text('抢购中').end().siblings().removeClass('active')
		$('.time-item').eq(0).find('.txt').text('已抢购')
		$('.time-item').eq(2).find('.txt').text('即将开场')
	}
	else if (curHour >= 20) {
		$('.time-item').eq(2).addClass('active').find('.txt').text('抢购中').end().siblings().removeClass('active')
		$('.time-item').eq(0).find('.txt').text('已抢购')
		$('.time-item').eq(1).find('.txt').text('已抢购')
	}
	else {
		$('.time-item').removeClass('active').find('.txt').text('即将开场')
	}
	clearInterval(timeCount)
	timeCount = setInterval(seckillTime, 1000)
})()

// 倒计时
function timerCard(end) {
	let hour = ''
	let minute = ''
	let second = ''
	let minutes = ''
	let tmpTime = end ? end : `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`
	// var dateTime = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
	var dateTime = new Date(
		new Date(tmpTime).getTime() + 24 * 60 * 60 * 1000 - 1
	)
	let countClock = setInterval(() => {
		var endTime = new Date(dateTime.getTime())
		var nowTime = new Date()
		var nMS = endTime.getTime() - nowTime.getTime()
		var myD = Math.floor(nMS / (1000 * 60 * 60 * 24))
		var myH = Math.floor(nMS / (1000 * 60 * 60)) % 24
		var myM = Math.floor(nMS / (1000 * 60)) % 60
		var myS = Math.floor(nMS / 1000) % 60
		var myMS = Math.floor(nMS / 100) % 10
		if (myD >= 0) {
		  myH = myH + myD * 24
		  if (myH <= 9) myH = '0' + myH
		  if (myM <= 9) myM = '0' + myM
		  if (myS <= 9) myS = '0' + myS
		  if (myMS <= 9) myMS = myMS

		  hour = myH
		  minute = myM
		  second = myS
		  minutes = myMS
		} else {
		  hour = '00'
		  minute = '00'
		  second = '00'
		  minutes = '0'
		}
		$('#hour').text(hour)
		$('#minute').text(minute)
		$('#second').text(second)
		$('#minutes').text(minutes)
	}, 100)
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