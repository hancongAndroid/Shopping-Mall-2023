let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]
let pageNum = 1
let isLoading = false		//判断瀑布流是否加载中
var activityType = 'card'

// 商品随机标签 图标
let labelArr = [
	'https://img.quanminyanxuan.com/other/bcd5d3659d79448baa5c75d9833429b9.png',
	'https://img.quanminyanxuan.com/other/d095c9c4fa3f45c5be877879f7af3816.png',
	'https://img.quanminyanxuan.com/other/8699f20d3201474b910a2cc8a8d8d4ce.png',
	'https://img.quanminyanxuan.com/other/921cf8eaabbe4f15aa3ad56ab7581aee.png',
	'https://img.quanminyanxuan.com/other/2055be72b8994f5791d9327898227748.png',
	'https://img.quanminyanxuan.com/other/55c3c0cf5f9b4dd580aab11b9e2751e5.png',
	'https://img.quanminyanxuan.com/other/9fc6ad06da184fb3b6b6ffb5aef37a96.png',
	'https://img.quanminyanxuan.com/other/adf729de37c5414ba90975bea3214502.png',
	'https://img.quanminyanxuan.com/other/7d56ed7fbe084dd6bc4b63e792580076.png',
	'https://img.quanminyanxuan.com/other/0d559641c5934f6e9a9a35c730f14e92.png',
	'https://img.quanminyanxuan.com/other/b098c05becc543179426ba7d6f6255c0.png',
	'https://img.quanminyanxuan.com/other/17ae10b6416643f295fb98f6bb826323.png',
	'https://img.quanminyanxuan.com/other/fb035ab1665a4d70b1b118e074f45d45.png',
	'https://img.quanminyanxuan.com/other/fa1b0330891f492cb9f4b4defd012603.png'
]
// <img class="label" src="${labelArr[parseInt(Math.random()*labelArr.length,10)]}" >

// 商品随机标签 文字
let labelTextArr = [
	'好评过千人气商品',
	'好评率96%',
	'好评率97%',
	'好评率95%',
	'近期超万用户浏览',
	'近七天热销商品',
	'累计销量过万',
	'近期销量过千',
	'180天内最低价',
	'90天内最低价',
	'60天内最低价',
	'30天内最低价',
	'人气收藏商品',
	'新品尝鲜价'
]

pageStatistics() 			// 页面统计
getUserInfo(sourcePlatform)	// 获取用户信息

// 获取用户网络地址
getUserAddress()
function getUserAddress() {
	http('GET', `/users/users/getAddressByIp`).then((res) => {
		if (res.data.city) {
			$('#addressFormCity').text(res.data.city)
		} else {
			$('#addressFormCity').text('深圳市')
		}
	}, err => {
		console.log(err)
	})
}

// 获取 购物卡 数据
getShoppingcard()
function getShoppingcard() {
	http('GET', `/mallv2/h5/shoppingcard/index`).then((res) => {
		let cardInfo = res.data
		// console.log(cardInfo)
		
		$('#amount').text(cardInfo.amount)
		$('#cardNo').text(cardInfo.cardNo)
		$('#periodOfValidity').text(cardInfo.periodOfValidity)
		
		// 购物卡剩余时间
		timerCard(cardInfo.periodOfValidity.replace(/\./g, '/'))
		
		// 爆款精选
		let html = ''
		$.each(cardInfo.firstProductList, (index, item) => {
			html += `<div class="scroll-item" onclick="window.open('../productDetail/cardProductDetail.html?productId=${item.id}', '_self')">
						<img src="${item.productImg}" />
						<div class="product-info">
							<div class="name">${item.productName}</div>
							<div class="price pr">
								<span class="txt">¥</span>
								<span class="num">${item.curPrice}</span>
								<div class="bottom-r">
									<img src="https://img.quanminyanxuan.com/other/304d16044df143338e3776bec47b807d.png" >
									<span class="txt">已抢${filterVolume(item.volumeStr)}件</span>
								</div>
							</div>
						</div>
					</div>`
		})
		$('#hotProductList').html(html)
		
		// 瀑布流
		// let html2 = ''
		// $.each(cardInfo.secondProductList, (index, item) => {
		// 	// 无库存去掉链接
		// 	let oDiv = ''
		// 	if (item.stock == 0) {
		// 		oDiv = `<div class="product-item">`
		// 	} else {
		// 		oDiv = `<div class="product-item" onclick="window.open('../productDetail/cardProductDetail.html?productId=${item.id}', '_self')">`
		// 	}
		// 	html2 += `${oDiv}
		// 				<img class="img" src="${item.productImg}" >
		// 				${item.stock == 0 ? '<img class="end-img" src="https://img.quanminyanxuan.com/other/1b5eb188ec434ea9aa56a2e27f49dd3b.png" >' : ''}
		// 				<div class="product-info">
		// 					<div class="name"><img class="icon" src="https://img.quanminyanxuan.com/other/9d39dd177d80485a87487c6f196ed63b.png">${item.productName}</div>
		// 					<i class="label-text">${labelTextArr[parseInt(Math.random()*labelTextArr.length,10)]}</i>
		// 					<div class="price">¥<span class="num">${item.curPrice}</span></div>
		// 					<div class="bottom">
		// 						<div class="l">¥ ${item.originalPrice}</div>
		// 						<div class="r">月销<span class="num">${filterVolume(item.volumeStr)}</span>件</div>
		// 					</div>
		// 				</div>
		// 			</div>`
		// })
		// $('#productList').html(html2)
	}, err => {
		console.log(err)
	})
}

