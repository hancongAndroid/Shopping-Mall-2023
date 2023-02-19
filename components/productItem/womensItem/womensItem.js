//引入css
(function () {
    var scripts = document.scripts,
        curScript = scripts[scripts.length - 1],
        src = curScript.src,
        location = src.substring(0, src.lastIndexOf("/") + 1);

    document.head.appendChild(function () {
        var link = document.createElement('link')
        link.rel = "styleSheet"
        link.href = location + "womensItem.css"
        return link
    }())
})()
let columnIdList = [225, 226, 227, 228]
// 商品数据渲染-首页
function productListWomens (productList, element, element2=null,type=null) {
    let html = ''
    let hot = ''
    $.each(productList, (i, n) => {
        if ((columnIdList.includes(+columnId)) && pageNum == 1 && i < 8) {
            
            hot += `<div class="swiper-slide" onclick="window.open('../productDetail/womensProductDetail2.html?productId=${n.id}&columnId=${columnId}', '_self')">
						<img class="cover" src="${n.productImg}" >
						<span class="price">¥${n.price}</span>
					</div>`


            let oDiv = ''
            if (n.stock == 0) {
                oDiv = `<div class="product-item-womens">`
            } else {
                oDiv = `<div class="product-item-womens" onclick="window.open('../productDetail/womensProductDetail2.html?productId=${n.id}&columnId=${columnId}', '_self')">`
            }
            html += `${oDiv}
                                <div class="product-img pr ${(columnIdList.includes(+columnId)) ? 'square' : ''}">
                                    <img class="cover-img" src="${n.productImg}" />
                                    ${n.stock == 0 ? '<div class="activity-end"><img src="https://img.quanminyanxuan.com/service/680fec36c9274a238df7560575911c1c.png" /></div>' : ''}
                                </div>
                                <div class="product-info">
                                    <div class="product-name">${n.productName}</div>
                                    <div class="product-price"><span class="sign">¥</span>${(columnIdList.includes(+columnId)) ? n.price : n.curPrice}</div>
                                    <!--<div class="product-purchase">
                                        <div class="purchase-left">价格￥${n.originalPrice}</div>
                                        <div class="purchase-right">仅剩<span class="num">${filterStock(n.stock)}</span>件
                                        </div>
                                    </div>-->
                                </div>
                            </div>`
        } else {
            // 无库存去掉链接
            let oDiv = ''
            if (n.stock == 0) {
                oDiv = `<div class="product-item-womens">`
            } else {
                if ((columnIdList.includes(+columnId))&&!(type=='detail')) {
                    oDiv = `<div class="product-item-womens" onclick="window.open('../productDetail/womensProductDetail2.html?productId=${n.id}&columnId=${columnId}', '_self')">`
                }else{
                    oDiv = `<div class="product-item-womens" onclick="window.open('../productDetail/womensProductDetail.html?productId=${n.id}&columnId=${columnId}', '_self')">`
                }
            }
            html += `${oDiv}
						<div class="product-img pr ${(columnIdList.includes(+columnId)) ? 'square' : ''}">
							<img class="cover-img" src="${n.productImg}" />
							${n.stock == 0 ? '<div class="activity-end"><img src="https://img.quanminyanxuan.com/service/680fec36c9274a238df7560575911c1c.png" /></div>' : ''}
						</div>
						<div class="product-info">
							<div class="product-name">${n.productName}</div>
							<div class="product-price"><span class="sign">¥</span>${(columnIdList.includes(+columnId)) ? n.price : n.curPrice}</div>
							<!--<div class="product-purchase">
								<div class="purchase-left">价格￥${n.originalPrice}</div>
								<div class="purchase-right">仅剩<span class="num">${filterStock(n.stock)}</span>件
								</div>
							</div>-->
						</div>
					</div>`
        }
    })
    $(element).append(html)
    $(element2).append(hot)
    // 轮播图
    new Swiper('.swiper-container-special', {
        autoplay: {
            delay: 2000,
            disableOnInteraction: false
        },
        slidesPerView: 'auto',
        // centeredSlides: true,
        spaceBetween: 10,
        speed: 500,
        loop: true,
        // pagination: {
        // 	el: '.swiper-pagination',
        // }
    })
}

// 商品数据渲染-专题页
// function productListWomensSpecial(productList, element, element2) {
// 	let html = ''
// 	let hot = ''
// 	$.each(productList, (i, n) => {
// 		if (pageNum == 1 && i < 4) {
// 			hot += `<div class="swiper-slide" onclick="window.open('../productDetail/womensProductDetail.html?productId=${n.id}', '_self')">
// 						<img class="cover" src="${n.productImg}" >
// 						<span class="price">¥${n.price}</span>
// 					</div>`
// 		} else {
// 			// 无库存去掉链接
// 			let oDiv = ''
// 			if (n.stock == 0) {
// 				oDiv = `<div class="product-item-womens">`
// 			} else {
// 				oDiv = `<div class="product-item-womens" onclick="window.open('../productDetail/womensProductDetail.html?productId=${n.id}', '_self')">`
// 			}
// 			html += `${oDiv}
// 						<div class="product-img pr square">
// 							<img class="cover-img" src="${n.productImg}" />
// 							${n.stock == 0 ? '<div class="activity-end"><img src="https://img.quanminyanxuan.com/service/680fec36c9274a238df7560575911c1c.png" /></div>' : ''}
// 						</div>
// 						<div class="product-info">
// 							<div class="product-name">${n.productName}</div>
// 							<div class="product-price"><span class="sign">¥</span>${parseFloat(n.price).toFixed(2)}</div>
// 							<!--<div class="product-purchase">
// 								<div class="purchase-left">价格￥${n.originalPrice}</div>
// 								<div class="purchase-right">仅剩<span class="num">${filterStock(n.stock)}</span>件
// 								</div>
// 							</div>-->
// 						</div>
// 					</div>`
// 		}
// 	})
// 	$(element).append(html)
// 	$(element2).append(hot)
// 	// 轮播图
// 	new Swiper ('.swiper-container-special', {
// 		// autoplay: {
// 		// 	delay: 3500,
// 		// 	disableOnInteraction: false
// 		// },
// 		slidesPerView: 4,
// 		speed: 500,
// 		loop: true,
// 		// pagination: {
// 		// 	el: '.swiper-pagination',
// 		// }
// 	})
// }