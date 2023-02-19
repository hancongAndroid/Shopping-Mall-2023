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
	// if (isLoading) return
	// isLoading = true
	http('GET', `/mallv2/evaluation/evaluationHome`, {
		specialId: 9,
		categoryId: 0,
		type: '',
		fileType: 'video',
		pageNum,
		pageSize: 20,
		dynamicDistinction: 0,
		dynamicId
	}).then((res) => {
		// isLoading = false
		let video = res.data.dynamicList
		// if (video.length == 0) isLoading = true
		// pageNum ++
		
		let html = ''
		$.each(video, (index, item) => {
			html += `<div class="swiper-slide">
					<video class="myVideo"
						poster="${item.img}"
						src="${item.video}"
						width="100%"
						type="video/mp4"
						objectfit="contain"
						preload="metadata"
						playsinline=""
						webkit-playsinline=""
						x5-playsinline=""
						x5-video-player-type="h5"
						x5-video-player-fullscreen="true"
						x5-video-orientation="portraint"
						x-webkit-airplay="true"
					>
					</video>
					<div class="mask-play" onclick="togglePlay()"><i class="myBtn"></i></div>
					<!-- 底部文案 -->
					<div class="bottom-content">
						<div class="product-box ${!item.productId ? 'dn' : ''}">
							<img class="cover-img" src="${item.productImg}" >
							<div class="product-info">
								<p class="name ellipsis2">${item.productName}</p>
								<p class="price">￥<span class="num">${item.prodcutPrice}</span></p>
							</div>
						</div>
						<div class="video-name">
							<h3 class="ellipsis2">${item.title}</h3>
						</div>
						<div class="send-comment">
							<img class="icon" src="https://img.quanminyanxuan.com/other/c14332e4f6c243f79de3ffe65d1e7abe.png" >
							<i class="line"></i>
							<span class="txt">发弹幕...</span>
						</div>
					</div>
					<!-- 侧栏按钮 -->
					<div class="handle-list">
						<div class="handle-item user">
							<img class="head-img" src="${item.headImg}">
							<img class="icon-add" src="https://img.quanminyanxuan.com/other/609e1329ae11437380b618e96882e034.png" >
						</div>
						<div class="handle-item like">
							<img class="icon" src="https://img.quanminyanxuan.com/other/b2546b016a584bcd8e3538f2e4acaf2f.png" >
							<span class="txt">${item.praiseNum}</span>
						</div>
						<div class="handle-item comment">
							<img class="icon" src="https://img.quanminyanxuan.com/other/deb987b124f2496fbf9869990d636a8f.png" >
							<span class="txt">${item.commentNum}</span>
						</div>
						<div class="handle-item share">
							<img class="icon" src="https://img.quanminyanxuan.com/other/e6affc3640dc4d1ca70045a1840ebb90.png" >
							<span class="txt">分享</span>
						</div>
					</div>
				</div>`
		})
		$('#videoList').html(html)
		// 上下屏
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
	}, err => {
		console.log(err)
	})
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
	
	// 删除 打开app按钮
	// $('#closeAppBar').on('click', function() {
	// 	$('#appBar2').remove()
	// })
	// $(document).on('click','#appBar',function () {
	// 	downAppgo()
	// })
})