let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]

let specialId = 6	//类目ID
let pageNum = 1
let isLoading = false		//判断瀑布流是否加载中

let taskScore = 0	//任务积分

pageStatistics() 			// 页面统计
// getUserInfo(sourcePlatform)	// 获取用户信息

// 获取用户信息
;(function () {
	http('GET', `/users/login/h5Login`, {
		sourcePlatform
	}).then((res) => {
		let userInfo = res.data
		localStorage.setItem('userInfo', JSON.stringify(userInfo))
		// console.log('userInfo:', JSON.parse(localStorage.getItem('userInfo')))
		
		$('#scoreNum').text(userInfo.score + taskScore)
	}, err => {
		console.log(err)
	})
})()

// 获取 5个列表商品 数据
getProductInfo()
function getProductInfo() {
	if (isLoading) return
	http('GET', `/mallv2/product/specialProductList`, {
		specialId: specialId,
		pageSize: 30,
		pageNum: pageNum,
		activityType: 'CASH_SCORE'
	}).then((res) => {
		isLoading = false
		let productList = res.data.list
		console.log('列表:', productList)
		if (productList.length == 0) isLoading = true
		pageNum ++
		
		// 数据渲染
		productListShow(productList, $('#productList'))
	}, err => {
		console.log(err)
	})
}

// 获取 超值兑换专区 数据
getProductInfo2()
function getProductInfo2() {
	http('GET', `/mallv2/product/configProductList?key=CARD_KERNEL`).then((res) => {
		let productList = res.data
		console.log('超值兑换专区:', productList)
		
		let html = ''
		$.each(productList, (i, n) => {
			html += `<div class="butbotn-item" onclick="window.open('../productDetail/productDetail.html?productId=${n.id}', '_self')">
						<img class="butbotn-item-img" src="${n.productImg}" />
						<div class="butbotn-item-tit">${n.productName}</div>
						<div class="butbotn-item-txt">${n.activityMax}积分<span>+${n.price}元</span></div>
					</div>`
		})
		$('#butbothList').html(html)
	}, err => {
		console.log(err)
	})
}

// 积分商品数据渲染
function productListShow(productList, element) {
	let html = ''
	$.each(productList, (i, n) => {
		// 0元积分取 activityMin
		let oText = ''
		if(n.pricte == 0) {
			oText = `<div class="product-text">${n.activityMin}</div>`
		} else {
			oText = `<div class="product-text">${n.activityMax}</div>`
		}
		
		// 无库存去掉链接
		let oDiv = ''
		if (n.stock == 0) {
			oDiv = `<div class="item-box">`
		} else {
			oDiv = `<div class="item-box" onclick="window.open('../productDetail/productDetail.html?productId=${n.id}', '_self')">`
		}
		html += `${oDiv}
					<div class="product-img pr">
						<img class="cover-img" src="${n.productImg}" />
						${n.stock == 0 ? '<div class="activity-end"><img src="https://img.quanminyanxuan.com/service/680fec36c9274a238df7560575911c1c.png" /></div>' : ''}
					</div>
					<div class="product-info">
						<div class="product-name">${n.productName}</div>
						<div class="product-price">
							<div>
								<img class="price-icon" src="https://img.quanminyanxuan.com/other/31e1cac4d7a84564b291486178127bed.png" />
							</div>
							${oText}
							<span class="product-card">积分</span>
							<div class="price-yuan">+${n.price}元</div>
						</div>
						<div class="product-purchase">
							<div class="purchase-left">价格￥${n.originalPrice}</div>
							<div class="purchase-right">仅剩<span class="num">${filterStock(n.virtualStock)}</span>件
							</div>
						</div>
					</div>
				</div>`
	})
	$(element).append(html);
}

// 图片懒加载
let lazyLoad = (function(){
	let clock;

	function init(){
		$(window).on("scroll", function(){
			if (clock) {
				clearTimeout(clock);
			}
			clock = setTimeout(function(){
				checkShow();
			}, 200);
		})
		checkShow();
	}
	let i;
	function checkShow(){
		i =0;
		$(".cover-img").each(function(){
			let $cur =$(this);
			// if($cur.attr('isLoaded')){
			// 	return;
			// }
			if(shouldShow($cur)){
				showImg($cur);
			}
		})
			// console.log(i);
	}
	function shouldShow($node){
		let scrollH = $(window).scrollTop(),
		winH = $(window).height(),
		top = $node.offset().top;
		if(top < winH + scrollH){
			return true;
		}else{
			return false;
		}
	}
	function showImg($node){
		$node.attr('src', $node.attr('data-img'));
		// $node.attr('isLoaded', true);
		// alert($node.attr('id'));
		i ++;
		// i = $node.attr('id');
	}
	return {
		init: init
	}
	})()
// lazyLoad.init();



// 部分dom操作
$(function () {
	
	let tabNavBoxTop = $('#tabNavBox').offset().top
	
	// 选项卡切换商品列表
	$('.tab-box').on('click', '.tab-item', function() {
		$(this).addClass('tab-item-active').siblings().removeClass('tab-item-active')

		// 请求商品数据
		let special = $(this).data('special')
		if (special == specialId) return
		$('#productList').html('')
		pageNum = 1
		isLoading = false
		specialId = special
		getProductInfo()
		$('html, body').scrollTop(tabNavBoxTop)
	})
	
	// 页面滚动事件
	$(window).on('scroll', function () {
		let scrollTop = $(this).scrollTop()
		let wHeight = $(this).height()
		let dHeight =$(document).height() - 300
		
		// 滚动到底部
		if (scrollTop + wHeight > dHeight) {
			getProductInfo()
			isLoading = true
		}
	})


})