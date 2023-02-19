const orderId = getUrlKey('orderId') || 719349
const sourcePlatform = getUrlKey('sourcePlatform') || 'mall'
const orderPageFlag = 'cart'

let isInvoice = 0		// 是否需要发票
let userName = ''		// 是否填写收货信息
let checked = 1 		// 1 -> wx 2 -> zfb 3 -> 货到付款  4 -> 先用后付
let orderInfoList = []
let orderType = ''
let isWechat = isWechatFn() 	// 是否微信浏览器环境
let openid = null

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
				layer.close(index);
			},no: function(index){
				layer.close(index);
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
		$('#addressFormProvince').text(res.data.province)
		$('#addressFormCity').text(res.data.city)
		$('#addressFormArea').text(res.data.area)
	}, err => {
		console.log(err)
	})
}

// 订单详情：获取h5订购信息
getOrderInfo()
function getOrderInfo(flag) {
	layer.open({type: 2})
	http('GET', `/mallv2/order/getH5OrderInfoById`, {
		orderId
	}).then((res) => {
		layer.closeAll()
		let orderInfo = res.data
		orderInfoList = orderInfo.orderInfoList
		console.log('订购信息', orderInfo)
		
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
		} else {
			$('#editAddress').addClass('dn');
			$('#showPopAddress').trigger('click')
			getUserAddress()
		}
		
		// 修改地址时页面只要重新渲染地址信息，其它信息不用从新渲染
		if (flag == 'address') return

		// 商品列表
		orderList(orderInfoList);

		// 平台优惠
		// 商品总额
		$('#totalMoney').text(orderInfo.totalMoney + '元');
		
		// 平台立减
		// $('#discount').html(`<span class="title">平台优惠</span>
		// 					<span class="fares cut">-${orderInfo.discountType.platformPrice}元</span>`);
		
		// 小计
		$('#subTotal').text(orderInfo.realTotalMoney + '元')
		
		// 合计
		$('#totalNew .num').text(orderInfo.realTotalMoney)
		
		// 弹窗地址对应用户地址
		checkoutCity()
		
	}, err => {
		console.log(err)
	})
}

// 商品列表
function orderList(orderInfoList) {
	let html = '',
		htmlCoupon = '',				// 是否有积分兑换
		activityTypeClass = '',			// 商品图片左上角标签颜色
		activityTypeText = '',			// 商品图片左上角标签文字
		len = orderInfoList.length;
	
	if (len > 1) orderType = 'all'
	if (len > 2) $('#productMore').removeClass('dn').find('.num').text(len)

	$.each(orderInfoList, (i, n) => {
		// 商品图片左上角标签颜色
		let activityType = n.activityType;
		
		// 价格
		htmlCoupon = `<span class="prices">秒杀价：</span>`
		htmlCoupon += `<span class="price">${n.productPrice}元</span>
							<span class="ginal">价格${n.productOprice}元</span>`
		
		html += `<div class="details ${i > 1 ? 'dn' : ''}">
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
	})
	
	$('#orderList').append(html)
}

// 提交订单结算
function orderFrom() {
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
	
	// 微信支付
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
		// 调用H5微信支付
		http('POST', `/mallv2/order/h5WxDoUnifiedOrder`, {
			orderId: orderId,
			desc: remark,
			type: isWechat ? 'JSAPI' : 'MWEB',
			openid: isWechat ? openid : null,
			isAnonymity: 0,
			walletMoneyFlag: 0,
			sourcePlatform: sourcePlatform,
			isInvoice: isInvoice
		}).then((res) => {
			if (isWechat) {		// 微信内浏览器支付
				let payObj = res.data
				wxPay(payObj)
				.then(res => {
					if (sourcePlatform == 'mall') {
						window.location.href =
							`https://mall.quanminyanxuan.com/pages/payment/payment.html?orderId=${orderId}`
					}
					else if (sourcePlatform == 'dh') {
						window.location.href =
							`https://dh.quanminyanxuan.com/pages/payment/payment.html?orderId=${orderId}`
					}
					else if (sourcePlatform == 'by') {
						window.location.href =
							`https://by.quanminyanxuan.com/pages/payment/payment.html?orderId=${orderId}`
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
			walletMoneyFlag: 0,
			sourcePlatform: sourcePlatform,
			isInvoice: isInvoice
		}).then((res) => {
			console.log(res.data)
			window.location.href = res.data;
		}, err => {
			console.log(err)
			layer.open({
				content: '支付失败，请重新支付',
				skin: 'msg',
				time: 2
			})
		})
	}
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
		if (sourcePlatform == 'mall') {
			window.location.href =
			    `https://mall.quanminyanxuan.com/pages/payment/payment.html?orderId=${orderId}&payOrderId=${payOrderId}&channel=${channel}&orderType=${orderType}`
		}
		else if (sourcePlatform == 'dh') {
			window.location.href =
			    `https://dh.quanminyanxuan.com/pages/payment/payment.html?orderId=${orderId}&payOrderId=${payOrderId}&channel=${channel}&orderType=${orderType}`
		}
		else if (sourcePlatform == 'by') {
			window.location.href =
			    `https://by.quanminyanxuan.com/pages/payment/payment.html?orderId=${orderId}&payOrderId=${payOrderId}&channel=${channel}&orderType=${orderType}`
		}
		else {
			window.location.href =
			    `https://h5.quanminyanxuan.com/pages/payment/payment.html?orderId=${orderId}&payOrderId=${payOrderId}&channel=${channel}&orderType=${orderType}`
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
	let userAddress = getCookie('userAddress') ? JSON.parse(getCookie('userAddress')) : {}
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
	setCookie('userAddress', JSON.stringify(userAddress), 30)

	http('POST', `/mallv2/order/writeOrderAddress`, {
		orderId,
		tel,
		userName,
		address,
		province,
		city,
		area
	}).then((res) => {
		getOrderInfo('address');
		$('#closePop').trigger("click");
	}, err => {
		console.log(err)
	})
}

