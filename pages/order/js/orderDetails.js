/**
	订单id（测试用）
		403991	秒杀					SECKILL
		1123180	积分/卡券			CASH_SCORE
		1035186	补贴 				OLD_FOR_NEW
		810144  补贴（会员享补贴）	MEMBER_SUBSIDY
		944352  红包加补贴
		768139	获取积分（全额返）	GET_SCORE
		1119914	现金券（红包）		CASH_COUPON
		588013	送话费				RECHARGE_COUPON
		404061	免费试用 0元测评		ZERO_EVALUATION
		404002	先用后付				PAY_AFTER_USE
		1005216	购物卡				SHOPPING_CARD
				中国黄金				CHINA_GOLD
		411009	普通
		843316	钱包					WALLET_DEDUCT
		1033933 抽奖					无
		1177714 女装					无
*/
let domainName = ['platform','sale','svip','vip','by','h5','mall']
const orderId = getUrlKey('orderId') || 1177714
const sourcePlatform = getUrlKey('sourcePlatform') || 'platform'
let brandSale = getUrlKey('brandSale') || undefined		// 狂欢节
let producType = getUrlKey('producType') || undefined		// 优惠券
let couponPrice = getUrlKey('couponPrice') || undefined		// 优惠券额度
const orderPageFlag = 'default'		// 区分购物车支付页
const prize = getUrlKey('prize') || 0	// 抽奖商品过来的参数
const bybtid = getUrlKey('bybtid')   // 补贴券过来的参数
const shopitem = getUrlKey('shopitem')   // 补贴品卡券页面过来的参数
var hbtcdjs = getCookie('BTHB')     // 区分带红包买补贴商品
let isInvoice = 0		// 是否需要发票
// let subNum = 1			//补贴红包选择
let userName = ''		// 是否填写收货信息
let checked = 1 		// 1 -> wx 2 -> zfb 3 -> 货到付款  4 -> 先用后付
let freeStatus = 1
let orderInfoList = []
let orderInfo = []
let isWechat = isWechatFn() 	// 是否微信浏览器环境
let openid = null
let walletMoneyFlag = 0

let usedCardIndex = 0	// 记录使用的购物卡下标
let usedCardArr = getCookie('usedCardArr') || '' // 记录使用的购物卡下标列表
// 微信浏览器环境删除支付宝支付
if (isWechat) $('#payTypeZfb').remove()
//查询支付状态
let payOrderId = getUrlKey('payOrderId') || 0
if (payOrderId) {
	layer.open({
		title: '温馨提示'
		,content: `请确认您的订单支付是否已完成`
		,btn: ['已完成支付','重新支付']
		,yes: function(index) {
			layer.close(index)
			setInterval('queryPayStatus(true)', 1500)
			clikStatistics('ZFY_WCZF')
		},no: function(index) {
			layer.close(index)
			setInterval('queryPayStatus(false)', 1500)
			clikStatistics('ZFY_WZF')
		}
	})
	setInterval('queryPayStatus()', 1500)
} else {
	openLayer()
}

pageStatistics() 			//页面统计

// if (sourcePlatform == 'h5') {
//     $('#payTypeZfb .payment-img').attr('src', 'https://img.quanminyanxuan.com/service/7ddec0fc500c469d8bad1db9d1a4f91d.png');
// 	$('#payTypeWx .payment-img').attr('src', 'https://img.quanminyanxuan.com/service/c0ee950a10e344ef81018962da8c7fb2.png');
//     checked = 2
// }
// if (sourcePlatform == 'vip') {
//     $('#payTypeZfb .payment-img').attr('src', 'https://img.quanminyanxuan.com/service/7ddec0fc500c469d8bad1db9d1a4f91d.png');
// 	$('#payTypeWx .payment-img').attr('src', 'https://img.quanminyanxuan.com/service/c0ee950a10e344ef81018962da8c7fb2.png');
//     checked = 2
//     $('#payTypeWx').addClass('dn')
// }
// 阻止安卓实体键后退
// 页面载入时使用pushState插入一条历史记录
// let backFlag = true
function openLayer() {
	history.pushState(null, null, location.href)
	window.addEventListener('popstate', function(event) {
		// if (!backFlag) {
		// 	window.location.href="javascript:history.go(-2)"
		// }
		layer.open({
			title: '温馨提示'
			,content: '您的订单还未支付，避免活动优惠失效请尽快提交订单'
			,btn: ['好的', '残忍拒绝']
			,yes: function(index){
				layer.close(index)
			},no: function(index){
				layer.close(index)
				// window.location.href="javascript:history.go(-2)"
			}
		})
		// backFlag = false
		// 点击回退时再向历史记录插入一条，以便阻止下一次点击回退
		// history.pushState(null, null, '#' );
	})
}

// 获取用户网络地址
function getUserAddress() {
	http('GET', `/users/users/getAddressByIp`).then((res) => {
		if (res.data.province) {
			$('#addressFormProvince').text(res.data.province)
			$('#addressFormCity').text(res.data.city)
			$('#addressFormArea').text(res.data.area)
		} else {
			$('#addressFormProvince').text('请选择')
			$('#addressFormCity').text('请选择')
			$('#addressFormArea').text('请选择')
		}
		
		// 获取省市区地址库
		getCityData()
	}, err => {
		console.log(err)
	})
}

