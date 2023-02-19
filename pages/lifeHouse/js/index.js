let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]

let pageNum = 1
let isLoading = false		//判断瀑布流是否加载中
let headImgArr = []			//用户头像

// 第一次进页面商品不随机
let flag = 1
let firstIntoLifeIndex = localStorage.getItem('firstIntoLifeIndex')
if (!firstIntoLifeIndex) {
	localStorage.setItem('firstIntoLifeIndex', 1)
	flag = 0
}

timer()						// 倒计时
pageStatistics() 			// 页面统计
getUserInfo(sourcePlatform)	// 获取用户信息

// 获取 顶部商品 数据
getDailyProductList()
function getDailyProductList() {
	http('GET', `/mallv2/subjectsController/getActivitiesGoods`, {
		activeType: 'DAILY_PRODUCTS',
		id: 1
	}).then((res) => {
		let nineProductList = res.data
		let hotHtml1 = ''
		let hotHtml2 = ''
		$.each(nineProductList, (index, item) => {
			if (index < 4) {
				hotHtml1 += `<div class="header-nine-item" onclick="window.open('../productDetail/livingProductDetail.html?productId=${item.id}', '_self')">
								<img class="cover" src="${item.productImg}">
								<div class="price">￥${item.price}</div>
								<div class="label">最近热销</div>
							</div>`
			}
			else if (index > 3 && index < 8) {
				hotHtml2 += `<div class="header-nine-item" onclick="window.open('../productDetail/livingProductDetail.html?productId=${item.id}', '_self')">
								<img class="cover" src="${item.productImg}">
								<div class="price">￥${item.price}</div>
								<div class="label">最近热销</div>
							</div>`
			}
		})
		$('.swiper-slide-1').html(hotHtml1)
		$('.swiper-slide-2').html(hotHtml2)
		new Swiper('.swiper-container-nine', {
			autoplay: {
				delay: 2500,
				disableOnInteraction: false
			},
			loop: true,
			speed: 1500,
			spaceBetween: 5,
			// ,slidesPerView: 4
		})
		
	}, err => {
		console.log(err)
	})
}

// 获取 限时秒杀 数据
getSeckillProductList()
function getSeckillProductList() {
	http('GET', `/mallv2/subjectsController/getActivitiesGoods`, {
		activeType: 'SECKILL',
		id: 53
	}).then((res) => {
		let seckillProductList = res.data
		let seckillHtml = ''
		$.each(seckillProductList, (index, item) => {
			seckillHtml += `<div class="scroll-item" onclick="window.open('../productDetail/livingProductDetail.html?productId=${item.id}', '_self')">
								<img class="cover" src="${item.productImg}">
								<div class="limit">
									<span class="l">限量</span>
									<span class="r">50件</span>
								</div>
								<div class="price">￥${item.price}</div>
							</div>`
		})
		$('#seckillProductList').html(seckillHtml)
		
	}, err => {
		console.log(err)
	})
}

// 获取 商品列表
function getProductList() {
	if (isLoading) return
	isLoading = true
	http('GET', `/mallv2/subjectsController/getProducts`, {
		id: 90,
		pageNum,
		pageSize: 10
	}).then((res) => {
		isLoading = false
		let productList = res.data.list
		// console.log('瀑布流:', productList)
		if (productList.length == 0) isLoading = true
		pageNum ++
		
		let nineHtml = ''
		$.each(productList, (index, item) => {
			// 无库存去掉链接
			let oDiv = ''
			if (item.stock == 0) {
				oDiv = `<div class="product-item">`
			} else {
				oDiv = `<div class="product-item product-item-click" data-id=${item.id}>`
			}
			// 用户头像
			let oImg = ''
			for (let i = 0; i < 3; i++) {
				oImg += `<img class="img" src="${headImgArr[parseInt(Math.random()*headImgArr.length,10)]}" >`
			}
			nineHtml += `${oDiv}
							<img class="cover-img" src="${item.productImg}" >
							${item.stock == 0 ? '<img class="end-img" src="https://img.quanminyanxuan.com/other/1b5eb188ec434ea9aa56a2e27f49dd3b.png">' : ''}
							<div class="product-info">
								<div class="name">
									<!--<img class="icon" src="https://img.quanminyanxuan.com/other/88e8f616266b49fcb938dd77fe28d6c6.png">-->
									<span>${item.productName}</span>
								</div>
								<div class="user-box">
									<div class="user-head">
										${oImg}
									</div>
									<div class="user-txt">已有${filterVolume(item.volume)}人买过</div>
								</div>
								<div class="label">全网底价</div>
								<div class="bottom">
									<div class="price">￥<span class="num">${item.price}</span><span class="o-price">￥${item.originalPrice}</span></div>
									<div class="btn-add-o" data-id=${item.id}>
										<span>去抢购</span>
										<!--<div class="progress">
											<div class="progress-line">
												<i class="inner" style="width:${item.percentage ? item.percentage : 0}%"></i>
											</div>
											<div class="progress-num">${item.percentage ? item.percentage : 0}%</div>
										</div>-->
									</div>
								</div>
							</div>
						</div>`
		})
		$('#nineProductList').append(nineHtml)
	}, err => {
		console.log(err)
	})
}

