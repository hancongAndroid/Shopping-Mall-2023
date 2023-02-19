let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]

let pageNum = 1
let isLoading = false		//判断瀑布流是否加载中

pageStatistics() 			// 页面统计
getUserInfo(sourcePlatform)	// 获取用户信息


// 获取 热门搜索 数据
getHotSearchList()
function getHotSearchList() {
    let keyWord = ['无人机','扫地机','空气炸锅','面霜','防晒','休闲鞋','美白','表','黄金','四件套']
    let html = ''
    $.each(keyWord, (index, item) => {
        html += `<div class="words-item" data-name="${item}">
                    ${index == 0 ? '<img class="icon" src="https://img.quanminyanxuan.com/other/97f4434ceeea4ca08d0d604dbd98f9bb.png">' : ''}
                    ${item}
                </div>`
    })
    $('#hotSearchWords').html(html)
	// http('GET', `/mallv2/product/hotSearch`).then((res) => {
	// 	let hotWords = res.data
	// 	let html = ''
	// 	$.each(hotWords, (index, item) => {
	// 		html += `<div class="words-item" data-name="${item.searchWords}">
	// 					${index == 0 ? '<img class="icon" src="https://img.quanminyanxuan.com/other/97f4434ceeea4ca08d0d604dbd98f9bb.png">' : ''}
	// 					${item.searchWords}
	// 				</div>`
	// 	})
	// 	$('#hotSearchWords').html(html)
	// }, err => {
	// 	console.log(err)
	// })
}

// 部分dom操作
$(function () {
	
	// 跳转搜索结果页
	$(document).on('click', '.words-item', function () {
		let name = $(this).data('name')
		$('#searchIpt').val(name)
		window.open('./searchResult.html?name=' + name, '_self')
	})
	$(document).on('click', '.search-btn', function () {
		let name = $('#searchIpt').val()
		window.open('./searchResult.html?name=' + name, '_self')
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
