let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]
let taskScore = 0	//任务积分

let pageNum = 1
let isLoading = false		//判断瀑布流是否加载中

let isWX = isWeiXin()
let isWeapp = false
let appText = isWX ? '小程序':'APP'
function openApp() {
    if (isWX) {
        openWeapp2('pages/shopping/shopping', '')
    }else{
        downAppgo()
    }
}

pageStatistics() 			// 页面统计
getUserInfo(sourcePlatform)	// 获取用户信息
// 第一次进页面弹窗
let firstIntoMemberCenter = localStorage.getItem('firstIntoMemberCenter')
if (!firstIntoMemberCenter) {
	localStorage.setItem('firstIntoMemberCenter', 1)
	$('#walletMask').removeClass('dn')
}
envType().then((res) => {
    switch (res) {
        case 2:
            isWeapp = true
            $('.login-info').addClass('dn')
            $('.login').css('padding','1rem 0 0 0')
            break;
    }
})
// 获取补贴金额
getAumont()
function getAumont() {
	http('GET', `/mallv2/h5/oldfornew/account`).then((res) => {
		console.log('account',res.data.used)
		let used = res.data.used == null ? 0 : res.data.used
		let aumont = 5800 - used < 0 ? 0 : 5800 - used
		$('#aumont').text(aumont)
	}, err => {
		console.log(err)
	})
}

// 获取钱包
;(function() {
	http('GET', `/mallv2/h5/walletdeduct/account`).then((res) => {
		let userInfo = res.data
		$('#amount').text(userInfo.amount)
	}, err => {
		console.log(err)
	})
})()

// 获取用户信息
;(function () {
	http('GET', `/users/login/h5Login`, {
		sourcePlatform
	}).then((res) => {
		let userInfo = res.data
		localStorage.setItem('userInfo', JSON.stringify(userInfo))
		// console.log('userInfo:', JSON.parse(localStorage.getItem('userInfo')))
		
		$('#scoreNum').text(userInfo.score + taskScore)
		$('#scoreNum1').text(userInfo.score + taskScore)
	}, err => {
		console.log(err)
	})
})()

// 获取 商品列表
getProductList()
function getProductList() {
	if (isLoading) return
	isLoading = true
	http('GET', `/mallv2/h5/activity/queryListByPage`, {
		columnId: 187,
		pageNum,
		pageSize: 30,
		flag: 0,
		activityType: 'CASH_SCORE'
	}).then((res) => {
		isLoading = false
		let productList = res.data.sort(randomSort)
		if (productList.length == 0) isLoading = true
		pageNum ++
		
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
	$('#contactService').on('click', function() {
        if (isWeapp) return wx.miniProgram.navigateTo({ url:'/pages/news/chat' })
		window.location.href = `https://app.quanminyanxuan.com/#/pages/chat/chat?
		phone=${phone}&customerId=${phone}&channel=${channel}&machine=${machine}&enterPage=${enterPage}&enterType=${enterType}&platform=${platform}`
	})
	
	// 跳转订单列表
	$('#orderStatusBar .card-item').on('click', function() {
		let current = $(this).data('current')
		window.location.href = `../order/orderlist.html?current=${current}`
	})
	
	// 获得购物余额弹窗
	$('#walletHide').on('click', function() {
		$('#walletMask').addClass('dn')
	})
	
	// 页面滚动事件
	$(window).on('scroll', function () {
		let scrollTop = $(this).scrollTop()
		let wHeight = $(this).height()
		let dHeight =$(document).height() - 300
		
		// 滚动到底部
		if (scrollTop + wHeight > dHeight) {
			getProductList()
		}
	})
	
	$(document).on('click','#appBar',function () {
		clikStatistics('GRZX_APP')
		downAppgo()
	})
	$('.login-info').click(()=>{
		layer.open({
			title: '温馨提示'
			,content: `请前往${appText}进行登录`
			,btn: [`打开${appText}`]
			,yes: function(index){
				openApp()
				layer.close(index)
			}  
		})
	})
    // if (isWeapp) return wx.miniProgram.switchTab({ url:'/pages/shopping/shopping' })
	$('#downApp_tk').click(()=>{
        if (isWeapp) return wx.miniProgram.navigateTo({ url:'/pages/member/order/afterSale' })
		layer.open({
			title: '温馨提示'
			,content: `退款及售后问题，请前往${appText}进行反馈`
			,btn: [`打开${appText}`]
			,yes: function(index){
				openApp()
				layer.close(index)
			}  
		})  
	})
	$('#downApp_sz').click(()=>{
        if (isWeapp) return wx.miniProgram.navigateTo({ url:'/pages/member/accountSet/account' })
		layer.open({
			title: '温馨提示'
			,content: `账户相关信息，请前往${appText}进行设置`
			,btn: [`打开${appText}`]
			,yes: function(index){
				openApp()
				layer.close(index)
			}  
		})  
	})
	$('#toAcctv').click(()=>{
        if (isWeapp) return wx.miniProgram.navigateTo({ url:'/pages/member/webview' })
        openWeapp2()
	})
	$('#downApp_qb').click(()=>{
        if (isWeapp) return wx.miniProgram.navigateTo({ url:'/pages/member/accountSet/account' })
		layer.open({
			title: '温馨提示'
			,content: `请前往全民严选${appText}进行提现`
			,btn: [`打开${appText}`]
			,yes: function(index){
				openApp()
				layer.close(index)
			}  
		})
	})
	$('.HDapp').click(()=>{
        if (isWeapp) return window.open('https://appinner.quanminyanxuan.com/pages/COD/index.html', '_self')
		layer.open({
			title: '温馨提示'
			,content: `此活动需前往${appText}参与`
			,btn: [`打开${appText}`]
			,yes: function(index){
                openApp()
				layer.close(index)
			}  
		})
	})
})