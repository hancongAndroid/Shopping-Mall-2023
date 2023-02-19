let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]

pageStatistics() 			// 页面统计
getUserInfo(sourcePlatform)	// 获取用户信息

// 获取 购物卡 数据
getShoppingcard()
function getShoppingcard() {
	http('GET', `/mallv2/h5/shoppingcard/index`).then((res) => {
		let cardInfo = res.data
		console.log(cardInfo)
		
		$('#amount').text(cardInfo.amount)
		$('#cardNo').text(cardInfo.cardNo)
		$('#periodOfValidity').text(cardInfo.periodOfValidity)

	}, err => {
		console.log(err)
	})
}