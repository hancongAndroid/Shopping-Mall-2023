let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]

let pageNum = 1
let isLoading = false		//判断瀑布流是否加载中
let name = getUrlKey('name')
$('#searchIpt').val(name)

pageStatistics() 			// 页面统计
getUserInfo(sourcePlatform)	// 获取用户信息

// 获取 搜索商品 数据
getsearchProductList()
function getsearchProductList() {
	if (isLoading) return
	isLoading = true
	http('GET', `/mallv2/evaluation/searchProductData`, {
		name,
		pageNum,
		pageSize: 20
	}).then((res) => {
		isLoading = false
		let productList = res.data
		if (productList.length == 0) isLoading = true
		pageNum ++
		let html = ''
		$.each(productList, (index, item) => {
			
			// 屏蔽0元商品
			if (item.price == 0) return true
			
			let oType = ''
			let oDiv = ''
			
			// 活动类型
			if (item.activityType == 'CASH_SCORE') {
				oType = `<i class="card-tips1">积分兑换</i>`
				// 无库存去掉链接
				if (item.stock == 0) {
					oDiv = `<div class="product-item-search">`
				} else {
					oDiv = `<div class="product-item-search" onclick="window.open('../productDetail/productDetail.html?productId=${item.id}', '_self')">`
				}
			}
			else if (item.activityType == 'OLD_FOR_NEW') {
				oType = `<i class="card-tips1">换新补贴</i>`
				// 无库存去掉链接
				if (item.stock == 0) {
					oDiv = `<div class="product-item-search">`
				} else {
					oDiv = `<div class="product-item-search" onclick="window.open('../productDetail/newsProductDetail.html?productId=${item.id}', '_self')">`
				}
			}
			else if (item.activityType == 'ZERO_EVALUATION') {
				oType = `<i class="card-tips1">0元测评</i>`
				// 无库存去掉链接
				if (item.stock == 0) {
					oDiv = `<div class="product-item-search">`
				} else {
					oDiv = `<div class="product-item-search" onclick="window.open('../evaluation/appraisalDetail.html?productId=${item.id}', '_self')">`
				}
			}
			else if (item.activityType == 'CASH_COUPON') {
				oType = `<i class="card-tips1">免费送神券</i>`
				// 无库存去掉链接
				if (item.stock == 0) {
					oDiv = `<div class="product-item-search">`
				} else {
					oDiv = `<div class="product-item-search" onclick="window.open('../productDetail/hbproductDetail.html?productId=${item.id}', '_self')">`
				}
			}
			else if (item.activityType == 'RECHARGE_COUPON') {
				oType = `<i class="card-tips1">购物返话费</i>`
				// 无库存去掉链接
				if (item.stock == 0) {
					oDiv = `<div class="product-item-search">`
				} else {
					oDiv = `<div class="product-item-search" onclick="window.open('../productDetail/callProductDetail.html?productId=${item.id}', '_self')">`
				}
			}
			else {
				oType = `<i class="card-tips2">严选精品</i>`
				// 无库存去掉链接
				if (item.stock == 0) {
					oDiv = `<div class="product-item-search">`
				} else {
					oDiv = `<div class="product-item-search" onclick="window.open('../productDetail/guessProductDetail.html?productId=${item.id}', '_self')">`
				}
			}
			html += `${oDiv}
						<div class="item-left">
							<img class="img" src="${item.productImg}?x-oss-process=image/resize,w_260,m_lfit" >
							${item.stock == 0 ? '<img class="end-img" src="https://img.quanminyanxuan.com/other/1b5eb188ec434ea9aa56a2e27f49dd3b.png" >' : ''}
						</div>
						<div class="item-right">
							<div class="name">${item.longTitle}</div>
							${oType}
							<div class="price">
								<span class="r-price">${item.price}</span>
								<span class="o-price">¥${item.originalPrice}</span>
							</div>
						</div>
					</div>`
		})
		$('#productList').append(html)
		// 没数据
		if ($('.product-item-search').length) {
			$('#dataNot').addClass('dn')
		} else {
			$('#dataNot').removeClass('dn')
		}
	}, err => {
		console.log(err)
	})
}

// 部分dom操作
$(function () {
	
	// 搜索
	$('#searchIpt').on('keypress', function(e) {
		$('#searchIpt').blur()
		let keycode = e.keyCode
		let searchName = $(this).val()
		if(keycode=='13') {
			e.preventDefault()
			if (name == searchName) return
			if (searchName.trim() == '') {
				$('#productList').html('')
				$('#dataNot').removeClass('dn')
				return
			}
			pageNum = 1
			isLoading = false
			$('#productList').html('')
			name = searchName
			getsearchProductList()
		}
	})
	
	// 清除input
	$('.clear-icon').on('click', function() {
		$('#searchIpt').val('')
		$('.clear-icon').addClass('dn')
	})
	
	// 监听input
	$('#searchIpt').on('input propertychange', function() {
		let searchName = $(this).val()
		if (searchName.trim() == '') {
			$('.clear-icon').addClass('dn')
		} else {
			$('.clear-icon').removeClass('dn')
		}
	})
	
	// input获取焦点
	$('#searchIpt').on('focus', function() {
		let searchName = $(this).val()
		if (searchName.trim() == '') {
			$('.clear-icon').addClass('dn')
		} else {
			$('.clear-icon').removeClass('dn')
		}
	})
	
	// 页面滚动事件
	$(window).on('scroll', function () {
		let scrollTop = $(this).scrollTop()
		let wHeight = $(this).height()
		let dHeight =$(document).height() - 300
		
		// 滚动到底部
		if (scrollTop + wHeight > dHeight) {
			getsearchProductList()
			isLoading = true
		}
	})

})
