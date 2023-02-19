let winningIndex = 0			// 中奖的位置索引[1-8]
// 奖品数据
let prizeListJson1 = {
	'1': {
		'id': 01,
		'title': '恭喜您，获得iPhone 13!',
		'desc': '获得Apple iPhone 13 全网通5G手机内存512GB!',
		'name': 'iPhone 13',
		'img': 'https://img.quanminyanxuan.com/other/a594f27914f34f84a69d2c89fdfed883.png',
		'my_img': 'https://img.quanminyanxuan.com/other/e4e7c8e9167f412b98fbea3435671318.png',
		'url': 18347,
		'is_get': 0
	},
	'3': {
		'id': 02,
		'title': '恭喜您，获得惊喜大礼包!',
		'desc': '获得惊喜大礼包中的50积分，已为您充值到您的账户，请尽快使用！',
		'name': '50积分',
		'img': 'https://img.quanminyanxuan.com/other/b49647e2357a401f9f21b5854112b254.png',
		'my_img': 'https://img.quanminyanxuan.com/other/b49647e2357a401f9f21b5854112b254.png',
		'url': '../integralCenter/gold.html',
		'is_get': 0
	},
	'2': {
		'id': 03,
		'title': '恭喜您，获得一等奖!',
		'desc': '获得价值￥938元的苹果华为新升级主动降噪智能真无线蓝牙耳机，券后仅需138元！',
		'name':	'苹果华为新升级主动降噪智能真无线蓝牙耳机',
		'img': 'https://img.quanminyanxuan.com/other/da67252ee52b4c11a3ae05d76a654050.png',
		'my_img': 'https://img.quanminyanxuan.com/other/fa442db3cb6249a88ae29ae4d9d0e571.png',
		'url': 20276,
		'is_get': 0
	},
	'5': {
		'id': 04,
		'title': '恭喜您，获得一等奖!',
		'desc': '获得价值￥1398元的【破损包赔】路易萨洛纳珍藏干红葡萄酒14度整箱6瓶，券后仅需198元！',
		'name':	'【破损包赔】路易萨洛纳珍藏干红葡萄酒14度整箱6瓶',
		'img': 'https://img.quanminyanxuan.com/other/86d76b721ba541a1b8c6e1cf046e6e40.png',
		'my_img': 'https://img.quanminyanxuan.com/other/9d8e7cb0508c40cb832c5cc3af9afac9.png',
		'url': 21046,
		'is_get': 0
	},
	'7': {
		'id': 05,
		'title': '恭喜您，获得一等奖!',
		'desc': '获得价值￥1268元的春季裸睡轻薄顺滑保暖不压身贡缎提花蚕丝被棉被芯，券后仅需168元！',
		'name':	'春季裸睡轻薄顺滑保暖不压身贡缎提花蚕丝被棉被芯',
		'img': 'https://img.quanminyanxuan.com/other/a7ca537edc8b4dab9f88e5bae00a2a85.png',
		'my_img': 'https://img.quanminyanxuan.com/other/e043351cd4b540a68e88bea1f67a26ca.png',
		'url': 21129,
		'is_get': 0
	},
}
let prizeListJson2 = {
	'1': {
		'id': 01,
		'title': '恭喜您，获得iPhone 13!',
		'desc': '获得Apple iPhone 13 全网通5G手机内存512GB!',
		'name': 'iPhone 13',
		'img': 'https://img.quanminyanxuan.com/other/a594f27914f34f84a69d2c89fdfed883.png',
		'my_img': 'https://img.quanminyanxuan.com/other/e4e7c8e9167f412b98fbea3435671318.png',
		'url': 18347,
		'is_get': 0
	},
	'3': {
		'id': 02,
		'title': '恭喜您，获得惊喜大礼包!',
		'desc': '获得惊喜大礼包中的50积分，已为您充值到您的账户，请尽快使用！',
		'name': '50积分',
		'img': 'https://img.quanminyanxuan.com/other/b49647e2357a401f9f21b5854112b254.png',
		'my_img': 'https://img.quanminyanxuan.com/other/b49647e2357a401f9f21b5854112b254.png',
		'url': '../integralCenter/gold.html',
		'is_get': 0
	},
	'2': {
		'id': 03,
		'title': '恭喜您，获得一等奖!',
		'desc': '获得价值￥938元的苹果华为新升级主动降噪智能真无线蓝牙耳机，券后仅需138元！',
		'name':	'苹果华为新升级主动降噪智能真无线蓝牙耳机',
		'img': 'https://img.quanminyanxuan.com/other/da67252ee52b4c11a3ae05d76a654050.png',
		'my_img': 'https://img.quanminyanxuan.com/other/fa442db3cb6249a88ae29ae4d9d0e571.png',
		'url': 20276,
		'is_get': 0
	},
	'5': {
		'id': 04,
		'title': '恭喜您，获得一等奖!',
		'desc': '获得价值￥1398元的【破损包赔】路易萨洛纳珍藏干红葡萄酒14度整箱6瓶，券后仅需198元！',
		'name':	'【破损包赔】路易萨洛纳珍藏干红葡萄酒14度整箱6瓶',
		'img': 'https://img.quanminyanxuan.com/other/86d76b721ba541a1b8c6e1cf046e6e40.png',
		'my_img': 'https://img.quanminyanxuan.com/other/9d8e7cb0508c40cb832c5cc3af9afac9.png',
		'url': 21046,
		'is_get': 0
	},
	'7': {
		'id': 05,
		'title': '恭喜您，获得一等奖!',
		'desc': '获得价值￥1268元的春季裸睡轻薄顺滑保暖不压身贡缎提花蚕丝被棉被芯，券后仅需168元！',
		'name':	'春季裸睡轻薄顺滑保暖不压身贡缎提花蚕丝被棉被芯',
		'img': 'https://img.quanminyanxuan.com/other/a7ca537edc8b4dab9f88e5bae00a2a85.png',
		'my_img': 'https://img.quanminyanxuan.com/other/e043351cd4b540a68e88bea1f67a26ca.png',
		'url': 21129,
		'is_get': 0
	},
}
let prizeListJson = Math.round(Math.random()) ? prizeListJson1 : prizeListJson2

