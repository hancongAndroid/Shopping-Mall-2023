//引入css
(function() {
	var scripts = document.scripts,
		curScript = scripts[scripts.length - 1],
		src = curScript.src,
		location = src.substring(0, src.lastIndexOf("/") + 1);

	document.head.appendChild(function() {
		var link = document.createElement('link')
		link.rel = "styleSheet"
		link.href = location + "guessItem.css"
		return link
	}())
})()

// 商品数据渲染
function productListGuess(productList, element) {
	let html = ''
	$.each(productList, (index, item) => {
		if (item.price == 0) return true	// 去除0元兑
		// 无库存去掉链接
		let oDiv = ''
		if (item.stock == 0) {
			oDiv = `<div class="product-item-guess">`
		} else {
			oDiv = `<div class="product-item-guess" onclick="window.open('../productDetail/guessProductDetail.html?productId=${item.id}', '_self')">`
		}
		html += `${oDiv}
					<img class="img" src="${item.productImg}">
					${item.stock == 0 ? '<img class="end-img" src="https://img.quanminyanxuan.com/other/1b5eb188ec434ea9aa56a2e27f49dd3b.png" >' : ''}
					<div class="product-info">
						<div class="title">${item.productName}</div>
						<div class="volume-wrapper">
							<div class="volume">${filterVolume(item.volumeStr)}人已付款</div>
							<div class="line"></div>
							<div class="good-ratio">${item.goodRatio}%好评</div>
						</div>
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
    addActivityIcon('.product-item-guess')
}