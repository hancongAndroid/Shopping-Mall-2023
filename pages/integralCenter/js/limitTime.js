let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]

let pageNum = 1
let isLoading = false		//判断瀑布流是否加载中

timer()						// 定时器
pageStatistics() 			// 页面统计
getUserInfo(sourcePlatform)	// 获取用户信息
// 广点通渠道统计
// gdt('track', 'VIEW_CONTENT', {});// 浏览

// 获取 列表商品
getProductInfo()
function getProductInfo() {
	if (isLoading) return
	isLoading = true
	http('GET', `/mallv2/h5/activity/queryListByPage`, {
		columnId: 195,
		pageNum,
		pageSize: 20,
		flag: 0,
		activityType: 'CASH_SCORE'
	}).then((res) => {
		isLoading = false
		let productList = res.data
		console.log('列表:', productList)
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
						<div class="sell-ratio">
							<div class="left">
								<div class="inner" style="width: ${Math.round(Math.random() * (90 - 60)) + 60}%">
									<img class="icon-hot" src="https://img.quanminyanxuan.com/other/8152e66da9fe4145a14eee4f8fde7996.png" >
								</div>
							</div>
							<div class="right">仅剩${filterStock(item.virtualStock)}件</div>
						</div>
						<div class="bottom">
							<p class="o-price">价格￥${item.originalPrice}</p>
							<div class="price-wrap">
								<!-- <img class="product-img" src="https://img.quanminyanxuan.com/other/ff05a615b1464d6e8165fd1b5eb37b6a.png"> -->
								<span class="product-text">￥${item.price}</span>
								<!--<span class="product-card">卡券</span>-->
								<!--<span class="product-yuan">+${item.price}元</span>-->
							</div>
						</div>
					</div>
					<div class="btn-go">
						<span class="txt">去兑换</span>
						<img class="icon" src="https://img.quanminyanxuan.com/other/ed9b94bac34b4809b235dc528fe2d273.png" >
					</div>
				</div>`
		})
		$('#rankingProductList').append(html)
	}, err => {
		console.log(err)
	})
}

// 时间格式化
formatDate()
function formatDate() {
	let date1 = new Date(new Date().getTime())
	let date2 = new Date(new Date().getTime() + 24 * 60 *60 * 1000)
	let MM1 = (date1.getMonth() + 1 < 10 ? '0' + (date1.getMonth() + 1) : date1.getMonth() + 1)
	let DD1 = (date1.getDate() < 10 ? '0' + (date1.getDate()) : date1.getDate())
	let MM2 = (date2.getMonth() + 1 < 10 ? '0' + (date2.getMonth() + 1) : date2.getMonth() + 1)
	let DD2 = (date2.getDate() < 10 ? '0' + (date2.getDate()) : date2.getDate())
	$('#date1').html(MM1 + '月' + DD1 + '日')
	$('#date2').html(MM2 + '月' + DD2 + '日')
}

// 部分dom操作
$(function () {
	
	// 选项卡切换商品列表
	// $('.product-header').on('click', '.time-item', function() {
	// 	$(this).addClass('active').siblings().removeClass('active')
	// 	$('#rankingProductList').html('')
	// 	pageNum = 1
	// 	isLoading = false
	// 	getProductInfo()
	// })
	
	// 页面滚动事件
	$(window).on('scroll', function () {
		let scrollTop = $(this).scrollTop()
		let wHeight = $(this).height()
		let dHeight =$(document).height() - 300
		
		// 滚动到底部
		if (scrollTop + wHeight > dHeight) {
			getProductInfo()
			isLoading = true
		}
	})
	
})