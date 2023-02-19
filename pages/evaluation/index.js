let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]

let pageNum = 1
let specialId = null
let isLoading = false		//判断瀑布流是否加载中
let filterIndex = 0			//导航索引
let navList = [{
	title: '推荐',
	type: 1,
	id: 0
}]

pageStatistics() 			// 页面统计
getUserInfo(sourcePlatform)	// 获取用户信息

// 获取 导航
getNavigationList()
function getNavigationList() {
	http('GET', `/mallv2/evaluation/specialMallColumn`).then((res) => {
		let { data } = res
		navList.push(...data)
		let html = ''
		$.each(navList, (index, item) => {
			html += `<div class="scroll-view-item ${index == 0 ? 'active' : ''}" data-id=${item.id}><div>${item.title}</div></div>`
		})
		$('#navList').html(html)
	}, err => {
		console.log(err)
	})
}

// 获取 商品列表（推荐） 数据
getProductListOne()
function getProductListOne() {
	if (isLoading) return
	isLoading = true
	http('GET', `/mallv2/evaluation/queryEvaluationProductList`, {
		pageNum,
		pageSize: 20,
		soldOut: 0
	}).then((res) => {
		isLoading = false
		let productList = []
		if (res.code == 200) {
			productList = res.data
			// console.log('商品:', productList)
			if (productList.length == 0) isLoading = true
		} else {
			layer.open({
				content: res.message,
				skin: 'msg',
				time: 1
			})
			isLoading = true
			return
		}
		pageNum ++
		let html = ''
		let html2 = ''
		$.each(productList, (index, item) => {
			// 无库存去掉链接
			let oDiv = ''
			if (item.stock == 0) {
				oDiv = `<div class="product-item-eva">`
			} else {
				oDiv = `<div class="product-item-eva" onclick="window.open('./appraisalDetail.html?productId=${item.id}', '_self')">`
			}
			if (index % 2 == 0) {
				html += `${oDiv}
							<div class="product-cover">
								<img class="cover-img" src="${item.productImg}" >
								${item.stock == 0 ? '<img class="end-img" src="https://img.quanminyanxuan.com/other/1b5eb188ec434ea9aa56a2e27f49dd3b.png" >' : ''}
							</div>
							<div class="product-info">
								<div class="top-box">${filterVolume(item.volumeStr)}人已申请</div>
								<div class="name">${item.longTitle}</div>
								<div class="middle-box">
									<img class="middle-img" src="${item.logo}" >
									<span class="middle-txt">${item.title}</span>
								</div>
								<div class="bottom-box">
									<div class="bottom-left">${item.stock == 0 ? '已抢光' : '0元试用'}</div>
									<div class="bottom-right">仅剩<span class="num">${filterStock(item.virtualStock)}</span>件</div>
								</div>
							</div>
						</div>`
			} else {
				html2 += `${oDiv}
							<div class="product-cover">
								<img class="cover-img" src="${item.productImg}" >
								${item.stock == 0 ? '<img class="end-img" src="https://img.quanminyanxuan.com/other/1b5eb188ec434ea9aa56a2e27f49dd3b.png" >' : ''}
							</div>
							<div class="product-info">
								<div class="top-box">${filterVolume(item.volumeStr)}人已申请</div>
								<div class="name">${item.longTitle}</div>
								<div class="middle-box">
									<img class="middle-img" src="${item.logo}" >
									<span class="middle-txt">${item.title}</span>
								</div>
								<div class="bottom-box">
									<div class="bottom-left">${item.stock == 0 ? '已抢光' : '0元试用'}</div>
									<div class="bottom-right">仅剩<span class="num">${filterStock(item.virtualStock)}</span>件</div>
								</div>
							</div>
						</div>`
			}
		})
		$('#productListLeft').append(html)
		$('#productListRight').append(html2)
	}, err => {
		console.log(err)
	})
}

