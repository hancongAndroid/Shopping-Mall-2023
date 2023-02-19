let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]
let pageNum = 1
let flag = 0
let isLoading = false		//判断瀑布流是否加载中

// timer()						// 倒计时
pageStatistics() 			// 页面统计
getUserInfo(sourcePlatform)	// 获取用户信息
// 广点通渠道统计
// gdt('track', 'VIEW_CONTENT', {});// 浏览

// 排行 左上角标签
let rankingIcon = [
	'https://img.quanminyanxuan.com/other/4b3cc500fec4450385938af6d10bddbb.png',
	'https://img.quanminyanxuan.com/other/0d4897f98efa49b2b6a742d7ad0d0e7c.png',
	'https://img.quanminyanxuan.com/other/cc1e0864144f49f0b6190696a753c0dd.png',
	'https://img.quanminyanxuan.com/other/b50d29382e9f44c0bac0a025c6de34c8.png',
	'https://img.quanminyanxuan.com/other/a07798d37ec94ea09e290a1699e048ed.png',
	'https://img.quanminyanxuan.com/other/51685fa90a3e40d5869f8012dbf37c58.png'
]


// 返回拦截，只拦一次
// let channel1 = getUrlKey('channel');
// let channel2 = getCookie('channel');
// let gwktype = localStorage.getItem('gwktype');


// (function(){
// 	if (gwktype != 1) {
// 		if(window.history && window.history.pushState){
// 			window.onpopstate = function(){
// 				if (localStorage.getItem('gwktype2') == 1) {
// 					window.history.pushState('forward',null,'')
// 					window.history.forward(1)
// 					localStorage.setItem('gwktype', 1)
// 					$('#mask').css('top',0)
// 					clikStatistics('BTZX_LJ')
// 				}
// 			}
// 		}
// 		window.history.pushState('forward',null,'')
// 		window.history.forward(1)
// 		setTimeout(function(){
// 			localStorage.setItem('gwktype2', 1)
// 		}, 1000)
// 	}
// })()

let oldsort = localStorage.getItem('oldsort')
if (oldsort == null) {
	localStorage.setItem('oldsort', 1)
	oldsort = 0
}

// 获取补贴金额
getAumont()
function getAumont() {
	http('GET', `/mallv2/h5/oldfornew/account`).then((res) => {
		let used = res.data.used == null ? 0 : parseInt(res.data.used)
		let aumont = 4000 - used < 0 ? 0 : 4000 - used
		$('#aumont').text(aumont)
		$('#aumont1').text(aumont)
		$('#aumont2').text(aumont)
	}, err => {
		console.log(err)
	})
}

// 第一次进页面显示购物卡弹窗
// let showCard = localStorage.getItem('showCard')
// if (showCard == null) {
// 	localStorage.setItem('showCard', 1)
// } else {
// 	$('#mask').addClass('dn')
// }

// 获取轮播图商品
getSwiperProductList()
function getSwiperProductList() {
	http('GET', `/mallv2/app/oldfornew/queryOldForNewCenter`).then((res) => {
		let productList = res.data.columnList[0].productList
		let html = ''
		$.each(productList, (index, item) => {
			html += `<div class="swiper-slide">
						<div class="scroll-view-item" onclick="window.open('../productDetail/newsProductDetail.html?productId=${item.id}&productType=4', '_self')">
							<img class="product-infoImg" src="${item.productImg}" />
							<div class="product-info">
								<div class="price-real">
									<p class="sum">补贴${item.activityMax}元</p>
									<p class='sub'>￥${item.curPrice}</p>
								</div>
								<div class="integral-price">
									<div class="curPrice">
										<span class="price2">疯抢热度${filterVolume(item.volumeStr)}</span>
									</div>
								</div>
							</div>
						</div>
					</div>`
		})
		$('#hotProduct2').html(html)
		new Swiper('.swiper-container-hot', {
			autoplay: {
				delay: 2000,
				disableOnInteraction: false
			},
			loop: true,
			speed: 1500,
			slidesPerView: 3,
			centeredSlides: true,
		})
	}, err => {
		console.log(err)
	})
}
// 获取 热门补贴商品 数据
getHotProductList()
function getHotProductList() {
	http('GET', `/mallv2/app/oldfornew/queryOldForNewCenter`).then((res) => {
		let productList = res.data.columnList[0].productList
		// <span class="sub">+${item.price}</span>元<img class="icon" src="https://img.quanminyanxuan.com/other/dfb3e03ee51f4d0dac75d6e359e5bbac.png">
		let html = ''
		$.each(productList, (index, item) => {
			html += `<div class="scroll-view-item" onclick="window.open('../productDetail/newsProductDetail.html?productId=${item.id}&productType=4', '_self')">
							<img class="w100" src="${item.productImg}" />
							<div class="product-info">
								<div class="descr">${item.productName}</div>
								<div class="price-real">
									
									<div class="sum">${item.activityMax}补贴金<span class='sub'>+${item.price}元</span></div>
								</div>
								<div class="integral-price">
									<div class="price">
										<img src="https://img.quanminyanxuan.com/other/304d16044df143338e3776bec47b807d.png" >
										<span class="price2">疯抢热度${filterVolume(item.volumeStr)}</span>
									</div>
								</div>
							</div>
							<img class="ranking-icon" src="${rankingIcon[index]}" >
						</div>`
		})
		$('#hotProduct').html(html)
	}, err => {
		console.log(err)
	})
}


