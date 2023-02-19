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
		columnId: 86,
		pageSize: 10,
		pageNum,
		flag: 0
	}).then((res) => {
		isLoading = false
		let productList = res.data
		let cartData = getCartDataFromLocal()	// 获取购物车数据
		// console.log('商品:', productList)
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
			if (item.stock == 0) {
				oDiv = `<div class="product-cover">`
			} else {
				oDiv = `<div class="product-cover" onclick="window.open('../productDetail/livingProductDetail.html?productId=${item.id}', '_self')">`
			}
			html += `<div class="product-item">
						${oDiv}
							<img class="img" src="${item.productImg}">
							${item.stock == 0 ? '<img class="end-img" src="https://img.quanminyanxuan.com/other/1b5eb188ec434ea9aa56a2e27f49dd3b.png">' : ''}
						</div>
						<div class="product-info">
							<div class="name">${item.productName}</div>
							<div class="bottom">
								<div class="price">
									<div class="price1">￥${item.originalPrice}</div>
									<div class="price2">￥<span class="num">${item.price}</span></div>
								</div>
								<div class="btn-add-o ${isHas ? 'dn' : ''}" data-id=${item.id}>加入购物车</div>
								<div class="btn-group ${isHas ? '' : 'dn'}">
									<i class="btn-cut btnChangeExt" data-id=${item.id} data-type='cut'>-</i>
									<span class="num">${counts}</span>
									<i class="btn-add btnChangeExt" data-id=${item.id} data-type='add'>+</i>
								</div>
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