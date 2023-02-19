//引入css
(function() {
	var scripts = document.scripts,
		curScript = scripts[scripts.length - 1],
		src = curScript.src,
		location = src.substring(0, src.lastIndexOf("/") + 1);
		
	document.head.appendChild(function() {
		var link = document.createElement('link')
		link.rel = "styleSheet"
		link.href = location + "newsItem.css"
		return link
	}())
})()

// 商品数据渲染
function productListShow(productList, element) {
	let html = ''
	$.each(productList, (index, item) => {
		// 无库存去掉链接
		let oDiv = ''
		if (item.stock == 0) {
			oDiv = `<div class="recommend-item">`
		} else {
			oDiv = `<div class="recommend-item" onclick="window.open('../productDetail/newsProductDetail.html?productId=${item.id}', '_self')">`
		}
		html += `${oDiv}
					<div class="product-img pr">
						<img class="img" src="${item.productImg}" />
						${item.stock == 0 ? '<div class="activity-end"><img src="https://img.quanminyanxuan.com/other/1b5eb188ec434ea9aa56a2e27f49dd3b.png" /></div>' : ''}
					</div>
					<div class="product-info">
						<div class="descr">${item.productName}</div>
						<div class="midt">
							<img class="midtImg" src="https://img.quanminyanxuan.com/other/96467f6082284ed78ad5ecb8632d2f15.png" >
							<div class="midtor">￥${item.curPrice}</div>
							<div class="midtjs">仅剩<span class="num">${filterStock(item.virtualStock)}</span>件</div>
							<div class="midtjz">
								<div class="midtjz1">补贴额度</div>
								<div class="midtjz2"><span class="num">${item.activityMax}</span></div>
							</div>
						</div>
						<div class="price">
							<div class="price1">
								<div class="price12">￥<span class="num">${item.price}</span></div>
							</div>
							<div class="price2">去补贴换购></div>
						</div>
					</div>
				</div>`
	})
	$(element).append(html)
}