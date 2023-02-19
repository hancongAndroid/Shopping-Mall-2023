let pageNum = 1
let isLoading = false //判断瀑布流是否加载中
let columnId = 181 //商品ID

let cardSum = [100, 200, 500]

// 获取 滚动用户列表 数据
getFakeUsers()
function getFakeUsers() {
	http('GET', `/mallv2/activity/getFakeUserList`, {
		activityType: 'OLD_FOR_NEW'
	}).then((res) => {
		let fakeUsers = res.data
		
		// 向上滚动
		let user = ''
		$.each(fakeUsers, (index, item) => {
			user += `<div class="swiper-slide roll-item">${item.nickname}3分钟前购买商品节省了 <span class="light">${cardSum[randomNum(0, cardSum.length-1)]}元</span></div>`
		})
		$('#userRandom').html(user);
		new Swiper ('.swiper-container-random', {
			direction: 'vertical',
			autoplay: {
				delay: 3000,
				disableOnInteraction: false
			},
			speed: 500,
			loop: true
		})
		
	}, err => {
		console.log(err)
	})
}

// 获取 更多商品 数据
getProductList()
function getProductList() {
	if (isLoading) return
	isLoading = true
	http('GET', `/mallv2/h5/shoppingcard/queryListByPage`, {
		columnId,
		pageSize: 20,
		pageNum,
		flag: 1
	}).then((res) => {
		isLoading = false
		let productList = res.data
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
						<!--<span class="top-icon">全网底价</span>
						<img class="top-icon1" src="https://img.quanminyanxuan.com/other/e85311aaabc145658127a95c378996e2.png" >-->
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
									<div class="btn-box-b">已抢<span>${filterVolume(item.volumeStr)}</span>件</div>
								</div>
							</div>
							<!--<div class='btn-box-but'>立即抵扣 <img src='https://img.quanminyanxuan.com/other/6b13094506e849a4b90018427cad10f8.png'/></div>-->
						</div>
					</div>`
		})
		$('#productList').append(html)
	}, err => {
		console.log(err)
	})
}

// 倒计时
timerCard()
function timerCard() {
	let hour = ''
	let minute = ''
	let second = ''
	let minutes = ''
	let tmpTime = `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`
	// var dateTime = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
	var dateTime = new Date(
		new Date(tmpTime).getTime() + 72 * 60 * 60 * 1000 - 1
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
			day = myD
			hour = myH
			minute = myM
			second = myS
			minutes = myMS
		} else {
			day = '0'
			hour = '00'
			minute = '00'
			second = '00'
			minutes = '0'
		}
		$('#day').text(day)
		$('#hour').text(hour)
		$('#minute').text(minute)
		$('#second').text(second)
		$('#minutes').text(minutes)
	}, 100)
}

// 购物卡过期时间
// 三天倒计时，第一次进页面记录时间
let firstIntoShoppingCard = getCookie('firstIntoShoppingCard')
let overDay = 3
if (!firstIntoShoppingCard) {
	setCookie('firstIntoShoppingCard', new Date(), 30)
} else {
	let timer = (new Date()) - (new Date(firstIntoShoppingCard))
	let day = parseInt(timer / 1000 / 60 / 60 / 24 , 10)
	if (3 - day <= 0) {
		setCookie('firstIntoShoppingCard', new Date(), 30)
		overDay = 3
	} else {
		overDay = 3 - day
	}
}
let d = new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * overDay)
$('.timeY').text(d.getFullYear())
$('.timeM').text(d.getMonth() + 1)
$('.timeD').text(d.getDate() < 10 ? '0' + (d.getDate()) : d.getDate())

// 待激活弹窗
function waitTips() {
	layer.open({
		title: '温馨提示'
		,content: '您账户100元礼品卡还未使用，请使用后再购买此卡片'
		,btn: ['立即使用', '取消']
		,yes: function(index){
			layer.close(index)
			toProduct()
		}
		,no: function(index){
			layer.close(index)
			toProduct()
		}
	})
}

// 跳转商品
function toProduct() {
	$('#cartMask').removeClass('show')
	$('body').removeClass('noscroll')
	$('html, body').scrollTop($('#tabtxWrap').offset().top + 2)
}

// 部分dom操作
$(function() {
	let swiperCard = new Swiper('.swiper-card', {
		slidesPerView: 'auto',
		loopedSlides: 4,
		spaceBetween: 0,
		loop: true
	})
	
	// 选项卡切换商品列表
	$('#tabtxBox').on('click', '.scroll-view-item', function() {
		if ($(this).hasClass('active')) return	//点击当前无操作
		$(this).addClass('active').siblings().removeClass('active')
		$('html, body').scrollTop($('.tbta').offset().top - 20)
		pageNum = 1
		isLoading = false
		let idx = $(this).index()
		$('#productList').html('')
		switchProductList(idx)
	})
	// 商品列表切换
	function switchProductList(idx) {
		if (idx == 0) {
			columnId = 181
		} else if (idx == 1) {
			columnId = 182
		} else if (idx == 2) {
			columnId = 183
		} else if (idx == 3) {
			columnId = 184
		} else if (idx == 4) {
			columnId = 185
		}
		getProductList()
		clikStatistics('GWKdhID='+idx)
	}
	// 页面滚动事件
	$(window).on('scroll', function() {
		let scrollTop = $(this).scrollTop()
		let wHeight = $(this).height()
		let dHeight = $(document).height() - 300
		let sctop = $('#productList').offset().top
		if (scrollTop > sctop) {
			$('#tabtxWrap').css('border-radius', '0')
			// $('#tabtxWrap').css('height', '0.9rem')
			// $('#tabtxWrap').css('top', '0.65rem')
			// $('#tabtxWrap .tabtx .scroll-view .scroll-view-item img').hide()
			// $('#tabtxWrap .scroll-view-item .imgp').hide()
			// $('#tabtxWrap .active .imgp').show()
			// $('.xding').show()
		} else {
			$('#tabtxWrap').css('border-radius', ' 0.35rem 0.35rem 0 0')
			// $('#tabtxWrap').css('height', '1.96rem')
			// $('#tabtxWrap').css('top', '0rem')
			// $('#tabtxWrap .tabtx .scroll-view .scroll-view-item img').show()
			// $('#tabtxWrap .imgp').hide()
			// $('.xding').hide()
		}
		// 滚动到底部
		if ((scrollTop + wHeight) > dHeight) {
			getProductList()
		}
	})
	// $('.cardkp, .cart-item').click((e)=>{
	// 	let classb = e.currentTarget.id
	// 	clikStatistics('GWKID='+classb)
	// 	window.location.href =`../shoppingCard/index-test.html?classb=`+classb
	// })
	
	// 立即使用
	// $('#cartBtn').on('click', function() {
	// 	$('html, body').scrollTop($('#tabtxWrap').offset().top + 2)
	// })
	
	// 购物卡弹窗显示
	$('#cartBtn').on('click', function() {
		$('#cartMask').addClass('show')
		$('body').addClass('noscroll')
	})
	
	// 购物卡弹窗关闭
	$('#closeCart').on('click', function() {
		$('#cartMask').removeClass('show')
		$('body').removeClass('noscroll')
	})
	
})
