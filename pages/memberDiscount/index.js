let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]

let pageNum = 1		//专享好礼
let pageNum2 = 1	//精品兑换
let isLoading = false		//判断瀑布流是否加载中

let columnId = 0
let flag = 1
timer()						// 倒计时
pageStatistics() 			// 页面统计
// getUserInfo(sourcePlatform)	// 获取用户信息
// 返回拦截
let backFlag = false	// 解决bug：进详情页后返回到当前页触发拦截事件

history.pushState(null, null, '#' )
window.addEventListener('popstate', function(event) {
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



// 获取 商品导航
getProductNav()
function getProductNav() {
	http('GET', `/mallv2/activity/getColumn`, {
		activityType: 'H5_MEMBER_DISCOUNT',
		isShow: 1
	}).then((res) => {
		// let productNav = res.data
		let productNav = [
            {title:'专享折扣',id:'261'},
            {title:'家电',id:'262'},
            {title:'数码',id:'263'},
            {title:'日用',id:'264'},
            {title:'美妆',id:'265'},
            {title:'酒水',id:'266'},
            {title:'手表',id:'267'},
            {title:'鞋服',id:'268'},
            {title:'健康',id:'269'},
            {title:'箱包',id:'270'},
            {title:'母婴',id:'271'},
            {title:'美食',id:'272'},
            {title:'车品',id:'273'},
        ]
		let html = ''
		$.each(productNav, (i, n) => {
			if (columnId == 0) {
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

// 获取 全部商品
function getProductList() {
	if (isLoading) return
	isLoading = true
	http('GET', `/mallv2/h5/activity/queryListByPage`, {
		columnId,
		pageNum,
		pageSize: 20,
		flag,
		activityType: 'H5_MEMBER_DISCOUNT'
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
		
		// 数据渲染
		productListScore(productList, $('#productList'))
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
							<div class="roll-text">${item.nickname}使用超V特权购买了${item.productName}，节省了${item.money}元!</div>
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
	 // 规则弹窗
     $('#ruleShow').on('click', function (e) {
         $('#ruleBox').removeClass('dn')
         e.stopPropagation()	//阻止事件冒泡即可
    })
    $('#ruleHide').on('click', function () {
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
		flag = 1
		$('.select-box .select-item').removeClass('active up')
		$('#productList').html('')
		columnId = $(this).data('columnid')
		$('html, body').scrollTop(productBoxTop - 40)
		
		getProductList()
	})
	// 搜索框
	$('.search-box').on('click', function(e) {
		$('html, body').scrollTop($('#tabBoxNav').offset().top)

	})

	// 页面滚动事件
	$(window).on('scroll', function () {
		let scrollTop = $(this).scrollTop()
		let wHeight = $(this).height()
		let dHeight = $(document).height() - 300
		// 滚动到底部
		if (scrollTop + wHeight > dHeight) {
			getProductList()
		}
	})
})