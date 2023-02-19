let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]
let columnId = 45
let pageNum = 1
let isLoading = false		//判断瀑布流是否加载中
let headImgArr = []			//用户头像

let channel1 = getUrlKey('channel')
let channel2 = getCookie('channel')


pageStatistics() 			// 页面统计
getUserInfo(sourcePlatform)	// 获取用户信息

// 获取轮播图商品
function getColumnProductList1() {
	http('GET', `/mallv2/app/oldfornew/queryOldForNewCenter`).then((res) => {
		let productList = res.data.columnList[0].productList
		// 商品图
		let img = ''
		$.each(productList, (index, item) => {
			img += `<div class="swiper-slide" onclick="window.open('../productDetail/newsProductDetail.html?productId=${item.id}&productType=4', '_self')">
						<img class="img" src="${item.productImg}" />
						<img class="img1" src="https://img.quanminyanxuan.com/other/14c07df08ede469c86b6ec522fd904ef.png" />
					</div>`
		})
		// 商品信息
		let info = ''
		$.each(productList, (index, item) => {
			// 用户头像
			let oImg = ''
			for (let i = 0; i < 3; i++) {
				oImg += `<img class="img" src="${headImgArr[parseInt(Math.random()*headImgArr.length,10)]}">`
			}
			info += `<div class="info-item" onclick="window.open('../productDetail/newsProductDetail.html?productId=${item.id}&productType=4', '_self')">
						<div class="label">补贴额度${item.activityMax}元</div>
						<div class="price">￥<span class="num">${item.curPrice}</span></div>
						<div class="name">${item.productName}</div>
						<div class="sell-box">
							<div class="user-head">
								${oImg}
							</div>
							<div class="sell-num">已有${filterVolume(item.volumeStr)}人抢购</div>
							<div class="btn"></div>
						</div>
					</div>`
		})
		$('#bannerImg').html(img)
		$('#bannerInfo').html(info)
		// 轮播图
		let banner = new Swiper ('.swiper-container-banner', {
			autoplay: {
				delay: 3500,
				disableOnInteraction: false
			},
			slidesPerView: 3,
			centeredSlides: true,
			spaceBetween: 28,
			speed: 1000,
			loop: true,
			on: {
				slideChangeTransitionEnd: function(){
					let idx = this.realIndex
					$('#bannerInfo .info-item').eq(idx).addClass('active').siblings().removeClass('active').css('opacity', '0')
					
					$('.banner .swiper-slide-active .img1').fadeTo(500,1);
					setTimeout(()=>{
					$('.banner .swiper-slide .img1').hide()
					},3500)
					$('#bannerInfo .info-item').eq(idx).animate({ 
						opacity: '1',
						transform: 'translateX(-20px)'
					}, 500)
					
					let sVal1 = parseInt($('#count1').text())
					let eVal1 = parseInt($('#count1').text()) + parseInt((Math.random()*200).toFixed(0))
					let sVal2 = parseInt($('#count2').text())
					let eVal2 = parseInt($('#count2').text()) + parseInt((Math.random()*1000).toFixed(0))
					let sVal3 = parseInt($('#count3').text())
					let eVal3 = parseInt($('#count3').text()) + parseInt((Math.random()*100).toFixed(0))
					let options = {
						useEasing: true,		// 过渡动画效果
						useGrouping: false  	// 千分位效果，1000->1,000
					}
					// target,	startVal, endVal, decimals, duration, options
					// dom节点, 初始值,    结束值, 小数位数, 过渡几秒,  初始参数
					new CountUp('count1', sVal1, eVal1, 0, 1, options).start()
					new CountUp('count2', sVal2, eVal2, 0, 1, options).start()
					new CountUp('count3', sVal3, eVal3, 0, 1, options).start()
				}
			}
		})
	}, err => {
		console.log(err)
	})
}

// 获取补贴金额
getAumont()
function getAumont() {
	http('GET', `/mallv2/h5/oldfornew/account`).then((res) => {
		let used = res.data.used == null ? 0 : parseInt(res.data.used)
		let aumont = 4000 - used < 0 ? 0 : 4000 - used
		$('#aumont').text(aumont)
		$('#aumont1').text(aumont)
		$('#aumont2').text(aumont)
	}, err => {
		console.log(err)
	})
}

// 获取 瀑布流商品 数据
getColumnProductList()
function getColumnProductList() {
	if (isLoading) return
	isLoading = true
	http('GET', `/mallv2/app/oldfornew/queryOldForNewListByPage`, {
		columnId,
		pageNum,
		pageSize: 30
	}).then((res) => {
		isLoading = false
		let productList = res.data
		// console.log('瀑:', productList)
		if (productList.length == 0) {
			isLoading = true
			scrollBottomSwitchList()
		}
		pageNum ++
		
		// 商品数据渲染
		productListShow(productList, $('#productList'))
	}, err => {
		console.log(err)
	})
}

