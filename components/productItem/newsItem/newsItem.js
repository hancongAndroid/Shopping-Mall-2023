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
// <div class='imgbt'>
// 	<p class='imgbt1'>补贴后</p>
// 	<p class='imgbt2'>${item.price}元</p>
// </div>
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
						<div class="descr">${item.productName}</div>
						<div class="bottom">
							<div class="cur-price">零售价￥${item.curPrice}</div>
							<div class="stock">仅剩<span class="num">${filterStock(item.virtualStock)}</span>件</div>
						</div>
						<div class="price">
							<div class="sum">
								<p class='num1'>补贴额度</p>
								<p class='num2'><span>￥</span>${item.activityMax}</p>
							</div>
							<p class='prbut'>立享补贴></p>
						</div>
					</div>
				</div>`
	})
	$(element).append(html)
}