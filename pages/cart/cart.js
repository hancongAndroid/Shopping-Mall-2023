let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]

let pageNum = 1
let isLoading = false		//判断瀑布流是否加载中
let headImgArr = []			//用户头像

// 排行 左上角标签
let rankingIcon = [
	'https://img.quanminyanxuan.com/other/4b3cc500fec4450385938af6d10bddbb.png',
	'https://img.quanminyanxuan.com/other/0d4897f98efa49b2b6a742d7ad0d0e7c.png',
	'https://img.quanminyanxuan.com/other/cc1e0864144f49f0b6190696a753c0dd.png',
	'https://img.quanminyanxuan.com/other/b50d29382e9f44c0bac0a025c6de34c8.png',
	'https://img.quanminyanxuan.com/other/a07798d37ec94ea09e290a1699e048ed.png',
	'https://img.quanminyanxuan.com/other/51685fa90a3e40d5869f8012dbf37c58.png'
]

pageStatistics() 			// 页面统计
getUserInfo(sourcePlatform)	// 获取用户信息


// 获取 积分商品 数据
getProductList()
function getProductList() {
	if (isLoading) return
	isLoading = true
	http('GET', `/mallv2/h5/activity/queryListByPage`, {
		columnId: 187,
		pageNum,
		pageSize: 20,
		flag: 0,
		activityType: 'CASH_SCORE'
	}).then((res) => {
		isLoading = false
		let productList = res.data.sort(randomSort)
		if (productList.length == 0) isLoading = true
		pageNum ++
		
		// 商品数据渲染
		productListScore(productList, $('#productList'))
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
		
		// 向上滚动
		let user = ''
		$.each(fakeUsers, (index, item) => {
			user += `<div class="swiper-slide">
						<div class="roll-item">
							<img class="img" src="${item.headImg}" >
							<div class="roll-text">${item.nickname}使用消费补贴金换购了商品，节省了${item.money}元!</div>
						</div>
					</div>`
		})
		$('#userRandom').html(user);
		new Swiper ('.swiper-container-random', {
			direction: 'vertical',
			autoplay: {
				delay: 4000,
				disableOnInteraction: false
			},
			speed: 500,
			loop: true
		})
		
		// 向左滚动
		let user2 = ''
		$.each(fakeUsers, (index, item) => {
			user2 += `<div class="swiper-slide">
						<img class="img" src="${item.headImg}" />
					</div>`
		})
		$('#userRandomHead, #userRandomHead2').html(user2);
		new Swiper('.swiper-container-user', {
			autoplay: {
				delay: 0,
				disableOnInteraction: false
			},
			loop: true,
			speed: 1500,
			slidesPerView: 4
		})
		let people = Number((Math.random()*2000).toFixed(0))
		if(people == 0){
			people = (Math.random()*2000).toFixed(0)
		}else if(people < 1000){
			people = people + 1000
		}else if(people > 3000){
			people = 2685
		}
		$('#peo').text(people)
	}, err => {
		console.log(err)
	})
}


// 倒计时
;(function timer() {
	let hour = ''
	let minute = ''
	let second = ''
	let minutes = ''
	let hour1 = ''
	let minute1 = ''
	let second1 = ''
	let minutes1 = ''
	let tmpTime = `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`
	
	// 记录三天后的时间
	let endTime
	if (localStorage.getItem('endTimeOldOfNew') == null) {
		endTime = new Date(tmpTime).getTime() + 72 * 60 * 60 * 1000 - 1
		localStorage.setItem('endTimeOldOfNew', endTime)
	} else {
		endTime = localStorage.getItem('endTimeOldOfNew')
	}
	
	let countClock = setInterval(() => {
		var nowTime = new Date()
		var nMS = endTime - nowTime.getTime()
		// 三天到期再追加三天
		if (nMS <= 0) {
			endTime = new Date(tmpTime).getTime() + 72 * 60 * 60 * 1000 - 1
			localStorage.setItem('endTimeOldOfNew', endTime)
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
		  hour1 = myH
		  minute1 = myM
		  second1 = myS
		  minutes1 = myMS
		} else {
		  hour = '00'
		  minute = '00'
		  second = '00'
		  minutes = '0'
		  hour1 = '00'
		  minute1 = '00'
		  second1 = '00'
		  minutes1 = '0'
		}
		$('#hour').text(hour)
		$('#minute').text(minute)
		$('#second').text(second)
		$('#minutes').text(minutes)
		$('#hour1').text(hour)
		$('#minute1').text(minute1)
		$('#second1').text(second1)
		$('#minutes1').text(minutes1)
	}, 100)
})()
				
// 部分dom操作
$(function () {
	$(document).on('click','#appBar',function () {
        window.open('../HOT/index.html', '_self')
        // let isWX = isWeiXin()
        // if (isWX) {
        //     openWeapp2('pages/shopping/shopping', '')
        // }else{
        //     downAppgo()
        // }
		// clikStatistics('CART_APP')
	})
	
	// 页面滚动事件
	$(window).on('scroll', function () {
		let scrollTop = $(this).scrollTop()
		let wHeight = $(this).height()
		let dHeight = $(document).height() -300
		
		// 滚动到底部
		if (scrollTop + wHeight > dHeight) {
			getProductList()
		}
	})
	
})