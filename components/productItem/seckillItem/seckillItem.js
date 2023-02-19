//引入css
(function() {
	var scripts = document.scripts,
		curScript = scripts[scripts.length - 1],
		src = curScript.src,
		location = src.substring(0, src.lastIndexOf("/") + 1);

	document.head.appendChild(function() {
		var link = document.createElement('link')
		link.rel = "styleSheet"
		link.href = location + "seckillItem.css"
		return link
	}())
})()

// 商品数据渲染
function productListSeckill(productList, element) {
	let html = ''
	$.each(productList, (index, item) => {
		// 无库存去掉链接
		let oDiv = ''
		if (item.stock == 0) {
			oDiv = `<div class="product-item-seckill">`
		} else {
			oDiv = `<div class="product-item-seckill" onclick="window.open('../productDetail/seckillProductDetail.html?productId=${item.id}', '_self')">`
		}
		html += `${oDiv}
					<div class="product-cover">
						<img class="cover-img" src="${item.productImg}" >
						${item.stock == 0 ? '<img class="end-img" src="https://img.quanminyanxuan.com/other/1b5eb188ec434ea9aa56a2e27f49dd3b.png" >' : ''}
					</div>
					<div class="product-info">
						<div class="product-name">${item.productName}</div>
						<div class="product-bottom">
							<img class="top-icon" src="https://img.quanminyanxuan.com/other/0428962a67c34532b4fed4bd1073a8ba.png" >
							<div class="price">
								<span>￥<span class="num">${item.price}</span></span>
								<span class="oprice">￥${item.originalPrice}</span>
							</div>
							<div class="btn-box">
								<div class="btn-box-t">去秒杀</div>
								<div class="btn-box-b">疯抢热度${filterVolume(item.volume)}</div>
							</div>
						</div>
					</div>
				</div>`
	})
	$(element).append(html)
}