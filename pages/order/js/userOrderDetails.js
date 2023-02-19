let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]
pageStatistics() 			// 页面统计
getUserInfo(sourcePlatform)	// 获取用户信息
let childOrderNo = getUrlKey('childOrderNo')
let orderDetail = {}
getOrderDetail()
function getOrderDetail(){
    http('GET', `/mallv2/h5OrderController/orderInfoByOrderNo`, {
        childOrderNo,
    }).then((res) => {
        orderDetail = res.data
        const {address, orderInfoList,orderNo,realTotalMoney,createTime,paySource,type,deliveryInfo} = orderDetail
        $('.userInfo-name').text(address.name+' '+address.tel)
        $('#address').text(address.addressAll)
        $('#logisticsAddress').text(address.addressAll)
        $('#logisticsName').text(address.name)
        $('#logisticsTel').text(address.tel)
        $('#productName').text(orderInfoList[0].productName)
        $('#productSkuSpec').text(orderInfoList[0].productSkuSpec)
        $('#productPrice').text(orderInfoList[0].productPrice+'元')
        $('#productOprice').text('￥'+ orderInfoList[0].productOprice)
        $('#productImg').attr('src',orderInfoList[0].productImg)
        $('#realTotalMoney').text(realTotalMoney+'元')
        $('#payType').text(isPayType(paySource))
        $('#orderNo').text(formatStr(orderNo))
        $('#type').text(orderType(orderInfoList[0].orderinfoStatus))
        $('#createTime').text(format(createTime))
        $('.logistics-type').text(orderType(orderInfoList[0].orderinfoStatus))
        if (['0','1','4','6'].includes(orderInfoList[0].orderinfoStatus)) {
            $('.logistics-text').addClass('dn')
        }
        appendDeliveryInfo(deliveryInfo)
        if (orderInfoList[0].orderinfoStatus == 0) {
            $('.bottom-box').removeClass('dn')
        }
    })
}
function appendDeliveryInfo(arr){
    let html = ''
    if (Array.isArray(arr)) {

        arr.forEach((value) => {
            html +=`<div class="logistics-info">
                <img  src="https://img.quanminyanxuan.com/other/8d99ac92bb8a434b8d4863078407347a.png" alt="">
                <p>${value.context}
                    <br>
                    <span class="time">${value.ftime}</span>
                </p>
            </div>`
        })
    }
    $('#logisticsInfo').append(html)
}
$(document).on('click','.toPay',function() {
    let orderId = orderDetail.orderInfoList[0].orderId
	let cashPay = 0
	let token = getCookie('token')
	let channel = getCookie('channel')
    ToProductDetail({orderId,cashPay,token,channel,sourcePlatform})
})
function more(){
    let height =  $('.order-logistics-box').height()
    $('.order-logistics').css('height',`${height+90}px`)
}
function orderType (type) {
    if (type == '1') {
        return '待发货'
    } else if (type == '2') {
        return '已发货'
    } 
    else if (type == '0') {
        return '待付款'
    } 
    else if (type == '3') {
        return '已完成'
    } else if (type == '4') {
        return '已关闭'
    }  else if (type == '6') {
        return '售后中'
    } 
    else {
        return ''
    }
}
function isPayType (type) {
    if (type == 'wx') {
        return '微信支付'
    } else if (type == 'alipay') {
        return '支付宝支付'
    } else {
        return ''
    }
}
function formatStr(value){
    let res = value.substring(0,value.length-4);
    return res+="****";
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
function add0 (m) {
    return m < 10 ? '0' + m : m
}