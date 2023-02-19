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
function productListScore(productList, element, redWalletMoney) {
	let html = ''
	$.each(productList, (i, n) => {
		if (n.price == 0) return true	// 去除0元兑
		// 0元积分取 activityMin
		let oText = ''
		if(n.pricte == 0) {
			oText = `<div class="product-text">${n.curPrice-n.price}</div>`
		} else {
			oText = `<div class="product-text">${n.curPrice-n.price}</div>`
		}
		// 无库存去掉链接
		let oDiv = ''
		if (n.stock == 0) {
			oDiv = `<div class="item-box">`
		} else {
			oDiv = `<div class="item-box" onclick="window.open('../productDetail/brandSaleProductDetail.html?productId=${n.id}', '_self')">`
		}
        
		html += `${oDiv}
					<div class="product-img pr">
						<img class="cover-img" src="${n.productImg}" />
						${n.stock == 0 ? '<div class="activity-end"><img src="https://img.quanminyanxuan.com/service/680fec36c9274a238df7560575911c1c.png" /></div>' : ''}
					</div>
					<div class="product-info">
						<div class="product-name">${n.productName}</div>
						<div class="product-price">
							<div><span class="product-card">抵后￥</span>${Math.round((n.price - redWalletMoney) * 100) / 100}</div>
							<div class="volume-box"><span class="product-volumeStr">${volumeStr(n.volumeStr)}</span>人已购</div>
						</div>
                        <div class="by-box">
                            <span class="by-btn">
                                马上抢
                            </span>
                        </div>
					</div>
				</div>`
	})
	$(element).append(html)

    addActivityIcon('.product-img')
}
// 已兑数量
function volumeStr(num) {
	if (num >= 10000) {
		if (num % 10000 == 0) {
			return parseInt(num / 10000) + '万'
		} else {
			return (num / 10000).toFixed(1) + '万'
		}
	} else {
		return num
	}
}
