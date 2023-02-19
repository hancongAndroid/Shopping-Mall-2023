let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]

let pageNum = 1		//专享好礼
let pageNum2 = 1	//精品兑换
let isLoading = false		//判断瀑布流是否加载中
let isLoading2 = false		//判断瀑布流是否加载中

let columnId = 0
let flag = 0
let sortField = 0
let sort = 0
let canMyCash = 0

timer()						// 倒计时
pageStatistics() 			// 页面统计
// getUserInfo(sourcePlatform)	// 获取用户信息
// 广点通渠道统计
// gdt('track', 'VIEW_CONTENT', {});// 浏览

// 第一次进页面弹窗
let firstIntoIntegralCenterGoldPage_svip = localStorage.getItem('firstIntoIntegralCenterGoldPage_svip')
if (!firstIntoIntegralCenterGoldPage_svip) {
	localStorage.setItem('firstIntoIntegralCenterGoldPage_svip', 1)
	$('.vip-layer').removeClass('dn')
}

// 返回拦截
let backFlag = false	// 解决bug：进详情页后返回到当前页触发拦截事件

// 页面载入时使用pushState插入一条历史记录
history.pushState(null, null, '#' )
window.addEventListener('popstate', function(event) {
    // 点击回退时再向历史记录插入一条，以便阻止下一次点击回退
    // history.pushState(null, null, '#' )
    // if (backFlag) {
    //     window.location.href = '../integralCenter/gainScore.html'
    // }
    if (backFlag) {
        let isWX = WeiXinType()
        if (isWX) {
        handleToWXCard(window.location.href)
        }else{
            window.location.href = '../integralCenter/gainScore.html'
        }
    }
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

// 获取用户信息
;(function () {
	http('GET', `/users/login/h5Login`, {
		sourcePlatform
	}).then((res) => {
		let userInfo = res.data
		localStorage.setItem('userInfo', JSON.stringify(userInfo))
		taskScore = userInfo.taskScore
		$('#taskScore').text(taskScore)
		http('GET', `/mallv2/h5/score/getUsedScore`).then((res) => {
			$('.myScore').text(userInfo.score - res.data + userInfo.taskScore)
			$('.pastScore').text(userInfo.score - res.data )
		})
	})
})()

// 获取 商品导航
getProductNav()
function getProductNav() {
	http('GET', `/mallv2/activity/getColumn`, {
		activityType: 'CASH_SCORE',
		isShow: 1
	}).then((res) => {
		let productNav = res.data
		let html = ''
		$.each(productNav, (i, n) => {
			if (n.title.indexOf('H5') != -1) return true
			if (n.title.indexOf('0元兑') != -1) return true
			if (columnId == 0) {
				columnId = n.id
				getProductList()
			}
            if (i==0) {
                html += `<div class="tab-item" data-columnid="${n.id}">
                            <div class="tab-title">超值兑换</div>
                        </div>`
            }else{

                html += `<div class="tab-item" data-columnid="${n.id}">
                            <div class="tab-title">${n.title}</div>
                        </div>`
            }
		})
		$('#tabTopNav').append(html)
		$('#tabTopNav .tab-item').eq(0).addClass('tab-item-active')
	}, err => {
		console.log(err)
	})
}

// 获取 全部商品
function getProductList() {
	if (isLoading) return
	isLoading = true
	http('GET', `/mallv2/h5/activity/queryListByPage`, {
		columnId,
		pageNum,
		pageSize: 20,
		flag,
		activityType: 'CASH_SCORE'
	}).then((res) => {
		isLoading = false
		let productList = res.data
		pageNum ++
		if (productList.length == 0) {
            isLoading = true
			// $('#productList').append(`<div class="guess-like">
			// 	<i class="line l"></i>
			// 	<img class="icon" src="https://img.quanminyanxuan.com/other/46b5dca9f8184401990bb3935d3d2ee0.png" >
			// 	<span class="title">你可能还喜欢</span>
			// 	<i class="line r"></i>
			// </div>`)
			// columnId = 187
			// pageNum = 1
			// flag = 1
		}
		
		// 数据渲染
		productListScore(productList, $('#productList'))
	}, err => {
		console.log(err)
	})
}

function sortFieldFn(sf) {
	flag = 0
	if (sortField == sf) {
		sortField = sf
		sort == 1 ? sort = 2 : sort = 1
	} else {
		sortField = sf
		sort = 2
	}
	
	pageNum = 1
	isLoading = false
	$('#productList').html('')
	getProductList()
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
							<div class="roll-text">${item.nickname}使用积分换购了${item.productName}，节省了${item.money}元!</div>
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

// 部分dom操作
$(function () {
	
	// 轮播图
	new Swiper ('.swiper-container-banner', {
		autoplay: {
			delay: 5000,
			disableOnInteraction: false
		},
		speed: 500,
		loop: true,
		pagination: {
			el: '.swiper-pagination',
		}
	})
	
	// 条件筛选
	// $('.select-box').on('click', '.select-item', function() {
	// 	$(this).addClass('active').siblings().removeClass('active')
	// 	if (sort == 1) {
	// 		$(this).addClass('up')
	// 	} else {
	// 		$(this).removeClass('up')
	// 	}
	// })
	
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
		let productBoxTop = $('.product-box').offset().top
		let _index = $(this).index()
		// 导航偏移
		$('.tab-top-nav').animate({
			scrollLeft: 53 * (_index - 2) + 25
		}, 500)
		
		pageNum = 1
		isLoading = false
		flag = 0
		sortField = 0
		sort = 0
		canMyCash = 0
		$('.select-box .select-item').removeClass('active up')
		$('#productList').html('')
		columnId = $(this).data('columnid')
		$('html, body').scrollTop(productBoxTop - 40)
		
		getProductList()
	})
	
	// 搜索框
	$('.search-box').on('click', function() {
		$('html, body').scrollTop($('#tabBoxNav').offset().top)
		// $('.tab-box').find('.tab-item').eq(1).trigger('click')
	})

	// 页面滚动事件
	$(window).on('scroll', function () {
		let scrollTop = $(this).scrollTop()
		let wHeight = $(this).height()
		let dHeight = $(document).height() - 300
		let tabBoxNav = $('.hengb').offset().top
		
		if ( scrollTop>tabBoxNav ) {
			// $('.tab-box').css('width','100%')
			// $('.tab-box').css('border-radius','0%')
		}else{
			// $('.tab-box').css('width','97%')
			// $('.tab-box').css('border-radius','0.12rem')
		}
		// 滚动商品列表，相应的选项卡选中
		// $('.product-box').each(function (i, e) {
		// 	let productBoxTop = $('.product-box').eq(i+1).offset().top - 120
		// 	if (productBoxTop > scrollTop) {
		// 		$('.tab-item').eq(i).addClass('tab-item-active').siblings().removeClass('tab-item-active')
		// 		return false
		// 	}
		// })
		
		// 滚动到兑换排行榜
		// let boardBoxTop = $('#boardBox').offset().top
		// if (boardBoxTop - wHeight < scrollTop) {
		// 	getProductList()
		// }
		
		// 滚动到底部
		if (scrollTop + wHeight > dHeight) {
			getProductList()
		}
	})
	
	// setTimeout(function() {
	// 	$('.vip-layer').addClass('dn')
	// }, 2000)

})