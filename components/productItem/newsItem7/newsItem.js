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
			oDiv = `<div class="recommend-item" onclick="window.open('../productDetail/newsProductDetail.html?productId=${item.id}&productType=4', '_self')">`
		}
		html += `${oDiv}
					<div class="product-img pr">
						<img class="img" src="${item.productImg}" />
						${item.stock == 0 ? '<div class="activity-end"><img src="https://img.quanminyanxuan.com/other/1b5eb188ec434ea9aa56a2e27f49dd3b.png" /></div>' : ''}
					</div>
					<div class="product-info">
						<div class="label-bar">
							<span class="label1">官方补贴</span>
							<img class="label2" src="https://img.quanminyanxuan.com/other/501aeea9a5db4dd49fa0a01c603df544.png">
						</div>
						<div class="descr">${item.productName}</div>
						<div class="middle">
							<span class="l">￥${item.curPrice}</span>
							<span class="m">补贴<br>￥${item.originalPrice-item.price}</span>
							<span class="r">￥<span class="num">${item.price}</span></span>
						</div>
						<div class="price">立即使用</div>
					</div>
				</div>`
	})
	$(element).append(html)
    addActivityIcon('.product-img')
}