let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]
let pageNum = 1
let isLoading = false		//判断瀑布流是否加载中
let id = getUrlKey('nid')
let specialId = 0			//分类商品id

pageStatistics() 			// 页面统计
getUserInfo(sourcePlatform)	// 获取用户信息

// 获取 顶部分类 数据
getNewSpecialList()
function getNewSpecialList() {
	http('GET', `/mallv2/special/getNewSpecialList`, {
		status: 1,
		pid: id
	}).then((res) => {
		let data = res.data
		// console.log('分类:', data)
		
		// 商品数据渲染
		let html1 = ''
		let html2 = ''
		$.each(data, (index, item) => {
			html1 += `<li class="nav-item" onclick="window.open('../discover/secondClass.html?specialId=${item.id}&title=${item.title}', '_self')">
						<img class="icon" src="${item.imgUrl}?x-oss-process=image/resize,w_100,m_lfit" >
						<span class="title">${item.title}</span>
					</li>`
			html2 += `<div class="tab-item" data-special="${item.id}">${item.title}</div>`
		})
		$('#navSpecialList').html(html1)
		$('#tabBoxItemList').append(html2)
	}, err => {
		console.log(err)
	})
}

// 获取 0元试用 数据
getProductBySpecial()
function getProductBySpecial() {
	http('POST', `/mallv2/product/getProductBySpecial`, {
		pageNum: 1,
		pageSize: 10,
		specialId: id,
		type: "IS_ZERO_PRODUCT"
	}).then((res) => {
		let data = res.data
		// console.log('0元:', data)
		
		// 商品数据渲染
		let html = ''
		$.each(data, (index, item) => {
			html += `<div class="product-item" onclick="window.open('../evaluation/appraisalDetail.html?productId=${item.id}', '_self')">
						<img class="img" src="${item.productImg}?x-oss-process=image/resize,w_226,h_226,m_lfit" >
						<p class="name">${item.productName}</p>
						<div class="bottom">
							<span class="price">￥0</span>
							<span class="btn">立即试用</span>
						</div>
					</div>`
		})
		$('#zeroProductList').html(html)
	}, err => {
		console.log(err)
	})
}

// 获取 商品列表（所有） 数据
getProductList()
function getProductList() {
	if (isLoading) return
	isLoading = true
	http('POST', `/mallv2/product/getRecommendBySpecialId`, {
		pageNum,
		pageSize: 10,
		specialId: id
	}).then((res) => {
		isLoading = false
		let data = res.data
		// console.log('商品:', data)
		if (data.length == 0) isLoading = true
		pageNum ++
		
		// 商品数据渲染
		productListGuess(data, $('#productList'))
	}, err => {
		console.log(err)
	})
}

// 获取 商品列表（分类） 数据
function getProductListSpecial(sId) {
	if (isLoading) return
	isLoading = true
	http('POST', `/mallv2/product/getProductBySpecial`, {
		pageNum,
		pageSize: 10,
		specialId: sId,
		type: "COMPOSITE"
	}).then((res) => {
		isLoading = false
		let productList = res.data
		// console.log('商品:', productList)
		if (productList.length == 0) isLoading = true
		pageNum ++
		
		// 商品数据渲染
		productListGuess(productList, $('#productList'))
	}, err => {
		console.log(err)
	})
}

// 获取 滚动用户列表 数据
getFakeUsers()
function getFakeUsers() {
	http('GET', `/mallv2/common/getFakeUsersAndProduct`).then((res) => {
		let fakeUsers = res.data
		// console.log('用户:', fakeUsers)

		// 向上滚动
		let user = ''
		$.each(fakeUsers, (index, item) => {
			user += `<div class="swiper-slide">
						<span class="txt">恭喜 ${item.name} 成功获得试用</span>
					</div>`
		})
		$('#userRandom').html(user);
		new Swiper('.swiper-container-random', {
			direction: 'vertical',
			autoplay: {
				delay: 2000,
				disableOnInteraction: false
			},
			speed: 500,
			loop: true
		})
	}, err => {
		console.log(err)
	})
}

// 获取 评论轮播 数据
getFakeAssess()
function getFakeAssess() {
	http('GET', `/mallv2/dynamic/getDynamicInfoBySpecialId`,{
		specialId: id
	}).then((res) => {
		let fakeAssess = res.data
		// console.log('评论:', fakeAssess)

		// 评论滚动
		let assess = ''
		$.each(fakeAssess, (index, item) => {
			assess += `<div class="swiper-slide">
							<div class="assess-box">
								<img class="img" src="${item.img}?x-oss-process=image/resize,w_150,m_lfit" >
								<div class="assess-info">
									<div class="swiper-slide">
										<p class="txt">${item.content}</p>
										<div class="user-info">
											<div class="user-info-l">
												<img class="icon" src="${item.headImg}?x-oss-process=image/resize,w_50,m_lfit" >
												<span class="txt-num">${item.nickname}</span>
											</div>
											<div class="user-info-r">
												<img class="icon" src="https://img.quanminyanxuan.com/other/cf7e5d3f156e42f3a81aa778ec6f99be.png" >
												<span class="txt-num">${item.praiseNum}</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>`
		})
		$('#assessRandom').html(assess);
		new Swiper('.swiper-container-assess', {
			autoplay: {
				delay: 2000,
				disableOnInteraction: false
			},
			speed: 1000,
			loop: true
		})
	}, err => {
		console.log(err)
	})
}

// 部分dom操作
$(function () {
	
	// 选项卡切换商品列表
	$('#tabBox').on('click', '.tab-item', function() {
		let self = $(this)
		if (self.hasClass('active')) return	//点击当前无操作
		self.addClass('active').siblings().removeClass('active')
		
		specialId = self.data('special')
		pageNum = 1
		isLoading = false
		$('#productList').html('')
		$('html, body').scrollTop($('#productList').offset().top - 50)
		specialId == 0 ? getProductList() : getProductListSpecial(specialId)
	})

	// 页面滚动事件
	$(window).on('scroll', function () {
		let scrollTop = $(this).scrollTop()
		let wHeight = $(this).height()
		let dHeight =$(document).height() - 300
		
		// 滚动到底部
		if (scrollTop + wHeight > dHeight) {
			specialId == 0 ? getProductList() : getProductListSpecial(specialId)
			isLoading = true
		}
	})

})