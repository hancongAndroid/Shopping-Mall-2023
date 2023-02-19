let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]
let pageNum = 1
let flag = 1
let isLoading = false		//判断瀑布流是否加载中
// timer()						// 倒计时
pageStatistics() 			// 页面统计
getUserInfo(sourcePlatform)	// 获取用户信息

let oldsort = localStorage.getItem('oldsort')
if (oldsort == null) {
	localStorage.setItem('oldsort', 1)
	oldsort = 0
}

// 获取 特价兑换
getActiveData()
function getActiveData() {
	http('GET',`/mallv2/activity/getH5ScoreListByType`).then((res) => {
		let data = res.data.h5ScorePageResponse.cashScoreColumnMap
		let seniorityList = data.CHANGE_SENIORITY	//兑换排行
		// 兑换排行
		let html = ''
		$.each(seniorityList, (i, n) => {
			html += `<div class="shopping-card-item">
						<img class="img" src="${n.productImg}" >
						<p class="btn">立即兑换</p>
					</div>`
		})
		$('#seniorityList').html(html)
	}, err => {
		console.log(err)
	})
}

// 获取 家电专场
getAppliancesProductList()
function getAppliancesProductList() {
	http('GET', `/mallv2/h5/oldfornew/queryOldForNewListByPage`, {
		columnId: 2,
		pageNum: 1,
		pageSize: 5,
		sort: oldsort
	}).then((res) => {
		let productList = res.data
		console.log('家电专场', productList)
		let html = ''
		$.each(productList, (index, item) => {
			html += `<div class="appliances-module-item" onclick="window.open('../../productDetailH5/elevenProductDetail.html?productId=${item.id}', '_self')">
					<img class="product-cover" src="${item.productImg}" >
					<div class="product-info">
						<p class="name">${item.productName}</p>
						<div class="price-box">补贴${item.activityMax}元</div>
					</div>
					<i class="label">轻松换家电</i>
				</div>`
		})
		$('#appliancesModuleList').append(html)
	}, err => {
		console.log(err)
	})
}

// 获取 品牌特卖
getBrandSaleProductList()
function getBrandSaleProductList() {
	http('GET', `/mallv2/subjectsController/getProducts`, {
		id: 104,
		pageSize: 5,
		pageNum: 1,
		sort: oldsort
	}).then((res) => {
		let productList = res.data.list
		console.log('品牌特卖', productList)
		let html = ''
		$.each(productList, (index, item) => {
			html += `<div class="appliances-module-item" onclick="window.open('../../productDetail/brandSaleProductDetail.html?productId=${item.id}', '_self')">
					<img class="product-cover" src="${item.productImg}" >
					<div class="product-info">
						<p class="name">${item.productName}</p>
						<div class="price-box">特卖价${item.price}元</div>
					</div>
					<i class="label">大牌狂欢</i>
				</div>`
		})
		$('#brandSaleModuleList').append(html)
	}, err => {
		console.log(err)
	})
}

// 获取 特卖商品
getXSBTProductList()
function getXSBTProductList() {
	http('GET', `/mallv2/h5/membersale/queryListByPage`, {
		columnId: 0,
		pageSize: 100,
		pageNum: 1,
		flag: 1
	}).then((res) => {
		let productList = res.data
		let html = ''
		$.each(productList, (index, item) => {
			// 无库存去掉链接
			let oDiv = ''
			if (item.stock == 0) {
				oDiv = `<div class="product-list-item">`
			} else {
				oDiv = `<div class="product-list-item" onclick="window.open('../../productDetail/seckillProductDetail.html?productId=${item.id}', '_self')">`
			}
			html += `${oDiv}
						<div class="product-cover">
							<img class="cover-img" src="${item.productImg}" >
							${item.stock == 0 ? '<img class="end-img" src="https://img.quanminyanxuan.com/other/1b5eb188ec434ea9aa56a2e27f49dd3b.png" >' : ''}
						</div>
						<div class="product-info">
							<div class="product-name">${item.productName}</div>
							<div class="product-bottom">
								<img class="top-icon" src="https://img.quanminyanxuan.com/other/3626205d8ab6434db9ddd9bd8081f7bc.png" >
								<div class="price">
									<span>￥<span class="num">${item.price}</span></span>
									<span class="oprice">￥${item.originalPrice}</span>
								</div>
								<div class="btn-box">
									<div class="btn-box-t">去抢购</div>
									<div class="btn-box-b">已抢${filterVolume(item.volumeStr)}件</div>
								</div>
							</div>
						</div>
					</div>`
		})
		$('#zxbtProduct').append(html)
	}, err => {
		console.log(err)
	})
}

