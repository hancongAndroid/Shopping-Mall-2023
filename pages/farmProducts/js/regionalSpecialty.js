let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]

let pageNum = 1
let isLoading = false		//判断瀑布流是否加载中

pageStatistics() 			// 页面统计
getUserInfo(sourcePlatform)	// 获取用户信息

// 获取 推荐商品
getRecommendList()
function getRecommendList() {
	http('GET', `/mallv2/subjectsController/getSubjectsInfo/61`).then((res) => {
		let data = res.data.subjectPlateDtos[0].productSubjectPlateList
		let html = ''
		$.each(data, (index, item) => {
			if (index % 2) {
				html += `<div class="p-item" onclick="window.open('../productDetail/guessProductDetail.html?productId=${item.id}', '_self')">
							<div class="local-title">
								<img class="icon" src="https://img.quanminyanxuan.com/other/c3167a186162484cb3657986ba842b25.png" >
								<span class="txt">${item.slogan}</span>
							</div>
							<div class="p-info">
								<div class="name">${item.productName}</div>
								<p class="desc">${item.productStory}</p>
								<i class="line"></i>
								<div class="price"><i class="sign">￥</i><span class="num">${item.price}</span></div>
								<div class="btn-buy">
									<span class="txt">立即抢购</span>
									<img  class="icon" src="https://img.quanminyanxuan.com/other/69306d8953a54045a2f9332a78a2f679.png" >
								</div>
							</div>
							<img class="img" src="${item.productImg}" >
						</div>`
			} else {
				html += `<div class="p-item" onclick="window.open('../productDetail/guessProductDetail.html?productId=${item.id}', '_self')">
							<div class="local-title">
								<img class="icon" src="https://img.quanminyanxuan.com/other/c3167a186162484cb3657986ba842b25.png" >
								<span class="txt">${item.slogan}</span>
							</div>
							<img class="img" src="${item.productImg}" >
							<div class="p-info">
								<div class="name">${item.productName}</div>
								<p class="desc">${item.productStory}</p>
								<i class="line"></i>
								<div class="price"><i class="sign">￥</i><span class="num">${item.price}</span></div>
								<div class="btn-buy">
									<span class="txt">立即抢购</span>
									<img  class="icon" src="https://img.quanminyanxuan.com/other/69306d8953a54045a2f9332a78a2f679.png" >
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
		id: 114,
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