var schemeUrl = 'peoplebrand://' //schemeUrl
var apkUrl = 'https://img.quanminyanxuan.com/other/d88fbfd76c884ea693040f5207c5c432.apk' //安卓apk下载地址
var iosUrl = 'https://apps.apple.com/cn/app/id1521772730' //iOS下载地址

//判断是安卓还是iOS
function isAndroid_ios () {
  let u = navigator.userAgent,
    app = navigator.appVersion
  let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1 //android终端或者uc浏览器
  let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) //ios终端
  return {
    isAndroid,
    isiOS
  }
}

function openApp (src) {
  // 通过iframe的方式试图打开APP，如果能正常打开，会直接切换到APP，并自动阻止a标签的默认行为
  // 否则打开a标签的href链接
  let ifr = document.createElement('iframe')
  ifr.src = src
  ifr.style.display = 'none'
  document.body.appendChild(ifr)
  window.setTimeout(function () {
    document.body.removeChild(ifr)
  }, 2000)
}

//判断是否微信
function isWeiXin () {
  if (/MicroMessenger/gi.test(navigator.userAgent)) {
    return true
  } else {
    return false
  }
}

function open () {
  let d = new Date()
  let t0 = d.getTime()
  // 判断是安卓还是ios
  if (isAndroid_ios().isAndroid) {
    if (isWeiXin()) {
      // 引导用户在浏览器中打开
      Alert.hint('请在浏览器中打开本链接', 3000)
      return
    }
    //Android
    if (openApp(schemeUrl)) {
      openApp(schemeUrl)
    } else {
      //由于打开需要1～2秒，利用这个时间差来处理
      let delay = setInterval(function () {
        let d = new Date()
        let t1 = d.getTime()
        if (t1 - t0 < 3000 && t1 - t0 > 2000) {
          window.location.href = 'http://sale.yitanjj.com/'
        }
        if (t1 - t0 >= 3000) {
          clearInterval(delay)
        }
      }, 1000)
    }
  } else if (isAndroid_ios().isiOS) {
    if (isWeiXin()) {
      window.location.href = iosUrl
      return
    }
    //iOS不支持iframe打开APP
    window.location.href = schemeUrl
  }
}

function andoridDownloadApp (type) {
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
    if(type==1){
      //直接下载的
      window.location.href = apkUrl
      return
    }
    try {
      openApp(schemeUrl)
      state = window.location.href(
        'mimarket://details?id=com.aysd.bcfa',
        '_blank'
      )
    } catch (e) {}
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
function downApp (type,str) {
  console.log(111111,type);
  // type控制是否直接安卓直接下载的
  // window.location.href="http://img.quanminyanxuan.com/service/9b940e02f2b54c55854dd0a8158f1909.html"
  if(!type){
    let showConfirm = true
      //指定的渠道才执行
    downAppType(1)
  }
  else{
    downAppType(1)
  }
}
function downAppType(e){
  if (isAndroid_ios().isAndroid) {
    andoridDownloadApp(e)
  } else if (isAndroid_ios().isiOS) {
    window.location.href = iosUrl;
    //iOS不支持iframe打开APP
    // window.location.href = schemeUrl
    
    // setTimeout(()=>{
    //   window.location.href = iosUrl;
    // },2000)
  }
}