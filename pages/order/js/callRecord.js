let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]

pageStatistics() 			// 页面统计
getUserInfo(sourcePlatform)	// 获取用户信息

// 获取 充值记录 数据
getRecordList()
function getRecordList() {
	http('GET', `/mallv2/common/rechargeList`).then((res) => {
		let recordList = res.data
		console.log('记录:', recordList)
		
		if (recordList.length == 0) {
			$('#noData').removeClass('dn')
		} else {
			let html = ''
			$.each(recordList, (index, item) => {
				/**
				 * 充值状态
				 * 1 === 待支付
				 * 2 === 支付失败
				 * 3 === 充值中
				 * 4 === 充值失败
				 * 5 === 充值成功
				 */
				let oDiv = ''
				let status = item.status
				if (status == 1) {
					oDiv = `<div class="type-status">待支付</div>`
				} else if (status == 2) {
					oDiv = `<div class="type-status fail">支付失败</div>`
				} else if (status == 3) {
					oDiv = `<div class="type-status success">充值中</div>`
				} else if (status == 5) {
					oDiv = `<div class="type-status success">充值成功</div>`
				} else if (status == 4) {
					oDiv = `<div class="type-status fail">
								<div>充值失败</div>
								<div class="refund">已退款</div>
							</div>
							<div class="type-status loading" id="contactService">联系客服</div>`
				}
				html += `<div class="record-item">
							<img class="item-icon" src="https://img.quanminyanxuan.com/service/ef956cc4dca14d54a421998bb48497a1.png" >
							<div class="item-main">
								<div class="user-tel">手机充值（${(item.phone).replace(/^(\d{3})(\d{4})/g, '$1 $2 ')}）</div>
								<div class="pay-time">${format(item.createTime)}</div>
								<div class="order-box">
									<span class="order-id">订单号：${item.orderNo}</span>
									<i class="copy-btn" onclick="copyOrderNo('${item.orderNo}')">复制</i>
								</div>
							</div>
							<div class="item-type">
								<div class="type-sum">-${item.price}</div>
								${oDiv}
							</div>
						</div>`
			})
			$('#recordList').html(html)
		}
	}, err => {
		console.log(err)
	})
}

function copyOrderNo(content) {
	if(!content) {
		layer.open({
			content: '复制的内容不能为空 !',
			skin: 'msg',
			time: 1
		})
		return
	}
	content = typeof content === 'string' ? content : content.toString()
	if (!document.queryCommandSupported('copy')) {
		layer.open({
			content: '浏览器不支持 !',
			skin: 'msg',
			time: 1
		})
		return
	}
	let textarea = document.createElement("textarea")
	textarea.value = content
	textarea.readOnly = "readOnly"
	document.body.appendChild(textarea)
	textarea.select() // 选择对象
	textarea.setSelectionRange(0, content.length) //核心
	let result = document.execCommand("copy") // 执行浏览器复制命令
	if (result) {
		layer.open({
			content: '复制成功 !',
			skin: 'msg',
			time: 1
		})
	} else {
		console.log("复制失败，请检查h5中调用该方法的方式，是不是用户点击的方式调用的，如果不是请改为用户点击的方式触发该方法，因为h5中安全性，不能js直接调用！")
	}	
	textarea.remove()
}

// 时间戳转时间
function format(shijianchuo) {
	var time = new Date(parseInt(shijianchuo))
	var y = time.getFullYear()
	var m = time.getMonth()+1
	var d = time.getDate()
	var h = time.getHours()
	var mm = time.getMinutes()
	var s = time.getSeconds()
	// return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s)
	return add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)
}
function add0(m) {
	return m < 10 ? '0' + m : m
}

$(function() {
	// 跳转客服页
	let phone = '',   		//手机号（没有传空）
		customerId = '',   	//手机号（没有传空）
		channel = 'h5',    	//来源app、h5、weapp
		machine = navigator.userAgent.indexOf('Android') != -1 ? 'Android' : 'ios',	//系统 Android、ios 
		enterPage = 0,  	//商品id 或者订单号  (不是商品详情或者订单详情进入的传0)
		enterType = 3,			//1-商品详情 2-订单详情 3-个人中心
		platform = 1;			//平台:1全民严选 2全民开团 3果宝商城
	$(document).on('click', '#contactService', function() {
		window.location.href = `https://app.quanminyanxuan.com/#/pages/chat/chat?
		phone=${phone}&customerId=${phone}&channel=${channel}&machine=${machine}&enterPage=${enterPage}&enterType=${enterType}&platform=${platform}`
	})
})