// 订单详情：获取h5订购信息
getOrderInfo()
function getOrderInfo() {
	let loading = layer.open({type: 2})
	http('GET', `/mallv2/order/getH5OrderInfoById`, {
		orderId
	}).then((res) => {
		layer.close(loading)
		orderInfo = res.data
		orderInfoList = orderInfo.orderInfoList
		console.log('订购信息', orderInfo)
        // 广点通渠道统计
        // if ((channel.indexOf('ytjj-gdt') == 0) || (channel.indexOf('ytjj-qmyxh5') == 0) ) gdt('track', 'COMPLETE_ORDER', {'orderId': orderId, 'phone': orderInfo.tel});// 下单
		if(orderInfo.orderInfoList[0].activityType == 'SECKILL' || orderInfo.orderInfoList[0].activityType == 'CHINA_GOLD'){
			// 进页面默认滚动到指定位置
			let orderBoxTop = $('#orderBox').offset().top - 10
			$('html, body').scrollTop(orderBoxTop)
		} 
		// 用户信息
		if (orderInfo.tel) {
			userName = orderInfo.userName;
			$('#showPopAddress').addClass('dn');
			$('#editAddress .name').text(orderInfo.addressText);
			$('#editAddress .username').text(orderInfo.userName);
			$('#editAddress .phone').text(orderInfo.tel);
			
			// 地址弹窗
			$('#addressFormUsername').val(orderInfo.userName);
			$('#addressFormPhone').val(orderInfo.tel);
			$('#addressFormProvince').text(orderInfo.address.province);
			$('#addressFormCity').text(orderInfo.address.city);
			$('#addressFormArea').text(orderInfo.address.area);
			$('#addressFormDetail').val(orderInfo.address.address);
			// 获取省市区地址库
			getCityData()
		} else {
			$('#editAddress').addClass('dn');
			$('#showPopAddress').trigger('click')
			getUserAddress()
		}

		// 商品列表
		orderList(orderInfo.orderInfoList);
		// 服务
		$('#serviceOne').text((orderInfo.orderInfoList[0].activityType == 'OLD_FOR_NEW') || (orderInfo.orderInfoList[0].activityType == 'MEMBER_SUBSIDY') ? '支持极速退款' : '支持极速退款');
		$('#serviceTwo').text((orderInfo.orderInfoList[0].activityType == 'OLD_FOR_NEW') || (orderInfo.orderInfoList[0].activityType == 'MEMBER_SUBSIDY') ? '7天无理由退换' : '7天无理由退换');
		
		// 平台优惠
		if (orderInfoList[0].activityType == 'CASH_SCORE') {
			if (domainName.includes(sourcePlatform)) {
				// if (sourcePlatform == 'svip') {
				// 	$('#totalMoney').text(orderInfoList[0].productOprice + '元')
				// } else {
					$('#totalMoney').text(parseFloat(orderInfoList[0].productPrice + orderInfoList[0].activityMax / 10).toFixed(1) + '元')
				// }
			}
		} else if (orderInfo.orderInfoList[0].activityType == 'ZERO_EVALUATION') {
			$('#totalMoney').text(orderInfo.orderInfoList[0].productPrice + '元');
		} else if (orderInfo.orderInfoList[0].activityType == 'OLD_FOR_NEW' || orderInfo.orderInfoList[0].activityType == 'MEMBER_SUBSIDY') {
			if(shopitem == 'old'){
				$('#totalMoney').text((orderInfo.orderInfoList[0].activityMax + orderInfo.orderInfoList[0].productPrice) + '元');
			}else{
				$('#totalMoney').text(orderInfo.orderInfoList[0].activityMax + orderInfo.orderInfoList[0].productPrice + '元');
			}
		} else if (orderInfo.orderInfoList[0].activityType == 'SHOPPING_CARD') {
			$('#totalMoney').text((orderInfo.orderInfoList[0].productOprice) + '元');
		} else if (orderInfo.orderInfoList[0].activityType == 'CHINA_GOLD') {
			$('#totalMoney').text(orderInfo.orderInfoList[0].productOprice + '元');
		} else {
			$('#totalMoney').text(orderInfo.orderInfoList[0].productOprice + '元');
		}
		// 商品总额 --> 商品总价（购物卡）
		if (orderInfo.orderInfoList[0].activityType == 'SHOPPING_CARD') {
			$('#totalMoney').prev('.title').text('商品总额');
		}
		
		// 商品总额 --> 官方售价（中国黄金）
		if (orderInfo.orderInfoList[0].activityType == 'CHINA_GOLD') {
			$('#totalMoney').prev('.title').text('官方售价');
		}
		
		// 平台立减
		if (orderInfo.discountType.cashScore.cashScorePrice) {		//1、积分
			if (domainName.includes(sourcePlatform)) {
				if (sourcePlatform == 'vip815') {
                    http('GET', `/users/login/h5Login`, {
                        sourcePlatform: 'platform'
                    }).then((res) => {
                        userInfo = res.data
                        localStorage.setItem('userInfo', JSON.stringify(userInfo))
                        $('#oldHbCoupon').removeClass('dn')
                        $('#couponPrice').text((userInfo.score + userInfo.taskScore)/10+'元')
                        timer()						// 倒计时
                    })
					$('#discount').html(`<span class="title">专享券抵</span>
										<span class="fares cut">-${freeStatus == 1 ? parseInt(orderInfoList[0].activityMax / 10) : orderInfo.totalMoney}元</span>`);
				} else if (sourcePlatform == 'mall') {
					$('#discount').html(`<span class="title">积分已省</span>
										<span class="fares cut" style="color:#FF007E">-${freeStatus == 1 ? parseInt(orderInfoList[0].activityMax / 10) : orderInfo.totalMoney}元</span>`);
				} else {
					$('#discount').html(`<span class="title">积分已省</span>
										<span class="fares cut">-${freeStatus == 1 ? parseInt(orderInfoList[0].activityMax / 10) : orderInfo.totalMoney}元</span>`);
				}
			}else{
				if (sourcePlatform == 'dh') {
					$('#discount').html(`<span class="title">兑换券已省</span>
										<span class="fares cut">-${freeStatus == 1 ? orderInfoList[0].activityMax : orderInfo.totalMoney}元</span>`);
				}else{
					$('#discount').html(`<span class="title">卡券已省</span>
										<span class="fares cut">-${freeStatus == 1 ? orderInfoList[0].activityMax : orderInfo.totalMoney}元</span>`);
				}
				
			}
		}  else if (orderInfo.discountType.platformPrice > 0 && orderInfo.orderInfoList[0].activityType !== 'CASH_COUPON' && orderInfo.orderInfoList[0].activityType !== 'WALLET_DEDUCT') {	//3、秒杀  4、送话费  7、普通
			if (prize == 1) {	// 抽奖商品
				$('#discount').html(`<span class="title">中奖券减免</span>
									<span class="fares cut">-${orderInfo.discountType.platformPrice}元</span>`);
			} else {
                
                if (orderInfo.orderInfoList[0].productId == 27779) {  //wifi展示判断
                    $('#discount').html(`<span class="title">套餐立减</span>
                    <span class="fares cut">-${orderInfo.discountType.platformPrice}元</span>`);
                    $('#wifi').removeClass('dn')
                }else{
                    $('#discount').html(`<span class="title">平台立减</span>
                                        <span class="fares cut">-${orderInfo.discountType.platformPrice}元</span>`);
                }
			}
		}
		// 5、免费试用 0元测评
		if (orderInfo.orderInfoList[0].activityType == 'ZERO_EVALUATION') {
			$('#discount').html(`<span class="title">保证金额</span>
								<span class="fares cut">${orderInfo.orderInfoList && orderInfo.orderInfoList[0].productPrice}元</span>`);
		}
		// 4、送话费
		if (orderInfo.orderInfoList[0].activityType == 'RECHARGE_COUPON') {
			$('#recharge').removeClass('dn').html(`<span class="title">赠送话费</span>
					<span class="fares cut">${orderInfo.orderInfoList[0].activityMax}元</span>`);
			$('#discountSubTotal').hide()
		}
		// 5、返积分
		if (orderInfo.orderInfoList[0].activityType == 'GET_SCORE') {
			$('.hbzfbox').show()
		}
		// 红包立减
		if (orderInfo.orderInfoList[0].activityType == 'CASH_COUPON') {
			$('#discount').hide()
			$('#recharge').removeClass('dn').html(`<span class="title">活动立减</span>
					<span class="fares cut">-${orderInfo.orderInfoList[0].activityMax}元</span>`);
			$('#discountSubTotal').remove()
		}
		// 钱包抵扣（私域红包）
		if (orderInfo.orderInfoList[0].activityType == 'WALLET_DEDUCT') {
			$('#discount').hide()
			// $('#recharge').removeClass('dn').html(`<span class="title">余额抵扣</span>
			// 		<span class="fares cut">-${orderInfo.orderInfoList[0].activityMax}元</span>`);
			$('#discountSubTotal').remove()
			$('#totalMoney').text(orderInfo.realTotalMoney+'元')
		}
		// 6、购物卡
		if (orderInfo.orderInfoList[0].activityType == 'SHOPPING_CARD') {
			$('#discount').html(`<span class="title">平台优惠</span>
								<span class="fares cut">-${orderInfo.orderInfoList[0].productOprice - orderInfo.realTotalMoney - 100}元</span>`);
		}
		// 7、补贴
		if (orderInfo.orderInfoList[0].activityType == 'OLD_FOR_NEW' || orderInfo.orderInfoList[0].activityType == 'MEMBER_SUBSIDY') {
			if(sourcePlatform=='h5'){
				$('#discount').html(`<span class="title">平台补贴</span>
									<span class="fares cut">-${orderInfo.orderInfoList[0].activityMax}元</span>`);
			}else{
				if(shopitem == 'old'){
					$('#discount').html(`<span class="title">卡券已省</span>
										<span class="fares cut">-${orderInfo.orderInfoList[0].activityMax}元</span>`);
				}else{
					if(bybtid == 'btq'){
						$('#discount').html(`<span class="title">补贴券已省</span>
											<span class="fares cut">-${orderInfo.orderInfoList[0].activityMax}元</span>`);
					}else{
						$('#discount').html(`<span class="title">平台补贴</span>
											<span class="fares cut">-${orderInfo.orderInfoList[0].activityMax}元</span>`);
					}
				}
			}
		}
		// 7、中国黄金
		if (orderInfo.orderInfoList[0].activityType == 'CHINA_GOLD') {
			$('#discount').html(`<span class="title">活动直降</span>
								<span class="fares cut">-${orderInfo.discountType.platformPrice}元</span>`);
		}
		
		// 小计
		if (orderInfo.orderInfoList[0].activityType == 'CASH_SCORE') {
			$('#discountSubTotal').remove()
		}
		else if (orderInfo.orderInfoList[0].activityType == 'SHOPPING_CARD') {
			$('#subTotal').text((orderInfo.orderInfoList[0].productPrice + 100) + '元')
		}
		else if (orderInfo.orderInfoList[0].activityType == 'OLD_FOR_NEW' || orderInfo.orderInfoList[0].activityType == 'MEMBER_SUBSIDY') {
			if(shopitem == 'old'){
				$('#discountSubTotal').remove()
			}else{
				$('#subTotal').text((orderInfo.orderInfoList[0].productPrice + orderInfo.orderInfoList[0].activityMax) + '元')
			}
			
		}
		else {
			if (orderInfo.redWalletMoney > 0) {
				$('#subTotal').text((orderInfo.orderInfoList[0].productPrice - orderInfo.redWalletMoney).toFixed(2) + '元')
			} else {
				$('#subTotal').text(orderInfo.orderInfoList[0].productPrice + '元')
			}
		}
		
		
		// 支付方式-先用后付/银联支付
		if (orderInfo.orderInfoList && orderInfo.orderInfoList[0].activityType === 'PAY_AFTER_USE') {
			$('#delivery').removeClass('dn');
			$('#cashBlock').remove();
		} else {
			$('#cashBlock').removeClass('dn');
			$('#delivery').remove();
		}
		
		// 合计
		if (orderInfo.orderInfoList[0].activityType == 'CASH_SCORE') {	//积分
			$('#totalScore').removeClass('dn');
			$('#totalElse').remove();
			$('#totalScore .num').text(orderInfo.orderInfoList[0].activityMax);
			if (sourcePlatform == 'dh') {
				$('#totalScore .txt').html(`<span>兑换券</span>+${orderInfo.realTotalMoney}元`);
			} else if (domainName.includes(sourcePlatform)) {
				if (sourcePlatform == 'vip815') {
				    $('#totalScore .num').html(orderInfo.orderInfoList[0].activityMax/10);
				    $('#totalScore .txt').html(`<span>元券</span>+￥${orderInfo.realTotalMoney}`);
				} else if (sourcePlatform == 'mall') {
					$('#totalScore .score-left, #totalScore .freight').css('color', '#FF007E')
					$('#orderFrom').css('background','#FF007E')
					$('#totalScore .txt').html(`<span>积分</span>+${orderInfo.realTotalMoney}元`);
				} else {
                    $('#totalScore .txt').html(`<span>积分</span>+${orderInfo.realTotalMoney}元`);
                }
			}else{
				$('#totalScore .txt').html(`<span>卡券</span>+${orderInfo.realTotalMoney}元`);
			}
		}else if (orderInfo.orderInfoList[0].activityType == 'GET_SCORE') {	//全额返
			$('#totalScore').removeClass('dn');
			$('#totalElse').remove();
			$('#totalScore .num').html(`${orderInfo.realTotalMoney}`);
			$('#freight').removeClass('dn');
			$('#totalScore .txt').html(`元`);
			$('#hbzfnum').text(`${orderInfo.realTotalMoney}`)
		}else if (orderInfo.orderInfoList[0].activityType == 'CASH_COUPON') {	//红包
			$('#totalScore').removeClass('dn');
			$('#totalElse').remove();
			$('#totalScore .num').html(`${orderInfo.realTotalMoney}`);
			$('#freight').removeClass('dn');
			$('#totalScore .txt').html(`元`);
		}else if (orderInfo.orderInfoList[0].activityType == 'WALLET_DEDUCT') {	//钱包（私域红包）
			$('#totalScore').removeClass('dn');
			$('#totalElse').remove();
			$('#totalScore .num').html(`${Math.floor((orderInfo.realTotalMoney-orderInfo.redWalletMoney)*10)/10}`);
			$('#freight').removeClass('dn');
			$('#totalScore .txt').html(`元`);
		}else if (orderInfo.orderInfoList[0].activityType == 'OLD_FOR_NEW' || orderInfo.orderInfoList[0].activityType == 'MEMBER_SUBSIDY') {	//补贴
			$('.btdb').show()
			if(sourcePlatform=='h5'){
				$('#totalNew').removeClass('dn');
				$('#oldForNew .sum2').text(orderInfo.discountType.oldForNewPrice)
				$('#totalNew .butie').html(`<span class="price"><span class="num2">${orderInfo.realTotalMoney}</span><span class='num3'>元</span><span class='num5'>(免邮费)</span></span>`)
				$('#zonge').text('商品价格')
				$('#discountSubTotal').hide()
				$('.identifying').hide()
				$('.card-txt .title .sum').text(orderInfo.orderInfoList[0].activityMax +'元')
			}else{
				$('#totalNew').removeClass('dn');
				$('#oldForNew').removeClass('dn');
				$('#oldForNew .sum2').text(orderInfo.discountType.oldForNewPrice)
				$('#totalNew .butie').html(`<span class="price"><span class="num2">${orderInfo.realTotalMoney}</span><span class='num3'>元</span><span class='num5'>(免邮费)</span></span>`)
				// $('#ptyh').hide()
				$('.identifying').hide()
				$('#oldForNew').hide()
				$('#subTotal').text(orderInfo.realTotalMoney)
                
				$('.card-txt .title .sum').text(orderInfo.orderInfoList[0].activityMax +'元')
			}
		}
		else if (orderInfo.orderInfoList[0].activityType == 'SHOPPING_CARD') {	//购物卡
			$('#shoppingCard').removeClass('dn')
			$('#ptyh').hide()
			$('#totalNew').removeClass('dn');
			$('#totalScore').remove();
			$('#oldForNew .sum2').text(orderInfo.discountType.oldForNewPrice)
			$('#totalNew .title').html(`<span class="txt">合计：</span><i style="font-size:.36rem; color:#FF162E; font-weight:bold;">${orderInfo.realTotalMoney}元</i>`)
			$('#totalNew .butie').html(`<span style="font-size:.22rem; color:#666; font-weight:500;">已使用购物卡，节省<i style="color:#FF162E;">100</i>元</span>`)
		}else if (orderInfo.orderInfoList[0].activityType == 'SECKILL' || orderInfo.orderInfoList[0].activityType == 'CHINA_GOLD') {	//秒杀
			$('#totalNew').removeClass('dn');
			$('#totalScore').remove();
			$('.othing .prices').hide()
			$('.othing .price').hide()
			$('#discount .title').text('限时优惠')
			$('#ptyh').hide()
			$('#oldForNew .sum2').text(orderInfo.discountType.oldForNewPrice)
			$('#totalNew .num2').text(orderInfo.realTotalMoney)
		}else if (orderInfo.orderInfoList[0].activityType == 'LIVING_CENTER') {	//9.9
			$('#totalElse').removeClass('dn');
			$('#totalScore').remove();
			$('#totalElse .num').text(orderInfo.realTotalMoney);
			$('#ptyh').hide()
			if (orderInfo.orderInfoList[0].activityType == 'OLD_FOR_NEW' || orderInfo.orderInfoList[0].activityType == 'MEMBER_SUBSIDY') { // 补贴
				$('#freight').removeClass('dn');
			} else if (orderInfo.orderInfoList[0].activityType == 'RECHARGE_COUPON') {	// 送话费
				$('#price').css('color', '#FF162E').append(`<span class="recharge">(送<span class="recharge-num">${orderInfo.orderInfoList[0].activityMax}</span>元话费)</span>`);
			} else if (orderInfo.orderInfoList[0].activityType == 'ZERO_EVALUATION') {	// 免费试用 0元测评
				$('#totalElse .title').text('保证金：');
				$('#price').append(`<span class="recharge">(全额立返)</span>`);
			} 
		}
		else {	//除积分
			$('#totalElse').removeClass('dn');
			$('#totalScore').remove();
			
			// 红包
			if (orderInfo.redWalletMoney > 0) {
				$('#subTotal').text((orderInfo.orderInfoList[0].productPrice - orderInfo.redWalletMoney).toFixed(2) + '元')
			    $('#freight').removeClass('dn');
				$('#totalElse .num').text((orderInfo.realTotalMoney - orderInfo.redWalletMoney).toFixed(2));
			} else {
				$('#totalElse .num').text(orderInfo.realTotalMoney);
			}
			
			if (orderInfo.orderInfoList[0].activityType == 'OLD_FOR_NEW' || orderInfo.orderInfoList[0].activityType == 'MEMBER_SUBSIDY') { // 补贴
				$('#freight').removeClass('dn');
			} else if (orderInfo.orderInfoList[0].activityType == 'RECHARGE_COUPON') {	// 送话费
				$('#price').css('color', '#FF162E').append(`<span class="recharge">(送<span class="recharge-num">${orderInfo.orderInfoList[0].activityMax}</span>元话费)</span>`);
			} else if (orderInfo.orderInfoList[0].activityType == 'ZERO_EVALUATION') {	// 免费试用 0元测评
				$('#totalElse .title').text('保证金：');
				$('#price').append(`<span class="recharge">(全额立返)</span>`);
			} 
			// else if (orderInfo.orderInfoList[0].activityType == 'PAY_AFTER_USE') {	// 先用后付
			// 	$('#totalElse .title').text('先试后付：');
			// }
		}
		// 是否放假，物流延迟提示
		isHoliday()
		// 是否有红包
		if (orderInfo.redWalletMoney > 0) {
			$('#isRedWalletMoney').removeClass('dn')
			$('.redWalletMoney').text(orderInfo.redWalletMoney)
			walletMoneyFlag = 1
		}
        if (!!orderInfo.freight) {
            $('.submitOrder .total .freight').text('(含运费)')
            $('.submitOrder .total.c .butie .num5').text('(含运费)')
            $('#discountFreight').text(orderInfo.freight+"元")
        }
        if ( orderInfo.orderInfoList[0].activityType == 'H5_COUPON') {
            let html = `<div class="new-score-style">
                            <div class="product-price"><span style="font-weight: bold;color:#FF162E;">￥${100+orderInfo.realTotalMoney}</span></div>
                            <div style="text-decoration: line-through;font-size:0.24rem;color:#333;">价格￥${orderInfo.orderInfoList[0].productOprice}</div>
                        </div>`
			// $('.new-score-style .product-price').text('券后价：￥'+orderInfo.realTotalMoney)
			$('.new-score-style .new-score-style-txt').addClass('dn')
			$('#allPrice #totalMoney').text(orderInfo.totalMoney + '元')
            
            // $('#discount-coupon').removeClass('dn')
            $('#discount .title').text('平台立减')
            $('#discount .fares').text('-'+(orderInfo.totalMoney-orderInfo.realTotalMoney-100).toFixed(1))
            $('.othing .ginal').addClass('dn')
            $('#totalScore .num').addClass('dn')
            $('#totalScore .txt').text('￥'+orderInfo.realTotalMoney)
            $('.detail_item .othing').html(html)
            $('#freight').removeClass('dn')
            let discountPirce = `支付神券减￥100元`
            $('.hbzfbox').css('display','inline-block')
            $('.hbzfbox .hbzf').html(discountPirce)
            $('#subTotal').text(orderInfo.realTotalMoney+100+'元')
            $('.old_hb').css('display','inline-block')
            $('.old_hb .old_hb_txt').html(`支付神券立减<span>￥100</span>`)
            $('.old_hb .old_hb_img').attr("src","https://img.quanminyanxuan.com/other/c6a6e075811948a59cc7960cd7b8ca96.png");
        } 
        if ( orderInfo.orderInfoList[0].activityType == 'H5_RED_PACKET') {
            $('.othing .prices').text('￥')
            let discountPirce = `红包抵￥${orderInfo.redWalletMoney}元`
            $('.hbzfbox').css('display','inline-block')
            $('.hbzfbox .hbzf').html(discountPirce)
            $('#isRedWalletMoney').addClass('dn')
            $('#subTotal').text(orderInfo.realTotalMoney+'元')
            $('.old_hb').css('display','inline-block')
            $('.old_hb .old_hb_txt').html(`红包立减<span>￥${orderInfo.redWalletMoney}</span>`)
        }
        if ( orderInfo.orderInfoList[0].activityType == 'H5_MEMBER_DISCOUNT') {
            $('.othing .prices').text('折后￥')
            $('#discount .title').text('折上折共减')
        }
		// 单品判断
		// if (orderInfoList[0].productId == 2339) {
		// 	$('prices').text('中奖券后：')
		// }
	}, err => {
		console.log(err)
	})
}