// 获取 滚动用户列表 数据
getFakeUsers()
function getFakeUsers() {
	http('GET', `/mallv2/activity/getFakeUserList`, {
		activityType: 'OLD_FOR_NEW'
	}).then((res) => {
		let fakeUsers = res.data
		// console.log('用户:', fakeUsers)
		$.each(fakeUsers, (index, item) => {
			headImgArr.push(item.headImg)
		})
		getColumnProductList1()
	}, err => {
		console.log(err)
	})
}

// 滚动到底部自动切换到下一个导航
function scrollBottomSwitchList() {
	let idx = $('.scroll-view-item.active').index()
	let len = $('.scroll-view-item').length
	if ((idx + 1) ==  len) return
	$('.scroll-view-item').eq(idx + 1).trigger('click')
}

// 数字滚动累加效果
function CountUp(target, startVal, endVal, decimals, duration, options) {
	let self = this
	self.options = {
		useEasing: true,
		useGrouping: true,
		separator: ",",
		decimal: ".",
		easingFn: easeOutExpo,
		formattingFn: formatNumber,
		prefix: "",
		suffix: "",
		numerals: []
	}
	if (options && typeof options === "object") {
		for (let key in self.options) {
			if (options.hasOwnProperty(key) && options[key] !== null) {
				self.options[key] = options[key]
			}
		}
	}
	if (self.options.separator === "") {
		self.options.useGrouping = false
	} else {
		self.options.separator = "" + self.options.separator
	}
	let lastTime = 0
	let vendors = ["webkit", "moz", "ms", "o"]
	for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"]
		window.cancelAnimationFrame = window[vendors[x] + "CancelAnimationFrame"] || window[vendors[x] + "CancelRequestAnimationFrame"]
	}
	if (!window.requestAnimationFrame) {
		window.requestAnimationFrame = function(callback, element) {
			let currTime = new Date().getTime()
			let timeToCall = Math.max(0, 16 - (currTime - lastTime))
			let id = window.setTimeout(
				function() {
					callback(currTime + timeToCall)
				},
				timeToCall
			)
			lastTime = currTime + timeToCall
			return id
		}
	}
	if (!window.cancelAnimationFrame) {
		window.cancelAnimationFrame = function(id) {
			clearTimeout(id)
		}
	}
	function formatNumber(num) {
		num = num.toFixed(self.decimals)
		num += ""
		let x, x1, x2, x3, i, l
		x = num.split(".")
		x1 = x[0]
		x2 = x.length > 1 ? self.options.decimal + x[1] : ""
		if (self.options.useGrouping) {
			x3 = ""
			for (i = 0, l = x1.length; i < l; ++i) {
				if (i !== 0 && ((i % 3) === 0)) {
					x3 = self.options.separator + x3
				}
				x3 = x1[l - i - 1] + x3
			}
			x1 = x3
		}
		if (self.options.numerals.length) {
			x1 = x1.replace(/[0-9]/g,
			function(w) {
				return self.options.numerals[ + w]
			})
			x2 = x2.replace(/[0-9]/g,
			function(w) {
				return self.options.numerals[ + w]
			})
		}
		return self.options.prefix + x1 + x2 + self.options.suffix
	}
	function easeOutExpo(t, b, c, d) {
		return c * ( - Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b
	}
	function ensureNumber(n) {
		return (typeof n === "number" && !isNaN(n))
	}
	self.initialize = function() {
		if (self.initialized) {
			return true
		}
		self.error = ""
		self.d = (typeof target === "string") ? document.getElementById(target) : target
		if (!self.d) {
			self.error = "[CountUp] target is null or undefined"
			return false
		}
		self.startVal = Number(startVal)
		self.endVal = Number(endVal)
		if (ensureNumber(self.startVal) && ensureNumber(self.endVal)) {
			self.decimals = Math.max(0, decimals || 0)
			self.dec = Math.pow(10, self.decimals)
			self.duration = Number(duration) * 1000 || 2000
			self.countDown = (self.startVal > self.endVal)
			self.frameVal = self.startVal
			self.initialized = true
			return true
		} else {
			self.error = "[CountUp] startVal (" + startVal + ") or endVal (" + endVal + ") is not a number"
			return false
		}
	}
	self.printValue = function(value) {
		let result = self.options.formattingFn(value)
		if (self.d.tagName === "INPUT") {
			this.d.value = result
		} else {
			if (self.d.tagName === "text" || self.d.tagName === "tspan") {
				this.d.textContent = result
			} else {
				this.d.innerHTML = result
			}
		}
	}
	self.count = function(timestamp) {
		if (!self.startTime) {
			self.startTime = timestamp
		}
		self.timestamp = timestamp
		let progress = timestamp - self.startTime
		self.remaining = self.duration - progress
		if (self.options.useEasing) {
			if (self.countDown) {
				self.frameVal = self.startVal - self.options.easingFn(progress, 0, self.startVal - self.endVal, self.duration)
			} else {
				self.frameVal = self.options.easingFn(progress, self.startVal, self.endVal - self.startVal, self.duration)
			}
		} else {
			if (self.countDown) {
				self.frameVal = self.startVal - ((self.startVal - self.endVal) * (progress / self.duration))
			} else {
				self.frameVal = self.startVal + (self.endVal - self.startVal) * (progress / self.duration)
			}
		}
		if (self.countDown) {
			self.frameVal = (self.frameVal < self.endVal) ? self.endVal: self.frameVal
		} else {
			self.frameVal = (self.frameVal > self.endVal) ? self.endVal: self.frameVal
		}
		self.frameVal = Math.round(self.frameVal * self.dec) / self.dec
		self.printValue(self.frameVal)
		if (progress < self.duration) {
			self.rAF = requestAnimationFrame(self.count)
		} else {
			if (self.callback) {
				self.callback()
			}
		}
	}
	self.start = function(callback) {
		if (!self.initialize()) {
			return
		}
		self.callback = callback
		self.rAF = requestAnimationFrame(self.count)
	}
	self.pauseResume = function() {
		if (!self.paused) {
			self.paused = true
			cancelAnimationFrame(self.rAF)
		} else {
			self.paused = false
			delete self.startTime
			self.duration = self.remaining
			self.startVal = self.frameVal
			requestAnimationFrame(self.count)
		}
	}
	self.reset = function() {
		self.paused = false
		delete self.startTime
		self.initialized = false
		if (self.initialize()) {
			cancelAnimationFrame(self.rAF)
			self.printValue(self.startVal)
		}
	}
	self.update = function(newEndVal) {
		if (!self.initialize()) {
			return
		}
		newEndVal = Number(newEndVal)
		if (!ensureNumber(newEndVal)) {
			self.error = "[CountUp] update() - new endVal is not a number: " + newEndVal
			return
		}
		self.error = ""
		if (newEndVal === self.frameVal) {
			return
		}
		cancelAnimationFrame(self.rAF)
		self.paused = false
		delete self.startTime
		self.startVal = self.frameVal
		self.endVal = newEndVal
		self.countDown = (self.startVal > self.endVal)
		self.rAF = requestAnimationFrame(self.count)
	}
	if (self.initialize()) {
		self.printValue(self.startVal)
	}
}
				
