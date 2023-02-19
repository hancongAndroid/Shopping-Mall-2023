let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]

let current = getUrlKey('current')
let userPhone = getUrlKey('phone') || ''
let smsCode = getUrlKey('smsCode') || ''
let serialNumber = getUrlKey('serialNumber')//'Y1QOeouvVPjyi5d4dHgjUQ=='
let pageNum = 1
let isLoading = false		//判断瀑布流是否加载中
let content = ''
let type = 'ALL'
let AllordersList = []
pageStatistics() 			// 页面统计
getUserInfo(sourcePlatform)	// 获取用户信息
let isWX = isWeiXin()
let isWeapp = 3  // 1 微信浏览器 2小程序 3外部浏览器
// let appText = isWX ? '小程序':'APP'
let appText = isWX ? 'APP' : 'APP'
function openApp () {
    if (isWX) {
        downAppgo()
        // openWeapp2('pages/shopping/shopping', '')
    } else {
        downAppgo()
    }
}
envType().then((res) => {
    isWeapp = res
})
// 根据url参数判断订单状态
if (current == 1) {
    type = 'OBLIGATION'			//待完成订单 OBLIGATION
} else if (current == 2) {
    type = 'DELIVERY'			//配送中 DELIVERY
} else if (current == 3) {
    type = 'COMPLETE'			//已完成 COMPLETE
} else if (current == 4) {
    type = 'CANCEL'				//已取消 CANCEL
}

// 获取 订单列表 数据
if (userPhone) {
    getcontent()
}else if (serialNumber) {
    queryOrdersList()
}else {
    tokenQueryOrder()
}
function tokenQueryOrder(params) {
    $('.loader').removeClass('dn')
    $('.query-box').addClass('dn')
    http('POST', `/mallv2/order/getH5OrdersList`, {
        content,
		pageNum,
		pageSize: 1000,
		type:'ALL'
    }).then((res) => {
        $('.loader').addClass('dn')
        $('.query-box').removeClass('dn')
        AllordersList = res.data.map((value) => {
            return {
                orderId:value.orderId,
                productName:value.orderInfoList[0].productName,
                descr:value.orderInfoList[0].descr,
                productSum:value.orderInfoList[0].productSum,
                orderNo:value.orderInfoList[0].childOrderNo,
                createtime:value.createTime,
                price:value.orderInfoList[0].productPrice,
                childOrderNo:value.orderInfoList[0].childOrderNo,
                type:value.type,
                productSkuSpec:value.orderInfoList[0].productSkuSpec,
                orderDelay:value.orderDelay,
                productInfo:{
                    title:value.orderInfoList[0].productName,
                    bannerimg:value.orderInfoList[0].productImg,
                    main:value.orderInfoList[0].descr,
                    originalprice:value.orderInfoList[0].productOprice,
                },
            }
        })
        fliterOrder()
    }).catch(() => {
        $('.loader').addClass('dn')
        $('.query-box').removeClass('dn')
    })
}
function queryOrdersList(){
    $('.loader').removeClass('dn')
    $('.query-box').addClass('dn')
    http('POST', `/mallv2/h5OrderController/list`, {
        serialNumber,
        type:'ALL',
        pageNum:pageNum,
        pageSize:1000
    }).then((res) => {
        $('.loader').addClass('dn')
        $('.query-box').removeClass('dn')
        AllordersList = res.data.map((value) => {
            return {
                productName:value.orderInfoList[0].productName,
                descr:value.orderInfoList[0].descr,
                productSum:value.orderInfoList[0].productSum,
                orderNo:value.orderInfoList[0].childOrderNo,
                createtime:value.createTime,
                price:value.orderInfoList[0].productPrice,
                childOrderNo:value.orderInfoList[0].childOrderNo,
                type:value.type,
                productSkuSpec:value.orderInfoList[0].productSkuSpec,
                orderDelay:value.orderDelay,
                productInfo:{
                    title:value.orderInfoList[0].productName,
                    bannerimg:value.orderInfoList[0].productImg,
                    main:value.orderInfoList[0].descr,
                    originalprice:value.orderInfoList[0].productOprice,
                },
            }
        })
        appendOrderItem(AllordersList)
    }).catch(() => {
        $('.loader').addClass('dn')
        $('.query-box').removeClass('dn')
    })
}
function getcontent (tel) {
    $('.loader').removeClass('dn')
    $('.query-box').addClass('dn')
    http('GET', `/mallv2/old/appSys`, {
        phone: userPhone,
        authCode: smsCode,
    }).then((res) => {
        if (res.data.userOrder) {
            $('.loader').addClass('dn')
            $('.query-box').removeClass('dn')
            AllordersList = res.data.userOrder
            fliterOrder()
        }else{
            tokenQueryOrder()
        }
    }).catch(() => {
        $('.loader').addClass('dn')
        $('.query-box').removeClass('dn')
    })
}
function appendOrderItem (ordersList) {
    let html = ''
    $.each(ordersList, (index, item) => {
        html +=`<div class="order-item dkApp">
        <div class="commodity" onclick="window.open('../order/userOrderDetails.html?childOrderNo=${item.childOrderNo}', '_self')">
            <!--<div class="title">订单编号:<span class="order-no">${item.orderNo}</span></div>-->
            <div class="status">
                <img class="icon" src="${orderTypeIcon(item.type, item.createtime)}">
                ${orderType(item.type, item.createtime)}
            </div>
            <div class="delivery">${format(item.createtime)}</div>
        </div>
        <div class="details" onclick="window.open('../order/userOrderDetails.html?childOrderNo=${item.childOrderNo}', '_self')">
            <div class="details-l">
                <img src="${item.productInfo.bannerimg}" >
            </div>
            <div class="details-r">
                <div class="title">${item.productInfo.title}</div>
                <div class="skubar">
                    <span class="sku">
                        ${item.productSkuSpec || ''}
                    </span>
                    <span class="price">￥${item.productInfo.originalprice}</span>
                </div>
                <div class="othing">
                    <span class="num">共1件</span>
                    <span class="price"><span class="txt">实付</span>￥${item.price}</span>
                </div>
            </div>
        </div>
        <div class="btn-group">
            <div onclick="window.open('../order/userOrderDetails.html?childOrderNo=${item.childOrderNo}', '_self')">
                ${item.type != 'OBLIGATION' && item.type != 'CANCEL' ? '<p class="tancc log" >查看物流</p>' : ''}
            </div>
            
            <p class="tancc" onclick="window.open('../order/userOrderDetails.html?childOrderNo=${item.childOrderNo}', '_self')">查看详情</p>
            <div onclick="window.open('../order/userOrderDetails.html?childOrderNo=${item.childOrderNo}', '_self')">
                ${item.type == 'OBLIGATION' ? '<p class="tanct toPay" data-orderid='+ item.orderId +'>去支付 <span id="t'+ item.createtime +'">00:00</span>'+ timer(item.createtime) +'</p>' : ''}
            </div>
            <!--<p class='tanc downApp' data-orderno=${item.orderNo}>联系客服</p>-->
        </div>
        ${item.orderDelay ? '<p class="delay-tips">' + item.orderDelay + '</p>' : ''}
    </div>`
    })
    $('#ordersList').html('')
    $('#ordersList').append(html)
    if ($('.order-item').length) {
        $('#orderNot').addClass('dn')
    } else {
        $('#orderNot').removeClass('dn')
    }
}

