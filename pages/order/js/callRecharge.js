let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]

let pageNum = 1
let isLoading = false		//判断瀑布流是否加载中

let operators = '00'			// 运营商
var amount = 30

pageStatistics() 			// 页面统计
getUserInfo(sourcePlatform)	// 获取用户信息

// 获取 充值金额列表
getChargesList()
function getChargesList() {
	http('GET', `/mallv2/common/getPhoneChargesList`).then((res) => {
		let chargesList = res.data
		// console.log('金额:', chargesList)
		
		let html = ''
		$.each(chargesList, (index, item) => {
			if(item.price != 500){
				html += `<div class="change-item" data-rechargeid=${item.id}>
							<div class="change-p">
								<span class="price-str">${item.price}</span>
								<span class="price-txt">元</span>
							</div>
							<div class="change-desc">赠送${item.giveIntegral}兑换券</div>
						</div>`
			}else{
				html += `<img class='change-itemImg' src='https://img.quanminyanxuan.com/other/ca36bb0dfaa04e61b3c4499eeddfc48c.png'/>`
			}
		})
		$('#chargeList').append(html)
	}, err => {
		console.log(err)
	})
}

// 获取 商品列表
getProductInfo()
function getProductInfo() {
	if (isLoading) return
	http('GET', `/mallv2/activity/getActivityList`, {
		pageNum,
		pageSize: 10,
		activityType: 'RECHARGE_COUPON',
	}).then((res) => {
		isLoading = false
		let productList = res.data
		// console.log('商品:', productList)
		if (productList.length == 0) isLoading = true
		pageNum ++
		
		// 商品数据渲染
		productListRecharge(productList, $('#productList'))
	}, err => {
		console.log(err)
	})
}

// 充值提交
function orderSubmit() {
	let phone = $('#userPhone').val().replace(/\s/g, '')
	let rechargeId = $(this).data('rechargeid')
	
	// 200 300 500
	if (rechargeId == 4 || rechargeId == 5 || rechargeId == 6) {
		layer.open({
			title: '温馨提示'
			,content: `请前往APP进行充值`
			,btn: ['打开APP']
			,yes: function(index){
				downAppgo()
				layer.close(index)
				clikStatistics('H5_APP_HF')
			}
		})  
		return
	}
	// 手机号校验
	if (operators == '00') {
		layer.open({
			content: '请填写正确的手机号',
			skin: 'msg',
			time: 1
		})
		$('#userPhone').focus()
		return
	}
	http('POST', `/mallv2/order/h5WxDoUnifiedPhoneOrder`, {
		phone,
		rechargeId,
		operators
	}).then((res) => {
		// 普通浏览器支付
		let {
			mweb_url,
			redirect_url
		} = res.data
		let url = `${mweb_url}&redirect_url=${encodeURIComponent(redirect_url)}`
		// 调起支付
		window.location.href = url
	}, err => {
		console.log(err)
	})
}

// 判断运营商
function formatPhone(ipt) {
	let text = ''
	let value = $(ipt).val()
	if(value.length > 11) {
		value = value.slice(0, 11)
		$(ipt).val(value)
	}
	if (value.length == 11) {
		var isChinaMobile = /^134[0-8]\d{7}$|^(?:13[5-9]|147|15[0-27-9]|178|18[2-478])\d{8}$/
		var isChinaUnion = /^(?:13[0-2]|145|15[56]|176|18[56])\d{8}$/
		var isChinaTelcom = /^(?:133|153|177|18[019])\d{8}$/ //1349号段
		var isOtherTelphone = /^170([059])\d{7}$/ //其他运营商
		if (isChinaMobile.test(value)) {
			operators = '01'	// 移动
			text = '中国移动'
		} else if (isChinaUnion.test(value)) {
			operators = '03'	// 联通
			text = '中国联通'
		} else if (isChinaTelcom.test(value)) {
			operators = '02'	// 电信
			text = '中国电信'
		}
		$('.tel-operators').text(text)
	} else {
		operators = '00'
		$('.tel-operators').text('')
	}
	return value
}

// 部分dom操作
$(function () {
	
	// 兑换中心
	$(document).on('click', '.change-itemImg', function() {
		window.open('../integralCenter/gold.html', '_self')
		clikStatistics('HOME_CZ_DH')
	})
	
	// 充值提交
	$(document).on('click', '.change-item', orderSubmit)
	
	// 选项卡切换商品列表
	// $('.tab-box').on('click', '.tab-item', function() {
	// 	$(this).addClass('tab-item-active').siblings().removeClass('tab-item-active')
	// 	let timeBoxTop = $('.tab-boxt').offset().top
	// 	$('html, body').scrollTop(timeBoxTop)
	
	// 	// 请求商品数据
	// 	let type = $(this).data('type')
	// 	if (type == amount) return
	// 	$('#productList').html('')
	// 	pageNum = 1
	// 	isLoading = false
	// 	amount = type
	// 	getProductInfo()
	// 	isLoading = true
	// })
	
	// 页面滚动事件
	$(window).on('scroll', function () {
		let scrollTop = $(this).scrollTop()
		let wHeight = $(this).height()
		let dHeight =$(document).height() - 300
		
		// 滚动到底部
		if (scrollTop + wHeight > dHeight) {
			getProductInfo()
			isLoading = true
		}
	})
	
})