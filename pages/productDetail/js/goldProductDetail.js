let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]
let productId = getUrlKey('productId') || 9090
let specMap = {}	//查规格信息

// 提交订单参数
let productSpecId = '' 		//规格Id
let activityType = '' 		//活动类型
let specialId = ''			//专栏
let flag = ''				//下单动作
let pageSource = ''			// 统计
let pageSourceV2 = ''

timer()						// 倒计时
pageStatistics() 			// 页面统计
getUserInfo(sourcePlatform)	// 获取用户信息

// 获取用户本地存储地址
let userAddress = getCookie('userAddress')
userAddress = userAddress ? JSON.parse(decodeURI(userAddress)) : {}
if (!$.isEmptyObject(userAddress)) {
	$('#addressFormPhone').val(userAddress.tel)
	$('#addressFormUsername').val(userAddress.userName)
	$('#addressFormDetail').val(userAddress.address)
	if (!$.isEmptyObject(userAddress.addressObj)) {
		$('#addressFormProvince').text(userAddress.addressObj.province)
		$('#addressFormCity').text(userAddress.addressObj.city)
		$('#addressFormArea').text(userAddress.addressObj.area)
	}
	
	// 获取省市区地址库
	getCityData()
} else {
	getUserAddress()
}

// 获取用户网络地址
function getUserAddress() {
	http('GET', `/users/users/getAddressByIp`).then((res) => {
		if (res.data.province) {
			$('#addressFormProvince').text(res.data.province)
			$('#addressFormCity').text(res.data.city)
			$('#addressFormArea').text(res.data.area)
		} else {
			$('#addressFormProvince').text('请选择')
			$('#addressFormCity').text('请选择')
			$('#addressFormArea').text('请选择')
		}
		
		// 获取省市区地址库
		getCityData()
	}, err => {
		console.log(err)
	})
}

// 阻止安卓实体键后退
// 页面载入时使用pushState插入一条历史记录
// let backFlag = true
// openLayer()
// function openLayer() {
// 	history.pushState(null, null, '#' )
// 	window.addEventListener('popstate', function(event) {
// 		if (!backFlag) return false
// 		layer.open({
// 			title: '温馨提示'
// 			,content: '该商品库存告急，使用补贴购买更优惠哦'
// 			,btn: ['继续购买', '看看其他']
// 			,yes: function(index){
// 				layer.close(index);
// 			}
// 		})
// 		backFlag = false
// 		// 点击回退时再向历史记录插入一条，以便阻止下一次点击回退
// 		history.pushState(null, null, '#' );
// 	})
// }

