let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]

let pageNum = 1
let isLoading = false		//判断瀑布流是否加载中

let columnId = getUrlKey('id')
let bgBanner = [
	'https://img.quanminyanxuan.com/other/062e2f6408e84e96b1b3014fa5cadc4d.png',
	'https://img.quanminyanxuan.com/other/f1217fc6403a4c92abebb65f1327f7f0.png',
	'https://img.quanminyanxuan.com/other/1658d4cd57994a16a7be6be892bf5d63.png',
	'https://img.quanminyanxuan.com/other/267110951c8f4a359d89e68e800c697a.png'
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
		if (productList.length == 0) isLoading = true
		// 数据渲染
		productListWomens(productList, $('#productList'), $('#bannerList'))
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
	
	document.title = getUrlKey('title') || '美好生活季'
	
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