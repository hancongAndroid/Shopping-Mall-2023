let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]

let pageNum = 1
let isLoading = false		//判断瀑布流是否加载中

pageStatistics() 			// 页面统计
getUserInfo(sourcePlatform)	// 获取用户信息

// 获取 商品列表 数据
getProductList()
function getProductList() {
	if (isLoading) return
	isLoading = true
	http('GET', `/mallv2/h5/livingcenter/queryListByPage`, {
		columnId: 87,
		pageSize: 10,
		pageNum,
		flag: 0
	}).then((res) => {
		isLoading = false
		let productList = res.data
		let cartData = getCartDataFromLocal()	// 获取购物车数据
		console.log('商品:', productList)
		if (productList.length == 0) isLoading = true
		pageNum ++
		
		let html = ''
		$.each(productList, (index, item) => {
			// 购物车是否存在该商品
			let oBtn = `<div class="btn-add-o" data-id=${item.id}>加入购物车</div>`
			for (let i = 0; i < cartData.length; i++) {
				if (cartData[i].id == item.id) {
					oBtn = `<div class="btn-group">
								<i class="btn-cut" data-id=${item.id} data-type='cut'>-</i>
								<span class="num">${cartData[i].counts}</span>
								<i class="btn-add" data-id=${item.id} data-type='add'>+</i>
							</div>`
					break
				}
			}
			// 无库存去掉链接
			let oDiv = ''
			if (item.stock == 0) {
				oDiv = `<img class="cover-img" src="${item.productImg}" >`
			} else {
				oDiv = `<img class="cover-img" src="${item.productImg}" onclick="window.open('../productDetail/livingProductDetail.html?productId=${item.id}', '_self')">`
			}
			html += `<div class="product-item">
						${oDiv}
						<div class="product-info">
							<div class="name">
								<img class="icon" src="https://img.quanminyanxuan.com/other/88e8f616266b49fcb938dd77fe28d6c6.png">
								<span>${item.productName}</span>
							</div>
							<div class="user-box">
								<div class="user-head">
									<img class="img" src="https://img.quanminyanxuan.com/service/cca62d9e86a047208cba910371b59d64.jpg" >
									<img class="img" src="https://img.quanminyanxuan.com/service/cca62d9e86a047208cba910371b59d64.jpg" >
									<img class="img" src="https://img.quanminyanxuan.com/service/cca62d9e86a047208cba910371b59d64.jpg" >
								</div>
								<div class="user-txt">深圳${filterVolume(item.volumeStr)}人买过</div>
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
						<img class="img" src="${item.headImg}" />
					</div>`
		})
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