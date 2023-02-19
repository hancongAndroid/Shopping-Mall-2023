let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]

let pageNum = 1
let isLoading = false		// 判断瀑布流是否加载中

timer()						// 倒计时

// 商品列表
getProductInfo()
function getProductInfo() {
	if (isLoading) return
	isLoading = true
	http('GET', `/mallv2/h5/activity/queryListByPage`, {
		columnId: 201,
		pageNum,
		pageSize: 20,
		flag: 1,
		activityType: 'CASH_SCORE'
	}).then((res) => {
		isLoading = false
		let productList = res.data
		if (productList.length == 0) isLoading = true
		pageNum ++
		
		// 数据渲染
		let html = ''
		$.each(productList, (index, item) => {
			// 无库存去掉链接
			let oDiv = ''
			if (item.stock == 0) {
				oDiv = `<div class="product-item-ranking">`
			} else {
				oDiv = `<div class="product-item-ranking" onclick="window.open('../productDetail/productDetail.html?productId=${item.id}', '_self')">`
			}
			html += `${oDiv}
					<img class="cover-img" src="${item.productImg}">
					${item.stock == 0 ? '<img class="end-img" src="https://img.quanminyanxuan.com/other/1b5eb188ec434ea9aa56a2e27f49dd3b.png">' : ''}
					<div class="product-info">
						<div class="name">${item.productName}</div>
						<div class="sell-ratio">新品上新 · 限时限量</div>
						<div class="bottom">
							<p class="o-price">价格￥${item.originalPrice}</p>
							<div class="price-wrap">
								<!-- <img class="product-img" src="https://img.quanminyanxuan.com/other/ff05a615b1464d6e8165fd1b5eb37b6a.png"> -->
								<span class="product-card">${item.activityMax}积分</span>
								<span class="product-yuan">+${item.price}元</span>
							</div>
						</div>
					</div>
					<div class="btn-go">
						<span class="txt">去兑换</span>
						<img class="icon" src="https://img.quanminyanxuan.com/other/ed9b94bac34b4809b235dc528fe2d273.png" >
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
			getProductInfo()
		}
	})
	
})