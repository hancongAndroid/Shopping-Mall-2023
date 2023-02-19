var apkUrl = 'https://img.quanminyanxuan.com/apk/4.0/ytjj-qmyxh5-15/%E5%85%A8%E6%B0%91%E4%B8%A5%E9%80%89.apk' //ytjj_qmyxh5_03
var iosUrl = 'https://apps.apple.com/cn/app/id1521772730' //iOS下载地址
var schemeUrl = 'qmyx://com.aysd.bcfa/openApp' //schemeUrl

pageStatistics() // 页面统计

//判断是安卓还是iOS
function isAndroid_ios() {
	let u = navigator.userAgent,
		app = navigator.appVersion
	let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1 //android终端或者uc浏览器
	let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) //ios终端
	return {
		isAndroid,
		isiOS
	}
}
// 打开应用市场
function openApp(src) {
	// 通过iframe的方式试图打开APP，如果能正常打开，会直接切换到APP，并自动阻止a标签的默认行为
	// 否则打开a标签的href链接
	window.location.href = src
	let ifr = document.createElement('iframe')
	ifr.src = src
	ifr.style.display = 'none'
	document.body.appendChild(ifr)
	window.setTimeout(function() {
		// document.body.removeChild(ifr)
	}, 2000)
}
//判断是否微信
function isWeiXin() {
	if (/MicroMessenger/gi.test(navigator.userAgent)) {
		return true
	} else {
		return false
	}
}
// 打开应用市场判断IOS或安卓
function open1() {
	let d = new Date()
	let t0 = d.getTime()
	// 判断是安卓还是ios
	if (isAndroid_ios().isAndroid) {
		if (isWeiXin()) {
			// 引导用户在浏览器中打开
			alert('请在浏览器中打开本链接')
			return
		}
		//Android
		openApp(schemeUrl)
	} else if (isAndroid_ios().isiOS) {
		if (isWeiXin()) {
			window.location.href = iosUrl
			return
		}
		//iOS不支持iframe打开APP
		window.location.href = schemeUrl
	}
}

function andoridDownloadApp() {
	if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
		var loadDateTime = new Date()
		window.setTimeout(() => {
			var timeOutDateTime = new Date()
			if (timeOutDateTime - loadDateTime) {
				window.location.href =
					'http://a.app.qq.com/o/simple.jsp?pkgname=com.aysd.bcfa'
			}
		}, 25)
		window.location.href = apkUrl
	} else if (navigator.userAgent.match(/android/i)) {
		var state = null
		try {
			// open()
			state = window.location.href(
				'mimarket://details?id=com.aysd.bcfa',
				'_blank'
			)
		} catch (e) {}
        window.location.href ='https://img.quanminyanxuan.com/apk/4.0/app-ytjj_qmyxh5_483-release.apk'
        return
		if (navigator.userAgent.match(/mi\s/i)) {
			window.location.href = 'mimarket://details?id=com.aysd.bcfa'
		} else if (navigator.userAgent.match(/oppo/i)) {
			window.location.href = 'oppomarket://details?packagename=com.aysd.bcfa'
		} else if (navigator.userAgent.match(/huawei/i)) {
			window.location.href = 'appmarket://details?id=com.aysd.bcfa'
		} else if (navigator.userAgent.match(/vivo/i)) {
			window.location.href = 'vivomarket://details?id=com.aysd.bcfa'
		} else if (navigator.userAgent.match(/meizu/i)) {
			window.location.href = 'mstore://details?package_name=com.aysd.bcfa'
		} else if (navigator.userAgent.match(/nubia/i)) {
			window.location.href = 'neostore://details?package_name=com.aysd.bcfa'
		} else {
			window.location.href =
				'http://a.app.qq.com/o/simple.jsp?pkgname=com.aysd.bcfa'
		}
	}
}



// 直接下载判断安卓或IOS后传值
function downAppType1(e) {
	if (isAndroid_ios().isAndroid) {
		if (isWeiXin()) {
			// window.location.href =
			// 	'http://a.app.qq.com/o/simple.jsp?pkgname=com.aysd.bcfa'
			// 引导用户在浏览器中打开
			// Alert.hint('请在浏览器中打开本链接', 3000)
			return
		}
		open1()
		andoridDownloadApp1(e)
	} else if (isAndroid_ios().isiOS) {
		window.location.href = iosUrl;
	}
}

function andoridDownloadApp1(type) {
	if (type) {
		apkUrl = type
	}
	if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
		var loadDateTime = new Date()
		window.setTimeout(() => {
			var timeOutDateTime = new Date()
			if (timeOutDateTime - loadDateTime) {
				window.location.href =
					'http://a.app.qq.com/o/simple.jsp?pkgname=com.aysd.bcfa'
			}
		}, 25)
		window.location.href = apkUrl
	} else if (navigator.userAgent.match(/android/i)) {
		//直接下载的
		window.location.href = apkUrl
		return
	}
}

// 应用市场下载
function downAppgo() {
	if (isAndroid_ios().isAndroid) {
		if (isWeiXin()) {
			window.location.href =
				'http://a.app.qq.com/o/simple.jsp?pkgname=com.aysd.bcfa'
			// 引导用户在浏览器中打开
			// alert('请在浏览器中打开本链接')
			return
		}
		open1()

		andoridDownloadApp()
	} else if (isAndroid_ios().isiOS) {
		window.location.href = iosUrl;
	}
}
// 直接下载
function downApp1(type) {
	if (type) {
		downAppType1(type)
	} else {
		downAppType1()
	}
}
// 部分dom操作
$(function() {
	if (isWeiXin()) {
		$('.wxbox').show()
		return
	}
})