// 获取缓存中的奖品
let myPrizeData = []
function getMyPrizeDataShow() {
	myPrizeData = JSON.parse(localStorage.getItem('myPrizeData')) || []
	if (myPrizeData.length > 0) {
		$('#myTimer').removeClass('dn')
		getPrizeTimer()
	}
	let html = ''
	$.each(myPrizeData, (index, item) => {
		// 是否领取
		let oDiv = ''
		if (item.is_get == 0) {
			oDiv = `<div class="btn-get" onclick="myPrizeClick(${item.id}, '${item.url}')">立即领取</div>`
		} else {
			oDiv = `<div class="btn-get past" onclick="myPrizeClick(${item.id}, '${item.url}')">查看</div>`
		}
		html += `<div class="prize-item">
					<div class="cover">
						<img class="img" src="${item.my_img}" >
					</div>
					<div class="name">${item.name}</div>
					${oDiv}
				</div>`
	})
	$('#myPrizeList').html(html)
}

// 我的奖品 -> 立即领取
function myPrizeClick(id, url) {
	let data = JSON.parse(localStorage.getItem('myPrizeData')) || []
	let len = data.length
	for (let i = 0; i < len; i++) {
		if (data[i].id == id) {
			data[i].is_get = 1
			break
		}
	}
	$('.mask2').removeClass('mask2-show')
	localStorage.setItem('myPrizeData', JSON.stringify(data))
	
	// 跳转
	if (url.indexOf('html') != -1) {
		window.open(url, '_self')
	} else {
		openPageDetail(parseInt(url), 'CASH_SCORE')
	}
}

// 删除数组中的某一项 -> arr.remove('a')
Array.prototype.indexOf = function(val) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == val) return i
	}
	return -1
}
Array.prototype.remove = function(val) {
	var index = this.indexOf(val)
	if (index > -1) {
		this.splice(index, 1)
	}
}


// 获取抽中奖品信息
function getDrawPrizeInfo() {
	$('#havePrizeMask .img').attr('src', prizeListJson[winningIndex].img)
	$('#havePrizeMask .title').text(prizeListJson[winningIndex].title)
	$('#havePrizeMask .desc').text(prizeListJson[winningIndex].desc)
	$('#havePrizeMask .btn-open').on('click', function () {
		// 跳转
		let url = prizeListJson[winningIndex].url + ''
		if (url.indexOf('html') != -1) {
			window.open(url, '_self')
		} else {
			openPageDetail(parseInt(url), 'CASH_SCORE')
		}
	})
	// 缓存抽中的奖品
	myPrizeData = JSON.parse(localStorage.getItem('myPrizeData')) || []
	myPrizeData.push(prizeListJson[winningIndex])
	localStorage.setItem('myPrizeData', JSON.stringify(myPrizeData))
	// 显示定时器 -> 我的奖品列表
	localStorage.setItem('endTimeGetPrize', 0)
	$('#myTimer').removeClass('dn')
	getPrizeTimer()
}

