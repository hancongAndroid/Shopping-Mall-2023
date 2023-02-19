let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]

let pageNum = 1
let isLoading = false		//判断瀑布流是否加载中
let productList = []
let columnId = 0
let flag = 1

// timer()						// 倒计时
pageStatistics() 			// 页面统计
getUserInfo(sourcePlatform)	// 获取用户信息

// 获取补贴金额
// getAumont()
// function getAumont() {
// 	http('GET', `/mallv2/h5/oldfornew/account`).then((res) => {
// 		// console.log('account',res.data.used)
// 		let used = res.data.used == null ? 0 : res.data.used
// 		let aumont = 4000 - used < 0 ? 0 : 4000 - used
// 		$('#aumont').text(aumont)
// 	}, err => {
// 		console.log(err)
// 	})
// }

// 获取 分类菜单 数据
getClassify()
function getClassify () {
    http('GET', `/mallv2/special/getNewSpecialList`, {
        status: 1,
        pid: 0
    }).then((res) => {
        let classifyList = res.data
        // console.log('分类', classifyList)
        let html1 = ''
        let html2 = ''
        $.each(classifyList, (index, item) => {
            if (index % 2 == 0) {
                html1 += `<div class="category-item" onclick="window.open('../discover/categoryCom.html?nid=${item.id}&title=${item.title}', '_self')">
							<div class="item-list">
								<div class="item-img"><img class="img" src="${item.imgUrl}?x-oss-process=image/resize,w_80,m_lfit" ></div>
								<div class="item-title">${item.title}</div>
							</div>
						</div>`
            } else {
                html2 += `<div class="category-item" onclick="window.open('../discover/categoryCom.html?nid=${item.id}&title=${item.title}', '_self')">
							<div class="item-list">
								<div class="item-img"><img class="img" src="${item.imgUrl}?x-oss-process=image/resize,w_80,m_lfit" ></div>
								<div class="item-title">${item.title}</div>
							</div>
						</div>`
            }
        })
        $('#categoryList1').html(html1)
        $('#categoryList2').html(html2)
    }, err => {
        console.log(err)
    })
}

// 获取 商品列表 猜你喜欢
// getProductList()
// function getProductList() {
// 	if (isLoading) return
// 	isLoading = true
// 	http('GET', `/mallv2/activity/getActivityList`, {
// 		pageNum,
// 		pageSize: 20,
// 		activityType: 'GUESS_LIKE'
// 	}).then((res) => {
// 		isLoading = false
// 		let productList = res.data
// 		// console.log('商品:', productList)
// 		if (productList.length == 0) {
//             $('#productList').append(`<div class="guess-like">
//             <i class="line l"></i>
//             <img class="icon" src="https://img.quanminyanxuan.com/other/46b5dca9f8184401990bb3935d3d2ee0.png" >
//             <span class="title">你可能还喜欢</span>
//             <i class="line r"></i>
//         </div>`)
//         columnId = 0
//         pageNum = 1
//         flag = 1
//         }
// 		pageNum ++

// 		// 商品数据渲染
// 		productListGuess(productList, $('#productList'))
// 	}, err => {
// 		console.log(err)
// 	})
// }

// 获取 全部商品
// getProductList()
function getProductList () {
    if (isLoading) return
    isLoading = true
    http('GET', `/mallv2/h5/activity/queryListByPage`, {
        columnId,
        pageNum,
        pageSize: 20,
        flag,
        activityType: 'OLD_FOR_NEW'
    }).then((res) => {
        isLoading = false
        let productList = res.data
        pageNum++
        if (productList.length == 0) {
            $('#productList').append(`<div class="guess-like">
				<i class="line l"></i>
				<img class="icon" src="https://img.quanminyanxuan.com/other/46b5dca9f8184401990bb3935d3d2ee0.png" >
				<span class="title">你可能还喜欢</span>
				<i class="line r"></i>
			</div>`)
            columnId = 0
            pageNum = 1
            flag = 1
        }

        // 数据渲染
        productListGuess(productList, $('#productList'))
    }, err => {
        console.log(err)
    })
}
init()
function init () {
    if (isLoading) return
    isLoading = true
    let params = {
        columnId:0,
        pageNum,
        pageSize: 5,
        flag,
    }
    let params2 = {
        columnId: 239,
        pageNum,
        pageSize: 5,
        flag,
    }
    
    Promise.all([queryListByPage({ ...params, activityType: 'OLD_FOR_NEW' }), 
    queryListByPage({ ...params, activityType: 'H5_COUPON' }),
    queryListByPage({ ...params, activityType: 'H5_MEMBER_DISCOUNT' }),
    queryListByPage({ ...params2, activityType: 'H5_RED_PACKET' }),
    queryListByPage({ ...params, activityType: 'CASH_SCORE' }),
    ]).then((res) => {
        isLoading = false
        pageNum++
        res.forEach((value) => {
            productList = productList.concat(value)
        })
        if (productList.length == 0) {
            $('#productList').append(`<div class="guess-like">
				<i class="line l"></i>
				<img class="icon" src="https://img.quanminyanxuan.com/other/46b5dca9f8184401990bb3935d3d2ee0.png" >
				<span class="title">你可能还喜欢</span>
				<i class="line r"></i>
			</div>`)
            pageNum = 1
            flag = 1
        }
        productList = productList.sort(randomSort)
        productListGuess(productList, $('#productList'))
    }).catch(e => {
        console.log("error", e)
    })
}


