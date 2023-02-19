let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]
let pageNum = 1
let isLoading = false		//判断瀑布流是否加载中

// 商品随机标签 图标
let labelArr = [
	'https://img.quanminyanxuan.com/other/bcd5d3659d79448baa5c75d9833429b9.png',
	'https://img.quanminyanxuan.com/other/d095c9c4fa3f45c5be877879f7af3816.png',
	'https://img.quanminyanxuan.com/other/8699f20d3201474b910a2cc8a8d8d4ce.png',
	'https://img.quanminyanxuan.com/other/921cf8eaabbe4f15aa3ad56ab7581aee.png',
	'https://img.quanminyanxuan.com/other/2055be72b8994f5791d9327898227748.png',
	'https://img.quanminyanxuan.com/other/55c3c0cf5f9b4dd580aab11b9e2751e5.png',
	'https://img.quanminyanxuan.com/other/9fc6ad06da184fb3b6b6ffb5aef37a96.png',
	'https://img.quanminyanxuan.com/other/adf729de37c5414ba90975bea3214502.png',
	'https://img.quanminyanxuan.com/other/7d56ed7fbe084dd6bc4b63e792580076.png',
	'https://img.quanminyanxuan.com/other/0d559641c5934f6e9a9a35c730f14e92.png',
	'https://img.quanminyanxuan.com/other/b098c05becc543179426ba7d6f6255c0.png',
	'https://img.quanminyanxuan.com/other/17ae10b6416643f295fb98f6bb826323.png',
	'https://img.quanminyanxuan.com/other/fb035ab1665a4d70b1b118e074f45d45.png',
	'https://img.quanminyanxuan.com/other/fa1b0330891f492cb9f4b4defd012603.png'
]
// <img class="label" src="${labelArr[parseInt(Math.random()*labelArr.length,10)]}" >

// 商品随机标签 文字
let labelTextArr = [
	'好评过千人气商品',
	'好评率96%',
	'好评率97%',
	'好评率95%',
	'近期超万用户浏览',
	'近七天热销商品',
	'累计销量过万',
	'近期销量过千',
	'180天内最低价',
	'90天内最低价',
	'60天内最低价',
	'30天内最低价',
	'人气收藏商品',
	'新品尝鲜价'
]

pageStatistics() 			// 页面统计
getUserInfo(sourcePlatform)	// 获取用户信息

// 获取 购物卡 数据
getShoppingcard()
function getShoppingcard() {
	http('GET', `/mallv2/h5/shoppingcard/index`).then((res) => {
		let cardInfo = res.data
		// console.log(cardInfo)
		
		$('#amount').text(cardInfo.amount)
		$('#cardNo').text(cardInfo.cardNo)
		$('#periodOfValidity').text(cardInfo.periodOfValidity)
		
		// 爆款精选
		// let html = ''
		// $.each(cardInfo.firstProductList, (index, item) => {
		// 	html += `<div class="scroll-item" onclick="window.open('../productDetail/cardProductDetail.html?productId=${item.id}', '_self')">
		// 				<img src="${item.productImg}" />
		// 				<div class="product-info">
		// 					<div class="name">${item.productName}</div>
		// 					<div class="price pr">
		// 						<span class="txt">¥</span>
		// 						<span class="num">${item.curPrice}</span>
		// 						<span class="o-price">¥${item.originalPrice}</span>
		// 						<div class="bottom-r">
		// 							<img src="https://img.quanminyanxuan.com/other/304d16044df143338e3776bec47b807d.png" >
		// 							<span class="txt">已抢${filterVolume(item.volumeStr)}件</span>
		// 						</div>
		// 					</div>
		// 				</div>
		// 			</div>`
		// })
		// $('#hotProductList').html(html)
		
		// 瀑布流
		// let html2 = ''
		// $.each(cardInfo.secondProductList, (index, item) => {
		// 	// 无库存去掉链接
		// 	let oDiv = ''
		// 	if (item.stock == 0) {
		// 		oDiv = `<div class="product-item">`
		// 	} else {
		// 		oDiv = `<div class="product-item" onclick="window.open('../productDetail/cardProductDetail.html?productId=${item.id}', '_self')">`
		// 	}
		// 	html2 += `${oDiv}
		// 				<img class="img" src="${item.productImg}" >
		// 				${item.stock == 0 ? '<img class="end-img" src="https://img.quanminyanxuan.com/other/1b5eb188ec434ea9aa56a2e27f49dd3b.png" >' : ''}
		// 				<div class="product-info">
		// 					<div class="name">${item.productName}</div>
		// 					<div class="price">¥<span class="num">${item.curPrice}</span></div>
		// 					<div class="bottom">
		// 						<div class="l">¥ ${item.originalPrice}</div>
		// 						<div class="r">月销<span class="num">${filterVolume(item.volumeStr)}</span>件</div>
		// 					</div>
		// 				</div>
		// 			</div>`
		// })
		// $('#productList').html(html2)
	}, err => {
		console.log(err)
	})
}

