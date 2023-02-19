//引入css
(function() {
	var scripts = document.scripts,
		curScript = scripts[scripts.length - 1],
		src = curScript.src,
		location = src.substring(0, src.lastIndexOf("/") + 1);

	document.head.appendChild(function() {
		var link = document.createElement('link')
		link.rel = "styleSheet"
		link.href = location + "cardItem.css"
		return link
	}())
})()

// 商品随机标签 图标
let labelArr = [
	'https://img.quanminyanxuan.com/other/bcd5d3659d79448baa5c75d9833429b9.png',
	'https://img.quanminyanxuan.com/other/d095c9c4fa3f45c5be877879f7af3816.png',
	'https://img.quanminyanxuan.com/other/8699f20d3201474b910a2cc8a8d8d4ce.png',
	'https://img.quanminyanxuan.com/other/921cf8eaabbe4f15aa3ad56ab7581aee.png',
	'https://img.quanminyanxuan.com/other/2055be72b8994f5791d9327898227748.png',
	'https://img.quanminyanxuan.com/other/55c3c0cf5f9b4dd580aab11b9e2751e5.png',
	'https://img.quanminyanxuan.com/other/9fc6ad06da184fb3b6b6ffb5aef37a96.png',
	'https://img.quanminyanxuan.com/other/adf729de37c5414ba90975bea3214502.png',
	'https://img.quanminyanxuan.com/other/7d56ed7fbe084dd6bc4b63e792580076.png',
	'https://img.quanminyanxuan.com/other/0d559641c5934f6e9a9a35c730f14e92.png',
	'https://img.quanminyanxuan.com/other/b098c05becc543179426ba7d6f6255c0.png',
	'https://img.quanminyanxuan.com/other/17ae10b6416643f295fb98f6bb826323.png',
	'https://img.quanminyanxuan.com/other/fb035ab1665a4d70b1b118e074f45d45.png',
	'https://img.quanminyanxuan.com/other/fa1b0330891f492cb9f4b4defd012603.png'
]
// <img class="label" src="${labelArr[parseInt(Math.random()*labelArr.length,10)]}" >

// 商品随机标签 文字
let labelTextArr = [
	'好评过千人气商品',
	'好评率96%',
	'好评率97%',
	'好评率95%',
	'近期超万用户浏览',
	'近七天热销商品',
	'累计销量过万',
	'近期销量过千',
	'180天内最低价',
	'90天内最低价',
	'60天内最低价',
	'30天内最低价',
	'人气收藏商品',
	'新品尝鲜价'
]

// 商品数据渲染
function productListCard(productList, element) {
	let html = ''
	$.each(productList, (index, item) => {
		// 无库存去掉链接
		let oDiv = ''
		if (item.stock == 0) {
			oDiv = `<div class="product-item">`
		} else {
			oDiv = `<div class="product-item" onclick="window.open('../productDetail/cardProductDetail.html?productId=${item.id}', '_self')">`
		}
		html += `${oDiv}
					<img class="img" src="${item.productImg}">
					${item.stock == 0 ? '<img class="end-img" src="https://img.quanminyanxuan.com/other/1b5eb188ec434ea9aa56a2e27f49dd3b.png" >' : ''}
					<div class="product-info">
						<div class="name">${item.productName}</div>
						<div class="label">
							<i class="label1">会员专享</i>
							<img class="label2" src="https://img.quanminyanxuan.com/other/a17a31db149346eda247b8ed2c3b060f.png">
						</div>
						<div class="price">¥<span class="num">${item.curPrice}</span></div>
						<div class="bottom">
							<div class="l">¥ ${item.originalPrice}</div>
							<div class="r">仅剩<span class="num">${filterStock(item.virtualStock)}</span>件</div>
						</div>
					</div>
				</div>`
	})
	$(element).append(html)
}