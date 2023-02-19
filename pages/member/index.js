let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]

let pageNum = 1
let isLoading = false //判断瀑布流是否加载中
let activityType = 'SECKILL'

let taskScore = 0 //任务积分
let aumont = 4000 //
let yhflag = localStorage.getItem('yhflag')
if (yhflag == null) {
	localStorage.setItem('yhflag', 1)
	yhflag = 0
	openLayer()
}

getUserAddress()
// 获取用户网络地址
function getUserAddress() {
	http('GET', `/users/users/getAddressByIp`).then((res) => {
		// console.log(res)
		if (res.data.province) {
			$('#addressFormProvince').text(res.data.province)
			$('#addressFormCity').text(res.data.city)
			$('#addressFormArea').text(res.data.area)
		}
	}, err => {
		console.log(err)
	})
}

function openLayer() {
	history.pushState(null, null, '#')
	window.addEventListener('popstate', function(event) {
		// window.location.href= "../../pages/old2New/gundong.html?channel=ma-sms-2377";
		$('#maskNew').removeClass('dn')
		clikStatistics('HUIYUAN_BTLJ')
	})
}


// 获取补贴金额
getAumont()
function getAumont() {
	http('GET', `/mallv2/h5/oldfornew/account`).then((res) => {
		let used = res.data.used == null ? 0 : parseInt(res.data.used)
		let aumont = 4000 - used < 0 ? 0 : 4000 - used
		if (aumont < 4000) {
			$('.aut').hide()
			$('.aut1').show()
		}
		let aumHeight = -0.7
		var tim = setInterval(()=>{
			if(aumHeight > 0){
				$('.bottom-tips').css('top','0')
				$('.icon-view1').show()
				clearInterval(tim)
			}else{
				aumHeight += 0.025
				$('.bottom-tips').css('top',aumHeight+'rem')
			}
		},10)
		$('#aumont').text(aumont)
		$('#aumont1').text(aumont)
		$('#aumont2').text(aumont)
	}, err => {
		console.log(err)
	})
}

// 获取用户信息
(function() {
	http('GET', `/users/login/h5Login`, {
		sourcePlatform
	}).then((res) => {
		let userInfo = res.data
		localStorage.setItem('userInfo', JSON.stringify(userInfo))
		// console.log('userInfo:', JSON.parse(localStorage.getItem('userInfo')))

		$('#scoreNum').text(userInfo.score)
		$('#scoreNum3').text(userInfo.score)
	}, err => {
		console.log(err)
	})
})()
pageStatistics() // 页面统计


// 获取 滚动用户列表 数据
getFakeUsers()
function getFakeUsers() {
	http('GET', `/mallv2/activity/getFakeUserList`, {
		activityType: 'OLD_FOR_NEW'
	}).then((res) => {
		let fakeUsers = res.data
		// console.log('用户:', fakeUsers)

		let user = ''
		$.each(fakeUsers, (index, item) => {
			user += `<div class="swiper-slide">
						<div class="roll-item">
							<img class="img" src="${item.headImg}" >
							<div class="roll-text">${item.nickname}使用消费补贴金换购了商品，节省了${item.money}元</div>
						</div>
					</div>`
		})
		$('#userRandom').html(user);
		new Swiper('.swiper-container-random', {
			direction: 'vertical',
			autoplay: {
				delay: 4000,
				disableOnInteraction: false
			},
			speed: 500,
			loop: true
		})
	}, err => {
		console.log(err)
	})
}


// 获取 购物卡 数据
// getShoppingcard()
// function getShoppingcard() {
// 	http('GET', `/mallv2/h5/shoppingcard/index`).then((res) => {
// 		let cardInfo = res.data
// 		// console.log(cardInfo)

// 		$('#amount').text(cardInfo.amount)
// 		$('#cardNo').text(cardInfo.cardNo)
// 		$('#periodOfValidity').text(cardInfo.periodOfValidity)
// 	}, err => {
// 		console.log(err)
// 	})
// }



// 获取 更多特卖 数据
getProductList()
function getProductList() {
	if (isLoading) return
	isLoading = true
	http('GET', `/mallv2/h5/membersale/queryListByPage`, {
		columnId: 0,
		pageSize: 20,
		pageNum,
		flag: yhflag
	}).then((res) => {
		isLoading = false
		let productList = res.data
		// console.log('瀑', productList)
		if (productList.length == 0) isLoading = true
		pageNum++
		let html = ''
		$.each(productList, (index, item) => {
			// 无库存去掉链接
			let oDiv = ''
			if (item.stock == 0) {
				oDiv = `<div class="product-list-item">`
			} else {
				oDiv =
					`<div class="product-list-item" onclick="window.open('../productDetail/saleProductDetail.html?productId=${item.id}', '_self')">`
			}
			html += `${oDiv}
						<div class="product-cover">
							<img class="cover-img" src="${item.productImg}" >
							${item.stock == 0 ? '<img class="end-img" src="https://img.quanminyanxuan.com/other/1b5eb188ec434ea9aa56a2e27f49dd3b.png" >' : ''}
						</div>
						<div class="product-info">
							<div class="product-name">${item.productName}</div>
							<div class="product-bottom">
								<div class="price">￥<span class="num">${item.originalPrice}</span></div>
								<div class='vip_price'>
									<img class='vip_price_img' src='https://img.quanminyanxuan.com/other/aa748fe97cbe4007bfe317f06e4d9db6.png' />
									<p class='vip_price_txt'>￥<span class="num">${item.price}</span></p>
								</div>
							</div>
						</div>
					</div>`
		})
		$('#productListMore').append(html)
	}, err => {
		console.log(err)
	})
}

