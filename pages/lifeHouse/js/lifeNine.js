let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]

let pageNum = 1
let isLoading = false		//判断瀑布流是否加载中
let headImgArr = []			//用户头像

// 第一次进页面商品不随机
let flag = 1
let firstIntoLifeNine = localStorage.getItem('firstIntoLifeNine')
if (!firstIntoLifeNine) {
	localStorage.setItem('firstIntoLifeNine', 1)
	flag = 0
}

pageStatistics() 			// 页面统计
getUserInfo(sourcePlatform)	// 获取用户信息

// 获取 今日爆款 数据
getHotProductList()
function getHotProductList() {
	http('GET', `/mallv2/subjectsController/getActivitiesGoods`, {
		activeType: 'TODAY_HOT',
		id: 51
	}).then((res) => {
		let hotProductList = res.data
		let html = ''
		$.each(hotProductList, (index, item) => {
			html += `<div class="scroll-item" onclick="window.open('../productDetail/livingProductDetail.html?productId=${item.id}', '_self')">
						<img class="cover" src="${item.productImg}">
						<i class="label">低价</i>
						<div class="name">${item.productName}</div>
						<div class="limit">
							<span class="r">￥<span class="num">${item.price}</span></span>
							<span class="l">抢</span>
						</div>
					</div>`
		})
		$('#hotProductList').html(html)
		
	}, err => {
		console.log(err)
	})
}

// 获取 商品列表
function getProductList() {
	if (isLoading) return
	isLoading = true
	http('GET', `/mallv2/subjectsController/getProducts`, {
		pageNum,
		pageSize: 10,
		id: 99
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
				oDiv = `<div class="product-item product-item-click" data-id=${item.id}>`
			}
			// 用户头像
			let oImg = ''
			for (let i = 0; i < 3; i++) {
				oImg += `<img class="img" src="${headImgArr[parseInt(Math.random()*headImgArr.length,10)]}" >`
			}
			
			html += `${oDiv}
						<img class="cover-img" src="${item.productImg}" >
						${item.stock == 0 ? '<img class="end-img" src="https://img.quanminyanxuan.com/other/1b5eb188ec434ea9aa56a2e27f49dd3b.png">' : ''}
						<div class="product-info">
							<div class="name">
								<!--<img class="icon" src="https://img.quanminyanxuan.com/other/88e8f616266b49fcb938dd77fe28d6c6.png">-->
								<span>${item.productName}</span>
							</div>
							<div class="user-box">
								<div class="user-head">
									${oImg}
								</div>
								<div class="user-txt">已有${filterVolume(item.volume)}人买过</div>
							</div>
							<div class="label">限购2件</div>
							<div class="bottom">
								<div class="price">￥<span class="num">${item.price}</span><span class="o-price">￥${item.originalPrice}</span></div>
								<div class="btn-add-o">去抢购</div>
							</div>
						</div>
					</div>`
		})
		$('#productList').append(html)
	}, err => {
		console.log(err)
	})
}

// 获取 用户列表 数据
getFakeUsers()
function getFakeUsers() {
	http('GET', `/mallv2/common/getFakeUsers`, {
		number: 100
	}).then((res) => {
		let fakeUsers = res.data
		// console.log('用户:', fakeUsers)
		let user = ''
		$.each(fakeUsers, (index, item) => {
			headImgArr.push(item.headImg)
		})
		getProductList()
	}, err => {
		console.log(err)
	})
}

// 部分dom操作
$(function () {
	
	// 跳转详情页
	$(document).on('click', '.product-item-click', function () {
		id = $(this).data('id')
		window.open('../productDetail/livingProductDetail.html?productId=' + id, '_self')
	})

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