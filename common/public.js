// 解决不同手机分辨率不一致的适配问题
(function (doc, win) {
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

// 页面统计
function pageStatistics () {
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
function clikStatistics (type) {
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

// 获取用户信息
async function getUserInfo (sourcePlatform) {
    await http('GET', `/users/login/h5Login`, {
        sourcePlatform
    }).then((res) => {
        let userInfo = res.data
        localStorage.setItem('userInfo', JSON.stringify(userInfo))
        setCookie('token', userInfo.token, 30)
    }, err => {
        console.log(err)
    })
}

// 倒计时
function timer (end) {
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
        $('#hour, .hour').text(hour)
        $('#minute, .minute').text(minute)
        $('#second, .second').text(second)
        $('#minutes, .minutes').text(minutes)
    }, 100)
}

// 倒计时 半小时
function timer30Min (end) {
    let hour = ''
    let minute = ''
    let second = ''
    let minutes = ''
    let tmpTime = end ? end : `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`
    // var dateTime = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
    var dateTime = new Date(
        new Date(tmpTime).getTime() + 30 * 60 * 1000 - 1
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
            dateTime = new Date(
                new Date().getTime() + 30 * 60 * 1000 - 1
            )
            hour = '00'
            minute = '00'
            second = '00'
            minutes = '0'
        }
        $('#hour, .hour').text(hour)
        $('#minute, .minute').text(minute)
        $('#second, .second').text(second)
        $('#minutes, .minutes').text(minutes)
    }, 100)
}

// 数组随机打乱
function randomSort (a, b) {
    return Math.random() > .5 ? -1 : 1
}

// 范围随机数
function randomNum (a, b) {
    return Math.round(Math.random() * (b - a)) + a
}

// 库存
function filterStock (num) {
    if (num >= 100) {
        return (num / 28).toFixed(0)
    } else {
        return num
    }
}