// 获取 全额返 数据
// getActivityList()
function getActivityList() {
	if (isLoading) return
	isLoading = true
	http('GET', `/mallv2/activity/getActivityList`, {
		pageSize: 20,
		pageNum,
		activityType:'GET_SCORE',
		flag: yhflag
	}).then((res) => {
		isLoading = false
		let productList = res.data
		// console.log('瀑', productList)
		if (productList.length == 0) isLoading = true
		pageNum++
		let html = ''
		$.each(productList, (index, item) => {
			// 无库存去掉链接
			let oDiv = ''
			if (item.stock == 0) {
				oDiv = `<div class="product-list-item">`
			} else {
				oDiv =
					`<div class="product-list-item" onclick="window.open('../productDetail/fanproductDetail.html?productId=${item.id}', '_self')">`
			}
			html += `${oDiv}
						<div class="product-cover">
							<img class="cover-img" src="${item.productImg}" >
							${item.stock == 0 ? '<img class="end-img" src="https://img.quanminyanxuan.com/other/1b5eb188ec434ea9aa56a2e27f49dd3b.png" >' : ''}
						</div>
						<div class="product-info">
							<div class="product-name">${item.productName}</div>
							<div class="product-bottom">
								<p class="price">会员底价￥<span class="num">${item.price}</span></p>
								<p class="pricef">￥${item.originalPrice}</p>
							</div>
							<div class='qef'>下单全额返${item.price}元购物券</div>
						</div>
					</div>`
		})
		$('#productListMore').append(html)
	}, err => {
		console.log(err)
	})
}
// 图片懒加载
let lazyLoad = (function() {
	let clock;

	function init() {
		$(window).on("scroll", function() {
			if (clock) {
				clearTimeout(clock);
			}
			clock = setTimeout(function() {
				checkShow();
			}, 200);
		})
		checkShow();
	}
	let i;

	function checkShow() {
		i = 0;
		$(".cover-img").each(function() {
			let $cur = $(this);
			// if($cur.attr('isLoaded')){
			// 	return;
			// }
			if (shouldShow($cur)) {
				showImg($cur);
			}
		})
		// console.log(i);
	}

	function shouldShow($node) {
		let scrollH = $(window).scrollTop(),
			winH = $(window).height(),
			top = $node.offset().top;
		if (top < winH + scrollH) {
			return true;
		} else {
			return false;
		}
	}

	function showImg($node) {
		$node.attr('src', $node.attr('data-img'));
		// $node.attr('isLoaded', true);
		// alert($node.attr('id'));
		i++;
		// i = $node.attr('id');
	}
	return {
		init: init
	}
})()
// lazyLoad.init();



// 部分dom操作
$(function() {
	
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
	
	new Swiper('.swiper-container-midbar', {
		autoplay: {
			delay: 2500,
			disableOnInteraction: false
		},
		speed: 500,
		loop: true,
		pagination: {
			el: '.swiper-pagination',
		},
	})
	$('.qianbaot').click(()=>{
		let qianbaot1 = $('.midbar-head').offset().top
		$('html, body').scrollTop(qianbaot1 - 20)
	})
	// 选项卡切换商品列表
	$('.tab-box').on('click', '.tab-item', function() {
		$(this).addClass('tab-item-active').siblings().removeClass('tab-item-active')
		let timeBoxTop = $('.tab-box').offset().top - 10
		$('html, body').scrollTop(timeBoxTop)

		// 请求商品数据
		let type = $(this).data('type')
		if (type == activityType) return
		$('#productListMore').html('')
		pageNum = 1
		isLoading = false
		activityType = type
				getProductList()
		// switch (activityType) {
		// 	case 'SECKILL':
		// 		getProductList()
		// 		break
		// 	case 'GET_SCORE':
		// 		getActivityList()
		// 		break
		// }
	})

	// 页面滚动事件
	$(window).on('scroll', function() {
		let scrollTop = $(this).scrollTop()
		let wHeight = $(this).height()
		let dHeight = $(document).height() - 300
		// let tabTop = $('.tab-box2').offset().top - 10
		
		// if(scrollTop > tabTop ){
		// 	$('.tab-top-nav').addClass('tab-top-nav-fixed')
		// 	$('.tab-top-dh').show()
		// }else{
		// 	$('.tab-top-nav').removeClass('tab-top-nav-fixed')
		// 	$('.tab-top-dh').hide()
		// }
		// 滚动到底部
		if (scrollTop + wHeight > dHeight) {
			getProductList()
			// switch (activityType) {
			// 	case 'SECKILL':
			// 		getProductList()
			// 		break
			// 	case 'GET_SCORE':
			// 		getActivityList()
			// 		break
			// }
			// isLoading = true
		}
	})
	// 关闭购物卡弹窗
	$('#closeMaskCard').on('click', function() {
		$('#maskCard').addClass('dn')
	})
	// 关闭补贴弹窗
	$('#closeMaskNew').on('click', function() {
		$('#maskNew').addClass('dn')
	})

	// 轮播图
	let banner = new Swiper('.swiper-container-banner', {
		autoplay: {
			delay: 3000,
			disableOnInteraction: false
		},
		speed: 500,
		loop: true
	})

	// 删除 打开app按钮
	$('#closeAppBar').on('click', function() {
		$('#appBar').remove()
	})
	$(document).on('click', '#appBar', function() {
		clikStatistics('HUIYUAN_APP')
		downAppgo() 
	})
})