// 订单状态
function orderType (type) {
    if (type == 'OBLIGATION') {
        return '待完成订单'
    } else if (type == 'DELIVERY') {
        return '配送中'
    } else if (type == 'COMPLETE') {
        return '已完成'
    } else if (type == 'CANCEL') {
        return '已取消'
    } else {
        return '待出库'
    }
}

// 订单状态（图标）
function orderTypeIcon(type, createtime) {
	if (type == 'OBLIGATION') {
		return 'https://img.quanminyanxuan.com/other/26e66c80885a4a9eb0c80d13bc6c0a4e.png'
	} else if (type == 'DELIVERY') {
		return 'https://img.quanminyanxuan.com/other/302d5cce63994277807fba3a78ce2ca6.png'
	} else if (type == 'COMPLETE') {
		return 'https://img.quanminyanxuan.com/other/fdc4b3e328e444358a14aafbe68bac23.png'
	} else if (type == 'CANCEL') {
		return 'https://img.quanminyanxuan.com/other/b26b771d8fb44d36b59542953cd00ed0.png'
	} else {
		// 下单半小时后改变状态
		let ctime = new Date(parseInt(createtime)).getTime()
		let ntime = new Date().getTime() - 30 * 60 *1000
		if (ctime < ntime) {
			return 'https://img.quanminyanxuan.com/other/de0d3692eca1438493cd7658410e6971.png'
		} else {
			return 'https://img.quanminyanxuan.com/other/de0d3692eca1438493cd7658410e6971.png'
		}
	}
}
// 时间戳转时间
function format (shijianchuo) {
    var time = new Date(parseInt(shijianchuo))
    var y = time.getFullYear()
    var m = time.getMonth() + 1
    var d = time.getDate()
    var h = time.getHours()
    var mm = time.getMinutes()
    var s = time.getSeconds()
    return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s)
}
function fliterOrder() {
    let list = []
    switch (type) {
        case 'ALL':
            appendOrderItem(AllordersList)
            break;
        case 'OBLIGATION':
            list = AllordersList.filter(v => v.type == 'OBLIGATION')
            appendOrderItem(list)
            break;
        case 'DELIVERY':
            list = AllordersList.filter(v => v.type == 'DELIVERY')
            appendOrderItem(list)
            break;
        case 'COMPLETE':
            list = AllordersList.filter(v => v.type == 'COMPLETE')
            appendOrderItem(list)
            break;
        case 'CANCEL':
            list = AllordersList.filter(v => v.type == 'CANCEL')
            appendOrderItem(list)
            break;
    }
}
function add0 (m) {
    return m < 10 ? '0' + m : m
}
// 倒计时
function timer(createTime) {
	let hour = ''
	let minute = ''
	let second = ''
	let minutes = ''
	let dateTime = new Date(
		new Date(createTime).getTime() + 60 * 60 * 1000
	)
	let vars = {}
	vars['t' + createTime] = setInterval(() => {
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
		$('#t' + createTime).text(minute + ':' + second)
	}, 1000)
	return ''
}

