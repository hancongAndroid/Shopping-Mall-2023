let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]

var actnum = 0    //选项卡
let couponProductList = []	//已领取商品

let pageNum = 1
let isLoading = false		//判断瀑布流是否加载中

let hbflag = localStorage.getItem('hbflag')
if (hbflag == null) {
	localStorage.setItem('hbflag', 1)
	hbflag = 0
}
pageStatistics() 			// 页面统计


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
									<div class="oprice">价格<span class="sum">￥${item.originalPrice}</span></div>
									<div class="cprice">全网底价<span class="sum">￥<span class="num">${item.curPrice}</span></span></div>
								</div>
							</div>
							<div class="get-box">
								<div class="get-bg">
									<div class="get-inner" style="width: ${100-item.stockProgress}%;"></div>
								</div>
								<span class="desc">已领${100-item.stockProgress}%</span>
							</div>
						</div>
						<div class="right">
							<div class="sum">￥<span class="num">${item.activityMax}</span></div>
							<div class="txt">无门槛红包</div>
							${oBtn}
						</div>
						
					</div>`
		})
		// <img class="end-img ${item.isReceive == 1 ? 'dn' : ''}" src="https://img.quanminyanxuan.com/service/bc8a422cb22847099cb5a8b5d0c3af9c.png" >
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
		console.log('领:', res.data)
		if (couponProductList.length > 0) {
			$('#toGet').addClass('dn')
		}
		$('.accountNum').text(res.data.totelPrice)
		$('.accountNum1').text(res.data.notUseCoupon)
		$('.accountNum2').text(res.data.used)
		if (res.data.totelPrice > 0) {
			$('.jgq').removeClass('dn')
		} else {
			$('.jgq').addClass('dn')
		}
		
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
							</div>
						</div>
						<div class="right">
							<div class="btn-get-use">立即使用</div>
						</div>
						<i class="top-label">待使用</i>
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
		$(_this).parents('.product-item-enve').find('.end-img').removeClass('dn')
		getCouponProductList()
		window.open('../productDetail/hbproductDetail.html?productId=' + productId, '_self')
	}, err => {
		console.log(err)
	})
}

function userSign() {
	let productTop = $('#productListMore').offset().top - 56
	$('html, body').scrollTop(productTop)
}

function agnhb() {
	layer.open({
		title: '温馨提示'
		,content: `请前往APP领取更多红包`
		,btn: ['打开APP']
		,yes: function(index){
			downAppgo()
			layer.close(index)
			clikStatistics('H5_APP_HB')
		}
	})  
}

// 部分dom操作
$(function () {
	
	// 立即领取
	$(document).on('click', '.btn-get', function (e) {
		getCoupon(this)
		e.stopPropagation()	//阻止事件冒泡即可
	})
	
	// 去领取
	$('.btn-get-all, .btn-use-all').on('click', function() {
		$('.tab-item').eq(0).addClass('tab-item-active').siblings().removeClass('tab-item-active')
		$('#productListGet').addClass('dn')
		$('#productListMore').removeClass('dn')
		$('#toGet').addClass('dn')
		$('#toUse').addClass('dn')
	})
	
	// 去使用
	$('.btn-use-all').on('click', function() {
		
	})
	
	// 跳转详情页
	$(document).on('click', '.product-item-click', function () {
		id = $(this).data('id')
		window.open('../productDetail/hbproductDetail.html?productId=' + id, '_self')
	})
	
	// 规则弹窗
	$('#ruleShow').on('click', function() {
		$('#ruleBox').removeClass('dn')
	})
	$('#ruleHide').on('click', function() {
		$('#ruleBox').addClass('dn')
	})
	
	// 选项卡切换商品列表
	$('.tab-box').on('click', '.tab-item', function() {
		$(this).addClass('tab-item-active').siblings().removeClass('tab-item-active')
		// 请求商品数据
		let num = $(this).data('actnum')
		console.log(num)
		if (num == actnum) return
		actnum = num
		if(num == 0){
			$('#productListGet').addClass('dn')
			$('#productListMore').removeClass('dn')
			$('#toGet').addClass('dn')
			$('#toUse').addClass('dn')
		}else if(num == 1){
			$('#productListMore').addClass('dn')
			$('#productListGet').removeClass('dn')
			$('#toGet').addClass('dn')
			if (couponProductList.length == 0) {
				$('#toUse').removeClass('dn')
			} else {
				$('#toUse').addClass('dn')
			}
		}else if(num == 2){
			$('#productListMore').addClass('dn')
			$('#productListGet').addClass('dn')
			$('#toGet').removeClass('dn')
			$('#toUse').addClass('dn')
		}
	})
	// 页面滚动事件
	$(window).on('scroll', function() {
		let scrollTop = $(this).scrollTop()
		let wHeight = $(this).height()
		let dHeight = $(document).height() - 300

		if (scrollTop + wHeight > dHeight) {
			getProductList()

		}
	})
	
})