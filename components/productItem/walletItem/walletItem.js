//引入css
(function() {
	var scripts = document.scripts,
		curScript = scripts[scripts.length - 1],
		src = curScript.src,
		location = src.substring(0, src.lastIndexOf("/") + 1);

	document.head.appendChild(function() {
		var link = document.createElement('link')
		link.rel = "styleSheet"
		link.href = location + "walletItem.css"
		return link
	}())
})()

// 商品数据渲染
function productListWallet(productList, element) {
	let html = ''
	$.each(productList, (index, item) => {
		// 无库存去掉链接
		let oDiv = ''
		if (item.stock == 0) {
			oDiv = `<div class="product-item-wallet">`
		} else {
			oDiv = `<div class="product-item-wallet" onclick="window.open('../productDetail/walletProductDetail.html?productId=${item.id}', '_self')">`
		}
		html += `${oDiv}
					<img class="img" src="${item.productImg}">
					${item.stock == 0 ? '<img class="end-img" src="https://img.quanminyanxuan.com/other/1b5eb188ec434ea9aa56a2e27f49dd3b.png" >' : ''}
					<div class="product-info">
						<div class="name">${item.productName}</div>
						<span class="label">余额可抵￥${item.activityMax}</span>
						<div class="price">
							<span class="price1">抵扣后￥<span class="num">${item.price}</span></span>
							<span class="price2">￥${item.curPrice}</span>
						</div>
						<div class="volume">已抢<span class="num">${filterVolume(item.volumeStr)}</span>件</div>
					</div>
				</div>`
	})
	$(element).append(html)
}