// 获取 更多商品 数据
getProductList()
function getProductList() {
	if (isLoading) return
	http('GET', `/mallv2/h5/shoppingcard/queryListByPage`, {
		columnId: 81,
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
				oDiv = `<div class="product-item" onclick="window.open('../productDetail/cardProductDetail.html?productId=${item.id}&productType=2', '_self')">`
			}
			html += `${oDiv}
						<img class="img" src="${item.productImg}">
						${item.stock == 0 ? '<img class="end-img" src="https://img.quanminyanxuan.com/other/1b5eb188ec434ea9aa56a2e27f49dd3b.png" >' : ''}
						<div class="product-info">
							<div class="name">${item.productName}</div>
							<i class="label-dk">抵扣立省100元</i>
							<div class="price">¥<span class="num">${item.price}</span>
								<div class="l">¥ ${item.originalPrice}</div></div>
							<div class="bottom">
								<div class="r">月销<span class="num">${filterVolume(item.volumeStr)}</span>件</div>
							</div>
							<div class="label">
								<i class="label-text">${labelTextArr[parseInt(Math.random()*labelTextArr.length,10)]}</i>
							</div>
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
		
		// 向左滚动
		let user2 = ''
		$.each(fakeUsers, (index, item) => {
			user2 += `<div class="swiper-slide">
						<img class="img" src="${item.headImg}" />
					</div>`
		})
		$('#userRandomHead2').html(user2);
		new Swiper('.swiper-container-user', {
			autoplay: {
				delay: 10,
				disableOnInteraction: false
			},
			loop: true,
			speed: 1500,
			slidesPerView: 3
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
		// $('#minutes').text(minutes)
	}, 1000)
}

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
	
	$('#people').text(5266 - parseInt(Math.random()*500, 10))
	
	// 用户向上滚动
	let random = new Swiper ('.swiper-container-random', {
		direction: 'vertical',
		autoplay: {
			delay: 3000,
			disableOnInteraction: false
		},
		speed: 500,
		loop: true
	})
	
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
	// 选项卡切换商品列表
	$('.tab-box').on('click', '.tab-item', function() {
		$(this).addClass('tab-item-active').siblings().removeClass('tab-item-active')
		let timeBoxTop = $('.card-seckill').offset().top
		$('html, body').scrollTop(timeBoxTop)
	
		// 请求商品数据
		let type = $(this).data('type')
		if (type == activityType) return
		$('#productList').html('')
		pageNum = 1
		isLoading = false
		activityType = type
		switch (activityType) {
			case 'card':
				getProductInfo()
				break
			case 'SECKILL':
				getProductInfo1()
				break
			case 'fxhh':
				getProductInfo2()
				break
		}
	})
	// 页面滚动事件
	$(window).on('scroll', function () {
		let scrollTop = $(this).scrollTop()
		let wHeight = $(this).height()
		let dHeight =$(document).height() -300
		let timeBoxTop = $('.card-seckill').offset().top
		if(scrollTop > timeBoxTop){
			$('.tab-box').show()
		}else{
			$('.tab-box').hide()
		}
		// 滚动到底部
		if ((scrollTop + wHeight) > dHeight) {
			if(activityType == 'card'){
				getProductList()
			}else if(activityType == 'SECKILL'){
				getProductList1()
			}else if(activityType == 'fxhh'){
				getProductList2()
			}
			isLoading = true
		}
	})
})