// 获取 商品列表
/* 有购物车的情况
function getProductList() {
	if (isLoading) return
	isLoading = true
	http('GET', `/mallv2/subjectsController/getProducts`, {
		id: 90,
		pageNum,
		pageSize: 10
	}).then((res) => {
		isLoading = false
		let productList = res.data.list
		let cartData = getCartDataFromLocal()	// 获取购物车数据
		// console.log('瀑布流:', productList)
		if (productList.length == 0) isLoading = true
		pageNum ++
		
		let nineHtml = ''
		$.each(productList, (index, item) => {
			// 购物车是否存在该商品
			let isHas = 0
			let counts = 0
			for (let i = 0; i < cartData.length; i++) {
				if (cartData[i].id == item.id) {
					isHas = 1
					counts = cartData[i].counts
					break
				}
			}
			// 无库存去掉链接
			let oDiv = ''
			let oBtn = ''
			if (item.stock == 0) {
				oDiv = `<div class="product-item">`
				oBtn = `<div class="btn-add-not">已抢完</div>`
			} else {
				oDiv = `<div class="product-item product-item-click" data-id=${item.id}>`
				oBtn = `<div class="btn-add-o ${isHas ? 'dn' : ''}" data-id=${item.id}>加入购物车</div>
						<div class="btn-add-past ${isHas ? '' : 'dn'}">已加购物车</div>`
			}
			// 用户头像
			let oImg = ''
			for (let i = 0; i < 3; i++) {
				oImg += `<img class="img" src="${headImgArr[parseInt(Math.random()*headImgArr.length,10)]}" >`
			}
			nineHtml += `${oDiv}
							<img class="cover-img" src="${item.productImg}" >
							${item.stock == 0 ? '<img class="end-img" src="https://img.quanminyanxuan.com/other/1b5eb188ec434ea9aa56a2e27f49dd3b.png">' : ''}
							<div class="product-info">
								<div class="name">
									<!--<img class="icon" src="https://img.quanminyanxuan.com/other/88e8f616266b49fcb938dd77fe28d6c6.png">-->
									<span>${item.productName}</span>
								</div>
								<div class="user-box">
									<div class="user-head">
										${oImg}
									</div>
									<div class="user-txt">已有${filterVolume(item.volumeStr)}人买过</div>
								</div>
								<div class="label">全网底价</div>
								<div class="bottom">
									<div class="price">￥<span class="num">${item.price}</span><span class="o-price">￥${item.originalPrice}</span></div>
									${oBtn}
								</div>
							</div>
						</div>`
		})
		$('#nineProductList').append(nineHtml)
	}, err => {
		console.log(err)
	})
}
*/

// 获取 用户列表 数据
getFakeUsers()
function getFakeUsers() {
	http('GET', `/mallv2/common/getFakeUsers`, {
		number: 100
	}).then((res) => {
		let fakeUsers = res.data
		// console.log('用户:', fakeUsers)
		let user = ''
		$.each(fakeUsers, (index, item) => {
			headImgArr.push(item.headImg)
			user += `<div class="swiper-slide">
						<div class="random">
							<img class="random-img" src="${item.headImg}" />
							<div class="random-name">${item.nickname} 在${Math.ceil(Math.random() * 10)}秒钟前下单了</div>
						</div>
					</div>`
		})
		getProductList()
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

// 部分dom操作
$(function () {
	
	// 跳转详情页
	$(document).on('click', '.product-item-click', function () {
		id = $(this).data('id')
		window.open('../productDetail/livingProductDetail.html?productId=' + id, '_self')
	})
	
	// 页面滚动事件
	$(window).on('scroll', function () {
		let scrollTop = $(this).scrollTop()
		let wHeight = $(this).height()
		let dHeight =$(document).height() - 300
		
		// 滚动到底部
		if (scrollTop + wHeight > dHeight) {
			getProductList()
			isLoading = true
		}
	})

})