// 转盘抽奖动画
function Win(obj, cb) {
	this.timer = null
	this.startIndex = obj.startIndex - 1
	this.count = 0
	this.winningIndex = obj.winningIndex - 1
	this.totalCount = obj.totalCount || 6
	this.speed = obj.speed || 100
	this.domData = this.elementFormat(document.querySelector(obj.el).childNodes)
	this.init()
	this.cb = cb
}
var theSingle = false
Win.prototype = {
    init: function() {
        if (theSingle) {
            return
        }
        theSingle = true
        this.rollFn()
    },
    elementFormat: function(data) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].nodeName === '#text' && !/\S/.test(data[i].nodeValue)) {
                data[i].parentNode.removeChild(data[i])
            }
        }
		data = Array.prototype.slice.call(data)
		data = data.sort(function(a, b) {
			return a.dataset.prizeIndex - b.dataset.prizeIndex
		})
        return data
    },
    rollFn: function() {
        var that = this
        for (var i = 0; i < this.domData.length - 1; i++) {
            this.domData[i].classList.remove('active')
        }
        this.startIndex++
        if (this.startIndex >= this.domData.length - 1) {
            this.startIndex = 0
            this.count++
        }
        this.domData[this.startIndex].classList.add('active')
        if (this.count >= this.totalCount && this.startIndex === this.winningIndex) {
            if (typeof this.cb === 'function') {
                setTimeout(function() {
                    that.cb();
                    theSingle = false
                }, 100)
            }
            clearInterval(this.timer)
        } else {
            if (this.count >= this.totalCount - 1) {
                this.speed += 30
            }
            this.timer = setTimeout(function() {
                that.rollFn()
            }, this.speed)
        }
    }
}

