//引入css
(function() {
	var scripts = document.scripts,
		curScript = scripts[scripts.length - 1],
		src = curScript.src,
		location = src.substring(0, src.lastIndexOf("/") + 1);

	document.head.appendChild(function() {
		var link = document.createElement('link')
		link.rel = "styleSheet"
		link.href = location + "brandItem.css"
		return link
	}())
})()

// 商品数据渲染
function productListBrand(productList, element,redWalletMoney=89.17) {
	let html = ''
	$.each(productList, (index, item) => {
		// 无库存去掉链接
		let oDiv = ''
		if (item.stock == 0) {
			oDiv = `<div class="product-item-brand">`
		} else {
			oDiv = `<div class="product-item-brand" onclick="window.open('../productDetail/brandSaleProductDetail.html?productId=${item.id}', '_self')">`
		}
		html += `${oDiv}
					<img class="img" src="${item.productImg}">
					${item.stock == 0 ? '<img class="end-img" src="https://img.quanminyanxuan.com/other/1b5eb188ec434ea9aa56a2e27f49dd3b.png" >' : ''}
					<div class="product-info">
						<div class="title">${item.productName}</div>
						<div class="label">
							<i class="label1">会员特卖</i>
							<i class="label2">红包再抵</i>
						</div>
						<div class="original-price">
                            <span class="priceNum">
                                <span class="icon">￥</span>${item.price}
                            </span>
                            <span >疯抢热度${item.volumeStr>10000?`${(item.volumeStr/10000).toFixed(1)}万`:item.volumeStr}</span>
                        </div>
						<div class="price">
							抵后¥<span class="num">${ Math.floor((item.price-redWalletMoney)*100)/100 }</span>
						</div>
					</div>
					<img class="icon-cart" src="https://img.quanminyanxuan.com/other/bb9579aeb4034a74ab0fe4be011d866e.png" >
				</div>`
	})
	$(element).append(html)
    addActivityIcon('.product-item-brand')
}