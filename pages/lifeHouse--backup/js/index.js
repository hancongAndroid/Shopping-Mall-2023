let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]

let pageNum = 2
let isLoading = false		//判断瀑布流是否加载中

timer()						// 倒计时
pageStatistics() 			// 页面统计
getUserInfo(sourcePlatform)	// 获取用户信息

// 获取 所有商品列表 数据
getAllProductList()
function getAllProductList() {
	http('GET', `/mallv2/h5/livingcenter/index`).then((res) => {
		let hotProductList = res.data.hotProductList
		let seckillProductList = res.data.seckillProductList
		let nineProductList = res.data.nineProductList
		let cartData = getCartDataFromLocal()	// 获取购物车数据
		console.log('商品:', res.data)
		
		// 超值专区
		let hotHtml = ''
		$.each(hotProductList, (index, item) => {
			if (index > 3) return false
			hotHtml += `<div class="header-nine-item">
							<img class="cover" src="${item.productImg}">
							<div class="price">￥${item.price}</div>
						</div>`
		})
		$('#hotProductList').html(hotHtml)
		
		// 限时秒杀
		let seckillHtml = ''
		$.each(seckillProductList, (index, item) => {
			seckillHtml += `<div class="scroll-item" onclick="window.open('../productDetail/livingProductDetail.html?productId=${item.id}', '_self')">
								<img class="cover" src="${item.productImg}">
								<div class="limit">限量50件</div>
								<div class="price">￥${item.price}</div>
							</div>`
		})
		$('#seckillProductList').html(seckillHtml)
		
		// 分页列表第一页
		let nineHtml = ''
		$.each(nineProductList, (index, item) => {
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
			nineHtml += `<div class="product-item">
					${oDiv}
					<div class="product-info">
						<div class="name">
							<img class="icon" src="https://img.quanminyanxuan.com/other/88e8f616266b49fcb938dd77fe28d6c6.png">
							南极人羊绒大衣女双面呢羊款毛料大衣南极人羊绒大衣女双面呢羊款毛料大衣
						</div>
						<div class="user-box">
							<div class="user-head">
								<img class="img" src="https://img.quanminyanxuan.com/service/cca62d9e86a047208cba910371b59d64.jpg" >
								<img class="img" src="https://img.quanminyanxuan.com/service/cca62d9e86a047208cba910371b59d64.jpg" >
								<img class="img" src="https://img.quanminyanxuan.com/service/cca62d9e86a047208cba910371b59d64.jpg" >
							</div>
							<div class="user-txt">深圳3950人买过</div>
						</div>
						<div class="label">全网底价</div>
						<div class="bottom">
							<div class="price">￥<span class="num">9.9</span><span class="o-price">￥14.9</span></div>
							${oBtn}
						</div>
					</div>
				</div>`
		})
		$('#nineProductList').html(nineHtml)
	}, err => {
		console.log(err)
	})
}

// 获取 分页列表 追加到第一页
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
		console.log('商品第二页:', productList)
		if (productList.length == 0) isLoading = true
		pageNum ++
		
		let nineHtml = ''
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
			nineHtml += `<div class="product-item">
					${oDiv}
					<div class="product-info">
						<div class="name">
							<img class="icon" src="https://img.quanminyanxuan.com/other/88e8f616266b49fcb938dd77fe28d6c6.png">
							南极人羊绒大衣女双面呢羊款毛料大衣南极人羊绒大衣女双面呢羊款毛料大衣
						</div>
						<div class="user-box">
							<div class="user-head">
								<img class="img" src="https://img.quanminyanxuan.com/service/cca62d9e86a047208cba910371b59d64.jpg" >
								<img class="img" src="https://img.quanminyanxuan.com/service/cca62d9e86a047208cba910371b59d64.jpg" >
								<img class="img" src="https://img.quanminyanxuan.com/service/cca62d9e86a047208cba910371b59d64.jpg" >
							</div>
							<div class="user-txt">深圳3950人买过</div>
						</div>
						<div class="label">全网底价</div>
						<div class="bottom">
							<div class="price">￥<span class="num">9.9</span><span class="o-price">￥14.9</span></div>
							${oBtn}
						</div>
					</div>
				</div>`
		})
		$('#nineProductList').append(nineHtml)
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