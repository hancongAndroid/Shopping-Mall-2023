let headSourcePlatform = window.location.href.split('://')[1].split('.quan')[0]

// 跨域cookie
if (document.domain != '127.0.0.1' && document.domain.indexOf('192.168') == -1) {
	document.domain = 'quanminyanxuan.com'
}
// 截取URL参数
const getUrlKey = name => {
	return (
		decodeURIComponent(
			(new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(
				location.href
			) || [, ''])[1].replace(/\+/g, '%20')
		) || null
	)
}

//随机token
const generateRandomId = () => {
	let S4 = () => {
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
	}
	return (
		S4() +
		S4() +
		'-' +
		S4() +
		'-' +
		S4() +
		'-' +
		S4() +
		'-' +
		S4() +
		S4() +
		S4()
	)
}
setWxUserInfo()
const token = typeOfStr(getCookie('token')) || generateRandomId()
let channel = getCookie('channel') || localStorage.getItem('channel')
let gdt_vid = getUrlKey('gdt_vid')	//gdt_vid：投放广告url参数
if (channel && channel.indexOf('-old') > 0) {
	// console.log('channel',channel)
} else {
	// console.log('channelelse',channel)
	let channel2 = getUrlKey('channel')
	if (channel2 != null && channel2 != 'null') {
		setCookie('channel', channel2, 30)
		localStorage.setItem('channel', channel2)
		channel = channel2
	}
}

const createSign = (object) => {
	return hex_md5(JSON.stringify(object).toUpperCase())
}
const http = (type, url, data,headersData={}) => {
	// 因为h5没有登录功能获取不到商品详情，所以请求商品详情时source参数要用h5，同时，下单接口也是传h5
	let httpSource = window.location.href.indexOf('productDetail/') != -1 ||
					 window.location.href.indexOf('appraisalDetail/') != -1 ||
					 window.location.href.indexOf('productDetailH5/') != -1 ||
					 window.location.href.indexOf('activityH5/') != -1 ||
					 window.location.href.indexOf('goldbig/') != -1 ||
					 window.location.href.indexOf('spikeTime/') != -1 ||
					 window.location.href.indexOf('shoppingCard/') != -1 ||
					 window.location.href.indexOf('coupon/') != -1 ? 'h5' : 'weapp'
	// 统计事件source参数要用h5
	if (url == '/mallv2/common/analysisData' ||
		url == '/mallv2/statistics/clikStatisticsData' ||
		url == '/users/login/h5Login' ||
		url == '/mallv2/h5/oldfornew/account' ||
		url == '/users/h5Sign/getH5SignList' ||
		url == '/mallv2/h5/score/getUsedScore') {
		httpSource = 'h5'
	} else if (url == '/mallv2/h5/activity/queryListByPage') {
		httpSource = 'weapp'
	}
   
    let baseUrl = baseUrlFn() // 生产
    if (url == '/users/users/getUsers' ||			// 获取用户信息
		url == '/users/users/signIn' ||				// 积分签到
		url == '/mallv2/juliang/addAdvert' ||		// 巨量落地页数据上报
		url == '/mallv2/home/page/getKefuApi' ||	// 选择客服系统
		url == '/mallv2/h5/promotion/APISendData')	// 巨量落地页数据上报-进行转化回调
	{
        baseUrl = 'https://api.quanminyanxuan.com/api'
    }

	return new Promise((resolve, reject) => {
		object = {
			contentType: 'json',
			method: type,
			timestamp: new Date().getTime() + '',
			source: httpSource,
			SECRET_KEY: 'serkhas&&23@@#hqw123e',
		}
        object = Object.assign(object,headersData)
		object.sign = createSign(object)
		delete object.SECRET_KEY
		if (type == 'POST') {
			object['content-type'] = 'application/json;charset=UTF-8'
			data = JSON.stringify(data)
		}
		object.token = token
		object.uuid = token
		object.channel = channel
		object.gdtVid = gdt_vid
		object.sourcePlatform = headSourcePlatform
		setCookie('token', object.token, 30)
		// if (channel) setCookie('channel', channel, 365)
		$.ajax({
			type: type,
			url: baseUrl + url,	// 测试
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
function baseUrlFn () {
    // 1.定义所有环境服务器地址
    const server = {
        dev: "https://m.quanminyanxuan.com/api", // 测试环境
        pro: "https://h5api.quanminyanxuan.com/api", // 生产环境
        util: "" // 其他环境，可以为空，为空则适配到测试环境
    };
    // 2.获取当前访问域名，并根据域名判断当前环境，然后获取指定环境的服务器地址
    let DOMIN = ""; // 服务端接口访问跟路径
    const origin = location.hostname; // 当前访问域名
    for (let i in server) {
        let item = server[i];
        if (item.indexOf(origin) > -1) {
            DOMIN = item;
        }
    }
    if (origin.indexOf("192.168") > -1 || origin.indexOf("localhost") > -1) {
        DOMIN = "https://h5api.quanminyanxuan.com/api";
        // DOMIN = "https://m.quanminyanxuan.com/api";
    }
    // 3. 特殊情况处理，如果没有在server变量中匹配到具体环境，则依次读取util、dev
    // eslint-disable-next-line
    if (!DOMIN) DOMIN = !!server.util ? server.util : server.pro
    return DOMIN
}
function typeOfStr(str){
    if(str!=""&&str!=null&&str!=undefined&&str!='null'&&str!='undefined'){
        return str
    }else{
        return false
    }
}