// 弹窗地址对应用户地址
function checkoutCity() {
	var selectedIndex = [0, 0, 0]
	var checked = [0, 0, 0]
	$(city).each(function(i) {
		if (city[i].name == $('#addressFormProvince').text()) {
			selectedIndex[0] = i
			checked[0] = i
			$(city[i].sub).each(function(j) {
				if (city[i].sub[j].name == $('#addressFormCity').text()) {
					selectedIndex[1] = j
					checked[1] = j
					$(city[i].sub[j].sub).each(function(k) {
						if (city[i].sub[j].sub[k].name == $('#addressFormArea').text()) {
							selectedIndex[2] = k
							checked[2] = k
							return false
						}
					})
					return false
				}
			})
			return false
		}
	})
	selCityFn(selectedIndex, checked)
}

// 地址弹窗
function selCityFn(selectedIndex, checked) {
	var nameEl = document.getElementById('selCity');
	
	var first = [];		//省，直辖市
	var second = [];	//市
	var third = [];		//镇
	
	var selectedIndex = selectedIndex;	//默认选中的地区
	var checked = checked;				//已选选项
	
	function creatList(obj, list) {
		obj.forEach(function (item, index, arr) {
			var temp = new Object();
			temp.text = item.name;
			temp.value = index;
			list.push(temp);
		})
	}
	
	creatList(city, first);
	
	if (city[selectedIndex[0]].hasOwnProperty('sub')) {
		creatList(city[selectedIndex[0]].sub, second);
	} else {
		second = [{text: '', value: 0}];
	}
	console.log(city[selectedIndex[0]].sub)
	if (city[selectedIndex[0]].sub[selectedIndex[1]].hasOwnProperty('sub')) {
		creatList(city[selectedIndex[0]].sub[selectedIndex[1]].sub, third);
	} else {
		third = [{text: '', value: 0}];
	}
	
	var picker = new Picker({
		data: [first, second, third],
		selectedIndex: selectedIndex,
		title: '地址选择'
	});
	
	picker.on('picker.select', function (selectedVal, selectedIndex) {
		var text1 = first[selectedIndex[0]].text;
		var text2 = second[selectedIndex[1]].text;
		var text3 = third[selectedIndex[2]] ? third[selectedIndex[2]].text : '';
	
		// nameEl.innerText = text1 + ' ' + text2 + ' ' + text3;
		$('#addressFormProvince').text(text1);
		$('#addressFormCity').text(text2);
		$('#addressFormArea').text(text3);
	});
	
	picker.on('picker.change', function (index, selectedIndex) {
		if (index === 0) {
			firstChange();
		} else if (index === 1) {
			secondChange();
		}
	
		function firstChange() {
			second = [];
			third = [];
			checked[0] = selectedIndex;
			var firstCity = city[selectedIndex];
			if (firstCity.hasOwnProperty('sub')) {
				creatList(firstCity.sub, second);
	
				var secondCity = city[selectedIndex].sub[0]
				if (secondCity.hasOwnProperty('sub')) {
					creatList(secondCity.sub, third);
				} else {
					third = [{text: '', value: 0}];
					checked[2] = 0;
				}
			} else {
				second = [{text: '', value: 0}];
				third = [{text: '', value: 0}];
				checked[1] = 0;
				checked[2] = 0;
			}
	
			picker.refillColumn(1, second);
			picker.refillColumn(2, third);
			picker.scrollColumn(1, 0)
			picker.scrollColumn(2, 0)
		}
	
		function secondChange() {
			third = [];
			checked[1] = selectedIndex;
			var first_index = checked[0];
			if (city[first_index].sub[selectedIndex].hasOwnProperty('sub')) {
				var secondCity = city[first_index].sub[selectedIndex];
				creatList(secondCity.sub, third);
				picker.refillColumn(2, third);
				picker.scrollColumn(2, 0)
			} else {
				third = [{text: '', value: 0}];
				checked[2] = 0;
				picker.refillColumn(2, third);
				picker.scrollColumn(2, 0)
			}
		}
	
	});
	
	picker.on('picker.valuechange', function (selectedVal, selectedIndex) {
		console.log(selectedVal);
		console.log(selectedIndex);
	});
	
	nameEl.addEventListener('click', function () {
		picker.show();
	});
}

// 关闭提示
function closeTips() {
	$('#discTips').remove()
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

	// 其它付款方式
	$('#evenMore').on('click', function () {
		$('.even-more-pic').toggleClass('rotate')
		$('#cash').toggleClass('dn')
	})
	
	// 展开商品
	$('#productMore').on('click', function () {
		$('#productMore .icon-arr').toggleClass('rotate')
		$('#orderList .details:gt(1)').toggleClass('dn')
		if ($('#productMore .icon-arr').hasClass('rotate')) {
			$('#productMore .txt').text('收起')
		} else {
			$('#productMore .txt').text('展开')
		}
	})
	
	// 提交订单结算
	$('#orderFrom').on('click', orderFrom)
	
	// 提交地址
	$('#addressForm').on('click', addressFormFn)
	
	// 进页面默认滚动到指定位置
	let orderBoxTop = $('#orderBox').offset().top - 10
	$('html, body').scrollTop(orderBoxTop)
})