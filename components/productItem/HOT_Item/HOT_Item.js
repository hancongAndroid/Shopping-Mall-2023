//引入css
(function() {
	var scripts = document.scripts,
		curScript = scripts[scripts.length - 1],
		src = curScript.src,
		location = src.substring(0, src.lastIndexOf("/") + 1);

	document.head.appendChild(function() {
		var link = document.createElement('link')
		link.rel = "styleSheet"
		link.href = location + "HOT_Item.css"
		return link
	}())
})()

// 商品数据渲染
function productListScore(productList, element,type) {
	let html = ''
	$.each(productList, (i, n) => {
		if (n.price == 0) return true	// 去除0元兑
		// 0元积分取 activityMin
		let oText = ''
		if(n.pricte == 0) {
			oText = `<div class="product-text">${n.activityMin}</div>`
		} else {
			oText = `<div class="product-text">${n.activityMax}</div>`
		}
		let randomNum = (Math.round(Math.random()*10+87)/10).toFixed(1);
		// 无库存去掉链接
		let oDiv = ''
		if (n.stock == 0) {
			oDiv = `<div class="item-box">`
		} else {
			oDiv = `<div class="item-box" onclick="window.open('../productDetail/${type}.html?productId=${n.id}', '_self')">`
		}
		html += `${oDiv}
					<div class="product-img pr">
						<img class="cover-img" src="${n.productImg}" />
						${n.stock == 0 ? '<div class="activity-end"><img src="https://img.quanminyanxuan.com/service/680fec36c9274a238df7560575911c1c.png" /></div>' : ''}
					</div>
					<div class="product-info">
						<div class="product-name">${n.productName}</div>
						<div class="product-price">
							<div class="price-yuan"><span class="icon">￥</span>${n.price}</div>
							<div class="product-price-text"><span class="icon"></span>热销指数${randomNum}</div>
						</div>
						<div class="product-purchase">
						
						</div>
					</div>
				</div>`
	})
	$(element).append(html)
}