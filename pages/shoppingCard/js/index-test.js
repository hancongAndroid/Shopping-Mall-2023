let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]
let pageNum = 1;
let isLoading = false;		//判断瀑布流是否加载中
var activityType = 'card';
const classb = getUrlKey('classb');
let columnId;
console.log(classb)

pageStatistics() 			// 页面统计
getUserInfo(sourcePlatform)	// 获取用户信息


// 获取 购物卡 数据
getShoppingcard()
function getShoppingcard() {
	http('GET', `/mallv2/h5/shoppingcard/index`).then((res) => {
		let cardInfo = res.data
		
		// 购物卡剩余时间
		timerCard(cardInfo.periodOfValidity.replace(/\./g, '/'))
	}, err => {
		console.log(err)
	})
}

// 获取 更多商品 数据
getProductList()
function getProductList() {
	if (isLoading) return
	if(classb == 't1'){
		columnId = 112
		$('.txt1').text('服饰鞋包卡')
	}else if(classb == 't2'){
		columnId = 113
		$('.txt1').text('美妆个护卡')
	}else if(classb == 't3'){
		columnId = 114
		$('.txt1').text('食品礼品卡')
	}else if(classb == 't4'){
		columnId = 115
		$('.txt1').text('智能生活卡')
	}else{
		columnId = 81
		$('.txt1').text('购物卡')
	}
	http('GET', `/mallv2/h5/shoppingcard/queryListByPage`, {
		columnId: columnId,
		pageSize: 10,
		pageNum,
		flag: 1
	}).then((res) => {
		isLoading = false
		let productList = res.data
		console.log('瀑', productList)
		if (productList.length == 0) isLoading = true
		pageNum ++
		
		
		let html = ''
		$.each(productList, (index, item) => {
			// 无库存去掉链接
			let oDiv = ''
			if (item.stock == 0) {
				oDiv = `<div class="product-item">`
			} else {
				oDiv = `<div class="product-item" onclick="window.open('../productDetail/cardProductDetail.html?productId=${item.id}', '_self')">`
			}
			html += `${oDiv}
						<img class="img" src="${item.productImg}">
						${item.stock == 0 ? '<img class="end-img" src="https://img.quanminyanxuan.com/other/1b5eb188ec434ea9aa56a2e27f49dd3b.png" >' : ''}
						<div class="product-info">
							<div class="product-name">${item.productName}</div>
							<p class='imggw'>
								<span class='imggw1'>购物卡</span>
								<span class='imggw2'>100元</span>
							</p>
							<div class="product-bottom">
								<div class="price">
									<span>￥<span class="num">${item.curPrice}</span></span>
									<span class="oprice">￥${item.originalPrice}</span>
								</div>
								<div class="btn-box">
									<div class="btn-box-b">已抢<span>${filterVolume(item.volume)}</span>件</div>
								</div>
							</div>
							<div class='btn-box-but'>立即抵扣 <img src='https://img.quanminyanxuan.com/other/6b13094506e849a4b90018427cad10f8.png'/></div>
						</div>
					</div>`
		})
		$('#productList').append(html)
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
							<div class="roll-text">${item.nickname}使用购物卡抵扣了<span class="sum">100元</span></div>
						</div>
					</div>`
		})
		$('#userRandom').html(user);
		new Swiper ('.swiper-container-random', {
			direction: 'vertical',
			autoplay: {
				delay: 4000,
				disableOnInteraction: false
			},
			speed: 500,
			loop: true
		})	
	}, err => {
		console.log(err)
	})
}

// 倒计时
function timerCard(end) {
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
	$('#people').text(5266 - parseInt(Math.random()*500, 10))

	// 规则弹窗
	$('#ruleShow').on('click', function() {
		$('#ruleBox').removeClass('dn')
	})
	$('#ruleHide').on('click', function() {
		$('#ruleBox').addClass('dn')
	})
	
	$('#btnPay').on('click', function() {
		layer.open({
			content: '当前额度使用完，即可充值',
			skin: 'msg',
			time: 2
		})
	})
	
	$('#czhi').click(()=>{
		let timeBoxTop = $('.product-container').offset().top 
		$('html, body').scrollTop(timeBoxTop)
	})
	// 选项卡切换商品列表
	$('.tab-box').on('click', '.tab-item', function() {
		$(this).addClass('tab-item-active').siblings().removeClass('tab-item-active')
		let timeBoxTop = $('#productList').offset().top + 1
		$('html, body').scrollTop(timeBoxTop)
	
		// 请求商品数据
		let type = $(this).data('type')
		if (type == activityType) return
		$('#productList').html('')
		pageNum = 1
		isLoading = false
		activityType = type
		getProductList()
	})
	// 页面滚动事件
	$(window).on('scroll', function () {
		let scrollTop = $(this).scrollTop()
		let wHeight = $(this).height()
		let dHeight =$(document).height() - 300
		let timeBoxTop = $('#productList').offset().top
		if(scrollTop > timeBoxTop){
			$('.tab-box').show()
		}else{
			$('.tab-box').hide()
		}
		// 滚动到底部
		if ((scrollTop + wHeight) > dHeight) {
			getProductList()
			isLoading = true
		}
	})
})