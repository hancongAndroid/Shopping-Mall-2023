// 跨域cookie
// document.domain = 'quanminyanxuan.com'
document.domain = '192.168.10.12'

// 设置cookie
// 下标，存储时间（小时）
function setCookie(name, value, hours) {
    var sj = new Date()
    sj.setHours(sj.getHours() + hours)
	document.cookie = name + "=" + value + ";expires=" + sj.toGMTString() + ";path=/"
}

// 获取cookie
function getCookie(name) {
    var arr,
        reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)")
    arr = document.cookie.match(reg)
    return arr
}

// 删除cookie
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    document.cookie = name + "=null;expires=" + exp.toGMTString() + ";path=/";
}





// 设置cookie
// 下标，存储时间（天）
function setCookie(key, value, iDay) {
	var oDate = new Date();
	oDate.setDate(oDate.getDate() + iDay);
	document.cookie = key + '=' + value + ';expires=' + oDate + ";path=/";
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
	setCookie(key, '', -1);//这里只需要把Cookie保质期退回一天便可以删除
}