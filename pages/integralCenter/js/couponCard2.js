let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]
let pageNum = 1		//专享好礼
let pageNum2 = 1	//精品兑换
let isLoading = false		//判断瀑布流是否加载中
let isLoading2 = false		//判断瀑布流是否加载中
let columnId = 419
let flag = 1
let sortField = 0
let sort = 0
let canMyCash = 0
let isWeapp = 3
envType().then((res) => { isWeapp = res })
timer()						// 倒计时
pageStatistics() 			// 页面统计
// getUserInfo(sourcePlatform)	// 获取用户信息
// 广点通渠道统计
// gdt('track', 'VIEW_CONTENT', {});// 浏览


// 返回拦截
let backFlag = false	// 解决bug：进详情页后返回到当前页触发拦截事件

// 页面载入时使用pushState插入一条历史记录
history.pushState(null, null, '#')
window.addEventListener('popstate', function (event) {
    // 点击回退时再向历史记录插入一条，以便阻止下一次点击回退
    // history.pushState(null, null, '#' )
    // if (backFlag) {
    //     window.location.href = '../integralCenter/gainScore.html'
    // }
    if (backFlag) {
        switch (isWeapp) {
            case 1:
                handleToWXCard(window.location.href)
                break;
            case 2:
                handleToWXCard(window.location.href)
                // wx.miniProgram.switchTab({ url: '/pages/shopping/shopping' })
                break;
            case 3:
                window.location.href = '../integralCenter/gainScore.html'
                break;
        }
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
console.log('测试');
// 获取用户信息
; (function () {
    http('GET', `/users/login/h5Login`, {
        sourcePlatform
    }).then((res) => {
        let userInfo = res.data
        localStorage.setItem('userInfo', JSON.stringify(userInfo))
        taskScore = userInfo.taskScore
        $('#taskScore').text(taskScore)
        http('GET', `/mallv2/h5/score/getUsedScore`).then((res) => {
            $('.myScore').text(userInfo.score - res.data + userInfo.taskScore)
            $('.pastScore').text(userInfo.score - res.data)
        })
    })
})()

// 获取 商品导航
getProductNav()
function getProductNav () {
    http('GET', `/mallv2/activity/getColumn`, {
        activityType: 'H5_COUPON',
        isShow: 1
    }, { source: 'h5' }).then((res) => {
        let productNav = res.data
        let html = ''
        $.each(productNav, (i, n) => {
            html += `<div class="tab-item" data-columnid="${n.id}">
    <div class="tab-title">${n.title}</div>
</div>`
        })
        $('#tabTopNav').append(html)
        $('#tabTopNav .tab-item').eq(0).addClass('tab-item-active')
        columnId = productNav[0].id
        getProductList()
    }, err => {
        console.log(err)
    })
}

// 获取 全部商品
function getProductList () {
    if (isLoading) return
    isLoading = true
    http('GET', `/mallv2/h5/activity/queryListByPage`, {
        columnId,
        pageNum: 1,
        pageSize: 20,
        flag,
        activityType: 'H5_COUPON'
    }).then((res) => {
        isLoading = false
        let productList = res.data
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

        // 数据渲染
        productListScore(productList, $('#productList'))
    }, err => {
        console.log(err)
    })
}
function sortFieldFn (sf) {
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
function getFakeUsers () {
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
    <div class="roll-text">${item.nickname}使用专享券抢购了${item.productName}，节省了${item.money}元!</div>
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
            observer: true,
            observeParents: true
        })
        new Swiper('.swiper-container-user2', {
            autoplay: {
                delay: 500,
                disableOnInteraction: false
            },
            loop: true,
            speed: 1500,
            slidesPerView: 4,
            observer: true,
            observeParents: true
        })
        let people = Number((Math.random() * 2000).toFixed(0))
        if (people == 0) {
            people = (Math.random() * 2000).toFixed(0)
        } else if (people < 1000) {
            people = people + 1000
        } else if (people > 3000) {
            people = 2685
        }
        $('#peo').text(people)
    }, err => {
        console.log(err)
    })
}


// 弹窗逻辑开始

// 微信登录
function oauthLogin () {
    let baseUrl = 'https://svip.quanminyanxuan.com'
    // 授权重定向URL
    let callback_url = encodeURIComponent(
        `${baseUrl}/pages/wxOauthRes/wxOauthResCard.html`
    )
    // 拼接授权地址
    let wxOauthUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxec8f6c583bf2befb&redirect_uri=${callback_url}&response_type=code&scope=snsapi_base#wechat_redirect`
    // 跳转
    console.log('xx', wxOauthUrl)
    localStorage.setItem('formUrl', window.location.href)
    window.location.href = wxOauthUrl
}
function getWxCardUrl () {
    let openId = localStorage.getItem('WxOpenid')
    http('GET', `/mallv2/h5_card/getWxCardUrl`, {
        openId,
    }).then((res) => {
        window.location.href = res.data
    }, err => {
        console.log(err)
    })
}
let openId = localStorage.getItem('WxOpenid')
// envType().then((res) => {
//     switch (res) {
//         case 1:
//             let quanmin_couponCard2 = localStorage.getItem('quanmin_couponCard2')
//             if (!quanmin_couponCard2&&!openId) return oauthLogin()
//             // 第一次进页面弹窗
//             if (!quanmin_couponCard2 && openId) {
//                 quanmin_couponCard2 = 1
//                 localStorage.setItem('quanmin_couponCard2', quanmin_couponCard2)
//                 $('.vip-layer').removeClass('dn')
//             }
//             break;
//         case 2:
//             $('.vip-layer').addClass('dn')
//             break;
//         case 3:
//             $('.vip-layer').addClass('dn')
//             break;
//     }
// })
$('.getCoupon').on('click', function () {
    getWxCardUrl()
    $('.vip-layer').addClass('dn')
})

// 弹窗逻辑结束
function toWeapp () {
    envType().then((res) => {
        switch (res) {
            case 1:
                window.open('../discover/discover.html', '_self')
                break;
            case 2:
                // wx.miniProgram.switchTab({ url: '/pages/shopping/shopping' })
                window.open('../discover/discover.html', '_self')
                break;
            case 3:
                window.open('../discover/discover.html', '_self')
                break;
        }
    })
}

// 部分dom操作
$(function () {

    // 轮播图
    // new Swiper ('.swiper-container-banner', {
    // 	autoplay: {
    // 		delay: 5000,
    // 		disableOnInteraction: false
    // 	},
    // 	speed: 500,
    // 	loop: true,
    // 	pagination: {
    // 		el: '.swiper-pagination',
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
    $('#contactService').on('click', function () {
        window.location.href = `https://app.quanminyanxuan.com/#/pages/chat/chat?
phone=${phone}&customerId=${phone}&channel=${channel}&machine=${machine}&enterPage=${enterPage}&enterType=${enterType}&platform=${platform}`
    })
    // 规则弹窗
    $('#ruleShow').on('click', function () {
        $('#ruleBox').removeClass('dn')
    })
    $('#ruleHide').on('click', function () {
        $('#ruleBox').addClass('dn')
    })
    $('.time-list .time-item').text('有效期：' + moment().format('YYYY-MM-DD') + '(仅限今日)')
    $('.coupon49').text('有效期：' + moment().format('YYYY-MM-DD') + '(仅限今日)')
    // 选项卡切换商品列表
    $('.tab-box').on('click', '.tab-item', function () {
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
    $('.search-box').on('click', function () {
        $('html, body').scrollTop($('#tabBoxNav').offset().top)
        // $('.tab-box').find('.tab-item').eq(1).trigger('click')
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
