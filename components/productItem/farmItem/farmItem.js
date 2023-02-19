//引入css
(function() {
	var scripts = document.scripts,
		curScript = scripts[scripts.length - 1],
		src = curScript.src,
		location = src.substring(0, src.lastIndexOf("/") + 1);

	document.head.appendChild(function() {
		var link = document.createElement('link')
		link.rel = "styleSheet"
		link.href = location + "farmItem.css"
		return link
	}())
})()

// 商品数据渲染
function productListFarm(productList, element) {
	let html = ''
	$.each(productList, (index, item) => {
		// 无库存去掉链接
		let oDiv = ''
		if (item.stock == 0) {
			oDiv = `<div class="product-item-farm">`
		} else {
			oDiv = `<div class="product-item-farm" onclick="window.open('../productDetail/guessProductDetail.html?productId=${item.id}', '_self')">`
		}
		html += `${oDiv}
					<img class="img" src="${item.productImg}">
					${item.stock == 0 ? '<img class="end-img" src="https://img.quanminyanxuan.com/other/1b5eb188ec434ea9aa56a2e27f49dd3b.png" >' : ''}
					<div class="product-info">
						<div class="title">${item.productName}</div>
						<div class="label">特价</div>
						<div class="volume">${filterVolume(item.volume)}人已付款</div>
						<div class="price">
							<span class="price1">¥<span class="num">${item.price}</span></span>
							<span class="price2">¥${item.originalPrice}</span>
						</div>
					</div>
					<img class="icon-cart" src="https://img.quanminyanxuan.com/other/293f92d2f33f40a19671813b7bb027af.png" >
				</div>`
	})
	$(element).append(html)
}