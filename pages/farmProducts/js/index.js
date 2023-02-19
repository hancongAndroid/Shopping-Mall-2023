let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]

let columnId = 91
let pageNum = 1
let isLoading = false		//判断瀑布流是否加载中

pageStatistics() 			// 页面统计
getUserInfo(sourcePlatform)	// 获取用户信息

// 获取 商品列表 数据
getProductList()
function getProductList() {
	if (isLoading) return
	isLoading = true
	http('GET', `/mallv2/subjectsController/getProducts`, {
		id: columnId,
		pageSize: 10,
		pageNum
	}).then((res) => {
		isLoading = false
		let productList = res.data.list
		// console.log('商品:', productList)
		if (productList.length == 0) isLoading = true
		pageNum ++
		
		// 商品数据渲染
		productListFarm(productList, $('#productList'))
	}, err => {
		console.log(err)
	})
}

// 获取 导航 数据
getNavigationList()
function getNavigationList() {
	http('GET', `/mallv2/subjectsController/getSubjectsInfo/4`).then((res) => {
		let data = res.data.subjectPlateDtos
		let html = ''
		$.each(data, (index, item) => {
			html += `<li class="tab-item ${index == 0 ? 'active' : ''}" data-id="${item.id}">
						<span class="title">${item.title}</span>
						<span class="tips">${item.subtitle}</span>
					</li>`
		})
		$('#navigation').html(html)
		
	}, err => {
		console.log(err)
	})
}
			
// 部分dom操作
$(function () {
	
	let bannerTop = new Swiper("#bannerTop", {
		autoplay: {
			delay: 2000,
			disableOnInteraction: false
		},
		loop: true,
		loopedSlides: 5,
		slidesPerView: 'auto',
		centeredSlides: true,
		initialSlide: 0,
		watchSlidesProgress: true,
		on: {
			progress: function(progress) {
				for (let i = 0; i < this.slides.length; i++) {
					let slide = this.slides.eq(i);
					let slideProgress = this.slides[i].progress;
					let translate = slideProgress * 4 + 'rem';
					let scale = 1 - Math.abs(slideProgress) / 5;
					let zIndex = 999 - Math.abs(Math.round(10 * slideProgress));
					slide.transform('translateX(' + translate + ') scale(' + scale + ')');
					slide.css('zIndex', zIndex);
					slide.css('opacity', 1);
					if (Math.abs(slideProgress) > 2) {
						slide.css('opacity', 0);
					}
					if (slideProgress > 0) {
						slide.css('opacity', 1 - slideProgress);
					}
				}
			},
			setTransition: function(swiper, transition) {
				for (let i = 0; i < this.slides.length; i++) {
					let slide = this.slides.eq(i);
					slide.transition(transition);
				}
			}
		}
	})
	
	// 选项卡切换商品列表
	$('#navigation').on('click', '.tab-item', function() {
		if ($(this).hasClass('active')) return	//点击当前无操作
		pageNum = 1
		isLoading = false
		$(this).addClass('active').siblings().removeClass('active')
		columnId = $(this).data('id')
		$('#productList').html('')
		$('html, body').scrollTop($('#productList').offset().top - 80)
		getProductList()
	})
	
	// 页面滚动事件
	$(window).on('scroll', function () {
		let scrollTop = $(this).scrollTop()
		let wHeight = $(this).height()
		let dHeight =$(document).height() - 300
		
		// 滚动到底部
		if (scrollTop + wHeight > dHeight) {
			getProductList()
			isLoading = true
		}
	})
})