let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]

let pageNum = 1
let isLoading = false		//判断瀑布流是否加载中

let columnId = 229

// timer()						// 倒计时
pageStatistics() 			// 页面统计
getUserInfo(sourcePlatform)	// 获取用户信息
// 广点通渠道统计
// gdt('track', 'VIEW_CONTENT', {});// 浏览

// 第一次进页面弹窗
let firstIntoWomensWearIndex = localStorage.getItem('firstIntoWomensWearIndex')
if (!firstIntoWomensWearIndex) {
	localStorage.setItem('firstIntoWomensWearIndex', 1)
	$('.vip-layer').removeClass('dn')
}

// 获取 商品导航、banner
// getProductNavAndBanner()
// function getProductNavAndBanner() {
// 	http('GET', `/mallv2/subjectsController/getSubjectsInfo/87`).then((res) => {
// 		let productNav = res.data.subjectPlateDtos
// 		// let bannerlist = res.data.subjectPlateContents
// 		let html = ''
// 		// let banner = ''
// 		// 导航 123
// 		$.each(productNav, (index, item) => {
// 			if (index < 4)	{
// 				html += `<div class="item" onclick="window.open('./womensSpecial.html?id=${item.id}&title=${item.title}', '_self')">
// 							<img class="icon" src="${item.bannerUrl}">
// 							<span class="txt">${item.title}</span>
// 						</div>`
// 			} else if (index > 3 && index < 7) {
// 				$('#tabTopNav .tab-item').eq(index - 4).attr('data-columnid', 229)
// 				if (columnId == 0) {
// 					columnId = 229
// 					getProductList()
// 				}
// 			}
// 		})
// 		// banner
// 		// $.each(bannerlist, (index, item) => {
// 		// 	banner += `<div class="swiper-slide" onclick="openPageDetailOrUrl(${item.productId}, '${item.h5Url}')">
// 		// 				<img class="w100" src="${item.img}">
// 		// 			</div>`
// 		// })
// 		$('#specialNav').append(html)
// 		// $('#bannerList').append(banner)
		
// 	}, err => {
// 		console.log(err)
// 	})
// }

// 获取 全部商品
getProductList()
function getProductList() {
	if (isLoading) return
	isLoading = true
	http('GET', `/mallv2/subjectsController/getProducts`, {
		pageNum,
		pageSize: 10,
		id: columnId
	}).then((res) => {
		isLoading = false
		let productList = columnId==229? res.data.list:res.data.list.sort(randomSort)
        
		// let productList = res.data.list.sort(randomSort)
		if (productList.length == 0) isLoading = true
		if (pageNum == 1 && columnId==229) getProductList2()
		pageNum ++
		// 数据渲染
		productListWomens(productList, $('#productList'))
	}, err => {
		console.log(err)
	})
}
function getProductData(params){
    if (isLoading) return
    isLoading = true
    http('GET', `/mallv2/subjectsController/getProducts`, params).then((res) => {
        isLoading = false
		let productList = res.data.list
		if (productList.length == 0) isLoading = true
		pageNum ++
		productListWomens(productList, $('#productList'))
	})
}
function getProductList2() {
	// 最新款式
	http('GET', `/mallv2/subjectsController/getProducts`, {
		pageNum: 1,
		pageSize: 50,
		id: 230
	}).then((res) => {
		let productList = res.data.list
		productListWomens(productList, $('#productList'))
	})
	// 最热款式
	http('GET', `/mallv2/subjectsController/getProducts`, {
		pageNum: 1,
		pageSize: 50,
		id: 231
	}).then((res) => {
		let productList = res.data.list
		productListWomens(productList, $('#productList'))
	})
}

// 跳转详情页
function openPageDetailOrUrl(id, url) {
	if (id) {
		window.location.href = `../productDetail/womensProductDetail.html?productId=` + id + `&columnId=` + columnId
	} else {
		window.location.href = url
	}
}

// 时间戳转时间
function format(shijianchuo) {
	var time = new Date(parseInt(shijianchuo))
	var y = time.getFullYear()
	var m = time.getMonth()+1
	var d = time.getDate()
	var h = time.getHours()
	var mm = time.getMinutes()
	var s = time.getSeconds()
	return y+'.'+add0(m)+'.'+add0(d)
}
function add0(m) {
	return m < 10 ? '0' + m : m
}

// 部分dom操作
$(function () {
	
	// 轮播图
	new Swiper ('.swiper-container-banner', {
		autoplay: {
			delay: 3500,
			disableOnInteraction: false
		},
		speed: 500,
		loop: true,
		pagination: {
			el: '.swiper-pagination',
		}
	})
	
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

	// 选项卡切换商品列表
	$('.tab-box').on('click', '.tab-item', function() {
		// if (columnId == $(this).data('columnid')) return
		if ($(this).hasClass('active')) return
		$(this).addClass('active').siblings().removeClass('active')
		let productBoxTop = $('.product-list').offset().top
		let _index = $(this).index()
		// 导航偏移
		// $('.tab-top-nav').animate({
		// 	scrollLeft: 78 * (_index - 2) + 25
		// }, 500)
		
		pageNum = 1
		isLoading = false
		$('#productList').html('')
		columnId = $(this).data('columnid')
		$('html, body').scrollTop(productBoxTop - 44)
		getProductList()
	})
	
	// 搜索框
	// $('.search-box').on('click', function() {
	// 	$('html, body').scrollTop($('#tabBoxNav').offset().top)
	// 	$('.tab-box').find('.tab-item').eq(1).trigger('click')
	// })

	// 页面滚动事件
	$(window).on('scroll', function () {
		let scrollTop = $(this).scrollTop()
		let wHeight = $(this).height()
		let dHeight = $(document).height() - 300
		
		// 滚动到底部
		if (scrollTop + wHeight > dHeight) {
			if (columnId != 0) {
				getProductList()
			}
		}
	})
	
	// 优惠券弹窗
	setTimeout(function() {
		$('.vip-layer').addClass('dn')
	}, 5000)
	$('.vip-layer').on('click', function(e) {
		// if (e.target == this) {
			$(this).addClass('dn')
		// }
	})
	$('.endData').text(format(new Date().getTime()))

})


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
