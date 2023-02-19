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
			oDiv = `<div class="item-box" onclick="window.open('../productDetail/guessProductDetail2.html?productId=${n.id}', '_self')">`
		}
		html += `${oDiv}
					<div class="product-img pr">
						<img class="cover-img" src="${n.productImg}" />
						${n.stock == 0 ? '<div class="activity-end"><img src="https://img.quanminyanxuan.com/service/680fec36c9274a238df7560575911c1c.png" /></div>' : ''}
					</div>
					<div class="product-info">
						<div class="product-name">${n.productName}</div>
						
						
						<div class="product-purchase">
							<!--<div class="price">￥<span class="num">${n.curPrice}</span></div>
							<div class="purchase-left">价格￥${n.originalPrice}</div>-->
							<!--<div class="purchase-right"><img class="icon" src="https://img.quanminyanxuan.com/other/764f34e01e2240c6ad0fe53406787537.png"><span class="num">${filterVolume(n.volumeStr)}</span>人已抢购</div>-->
                            <div class="price-originalPrice">
                              
                                <div class="product-price">
							<span class="product-card">补后￥</span>
                            ${n.price}
						</div>
                                <span class="text2">
                                    <span class="product-volumeStr">${volumeStr(n.volumeStr)}</span>人已购
                                </span>
                            </div>
						</div>
                        <div class="by-box">
                            <span class="by-btn">
                                立享补贴
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