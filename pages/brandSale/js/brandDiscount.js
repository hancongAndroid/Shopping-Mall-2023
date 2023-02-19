let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]

pageStatistics() 			// 页面统计
getUserInfo(sourcePlatform)	// 获取用户信息
// 广点通渠道统计
// gdt('track', 'VIEW_CONTENT', {});// 浏览

// 获取 商品列表 数据
getProductList()
function getProductList() {
	http('GET', `/mallv2/subjectsController/getSubjectsInfo/56`).then((res) => {
		let productList = res.data.subjectPlateDtos
		let html = ''
		$.each(productList, (index, item) => {
			html += `<div class="brand-sale-item" onclick="window.open('../brandSale/brandClassify.html?id=${item.brandId}', '_self')">
						<img class="banner" src="${item.bannerUrl}" >
						<div class="title">${item.title}</div>
						<p class="desc">${item.subtitle}</p>
					</div>`
		})
		$('#brandSaleList').append(html)
	}, err => {
		console.log(err)
	})
}