// 选项卡切换商品列表
$('#tabBox').on('click', '.order-tabbar-item', function () {
    let self = $(this)
    self.addClass('active').siblings().removeClass('active')
    type = self.data('type')
    pageNum = 1
    isLoading = false
    fliterOrder()

    // getOrdersList()
})
// 去支付
// $(document).on('click','.toPay',function() {
//     let orderId = $(this).data('orderid')
// 	let cashPay = 0
// 	let token = getCookie('token')
// 	let channel = getCookie('channel')
//     ToProductDetail({orderId,cashPay,token,channel,sourcePlatform})
// })
// 部分dom操作
$(function () {
    // 进入页面对应订单选项卡选中
    $('.order-tabbar-item').eq(current).addClass('active').siblings().removeClass('active')
    // 页面滚动事件
    // $(window).on('scroll', function () {
    //     let scrollTop = $(this).scrollTop()
    //     let wHeight = $(this).height()
    //     let dHeight = $(document).height() - 300

    //     // 滚动到底部
    //     if (scrollTop + wHeight > dHeight) {
    //         isLoading = true
    //     }
    // })
    $(document).on('click', '.afterSale', function () {
        switch (isWeapp) {
            case 1:
                openWeapp2('pages/member/order/afterSale','')
                break;
            case 2:
                wx.miniProgram.navigateTo({ url:'/pages/member/order/afterSale' })
                break;
            case 3:
                layer.open({
                    title: '温馨提示'
                    , content: `如需售后，请前往${appText}进行`
                    , btn: [`打开${appText}`]
                    , yes: function (index) {
                        openApp()
                        layer.close(index)
                        clikStatistics('H5_APP_TXFH')
                    }
                })
                break;
        }
    })
    $(document).on('click', '.exclusive', function () {
        switch (isWeapp) {
            case 1:
                openWeapp2('pages/news/chat','')
                break;
            case 2:
                wx.miniProgram.navigateTo({ url:'/pages/news/chat' })
                break;
            case 3:
                layer.open({
                    title: '温馨提示'
                    , content: `请前往${appText}联系专属客服`
                    , btn: [`打开${appText}`]
                    , yes: function (index) {
                        openApp()
                        layer.close(index)
                        clikStatistics('H5_APP_TXFH')
                    }
                })
                break;
        }
    })
})
// 关闭弹窗
$('#closeContact').on('click', function () {
    $('#contactServicePopup').removeClass('show')
    $('body').removeClass('noscroll')
})
$('.contactService').on('click', function () {
    $('#contactServicePopup').addClass('show')
    $('body').addClass('noscroll')
    
	// 选择客服系统
	http('GET', `/mallv2/home/page/getKefuApi`).then((res) => {
		let type = res.data.type	// 1-第三方系统 0-自己系统
	
		if (type == 1) {
			// 参数说明：https://developer.7moor.com/online-service-kf02/
			$('#contactIframe').attr('src', `https://7moor.quanminyanxuan.com/wapchat.html?
			accessId=a1117470-34a4-11ed-8498-693ded0991ce`)
		} else {
			let phone = '',   		//手机号（没有传空）
				customerId = '',   	//手机号（没有传空）
				channel = 'h5',    	//来源app、h5、weapp
				machine = navigator.userAgent.indexOf('Android') != -1 ? 'Android' : 'ios',	//系统 Android、ios 
				enterPage = productId,  	//商品id 或者订单号  (不是商品详情或者订单详情进入的传0)
				enterType = 1,			//1-商品详情 2-订单详情 3-个人中心
				platform = 1;			//平台:1全民严选 2全民开团 3果宝商城
			$('#contactIframe').attr('src', `https://app.quanminyanxuan.com/#/pages/chat/chat?
			phone=${phone}&customerId=${phone}&channel=${channel}&machine=${machine}&enterPage=${enterPage}&enterType=${enterType}&platform=${platform}&os=weapp`)
		}
	})
})
