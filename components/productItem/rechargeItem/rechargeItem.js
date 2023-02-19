//引入css
(function() {
	var scripts = document.scripts,
		curScript = scripts[scripts.length - 1],
		src = curScript.src,
		location = src.substring(0, src.lastIndexOf("/") + 1);

	document.head.appendChild(function() {
		var link = document.createElement('link')
		link.rel = "styleSheet"
		link.href = location + "rechargeItem.css"
		return link
	}())
})()

// 商品数据渲染
function productListRecharge(productList, element) {
	let html = ''
	$.each(productList, (index, item) => {
		// 无库存去掉链接
		let oDiv = ''
		if (item.stock == 0) {
			oDiv = `<div class="minbox">`
		} else {
			oDiv = `<div class="minbox" onclick="window.open('../productDetail/callProductDetail.html?productId=${item.id}', '_self')">`
		}
		html += `${oDiv}
					<img class="cover-img" src="${item.productImg}?x-oss-process=image/resize,h_600,m_lfit" />
					${item.stock == 0 ? '<div class="activity-end"><img src="https://img.quanminyanxuan.com/other/1b5eb188ec434ea9aa56a2e27f49dd3b.png" /></div>' : ''}
					<div class="label">
						<div class="labelImg">
							<image class="labelImg1" src="https://img.quanminyanxuan.com/other/fe42d9e592a44b71ac1c4a36696d36b9.png" />
							<div class="labelImg2">下单即送</div>
						</div>
						<div class="labeltxt">${item.activityMax}元话费</div>
					</div>
					<div class="descr">${item.productName}</div>
					<div class="integral-price">
						<div class="price recharge">
							<div class="price1">￥<span>${item.price}</span></div>
							<span class="price2">￥${item.originalPrice}</span>
						</div>
						<span class="point">去下单</span>
					</div>
				</div>`
	})
	$(element).append(html)
}