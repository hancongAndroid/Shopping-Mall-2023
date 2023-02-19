let columnId = 0
let pageNum = 1
let isLoading = false
let flag = 0
timer()						// 倒计时
pageStatistics() 			// 页面统计
const goldNav = getNav('goldNav')
goldNav.getFakeUsers()
goldNav.getProductNav()
// goldNav.scrollFn()
// goldNav.navClick()

// 自动拉起会员卡
// let isWX = WeiXinType()
// if (isWX) handleToWXCard(window.location.href)

let time = moment().add(1, 'days').format('YYYY年MM月DD日')
$('#time').text(`${time}0点`)
let wxType = 3 
envType().then((res) => {
    wxType = res
})
new Swiper('.swiper-container-banner', {
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
// 获取 全部商品
function getProductList () {
    if (isLoading) return
    isLoading = true
    http('GET', `/mallv2/h5/activity/queryListByPage`, {
        columnId: columnId ,
        pageNum: pageNum,
        pageSize: 20,
        flag: flag,
        activityType: 'CASH_SCORE'
    }).then((res) => {
        isLoading = false
        let productList = res.data
        pageNum++
        if (productList.length == 0 ) {
            isLoading = true
        }

        // 数据渲染
        productListScore(productList, $('#productList'))
    }, err => {
        console.log(err)
    })
}
$(window).on('scroll', function () {
    let scrollTop = $(this).scrollTop()
    let wHeight = $(this).height()
    let dHeight = $(document).height() - 300
    // 滚动到底部
    if (scrollTop + wHeight > dHeight) {
       getProductList(true)
    }
})
$('.tab-box').on('click', '.tab-item', function() {
    if ($(this).hasClass('active')) return	//点击当前无操作
    $(this).addClass('tab-item-active').siblings().removeClass('tab-item-active')
    let productBoxTop = $('#productList').offset().top
    let _index = $(this).index()
    // 导航偏移
    $('.tab-top-nav').animate({
        scrollLeft: 52.5 * (_index - 3) + 20
    }, 500)
    pageNum = 1
    isLoading = false
    $('.select-box .select-item').removeClass('active up')
    $('#productList').html('')
    columnId = $(this).data('columnid')
    $('html, body').scrollTop(productBoxTop - 75)
    getProductList()
})
$('.bottom-btn, .bottom-content').on('click', function() {
    switch (wxType) {
        case 1:
            window.open('../integralCenter/gold.html', '_self')
            break;
        case 2:
            window.open('../integralCenter/gold.html', '_self')
            break;
        case 3:
            window.open('../integralCenter/gold.html', '_self')
            break;
    }
})
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