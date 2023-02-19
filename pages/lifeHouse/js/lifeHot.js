let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]

let pageNum = 1
let isLoading = false		//判断瀑布流是否加载中
let headImgArr = []			//用户头像

// 排行 左上角标签
let rankingIcon = [
	'https://img.quanminyanxuan.com/other/be2f801d1c4f4cb6abed4dbf917bb649.png',
	'https://img.quanminyanxuan.com/other/172e3d17b37f4efc984538591a796b72.png',
	'https://img.quanminyanxuan.com/other/cc32e3d8f3ec4abda9cd8f0f2bff8480.png'
]

pageStatistics() 			// 页面统计
getUserInfo(sourcePlatform)	// 获取用户信息

// 获取 商品列表
function getProductList() {
	if (isLoading) return
	isLoading = true
	http('GET', `/mallv2/subjectsController/getProducts`, {
		pageNum,
		pageSize: 10,
		id: 100
	}).then((res) => {
		isLoading = false
		let productList = res.data.list
		// console.log('商品:', productList)
		if (productList.length == 0) isLoading = true
		pageNum ++
		
		let html = ''
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
			// 排行 左上角标签
			let oRank = ''
			if (index < 3) {
				oRank = `<img class="ranking-icon" src="${rankingIcon[index]}" >`
			} else {
				oRank = `<i class="ranking-num">${index + 1}</i>`
			}
			
			html += `${oDiv}
						<img class="cover-img" src="${item.productImg}" >
						${item.stock == 0 ? '<img class="end-img" src="https://img.quanminyanxuan.com/other/1b5eb188ec434ea9aa56a2e27f49dd3b.png">' : ''}
						${pageNum == 2 ? oRank : ''}
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
								<div class="btn-add-o">去抢购</div>
							</div>
						</div>
					</div>`
		})
		$('#productList').append(html)
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
		pageNum,
		pageSize: 10,
		id: 100
	}).then((res) => {
		isLoading = false
		let productList = res.data.list
		let cartData = getCartDataFromLocal()	// 获取购物车数据
		console.log('商品:', productList)
		if (productList.length == 0) isLoading = true
		pageNum ++
		
		let html = ''
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
			// 排行 左上角标签
			let oRank = ''
			if (index < 3) {
				oRank = `<img class="ranking-icon" src="${rankingIcon[index]}" >`
			} else {
				oRank = `<i class="ranking-num">${index + 1}</i>`
			}
			
			html += `${oDiv}
						<img class="cover-img" src="${item.productImg}" >
						${item.stock == 0 ? '<img class="end-img" src="https://img.quanminyanxuan.com/other/1b5eb188ec434ea9aa56a2e27f49dd3b.png">' : ''}
						${pageNum == 2 ? oRank : ''}
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
		$('#productList').append(html)
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
						<img class="img" src="${item.headImg}" />
					</div>`
		})
		getProductList()
		$('#userRandom').html(user);
		new Swiper('.swiper-container-user', {
			autoplay: {
				delay: 0,
				disableOnInteraction: false
			},
			loop: true,
			speed: 1500,
			slidesPerView: 7
		})
		
	}, err => {
		console.log(err)
	})
}

// 部分dom操作
$(function () {
	
	$('#people').text(5266 - parseInt(Math.random()*1000, 10))
	
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