// 商品列表
function orderList(orderInfoList) {
	let html = '',
		htmlCoupon = '',		// 是否有积分兑换
		activityTypeClass = '',	// 商品图片左上角标签颜色
		activityTypeText = '';	// 商品图片左上角标签文字
	
	$.each(orderInfoList, (i, n) => {
		// 商品图片左上角标签颜色
		let activityType = n.activityType;
		if (activityType == 'CASH_SCORE' || activityType == 'GET_SCORE') {
			if(sourcePlatform=='svip'){
				activityTypeClass = 'violett';
			}else{
				activityTypeClass = 'blue';
			}
		} else if (activityType == 'SECKILL' || activityType == 'CASH_COUPON' || activityType == 'WALLET_DEDUCT' || activityType == 'RETURN_COUPON' || activityType == 'CHINA_GOLD') {
			activityTypeClass = 'red';
		} else if (activityType == 'OLD_FOR_NEW' || activityType == 'MEMBER_SUBSIDY' || n.activityType == 'ZERO_EVALUATION') {
			activityTypeClass = 'violet';
		}
		
		// 商品图片左上角标签文字
		if (activityType == 'SECKILL') {
			activityTypeText = '会员秒杀';
		} else if (activityType == 'CHINA_GOLD') {
			activityTypeText = '会员特卖'
		}  else if (activityType == 'CASH_COUPON') {
			activityTypeText = '活动立减'
		} else if (activityType == 'WALLET_DEDUCT') {
			activityTypeText = '余额抵扣'
		} else if (activityType == 'CASH_SCORE') {
			activityTypeText = '会员专享'
		} else if (activityType == 'OLD_FOR_NEW' || activityType == 'MEMBER_SUBSIDY') {
			activityTypeText = '补贴换购'
		} else if (activityType == 'GET_SCORE') {
			activityTypeText = '下单立返'
		} else if (activityType == 'RETURN_COUPON') {
			activityTypeText = '红包返现'
		} else if (activityType == 'ZERO_EVALUATION') {
			activityTypeText = '新品测评'
		}
		
		// 价格，8个活动1个普通
		if (activityType == 'CASH_SCORE') {		//1、积分兑换
			if (sourcePlatform == 'dh') {
				htmlCoupon = `<div class="new-score-style">
								<div class="product-price">
									<div class="product-text">${n.columnId == 25 ? n.activityMin : n.activityMax}</div>
									<span class="coupon">兑换券</span>
									<div class="extra ${n.columnId != 25 ? 'db' : 'dn'}">+${n.productPrice}元</div>
								</div>
								<span class="new-score-style-txt"><span>价格¥${orderInfo.totalMoney}</span></span>
							</div>`
			} else if (domainName.includes(sourcePlatform)) {
				if (sourcePlatform == 'vip815') {
                    
					htmlCoupon = `<div class="new-score-style">
									<div class="product-price">
										<div class="product-text">${n.activityMax/10}</div>
										<span class="coupon">元券</span>
										<div class="extra ${n.columnId != 25 ? 'db' : 'dn'}">+￥${n.productPrice}</div>
									</div>
									<span class="new-score-style-txt"><span>价格¥${parseFloat(orderInfoList[0].productPrice + orderInfoList[0].activityMax / 10).toFixed(1)}</span></span>
								</div>`
				} else if (sourcePlatform == 'mall') {
					htmlCoupon = `<div class="new-score-style">
									<div class="product-price">
										<div class="product-text" style="color:#FF007E">${n.activityMax}</div>
										<span class="coupon" style="color:#FF007E">积分</span>
										<div class="extra ${n.columnId != 25 ? 'db' : 'dn'}" style="color:#FF007E">+${n.productPrice}元</div>
									</div>
									<span class="new-score-style-txt"><span>价格¥${parseFloat(orderInfoList[0].productPrice + orderInfoList[0].activityMax / 10).toFixed(1)}</span></span>
								</div>`
				} else {
					htmlCoupon = `<div class="new-score-style">
									<div class="product-price">
										<div class="product-text">${n.activityMax}</div>
										<span class="coupon">积分</span>
										<div class="extra ${n.columnId != 25 ? 'db' : 'dn'}">+${n.productPrice}元</div>
									</div>
									<span class="new-score-style-txt"><span>价格¥${parseFloat(orderInfoList[0].productPrice + orderInfoList[0].activityMax / 10).toFixed(1)}</span></span>
								</div>`
				}
			}else{
			htmlCoupon = `<div class="new-score-style">
							<div class="product-price">
								<div class="product-text">${n.columnId == 25 ? n.activityMin : n.activityMax}</div>
								<span class="coupon">卡券</span>
								<div class="extra ${n.columnId != 25 ? 'db' : 'dn'}">+${n.productPrice}元</div>
							</div>
							<span class="new-score-style-txt"><span>价格¥${orderInfo.totalMoney}</span></span>
						</div>`
			}
		} else {
			if (activityType == 'OLD_FOR_NEW' || activityType == 'MEMBER_SUBSIDY') {
				//2、补贴
				htmlCoupon = `<span class="prices"></span>`
			}
			else if (activityType == 'SECKILL' || activityType == 'CHINA_GOLD') {							//3、秒杀
				htmlCoupon = `<span class="prices">秒杀价：</span>`
			}
			else if (activityType == 'RECHARGE_COUPON') {					//4、送话费
				htmlCoupon = `<span class="prices">抄底价：</span>`
			}
			else if (activityType == 'ZERO_EVALUATION') {					//5、免费试用 0元测评
				htmlCoupon = `<span class="prices">保证金：</span>`
			}
			else if (activityType == 'PAY_AFTER_USE') {					//6、先用后付
				htmlCoupon = `<span class="prices">活动价:￥</span>`
			}
			else if (activityType == 'SHOPPING_CARD') {					//7、购物卡
				htmlCoupon = `<span class="prices"></span>`
			}
			else if (activityType == 'GET_SCORE') {					//7、全额返
				htmlCoupon = `<span class="prices">会员底价：</span>`
			}
			else if (activityType == 'CASH_COUPON') {					//红包
				htmlCoupon = `<span class="prices">狂欢价：</span>`
			}
			else if (activityType == 'WALLET_DEDUCT') {					//钱包
				htmlCoupon = `<span class="prices">抵扣后：</span>`
			}else if(activityType == 'LIVING_CENTER'){
				htmlCoupon = `<span class="prices"></span>`
			}
			else {														//9、普通
				if (prize == 1) { 	// 抽奖商品
					htmlCoupon = `<span class="prices">中奖券后：￥</span>`
				} else {
					htmlCoupon = `<span class="prices">活动价:￥</span>`
				}
			}
			
			// 购物卡
			if (activityType == 'SHOPPING_CARD') {
				htmlCoupon += `<span class="price-card"><span>￥${n.productPrice + 100}</span></span>
							<span class="ginal">价格￥${orderInfo.totalMoney}</span>`
			}
			// 补贴
			else if (activityType == 'OLD_FOR_NEW' || activityType == 'MEMBER_SUBSIDY') {
				if(sourcePlatform == 'h5'){
						htmlCoupon += `<span class="price-new" style='color:#FF162E;'><span style='font-weight:400;color:#FF162E;'>零售价￥</span>${n.activityMax + n.productPrice}</span>
									<span class="ginal">价格:${orderInfo.totalMoney}元</span>`
				}else{
					if(shopitem == 'old'){
						htmlCoupon = `<div class="new-score-style">
										<div class="product-price">
											<div class="product-text">${n.columnId == 25 ? n.activityMin : n.activityMax}</div>
											<span class="coupon">卡券</span>
											<div class="extra ${n.columnId != 25 ? 'db' : 'dn'}">+${n.productPrice}元</div>
										</div>
										<span class="new-score-style-txt"><span>价格¥${orderInfo.totalMoney}</span></span>
									</div>`
					}else{
						if(bybtid == 'btq'){
							htmlCoupon = `<div class="new-score-style">
											<div class="product-price">
												<div class="product-text">${n.activityMax}</div>
												<span class="coupon">补贴券</span>
												<div class="extra">+${n.productPrice}元</div>
											</div>
											<span class="new-score-style-txt"><span>价格¥${orderInfo.totalMoney}</span></span>
										</div>`
						}else{
							htmlCoupon += `<span class="price-new" style='color:#FF162E;'><span style='font-weight:400;color:#FF162E;'>￥</span>${n.activityMax + n.productPrice}</span>
								<!--<span class="ginal">价格:${orderInfo.totalMoney}元</span>-->`
						}
					}
				}
			}// 秒杀
			else if (activityType == 'SECKILL') {
					htmlCoupon += `<span class="price-card" style='color:#FF162E;'>秒杀价￥<span style='color:#FF162E;font-size:0.28rem;'>${n.productPrice}</span></span>
								<span class="ginal">价格:${orderInfo.totalMoney}元</span>`
			}// 秒杀黄金
			else if (activityType == 'CHINA_GOLD') {
					htmlCoupon = `<span class="ginal" style='text-decoration: none;color:#333;font-size:0.2rem;font-weight:600;'>官网价:<span style='font-size:0.32rem;color:#FF162E;'>${n.productOprice}</span><span  style='color:#FF162E;'>元</span></span>`
			}// 红包抵扣
			else if (activityType == 'CASH_COUPON') {
					htmlCoupon = `<span class="price"><span class='prices'>狂欢价: </span>${n.productPrice}元</span>
					<span class="ginal" >价格:${orderInfo.totalMoney}元</span>`
			}// 钱包抵扣
			else if (activityType == 'WALLET_DEDUCT') {
					htmlCoupon = `<span class="price"><span class='prices'>抵扣后: </span>${n.productPrice}元</span>
					<span class="ginal" >价格:${orderInfo.totalMoney}元</span>`
			}
            else if(activityType == 'LIVING_CENTER'){
				htmlCoupon = `<span class="price"><span class='prices'>特价￥</span>${n.productPrice}</span>
					<span class="ginal" >价格:${orderInfo.totalMoney}元</span>`
			}
			else {
				htmlCoupon += `<span class="price">${n.productPrice}</span>
							<span class="ginal">价格${orderInfo.totalMoney}元</span>`
			}
			
		}
		
		html += `<div class="details">
					<div class="img-box">
						<div class="identifying ${activityTypeClass}">
							<span class="identifying-txt">${activityTypeText}</span>
						</div>
						<image class="details_img" src="${n.productImg}" />
					</div>
					<div class="detail_item">
						<div class="item-top">
							<span class="title">${n.productName}</span>
							<!-- <span class="amount">x3</span> -->
						</div>
						<div class="sans">
							<span class="titles">已选择 ${n.productSkuSpec}</span>
						</div>
						<div class="othing">
							${htmlCoupon}
						</div>
					</div>
				</div>`
	});
	$('#orderList').html(html);
}