// 获取 瀑布流商品 数据
getColumnProductList()
function getColumnProductList() {
	http('GET', `/mallv2/app/oldfornew/queryOldForNewColumnList`).then((res) => {
		let columnList = res.data.columnList
		// console.log('栏目商品:', columnList)
		// 精品推荐 数据渲染
		productListShow(columnList[0].productList, $('#zxbtProduct'))
		// 大额补贴 数据渲染
		productListShow(columnList[1].productList, $('#debtProduct'))
		// 猜你喜欢 数据渲染
		productListShow(columnList[2].productList, $('#ppbtProduct'))
		// 换新补贴 数据渲染
		// productListShow(columnList[3].productList, $('#hxbtProduct'))
	}, err => {
		console.log(err)
	})
}

// 获取 瀑布流商品（金额） 数据
function getColumnProductListFlag() {
	http('GET', `/mallv2/h5/oldfornew/queryOldForNewCenterListByPage`, {
		pageNum,
		pageSize: 30,
		flag
	}).then((res) => {
		let columnList = res.data
		// console.log('瀑布流商品(金额):', columnList)
		$('.product-column').addClass('dn')
		$('#allProduct').removeClass('dn')
		$('#allProduct').html('')
		// 补贴金额商品 数据渲染
		productListShow(columnList, $('#allProduct'))
	}, err => {
		console.log(err)
	})
}

