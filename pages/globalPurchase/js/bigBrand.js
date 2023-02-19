let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]

let pageNum = 1
let isLoading = false		//判断瀑布流是否加载中

timer()						// 倒计时
pageStatistics() 			// 页面统计
getUserInfo(sourcePlatform)	// 获取用户信息

// 获取 滚动用户列表 数据
getFakeUsers()
function getFakeUsers() {
	http('GET', `/mallv2/activity/getFakeUserList`, {
		activityType: 'OLD_FOR_NEW'
	}).then((res) => {
		let fakeUsers = res.data
		// console.log('用户:', fakeUsers)
		
		// 向上滚动
		let user = ''
		$.each(fakeUsers, (index, item) => {
			user += `<div class="swiper-slide">
						<div class="roll-item">
							<img class="img" src="${item.headImg}" >
							<div class="roll-text">最新订单来自${item.nickname}，${Math.ceil(Math.random() * 10)}秒前</div>
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

// 获取 商品列表 数据
getProductList()
function getProductList() {
	if (isLoading) return
	http('GET', `/mallv2/subjectsController/getProducts`, {
		pageNum,
		pageSize: 10,
		id: 108
	}).then((res) => {
		isLoading = false
		let productList = res.data.list
		// console.log('瀑', productList)
		if (productList.length == 0) isLoading = true
		pageNum ++
		
		let html = ''
		$.each(productList, (index, item) => {
			html += `<div class="product-item" onclick="window.open('../productDetail/guessProductDetail.html?productId=${item.id}', '_self')">
						<img class="cover-img" src="${item.productImg}" >
						<div class="product-info">
							<div class="name">${item.productName}</div>
							<div class="middle">
								<span class="l">￥${item.originalPrice}</span>
								<div class="m">
									<span>直降</span><br>
									<span>1000</span>
								</div>
								<span class="r">即将恢复</span>
							</div>
							<div class="bottom">
								<span class="price">限时价￥<span class="num">${item.price}</span></span>
								<i class="icon">抢</i>
							</div>
						</div>
					</div>`
		})
		$('#productList').append(html)
	}, err => {
		console.log(err)
	})
}
			
// 部分dom操作
$(function () {
	
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