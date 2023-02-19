let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]

let pageNum = 1
let isLoading = false		//判断瀑布流是否加载中

pageStatistics() 			// 页面统计
getUserInfo(sourcePlatform)	// 获取用户信息

// 获取 首页 数据
getIndexInfo()
function getIndexInfo() {
	http('GET', `/mallv2/h5/getscore/index`).then((res) => {
		let firstProductList = res.data.firstProductList
		let secondProductList = res.data.secondProductList
		// 列表
		let html = ''
		$.each(secondProductList, (index, item) => {
			// 无库存去掉链接
			let oDiv = ''
			if (item.stock == 0) {
				oDiv = `<div class="product-item-coupon">`
			} else {
				oDiv = `<div class="product-item-coupon" onclick="window.open('../productDetail/fanproductDetail.html?productId=${item.id}', '_self')">`
			}
			html += `${oDiv}
						<img class="img" src="${item.productImg}">
						${item.stock == 0 ? '<img class="end-img" src="https://img.quanminyanxuan.com/other/1b5eb188ec434ea9aa56a2e27f49dd3b.png" >' : ''}
						<div class="product-info">
							<div class="name">${item.productName}</div>
							<div class="label">
								<i class="label1">会员专享</i>
								<i class="label2">全额返积分</i>
							</div>
							<p class="o-price">价格￥${item.originalPrice}</p>
							<div class="bottom">
								<div class="l">
									<div class="jf">下单立返${parseInt(item.price * 10)}积分</div>
									<div class="pr">会员价￥<span class="num">${item.price}</span></div>
								</div>
								<div class="r">折合0元</div>
							</div>
						</div>
					</div>`
		})
		$('#productList').append(html)
	}, err => {
		console.log(err)
	})
}

// 获取 商品列表(第二页开始)
// getProductList()
function getProductList() {
	if (isLoading) return
	isLoading = true
	http('GET', `/mallv2/subjectsController/getProducts`, {
		id: 524,
		pageSize: 20,
		pageNum,
	}).then((res) => {
		isLoading = false
		let productList = res.data.list
		// console.log('瀑:', productList)
		if (productList.length == 0) isLoading = true
		pageNum ++
		
		let html = ''
		$.each(productList, (index, item) => {
			// 无库存去掉链接
			let oDiv = ''
			if (item.stock == 0) {
				oDiv = `<div class="product-item-coupon">`
			} else {
				oDiv = `<div class="product-item-coupon" onclick="window.open('../productDetail/fanproductDetail.html?productId=${item.id}', '_self')">`
			}
			html += `${oDiv}
						<img class="img" src="${item.productImg}">
						${item.stock == 0 ? '<img class="end-img" src="https://img.quanminyanxuan.com/other/1b5eb188ec434ea9aa56a2e27f49dd3b.png" >' : ''}
						<div class="product-info">
							<div class="name">${item.productName}</div>
							<div class="label">
								<i class="label1">会员专享</i>
								<i class="label2">全额返积分</i>
							</div>
							<p class="o-price">价格￥${item.originalPrice}</p>
							<div class="bottom">
								<div class="l">
									<div class="jf">下单立返${parseInt(item.price * 10)}积分</div>
									<div class="pr">会员价￥<span class="num">${item.price}</span></div>
								</div>
								<div class="r">折合0元</div>
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

// 返回拦截
let backFlag = false	// 解决bug：进详情页后返回到当前页触发拦截事件

// 页面载入时使用pushState插入一条历史记录
history.pushState(null, null, '#' )
window.addEventListener('popstate', function(event) {
    // 点击回退时再向历史记录插入一条，以便阻止下一次点击回退
    // history.pushState(null, null, '#' )
	if (backFlag) window.location.href = '../integralCenter/gainScore.html'
})

// 进入页面
$(window).on('pageshow', function(){
	setTimeout(function(){
		backFlag = true
	}, 500)
})
// 离开页面
$(window).on('pagehide', function(){
	backFlag = false
})
