// 判断是否在微信中
function isWechatFn() {
	let ua = window.navigator.userAgent.toLowerCase()
	if (ua.match(/micromessenger/i) == 'micromessenger') {
		return true
	} else {
		return false
	}
}

// 微信登录
const oauthLogin = orderId => {
	console.log(orderId)
	if (!orderId) return
	// if (process.env.NODE_ENV === 'development') {
	// 	let baseUrl = 'https://m.quanminyanxuan.com'
	// } else {
	// 	let baseUrl = 'https://sale.quanminyanxuan.com'
	// }
	let baseUrl = 'https://sale.quanminyanxuan.com'
	// 授权重定向URL
	let callback_url = null
	if (orderPageFlag == 'cart') {
		callback_url = encodeURIComponent(
			`${baseUrl}/h5/svip/pages/wxOauthRes/wxOauthRes.html?orderId=${orderId}&type=cartOrderDetails`
		)
	} else {
		callback_url = encodeURIComponent(
			`${baseUrl}/h5/svip/pages/wxOauthRes/wxOauthRes.html?orderId=${orderId}&type=orderDetails`
		)
	}
	
	// 拼接授权地址
	let wxOauthUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxec8f6c583bf2befb&redirect_uri=${callback_url}&response_type=code&scope=snsapi_base#wechat_redirect`
	// 跳转
	console.log('xx', wxOauthUrl)
	window.location.href = wxOauthUrl
}

//微信支付  
function wxPay(data) {
	return new Promise((resolve, reject) => {
		if (!isWechat) {
			return
		}
		initJssdk(function(res) {
			
			wx.ready(function(){
			  // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
				wx.chooseWXPay({
				  timestamp: data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
				  nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
				  package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
				  signType: data.signType, // 微信支付V3的传入RSA,微信支付V2的传入格式与V2统一下单的签名格式保持一致
				  paySign: data.sign, // 支付签名
				  success: function (res) {
				    // 支付成功后的回调函数
					resolve(res)
				  },
					fail: function(res) {
						reject(res)
					}
				});
			});
			
		})
		
	})
}

function initJssdk(callback) {
	var uri = encodeURIComponent(window.location.href.split('?')[0]); //获取当前url然后传递给后台获取授权和签名信息
	http('POST', `/users/login/getH5WxJsSdk`, {
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
			  jsApiList: config.jsApiList // 必填，需要使用的JS接口列表
			});
			
			
			if (callback) {
				callback(config)
			}
		} else {
			layer.open({
				content: '支付失败，请重新支付',
				skin: 'msg',
				time: 2
			})
			return
		}
	}, err => {
		console.log(err)
	})
}