// 部分dom操作
$(function () {

	// 选项卡切换商品列表
	$('#tabtxBox').on('click', '.scroll-view-item', function() {
		if ($(this).hasClass('active')) return	//点击当前无操作
		if ($(this).index() == 3) {
			$('#tabtxBox .scroll-view').scrollLeft(100)
		}
		pageNum = 1
		isLoading = false
		$(this).addClass('active').siblings().removeClass('active')
		let idx = $(this).index()
		// banner.slideToLoop(idx, 500, false)
		switchProductList(idx)
		// switchBgCollor(idx)
		$('#productList').html('')
		$('html, body').scrollTop($('#tabtxWrap').offset().top + 2)
	})
	
	// 商品列表切换
	function switchProductList(idx) {
		if (idx == 0) {
			columnId = 45
		} else if (idx == 1) {
			columnId = 43
		} else if (idx == 2) {
			columnId = 42
		} else if (idx == 3) {
			columnId = 41
		} else if (idx == 4) {
			columnId = 44
		}
		getColumnProductList()
	}

	// 页面滚动事件
	$(window).on('scroll', function () {
		let scrollTop = $(this).scrollTop()
		let wHeight = $(this).height()
		let dHeight = $(document).height() -300
		
		// 导航固定
		let tabtxWrap = $('#tabtxWrap')
		let tabtxBox = $('#tabtxBox')
		let tabtxWrapTop = tabtxWrap.offset().top
		if (tabtxWrapTop > scrollTop) {
			$('.oldForNewBar').show()
		}else if(tabtxWrapTop - 20 < scrollTop){
			$('.oldForNewBar').hide()
		}
		
		if (tabtxWrapTop < scrollTop) {
			tabtxBox.addClass('fixed')
		} else {
			tabtxBox.removeClass('fixed')
		}
		
		// 滚动到底部
		if (scrollTop + wHeight > dHeight) {
			getColumnProductList()
			isLoading = true
		}
	})
	
})