// 获取 积分
getCNXHProductList()
function getCNXHProductList() {
	if (isLoading) return
	isLoading = true
	http('GET', `/mallv2/h5/oldfornew/queryOldForNewListByPage`, {
		columnId: 110,
		pageNum,
		pageSize: 100,
		sort: oldsort
	}).then((res) => {
		isLoading = false
		let productList = res.data
		console.log('积分:', productList)
		if (productList.length == 0) isLoading = true
		pageNum ++
		let html = ''
		$.each(productList, (i, n) => {
			// 0元积分取 activityMin
			let oText = ''
			if(n.pricte == 0) {
				oText = `<div class="product-text">${n.activityMin}</div>`
			} else {
				oText = `<div class="product-text">${n.activityMax}</div>`
			}
			// 无库存去掉链接
			let oDiv = ''
			if (n.stock == 0) {
				oDiv = `<div class="item-box">`
			} else {
				oDiv = `<div class="item-box" onclick="window.open('../../productDetail/productDetail.html?productId=${n.id}', '_self')">`
			}
			html += `${oDiv}
						<div class="product-img pr">
							<img class="cover-img" src="${n.productImg}" />
							${n.stock == 0 ? '<div class="activity-end"><img src="https://img.quanminyanxuan.com/service/680fec36c9274a238df7560575911c1c.png" /></div>' : ''}
						</div>
						<div class="product-info">
							<div class="product-name">${n.productName}</div>
							<div class="product-price">
								<div>
									<img class="price-icon" src="https://img.quanminyanxuan.com/other/36a5f27b0d004d5090a14f42449cf22f.png" />
								</div>
								${oText}
								<span class="product-card">积分</span>
								<div class="price-yuan">+${n.price}元</div>
							</div>
							<div class="product-purchase">
								<div class="purchase-left">价格￥${n.originalPrice}</div>
								<div class="purchase-right">仅剩<span class="num">${filterStock(n.virtualStock)}</span>件
								</div>
							</div>
						</div>
					</div>`
		})
		$('#cnxhProduct').append(html)
	}, err => {
		console.log(err)
	})
}

// 获取 瀑布流商品 数据
getColumnProductList()
function getColumnProductList() {
	http('GET', `/mallv2/h5/oldfornew/queryOldForNewListByPage`,{
		columnId: 0,
		pageNum: 1,
		pageSize: 100
	}).then((res) => {
		let productList = res.data
		// 消费补贴
		productListShow(productList, $('#ppbtProduct'))
	}, err => {
		console.log(err)
	})
}

// 倒计时
;(function timer() {
	let hour = ''
	let minute = ''
	let second = ''
	let minutes = ''
	let hour1 = ''
	let minute1 = ''
	let second1 = ''
	let minutes1 = ''
	let tmpTime = `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`
	
	// 记录三天后的时间
	let endTime
	if (localStorage.getItem('endTimeOldOfNew') == null) {
		endTime = new Date(tmpTime).getTime() + 24 * 60 * 60 * 1000 - 1
		localStorage.setItem('endTimeOldOfNew', endTime)
	} else {
		endTime = localStorage.getItem('endTimeOldOfNew')
	}
	
	let countClock = setInterval(() => {
		var nowTime = new Date()
		var nMS = Math.abs(endTime - nowTime.getTime())
		// 三天到期再追加三天
		if (nMS <= 0) {
			endTime = new Date(tmpTime).getTime() + 24 * 60 * 60 * 1000 - 1
			localStorage.setItem('endTimeOldOfNew', endTime)
		}
		var myD = Math.floor(nMS / (1000 * 60 * 60 * 24))
		// var myH = Math.floor(nMS / (1000 * 60 * 60)) % 24
		var myH = Math.floor(nMS / (1000 * 60 * 60))
		var myM = Math.floor(nMS / (1000 * 60)) % 60
		var myS = Math.floor(nMS / 1000) % 60
		var myMS = Math.floor(nMS / 100) % 10
		if (myD >= 0) {
		  if (myH <= 9) myH = '0' + myH
		  if (myM <= 9) myM = '0' + myM
		  if (myS <= 9) myS = '0' + myS
		  if (myMS <= 9) myMS = myMS

		  hour = myH
		  minute = myM
		  second = myS
		  minutes = myMS
		  hour1 = myH
		  minute1 = myM
		  second1 = myS
		  minutes1 = myMS
		} else {
		  hour = '00'
		  minute = '00'
		  second = '00'
		  minutes = '0'
		  hour1 = '00'
		  minute1 = '00'
		  second1 = '00'
		  minutes1 = '0'
		}
		$('#hour').text(hour)
		$('#minute').text(minute)
		$('#second').text(second)
		$('#minutes').text(minutes)
		$('#hour1').text(hour)
		$('#minute1').text(minute1)
		$('#second1').text(second1)
		$('#minutes1').text(minutes1)
	}, 100)
})()

// 部分dom操作
$(function () {
	
	// 选项卡切换商品列表
	$('#tabtxBox').on('click', '.scroll-view-item', function() {
		isLoading = true
		$(this).addClass('active').siblings().removeClass('active')
		let tabtxWrapTop = $('#tabtxWrap').offset().top - 20
		$('html, body').scrollTop(tabtxWrapTop)
		// $(this).parents('.tabtx').addClass('fixed')
		$('.product-column').removeClass('dn')
		
		// 跳到对应商品列表
		let productBoxTop = $('.product-box-scroll').eq($(this).index()).offset().top
		$('html, body').scrollTop(productBoxTop-40)
		setTimeout(function() {
			isLoading = false
		}, 500)
	})
	
	// 页面滚动事件
	$(window).on('scroll', function () {
		let scrollTop = $(this).scrollTop()
		let wHeight = $(this).height()
		let dHeight =$(document).height() - 300
		
		// 滚动商品列表，相应的选项卡选中
		$('.product-box-scroll').each(function (i, e) {
			let productBoxTop = $('.product-box-scroll').eq(i+1).offset().top - 120
			if (productBoxTop > scrollTop) {
				$('.tab-item').eq(i).addClass('active').siblings().removeClass('active')
				return false
			}
		})
		
		// 滚动到底部
		if (scrollTop + wHeight > dHeight) {
			getCNXHProductList()
			isLoading = true
		}
	})
	
})