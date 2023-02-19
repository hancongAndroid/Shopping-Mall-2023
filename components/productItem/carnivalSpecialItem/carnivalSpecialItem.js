// 商品数据渲染-首页
function productListBanner (productList, element) {
    let hot = ''
    $.each(productList, (i, n) => {
        if ( pageNum == 1 && i < 8) {
            hot += `<div class="swiper-slide" onclick="window.open('../productDetail/brandSaleProductDetail.html?productId=${n.id}&columnId=${columnId}', '_self')">
						<img class="cover" src="${n.productImg}" >
						<span class="price">¥${n.price}</span>
					</div>`
        } 
    })
    $(element).append(hot)
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
