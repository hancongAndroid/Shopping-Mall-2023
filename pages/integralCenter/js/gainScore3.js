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
let weapp = false
let redWalletMoney = 0
timer()						// 倒计时
pageStatistics() 			// 页面统计
// 广点通渠道统计
// gdt('track', 'VIEW_CONTENT', {});// 浏览

// let isWX = WeiXinType()
// if (isWX) handleToWXCard(window.location.href)
// 获取用户信息
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
            }
        }
    }).then((res) => {
        if (res&&res.code == 200) {
            redWalletMoney = res.data
        }
    })
    getProductNav()
}
envType().then((res) => {
    if (res == 2) {
        weapp = true
        getUsers()
    }else{
        getUsers2()
    }
})
function getUsers(){
    http('GET', `/users/users/getUsers`).then((res) => {
		userInfo = res.data
		localStorage.setItem('userInfo', JSON.stringify(userInfo))
        let sore = userInfo.taskScore + userInfo.temporarySore
		$('.scoreNum').text(sore || 13700)
		$('.scoreNum1').text(sore || 13700)
	})
}
function getUsers2(){
    http('GET', `/users/login/h5Login`, {
        sourcePlatform
    }).then((res) => {
        userInfo = res.data
		localStorage.setItem('userInfo', JSON.stringify(userInfo))
		taskScore = userInfo.taskScore
		$('.taskScore').text(taskScore)
        http('GET', `/mallv2/h5/score/getUsedScore`).then((res) => {
            $('.scoreNum').text(userInfo.score - res.data + userInfo.taskScore)
            $('.scoreNum1').text(userInfo.score - res.data )
        })
    })
}
// 签到 积分计算
function toSign () {
    if (weapp) {
        http('GET', '/users/users/signIn').then(res => {
            if (res.code == 200) {
                getUsers()
                layer.open({
                    content: `签到成功 +${res.data}积分`,
                    skin: 'msg',
                    time: 1
                })
            } else {
                layer.open({
                    content: '请明日再来签到',
                    skin: 'msg',
                    time: 1
                })
            }
        });
    }else{
        http('GET', `/users/h5Sign/h5ToSign
        `).then(async (res) => {
            if (res.code == 200) {
                getUsers2()
                layer.open({
                    content: `签到成功 +${res.data}积分`,
                    skin: 'msg',
                    time: 1
                })
            } else {
                layer.open({
                    content: '请明日再来签到',
                    skin: 'msg',
                    time: 1
                })
            }
        })
    }
}
const goldNav = getNav('goldNav')
// 获取 商品导航
function getProductNav () {
    http('GET', `/mallv2/activity/getColumn`, {
        activityType: 'H5_RED_PACKET',
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

// 获取 商品列表
function getProductList () {
    if (isLoading) return
    isLoading = true
    http('GET', `/mallv2/h5/activity/queryListByPage`, {
        columnId,
        pageNum,
        pageSize: 20,
        flag: 0,
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
	$('#contactService').on('click', function() {
		window.location.href = `https://app.quanminyanxuan.com/#/pages/chat/chat?
		phone=${phone}&customerId=${phone}&channel=${channel}&machine=${machine}&enterPage=${enterPage}&enterType=${enterType}&platform=${platform}`
	})
	
	// 签到
	$('.btnSign').on('click', toSign)
	
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
		columnId = $(this).data('columnid')
		$('html, body').scrollTop(productBoxTop - 40)
        getProductList()
	})

	// 页面滚动事件
	$(window).on('scroll', function () {
		let scrollTop = $(this).scrollTop()
		let wHeight = $(this).height()
		let dHeight = $(document).height() - 300
		let tabBoxNav = $('.hengb').offset().top
		
		// 滚动到底部
        
		if (scrollTop + wHeight > dHeight) {
            getProductList()
		}
	})

})
// 点击浏览商品促发积分发放
async function clickTaskScore() {
  await http('GET', `/users/score/addScoreByBrowsing`).then((res) => {
    if (res.code == 200 && res.data.getScoreFlag) {
      userInfo.taskScore = taskScore + res.data.addScore
      userInfo.totalScore = userInfo.totalScore + res.data.addScore
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
      $('.scoreNum').text(parseInt($('.scoreNum').text()) + res.data.addScore)
      $('.taskScore').text(parseInt($('.taskScore').text()) + res.data.addScore)
    }
	}, err => {
		console.log(err)
	})
  window.open('../integralCenter/newToday.html', '_self')
  
}
// 返回拦截
let backFlag = false	// 解决bug：进详情页后返回到当前页触发拦截事件

// 页面载入时使用pushState插入一条历史记录
history.pushState(null, null, '#' )
window.addEventListener('popstate', function(event) {
    // 点击回退时再向历史记录插入一条，以便阻止下一次点击回退
    // history.pushState(null, null, '#' )
    if (backFlag) {
        window.location.href = '../integralCenter/gold.html'
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
