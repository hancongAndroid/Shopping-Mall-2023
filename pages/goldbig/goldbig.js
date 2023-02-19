let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]
let pageNum = 1
let isLoading = false		//判断瀑布流是否加载中
let columnId = 0

pageStatistics() 			// 页面统计
getUserInfo(sourcePlatform)	// 获取用户信息

// 阻止安卓实体键后退
// 页面载入时使用pushState插入一条历史记录
// let backFlag = true
// openLayer()
// function openLayer() {
// 	history.pushState(null, null, '#' )
// 	window.addEventListener('popstate', function(event) {
// 		if (!backFlag) return false
// 		alert('返回')
// 		backFlag = false
// 		// 点击回退时再向历史记录插入一条，以便阻止下一次点击回退
// 		// history.pushState(null, null, '#' );
// 	})
// }

// 阻止安卓实体键后退
// 页面载入时使用pushState插入一条历史记录
// history.pushState(null, null, '#' )
// window.addEventListener('popstate', function(event) {
// 	$('#retuanMask').removeClass('dn')
// })

// 获取 热销商品 数据
getChinagoldHot()
function getChinagoldHot() {
	http('GET', `/mallv2/h5/chinagold/index`).then((res) => {
		let data = res.data
		// console.log(data.secondProductList)
		
		let html = ''
		$.each(data.secondProductList, (index, item) => {
			// 无库存去掉链接
			let oDiv = ''
			if (item.stock == 0) {
				oDiv = `<div class="product-list-item">`
			} else {
				oDiv = `<div class="product-list-item" onclick="window.open('../productDetail/goldProductDetail.html?productId=${item.id}', '_self')">`
			}
			html += `${oDiv}
						<div class="product-cover">
							<img class="cover-img" src="${item.productImg}" >
							<div class="fall-top">
								<div class="fall-t-t">直降</div>
								<div class="fall-t-b">¥<span class="num">${item.originalPrice - item.price}</span></div>
							</div>
						</div>
						<div class="product-info">
							<div class="product-name">${item.productName}</div>
							<div class="ev-icon">活动仅需</div>
							<div class="product-bottom">
								<div class="price">
									<span class="cprice">￥<span class="num">${item.price}</span></span>
									<span class="oprice">￥${item.originalPrice}</span>
								</div>
								<div class="sell">已抢<span class="num">${item.volumeStr}</span>件</div>
							</div>
						</div>
					</div>`
		})
		$('#productListHot').html(html)
	}, err => {
		console.log(err)
	})
}

// 获取 列表商品 数据
getProductList()
function getProductList() {
	if (isLoading) return
	http('GET', `/mallv2/h5/chinagold/queryListByPage`, {
		columnId,
		pageSize: 30,
		pageNum,
		flag: 1
	}).then((res) => {
		isLoading = false
		let productList = res.data
		// console.log('瀑', productList)
		if (productList.length == 0) isLoading = true
		pageNum ++
		
		let html = ''
		$.each(productList, (index, item) => {
			// 无库存去掉链接
			let oDiv = ''
			if (item.stock == 0) {
				oDiv = `<div class="product-list-item">`
			} else {
				oDiv = `<div class="product-list-item" onclick="window.open('../productDetail/goldProductDetail.html?productId=${item.id}', '_self')">`
			}
			html += `${oDiv}
						<div class="product-cover">
							<img class="cover-img" src="${item.productImg}" >
							${item.stock == 0 ? '<img class="end-img" src="https://img.quanminyanxuan.com/other/1b5eb188ec434ea9aa56a2e27f49dd3b.png" >' : ''}
						</div>
						<div class="product-info">
							<div class="product-name"><i class="icon">官方正品</i>${item.productName}</div>
							<div class="price">
								<span class="cprice">仅需 ¥<span class="num">${item.price}</span></span>
								<span class="oprice">￥${item.originalPrice}</span>
							</div>
							<div class="product-bottom">
								<div class="save">已省${item.originalPrice - item.price}元</div>
								<div class="late">仅剩<span class="num">${item.virtualStock}</span>件</div>
							</div>
						</div>
					</div>`
		})
		$('#productList').append(html)
	}, err => {
		console.log(err)
	})
}

