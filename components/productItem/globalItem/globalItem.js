//引入css
(function() {
	var scripts = document.scripts,
		curScript = scripts[scripts.length - 1],
		src = curScript.src,
		location = src.substring(0, src.lastIndexOf("/") + 1);

	document.head.appendChild(function() {
		var link = document.createElement('link')
		link.rel = "styleSheet"
		link.href = location + "globalItem.css"
		return link
	}())
})()

// 商品数据渲染
function productListGlobal(productList, element) {
	let html = ''
	$.each(productList, (index, item) => {
		// 无库存去掉链接
		let oDiv = ''
		if (item.stock == 0) {
			oDiv = `<div class="product-item-global">`
		} else {
			oDiv = `<div class="product-item-global" onclick="window.open('../productDetail/guessProductDetail.html?productId=${item.id}', '_self')">`
		}
		html += `${oDiv}
					<img class="img" src="${item.productImg}">
					${item.stock == 0 ? '<img class="end-img" src="https://img.quanminyanxuan.com/other/1b5eb188ec434ea9aa56a2e27f49dd3b.png" >' : ''}
					${item.chinaName ? `<span class="label"><img class="icon" src="${item.smallFlagImg}">${item.chinaName}</span>` : ''}
					<div class="product-info">
						<div class="title">${item.productName}</div>
						<div class="price-container">
							<div class="price">
								<span class="first">¥<span class="num">${item.price}</span></span>
								<span class="last">¥<span class="num">${item.originalPrice}</span></span>
							</div>
						</div>
					</div>
				</div>`
	})
	$(element).append(html)
}