// 获取 商品 数据
getProductInfo()
function getProductInfo() {
	http('GET', `/mallv2/product/getProductInfoById`, {
		productId
	}).then((res) => {
		let productInfo = res.data
		if (!productInfo) {
			layer.open({
			    content: '商品已下架！'
			    ,skin: 'msg'
			    ,time: 2
			})
			$('.wrapper').html('')
			return
		}
		activityType = productInfo.activityType
		console.log('商品:', productInfo)
		
		// 规格
		let specArr = eval(productInfo.attributeJson)
		// console.log('规格:', specArr)
		
		// specMap
		specMap =  eval(productInfo.specMap)
		// console.log('specMap:', specMap)
		
		// 规格
		let specHtml = ''
		let specValue = ''
		$.each(specArr, (i, n) => {
			if (n.spanValue) {
				$.each(n.spanValue, (i, n) => {
					specValue += `<span class="spec">${n}</span>`
				})
			}
			specHtml += `<div class="specification">
							<span class="title">${n.spanName}</span>
							<span class="item">
								${specValue}
							</span>
						</div>`
			specValue = ''
		})
		$('#specContainer').html(specHtml)
		// 查库存默认选中第一个
		stockCheckForSelectSpec()
		
		// 信息栏目
		$('.curPrice').text(productInfo.price)
		$('#priceYuanPopup').text(productInfo.curPrice)
		$('#priceBuy').text(productInfo.price)
		$('#priceReal').text(productInfo.price)
		$('#vipCut').text(productInfo.originalPrice - productInfo.curPrice)
		$('.originalPrice, #originalPrice, #originalPricePopup').text(productInfo.originalPrice)
		$('#volumeStr').text(volumeStr(productInfo.volumeStr))
		$('.price-activityMax, #reduceYuan, #activityMaxPopup').text(productInfo.activityMax)
		$('#infoTitle').text(productInfo.longTitle)
		$('#infoTitlePopup, #infoTitleAddress').text(productInfo.productName)
		
		
		// 评价
		$('#commentSum').text(productInfo.commentSum)
		$('#goodRatio').text(productInfo.goodRatio)
		
		// 库存
		$('#stock').text(filterStock(productInfo.virtualStock))
		
		// banner
		let bannerImg = ''
		let imgBanner = productInfo.imgMapList.banner.sort(function(a, b) {
			if(a.sort === b.sort) {		//如果sort相同，按照id的升序
				return a.id - b.id
			} else {		//按照sort升序
				return a.sort - b.sort
			}
		})
		$.each(imgBanner, (i, n) => {
			bannerImg += `<div class="swiper-slide"><img src="${n.imgUrl}" /></div>`
		})
		$('#bannerImg').html(bannerImg);
		new Swiper ('.swiper-container-banner', {
			autoplay: {
				delay: 2000,							//自动滑动间隔
				disableOnInteraction: false				//操作后不会停止滑动
			},								
			speed: 500,									//滑动速度
			loop: true,									//循环滑动
			pagination: {
				el: '.swiper-pagination-banner',
				type: 'fraction'
			} 
		})
		
		// 图文详情
		let infoImg = ''
		let imgInfo = productInfo.imgMapList.info.sort(function(a, b) {
			if(a.sort === b.sort) {		//如果sort相同，按照id的升序
				return a.id - b.id
			} else {		//按照sort升序
				return a.sort - b.sort
			}
		})
		$.each(imgInfo, (i, n) => {
			infoImg += `<img src="${n.imgUrl}" />`
		})
		$('#imglist').html(infoImg);
		
	}, err => {
		console.log(err)
	})
}

