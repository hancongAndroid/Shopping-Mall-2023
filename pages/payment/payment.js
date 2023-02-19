
let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]
let orderId = getUrlKey('orderId') || 847171          //积分1175490、补贴786529、红包748749、钱包847096、全额返847171
let pageNum = 1
let isLoading = false		//判断瀑布流是否加载中
let columnId = 0			//商品栏目id
let activityType = ''
let amount = 4000			//补贴金额
let wallet = 0				//钱包余额
let userInfo = JSON.parse(localStorage.getItem('userInfo'))

// 清空购物车
let orderType = getUrlKey('orderType')
if (orderType == 'all') {
	localStorage.removeItem('cartData')
}

timer()						// 倒计时
pageStatistics() 			// 页面统计
// getUserInfo(sourcePlatform)	// 获取用户信息
// 获取用户信息
;(function () {
	http('GET', `/users/login/h5Login`, {
		sourcePlatform
	}).then((res) => {
		let userInfo = res.data
		localStorage.setItem('userInfo', JSON.stringify(userInfo))
		taskScore = userInfo.taskScore
		$('#taskScore').text(taskScore)
		http('GET', `/mallv2/h5/score/getUsedScore`).then((res) => {
			$('.myScore').text(13700 - res.data + taskScore)
			$('.pastScore').text(13700 - res.data)
		})
	})
})()

// 获取补贴金额
getAumont()
function getAumont() {
	http('GET', `/mallv2/h5/oldfornew/account`).then((res) => {
		let used = res.data.used == null ? 0 : parseInt(res.data.used)
		amount = 4000 - used < 0 ? 0 : 4000 - used
	})
}

// 获取 支付成功 数据
getPaySuccessInfo()
function getPaySuccessInfo() {
	http('GET', `/mallv2/order/getPaySuccessInfo`, {
		orderId
	}).then(async(res) => {
		let orderInfo = res.data
		console.log('订单:', orderInfo)
		// 活动类型
		activityType = orderInfo.activityType
		if (activityType == 'CASH_SCORE') {
			href = '../integralCenter/gold.html'
		} else if (activityType == 'OLD_FOR_NEW') {
			href = '../old2New/gundong.html'
			$('.detail-box').show()
			$('.detail-boxtx').hide()
			$('#paySum2').text(orderInfo.orderInfoList[0].activityMax + '补贴+' + orderInfo.realTotalMoney + '元')
			$('#residueSum').html(`<div class="d-i-label">剩余补贴额度：</div>
						<div class="d-i-main" style="color: #CF192A;"
						onclick="window.open('../old2New/gundong.html', '_self'); clikStatistics('HuiYuan_BTED')"><span>${amount}补贴</span>></div>`)
		} else if (activityType == 'WALLET_DEDUCT') {
			href = '../wallet/wallet.html'
			$('.detail-box').show()
			$('.detail-boxtx').hide()
			$('#paySum2').text(orderInfo.orderInfoList[0].activityMax + '余额+' + orderInfo.realTotalMoney + '元')
			$('#residueSum').html(`<div class="d-i-label">钱包余额：</div>
						<div class="d-i-main" style="color: #CF192A;"
						onclick="window.open('../wallet/wallet.html', '_self'); clikStatistics('HuiYuan_BTED')"><span>${wallet}元</span>></div>`)
		} else if (activityType == 'SHOPPING_CARD') {
			href = '../shoppingCard/indexAdvertise.html'
		} else if (activityType == 'GET_SCORE') {
			await getScore()
			// href = '../wallet/wallet.html'
			href = '../integralCenter/gold.html'
			$('#shifan').remove()
			$('.qefx').show()
			$('.qefx').removeClass('dn')
			$('.qefx .fxje').text(orderInfo.orderInfoList[0].activityMax*10)
			$('.qefx .wallet').text(userInfo.totalScore)
		} else {
			href = '../brandSale/carnival.html'
		}
		if(activityType == 'H5_COUPON'){
            let useCoupon = localStorage.getItem('useCoupon') || ''
            let couponPrice = Math.round(orderInfo.orderInfoList[0].curPrice - orderInfo.realTotalMoney)
            useCoupon += `,${couponPrice}`
            localStorage.setItem('useCoupon', useCoupon)
            localStorage.setItem('useCouponTime', moment().format("YYYY-MM-DD"))
        }
		$('#backHome').on('click', function() {
			clikStatistics('ZFY_FHHD')
			window.location.href = href
		})
	
		// 用户信息
		$('#name').text(orderInfo.userName)
		$('#tel .num:eq(0)').text(orderInfo.tel.substr(0, 3))
		$('#tel .num:eq(1)').text(orderInfo.tel.substr(3, 4))
		$('#tel .num:eq(2)').text(orderInfo.tel.substr(7, 4))
		$('#address').text(orderInfo.addressText)
		
		// 订单信息
		$('#orderNo, #orderNo2').text(orderInfo.orderNo)
		$('#createTime, #createTime2').text(formatDate(orderInfo.createTime))
		$('#payType, #payType2').text(orderInfo.payType == 'pay_delivery' ? '支付方式：' : '支付金额：')
		$('#paySum').text(orderInfo.payType == 'pay_delivery' ? '先试后用' : orderInfo.realTotalMoney + '元')
		
		// 商品列表
		// if (activityType == 'OLD_FOR_NEW') {
			await getProductNav()
			getProductList()
			getFakeUsers()
			$('#scoreAccount, #tabBoxNav').removeClass('dn')
			if (activityType == 'GET_SCORE') {
				$('.productPrice').text(orderInfo.orderInfoList[0].productPrice * 10)
			} else {
				$('.productPrice').text(orderInfo.orderInfoList[0].productPrice)
			}
		// } else {
			// getProductList()
		// }
		
		// etc渠道
		if (channel.indexOf('etc-') != -1 || channel.indexOf('etcp-') != -1) {
			$('#scoreAccount').addClass('dn')
			$('#etcCode').removeClass('dn')
			getEtcCode()
		}
		
	}, err => {
		console.log(err)
	})
}

