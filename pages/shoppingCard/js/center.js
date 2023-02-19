let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]
let taskScore = 0	//任务积分
let pageNum = 1
let isLoading = false //判断瀑布流是否加载中
let activityType = 'SECKILL'
let yhflag = localStorage.getItem('yhflag')
if (yhflag == null) {
	localStorage.setItem('yhflag', 1)
	yhflag = 0
	// openLayer()
}

pageStatistics() 			// 页面统计


// 获取钱包
;(function() {
	http('GET', `/mallv2/h5/walletdeduct/account`).then((res) => {
		let userInfo = res.data
		$('#amount').text(userInfo.amount)
	}, err => {
		console.log(err)
	})
})()

// 积分弹窗
let oldtype = localStorage.getItem('oldtype')
if(oldtype != 1){
	localStorage.setItem('oldtype', 1)
	$('#mask').show()
}

// 获取用户信息
;(function () {
	http('GET', `/users/login/h5Login`, {
		sourcePlatform
	}).then((res) => {
		let userInfo = res.data
		localStorage.setItem('userInfo', JSON.stringify(userInfo))
		// console.log('userInfo:', JSON.parse(localStorage.getItem('userInfo')))
		var acconame = userInfo.account
		acconame = acconame.replace('YX','VIP ')
		$('#account').text(acconame)
		taskScore = userInfo.taskScore
		$('#taskScore').text(taskScore)
		http('GET', `/mallv2/h5/score/getUsedScore`).then((res) => {
			console.log(res)
			$('#scoreNum1').text(3750 - res.data + taskScore)
		})
	}, err => {
		console.log(err)
	})
})()