// 获取 活动板块 数据
getSubjectProduct()
function getSubjectProduct () {
    http('GET', `/mallv2/newIndex/getHomeSubjectProduct`).then((res) => {
        let subjectArr = res.data

        // 9.9生活馆
        let html1 = ''
        $.each(subjectArr[0].productSubjectPlates, (index, item) => {
            html1 += `<div class="item">
						<img class="img" src="${item.productImg}">
						<span class='txt'>￥${item.productPrice}</span>
					</div>`
        })
        $('#subject1').append(html1)

        // 品牌特卖
        let html2 = ''
        $.each(subjectArr[1].productSubjectPlates, (index, item) => {
            html2 += `<div class="item">
						<img class="img" src="${item.productImg}">
						<img class='label' src="${item.labelUrl}">
					</div>`
        })
        $('#subject2').append(html2)

        // 全球直供
        let html3 = ''
        $.each(subjectArr[2].productSubjectPlates, (index, item) => {
            html3 += `<div class="item">
						<img class="img" src="${item.productImg}">
						<img class='label' src="${item.labelUrl}">
					</div>`
        })
        $('#subject3').append(html3)

        // 农副生鲜
        let html4 = ''
        $.each(subjectArr[3].productSubjectPlates, (index, item) => {
            html4 += `<div class="item">
						<img class="img" src="${item.productImg}">
						<span class='txt'>${index == 0 ? '地方特产' : '严选助农'}</span>
					</div>`
        })
        $('#subject4').append(html4)

        // 官方补贴
        // let html5 = ''
        // $.each(subjectArr[4].productSubjectPlates, (index, item) => {
        // 	html5 += `<li class='eva-conbox'>
        // 				<img class='eva-conboxImg' src="${item.productImg}" >
        // 				<div class="product-info">
        // 					<span class="disc">补贴${item.activityMax}元</span>
        // 					<span class="price">￥${item.productPrice}</span>
        // 				</div>
        // 			</li>`
        // })
        // $('#oldForNewList').append(html5)
    }, err => {
        console.log(err)
    })
}

// 获取 豆腐块 数据
getActivityProduct()
function getActivityProduct () {
    http('GET', `/mallv2/newIndex/getHomeActivityImg`).then((res) => {
        let activityObj = res.data

        // 官方补贴
        let html1 = ''
        $.each(activityObj.app_subsidy, (index, item) => {
            html1 += `<div class="flr-item">
						<img class="p-img" src="${item.productImg}">
						<img class="p-dis" src="${item.moneyImg}">
					</div>`
        })
        $('#oldForNewList').append(html1)

        // 兑换商城
        let html2 = ''
        $.each(activityObj.app_conversion, (index, item) => {
            html2 += `<div class="flr-item">
						<img class="p-img" src="${item.productImg}">
						<img class="p-dis d" src="${item.moneyImg}">
					</div>`
        })
        $('#exchangeList').append(html2)

    }, err => {
        console.log(err)
    })
}

