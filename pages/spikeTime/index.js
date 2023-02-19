let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]
let pageNum = 1
let isLoading = false		//判断瀑布流是否加载中
let yhflag = localStorage.getItem('yhflag')
if (yhflag == null) {
	localStorage.setItem('yhflag', 1)
	yhflag = 0
}
let rankingIcon = [
	'https://img.quanminyanxuan.com/other/eb8db7607ae641048fc1683a2c46e1a2.png',
	'https://img.quanminyanxuan.com/other/981d85ae54d34cdfb6c686db90a126f8.png',
	'https://img.quanminyanxuan.com/other/d7e28158ca9740e2bb88e71f5a4513eb.png'
]

pageStatistics() 			// 页面统计
getUserInfo(sourcePlatform)	// 获取用户信息

// 获取 秒杀 数据
getShoppingcard()
function getShoppingcard() {
	http('GET', `/mallv2/h5/skill/index`).then((res) => {
		let data = res.data
		var datat = data.shoppingCardProductList
		var com = {
			'productImg':'https://img.quanminyanxuan.com/other/eba1f8190fd949c4add3a583defc6b90.jpg'
			}
		datat.push(com)
		// console.log(datat)
		// 购物卡
		let html = ''
		$.each(datat, (index, item) => {
			html += `<div class="p-item">
						<img class="img" src="${item.productImg}" >
						<img class="label" src="https://img.quanminyanxuan.com/other/853dbc9f115744f084dddb354cea3161.png">
					</div>`
		})
		$('#cardProductList').html(html)
		
		// 黄金专场
		let html2 = ''
		$.each(data.goldProductList, (index, item) => {
			if (index > 2) return false
			html2 += `<div class="gold-item" onclick="window.open('../productDetail/goldProductDetail.html?productId=${item.id}', '_self')">
						<div class="product-cover">
							<img class="cover-img" src="${item.productImg}" >
						</div>
						<div class="product-info">
							<div class="product-name">${item.productName}</div>
							<div class="price">
								<div class="price1">官方价￥<span class="num">${item.originalPrice}</span></div>
								<div class="price2">￥<span class="num">${item.price}</span></div>
								<div class="label-txt">秒杀价</div>
							</div>
						</div>
					</div>`
		})
		$('#goldProductList').html(html2)
		
		// 排行榜
		let html3 = ''
		$.each(data.rankingProductList, (index, item) => {
			html3 += `<div class="product-ranking-item" onclick="window.open('../productDetail/seckillProductDetail.html?productId=${item.id}', '_self')">
						<div class="product-cover">
							<img class="cover-img" src="${item.productImg}" >
							<img class="top-icon" src="${rankingIcon[index]}" >
						</div>
						<div class="product-info">
							<div class="label">
								<img src="https://img.quanminyanxuan.com/other/3626205d8ab6434db9ddd9bd8081f7bc.png" >
								<img src="https://img.quanminyanxuan.com/other/a6cb327aed494323a5f7cb8e253d5e9c.png" >
							</div>
							<div class="product-name">${item.productName}</div>
							<div class="sell-ratio">
								<div class="left">
									<div class="inner" style="width: ${item.stockProgressStr}"></div>
								</div>
								<div class="right">疯抢热度${item.stockProgressStr}</div>
							</div>
							<div class="bottom">
								<div class="left">
									<div class="b-l-t">￥<span class="num">${item.price}</span></div>
									<div class="b-l-b">秒杀价</div>
								</div>
								<div class="right">
									<div class="b-r-t">全网底价<span class="num">￥${item.curPrice}</span></div>
									<div class="b-r-b">疯抢热度${filterVolume(item.volumeStr)}</div>
								</div>
							</div>
						</div>
					</div>`
		})
		$('#rankingProductList').html(html3)
	}, err => {
		console.log(err)
	})
}

// 获取 更多特卖 数据
getProductList()
function getProductList() {
	if (isLoading) return
	isLoading = true
	http('GET', `/mallv2/h5/skill/queryListByPage`, {
		columnId: 0,
		pageSize: 20,
		pageNum,
		flag: yhflag
	}).then((res) => {
		isLoading = false
		let productList = res.data
		// console.log('瀑', productList)
		if (productList.length == 0) isLoading = true
		pageNum ++
		
		let html = ''
		$.each(productList, (index, item) => {
			// 无库存去掉链接
			let oDiv = ''
			if (item.stock == 0) {
				oDiv = `<div class="product-list-item">`
			} else {
				oDiv = `<div class="product-list-item" onclick="window.open('../productDetail/seckillProductDetail.html?productId=${item.id}', '_self')">`
			}
			html += `${oDiv}
						<div class="product-cover">
							<img class="cover-img" src="${item.productImg}" >
							${item.stock == 0 ? '<img class="end-img" src="https://img.quanminyanxuan.com/other/1b5eb188ec434ea9aa56a2e27f49dd3b.png" >' : ''}
						</div>
						<div class="product-info">
							<div class="product-name">${item.productName}</div>
							<div class="product-bottom">
								<img class="top-icon" src="https://img.quanminyanxuan.com/other/3626205d8ab6434db9ddd9bd8081f7bc.png" >
								<div class="price">
									<span>￥<span class="num">${item.price}</span></span>
									<span class="oprice">￥${item.originalPrice}</span>
								</div>
								<div class="btn-box">
									<div class="btn-box-t">去抢购</div>
									<div class="btn-box-b">已抢${filterVolume(item.volumeStr)}件</div>
								</div>
							</div>
						</div>
					</div>`
		})
		$('#productListMore').append(html)
	}, err => {
		console.log(err)
	})
}

// 倒计时
;(function timer() {
	let hour = ''
	let minute = ''
	let second = ''
	let minutes = ''
	let tmpTime = `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`
	
	// 记录三天后的时间
	let endTime
	if (localStorage.getItem('endTimeSpike') == null) {
		endTime = new Date(tmpTime).getTime() + 72 * 60 * 60 * 1000 - 1
		localStorage.setItem('endTimeSpike', endTime)
	} else {
		endTime = localStorage.getItem('endTimeSpike')
	}
	
	let countClock = setInterval(() => {
		var nowTime = new Date()
		var nMS = endTime - nowTime.getTime()
		// 三天到期再追加三天
		if (nMS <= 0) {
			endTime = new Date(tmpTime).getTime() + 72 * 60 * 60 * 1000 - 1
			localStorage.setItem('endTimeSpike', endTime)
		}
		var myD = Math.floor(nMS / (1000 * 60 * 60 * 24))
		// var myH = Math.floor(nMS / (1000 * 60 * 60)) % 24
		var myH = Math.floor(nMS / (1000 * 60 * 60))
		var myM = Math.floor(nMS / (1000 * 60)) % 60
		var myS = Math.floor(nMS / 1000) % 60
		var myMS = Math.floor(nMS / 100) % 10
		if (myD >= 0) {
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
})()

// 部分dom操作
$(function () {

	// 轮播图
	// let flsw = new Swiper ('.swiper-container-flsw', {
	// 	autoplay: {
	// 		delay: 2000,
	// 		disableOnInteraction: false
	// 	},								
	// 	speed: 1500,
	// 	loop: true
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
	$(document).on('click','#appBar',function () {
		clikStatistics('TEMAI_APP')
		 downAppgo()
	})
})