// 获取补贴金额
getAumont()
function getAumont() {
	http('GET', `/mallv2/h5/oldfornew/account`).then((res) => {
		let used = res.data.used == null ? 0 : parseInt(res.data.used)
		let aumont = 4000 - used < 0 ? 0 : 4000 - used
		if (aumont < 4000) {
			$('.aut').hide()
			$('.aut1').show()
		}
		let aumHeight = -0.7
		var tim = setInterval(()=>{
			if(aumHeight > 0){
				$('.bottom-tips').css('top','0')
				$('.icon-view1').show()
				clearInterval(tim)
			}else{
				aumHeight += 0.025
				$('.bottom-tips').css('top',aumHeight+'rem')
			}
		},10)
		$('#aumont').text(aumont)
		$('#aumont1').text(aumont)
		$('#aumont2').text(aumont)
		$('#aumont3').text(aumont)
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

		let user = ''
		$.each(fakeUsers, (index, item) => {
			user += `<div class="swiper-slide">
						<div class="roll-item">
							<img class="img" src="${item.headImg}" >
							<div class="roll-text">${item.nickname}使用补贴券换购了商品，节省了${item.money}元</div>
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
		$('#userRandomHead').html(user2);
		new Swiper('.swiper-container-user', {
			autoplay: {
				delay: 500,
				disableOnInteraction: false
			},
			loop: true,
			speed: 1500,
			slidesPerView: 3,
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

// 获取活动模块商品（积分）
getMidbarProductListScore()
function getMidbarProductListScore() {
	http('GET', `/mallv2/activity/queryCashScoreListH5`, {
		columnId: 99,
		pageSize: 10,
		pageNum: 1,
		flag: 2,
	}).then((res) => {
		let productList = res.data
		let html = ''
		$.each(productList, (index, item) => {
			if (index > 1) return
			html += `<div class="item">
						<img class="img" src="${item.productImg}">
						<span class="txt">${item.activityMax}积分</span>
					</div>`
		})
		$('#midbarScore').html(html)
	}, err => {
		console.log(err)
	})
}

// 获取活动模块商品（0元购）
getMidbarProductListZero()
function getMidbarProductListZero() {
	http('GET', `/mallv2/h5/getscore/index`).then((res) => {
		let productList = res.data.firstProductList
		let html = ''
		$.each(productList, (index, item) => {
			if (index > 1) return
			html += `<div class="item">
						<img class="img" src="${item.productImg}">
						<span class="txt">0元到手</span>
					</div>`
		})
		$('#midbarZero').html(html)
	}, err => {
		console.log(err)
	})
}

// 获取活动模块商品（购物卡）
getMidbarProductListCard()
function getMidbarProductListCard() {
	http('GET', `/mallv2/h5/shoppingcard/queryListByPage`, {
		columnId: 81,
		pageSize: 6,
		pageNum,
		flag: 1
	}).then((res) => {
		let productList = res.data
		let html = ''
		$.each(productList, (index, item) => {
			if (index > 1) return
			html += `<div class="item">
						<img class="img" src="${item.productImg}">
						<span class="txt">抵100元</span>
					</div>`
		})
		$('#midbarCard').html(html)
	}, err => {
		console.log(err)
	})
}

// 获取轮播图商品
getSwiperProductList()
function getSwiperProductList() {
	http('GET', `/mallv2/h5/oldfornew/queryOldForNewListByPage`, {
		columnId: 89,
		pageNum: 1,
		pageSize: 10
	}).then((res) => {
		let productList = res.data
		// 商品图
		// let html = ''
		// $.each(productList, (index, item) => {
		// 	html += `<div class="swiper-slide">
		// 				<div class="scroll-view-item" onclick="window.open('../productDetail/newsProductDetail.html?productId=${item.id}&productType=4', '_self')">
		// 					<img class="product-infoImg" src="${item.sceneImg}" />
		// 					<div class="product-info">
		// 						<div class="price-real">
		// 							<p class="sum">补贴￥${item.activityMax}</p>
		// 							<p class='sub'>￥${item.curPrice}</p>
		// 						</div>
		// 					</div>
		// 				</div>
		// 			</div>`
		// })
		// $('#hotProduct').html(html)
		// new Swiper('.swiper-container-hot', {
		// 	autoplay: {
		// 		delay: 2000,
		// 		disableOnInteraction: false
		// 	},
		// 	loop: true,
		// 	speed: 1500,
		// 	slidesPerView: 3,
		// 	centeredSlides: true,
		// })
		// 官方补贴
		let html2 = ''
		$.each(productList, (index, item) => {
			if (index > 3) return false
			html2 += `<li class='eva-conbox'>
						<img class='eva-conboxImg' src="${item.productImg}" >
						<div class="product-info">
							<span class="disc">补贴${item.activityMax}元</span>
							<span class="price">￥${item.curPrice}</span>
						</div>
					</li>`
		})
		$('#oldForNewList').append(html2)
	}, err => {
		console.log(err)
	})
}

// 获取 更多特卖 数据
getProductList()
function getProductList() {
	if (isLoading) return
	isLoading = true
	http('GET', `/mallv2/h5/membersale/queryListByPage`, {
		columnId: 0,
		pageSize: 20,
		pageNum,
		flag: yhflag
	}).then((res) => {
		isLoading = false
		let productList = res.data
		console.log('特卖:', productList)
		if (productList.length == 0) isLoading = true
		pageNum++

		// 商品数据渲染
		productListSale(productList, $('#productListMore'))
	}, err => {
		console.log(err)
	})
}
// 获取 积分瀑布流 数据
// getProductInfo()
function getProductInfo() {
	if (isLoading) return
	isLoading = true
	http('GET', `/mallv2/activity/queryCashScoreListH5`, {
		columnId: 0,
		pageSize: 30,
		pageNum: pageNum,
		flag:2
	}).then((res) => {
		isLoading = false
		let productList = res.data
		console.log('积分:', productList)
		if (productList.length == 0) isLoading = true
		pageNum ++

		// 商品数据渲染
		productListShow1(productList, $('#productListMore'))
	}, err => {
		console.log(err)
	})
}
// 获取 补贴瀑布流 数据
// getColumnProductList()
function getColumnProductList() {
	if (isLoading) return
	isLoading = true
	http('GET', `/mallv2/h5/oldfornew/queryOldForNewListByPage`, {
		columnId: 0,
		pageNum,
		pageSize: 20,
	}).then((res) => {
		isLoading = false
		let productList = res.data
		console.log('补贴:', productList)
		if (productList.length == 0) isLoading = true
		pageNum ++
		
		// 商品数据渲染
		productListShow(productList, $('#productListMore'))
	}, err => {
		console.log(err)
	})
}
// 积分商品数据渲染
function productListShow1(productList, element) {
	let html = ''
	$.each(productList, (i, n) => {
		// 0元积分取 activityMin
		let oText = ''
		if(n.pricte == 0) {
			oText = `<div class="product-text">${n.activityMax}</div>`
		} else {
			oText = `<div class="product-text">${n.activityMax}</div>`
		}
		
		// 无库存去掉链接
		let oDiv = ''
		if (n.stock == 0) {
			oDiv = `<div class="item-box">`
		} else {
			oDiv = `<div class="item-box" onclick="window.open('../productDetail/productDetail.html?productId=${n.id}', '_self')">`
		}
		html += `${oDiv}
					<div class="product-img pr">
						<img class="cover-img" src="${n.productImg}" />
						${n.stock == 0 ? '<div class="activity-end"><img src="https://img.quanminyanxuan.com/service/680fec36c9274a238df7560575911c1c.png" /></div>' : ''}
					</div>
					<div class="product-info">
						<div class="product-name">${n.productName}</div>
						<div class="product-price">
							<div>
								<img class="price-icon" src="https://img.quanminyanxuan.com/other/36a5f27b0d004d5090a14f42449cf22f.png" />
							</div>
							${oText}
							<span class="product-card">积分</span>
							<div class="price-yuan">+${n.price}元</div>
						</div>
						<div class="product-purchase">
							<div class="purchase-left">价格￥${n.originalPrice}</div>
							<div class="purchase-right">仅剩<span class="num">${filterStock(n.virtualStock)}</span>件
							</div>
						</div>
					</div>
				</div>`
	})
	$(element).append(html);
}
// 获取轮播图商品
getColumnProductList1()
function getColumnProductList1() {
	http('GET', `/mallv2/h5/oldfornew/queryOldForNewListByPage`, {
		columnId: 89,
		pageNum: 1,
		pageSize: 10
	}).then((res) => {
		let productList = res.data
		// console.log(productList)
		// 商品图
		let html = ''
		$.each(productList, (index, item) => {
			html += `<div class="swiper-slide">
						<img class="swiper-container-midbar-img" src="${item.activityMainImg}" >
						<p class='swiper-container-midbar-txt'>补贴${item.activityMax}元</p>
					</div> `
		})
		$('#hotProduct2').html(html)
		new Swiper('.swiper-container-midbar', {
			autoplay: {
				delay: 4000,
				disableOnInteraction: false
			},
			speed: 500,
			loop: true,
			slidesPerView: 2,
			spaceBetween: 5,
		})
	}, err => {
		console.log(err)
	})
}
// 部分dom操作
$(function () {
	
	// 跳转客服页
	let phone = '',   		//手机号（没有传空）
		customerId = '',   	//手机号（没有传空）
		channel = 'h5',    	//来源app、h5、weapp
		machine = navigator.userAgent.indexOf('Android') != -1 ? 'Android' : 'ios',	//系统 Android、ios 
		enterPage = 0,  	//商品id 或者订单号  (不是商品详情或者订单详情进入的传0)
		enterType = 3,			//1-商品详情 2-订单详情 3-个人中心
		platform = 1;			//平台:1全民严选 2全民开团 3果宝商城
	$('#contactService').on('click', function() {
		window.location.href = `https://app.quanminyanxuan.com/#/pages/chat/chat?
		phone=${phone}&customerId=${phone}&channel=${channel}&machine=${machine}&enterPage=${enterPage}&enterType=${enterType}&platform=${platform}`
	})
	
	// 轮播图
	let flsw = new Swiper ('.swiper-container-top', {
		autoplay: {
			delay: 3000,
			disableOnInteraction: false
		},
		slidesPerView:'auto',
		centeredSlides:true,
		spaceBetween: 8,
		speed: 1000,
		loop: true,
		pagination: {
			el: '.swiper-pagination',
		},
	})

	$('#hytm').click(()=>{
		let timeBoxTop = $('.tab-top-nav').offset().top - 10
		$('html, body').scrollTop(timeBoxTop)
	})
	// 选项卡切换商品列表
	$('.tab-item').eq(0).css('border', '0')
	$('.tab-top-nav').on('click', '.tab-item', function() {
		$(this).addClass('tab-item-active').siblings().removeClass('tab-item-active')
		let timeBoxTop = $('.content-wrap').offset().top + 3
		$('html, body').scrollTop(timeBoxTop)
	
		// 请求商品数据
		let type = $(this).data('type')
		if (type == activityType) return
		$('#productListMore').html('')
		pageNum = 1
		isLoading = false
		activityType = type
		switch (activityType) {
			case 'SECKILL':
				getProductList()
				$('.agn').hide()
				$('.tab-item').eq(0).css('border-right', '0')
				$('.tab-item').eq(1).css('border-right', '.5px solid #ccc')
				break
			case 'CASH_SCORE':
				getProductInfo()
				$('.agn').hide()
				$('.tab-item').eq(0).css('border-right', '.5px solid #ccc')
				$('.tab-item').eq(1).css('border-right', '0')
				break
			case 'OLD_FOR_NEW':
				getColumnProductList()
				$('.agn').show()
				$('.tab-item').css('border-right', '0')
				break
		}
	})
	// 页面滚动事件
	$(window).on('scroll', function() {
		let scrollTop = $(this).scrollTop()
		let wHeight = $(this).height()
		let dHeight = $(document).height() - 300
		
		// 滚动到底部
		if (scrollTop + wHeight > dHeight) {
			switch (activityType) {
				case 'SECKILL':
					getProductList()
					break
				case 'CASH_SCORE':
					getProductInfo()
					break
				case 'OLD_FOR_NEW':
					getColumnProductList()
					break
			}
			// isLoading = true
		}
		
		if (scrollTop > $('.content-wrap').offset().top) {
			$('.tab-top-box').css('border-radius', '0')
		} else {
			$('.tab-top-box').css('border-radius', '.3rem .3rem 0 0')
		}
	})
	// 页面滚动事件
	$(window).on('scroll', function () {
		let scrollTop = $(this).scrollTop()
		if (scrollTop > 600) {
			$('#backTop').removeClass('dn')
		} else {
			$('#backTop').addClass('dn')
		}
		
	})
	// 返回顶部
	$('#backTop').on('click', function() {
		$('html, body').animate({
			scrollTop: 0
		}, 500)
	})
	$('.tancImg').click(()=>{
		$('#mask').hide()
		clikStatistics('BTTC_byGB1')
	})
	$('.ewm').click(()=>{
		layer.open({
			title: '温馨提示'
			,content: `请前往APP生成专属二维码`
			,btn: ['打开APP']
			,yes: function(index){
				downAppgo()
				layer.close(index)
				clikStatistics('H5_EWM_APP')
			}  
		})
	})
})