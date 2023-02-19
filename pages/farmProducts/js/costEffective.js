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
	http('GET', `/mallv2/subjectsController/getProducts`, {
		id: 110,
		pageSize: 10,
		pageNum
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
				oDiv = `<div class="product-item" onclick="window.open('../productDetail/guessProductDetail.html?productId=${item.id}', '_self')">`
			}
			html += `${oDiv}
						<img class="cover-img" src="${item.productImg}" >
						${item.stock == 0 ? '<img class="end-img" src="https://img.quanminyanxuan.com/other/1b5eb188ec434ea9aa56a2e27f49dd3b.png">' : ''}
						<div class="product-info">
							<div class="name">${item.productName}</div>
							<div class="label-box">
								<i class="label">限购5件</i>
								<i class="label">特惠</i>
							</div>
							<div class="bottom">
								<p class="price2">￥${item.originalPrice}</p>
								<p class="price1">￥<span class="num">${item.price}</span></p>
								<span class="btn-buy">立即购买</span>
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