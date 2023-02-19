let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]

let pageNum = 1		//专享好礼
let pageNum2 = 1	//精品兑换
let isLoading = false		//判断瀑布流是否加载中
let isLoading2 = false		//判断瀑布流是否加载中

let columnId = 0
let flag = 0
let scoreSignData = {}
let userInfo = {}
let taskScore = 50	//任务积分
let activityType = 'CASH_SCORE'
let isWeapp = 3
envType().then((res) => { 
    isWeapp = res
    if (isWeapp == 1) handleToWXCard(window.location.href)
    if (isWeapp == 2) handleToWXCard(window.location.href)
})
timer()						// 倒计时
pageStatistics() 			// 页面统计
// getUserInfo(sourcePlatform)	// 获取用户信息
// 广点通渠道统计
//gdt('track', 'VIEW_CONTENT', {});// 浏览
// 获取用户信息
; (function () {
    http('GET', `/users/login/h5Login`, {
        sourcePlatform: 'platform'
    }).then((res) => {
        userInfo = res.data
        localStorage.setItem('userInfo', JSON.stringify(userInfo))
        taskScore = userInfo.taskScore
        $('.taskScore').text(taskScore)
        http('GET', `/mallv2/h5/score/getUsedScore`).then((res) => {
            $('.scoreNum').text(userInfo.score - res.data + userInfo.taskScore)
            $('.scoreNum1').text(userInfo.score - res.data)
        })
    })
})()

const goldNav = getNav('goldNav')
goldNav.getFakeUsers()
// goldNav.getProductNav()

function clickFn() {
    switch (isWeapp) {
        case 1:
            handleToWXCard(window.location.href)
            break;
        case 2:
            handleToWXCard(window.location.href)
            break;
        case 3:
            openWeapp2('packageA/pages/webviewH5/webview','url=https://svip.quanminyanxuan.com/pages/memberCard/getCardGainScore.html')
            break;
    }
}
function click1() {
    // clickFn()
    window.open('../integralCenter/gold.html', '_self')
    // if (isWeapp == 2) {
    // }else{
    //     openWeapp2('packageA/pages/webviewH5/webview','url=https://svip.quanminyanxuan.com/pages/integralCenter/gainScore.html')
    // }
}
function click2() {
    clickFn()
    // window.open('../integralCenter/couponCard.html', '_self')
    // if (isWeapp == 2) {
    // }else{
    //     openWeapp2('packageA/pages/webviewH5/webview','url=https://svip.quanminyanxuan.com/pages/integralCenter/gainScore.html')
    // }
}
function click3() {
    clickFn()
    // window.open('../brandSale/carnival.html', '_self')
    // if (isWeapp == 2) {
    // }else{
    //     openWeapp2('packageA/pages/webviewH5/webview','url=https://svip.quanminyanxuan.com/pages/integralCenter/gainScore.html')
    // }
}
function click4() {
    clickFn()
    // window.open('../old2New/gundong.html', '_self')
    // if (isWeapp == 2) {
    // }else{
    //     openWeapp2('packageA/pages/webviewH5/webview','url=https://svip.quanminyanxuan.com/pages/integralCenter/gainScore.html')
    // }
}
function click5() {
    clickFn()
    // window.open('../HOT/index.html', '_self')
    // if (isWeapp == 2) {
    // }else{
        // openWeapp2('packageA/pages/webviewH5/webview','url=https://svip.quanminyanxuan.com/pages/coupon/index.html')
    // }
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
// 部分dom操作
$(function () {
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
        e.stopPropagation()	//阻止事件冒泡即可
    })
    $('#ruleHide').on('click', function () {
        $('#ruleBox').addClass('dn')
    })

    // 选项卡切换商品列表
    $('.tab-box').on('click', '.tab-item', function () {
        $(this).addClass('tab-item-active').siblings().removeClass('tab-item-active')
        let productBoxTop = $('.product-container').offset().top
        let _index = $(this).index()
        // 导航偏移
        $('.tab-top-nav').animate({
            scrollLeft: 53 * (_index - 2) + 25
        }, 500)

        pageNum = 1
        isLoading = false
        // flag = 0
        sortField = 0
        sort = 0
        canMyCash = 0
        $('.select-box .select-item').removeClass('active up')
        $('#productList').html('')
        // activityType = $(this).data('columnid')
        columnId = $(this).data('columnid')
        $('html, body').scrollTop(productBoxTop - 40)
        getProductList()
    })

    // 页面滚动事件
    $(window).on('scroll', function () {
        let scrollTop = $(this).scrollTop()
        let wHeight = $(this).height()
        let dHeight = $(document).height() - 300
        // let tabBoxNav = $('.hengb').offset().top

        // 滚动到底部

        if (scrollTop + wHeight > dHeight) {
            getProductList()
        }
    })

})
// 返回拦截
let backFlag = false	// 解决bug：进详情页后返回到当前页触发拦截事件

// 页面载入时使用pushState插入一条历史记录
history.pushState(null, null, '#')
window.addEventListener('popstate', function (event) {
    // 点击回退时再向历史记录插入一条，以便阻止下一次点击回退
    // history.pushState(null, null, '#' )
    if (backFlag) {
        window.location.href = '../integralCenter/gold.html'
        // if (isWX) {
        //     handleToWXCard(window.location.href)
        // } else {
        //     window.location.href = '../integralCenter/gold.html'
        // }
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

function timer8Min (end) {
    let hour = ''
    let minute = ''
    let second = ''
    let minutes = ''
    let tmpTime = end ? end : `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`
    // var dateTime = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
    var dateTime = new Date(
        new Date(tmpTime).getTime() + 8 * 60 * 1000 - 1
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
            dateTime = new Date(
                new Date().getTime() + 8 * 60 * 1000 - 1
            )
            hour = '00'
            minute = '00'
            second = '00'
            minutes = '0'
        }
        $('#hour, .hour').text(hour)
        $('#minute, .minute').text(minute)
        $('#second, .second').text(second)
        $('#minutes, .minutes').text(minutes)
    }, 100)
}