// 获取 滚动用户列表 数据
getFakeUsers()
function getFakeUsers() {
	http('GET', `/mallv2/common/getFakeUsers`, {
		number: 5
	}).then((res) => {
		let fakeUsers = res.data
		// console.log('用户:', fakeUsers)
		
		let user = ''
		$.each(fakeUsers, (i, n) => {
			user += `<div class="swiper-slide">
							<div class="random">
								<img class="random-img" src="${n.headImg}" />
								<div class="random-name">${n.nickname} 在${Math.ceil(Math.random() * 10)}分钟前抢购了该商品!</div>
							</div>
						</div>`
		})
		$('#userRandom').html(user);
		new Swiper ('.swiper-container-random', {
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

// 获取 热门推荐 数据
getRecommendOther()
function getRecommendOther() {
	http('GET', `/mallv2/h5/chinagold/queryListByPage`, {
		columnId: 0,
		pageNum: 1,
		pageSize: 6,
		flag: 1
	}).then((res) => {
		let recommond = res.data
		// console.log('recommond:', recommond)
		
		let recommond1 = ''
		let recommond2 = ''
		$.each(recommond, (i, n) => {
			if (i < 3) {
				recommond1 += `<div class="product-item" onclick="window.open('./goldProductDetail.html?productId=${n.id}', '_self')">
								<img class="product-image" src="${n.productImg}" />
								<div class="g-product-info">
									<div class="descr">${n.productName}</div>
									<div class="integral-price">
										<div class="price">
											<span class="price1">￥<span class="num">${n.price}</span></span>
											<span class="price2">￥${n.originalPrice}</span>
										</div>
									</div>
								</div>
							</div>`
			} else {
				recommond2 += `<div class="product-item" onclick="window.open('./goldProductDetail.html?productId=${n.id}', '_self')">
								<img class="product-image" src="${n.productImg}" />
								<div class="g-product-info">
									<div class="descr">${n.productName}</div>
									<div class="integral-price">
										<div class="price">
											<span class="price1">￥<span class="num">${n.price}</span></span>
											<span class="price2">￥${n.originalPrice}</span>
										</div>
									</div>
								</div>
							</div>`
			}
			
		})
		$('.swiper-slide-1').html(recommond1)
		$('.swiper-slide-2').html(recommond2)
		new Swiper ('.swiper-container-recommend', {
			pagination: {
				el: '.swiper-pagination-recommend'
			}
		})
	}, err => {
		console.log(err)
	})
}

// 获取 用户评价 数据
getProductReviews()
function getProductReviews() {
	http('GET', `/mallv2/product/getProductReviews`).then((res) => {
		let productReviews = res.data
		let reviews = ''
		$.each(productReviews, (i, n) => {
			reviews += `<div class="swiper-item">
						<div class="user-info">
							<img class="user-img" src="${n.headImg}" >
							<span class="user-name">${n.nickname}</span>
						</div>
						<div class="evalute-txt">${n.content}</div>
					</div>`
		})
		$('#evaluteSwiper').html(reviews);
	}, err => {
		console.log(err)
	})
}

// 已兑数量
function volumeStr(num) {
	if (num >= 10000) {
		if (num % 10000 == 0) {
			return parseInt(num / 10000) + '万'
		} else {
			return (num / 10000).toFixed(2) + '万'
		}
	} else {
		return num
	}
}

// 提交订单
function confirmOrder() {
	let tel = $('#addressFormPhone').val(),
		userName = $('#addressFormUsername').val(),
		address = $('#addressFormDetail').val(),
		province = $('#addressFormProvince').text(),
		city = $('#addressFormCity').text(),
		area = $('#addressFormArea').text();
		
	// 校验地址
	if (userName.trim() == '') {
		layer.open({
			content: '请填写姓名',
			skin: 'msg',
			time: 1
		});
		$('#addressFormUsername').focus();
		return;
	}
	if (!/^1[3456789]\d{9}$/.test(tel)) {
		layer.open({
			content: '请填写正确的手机号',
			skin: 'msg',
			time: 1
		});
		$('#addressFormPhone').focus();
		return;
	}
	if (province == '请选择' || city == '请选择' || area == '请选择') {
		layer.open({
			content: '请选择地址',
			skin: 'msg',
			time: 1
		});
		$('#selCity').trigger("click");
		return;
	}
	if (address.trim() == '') {
		layer.open({
			content: '请填写详细地址',
			skin: 'msg',
			time: 1
		});
		$('#addressFormDetail').focus();
		return;
	}
	
	// 用户信息和地址存储本地
	let _address = {
		province,
		city,
		area
	}
	userAddress.addressObj = _address
	userAddress.addressStr = `${province}${city}${area}`
	userAddress.tel = tel
	userAddress.userName = userName
	userAddress.address = address
	setCookie('userAddress', encodeURI(JSON.stringify(userAddress)), 30)

	http('POST', `/mallv2/order/h5CreateOrder`, {
		productId: productId, //商品Id
		productSpecId: productSpecId, //规格Id
		activityType: activityType, //活动类型
		createType: 'H5NORMAL',
		specialId: specialId ? specialId : null, //专栏
		// flag: flag, //下单动作
		// pageSource: this.$store.getters.statistics, // 统计
		tel: tel,
		userName: userName,
		address: address,
		province: province,
		city: city,
		area: area
		// ,pageSourceV2: this.$store.state.user.channelInfo
	}).then((res) => {
		if (res.code == 200) {
			let orderId = res.data
			let cashPay = 0
			let token = getCookie('token')
			let channel = getCookie('channel')
            ToProductDetail({orderId,cashPay,token,channel,sourcePlatform})
		} else {
			layer.open({
				content: res.message,
				skin: 'msg',
				time: 1
			})
		}
	}, err => {
		console.log(err)
	})
}

// 提交订单 -- 意向订单（点关闭地址弹窗）
function fakeOrder() {
	let tel = $('#addressFormPhone').val(),
		userName = $('#addressFormUsername').val(),
		address = $('#addressFormDetail').val(),
		province = $('#addressFormProvince').text(),
		city = $('#addressFormCity').text(),
		area = $('#addressFormArea').text();

	// 没输电话号码不提交地址
	if (!/^1[3456789]\d{9}$/.test(tel)) {
		province = ''
		city = ''
		area = ''
	}
		
	http('POST', `/mallv2/order/h5CreateOrder`, {
		productId: productId, //商品Id
		productSpecId: productSpecId, //规格Id
		activityType: activityType, //活动类型
		createType: 'H5NORMAL',
		specialId: specialId ? specialId : null, //专栏
		// flag: flag, //下单动作
		// pageSource: this.$store.getters.statistics, // 统计
		tel: tel,
		userName: userName,
		address: address,
		province: province,
		city: city,
		area: area
		// ,pageSourceV2: this.$store.state.user.channelInfo
	}).then((res) => {

	}, err => {
		console.log(err)
	})
}

// 查库存默认选中第一个
function stockCheckForSelectSpec() {
	let specCount = $('.specification').length
	let specVal = ''
	let specVal1 = ''
	let specVal2 = ''
	if (specCount > 1) {	// 可选两种规格
		$('.specification:eq(0) .spec').each(function() {
			let self = $(this)
			specVal1 = self.text()
			$('.specification:eq(1) .spec').each(function() {
				specVal2 = $(this).text()
				specVal = specVal1 + '-' + specVal2
				if (specMap[specVal].stock == 0) {
					$(this).addClass('disable')
				} else {
					if ($('.specification:eq(1) .spec.active').length == 0) {
						$(this).addClass('active')
						self.addClass('active')
						// 默认选中规格
						productSpecId = specMap[specVal].id
						$('#priceYuanPopup').text(specMap[specVal].price)
						$('#originalPricePopup').text(specMap[specVal].originalPrice)
						$('#infoImgPopup, #infoImgAddress').attr('src', specMap[specVal].proImg)
						$('#pleaseChooseSpec, #pleaseChooseSpecAddress').text(specMap[specVal].skuSpec)
					} else {
						$(this).removeClass('disable')
					}
				}
			})
			// 第一种规格和第二种规格组合都没有库存，第一种规格设置不可点击
			if ($('.specification:eq(1) .spec.active').length == 0) {
				self.addClass('disable')
			} else {
				return false
			}
		})
	} else {
		$('.specification:eq(0) .spec').each(function() {
			let self = $(this)
			specVal = self.text()
			if (specMap[specVal].stock == 0) {
				self.addClass('disable')
			} else {
				if ($('.specification:eq(0) .spec.active').length == 0) {
					self.addClass('active')
					// 默认选中规格
					productSpecId = specMap[specVal].id
					$('#priceYuanPopup').text(specMap[specVal].price)
					$('#originalPricePopup').text(specMap[specVal].originalPrice)
					$('#infoImgPopup, #infoImgAddress').attr('src', specMap[specVal].proImg)
					$('#pleaseChooseSpec, #pleaseChooseSpecAddress').text(specMap[specVal].skuSpec)
				}
			}
		})
	}
}

// 选规格1
let specVal1 = ''
let specVal2 = ''
let specVal = ''
function selectSpec1() {
	if ($(this).hasClass('disable')) return
	let self = $(this)
	let specCount = $('.specification').length
	self.siblings('.spec').removeClass('active')
	$('#pleaseChoose').text('请选择 ')
	$('#pleaseChooseSpec').text('规格')
	
	if (specCount == 1) {	//只有一种规格
		if (!(self.hasClass('active'))) {	//选中操作
			self.addClass('active')
			specVal = self.text()
			$('#priceYuanPopup').text(specMap[specVal].price)
			$('#originalPricePopup').text(specMap[specVal].originalPrice)
			$('#infoImgPopup, #infoImgAddress').attr('src', specMap[specVal].proImg)
			$('#pleaseChooseSpec, #pleaseChooseSpecAddress').text(specMap[specVal].skuSpec)
			$('#pleaseChoose').text('已选择 ')
			productSpecId = specMap[specVal].id
		} else {	//未选中操作
			self.removeClass('active')
			productSpecId = null
		}
	} else {	//有两种规格
		$('.specification:eq(1) .spec').removeClass('active')
		$('.specification:eq(1) .spec').addClass('disable')
		if (!(self.hasClass('active'))) {	//选中操作
			self.addClass('active')
			specVal1 = self.text()
			
			// 判断第二种规格是否有库存
			$('.specification:eq(1) .spec').each(function(i) {
				let specVal = specVal1 + '-' + $(this).text()
				if (specMap[specVal].stock) {
					$('.specification:eq(1) .spec').eq(i).removeClass('disable')
				}
			})
		} else {	//未选中操作
			self.removeClass('active')
		}
		productSpecId = null
	}
}

// 选规格2
function selectSpec2() {
	if ($(this).hasClass('disable')) return
	$(this).siblings('.spec').removeClass('active')
	
	if ($(this).hasClass('active')) {	//未选中操作
		$(this).removeClass('active')
		$('#pleaseChoose').text('请选择 ')
		$('#pleaseChooseSpec').text('规格')
		productSpecId = null
	} else {							//选中操作
		$(this).addClass('active')
		specVal1 = $('.specification:eq(0) .spec.active').text()
		specVal2 = $(this).text()
		specVal = specVal1 + '-' + specVal2
		$('#priceYuanPopup').text(specMap[specVal].price)
		$('#originalPricePopup').text(specMap[specVal].originalPrice)
		$('#infoImgPopup, #infoImgAddress').attr('src', specMap[specVal].proImg)
		$('#pleaseChooseSpec, #pleaseChooseSpecAddress').text(specMap[specVal].skuSpec)
		$('#pleaseChoose').text('已选择 ')
		productSpecId = specMap[specVal].id
	}
}

// 部分dom操作
$(function () {
	addActivityIcon('.banner','detail')
	// 补贴弹窗
	$('#shopSubPopup, #shopSubPopup2').on('click', function() {
		$('#subPopup').addClass('show')
	})
	
	// 购买按钮
	$('#shopBtn, #shopBtn2, #shopBtn3, #subSubmit').on('click', function() {
		$('#buyPopup').addClass('show')
		$('#subPopup').removeClass('show')
	})
	
	// 选规格 下一步按钮
	$('#determineBuy').on('click', function() {
		if (!productSpecId) {
			layer.open({
				content: '还没选规格呢~',
				skin: 'msg',
				time: 1
			});
			return
		}
		// 本地存储有地址信息直接下单，不用弹出填地址
		if (!$.isEmptyObject(userAddress)) {
			if (userAddress.userName && userAddress.tel && userAddress.address) {
				$('#determineAddress').trigger('click')
			} else {
				$('#simpleAddress').addClass('show')
			}
		} else {
			$('#simpleAddress').addClass('show')
		}
	})
	
	// 地址 确定按钮
	$('#determineAddress').on('click', confirmOrder)
	
	// 关闭弹窗
	$('#closePopup, #closeAddress, #closeContact').on('click', function () {
		$('#buyPopup, #simpleAddress, #contactServicePopup').removeClass('show')
		$('body').removeClass('noscroll')
		//提交意向订单
		if ($(this).attr('id') == 'closeAddress') {
			fakeOrder()
		}
	})
	$('#closeSubPopup').on('click', function () {
		$('#subPopup').removeClass('show')
		$('#buyPopup').addClass('show')
	})
	
	// 页面滚动事件
	$(window).on('scroll', function () {
		let scrollTop = $(this).scrollTop()
		if (scrollTop > 600) {
			$('#backTop').removeClass('dn')
		} else {
			$('#backTop').addClass('dn')
		}
	})
	
	// 返回顶部
	$('#backTop').on('click', function() {
		$('html, body').animate({
			scrollTop: 0
		}, 500)
	})
	
	// 增加商品数量
	$('#numberSelect').on('click', function() {
		layer.open({
			content: '该商品限购一件',
			skin: 'msg',
			time: 1
		});
	})
	
	// 选规格1
	$(document).on('click', '.specification:eq(0) .spec', selectSpec1)
	
	// 选规格2
	$(document).on('click', '.specification:eq(1) .spec', selectSpec2)
	
	/*
	// 嵌入客服聊天
	;(function(w, d, n, a, j) {
	    w[n] = w[n] || function() {
	        (w[n].a = w[n].a || []).push(arguments);
	    };
	    j = d.createElement('script');
	    j.async = true;
	    j.src = 'https://qiyukf.com/script/3b2ebac3d94a29cbed7fb5f8998483db.js';
	    d.body.appendChild(j);
	})(window, document, 'ysf')
	
	// 弹出在线客服
	$('#btnService').on('click',function() {
	    open()
	})
	function open() {
	    ysf('onready', function () {
	        ysf('open');
	    })
	}
	*/
	
	// 客服按钮
	$('.contactService').on('click', function() {
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
	
	// 页面滚动事件
	$(window).on('scroll', function () {
		let scrollTop = $(this).scrollTop()
		let tabqhBoxTop = $('.oldForNew-product-info').offset().top / 4
		
		if (scrollTop > tabqhBoxTop) {
			$('.goods-shop-cart').addClass('show')
		} else {
			$('.goods-shop-cart').removeClass('show')
		}
	})

})

