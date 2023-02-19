let headSourcePlatform = window.location.href.split('://')[1].split('.quan')[0]
let token = null
let channel = null

// 获取用户信息，存缓存
let weappInfo = JSON.parse(getUrlKey('userInfo')) || null
if (weappInfo && weappInfo.os) {	// 小程序
    console.log('123132');
	localStorage.setItem('isapp', 0)
    localStorage.setItem('isWx', 1) //存储是否在小程序
	localStorage.setItem('weappInfo', 1)	// 小程序首次进入锁定，防止h5页面互跳没带小程序标识
	// 本地存储 token、channel
	token = weappInfo.token
	channel = weappInfo.channel
	localStorage.setItem('token', token)
	localStorage.setItem('channel', channel)
} else {	// app
	localStorage.setItem('isapp', 1)
	callHandler('getUserToken', '', (data) => {
		let _data = JSON.parse(data)
		token = _data.token
		localStorage.setItem('token', token)
	})
	callHandler('getAppInfo', '', (data) => {
		let _data = JSON.parse(data)
		channel = _data.channel
        let appH5Version = _data.appH5Version || 0
		localStorage.setItem('channel', channel)
		localStorage.setItem('appH5Version', appH5Version)
	})
}

// 跨域cookie
if (document.domain != '192.168.110.90' && document.domain != '127.0.0.1' && document.domain != '192.168.10.11' && document.domain != '192.168.10.13') {
	document.domain = 'quanminyanxuan.com'
}

// 签名
const createSign = (object) => {
	return hex_md5(JSON.stringify(object).toUpperCase())
}

// 接口请求
const http = (type, url, data) => {
	// 因为h5没有登录功能获取不到商品详情，所以请求商品详情时source参数要用h5
	let httpSource = window.location.href.indexOf('productDetail/') != -1 ||
					 window.location.href.indexOf('appraisalDetail/') != -1 ||
					 window.location.href.indexOf('productDetailH5/') != -1 ||
					 window.location.href.indexOf('activityH5/') != -1 ||
					 window.location.href.indexOf('goldbig/') != -1 ||
					 window.location.href.indexOf('spikeTime/') != -1 ||
					 window.location.href.indexOf('shoppingCard/') != -1 ||
					 window.location.href.indexOf('coupon/') != -1 ? 'h5' : 'weapp'
	// app没有的接口source参数要用h5
	if (url == '/users/login/h5Login' ||
		url == '/mallv2/h5/oldfornew/account' ||
		url == '/users/h5Sign/getH5SignList' ||
		url == '/mallv2/h5/score/getUsedScore') {
		httpSource = 'h5'
	}
	// 统计事件区分app和小程序
	if (url == '/mallv2/common/analysisData' || url == '/mallv2/statistics/clikStatisticsData') {
		let isApp = localStorage.getItem('isapp')?(localStorage.getItem('isapp')==1?true:false):false
		httpSource = isApp ? 'app' : 'weapp'
	}
	return new Promise((resolve, reject) => {
		object = {
			contentType: 'json',
			method: type,
			timestamp: new Date().getTime() + '',
			source: httpSource,
			SECRET_KEY: 'serkhas&&23@@#hqw123e'
		}
		object.sign = createSign(object)
		delete object.SECRET_KEY
		if (type == 'POST') {
			object['content-type'] = 'application/json;charset=UTF-8'
			data = JSON.stringify(data)
		}
		token = localStorage.getItem('token') //|| 'a7411fe7891988f64a45ad489db4c6ce' 测试用
		channel = localStorage.getItem('channel')
		object.token = token
		object.uuid = token
		object.channel = channel
		object.sourcePlatform = headSourcePlatform
		setCookie('token', object.token, 30)
		// if (channel) setCookie('channel', channel, 365)
		$.ajax({
			type: type,
			url: 'https://api.quanminyanxuan.com/api' + url,	// 正式
			// url: 'https://m.quanminyanxuan.com/api' + url,	// 测试
			// contentType: "application/json",
			headers: {
				...object
			},
			dataType: 'json',
			data: data,
			success: (res) => {
				resolve(res)
			},
			fail: (err) => {
				console.log("请求数据", err)
				reject(err)
			}
		})
	})
}

