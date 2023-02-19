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
			oDiv = `<div class="recommend-item" onclick="window.open('../../productDetailH5/elevenProductDetail.html?productId=${item.id}', '_self')">`
		}
		html += `${oDiv}
					<div class="product-img pr">
						<img class="img" src="${item.productImg}" />
						${item.stock == 0 ? '<div class="activity-end"><img src="https://img.quanminyanxuan.com/other/1b5eb188ec434ea9aa56a2e27f49dd3b.png" /></div>' : ''}
					</div>
					<div class="product-info">
						<div class="descr">${item.productName}</div>
						<div class="midt">
							<img class="midtImg" src="https://img.quanminyanxuan.com/other/7e5594e56ece491c9cca3ff37c9adb7b.png" >
							<div class="midtor">活动价<br>￥${item.curPrice}</div>
							<div class="midtjz">
								<div class="midtjz2"><span class="num">${item.activityMax}元</span></div>
							</div>
							<div class="midtde">立享<br>补贴</div>
						</div>
					</div>
				</div>`
	})
	$(element).append(html)
}