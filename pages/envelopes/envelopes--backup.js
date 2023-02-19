let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]

let actnum = 0    //选项卡
let pageNum = 1
let isLoading = false		//判断瀑布流是否加载中
let couponProductList = []	//已领取商品

pageStatistics() 			// 页面统计
getUserInfo(sourcePlatform)	// 获取用户信息

// 获取 商品列表
getProductList()
function getProductList() {
	if (isLoading) return
	isLoading = true
	http('GET', `/mallv2/activity/getCouponList`).then((res) => {
		isLoading = false
		let productList = res.data
		// console.log('瀑:', productList)
		if (productList.length == 0) isLoading = true
		pageNum ++
		
		let html = ''
		$.each(productList, (index, item) => {
			// 无库存去掉链接
			let oDiv = ''
			let oBtn = ''
			if (item.stock == 0) {
				oDiv = `<div class="product-item-enve">`
				oBtn = `<div class="btn-add-not">已抢完</div>`
			} else {
				oDiv = `<div class="product-item-enve product-item-click" data-id=${item.id}>`
				oBtn = `<div class="btn-get ${item.isReceive == 2 ? 'dn' : ''}" data-id="${item.id}">立即领取</div>
						<div class="btn-get-use  ${item.isReceive == 1 ? 'dn' : ''}">立即使用</div>`
			}
			html += `${oDiv}
						<div class="left">
							<div class="product-info-wraper">
								<img class="cover-img" src="${item.productImg}" >
								<div class="product-info">
									<div class="name">${item.productName}</div>
									<i class="label">限时限量</i>
									<div class="oprice">价格￥${item.originalPrice}</div>
									<div class="cprice">全网底价<span class="sum">￥<span class="num">${item.price}</span></span></div>
								</div>
							</div>
							<div class="get-box">
								<div class="get-bg">
									<div class="get-inner" style="width: ${100-item.stockProgress}%;"></div>
								</div>
								<span class="desc">券已领${100-item.stockProgress}%</span>
							</div>
						</div>
						<div class="right">
							<div class="sum">￥<span class="num">${item.activityMax}</span></div>
							<div class="txt">无门槛红包</div>
							${oBtn}
						</div>
						${item.isReceive == 2 ? '<img class="end-img" src="https://img.quanminyanxuan.com/service/bc8a422cb22847099cb5a8b5d0c3af9c.png" >' : ''}
					</div>`
		})
		$('#productListMore').append(html)
	}, err => {
		console.log(err)
	})
}

// 获取 已领取红包 商品列表
getCouponProductList()
function getCouponProductList() {
	http('GET', `/mallv2/activity/getUserCouponList`, {
		type: 0
	}).then((res) => {
		couponProductList = res.data.couponList
		console.log('领:', couponProductList)
		if (couponProductList.length > 0) {
			$('#toGet').addClass('dn')
		}
		$('#toUse .enve-num').text(res.data.totelPrice)
		let html = ''
		$.each(couponProductList, (index, item) => {
			// let item.id = setInterval('timerEnve(item.overdueTime)', 1000)
			
			// 无库存去掉链接
			let oDiv = ''
			if (item.stock == 0) {
				oDiv = `<div class="product-item-get">`
			} else {
				oDiv = `<div class="product-item-get product-item-click" data-id=${item.id}>`
			}
			html += `${oDiv}
						<div class="left">
							<div class="sum-box">
								<div class="sum">￥<span class="num">${item.activityMax}</span></div>
								<div class="txt">无门槛</div>
							</div>
							<div class="product-info">
								<div class="info">
									<img class="cover-img" src="${item.productImg}" >
									<div class="name">${item.productName}</div>
								</div>
								<div class="counter">
									<span>仅剩</span>
									<div class="num" id="hour">00</div>
									<div class="text-two">:</div>
									<div class="num" id="minute">00</div>
									<div class="text-two">:</div>
									<div class="num" id="second">00</div>
								</div>
							</div>
						</div>
						<div class="right">
							<div class="btn-get-use">立即使用</div>
						</div>
						<i class="top-label">快过期</i>
					</div>`
		})
		$('#productListGet').html(html)
	}, err => {
		console.log(err)
	})
}

// 领取红包
function getCoupon(_this) {
	let productId = $(_this).data('id')
	http('GET', `/mallv2/activity/obtainCoupon`, {
		productId
	}).then((res) => {
		$(_this).addClass('dn').siblings('.btn-get-use').removeClass('dn')
		getCouponProductList()
	}, err => {
		console.log(err)
	})
}

// 倒计时
// timerEnve()
function timerEnve(end) {
	let hour = ''
	let minute = ''
	let second = ''
	let minutes = ''
	let tmpTime = end ? end : `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`
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
		// $('#minutes').text(minutes)
		
		// let txt = '00:' + minute + ':' + second
		// return txt

	}, 1000)
}

// 部分dom操作
$(function () {
	
	// 立即领取
	$(document).on('click', '.btn-get', function (e) {
		getCoupon(this)
		e.stopPropagation()	//阻止事件冒泡即可
	})
	
	// 选项卡切换商品列表
	$('.tab-box').on('click', '.tab-item', function() {
		$(this).addClass('tab-item-active').siblings().removeClass('tab-item-active')
		$('html, body').scrollTop(0)
		// 请求商品数据
		let num = $(this).data('actnum')
		console.log(num)
		if (num == actnum) return
		actnum = num
		if(num == 0){
			$('#toUse').addClass('dn')
			$('#toGet').removeClass('dn')
		}else if(num == 1){
			$('#toUse').removeClass('dn')
			$('#toGet').addClass('dn')
		}else if(num == 2){
			$('#toUse').removeClass('dn')
			$('#toGet').addClass('dn')
		}
	})
	
	// 去领取
	$('.btn-get-all').on('click', function() {
		let mainTj = $('.main-tj').offset().top - 60
		$('html, body').scrollTop(mainTj)
	})
	
	// 去使用
	$('.btn-use-all').on('click', function() {
		let mainTj = $('.main-tj').offset().top - 60
		$('html, body').scrollTop(mainTj)
	})
	
	// 跳转详情页
	$(document).on('click', '.product-item-click', function () {
		id = $(this).data('id')
		window.open('../productDetail/hbproductDetail.html?productId=' + id, '_self')
	})
	
	// 页面滚动事件
	$(window).on('scroll', function () {
		let scrollTop = $(this).scrollTop()
		let wHeight = $(this).height()
		let dHeight =$(document).height() - 300
		
		// 滚动到底部
		if (scrollTop + wHeight > dHeight) {
			// getProductList()
			isLoading = true
		}
	})
})