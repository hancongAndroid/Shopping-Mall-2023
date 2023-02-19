//引入css
(function() {
	var scripts = document.scripts,
		curScript = scripts[scripts.length - 1],
		src = curScript.src,
		location = src.substring(0, src.lastIndexOf("/") + 1);

	document.head.appendChild(function() {
		var link = document.createElement('link')
		link.rel = "styleSheet"
		link.href = location + "scoreItem.css"
		return link
	}())
})()

// 商品数据渲染
function productListScore(productList, element) {
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
		
		// 无库存去掉链接
		let oDiv = ''
		if (n.stock == 0) {
			oDiv = `<div class="item-box">`
		} else {
			oDiv = `<div class="item-box" onclick="window.open('../productDetail/productDetail.html?productId=${n.id}', '_self')">`
		}
		html += `${oDiv}
					<div class="product-img pr">
						<img class="cover-img" src="${n.productImg}" />
						${n.stock == 0 ? '<div class="activity-end"><img src="https://img.quanminyanxuan.com/service/680fec36c9274a238df7560575911c1c.png" /></div>' : ''}
					</div>
					<div class="product-info">
						<div class="product-name">${n.productName}</div>
						<div class="label">
							<i class="label1"><img class="icon" src="https://img.quanminyanxuan.com/other/c56d0c97cced4e048ee358db2ef863e5.png">超值兑</i>
							<i class="label2">商品</i>
						</div>
						<div class="product-price">
							<!--<div>
								<img class="price-icon" src="https://img.quanminyanxuan.com/other/36a5f27b0d004d5090a14f42449cf22f.png" />
							</div>-->
							${oText}
							<span class="product-card">积分</span>
							<div class="price-yuan">+${n.price}元</div>
						</div>
						<div class="product-purchase">
							<!--<div class="price">￥<span class="num">${n.curPrice}</span></div>
							<div class="purchase-left">价格￥${n.originalPrice}</div>-->
							<div class="purchase-right"><img class="icon" src="https://img.quanminyanxuan.com/other/764f34e01e2240c6ad0fe53406787537.png">兑换热度<span class="num">${filterVolume(n.volumeStr)}</span></div>
						</div>
					</div>
				</div>`
	})
	$(element).append(html)
    addActivityIcon('.product-img')
}