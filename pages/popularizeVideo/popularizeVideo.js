let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]
let dynamicId = getUrlKey('videoId') || 3007

let pageNum = 1
let isLoading = false		// 判断瀑布流是否加载中

let myVideo = null			// 当前视频元素
let myBtn = null			// 当前视频按钮
let isPlaying = false		// 视频是否播放

// timer()						// 倒计时
pageStatistics() 			// 页面统计
getUserInfo(sourcePlatform)	// 获取用户信息

// 视频列表
getVideoList()
function getVideoList() {
		let swiper2 = new Swiper(".swiper-v", {
				direction: "vertical",
				// pagination: {
				// 	el: ".swiper-pagination",
				// 	clickable: true,
				// },
				on: {
					slideChangeTransitionEnd: function(){
						console.log(this.activeIndex)
						// 滑动屏幕暂停视频
						$('.myVideo').each(function() {
							$(this)[0].pause()
						})
						// 滑动屏幕
						$('.myBtn').removeClass('dn')
						myVideo = $('.myVideo')[this.activeIndex]
						myBtn = $('.myBtn').eq(this.activeIndex)
						isPlaying = false
					},
				},
		})
		myVideo = $('.myVideo')[0]
		myBtn = $('.myBtn').eq(0)
}
// 视频播放停止
function togglePlay() { 
	if (isPlaying) {
		// myVideo.currentTime = 0	// 进度条
		myVideo.pause()
		myBtn.removeClass('dn')
		isPlaying = false
		
	} else {
		myVideo.play()
		myBtn.addClass('dn')
		isPlaying = true
	}
}

// 部分dom操作
$(function () {
    
    $('.open-app').addClass('dn')
    // 直播
    $(document).on('click', '.open-video', function() {
        openWeapp2('packageA/pages/popularizeVideo/open', '')
	})
    // 预约
    $(document).on('click', '.make-video', function() {
        openWeapp2('packageA/pages/popularizeVideo/index', '')
	})

})