// 获取积分返还
async function getScore () {
  await http('GET', `/users/score/addScoreByGetScore?orderId=${orderId}`).then((res) => {
    if (res.code===200 && res.data.getScoreFlag) {
      userInfo.totalScore = res.data.userScore
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
    }
	})
}

// 获取 商品列表 数据
function getProductList() {
	if (isLoading) return
	isLoading = true
	// if (activityType == 'OLD_FOR_NEW') {
		http('GET', `/mallv2/h5/activity/queryListByPage`, {
			columnId,
			pageNum,
			pageSize: 20,
			flag: 1,
			activityType: 'CASH_SCORE'
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
				columnId = 187
				pageNum = 1
				flag = 1
			}
			
			// 数据渲染
			productListScore(productList, $('#productList'))
		}, err => {
			console.log(err)
		})
	// } else {
	// 	http('GET', `/mallv2/activity/getProductsByType`, {
	// 		activityType,
	// 		pageNum,
	// 		pageSize: 10
	// 	}).then((res) => {
	// 		isLoading = false
	// 		let productList = res.data
	// 		// console.log('商品:', productList)
	// 		if (productList.length == 0) isLoading = true
	// 		pageNum ++
			
	// 		// 商品数据渲染
	// 		if (activityType == 'WALLET_DEDUCT') {
	// 			productListWallet(productList, $('#productList'))
	// 		} else {
	// 			productListScore(productList, $('#productList'))
	// 		}
	// 	}, err => {
	// 		console.log(err)
	// 	})
	// }
}

// 获取 积分导航
async function getProductNav() {
	await http('GET', `/mallv2/activity/getColumn`, {
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

// 获取 滚动用户
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
							<div class="roll-text">${item.nickname}使用积分换购了${item.productName}，节省了${item.money}元!</div>
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

// 时间格式化
function formatDate(date) {
	var date = new Date(date);
	var YY = date.getFullYear() + '-';
	var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
	var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
	var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
	var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
	var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
	return YY + MM + DD +" "+hh + mm + ss;
}

// 获取 etc code
function getEtcCode() {
	http('GET', `/mallv2/etc/getCode`).then((res) => {
		if (res.code == 200) {
			$('#codeContent').text(res.data.washCarCode)
			
			// etc渠道复制兑换码
			let content = $("#codeContent").text()
			let clipboard = new Clipboard('#codeCopy', {
			    text: function() {
					return content
			    }
			})
			clipboard.on('success', function(e) {
			    layer.open({
			        content: '复制成功',
			        skin: 'msg',
			        time: 1
			    })
			})
			clipboard.on('error', function(err) {
			    console.log(err);
			})
		}
	})
}

// 打开小程序，通过开放标签
openWeapp()
function openWeapp() {
	initJssdk(function () {
		wx.ready(function () {
			console.log('打开小程序2')
			var btnOpen = document.getElementById('launch-btn');
			btnOpen.addEventListener('launch', function (e) {
				console.log('success');
			});
			btnOpen.addEventListener('error', function (e) {
				console.log('fail', e.detail);
			});
		})
	})
}

function initJssdk(callback) {
	console.log('href:', window.location.href)
	var uri = encodeURIComponent(window.location.href.split('#')[0]); //获取当前url然后传递给后台获取授权和签名信息
	console.log('jssdkUrl', uri)
	http('POST', `/users/login/getH5WxCardJsSdk`, {
		url: uri
	}).then((res) => {
		//返回需要的参数appId,timestamp,noncestr,signature等
		if (res.code == 200) {
			console.log('请求jssdk配置', res.data)
			let config = res.data
			wx.config({
			  debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
			  appId: config.appId, // 必填，公众号的唯一标识
			  timestamp: config.timestamp, // 必填，生成签名的时间戳
			  nonceStr: config.nonceStr, // 必填，生成签名的随机串
			  signature: config.signature,// 必填，签名
			  jsApiList: config.jsApiList ,// 必填，需要使用的JS接口列表
			  openTagList: ['wx-open-launch-weapp'] // 可选，需要使用的开放标签列表，例如['wx-open-launch-app']
			});
			
			if (callback) {
				callback(config)
			}
		} else {
			layer.open({
				content: '打开失败，请重新打开',
				skin: 'msg',
				time: 2
			})
			return
		}
	}, err => {
		console.log(err)
	})
}

// 部分dom操作
$(function () {
	
	// 补贴展开信息
	$('#detailMore').on('click', function () {
		$(this).remove()
		$('.detail-box .detail-item.dn').removeClass('dn')
	})
	
	// 选项卡切换商品列表
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
	
	// 规则弹窗
	$('#ruleShow').on('click', function() {
		$('#ruleBox').removeClass('dn')
	})
	$('#ruleHide').on('click', function() {
		$('#ruleBox').addClass('dn')
	})
	
})