// 获取 商品列表（分类） 数据
function getProductListAll() {
	if (isLoading) return
	isLoading = true
	http('GET', `/mallv2/evaluation/zeroProduct`, {
		specialId,
		pageNum,
		pageSize: 20,
		soldOut: 0
	}).then((res) => {
		isLoading = false
		let productList = []
		if (res.code == 200) {
			productList = res.data
			// console.log('分类:', productList)
			if (productList.length == 0) isLoading = true
		} else {
			layer.open({
				content: res.message,
				skin: 'msg',
				time: 1
			})
			isLoading = true
			return
		}
		pageNum ++
		let html = ''
		let html2 = ''
		$.each(productList, (index, item) => {
			// 无库存去掉链接
			let oDiv = ''
			if (item.stock == 0) {
				oDiv = `<div class="product-item-eva">`
			} else {
				oDiv = `<div class="product-item-eva" onclick="window.open('./appraisalDetail.html?productId=${item.id}', '_self')">`
			}
			if (index % 2 == 0) {
				html += `${oDiv}
							<div class="product-cover">
								<img class="cover-img" src="${item.productImg}" >
								${item.stock == 0 ? '<img class="end-img" src="https://img.quanminyanxuan.com/other/1b5eb188ec434ea9aa56a2e27f49dd3b.png" >' : ''}
							</div>
							<div class="product-info">
								<div class="top-box">${filterVolume(item.volumeStr)}人已申请</div>
								<div class="name">${item.longTitle}</div>
								<div class="middle-box">
									<img class="middle-img" src="${item.logo}" >
									<span class="middle-txt">${item.title}</span>
								</div>
								<div class="bottom-box">
									<div class="bottom-left">${item.stock == 0 ? '已抢光' : '0元试用'}</div>
									<div class="bottom-right">仅剩<span class="num">${filterStock(item.virtualStock)}</span>件</div>
								</div>
							</div>
						</div>`
			} else {
				html2 += `${oDiv}
							<div class="product-cover">
								<img class="cover-img" src="${item.productImg}" >
								${item.stock == 0 ? '<img class="end-img" src="https://img.quanminyanxuan.com/other/1b5eb188ec434ea9aa56a2e27f49dd3b.png" >' : ''}
							</div>
							<div class="product-info">
								<div class="top-box">${filterVolume(item.volumeStr)}人已申请</div>
								<div class="name">${item.longTitle}</div>
								<div class="middle-box">
									<img class="middle-img" src="${item.logo}" >
									<span class="middle-txt">${item.title}</span>
								</div>
								<div class="bottom-box">
									<div class="bottom-left">${item.stock == 0 ? '已抢光' : '0元试用'}</div>
									<div class="bottom-right">仅剩<span class="num">${filterStock(item.virtualStock)}</span>件</div>
								</div>
							</div>
						</div>`
			}
		})
		$('#productListLeft').append(html)
		$('#productListRight').append(html2)
	}, err => {
		console.log(err)
	})
}

// 部分dom操作
$(function () {
	
	// 选项卡切换商品列表
	$(document).on('click', '.scroll-view-item', function() {
		clikStatistics('nav')
		$(this).addClass('active').siblings().removeClass('active')
		specialId = $(this).data('id')
		// 请求商品数据
		let index = $(this).index()
		if (index == filterIndex) return
		let productListTop = $('.product-list').offset().top -56
		$('html, body').scrollTop(productListTop)
		$('#productListLeft').html('')
		$('#productListRight').html('')
		pageNum = 1
		isLoading = false
		filterIndex = index
		filterIndex == 0 ? getProductListOne() : getProductListAll()
	})
	
	// 页面滚动事件
	$(window).on('scroll', function () {
		let scrollTop = $(this).scrollTop()
		let wHeight = $(this).height()
		let dHeight =$(document).height() - 300
		
		// 滚动到底部
		if (scrollTop + wHeight > dHeight) {
			filterIndex == 0 ? getProductListOne() : getProductListAll()
			isLoading = true
		}
	})

})