// 已售
function filterVolume (num) {
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
        if (res.data) {
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

// 单品（详情页）
const openWeapp3 = (url = '', param = '') => {
    let channel = getUrlKey('channel') || getCookie('channel') || 'quanminyanxuan' //ytjj-qmyxh5-01
    let weappType = getUrlKey('weappType') || url || 'pages/member/webview'
    let query = param + '&gdt_vid=' + gdt_vid	//gdt_vid：投放广告url参数
    http('POST', `/mallv2/common/skipAppletsByProduct`, {
        channel: channel,	//渠道号
        path: weappType,	//小程序落地页
        query: query		//url参数
    }).then((res) => {
        console.log('success', res.data)
        if (res.data) {
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

function WeiXinType () {
    if (/MicroMessenger/gi.test(navigator.userAgent)) {
        return true
    } else {
        return false
    }
}
// 添加活动标签
function addActivityIcon (el, type) {
    // let nowDate = moment().format('YYYY-MM-DD');
    // let isInDate = moment(nowDate).isBetween('2022-6-18', '2022-7-1');
    // let img1 = 'https://img.quanminyanxuan.com/other/88bbf9e6bd15462b94563a20e71c13e9.png' 
    // let img2 = 'https://img.quanminyanxuan.com/other/e61d4a64934f4b91acfdf0c451c1716a.png' 
    let imgUrl = 'https://img.quanminyanxuan.com/other/ddaede2ba67e44abb9102fc2f4fda43f.png'
    let html = `<img class="banner-icon" style="width:auto;height:${type == 'detail' ? 0.6 : 0.35}rem;position: absolute;top: 0;right: 0; z-index:2;" src="${imgUrl}" />`
    $(el).css({ 'position': 'relative' })
    $(el).append(html)
}
// 获取范围内的随机数
function getRandomNum (min, max) {
    let range = max - min;
    let rand = Math.random();
    let num = min + Math.round(rand * range);
    return num;
}
// 获取小程序用户信息存本地,支付时候小程序环境会使用到
function setWxUserInfo () {
    let urlUserInfo = getUrlKey('userInfo') || null
    if (urlUserInfo && urlUserInfo !== 'null') {
        localStorage.setItem('wxUserInfo', urlUserInfo)
        setCookie('token', JSON.parse(urlUserInfo).token, 30)
        setCookie('channel', JSON.parse(urlUserInfo).channel, 30)
    }
}
const ToProductDetail = (data) => {
    const { orderId, cashPay, sourcePlatform, token, channel, brandSale = false, producType = null, couponPrice = null } = data
    const userInfo = localStorage.getItem('wxUserInfo') || null
    // 1.定义所有可以跳转本地详情的环境链接
    const urlObj = {
        dev: "m.quanminyanxuan.com", // 测试环境
        local: "127.0.0.1", // 本地环境
        // local2: "192.168.10.13", // 本地环境
    };
    let toPath = ""; // 跳转路径
    const _host = window.location.host; // 当前访问域名
    for (let i in urlObj) {
        let item = urlObj[i];
        if (_host.indexOf(item) > -1) {
            toPath = `../order/orderDetails.html?orderId=${orderId}&cashPay=${cashPay}&sourcePlatform=${sourcePlatform}&token=${token}&channel=${channel}&brandSale=${brandSale}&producType=${producType}&couponPrice=${couponPrice}&userInfo=${userInfo}`
        }
    }
    window.location.href = toPath || `https://sale.quanminyanxuan.com/h5/svip/pages/order/orderDetails.html?orderId=${orderId}&cashPay=${cashPay}&sourcePlatform=${sourcePlatform}&token=${token}&channel=${channel}&brandSale=${brandSale}&producType=${producType}&couponPrice=${couponPrice}&userInfo=${userInfo}`;
}
// 添加打开app按钮
function addOpenApp () {
    let isWX = WeiXinType()
    let html = `<img class="open-app" style="
    z-index: 2002;
    width:1.7rem;
    height:0.58rem;
    position: fixed;
    top: 30%;
    right: 0;
    pointer-events:auto;
    " 
    src="https://img.quanminyanxuan.com/other/78ebda3d386f4d36a775fe3167230f4f.png" />`
    let headBox = `
    <div class="headBoxOpenApp open-app" style="height:.86rem;background: #333;color: #fff;display: flex;align-items: center;justify-content: space-between;">
        <div>
            <img style="width:0.18rem;height:0.18rem;margin:0 0.21rem;pointer-events:auto;" src="https://img.quanminyanxuan.com/other/5b9f26a91bd04ef0b94c9104101c3fd8.png" alt="">
            <img style="width:0.6rem;height:0.6rem;margin-right:0.21rem" src="https://img.quanminyanxuan.com/other/ea73b2d314044848836ffd1e9d8de62a.png" alt="">
            专享福利，打开APP抢红包
        </div>
        <span class="open-app" style=" height: 100%;background: #FE0524;display: flex;justify-content: center;align-items: center;padding: 0 0.36rem;">立即打开</span>
    </div>
    `
    // $('body').append(html)
    let new_element = document.createElement('script');
    new_element.setAttribute('src', '../../components/productItem/down/js/down.js');
    document.body.appendChild(new_element);
    let arr = [
        '/integralCenter/gold.html',
        '/payment/payment.html',
        '/productDetail/',
        '/integralCenter/gold2',
    ]
    if (arr.some((v) => window.location.href.indexOf(v) > -1)) {
        $('body').prepend(headBox)
    }
    $('.open-app').click(() => {
        // downAppgo()
        if (isWX) {
            openWeapp2('pages/shopping/shopping', '')
        } else {
            downAppgo()
        }
    })
}

// 是否再微信环境，小程序环境
// 微信环境下 1
// 小程序环境 2
// 外部浏览器 3
function envType () {
    let isWX = WeiXinType()
    return new Promise((resolve, reject) => {
        if (isWX) {
            wx.miniProgram.getEnv((res) => {
                if (!res.miniprogram) {
                    // 微信环境下
                    resolve(1)
                } else {
                    // 小程序环境
                    resolve(2)
                }
            })
        } else {
            // 外部浏览器
            resolve(3)
        }
    })
}