// 是否放假，物流延迟提示
function isHoliday() {
	http('GET', `/mallv2/product/holidayMsgToMall`, {
		orderId
	}).then((res) => {
		if (res.data.isHoliday) {
			$('.isHoliday').removeClass('dn')
		}
	}, err => {
		console.log(err)
	})
}

// 提交订单结算
function orderFrom() {
	
	// 记录使用的购物卡
	// if (orderInfo.orderInfoList[0].activityType == 'SHOPPING_CARD') {
	// 	usedCardArr += usedCardIndex
	// 	console.log(usedCardArr.split(''))
	// 	setCookie('usedCardArr', usedCardArr, 30)
	// }
	
	if (!userName) {
		layer.open({
			content: '请填写及提交收货信息',
			skin: 'msg',
			time: 1
		});
		return
	}
	// 备注留言
	let remark = $('#remark').val();
    
    let ua = navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i)=="micromessenger") {
        console.log('test');
        //ios的ua中无miniProgram，但都有MicroMessenger（表示是微信浏览器）
        wx.miniProgram.getEnv((res)=>{
            if (res.miniprogram) {
                // 在小程序里
                let weappInfo = JSON.parse(getUrlKey('userInfo'))
                if (weappInfo&&weappInfo.token) {
                    wx.miniProgram.navigateTo({
                        url: `/packageA/pages/webviewH5/h5Pay?orderId=${orderId}&addressId=&remark=${remark}&activityType=${orderInfo.orderInfoList[0].activityType}&hostLink=${sourcePlatform}`
                    })
                }else{
                    let fromUrl = encodeURIComponent(window.location.href.replace(/\?/, '&'))
	                wx.miniProgram.navigateTo({
	                	url: `/packageA/pages/webviewH5/login?fromUrl=${fromUrl}`
	                })
                }
            } else {
                // 不在小程序里
                weixinPay()
            }
        })
    }else{
        // 不在微信里
        weixinPay()
    };
    // 微信支付
    function weixinPay() {
        if (checked === 1) {
            // 是否微信内浏览器
            if (isWechat) {
                console.log('微信内浏览器')
                openid = localStorage.getItem('WxOpenid') || ''
            
                if (!openid) {
                    console.log('用户未授权')
                    //跳转登录
                    oauthLogin(orderId)
                    return
                }
                console.log('用户已授权, 可直接请求支付参数调起支付')
            }
            let payType = sourcePlatform == 'vip'? 'MWEB':'MWEB'
            // 调用H5微信支付
            http('POST', `/mallv2/order/h5WxDoUnifiedOrder`, {
                orderId: orderId,
                desc: remark,
                type: isWechat ? 'JSAPI' : payType,
                openid: isWechat ? openid : null,
                isAnonymity: 0,
                walletMoneyFlag,
                sourcePlatform: sourcePlatform,
                isInvoice: isInvoice
            }).then((res) => {
                if (res.code == 500) {
                    disableOrderLayer(res.message)
                    return
                }
                if (isWechat) {		// 微信内浏览器支付
                    let payObj = res.data
                    wxPay(payObj)
                    .then(res => {
                        console.log('sourcePlatform',sourcePlatform,'aaaa')
                        if (sourcePlatform == 'mall') {
                            window.location.href =
                                `https://mall.quanminyanxuan.com/pages/payment/payment.html?orderId=${orderId}`
                        }
                        else if (sourcePlatform == 'dh') {
                            window.location.href =
                                `https://dh.quanminyanxuan.com/pages/payment/payment.html?orderId=${orderId}`
                        }
                        else if (domainName.includes(sourcePlatform)) {
                            window.location.href =
                                `https://${sourcePlatform}.quanminyanxuan.com/pages/payment/payment.html?orderId=${orderId}&payOrderId=${payOrderId}&channel=${channel}`
                        }
                        else {
                            window.location.href =
                                `https://h5.quanminyanxuan.com/pages/payment/payment.html?orderId=${orderId}`
                        }
                    }, res => {
                        layer.open({
                            content: '支付取消，请重新支付!',
                            skin: 'msg',
                            time: 2
                        })
                    })
                    .catch(err => {
                        console.log(err)
                        layer.open({
                            content: '支付失败，请重新支付!',
                            skin: 'msg',
                            time: 2
                        })
                    })
                } else {		// 普通浏览器支付
                    let {
                        mweb_url,
                        redirect_url
                    } = res.data;
                    console.log('%c 🦐 res: ', 'font-size:20px;background-color: #E41A6A;color:#fff;', res);
                    let url = `${mweb_url}&redirect_url=${encodeURIComponent(redirect_url)}`;
                    window.location.href = url
                    // 调起支付
                    console.log(res)
                }
            }, err => {
                console.log(err)
            })
        // 先用后付
        } else if (checked === 4) {
            console.log('选择先用后付');
            http('POST', `/mallv2/order/cashOnDelivery`, {
                orderId: orderId,
                desc: remark
            }).then((res) => {
                window.location.href = `https://mall.quanminyanxuan.com/pages/payment/payment.html?orderId=${orderId}`;
            }, err => {
                console.log(err)
            })
        } else {
            // 支付宝支付
            http('POST', `/mallv2/alipay/h5Pay`, {
                orderId: orderId,
                desc: remark,
                isAnonymity: 0,
                walletMoneyFlag,
                sourcePlatform: sourcePlatform,
                isInvoice: isInvoice
            }).then((res) => {
                if (res.code == 500) {
                    disableOrderLayer(res.message)
                    return
                }
                console.log(res.data)
                window.location.href = res.data;
            }, err => {
                console.log(err)
            })
        }
    }
}
// 地区不能下单弹窗
function disableOrderLayer(msg) {
	layer.open({
		title: '温馨提示'
		,content: msg
		,btn: ['去看看', '关闭']
		,yes: function(index){
			layer.close(index)
			window.location.href="../integralCenter/gold.html"
		},no: function(index){
			layer.close(index)
			// window.location.href="javascript:history.go(-2)"
		}
	})
}
// 查询支付状态
let notPayFlag = 0
async function queryPayStatus(flag) {
	let res = await http('GET', '/mallv2/order/getPaySuccessInfo', {
		orderId: orderId,
		payOrderId: payOrderId
	})
	console.log(res)
	let getPayStatus = res.data.payStatus
	if (getPayStatus != 2) {
		if (notPayFlag == 0 && flag) {
			notPayFlag = 1
			layer.open({
				content: '您的订单还未完成支付，请重新支付',
				skin: 'msg',
				time: 1.5
			})
		}
	} else {
		let channel = getCookie('channel')
		// 广点通渠道统计
		// if ((channel.indexOf('ytjj-gdt') == 0) ||  (channel.indexOf('ytjj-qmyxh5') == 0)) gdt('track', 'PURCHASE', {'orderId': orderId, 'phone': res.data.tel});// 付费
		
		if (sourcePlatform == 'mall') {
			window.location.href =
			    `https://mall.quanminyanxuan.com/pages/payment/payment.html?orderId=${orderId}&payOrderId=${payOrderId}&channel=${channel}`
		}
		else if (sourcePlatform == 'dh') {
			window.location.href =
			    `https://dh.quanminyanxuan.com/pages/payment/payment.html?orderId=${orderId}&payOrderId=${payOrderId}&channel=${channel}`
		}
		else if (domainName.includes(sourcePlatform)) {
			window.location.href =
			    `https://${sourcePlatform}.quanminyanxuan.com/pages/payment/payment.html?orderId=${orderId}&payOrderId=${payOrderId}&channel=${channel}`
		}
		else {
			window.location.href =
			    `https://h5.quanminyanxuan.com/pages/payment/payment.html?orderId=${orderId}&payOrderId=${payOrderId}&channel=${channel}`
		}
	}
}

