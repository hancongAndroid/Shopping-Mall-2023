

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

