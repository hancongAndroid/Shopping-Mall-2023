let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]
let pageNum = 1		//专享好礼
let isLoading = false		//判断瀑布流是否加载中
let columnId = 419
let flag = 0
let sortField = 0
let sort = 0
timer()						// 倒计时
pageStatistics() 			// 页面统计
let isWeapp = 3
envType().then((res) => { isWeapp = res })
// 返回拦截
let backFlag = false	// 解决bug：进详情页后返回到当前页触发拦截事件

let couponList = [
    { num: 500, text: '满500.01可用', img: 'https://img.quanminyanxuan.com/other/0af907fa38b2431cac7f9d05aeb8c928.png', blackImg: 'https://img.quanminyanxuan.com/other/2a0a0b2b7ec340ceb254d4623bb5a1e3.png' },
    { num: 500, text: '满500.01可用', img: 'https://img.quanminyanxuan.com/other/0af907fa38b2431cac7f9d05aeb8c928.png', blackImg: 'https://img.quanminyanxuan.com/other/2a0a0b2b7ec340ceb254d4623bb5a1e3.png' },
    { num: 100, text: '无门槛', img: 'https://img.quanminyanxuan.com/other/67e2c935a9134809a318502fc8053155.png', blackImg: 'https://img.quanminyanxuan.com/other/c16be7848703446aa326b69f3d8fb032.png' },
    { num: 100, text: '无门槛', img: 'https://img.quanminyanxuan.com/other/67e2c935a9134809a318502fc8053155.png', blackImg: 'https://img.quanminyanxuan.com/other/c16be7848703446aa326b69f3d8fb032.png' },
    { num: 50, text: '无门槛', img: 'https://img.quanminyanxuan.com/other/848721a836d64452afd7802ddba88cd8.png', blackImg: 'https://img.quanminyanxuan.com/other/c393335da1004e99b900701e12981f2f.png' },
    { num: 50, text: '无门槛', img: 'https://img.quanminyanxuan.com/other/848721a836d64452afd7802ddba88cd8.png', blackImg: 'https://img.quanminyanxuan.com/other/c393335da1004e99b900701e12981f2f.png' },
]

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
                window.location.href = '../integralCenter/gainScore.html'
                break;
            case 2:
                // wx.miniProgram.switchTab({ url: '/pages/shopping/shopping' })
                window.location.href = '../integralCenter/gainScore.html'
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
useCouponType()
function useCouponType () {
    let useCouponTime = localStorage.getItem('useCouponTime') || moment()
    let days = moment().diff(moment(useCouponTime), 'days')
    if (days >= 1) {
        localStorage.clear('useCouponTime')
        localStorage.clear('useCoupon')
        return
    }
    let useCoupon = localStorage.getItem('useCoupon')||''
    useCoupon = useCoupon.split(',')
    if(useCoupon.length){
        useCoupon.forEach((couponItem) => {
            for (let index = couponList.length-1; index >= 0; index--) {
                const element = couponList[index];
                if (couponItem == element.num && element.text !==1) {
                    element['text'] = 1
                    return
                }
            }
        })
    }
}
init()
function init () {
    let html = ''
    couponList.forEach((value) => {
        html += `
        <li class="coupon-box" style="background: url(${value.text == 1 ? value.blackImg : value.img}) no-repeat;background-size: 100% 100%;${value.text == 1 ? 'filter: grayscale(100%);' : ''}">
            <div class="top ${value.text == 1 ? 'dn' :''}">会员神券<span style="font-size: 0.2rem;">（仅限今日）</span></div>
            <div class="counter1 ${value.text == 1 ? 'dn' :''}">
                <div class="num" id="hour">00</div>
                <div class="text-two">:</div>
                <div class="num minute" >00</div>
                <div class="text-two">:</div>
                <div class="num second" >00</div>
                <p class="numtxt"> 后失效</p>
            </div>
        </li>
        `
    })
    $('.coupon-list').html(html)
}
// 获取 全部商品
function getProductList () {
    if (isLoading) return
    isLoading = true
    http('GET', `/mallv2/h5/activity/queryListByPage`, {
        columnId,
        pageNum,
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
    <div class="roll-text">${item.nickname}使用代金券抢购了${item.productName}，节省了${item.money}元!</div>
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
    // 规则弹窗
    $(document).on('click', '#ruleShow', function () {
        $('#ruleBox').removeClass('dn')
    })
    $('#ruleHide').on('click', function () {
        $('#ruleBox').addClass('dn')
    })
    $('.today').html('有效期：' + moment().format('YYYY-MM-DD') + '</br>(仅限今日)')
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
        flag = 1
        sortField = 0
        sort = 0
        $('.select-box .select-item').removeClass('active up')
        $('#productList').html('')
        columnId = $(this).data('columnid')
        $('html, body').scrollTop(productBoxTop - 40)

        getProductList()
    })
    $('.day').text(moment().add(1, 'days').format("YYYY.MM.DD"))
    // 搜索框

    $(document).on('click', '.search-box', function () {
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
