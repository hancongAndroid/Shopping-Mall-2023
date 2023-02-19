let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]

let columnId = 0
let pageNum = 1
let isLoading = false		//判断瀑布流是否加载中
let flag = 1
let headImgArr = []			//用户头像

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
    if (backFlag) {
        window.location.href = '../integralCenter/gainScore.html'
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

// 获取补贴金额
getAumont()
function getAumont() {
	http('GET', `/mallv2/h5_activity/queryActivityMaxValue`).then((res) => {
		$('#aumont').text(res.data)
	}, err => {
		console.log(err)
	})
}

// 获取 专题
getProductSpecial()
function getProductSpecial() {
	http('GET', `/mallv2/newIndex/getSubsidyImg`).then((res) => {
		let special1 = res.data.APP_HOT_SUBSIDY
		let special2 = res.data.APP_BIG_SUBSIDY
		
		let html1 = ''
		$.each(special1, (index, item) => {
			html1 += `<div class="p-item">
						<img class="cover" src="${item.productImg}" style="opacity:0">
						<span class="disc label1">全网底价</span>
					</div>`
		})
		$('#special1').append(html1)
		
		let html2 = ''
		$.each(special2, (index, item) => {
			html2 += `<div class="p-item">
						<img class="cover" src="${item.productImg}" style="opacity:0">
						<span class="disc label2">爆款推荐</span>
					</div>`
		})
		$('#special2').append(html2)
		
		$('.label1').eq(0).text('热门排行')
		$('.label2').eq(0).text('大牌新品')
	}, err => {
		console.log(err)
	})
}

// 获取 商品导航
getProductNav()
function getProductNav() {
	http('GET', `/mallv2/activity/getColumn`, {
		activityType: 'OLD_FOR_NEW',
		isShow: 1
	}).then((res) => {
		let productNav = res.data
		let html = ''
		$.each(productNav, (i, n) => {
			if (n.title.indexOf('H5') != -1) return true
			// if (columnId == 0){
			// 	columnId = n.id
			// 	getProductList()
			// }
			html += `<div class="scroll-view-item" data-columnid="${i == 0 ? 0 : n.id}">
						<div>${n.title}</div>
					</div>`
		})
		$('#tabTopNav').append(html)
		$('#tabTopNav .scroll-view-item').eq(0).addClass('active')
	}, err => {
		console.log(err)
	})
}

// 获取 瀑布流商品
getProductList()
function getProductList() {
	if (isLoading) return
	isLoading = true
	http('GET', `/mallv2/h5/activity/queryListByPage`, {
		columnId,
		pageNum,
		pageSize: 20,
		flag,
		activityType: 'OLD_FOR_NEW'
	}).then((res) => {
		isLoading = false
		let productList = res.data
		pageNum ++
		if (productList.length == 0) {
			$('#productList').append(`<div class="guess-like">
				<i class="line l"></i>
				<img class="icon" src="https://img.quanminyanxuan.com/other/46b5dca9f8184401990bb3935d3d2ee0.png" >
				<span class="title">你可能还喜欢</span>
				<i class="line r"></i>
			</div>`)
			columnId = 0
			pageNum = 1
			flag = 1
		}
		
		// 商品数据渲染
		productListShow(productList, $('#productList'))
		
		// 第一个栏目瀑布流样式不一样
		if ($('#tabTopNav .scroll-view-item.active').index() == 0) {
			$('.content.volume').addClass('dn')
			$('.content.date').removeClass('dn')
		} else {
			$('.content.volume').removeClass('dn')
			$('.content.date').addClass('dn')
		}
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
							<div class="roll-text">${item.nickname}使用补贴抢购了${item.productName}，节省了${item.money}元!</div>
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

	// 选项卡切换商品列表
	$('#tabtxBox').on('click', '.scroll-view-item', function() {
		if ($(this).hasClass('active')) return	//点击当前无操作
		$(this).addClass('active').siblings().removeClass('active')
		let _index = $(this).index()
		// 导航偏移
		$('#tabtxBox .scroll-view').animate({
			scrollLeft: 94 * (_index - 2) + 30
		}, 500)
		pageNum = 1
		isLoading = false
		$('#productList').html('')
		columnId = $(this).data('columnid')
		getProductList()
		$('html, body').scrollTop($('#tabtxWrap').offset().top + 2)
	})
	
	// 搜索框
	$('.search-box').on('click', function() {
		$('html, body').scrollTop($('#tabtxWrap').offset().top + 2)
	})
    // 规则弹窗
    $(document).on('click', '#ruleShow', function () {
        $('#ruleBox').removeClass('dn')
    })
    $('#ruleHide').on('click', function () {
        $('#ruleBox').addClass('dn')
    })
	// 页面滚动事件
	$(window).on('scroll', function () {
		let scrollTop = $(this).scrollTop()
		let wHeight = $(this).height()
		let dHeight = $(document).height() -300
		
		// 滚动到底部
		if (scrollTop + wHeight > dHeight) {
			getProductList()
		}
	})
	
})