// 已付款数量
function volumeStr(num) {
  if (num >= 10000) {
	if (num % 10000 == 0) {
	  return parseInt(num / 10000) + 'w'
	} else {
	  return (num / 10000).toFixed(2) + 'w'
	}
  } else {
	return num
  }
}

// 三天倒计时，第一次进页面记录时间
let firstIntoPage = localStorage.getItem('firstIntoPage')
if (firstIntoPage == null) {
	localStorage.setItem('firstIntoPage', new Date())
} else {
	let timer = (new Date()) - (new Date(firstIntoPage))
	let day = parseInt(timer / 1000 / 60 / 60 / 24 , 10)
	if (3 - day <= 0) {
		localStorage.setItem('firstIntoPage', new Date())
		$('#overDay').text(3)
	} else {
		$('#overDay').text(3 - day)
	}
}

// setInterval("timer(2021,11,11,11,11,11)", 1000)
// function timer(year,month,day,hour,minute,second) {
// 	var timer = (new Date(year,month-1,day,hour,minute,second)) - (new Date()); //计算剩余的毫秒数 
// 	var days = parseInt(timer / 1000 / 60 / 60 / 24 , 10); //计算剩余的天数 
// 	var hours = parseInt(timer / 1000 / 60 / 60 % 24 , 10); //计算剩余的小时 
// 	var minutes = parseInt(timer / 1000 / 60 % 60, 10);//计算剩余的分钟 
// 	var seconds = parseInt(timer / 1000 % 60, 10);//计算剩余的秒数 
// 	$("#timer").html(days+"天" + hours+"小时" + minutes+"分"+seconds+"秒")
// } 

// 时间戳转时间
format()
function format() {
	var time = new Date()
	var y = time.getFullYear()
	var m = time.getMonth()+1
	var d = time.getDate()
	var h = time.getHours()
	var mm = time.getMinutes()
	var s = time.getSeconds()
	// return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s)
	$('#curDate').text(y+'/'+add0(m)+'/'+add0(d))
}
function add0(m) {
	return m < 10 ? '0' + m : m
}

// 部分dom操作
$(function () {
	
	// 跳转客服页
	let phone = '',   		//手机号（没有传空）
		customerId = '',   	//手机号（没有传空）
		channel = 'h5',    	//来源app、h5、weapp
		machine = navigator.userAgent.indexOf('Android') != -1 ? 'Android' : 'ios',	//系统 Android、ios 
		enterPage = 0,  	//商品id 或者订单号  (不是商品详情或者订单详情进入的传0)
		enterType = 3,			//1-商品详情 2-订单详情 3-个人中心
		platform = 1;			//平台:1全民严选 2全民开团 3果宝商城
	$('#contactService').on('click', function() {
		window.location.href = `https://app.quanminyanxuan.com/#/pages/chat/chat?
		phone=${phone}&customerId=${phone}&channel=${channel}&machine=${machine}&enterPage=${enterPage}&enterType=${enterType}&platform=${platform}`
	})

	// 轮播图
	let banner = new Swiper ('.swiper-container-banner', {
		autoplay: {
			delay: 3000,
			disableOnInteraction: false
		},
		speed: 1000,
		loop: true
	})
	
	// 选项卡切换商品列表
	$('.tab-img-box').on('click', '.scroll-item', function() {
		var self = $(this)
		self.addClass('active').siblings().removeClass('active')
		let tabTop = $('.content-wrap').offset().top + 100
		$('html, body').scrollTop(tabTop)
		
		pageNum = 1
		isLoading = false
		columnId = self.data('column')
		$('#productList').html('')
		getProductList()
	})
	
	// 页面滚动事件
	$(window).on('scroll', function () {
		let scrollTop = $(this).scrollTop()
		let wHeight = $(this).height()
		let dHeight =$(document).height() - 300 - wHeight
		
		// 滚动到底部
		if (scrollTop + wHeight > dHeight) {
			getProductList()
			isLoading = true
		}
		
		// 导航固定添加样式
		if (scrollTop > $('.content-wrap').offset().top) {
			$('.tab-img-box').addClass('sticky')
		} else {
			$('.tab-img-box').removeClass('sticky')
		}
	})
	
	// 关闭弹窗
	$('.btn-no, .btn-yes').on('click', function() {
		$('#retuanMask').addClass('dn')
		if ($(this).hasClass('btn-no')) {
			window.location.href = 'javascript:history.go(-1)'
		}
	})

})