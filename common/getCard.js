/**
 * 请求唤起支付宝支付功能
 */
function requestPay() {
    let md5_key = 'lA8aywosoAJrTt5l1ynJYai7L8yWZWAi';
    let md5_json = {
        pid: "2129",
        type: "alipay",
        out_trade_no: "20230220167689881",
        notify_url: "http://www.pay.com/notify_url.php",
        return_url: "http://www.pay.com/return_url.php",
        name: "VIP会员",
        money: "0.1",
        param: ""
    }
    let temp_md5_json = {}
    //除去数组中的空值和签名参数
    for (let property in md5_json) {
        if (!md5_json.hasOwnProperty(property)) continue;
        if (null == property || "null" === property || "undefined" === property || "" === property) continue
        if ("sign" === property.toLowerCase() || "sign_type" === property.toLowerCase()) continue
        let value = md5_json[property];
        if (null == value || "null" === value || "undefined" === value || "" === value) continue
        temp_md5_json[property] = value
    }
    //把数组所有元素排序，并按照“参数=参数值”的模式用“&”字符拼接成字符串
    let md5_sb = ""
    let keys = Array.from(Object.keys(temp_md5_json)).sort();
    let length = keys.length;
    keys.forEach((it, index) => {
        if (index === length - 1) {
            md5_sb += it + "=" + temp_md5_json[it]
        } else {
            md5_sb += it + "=" + temp_md5_json[it] + "&"
        }
    })
    //得到加密后的签名字符串
    let md5_sign = CryptoJS.MD5(md5_sb + md5_key);
    //重新获取最终的请求参数字符串
    temp_md5_json["sign"] = md5_sign.toString()
    temp_md5_json["sign_type"] = "MD5"
    //表单提交唤起支付宝支付
    let sbHtml = '<form id="alipaysubmit" name="alipaysubmit" action="https://pay.maqueshengqian.cn/submit.php" method="post">'
    for (let property in temp_md5_json) {
        sbHtml += '<input type="hidden" name="' + property + '" value="' + temp_md5_json[property] + '"/>'
    }
    sbHtml += '<input type="submit" value="确定" style="display:none;"></form>'
    console.log("sbHtml is " + sbHtml)
    const div = document.createElement('divform');
    div.innerHTML = sbHtml;
    document.body.appendChild(div);
    document.forms[0].submit();
}

function handleToWXCard (formUrl) {
    // 判断是否是授权后跳回的页面
    let isReturn = getUrlKey('openid') || ''
    // 授权后跳回的页面直接跳领卡
    if (isReturn) getCard()
    // 自动跳转领卡
    isHasOpenId()
    function isHasOpenId () {
        let openId = localStorage.getItem('WxOpenid') || ''	// 测试：owDYw1WHEzh1KEsr0qLvgBQQZUa4
        if (!openId) {
            console.log('用户未授权')
            //跳转登录
            oauthLogin()
            return
        }
        // 领取会员卡
        getCard()
    }
    // 微信登录
    function oauthLogin () {
        let baseUrl = 'https://svip.quanminyanxuan.com'
        localStorage.setItem('formUrl', formUrl)
        // 授权重定向URL
        let callback_url = encodeURIComponent(
            `${baseUrl}/pages/wxOauthRes/wxOauthResCard.html`
        )
        // 拼接授权地址
        let wxOauthUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxec8f6c583bf2befb&redirect_uri=${callback_url}&response_type=code&scope=snsapi_base#wechat_redirect`
        // 跳转
        console.log('xx', wxOauthUrl)
        window.location.href = wxOauthUrl
    }
    // 领取会员卡
    function getCard () {
        http('POST', `/users/users/v2/queryUsersCard`, {
            openId: localStorage.getItem('WxOpenid') || '',
        },{source:'weapp'}).then((res) => {
            // if (res.data.isReceiveCard) {	// 已经领卡
            // 	window.location.href = 'https://sale.quanminyanxuan.com/pages/envelopes/envelopes.html'
            // } else {
            console.log('领卡接口：', res)
            initJssdk(function () {
                // if (res.data.isReceiveCard) {
                // wx.ready(function() {
                // 	console.log('状态：', res.data.isReceiveCard)
                // 	console.log('cardId:', res.data.cardId)
                // 	console.log('code:', res.data.code)
                // 	wx.openCard({
                // 	  cardList: [{
                // 		cardId: res.data.cardId,
                // 		code: res.data.code
                // 	  }]// 需要打开的卡券列表
                // 	})
                // })
                // } else {
                wx.ready(function () {
                    wx.addCard({
                        cardList: [{
                            cardId: res.data.cardList[0].cardId,
                            cardExt: res.data.cardList[0].cardExt
                        }], // 需要添加的卡券列表
                        success: function (res) {
                            var cardList = res.cardList; // 添加的卡券列表信息
                            console.log('success', res)
                        },
                        fail: function (res) {
                            console.log('fail', res)
                        }
                    })
                })
                // }

            })
            // }
        }, err => {
            console.log(err)
        })
    }

    function initJssdk (callback) {
        console.log('href:', window.location.href)
        var uri = encodeURIComponent(window.location.href.split('?')[0]); //获取当前url然后传递给后台获取授权和签名信息
        console.log('jssdkUrl', uri)
        http('POST', `/users/login/getH5WxCardJsSdk`, {
            url: uri
        },{source:'weapp'}).then((res) => {
            //返回需要的参数appId,timestamp,noncestr,signature等
            if (res.code == 200) {
                // console.log('请求jssdk配置', res.data)
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
                    console.log('config', config)
                }
            } else {
                alert('领取失败')
            }
        }, err => {
            console.log(err)
        })
    }
}

