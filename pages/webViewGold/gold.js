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
let userInfo = {}
pageStatistics() 			// 页面统计
// 获取用户信息
getUsers()
function getUsers(){
    http('GET', `/users/users/getUsers`).then((res) => {
		userInfo = res.data
        if (userInfo.userType !== 2) {
            $('.vip-layer').removeClass('dn')
        }
		localStorage.setItem('userInfo', JSON.stringify(userInfo))
        let sore = userInfo.taskScore + userInfo.temporarySore
		$('.totalScore').text(sore || 13700)
	})
}
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
			if (columnId == 0){
				columnId = n.id
				getProductList()
			}
			html += `<div class="tab-item" data-columnid="${n.id}">
						<div class="tab-title">${n.title}</div>
					</div>`
		})
		$('#tabTopNav').append(html)
		$('#tabTopNav .tab-item').eq(0).addClass('tab-item-active')
	}, err => {
		console.log(err)
	})
}

function toApp(){
    wx.miniProgram.navigateTo({
        url: `/packageB/pages/integralCenter/index`
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
		flag: 0,
		activityType: 'CASH_SCORE'
	}).then((res) => {
		isLoading = false
		let productList = res.data
		if (productList.length == 0) isLoading = true
		pageNum ++
		
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
appendNav()
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
	$('#close').on('click', function() {
        $('.vip-layer').addClass('dn')
	})
    // 成为会员
	$('#toGetVip').on('click', function() {
        $('.vip-layer').addClass('dn')
        let isWX = WeiXinType()
        if (isWX) handleToWXCard(window.location.href)
        // http('GET', `/mallv2/memRecords/applyToMember`, ).then((res) => {
        //     layer.open({
        //         content: '会员领取成功',
        //         skin: 'msg',
        //         time: 1
        //     });
        //     getUsers()
        //     $('.vip-layer').addClass('dn')
        // }, err => {
        //     layer.open({
        //         content: '会员领取成功',
        //         skin: 'msg',
        //         time: 1
        //     });
        //     $('.vip-layer').addClass('dn')
        //     console.log(err)
        // })
	})

	// 选项卡切换商品列表
	$('.tab-box').on('click', '.tab-item', function() {
		$(this).addClass('tab-item-active').siblings().removeClass('tab-item-active')
		let productBoxTop = $('.product-box').offset().top
		let _index = $(this).index()
		// 导航偏移
		$('.tab-top-nav').animate({
			scrollLeft: 78 * (_index - 2) + 25
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
		
		if (columnId == 0) {
			columnId = '164,165,166,167,169'
		} else if (columnId == 1) {
			columnId = '164,165,166,167,169'
			canMyCash = 1
		}
		
		getProductList()
	})
	
	// 搜索框
	$('.search-box').on('click', function() {
		$('html, body').scrollTop($('#tabBoxNav').offset().top)
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
    
})