let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]

let pageNum = 1
let isLoading = false		//判断瀑布流是否加载中

let columnId = getUrlKey('id')
let columnIdList = [195,197,238,196]

let bgBanner = [
	'https://img.quanminyanxuan.com/other/4785bac992cc4718951fb224077706d0.jpg',
	'https://img.quanminyanxuan.com/other/15ce27c6a9364a6f9ba4a12272446993.jpg',
	'https://img.quanminyanxuan.com/other/9967f9ec1c5f4589be0c2c99fb666aab.jpg',
	'https://img.quanminyanxuan.com/other/a53b80e5d2804e0aae400e512266d8e7.jpg',
]

// timer()						// 倒计时
pageStatistics() 			// 页面统计
getUserInfo(sourcePlatform)	// 获取用户信息
// 广点通渠道统计
// gdt('track', 'VIEW_CONTENT', {});// 浏览

// 获取 全部商品
getProductList()
function getProductList() {
	if (isLoading) return
	isLoading = true
	http('GET', `/mallv2/subjectsController/getProducts`, {
		pageNum,
		pageSize: 20,
		id: columnId
	}).then((res) => {
		isLoading = false
		let productList = res.data.list.sort(randomSort)
		if (productList.length == 0) {
            $('#productList').append(`<div class="guess-like">
				<i class="line l"></i>
				<img class="icon" src="https://img.quanminyanxuan.com/other/46b5dca9f8184401990bb3935d3d2ee0.png" >
				<span class="title">你可能还喜欢</span>
				<i class="line r"></i>
			</div>`)
            pageNum = 0
        }
		// 数据渲染
		productListBanner(productList, $('#bannerList'))
		productListBrand(productList, $('#productList'))
		pageNum ++
	}, err => {
		console.log(err)
	})
}

// 时间戳转时间
function format(shijianchuo) {
	var time = new Date(parseInt(shijianchuo))
	var y = time.getFullYear()
	var m = time.getMonth()+1
	var d = time.getDate()
	var h = time.getHours()
	var mm = time.getMinutes()
	var s = time.getSeconds()
	return y+'.'+add0(m)+'.'+add0(d)
}
function add0(m) {
	return m < 10 ? '0' + m : m
}

// 部分dom操作
$(function () {
	let title = getUrlKey('title') || ''
	document.title = title
    $('#navTxt').text(title)
	
	$('.banner-box').css('background-image', `url(${bgBanner[columnIdList.indexOf(+columnId)]})`)
	
	$('.endData').text(format(new Date().getTime()))
	
	// 页面滚动事件
	$(window).on('scroll', function () {
		let scrollTop = $(this).scrollTop()
		let wHeight = $(this).height()
		let dHeight = $(document).height() - 300
		
		// 滚动到底部
		if (scrollTop + wHeight > dHeight) {
			getProductList()
		}
	})

})