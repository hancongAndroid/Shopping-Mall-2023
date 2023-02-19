let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]

pageStatistics() 			// 页面统计
getUserInfo(sourcePlatform)	// 获取用户信息


// 获取 商品列表 数据
getProductList()
function getProductList() {
	http('GET', `/mallv2/subjectsController/getSubjectsInfo/2`).then((res) => {
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

// 部分dom操作
$(function () {
	
	// 跳转品牌清仓
	$(document).on('click', '#saleZero', function () {
		window.open('../brandSale/brandClearance.html', '_self')
	})
	
	// 品牌清仓跳转品牌页
	$(document).on('click', '#saleZero .p-item', function (e) {
		id = $(this).data('id')
		window.open('../brandSale/brandClassify.html?id=' + id, '_self')
		e.stopPropagation()	//阻止事件冒泡即可
	})

})