let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]
let productId = getUrlKey('productId')

pageStatistics() 			// 页面统计
getUserInfo(sourcePlatform)	// 获取用户信息

// 获取 商品 数据
getProductInfo()
function getProductInfo() {
	http('GET', `/mallv2/product/getProductInfoById`, {
		productId
	}).then((res) => {
		let productInfo = res.data
			
		// 信息栏目
		$('#infoTitle').text(productInfo.longTitle)
		$('#originalPrice').text(productInfo.originalPrice)
		$('#volumeStr').text(filterVolume(productInfo.volumeStr))
		
		// banner
		let bannerImg = ''
		$.each(productInfo.imgMapList.banner, (i, n) => {
			bannerImg += `<div class="swiper-slide"><img src="${n.imgUrl}" /></div>`
		})
		$('#bannerImg').html(bannerImg);
		new Swiper ('.swiper-container-banner', {
			autoplay: {
				delay: 2000,							//自动滑动间隔
				disableOnInteraction: false				//操作后不会停止滑动
			},								
			speed: 500,									//滑动速度
			loop: true,									//循环滑动
			pagination: {
				el: '.swiper-pagination-banner',
				type: 'fraction'
			} 
		})
		
		// 图文详情
		let infoImg = ''
		$.each(productInfo.imgMapList.info, (i, n) => {
			infoImg += `<img src="${n.imgUrl}" />`
		})
		$('#imglist').html(infoImg);
		
	}, err => {
		console.log(err)
	})
}

// 部分dom操作
$(function () {
	// 规则弹窗显示
	$('#discBtn').on('click', function() {
		$('#discMask').addClass('show')
	})
	// 规则弹窗关闭
	$('#closeDesc').on('click', function() {
		$('#discMask').removeClass('show')
	})
	
	// 页面滚动事件
	$(window).on('scroll', function () {
		let scrollTop = $(this).scrollTop()
		if (scrollTop > 600) {
			$('#backTop').removeClass('dn')
		} else {
			$('#backTop').addClass('dn')
		}
	})
	
	// 返回顶部
	$('#backTop').on('click', function() {
		$('html, body').animate({
			scrollTop: 0
		}, 500)
	})

})