// 提交地址
function addressFormFn() {
	let tel = $('#addressFormPhone').val(),
		userName = $('#addressFormUsername').val(),
		address = $('#addressFormDetail').val(),
		province = $('#addressFormProvince').text(),
		city = $('#addressFormCity').text(),
		area = $('#addressFormArea').text();
		
	// 校验地址
	if (userName.trim() == '') {
		layer.open({
			content: '请填写姓名',
			skin: 'msg',
			time: 1
		});
		$('#addressFormUsername').focus();
		return;
	}
	if (!/^1[3456789]\d{9}$/.test(tel)) {
		layer.open({
			content: '请填写正确的手机号',
			skin: 'msg',
			time: 1
		});
		$('#addressFormPhone').focus();
		return;
	}
	if (province == '请选择' || city == '请选择' || area == '请选择') {
		layer.open({
			content: '请选择地址',
			skin: 'msg',
			time: 1
		});
		$('#selCity').trigger("click");
		return;
	}
	if (address.trim() == '') {
		layer.open({
			content: '请填写详细地址',
			skin: 'msg',
			time: 1
		});
		$('#addressFormDetail').focus();
		return;
	}
	
	// 地址无修改不提交
	let userAddress = getCookie('userAddress')
	userAddress = userAddress ? JSON.parse(decodeURI(userAddress)) : {}
	if (tel == userAddress.tel
		&& userName == userAddress.userName
		&& address == userAddress.address
		&& province == userAddress.addressObj.province
		&& city == userAddress.addressObj.city
		&& area == userAddress.addressObj.area)
		{
			$('#closePop').trigger("click");
			return;
	}
	
	// 用户信息和地址存储本地
	let _address = {
		province,
		city,
		area
	}
	userAddress.addressObj = _address
	userAddress.addressStr = `${province}${city}${area}`
	userAddress.tel = tel
	userAddress.userName = userName
	userAddress.address = address
	setCookie('userAddress', encodeURI(JSON.stringify(userAddress)), 30)

	http('POST', `/mallv2/order/writeOrderAddress`, {
		orderId,
		tel,
		userName,
		address,
		province,
		city,
		area
	}).then((res) => {
		if (res.code == 200) {
			getOrderInfo();
			$('#closePop').trigger("click");
		} else {
			layer.open({
				content: res.message,
				skin: 'msg',
				time: 1
			})
		}
	}, err => {
		console.log(err)
	})
}

