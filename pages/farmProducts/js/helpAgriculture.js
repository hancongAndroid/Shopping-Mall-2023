let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]

let pageNum = 1
let isLoading = false		//判断瀑布流是否加载中

pageStatistics() 			// 页面统计
getUserInfo(sourcePlatform)	// 获取用户信息

// 获取 推荐商品
getRecommendList()
function getRecommendList() {
	http('GET', `/mallv2/subjectsController/getSubjectsInfo/60`).then((res) => {
		let data = res.data.subjectPlateDtos[0].productSubjectPlateList
		let html = ''
		$.each(data, (index, item) => {
			if (index % 2) {
				html += `<div class="p-item" onclick="window.open('../productDetail/guessProductDetail.html?productId=${item.id}', '_self')">
						<div class="p-info">
							<div class="name">${item.productName}</div>
							<p class="desc">${item.productStory}</p>
							<div class="bottom">
								<div class="label">爱心助农<img class="icon" src="https://img.quanminyanxuan.com/other/794b572607a44401b8f880c73951a7e3.png"></div>
								<div class="price">爱心价<i class="sign">￥</i><span class="num">${item.price}</span></div>
							</div>
						</div>
						<img class="img" src="${item.productImg}" >
					</div>`
			} else {
				html += `<div class="p-item" onclick="window.open('../productDetail/guessProductDetail.html?productId=${item.id}', '_self')">
							<img class="img" src="${item.productImg}" >
							<div class="p-info">
								<div class="name">${item.productName}</div>
								<p class="desc">${item.productStory}</p>
								<div class="bottom">
									<div class="label">爱心助农<img class="icon" src="https://img.quanminyanxuan.com/other/794b572607a44401b8f880c73951a7e3.png"></div>
									<div class="price">爱心价<i class="sign">￥</i><span class="num">${item.price}</span></div>
								</div>
							</div>
						</div>`
			}
		})
		$('#recommendList').html(html)
		
	}, err => {
		console.log(err)
	})
}

// 获取 商品列表 数据
getProductList()
function getProductList() {
	if (isLoading) return
	isLoading = true
	http('GET', `/mallv2/subjectsController/getProducts`, {
		id: 112,
		pageSize: 10,
		pageNum
	}).then((res) => {
		isLoading = false
		let productList = res.data.list
		// console.log('商品:', productList)
		if (productList.length == 0) isLoading = true
		pageNum ++
		
		// 商品数据渲染
		productListFarm(productList, $('#productList'))
	}, err => {
		console.log(err)
	})
}

// 获取 用户列表 数据
getFakeUsers()
function getFakeUsers() {
	http('GET', `/mallv2/common/getFakeUsers`, {
		number: 20
	}).then((res) => {
		let fakeUsers = res.data
		// console.log('用户:', fakeUsers)
		let user = ''
		$.each(fakeUsers, (index, item) => {
			user += `<div class="user-scroll">
						<img class="user-header" src="${item.headImg}">
						<span class="sale-desc">${item.nickname}刚刚为民助农下了单</span>
					</div>`
		})
		$('#timeUser').html(user);
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