// 获取 更多商品 数据
getProductList()
function getProductList() {
	if (isLoading) return
	http('GET', `/mallv2/h5/shoppingcard/queryListByPage`, {
		columnId: 0,
		pageSize: 20,
		pageNum,
		flag: 1
	}).then((res) => {
		isLoading = false
		let productList = res.data
		console.log('瀑', productList)
		if (productList.length == 0) isLoading = true
		pageNum ++
		
		let html = ''
		$.each(productList, (index, item) => {
			// 无库存去掉链接
			let oDiv = ''
			if (item.stock == 0) {
				oDiv = `<div class="product-item">`
			} else {
				oDiv = `<div class="product-item" onclick="window.open('../productDetail/cardProductDetail.html?productId=${item.id}&productType=2', '_self')">`
			}
			html += `${oDiv}
						<img class="img" src="${item.productImg}">
						${item.stock == 0 ? '<img class="end-img" src="https://img.quanminyanxuan.com/other/1b5eb188ec434ea9aa56a2e27f49dd3b.png" >' : ''}
						<div class="product-info">
							<div class="name">${item.productName}</div>
							<i class="label-dk">抵扣立省100元</i>
							<div class="price">¥<span class="num">${item.price}</span>
								<div class="l">¥ ${item.originalPrice}</div></div>
							<div class="bottom">
								<div class="r">月销<span class="num">${filterVolume(item.volumeStr)}</span>件</div>
							</div>
							<div class="label">
								<i class="label-text">${labelTextArr[parseInt(Math.random()*labelTextArr.length,10)]}</i>
							</div>
						</div>
					</div>`
		})
		$('#productList').append(html)
	}, err => {
		console.log(err)
	})
}

// 获取 滚动用户列表 数据
// getFakeUsers()
function getFakeUsers() {
	http('GET', `/mallv2/activity/getFakeUserList`, {
		activityType: 'OLD_FOR_NEW'
	}).then((res) => {
		let fakeUsers = res.data
		// console.log('用户:', fakeUsers)
		
		// 向左滚动
		let user2 = ''
		$.each(fakeUsers, (index, item) => {
			user2 += `<div class="swiper-slide">
						<img class="img" src="${item.headImg}" />
					</div>`
		})
		$('#userRandomHead2').html(user2);
		new Swiper('.swiper-container-user', {
			autoplay: {
				delay: 10,
				disableOnInteraction: false
			},
			loop: true,
			speed: 1500,
			slidesPerView: 3
		})
		
	}, err => {
		console.log(err)
	})
}

// 部分dom操作
$(function () {
	
	// $('#people').text(5266 - parseInt(Math.random()*500, 10))
	
	// 页面滚动事件
	$(window).on('scroll', function () {
		let scrollTop = $(this).scrollTop()
		let wHeight = $(this).height()
		let dHeight =$(document).height() -300
		
		// 滚动到底部
		if ((scrollTop + wHeight) > dHeight) {
			getProductList()
			isLoading = true
		}
	})

})