// 倒计时
let countClock = null
function getPrizeTimer() {
	let hour = ''
	let minute = ''
	let second = ''
	let minutes = ''
	
	// 记录15分钟后的时间
	let endTime
	if (!parseInt(localStorage.getItem('endTimeGetPrize'))) {
		endTime = new Date().getTime() + 15 * 60 * 1000
		localStorage.setItem('endTimeGetPrize', endTime)
	} else {
		endTime = localStorage.getItem('endTimeGetPrize')
	}
	
	clearInterval(countClock)
	countClock = setInterval(() => {
		var nowTime = new Date()
		var nMS = endTime - nowTime.getTime()
		// 15分钟到期再追加15分钟
		if (nMS <= 0) {
			endTime = new Date().getTime() + 15 * 60 * 1000
			localStorage.setItem('endTimeGetPrize', endTime)
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
		$('.hour').text(hour)
		$('.minute').text(minute)
		$('.second').text(second)
		$('.minutes').text(minutes)
	}, 100)
}

// 获取当天时间和缓存时间做对比
;(function () {
	let date = new Date()
	let YY = date.getFullYear() + '-'
	let MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
	let DD = ((date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate())) + 0
	let nowDate = YY + MM + DD

	let drawDateCount = localStorage.getItem('drawDateCount')
	if (!drawDateCount) {	// 首次进入
		localStorage.setItem('drawDateCount', nowDate + '/3')
		$('#drawCount').text(3)
	} else {	// 以后进入
		let drawDate = drawDateCount.split('/')[0]
		if (nowDate != drawDate) {	// 第二天以后进入
			localStorage.setItem('drawDateCount', nowDate + '/3')
			localStorage.setItem('nextDayDraw', 1)
			$('#drawCount').text(3)
		} else {					// 当天刷新后进入
			$('#drawCount').text(drawDateCount.split('/')[1])
		}
	}
})()

// 部分dom操作
$(function () {
	
	/**
	 * 每天三次机会
	 * 一、首次进入（第一天）
	 *     第一次：谢谢参与
	 *     第二次：商品或虚拟产品
	 *     第三次：第二次抽中的另一个
	 * 二、以后进入（第二天）
	 *     两次谢谢参与，一次商品或虚拟产品（之前中过的不再中）
	 * 随机数：Math.round(Math.random() * (8 - 1)) + 1
	 */
	
	let noPrizeIndex = [4, 6, 8]	// 未中奖索引
	let couponIndex = [3]			// 虚拟奖品索引[1, 3]
	let productIndex = [2, 5, 7]	// 商品索引
	let allIndex = [noPrizeIndex, couponIndex, productIndex]
	let allPrizeIndex = JSON.parse(localStorage.getItem('allPrizeIndex')) || [3, 2, 5, 7]
	
	let twoFlag = 1	// 记录第二次抽奖是商品还是虚拟产品 [默认是虚拟产品]
	$('#startDraw').on('click', function () {
		// 全部商品都抽中完
		if (allPrizeIndex.length == 0) {
			layer.open({
				content: '该账号抽奖次数已达上限',
				skin: 'msg',
				time: 3
			})
			$('#drawCount').text(0)
			return
		}
		clikStatistics('TXG_DZP_START')
		
		let nextDayDraw = localStorage.getItem('nextDayDraw') || 0	// 是否是第二天以后进入
		let drawDateCount = localStorage.getItem('drawDateCount')
		let drawDate = drawDateCount.split('/')[0]				// 抽奖时间
		let drawCount = drawDateCount.split('/')[1]				// 抽奖次数
		
		// 剩余抽奖次数
		if (!nextDayDraw) {	// 第一天
			if (drawCount == 3) {	// 第一次不中奖
				winningIndex = allIndex[0][Math.round(Math.random() * 2)]
				twoFlag = Math.round(Math.random() * (2 - 1)) + 1	// 记录第二次随机抽中虚拟奖品或商品
				localStorage.setItem('twoDrawFlag', twoFlag)
			}
			else if (drawCount == 2) {
				twoFlag = localStorage.getItem('twoDrawFlag')
				let randomIndex = Math.round(Math.random() * (twoFlag == 1 ? 0 : 2))	// 抽中索引在allIndex中的位置
				winningIndex = allIndex[twoFlag == 1 ? 1 : 2][randomIndex]
				
				// 测试用
				// winningIndex = allIndex[1][0]
			}
			else if (drawCount == 1) {
				twoFlag = localStorage.getItem('twoDrawFlag')
				let randomIndex = Math.round(Math.random() * (twoFlag == 2 ? 0 : 2))	// 抽中索引在allIndex中的位置
				winningIndex = allIndex[twoFlag == 2 ? 1 : 2][randomIndex]
			}
			else if (drawCount <= 0) {
				layer.open({
					content: '您今日已没有抽奖机会',
					skin: 'msg',
					time: 3
				})
				$('#myPrizeBtn').trigger('click')
				return
			}
		} else {	// 第二天以后
			if (drawCount == 3 || drawCount == 2) {	// 前两次不中奖
				winningIndex = allIndex[0][Math.round(Math.random() * 2)]
			}
			else if (drawCount == 1) {
				let randomIndex = Math.round(Math.random() * (allPrizeIndex.length - 1))
				winningIndex = allPrizeIndex[randomIndex]
			}
			else if (drawCount <= 0) {
				layer.open({
					content: '您今日已没有抽奖机会',
					skin: 'msg',
					time: 3
				})
				$('#myPrizeBtn').trigger('click')
				return
			}
		}
		drawCount --			// 次数减1
		$('#drawCount').text(drawCount)
		localStorage.setItem('drawDateCount', drawDate + '/' + drawCount)	// 本地缓存次数
		// 删除抽中的索引
		allPrizeIndex.remove(winningIndex)
		localStorage.setItem('allPrizeIndex', JSON.stringify(allPrizeIndex))
		
		new Win({
			el: '#lottery', // 抽奖元素的父级
			startIndex: 1, 	// 从第几个位置开始抽奖
			totalCount: 4, 	// 一共要转的圈数
			winningIndex: winningIndex, // 中奖的位置索引[1-8]
			speed: 50 // 抽奖动画的速度 [数字越大越慢]
		}, function () {  // 中奖后的回调函数
			$('#lottery .prize-item').each(function () {
				let that = $(this)
				if ($(this).hasClass('active')) {
					// 打印当前中奖信息
					setTimeout(function() {
						// 剩余抽奖次数
						if (!nextDayDraw) {	// 第一天
							if (drawCount == 2) {
								$('#noPrizeMask').addClass('mask-show')
							} else {
								$('#havePrizeMask').addClass('mask-show')
								getDrawPrizeInfo()
							}
						} else {	// 第二天以后
							if (drawCount == 2 || drawCount == 1) {
								$('#noPrizeMask').addClass('mask-show')
							} else {
								$('#havePrizeMask').addClass('mask-show')
								getDrawPrizeInfo()
							}
						}
					}, 1000)
					
				}
			})
		})
	})
	
	// 抽奖弹窗关闭
	$('.closeMask, .btn-again').on('click', function () {
		$('.mask').removeClass('mask-show')
	})
	
	// 规则弹窗显示
	$('#ruleBtn').on('click', function() {
		$('#ruleMask').addClass('mask2-show')
	})
	
	// 我的奖品弹窗显示
	$('#myPrizeBtn').on('click', function() {
		$('#myPrizeMask').addClass('mask2-show')
		getMyPrizeDataShow()
	})
	
	// 规则、我的奖品 弹窗关闭
	$('.closeMask2').on('click', function() {
		$('.mask2').removeClass('mask2-show')
	})
	
	// 跳转详情页
	$(document).on('click', '.product-item-click', function () {
		id = $(this).data('id')
		window.open('../productDetail/livingProductDetail.html?productId=' + id, '_self')
	})
})