// 获取 banner轮播 数据
getBannerList()
function getBannerList () {
    http('GET', `/mallv2/common/getBanners`, {
        type: 'LIFE_HALL_INDEX'
    }).then((res) => {
        let bannerList = res.data
        let html = ''
        $.each(bannerList, (index, item) => {
            html += `<div class="swiper-slide" onclick="window.open('${item.apath}', '_self')">
						<img class="img" src="${item.imgUrl}">
					</div>`
        })
        $('#swiperBanner').append(html)
        new Swiper('.swiper-container-flsw', {
            autoplay: {
                delay: 2800,
                disableOnInteraction: false
            },
            slidesPerView: 'auto',
            centeredSlides: true,
            spaceBetween: 5,
            speed: 1000,
            loop: true,
            pagination: {
                el: '.swiper-pagination',
            }
        })
    }, err => {
        console.log(err)
    })
}
function queryListByPage (params) {
    return new Promise((resolve, reject) => {
        http('GET', `/mallv2/h5/activity/queryListByPage`, params).then((res) => {
            if (res.code == 200) {
                resolve(res.data)
            } else {
                reject(res)
            }
        }).catch((error) => {
            reject(error)
        })
    })
}
// 部分dom操作
$(function () {
    // 轮播图
    new Swiper('.swiper-container-banner', {
        autoplay: {
            delay: 5000,
            disableOnInteraction: false
        },
        speed: 500,
        loop: true,
        pagination: {
            el: '.swiper-pagination',
        }
    })

    // 页面滚动事件
    $(window).on('scroll', function () {
        let scrollTop = $(this).scrollTop()
        let wHeight = $(this).height()
        let dHeight = $(document).height() - 300

        // 滚动到底部
        if (scrollTop + wHeight > dHeight) {
            init()
        }
    })


})

    // 倒计时
    ; (function timer () {
        let hour = ''
        let minute = ''
        let second = ''
        let minutes = ''
        let tmpTime = `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`

        // 记录三天后的时间
        let endTime
        if (localStorage.getItem('endTimeSpike') == null) {
            endTime = new Date(tmpTime).getTime() + 72 * 60 * 60 * 1000 - 1
            localStorage.setItem('endTimeSpike', endTime)
        } else {
            endTime = localStorage.getItem('endTimeSpike')
        }

        let countClock = setInterval(() => {
            var nowTime = new Date()
            var nMS = endTime - nowTime.getTime()
            // 三天到期再追加三天
            if (nMS <= 0) {
                endTime = new Date(tmpTime).getTime() + 72 * 60 * 60 * 1000 - 1
                localStorage.setItem('endTimeSpike', endTime)
            }
            var myD = Math.floor(nMS / (1000 * 60 * 60 * 24))
            // var myH = Math.floor(nMS / (1000 * 60 * 60)) % 24
            var myH = Math.floor(nMS / (1000 * 60 * 60))
            var myM = Math.floor(nMS / (1000 * 60)) % 60
            var myS = Math.floor(nMS / 1000) % 60
            var myMS = Math.floor(nMS / 100) % 10
            if (myD >= 0) {
                if (myH <= 9) myH = '0' + myH
                if (myM <= 9) myM = '0' + myM
                if (myS <= 9) myS = '0' + myS
                if (myMS <= 9) myMS = myMS

                hour = myH
                minute = myM
                second = myS
                minutes = myMS
            } else {
                hour = '00'
                minute = '00'
                second = '00'
                minutes = '0'
            }
            $('#hour').text(hour)
            $('#minute').text(minute)
            $('#second').text(second)
            $('#minutes').text(minutes)
        }, 100)
    })()

// 返回拦截
let backFlag = false	// 解决bug：进详情页后返回到当前页触发拦截事件
let isWeapp = false
envType().then((res) => {
    switch (res) {
        case 2:
            isWeapp = true
            break;
    }
})
// 页面载入时使用pushState插入一条历史记录
history.pushState(null, null, '#')
window.addEventListener('popstate', function (event) {
    // 点击回退时再向历史记录插入一条，以便阻止下一次点击回退
    // history.pushState(null, null, '#' )
    if (backFlag) {
        if (isWeapp) {
            wx.miniProgram.switchTab({ url: '/pages/shopping/shopping' })
        } else {
            window.open('../HOT/index.html', '_self')
        }
    }
})

// 进入页面
$(window).on('pageshow', function () {
    setTimeout(function () {
        backFlag = true
    }, 500)
})
// 离开页面
$(window).on('pagehide', function () {
    backFlag = false
})
