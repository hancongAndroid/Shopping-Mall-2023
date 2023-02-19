let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]

let pageNum = 1
let isLoading = false		//判断瀑布流是否加载中
let columnId = 239
let redWalletMoney = 0

timer()						// 倒计时
pageStatistics() 			// 页面统计
// 广点通渠道统计
// gdt('track', 'VIEW_CONTENT', {});// 浏览

// 返回拦截
let backFlag = false	// 解决bug：进详情页后返回到当前页触发拦截事件

// 页面载入时使用pushState插入一条历史记录
history.pushState(null, null, '#')
window.addEventListener('popstate', function (event) {
    // 点击回退时再向历史记录插入一条，以便阻止下一次点击回退
    // history.pushState(null, null, '#' )
    if (backFlag) {
        window.location.href = '../integralCenter/gainScore.html'
    }
})

// 进入页面
$(window).on('pageshow', function () {
    setTimeout(function () {
        backFlag = true
    }, 500)
})
// 离开页面
$(window).on('pagehide', function () {
    backFlag = false
})
init()
async function init () {
    await getUserInfo(sourcePlatform)	// 获取用户信息
    // 获取红包
    await http('GET', `/mallv2/redPacket/h5/queryUserRedWallet`).then((res) => {
        if (res.code == 200) {
            if (res.data == 0) {
                return http('GET', `/mallv2/redPacket/h5/receive`)
            } else {
                redWalletMoney = res.data
                $('.redWalletMoney').text(res.data)
            }
        }
    }).then((res) => {
        if (res&&res.code == 200) {
            redWalletMoney = res.data
            $('.redWalletMoney').text(res.data)
            $('.vip-layer').removeClass('dn')
        }
    })
    getProductNav()

}



// 获取 商品导航
function getProductNav () {
    http('GET', `/mallv2/activity/getColumn`, {
        activityType: 'H5_RED_PACKET',
        isShow: 1
    }, { source: 'h5' }).then((res) => {
        // 导航
        let subjectPlateDtos = res.data
        let html = ''
        columnId = subjectPlateDtos[0].id
        $.each(subjectPlateDtos, (index, item) => {
            html += `<div class="tab-item${index == 0 ? ' active' : ''}" data-column="${item.id}">
						<div class="tab-title">${item.title}</div>
						<i class="tab-sub"></i>
					</div>`
        })
        $('#tabNavList').append(html)
        getProductList()

    }, err => {
        console.log(err)
    })
}

// 获取 商品列表
function getProductList () {
    if (isLoading) return
    isLoading = true
    http('GET', `/mallv2/h5/activity/queryListByPage`, {
        columnId,
        pageNum,
        pageSize: 20,
        flag: 1,
        activityType: 'H5_RED_PACKET'
    }).then((res) => {
        isLoading = false
        let productList = res.data
        // if (productList.length == 0) isLoading = true
        pageNum++
        if (productList.length == 0) {
            $('#productList').append(`<div class="guess-like">
				<i class="line l"></i>
				<img class="icon" src="https://img.quanminyanxuan.com/other/46b5dca9f8184401990bb3935d3d2ee0.png" >
				<span class="title">你可能还喜欢</span>
				<i class="line r"></i>
			</div>`)
            pageNum = 1
        }
        productListBrand(productList, $('#productList'),redWalletMoney)
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
							<div class="roll-text">${item.nickname}使用红包抢购了${item.productName}，节省了${item.money}元!</div>
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
    let banner = new Swiper('.swiper-container-banner', {
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

    // 轮播图
    let card = new Swiper('.swiper-container-gift-card', {
        autoplay: {
            delay: 2000000,
            disableOnInteraction: false
        },
        slidesPerView: 3,
        spaceBetween: 5,
        centeredSlides: true,
        speed: 500,
        loop: true
    })

    // 选项卡切换商品列表（全民狂欢）
    $('#tabNavList').on('click', '.tab-item', function () {
        if ($(this).hasClass('active')) return	//点击当前无操作
        $(this).addClass('active').siblings().removeClass('active')
        let _index = $(this).index()
        // 导航偏移
        $('#tabNavList').animate({
            scrollLeft: 75 * (_index - 2) + 15
        }, 500)
        $('html, body').scrollTop($('.product-box').offset().top - 50)
        pageNum = 1
        isLoading = false
        $('#productList').html('')
        columnId = $(this).data('column')
        getProductList()
    })

    // 选项卡切换 全民狂欢/品牌馆
    $('.nav-box').on('click', '.nav-item', function () {
        if ($(this).hasClass('active')) return	//点击当前无操作
        $(this).addClass('active').siblings().removeClass('active')
        let _index = $(this).index()
        if (_index == 0) {
            $('.wrapper1').removeClass('dn')
            $('.wrapper2').addClass('dn')
        } else {
            $('.wrapper2').removeClass('dn')
            $('.wrapper1').addClass('dn')
        }
    })

    // 页面滚动事件
    $(window).on('scroll', function () {
        let scrollTop = $(this).scrollTop()
        let wHeight = $(this).height()
        let dHeight = $(document).height() - 300

        // 滚动到底部
        if (scrollTop + wHeight > dHeight) {
            getProductList()
            isLoading = true
        }
    })

    // 跳转品牌清仓
    $(document).on('click', '#saleZero', function () {
        window.open('../brandSale/brandClearance.html', '_self')
    })

    // 品牌清仓跳转品牌页
    $(document).on('click', '#saleZero .p-item', function (e) {
        id = $(this).data('id')
        window.open('../brandSale/brandClassify.html?id=' + id, '_self')
        e.stopPropagation()	//阻止事件冒泡即可
    })
    // 规则弹窗
    $(document).on('click', '#ruleShow', function () {
        $('#ruleBox').removeClass('dn')
    })
    $('#ruleHide').on('click', function () {
        $('#ruleBox').addClass('dn')
    })
})

// 倒计时
function timerBrand (end) {
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
        $('.hour').text(hour)
        $('.minute').text(minute)
        $('.second').text(second)
        $('.minutes').text(minutes)
    }, 100)
}