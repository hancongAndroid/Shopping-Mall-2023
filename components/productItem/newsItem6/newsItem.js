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
						<div class="label-bar">
							<img class="label1" src="https://img.quanminyanxuan.com/other/a7c393aa4a704b96bdba7d8ae1fc5337.png">
							<img class="label2" src="https://img.quanminyanxuan.com/other/501aeea9a5db4dd49fa0a01c603df544.png">
						</div>
						<div class="descr">${item.productName}</div>
						<div class="middle">
							<span class="l">￥${item.curPrice}</span>
							<span class="m">补贴<br>￥${item.activityMax}</span>
							<span class="r">即将恢复</span>
						</div>
						<div class="price">
							<div class="content">
								<span class="txt">限时补贴价</span>
								<span class="sum"><span class="sign">￥</span>${item.price}</span>
							</div>
							<div class="content date dn">
								<div class="counter">
									<div class="num hour">00</div>
									<div class="text-two">:</div>
									<div class="num minute">00</div>
									<div class="text-two">:</div>
									<div class="num second">00</div>
								</div>
								<span class="txt">后结束</span>
							</div>
							<div class="content volume">
								<span class="str">已补${filterVolume(item.volumeStr)}件</span>
								<span class="txt">精品补贴</span>
							</div>
						</div>
					</div>
				</div>`
	})
	$(element).append(html)
}