// 部分dom操作
$(function () {

	// 触发地址弹框
	$('#showPopAddress').on('click', function () {
		$('#popAddress').addClass('mask-show');
	})

	// 关闭地址弹窗
	$('#closePop').on('click', function () {
		$('#popAddress').removeClass('mask-show');
	})

	// 修改地址弹窗
	$('#editAddress').on('click', function () {
		$('#popAddress').addClass('mask-show');
	})

	// 选择支付方式
	let priceNum,
		priceCut;
	$('.method').not('#cash').on('click', function () {
		$(this).data('pay-type') === 'wx' ? checked = 1 : $(this).data('pay-type') === 'zfb' ? checked = 2 : checked = 4;
		console.log($(this).data('pay-type') + checked);
		// 先用后付
		if (checked === 4) {
			priceNum = $('#price .num').text();
			$('#price .num').text(0);
			priceCut = $('#discount .fares').text();
			$('#discount .fares').text('0元');
			$('#totalElse .title').text('先试后付：');
			$('#discount .title').text('先试后付');
		} else {
			if (priceNum) {
				$('#price .num').text(priceNum);
				$('#discount .fares').text(priceCut);
				$('#totalElse .title').text('合计：');
				$('#discount .title').text('平台立减');
			}
		}
		$('.payment-img').attr('src', 'https://img.quanminyanxuan.com/service/c0ee950a10e344ef81018962da8c7fb2.png');
		$(this).find('.payment-img').attr('src', 'https://img.quanminyanxuan.com/service/7ddec0fc500c469d8bad1db9d1a4f91d.png');
		
	})
	
	// 是否需要发票
	$('#invoice').on('click', function () {
		if (isInvoice == 0) {
			$(this).find('.img').attr('src', 'https://img.quanminyanxuan.com/service/7ddec0fc500c469d8bad1db9d1a4f91d.png')
			isInvoice = 1
		} else {
			$(this).find('.img').attr('src', 'https://img.quanminyanxuan.com/service/c0ee950a10e344ef81018962da8c7fb2.png')
			isInvoice = 0
		}
	})
	// // 补贴红包选择
	// $('.old_hb').on('click', function () {
	// 	console.log(123123)
	// 	if (subNum == 0) {
	// 		$(this).find('.old_hb_xz').attr('src', 'https://img.quanminyanxuan.com/service/7ddec0fc500c469d8bad1db9d1a4f91d.png')
	// 		subNum = 1
	// 		$('#totalNew .butie').html(`<span class="price"><span class="num2">${orderInfoList[0].productPrice}</span>元<span class="num5">(免邮费)</span></span>`)
	// 	} else {
	// 		$(this).find('.old_hb_xz').attr('src', 'https://img.quanminyanxuan.com/service/c0ee950a10e344ef81018962da8c7fb2.png')
	// 		subNum = 0
	// 		$('#totalNew .butie').html(`<span class="price"><span class="num2">${orderInfoList[0].productPrice + 20}</span>元<span class="num5">(免邮费)</span></span>`)
	// 	}
	// })
	// 其它付款方式
	$('#evenMore').on('click', function () {
		$('.even-more-pic').toggleClass('rotate');
		$('#cash').toggleClass('dn');
	})
	
	// 购物卡开关
	// $('#switchCard').on('click', function() {
	// 	$(this).toggleClass('close')
	// 	console.log(orderInfoList[0].productPrice)
	// 	if ($(this).hasClass('close')) {
	// 		$('#totalNew .price .num2').text(orderInfoList[0].productPrice + 100)
	// 	} else {
	// 		$('#totalNew .price .num2').text(orderInfoList[0].productPrice)
	// 	}
	// })
	
	// 购物卡列表
	if (usedCardArr.length > 0) {
		let used = usedCardArr.split('')
		let len = used.length
		let newUsed = []
		for(let i = 0; i < len; i++) {
			newUsed.push(parseInt(used[i]))
		}
		for (let i = 0; i < newUsed.length; i++) {
			$('.card-item').eq(newUsed[i]).addClass('card-item-used').find('.used').removeClass('dn')
		}
	}
	let checkedIcon = 'https://img.quanminyanxuan.com/other/5652782ba1454b02974e9a5cbbfe7d37.png'
	let notCheckedIcon = 'https://img.quanminyanxuan.com/other/52bb6f6de17542df835431847467a7b9.png'
	$('.card-item').not('.card-item-used').eq(0).find('.icon').attr('src', checkedIcon)
	usedCardIndex = $('.card-item').not('.card-item-used').eq(0).index()	// 记录使用的购物卡下标
	$('.card-item').not('.card-item-used').on('click', function () {
		if ($(this).find('.icon').attr('src') == checkedIcon) {
			$(this).find('.icon').attr('src', notCheckedIcon)
			$('#totalNew .title').html(`<span class="txt">合计：</span><i style="font-size:.36rem; color:#FF162E; font-weight:bold;">${orderInfo.realTotalMoney + 100}元</i>`)
			$('#totalNew .butie').html(``)
			usedCardIndex = ''
		} else {
			$('.card-item .icon').attr('src', notCheckedIcon)
			$(this).find('.icon').attr('src', checkedIcon)
			$('#totalNew .title').html(`<span class="txt">合计：</span><i style="font-size:.36rem; color:#FF162E; font-weight:bold;">${orderInfo.realTotalMoney}元</i>`)
			$('#totalNew .butie').html(`<span style="font-size:.22rem; color:#666; font-weight:500;">已使用购物卡，节省<i style="color:#FF162E;">100</i>元</span>`)
			usedCardIndex = $(this).index()
			console.log(usedCardIndex)
		}
	})
	
	// 购物卡过期时间
	// 三天倒计时，第一次进页面记录时间
	let firstIntoShoppingCard = getCookie('firstIntoShoppingCard')
	if (!firstIntoShoppingCard) {
		setCookie('firstIntoShoppingCard', new Date(), 30)
		$('#overDay').text(3)
	} else {
		let timer = (new Date()) - (new Date(firstIntoShoppingCard))
		let day = parseInt(timer / 1000 / 60 / 60 / 24 , 10)
		if (3 - day <= 0) {
			setCookie('firstIntoShoppingCard', new Date(), 30)
			$('#overDay').text(3)
		} else {
			$('#overDay').text(3 - day)
		}
	}
	let d = new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * parseInt($('#overDay').text()))
	$('.timeY').text(d.getFullYear())
	$('.timeM').text(d.getMonth() + 1)
	$('.timeD').text(d.getDate() < 10 ? '0' + (d.getDate()) : d.getDate())
	
	
	// 补贴开关
	$('#switchNew').on('click', function() {
		$(this).toggleClass('close')
		if ($(this).hasClass('close')) {
			$('#totalNew .butie').html(`<span class="price"><span class="num2">${orderInfoList[0].activityMax + orderInfoList[0].productPrice}</span>元</span>`)
		}else {
			$('#totalNew .butie').html(`<span class="price"><span class="num2">${orderInfo.realTotalMoney}</span><span class='num3'>元</span><span class='num5'>(免邮费)</span></span>`)
		}
	})
	
	// 规则弹窗
	$('#ruleShow').on('click', function() {
		$('#ruleBox').removeClass('dn')
	})
	$('#ruleHide').on('click', function() {
		$('#ruleBox').addClass('dn')
	})
	
	// 提交订单结算
	$('#orderFrom').on('click', orderFrom)
	
	// 提交地址
	$('#addressForm').on('click', addressFormFn)
	
	
})