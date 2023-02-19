let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]

let pageNum = 1
let isLoading = false		//判断瀑布流是否加载中
let columnId = 0

timer()						// 倒计时
pageStatistics() 			// 页面统计
getUserInfo(sourcePlatform)	// 获取用户信息
// 广点通渠道统计
// gdt('track', 'VIEW_CONTENT', {});// 浏览

// 返回拦截
let backFlag = false	// 解决bug：进详情页后返回到当前页触发拦截事件

// 页面载入时使用pushState插入一条历史记录
history.pushState(null, null, '#' )
window.addEventListener('popstate', function(event) {
    // 点击回退时再向历史记录插入一条，以便阻止下一次点击回退
    // history.pushState(null, null, '#' )
	if (backFlag) window.location.href = '../discover/discover.html'
})

// 进入页面
$(window).on('pageshow', function(){
	setTimeout(function(){
		backFlag = true
	}, 500)
})
// 离开页面
$(window).on('pagehide', function(){
	backFlag = false
})

// 获取红包
;(function() {
	http('GET', `/mallv2/redPacket/h5/queryUserRedWallet`).then((res) => {
		if (res.code == 200) {
			if (res.data == 0) {
				http('GET', `/mallv2/redPacket/h5/receive`).then((res) => {
					if (res.code == 200) {
						$('.redWalletMoney').text(res.data)
						$('.vip-layer').removeClass('dn')
					}
				}, err => {
					console.log(err)
				})
			} else {
				$('.redWalletMoney').text(res.data)
			}
		}
	}, err => {
		console.log(err)
	})
})()

// 获取 商品导航
getProductNav()
function getProductNav() {
	http('GET', `/mallv2/subjectsController/getSubjectsInfo/75`).then((res) => {
		// 导航
		let subjectPlateDtos = res.data.subjectPlateDtos
		let html = ''
		columnId = subjectPlateDtos[0].id
		$.each(subjectPlateDtos, (index, item) => {
			html += `<div class="tab-item${index == 0 ? ' active' : ''}" data-column="${item.id}">
						<div class="tab-title">${item.title}</div>
						<i class="tab-sub"></i>
					</div>`
		})
		$('#tabNavList').append(html)
		getProductList()
		
	}, err => {
		console.log(err)
	})
}

// 获取 商品列表
function getProductList() {
	if (isLoading) return
	isLoading = true
	http('GET', `/mallv2/subjectsController/getProducts`, {
		pageNum,
		pageSize: 20,
		id: columnId
	}).then((res) => {
		isLoading = false
		let productList = res.data.list
		if (productList.length == 0) isLoading = true
		pageNum ++

		productListBrand(productList, $('#productList'))
	}, err => {
		console.log(err)
	})
}

// 获取 商品列表
getProductList2()
function getProductList2() {
	http('GET', `/mallv2/subjectsController/getSubjectsInfo/2`).then((res) => {
		let productList = res.data.subjectPlateDtos
		let html = ''
		$.each(productList, (index, item) => {
			html += `<div class="brand-sale-item" onclick="window.open('../brandSale/brandClassify.html?id=${item.id}&brandId=${item.brandId}', '_self')">
						<img class="banner" src="${item.bannerUrl}" >
						<div class="product-brand">`
							
							$.each(item.productSubjectPlateList, (index2, item2) => {
								if (index2 > 2) return
					html += `<div class="product-item">
								<img class="cover" src="${item2.productImg}">
								<div class="info">
									<div class="price"><span class="sign">￥</span>${item2.price}<i class="dis">${item2.discount}折</i></div>
									<span class="oprice">￥${item2.originalPrice}</span>
								</div>
							</div>`
							})
							
					html += `<div class="product-item btn">进入会场 ></div>
						</div>
						<div class="date-box">
							距结束<br>
							<span class="tiem-item hour"></span>
							<span class="time-dot">:</span>
							<span class="tiem-item minute"></span>
							<span class="time-dot">:</span>
							<span class="tiem-item second"></span>
							<!--<span class="time-dot">:</span>
							<span class="tiem-item minutes"></span>-->
						</div>
					</div>`
		})
		$('#brandSaleList').append(html)
		timerBrand()
	}, err => {
		console.log(err)
	})
}

// 部分dom操作
$(function () {
	
	// 轮播图
	let banner = new Swiper ('.swiper-container-banner', {
		autoplay: {
			delay: 3500000,
			disableOnInteraction: false
		},
		speed: 500,
		loop: true,
		pagination: {
			el: '.swiper-pagination',
		}
	})
	
	// 轮播图
	let card = new Swiper ('.swiper-container-gift-card', {
		autoplay: {
			delay: 2000000,
			disableOnInteraction: false
		}, 
		slidesPerView: 3,
		spaceBetween: 5,
		centeredSlides: true,
		speed: 500,
		loop: true
	})
	
	// 选项卡切换商品列表（全民狂欢）
	$('#tabNavList').on('click', '.tab-item', function() {
		if ($(this).hasClass('active')) return	//点击当前无操作
		$(this).addClass('active').siblings().removeClass('active')
		let _index = $(this).index()
		// 导航偏移
		$('#tabNavList').animate({
			scrollLeft: 75 * (_index - 2) + 15
		}, 500)
		$('html, body').scrollTop($('.product-box').offset().top - 50)
		pageNum = 1
		isLoading = false
		$('#productList').html('')
		columnId = $(this).data('column')
		getProductList()
	})
	
	// 选项卡切换 全民狂欢/品牌馆
	$('.nav-box').on('click', '.nav-item', function() {
		if ($(this).hasClass('active')) return	//点击当前无操作
		$(this).addClass('active').siblings().removeClass('active')
		let _index = $(this).index()
		if (_index == 0) {
			$('.wrapper1').removeClass('dn')
			$('.wrapper2').addClass('dn')
		} else {
			$('.wrapper2').removeClass('dn')
			$('.wrapper1').addClass('dn')
		}
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

})

// 倒计时
function timerBrand(end) {
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
		$('.hour').text(hour)
		$('.minute').text(minute)
		$('.second').text(second)
		$('.minutes').text(minutes)
	}, 100)
}