// 获取 滚动用户列表 数据
getFakeUsers()
function getFakeUsers() {
	http('GET', `/mallv2/activity/getFakeUserList`, {
		activityType: 'OLD_FOR_NEW'
	}).then((res) => {
		let fakeUsers = res.data
		// console.log('用户:', fakeUsers)
		
		// 向上滚动
		let user = ''
		$.each(fakeUsers, (index, item) => {
			user += `<div class="swiper-slide">
						<div class="roll-item">
							<img class="img" src="${item.headImg}" >
							<div class="roll-text">${item.nickname}使用消费补贴金换购了商品，节省了${item.money}元!</div>
						</div>
					</div>`
		})
		$('#userRandom').html(user);
		new Swiper('.swiper-container-random', {
			direction: 'vertical',
			autoplay: {
				delay: 4000,
				disableOnInteraction: false
			},
			speed: 500,
			loop: true
		})
		
		// 向左滚动
		let user2 = ''
		$.each(fakeUsers, (index, item) => {
			user2 += `<div class="swiper-slide">
						<img class="img" src="${item.headImg}" />
					</div>`
		})
		$('#userRandomHead, #userRandomHead2').html(user2);
		new Swiper('.swiper-container-user', {
			autoplay: {
				delay: 500,
				disableOnInteraction: false
			},
			loop: true,
			speed: 1500,
			slidesPerView: 4,
			observer:true,
			observeParents:true
		})
		new Swiper('.swiper-container-user2', {
			autoplay: {
				delay: 500,
				disableOnInteraction: false
			},
			loop: true,
			speed: 1500,
			slidesPerView: 4,
			observer:true,
			observeParents:true
		})
		let people = Number((Math.random()*2000).toFixed(0))
		if(people == 0){
			people = (Math.random()*2000).toFixed(0)
		}else if(people < 1000){
			people = people + 1000
		}else if(people > 3000){
			people = 2685
		}
		$('#peo').text(people)
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
	let hour1 = ''
	let minute1 = ''
	let second1 = ''
	let minutes1 = ''
	let tmpTime = `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`
	
	// 记录三天后的时间
	let endTime
	if (localStorage.getItem('endTimeOldOfNew') == null) {
		endTime = new Date(tmpTime).getTime() + 72 * 60 * 60 * 1000 - 1
		localStorage.setItem('endTimeOldOfNew', endTime)
	} else {
		endTime = localStorage.getItem('endTimeOldOfNew')
	}
	
	let countClock = setInterval(() => {
		var nowTime = new Date()
		var nMS = endTime - nowTime.getTime()
		// 三天到期再追加三天
		if (nMS <= 0) {
			endTime = new Date(tmpTime).getTime() + 72 * 60 * 60 * 1000 - 1
			localStorage.setItem('endTimeOldOfNew', endTime)
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
		  hour1 = myH
		  minute1 = myM
		  second1 = myS
		  minutes1 = myMS
		} else {
		  hour = '00'
		  minute = '00'
		  second = '00'
		  minutes = '0'
		  hour1 = '00'
		  minute1 = '00'
		  second1 = '00'
		  minutes1 = '0'
		}
		$('#hour').text(hour)
		$('#minute').text(minute)
		$('#second').text(second)
		$('#minutes').text(minutes)
		$('#hour1').text(hour)
		$('#minute1').text(minute1)
		$('#second1').text(second1)
		$('#minutes1').text(minutes1)
	}, 100)
})()

// 部分dom操作
$(function () {
	new Swiper('.swiper-container-midbar', {
		autoplay: {
			delay: 4000,
			disableOnInteraction: false
		},
		speed: 500,
		loop: true,
		slidesPerView: 3,
		spaceBetween:10,
	})
	// 立即使用按钮
	$('#ljsy').on('click', function() {
		let productBoxTop = $('#tabtxWrap').offset().top
		$('html, body').scrollTop(productBoxTop)
	})
	$('.banbox-wrap').on('click', function() {
		let productBoxTop = $('.boxt-bg').offset().top
		$('html, body').scrollTop(productBoxTop)
	})
	
	// 选项卡切换商品列表
	$('#tabtxBox').on('click', '.scroll-view-item', function() {
		isLoading = true
		$(this).addClass('active').siblings().removeClass('active')
		let tabtxWrapTop = $('#tabtxWrap').offset().top - 40
		$('html, body').scrollTop(tabtxWrapTop)
		// $(this).parents('.tabtx').addClass('fixed')
		$('.product-column').removeClass('dn')
		
		// 跳到对应商品列表
		let productBoxTop = $('.product-box').eq($(this).index()).offset().top
		$('html, body').scrollTop(productBoxTop-100)
		setTimeout(function() {
			isLoading = false
		}, 500)
	})
	
	// 页面滚动事件
	$(window).on('scroll', function () {
		let scrollTop = $(this).scrollTop()
		let wHeight = $(this).height()
		let dHeight =$(document).height() - 300
		
		// 导航固定
		let tabtxWrap = $('#tabtxWrap')
		let tabtxBox = $('#tabtxBox')
		let contxhig = $('#contx').offset().top
		let tabtxWrapTop = tabtxWrap.offset().top
		if (tabtxWrapTop > scrollTop) {
			$('.oldForNewBar').show()
		}else if(tabtxWrapTop - 20 < scrollTop){
			$('.oldForNewBar').hide()
		}
		
		// 滚动商品列表，相应的选项卡选中
		$('.product-box').each(function (i, e) {
			let productBoxTop = $('.product-box').eq(i+1).offset().top - 120
			if (productBoxTop > scrollTop) {
				$('.tab-item').eq(i).addClass('active').siblings().removeClass('active')
				return false
			}
		})
		
		// 滚动到热门补贴
		// let boardBoxTop = $('#boardBox').offset().top
		// if (boardBoxTop - wHeight < scrollTop) {
		// 	getColumnProductList1()
		// 	isLoading = true
		// }
		
		// 滚动到底部
		// if (scrollTop + wHeight > dHeight) {
		// 	getColumnProductList1()
		// 	isLoading = true
		// }
	})
	
	// 删除 打开app按钮
	$('#closeAppBar').on('click', function() {
		$('#appBar').remove()
	})
	// 关闭弹窗
	$('.tanbut1').click(()=>{
		$('#mask').hide()
		location.href='../activityH5/doubleEleven/index.html'
		clikStatistics('BTTC_GB')
	})
	$('.tanbut2').click(()=>{
		$('#mask').hide()
		clikStatistics('BTTC_GG')
	})
	$('.tancImg').click(()=>{
		$('#mask').hide()
		clikStatistics('BTTC_GB1')
	})
	// 下载app
	$(document).on('click','#appBar .bar-right',function () {
		clikStatistics('BUTIE_APP')
		downAppgo()
	})
	
	// 离开页面
	$(window).on('pagehide', function(){
		localStorage.setItem('gwktype2', 0)
		// userSwiper.autoplay.stop()
	})
	
})