// 设置cookie
// 下标，存储时间（天）
function setCookie(key, value, iDay) {
	var oDate = new Date();
	oDate.setDate(oDate.getDate() + iDay);
	document.cookie = key + '=' + value + ';expires=' + oDate + ";path=/;domain=" + document.domain;
}

// 获取cookie
function getCookie(key) {
	var cookieArr = document.cookie.split('; ');
	for(var i = 0; i < cookieArr.length; i++) {
		var arr = cookieArr[i].split('=');
		if(arr[0] === key) {
			return arr[1];
		}
	}
	return '';
}

// 删除cookie
function removeCookie(key) {
	setCookie(key, '', -1);	//这里只需要把Cookie保质期退回一天便可以删除
}

// 截取URL参数
function getUrlKey(name) {
	return (
		decodeURIComponent(
			(new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(
				location.href
			) || [, ''])[1].replace(/\+/g, '%20')
		) || null
	)
}

// 获取网页标题（title）传给app
;(function() {
	let params = {
		// status: 0,
		// color: '#f00',
		// title: document.title
	}
	callHandler('setTopNavigation', params, (data) => {
		console.log(data)
	})
})()

// 解决不同手机分辨率不一致的适配问题
;(function (doc, win) {
    var docEl = doc.documentElement,
    	resizeEvt = "orientationchange" in window ? "orientationchange" : "resize",
    	recalc = function () {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) {
                return
            } else {
                docEl.style.fontSize = (clientWidth / 750) * 100 + "px";
            }
    	};
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener("DOMContentLoaded", recalc, false)
})(document, window);

// 登录
function loginFn() {
	let fromUrl = encodeURIComponent(window.location.href.replace(/\?/, '&'))
	wx.miniProgram.navigateTo({
		url: `/packageA/pages/webviewH5/login?fromUrl=${fromUrl}`
	})
}

// 页面统计
function pageStatistics() {
	let href = window.location.href
	if (href.indexOf('.com') != -1) {
		href = href.split('.com')[1].split('.html')[0] + '.html'
	}
	let dataJson = {
		toPage: href,
		fromPage: '',
		param: {},
		uuid: getCookie('token')
	}
	http('POST', `/mallv2/common/analysisData`, {
		dataJson: JSON.stringify(dataJson)
	}).then((res) => {
		// console.log('路径统计')
		// alert('页面统计')
	}, err => {
		console.log(err)
	})
}

// 操作埋点（type格式: 页面_位置_活动）
function clikStatistics(type) {
	// let { app } = store.state
	// let model = app.systemInfo	// 系统数据
	http('POST', `/mallv2/statistics/clikStatisticsData`, {
		model: {},
		clikType: type
	}).then((res) => {
		console.log('埋点成功', res)
	}, err => {
		console.log(err)
	})
}

// 倒计时
function timer(end) {
	let hour = ''
	let minute = ''
	let second = ''
	let minutes = ''
	let tmpTime = end ? end : `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`
	// var dateTime = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
	var dateTime = new Date(
		new Date(tmpTime).getTime() + 24 * 60 * 60 * 1000 - 1
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
		  hour = '00'
		  minute = '00'
		  second = '00'
		  minutes = '0'
		}
		$('#hour').text(hour)
		$('#minute').text(minute)
		$('#second').text(second)
		$('#minutes').text(minutes)
	}, 100)
}

// 数组随机打乱
function randomSort(a, b) {
	return Math.random() > .5 ? -1 : 1
}

// 范围随机数
function randomNum(a, b) {
	return Math.round(Math.random() * (b - a)) + a
}

// 库存
function filterStock(num) {
	if (num >= 100) {
		return (num / 28).toFixed(0)
	} else {
		return num
	}
}

// 已售
function filterVolume(num) {
	if (num >= 10000) {
		if (num % 10000 == 0) {
			return parseInt(num / 10000) + '万'
		} else {
			return (num / 10000).toFixed(1) + '万'
		}
	} else {
		return num
	}
}

