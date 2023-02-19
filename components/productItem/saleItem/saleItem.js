//引入css
(function() {
	var scripts = document.scripts,
		curScript = scripts[scripts.length - 1],
		src = curScript.src,
		location = src.substring(0, src.lastIndexOf("/") + 1);

	document.head.appendChild(function() {
		var link = document.createElement('link')
		link.rel = "styleSheet"
		link.href = location + "saleItem.css"
		return link
	}())
})()

// 商品数据渲染
function productListSale(productList, element) {
	let html = ''
	$.each(productList, (index, item) => {
		// 无库存去掉链接
		let oDiv = ''
		if (item.stock == 0) {
			oDiv = `<div class="product-item-sale">`
		} else {
			oDiv =
				`<div class="product-item-sale" onclick="window.open('../productDetail/saleProductDetail.html?productId=${item.id}', '_self')">`
		}
		html += `${oDiv}
					<div class="product-cover">
						<img class="cover-img" src="${item.productImg}" >
						${item.stock == 0 ? '<img class="end-img" src="https://img.quanminyanxuan.com/other/1b5eb188ec434ea9aa56a2e27f49dd3b.png" >' : ''}
					</div>
					<div class="product-info">
						<div class="product-name">${item.productName}</div>
						<div class="label">
							<i class="label1">会员专享</i>
							<i class="label2">${filterVolume(item.volumeStr)}人付款</i>
						</div>
						<div class="product-bottom">
							<div class="price-txt">全网底价</div>
							<div class="price">￥<span class="num">${item.price}</span><span class="price-ori">￥${item.originalPrice}</span></div>
							<div class="btn-go">去抢购</div>
						</div>
					</div>
				</div>`
	})
	$(element).append(html)
}