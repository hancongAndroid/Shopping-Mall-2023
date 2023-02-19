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
	$.each(productList, (i, n) => {
		// 无库存去掉链接
		let oDiv = ''
		if (n.stock == 0) {
			oDiv = `<div class="minbox-news">`
		} else {
			oDiv = `<div class="minbox-news" onclick="window.open('../productDetail/newsProductDetail.html?productId=${n.id}', '_self')">`
		}
		html += `${oDiv}
					<img class="cover-img" src="${n.productImg}?x-oss-process=image/resize,h_600,m_lfit" />
					${n.stock == 0 ? '<div class="activity-end"><img src="https://img.quanminyanxuan.com/other/1b5eb188ec434ea9aa56a2e27f49dd3b.png" /></div>' : ''}
					
					<div class="label">
						<div class="labelImg">
							<image class="labelImg1" src="https://img.quanminyanxuan.com/other/fe19cfc62de6479fb4c315dcbb1bedd4.png" />
							<div class="labelImg2 news">补贴<span class="bold">${n.activityMax}元</span></div>
						</div>
						<div class="labeltxt news"><span>日常价￥</span>${n.curPrice}</div>
					</div>
					<div class="descr">${n.productName}</div>
					<div class="integral-price">
						<span class="point">仅剩:<span class="num-kill1">${filterStock(n.virtualStock)}</span>件</span>
						<div class="p-price-info2">补贴后:<span class="num-kill">${n.price}</span>元</div>
					</div>
				</div>`
	})

	$(element).append(html)
}