const openWeapp2 = (url = '', param = '') => {
	let channel = getUrlKey('channel') || getCookie('channel') || 'quanminyanxuan' //ytjj-qmyxh5-01
	let weappType = getUrlKey('weappType') || url || 'pages/member/webview'
	let query = param + '&gdt_vid=' + gdt_vid	//gdt_vid：投放广告url参数
	http('POST', `/mallv2/common/skipAppletsV4`, {
		channel: channel,	//渠道号
		path: weappType,	//小程序落地页
		query: query		//url参数
	}).then((res) => {
		console.log('success', res.data)
		if(res.data) {
			location.href = res.data
		} else {
			layer.open({
				content: '打开失败',
				skin: 'msg',
				time: 2
			})
		}
	}, err => {
		console.log('err', err)
	})
}

// 跳app、小程序详情页
function openPageDetail(id, type) {
	let isApp = localStorage.getItem('isapp')?(localStorage.getItem('isapp')==1?true:false):false
	let weappInfo = localStorage.getItem('weappInfo')
	if (isApp && weappInfo != 1) {
		// let params = {
		// 	url: "/guobao/goodsDetail/activity",
		// 	id,
		// 	type
		// }
		// callHandler('openPage', params, (data) => {
		// 	console.log(data)
		// })
		if(localStorage.getItem('appH5Version')>0){
            let params = {
                url: "/qmyx/productDetail/activity?id=" + id,
            }
            callHandler('openPage', params, (data) => {
                console.log(data)
            })
        }else{
            window.location.href = `https://app.quanminyanxuan.com/#/pages/productDetailTotal/productDetail?id=` + id
            // window.location.href = `https://m.quanminyanxuan.com/#/pages/productDetailTotal/productDetail?id=` + id		// 测试
            // window.location.href = `http://192.168.20.167:8081/#/pages/productDetailTotal/productDetail?id=` + id		// 本地
        }
	} else {
		wx.miniProgram.navigateTo({
			url: `/packageA/pages/productDetailTotal/productDetail?id=` + id
		})
	}
}
function WeiXinType () {
    if (/MicroMessenger/gi.test(navigator.userAgent)) {
            return true
    } else {
            return false
        }
}
// 小程序导航栏
function appendNav () {
    let isWx = localStorage.getItem('isWx')
    if (isWx != 1) return
    let arr = [
        {name:'商城', url:'/pages/shopping/shopping', icon:'https://img.quanminyanxuan.com/other/821bc176232c44a096297ab6bb591546.png'},
        {name:'视频', url:'/pages/home/home', icon:'https://img.quanminyanxuan.com/other/4bb9e64e1eac45babd65df3796a29620.png'},
        {name:'购物车', url:'/pages/cart/cart', icon:'https://img.quanminyanxuan.com/other/c19f1e693b6b4877bcb420cc469cc5d5.png'},
        {name:'消息', url:'/pages/news/news', icon:'https://img.quanminyanxuan.com/other/f425407ec7184b19bc08d7f947976e4f.png'},
        {name:'我的', url:'/pages/member/index', icon:'https://img.quanminyanxuan.com/other/fdbfb2cd6f314a94977831534638bb86.png'},
    ]
    let item = ''
    arr.forEach((value, index) => {
        item += `<div class="nav-item" data-url="${value.url}">
        <div style="display:flex;align-items:center;">
            <div class="nav-item-content">
                <img class="nav-img" style="width:0.52rem;height:0.52rem;" src="${value.icon}" />
                <span class="nav-txt" style="font-size:0.22rem;margin-top:0.02rem;">${value.name}</span>
            </div>
        </div>
    </div>`
    })
    let regulation = `
    <div class="navigation" style="height:1rem;padding-bottom: env(safe-area-inset-bottom);padding-bottom: constant(safe-area-inset-bottom);">
        ${item}
    </div>
    `
    $('body').append(regulation)
    $('.navigation').on('click', '.nav-item',async function () {
        url = $(this).data('url')
        wx.miniProgram.switchTab({ url })
    })

}