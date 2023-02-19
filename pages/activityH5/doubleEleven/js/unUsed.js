let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]
let pageNum = 1
let isLoading = false		//判断瀑布流是否加载中
let columnId = 45

pageStatistics() 			// 页面统计

// 获取补贴金额
getAumont()
function getAumont() {
	http('GET', `/mallv2/h5/oldfornew/account`).then((res) => {
		let used = res.data.used == null ? 0 : parseInt(res.data.used)
		let aumont = 4000 - used < 0 ? 0 : 4000 - used
		$('#aumont, #aumont2').text(aumont)
	}, err => {
		console.log(err)
	})
}

// 获取用户信息
;(function () {
	http('GET', `/users/login/h5Login`, {
		sourcePlatform
	}).then((res) => {
		let userInfo = res.data
		localStorage.setItem('userInfo', JSON.stringify(userInfo))
		// console.log('userInfo:', JSON.parse(localStorage.getItem('userInfo')))
		
		$('#scoreNum').text(userInfo.score)
	}, err => {
		console.log(err)
	})
})()

// 获取 滚动用户列表 数据
getFakeUsers()
function getFakeUsers() {
	http('GET', `/mallv2/activity/getFakeUserList`, {
		activityType: 'OLD_FOR_NEW'
	}).then((res) => {
		let fakeUsers = res.data
		console.log('用户:', fakeUsers)
		
		let user = ''
		$.each(fakeUsers, (index, item) => {
			user += `<div class="swiper-slide">
						<div class="roll-item">
							<img class="img" src="${item.headImg}" >
							<div class="roll-text">${item.nickname}使用补贴换购了${item.productName}，节省了${item.money}元</div>
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

// 获取 瀑布流商品 数据
getColumnProductList()
function getColumnProductList() {
	if (isLoading) return
	http('GET', `/mallv2/h5/oldfornew/queryOldForNewCenterListByPage`, {
		columnId,
		pageNum,
		pageSize: 30,
		sort: 1
	}).then((res) => {
		isLoading = false
		let productList = res.data
		console.log('瀑布流商品:', productList)
		if (productList.length == 0) isLoading = true
		pageNum ++
		
		// 商品数据渲染
		productListShow(productList, $('#productList'))
	}, err => {
		console.log(err)
	})
}

// 部分dom操作
$(function () {
	
	// 选项卡切换商品列表
	$('#tabtxBox').on('click', '.scroll-view-item', function() {
		var self = $(this)
		self.addClass('active').siblings().removeClass('active')
		let tabtxWrapTop = $('#tabtxWrap').offset().top - 160
		$('html, body').scrollTop(tabtxWrapTop)
		
		pageNum = 1
		isLoading = false
		columnId = self.data('column')
		$('#productList').html('')
		getColumnProductList()
	})
	
	// banner
	var banner = new Swiper('.swiper-container-banner', {
		autoplay: {
			delay: 3000,
			disableOnInteraction: false
		},
		loop: true,
		speed: 1000,
		slidesPerView: 2,
		spaceBetween: 10
	})
	
	// 页面滚动事件
	$(window).on('scroll', function () {
		let scrollTop = $(this).scrollTop()
		let wHeight = $(this).height()
		let dHeight =$(document).height() - 300
		
		// 导航固定
		let tabtxWrap = $('#tabtxWrap')
		let tabtxBox = $('#tabtxBox')
		let tabtxWrapTop = tabtxWrap.offset().top
		// let tabtxBoxTop = 200
		if (tabtxWrapTop < scrollTop) {
			tabtxBox.addClass('fixed')
		} else {
			tabtxBox.removeClass('fixed')
		}
		
		// 滚动到底部
		if (scrollTop + wHeight > dHeight) {
			getColumnProductList()
			isLoading = true
		}
	})
})
