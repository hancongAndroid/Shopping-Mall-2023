// let specMap = {}	//查规格信息
let cartItemList = []		//购物车商品列表信息
let orderType = ''		//购物车订单还是单个商品订单

// 获取 购物车 数据
getCartDataToShow()
function getCartDataToShow() {
	let cartList = getCartDataFromLocal()	
	let html = ''
	$.each(cartList, (index, item) => {
		html += `<li class="cart-item">
					<!-- 
					<label class="checked-one">
						<input class="checked-one-ipt" type="checkbox" ${item.selectStatus ? "checked" : ""} data-id="${item.id}">
						<i></i>
					</label>
					 -->
					<img class="icon-del" onclick="deleteFromId(${item.id})" src="https://img.quanminyanxuan.com/service/d981491e8f884fe9934aad182ed0c3d0.png">
					<div class="cart-item-product">
						<img class="cover-img" src="${item.productImg}">
						<div class="product-info">
							<div class="name">
								<img class="icon" src="https://img.quanminyanxuan.com/other/88e8f616266b49fcb938dd77fe28d6c6.png">
								<span>${item.productName}</span>
							</div>
							<div class="select">已选择 ${item.skuSpec}</div>
							<div class="bottom">
								<div class="price">￥${item.price}/件</div>
								<!--
								<div class="btn-group">
									<i class="btn-cut btnChange" data-id=${item.id} data-type='cut'>-</i>
									<span class="num">${item.counts}</span>
									<i class="btn-add btnChange" data-id=${item.id} data-type='add'>+</i>
								</div>
								-->
							</div>
						</div>
					</div>
				</li>`
	})
	$('#cartList').html(html)
	calcTotalAccountAndCounts(cartList)
}

// 获取商品数据
async function getProductInfo(productId) {
	let res = await http('GET', `/mallv2/product/getProductInfoById`, {
		productId
	})
	return res.data
}

// 筛选商品数据添加到购物车
function addToCart(_this) {
	let productId = $(_this).data('id')
	let tempObj = {}
	let keys = ['id', 'productName', 'productImg', 'price']		// 购物车渲染需要用到的属性
	getProductInfo(productId).then(res => {
		let product = res
		console.log(product)
		for (let key in product) {
			if (keys.indexOf(key) >= 0) {
				tempObj[key] = product[key]
			}
		}
		let specMap = product.specMap	// 商品规格
		let skuSpec = specMap[Object.keys(specMap)[0]].skuSpec	// 默认选第一个规格
		let skuId = specMap[Object.keys(specMap)[0]].id			// 规格id
		tempObj.skuSpec = skuSpec
		tempObj.skuId = skuId
		
		$(_this).addClass('dn').siblings('.btn-add-past').removeClass('dn')
		add(tempObj, 1)
	})
}

// 加减商品数目
function changeCounts() {
	let id = $(this).data('id')
	let type = $(this).data('type')
	let counts = 1
	
	if (type == 'cut') {
		counts = -1
	}
	_changeCounts(id, counts)

	calcTotalAccountAndCounts(getCartDataFromLocal())
}

// 单选
function toggleSelectOne() {
	let id = $(this).data('id')
	let status = $(this).is(':checked')
	let data = getCartDataFromLocal()
	let index = getProductIndexById(id)
	
	data[index].selectStatus = status
	calcTotalAccountAndCounts(data)
	resetCartData(data)
}

// 全选
function toggleSelectAll() {
	let status = $(this).is(':checked')
	let data = getCartDataFromLocal()
	
	$('.checked-one-ipt').prop('checked', status)
	for (let i = 0; i < data.length; i++) {
		data[i].selectStatus = status
	}
	calcTotalAccountAndCounts(data)
	resetCartData(data)
}

// 计算总金额和选择的商品总数
function calcTotalAccountAndCounts(data) {
	let len = data.length
	let account = 0
	let selectedCounts = 0		// 总的商品数
	let selectedTypeCounts = 0	// 总的商品类型数
	let multiple = 100	// 避免0.1+0.2=0.30000000000000004

	for (let i = 0; i < len; i++) {
		if (data[i].selectStatus) {
			account += data[i].counts * multiple * Number(data[i].price) * multiple
			selectedCounts += data[i].counts
			selectedTypeCounts ++
		}
	}
	// 是否显示购物车数量
	if (selectedCounts == 0) {
		$('#selectedCounts').addClass('dn')
	} else {
		$('#selectedCounts').removeClass('dn')
	}
	// 是否全选
	if (selectedTypeCounts == len) {
		$('.checked-all-ipt').prop('checked', true)
	} else {
		$('.checked-all-ipt').prop('checked', false)
	}
	// 显示购物车数量和金额
	$('#selectedCounts').text(selectedCounts)
	$('#account').text(account / (multiple * multiple))
	
	
	return {
		selectedCounts: selectedCounts,
		selectedTypeCounts: selectedTypeCounts,
		account: account / (multiple * multiple)
	}
}

// 根据商品id得到 商品所在下标
function getProductIndexById(id) {
	let data = getCartDataFromLocal()
	let len = data.length
	for (let i = 0; i < len; i++) {
		if (data[i].id == id) {
			return i
		}
	}
}

// 加入购物车（本地存储添加数据）
function add(item, counts) {
	let cartData = getCartDataFromLocal()
	if (!cartData) cartData = []
	let isHadInfo = isHasThatOne(item.id, cartData)
	
	if (isHadInfo.index == -1) {		//新商品
		item.counts = counts
		item.selectStatus = true		//默认在购物车中为选中状态
		cartData.push(item)
	} else {							//已有商品
		cartData[isHadInfo.index].counts += counts
	}
	resetCartData(cartData)
	getCartDataToShow()
	return cartData
}

// 获取购物车
function getCartDataFromLocal(flag) {
	let res = JSON.parse(localStorage.getItem('cartData'))
	if (!res) res = []
	
    //在下单的时候过滤不下单的商品
    // if (flag) {
    //   var newRes = [];
    //   for (let i = 0; i < res.length; i++) {
    //     if (res[i].selectStatus) {
    //       newRes.push(res[i]);
    //     }
    //   }
    //   res = newRes;
    // }
	return res
}

// 购物车中是否已经存在该商品
function isHasThatOne(id, arr) {
	let item
	let result = {index: -1}
	
	for (let i = 0; i < arr.length; i++) {
		item = arr[i]
		if (item.id == id) {
			result = {
				index: i,
				data: item
			}
			break
		}
	}
	return result
}

// 获得购物车商品总数目
function getCartTotalCounts(flag) {
	let data = getCartDataFromLocal()
	let counts = 0
	
	for (let i = 0; i < data.length; i++) {
		if (flag) {				// 选中
			if (data[i].selectStatus) {
				counts += data[i].counts
			}
		} else {				// 未选中
			counts += data[i].counts
		}
	}
	return counts
}

// 修改商品数目
function _changeCounts(id, counts) {
	let cartData = getCartDataFromLocal()
	let hasInfo = isHasThatOne(id, cartData)

	if (hasInfo.index != -1) {
		if (counts == -1 && hasInfo.data.counts == 1) return
		cartData[hasInfo.index].counts += counts
		// if (hasInfo.data.counts < 1) {
		// 	cartData.splice(hasInfo.index, 1)	//数目减到0，从购物车删除这一项
		// }
	}
	resetCartData(cartData)
	getCartDataToShow()
}

// 删除商品
function deleteFromId(ids) {
	if (!(ids instanceof Array)) {
		ids = [ids]
	}
	let cartData = getCartDataFromLocal()

	for (let i = 0; i < ids.length; i++) {
		let hasInfo = isHasThatOne(ids[i], cartData)
		if (hasInfo.index != -1) {
			cartData.splice(hasInfo.index, 1)	//删除数组某一项
			
			// 恢复加入购物车按钮
			$('.btn-add-o').each(function() {
				if ($(this).data('id') == ids[i]) {
					$(this).removeClass('dn').siblings('.btn-add-past').addClass('dn')
				}
			})
		}
	}

	resetCartData(cartData)
	getCartDataToShow()
}

// 更新购物车数据
function resetCartData(data) {
	localStorage.setItem('cartData', JSON.stringify(data))
}

// 倒计时
(function timer(end) {
	let hour = ''
	let minute = ''
	let second = ''
	let minutes = ''
	let tmpTime = end ? end : `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`
	// var dateTime = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
	var dateTime = new Date(
		new Date(tmpTime).getTime() + 24 * 60 * 60 * 1000 - 1
	)
	let countClock = setInterval(() => {
		var endTime = new Date(dateTime.getTime())
		var nowTime = new Date()
		var nMS = endTime.getTime() - nowTime.getTime()
		var myD = Math.floor(nMS / (1000 * 60 * 60 * 24))
		var myH = Math.floor(nMS / (1000 * 60 * 60)) % 24
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
		// $('#minutes').text(minutes)
	}, 1000)
})()

// 部分dom操作
$(function () {
	
	// 加入购物车
	$(document).on('click', '.btn-add-o', function (e) {
		addToCart(this)
		e.stopPropagation()	//阻止事件冒泡即可
	})

	// 加减商品数目
	$(document).on('click', '.btnChange', changeCounts)
	
	// 单选
	$(document).on('click', '.checked-one-ipt', toggleSelectOne)
	
	// 全选
	$(document).on('click', '.checked-all-ipt', toggleSelectAll)

	// 购物车弹窗显示
	$('#cartBtn').on('click', function() {
		$('body, #cartMask').toggleClass('show')
	})
	
	// 优惠弹窗显示
	$('#discBtn').on('click', function() {
		$('#discMask').addClass('show')
	})
	
	// 购物车弹窗关闭
	$('#closeCart').on('click', function() {
		$('body, #cartMask').removeClass('show')
	})
	
	// 优惠弹窗关闭
	$('#closeDesc').on('click', function() {
		$('#discMask').removeClass('show')
	})
	
	// 选规格 下一步按钮
	$('.btn-go-pay').on('click', function() {
		let counts = getCartTotalCounts()
		if (counts == 0) {
			layer.open({
				content: '请先添加商品进购物车',
				skin: 'msg',
				time: 1
			})
			return
		}
		// 单个商品下单显示规格
		orderType = $(this).data('type')
		if (orderType == 'one') {
			$('#simpleAddress .info').removeClass('dn')
			addToCart()
		} else {
			$('#simpleAddress .info').addClass('dn')
		}
		// 本地存储有地址信息直接下单，不用弹出填地址
		if (!$.isEmptyObject(userAddress)) {
			if (userAddress.userName && userAddress.tel && userAddress.address) {
				$('#determineAddress').trigger('click')
			} else {
				$('#simpleAddress').addClass('show')
			}
		} else {
			$('#simpleAddress').addClass('show')
		}
	})
	
	// 地址 确定按钮
	$('#determineAddress').on('click', confirmOrder)
	
	// 关闭地址弹窗
	$('#closeAddress').on('click', function () {
		$('#simpleAddress').removeClass('show')
		//提交意向订单
		if ($(this).attr('id') == 'closeAddress') {
			fakeOrder()
		}
	})

})

// 获取用户本地存储地址
let userAddress = JSON.parse(localStorage.getItem('userAddress')) || {}
if (!$.isEmptyObject(userAddress)) {
	$('#addressFormPhone').val(userAddress.tel)
	$('#addressFormUsername').val(userAddress.userName)
	$('#addressFormDetail').val(userAddress.address)
	if (!$.isEmptyObject(userAddress.addressObj)) {
		$('#addressFormProvince').text(userAddress.addressObj.province)
		$('#addressFormCity').text(userAddress.addressObj.city)
		$('#addressFormArea').text(userAddress.addressObj.area)
	}
} else {
	getUserAddress()
}

// 获取用户网络地址
function getUserAddress() {
	http('GET', `/users/users/getAddressByIp`).then((res) => {
		if (res.data.province) {
			$('#addressFormProvince').text(res.data.province)
			$('#addressFormCity').text(res.data.city)
			$('#addressFormArea').text(res.data.area)
		} else {
			$('#addressFormProvince').text('请选择')
			$('#addressFormCity').text('请选择')
			$('#addressFormArea').text('请选择')
		}
	}, err => {
		console.log(err)
	})
}

// 获取购物车商品列表信息
function getCartItemList() {
	cartItemList = []
	let cartData = getCartDataFromLocal()
	let keys = ['id', 'skuId']
	for (let i = 0; i < cartData.length; i++) {
		// 购买单个商品，过滤购物车其它商品
		if (orderType == 'one' && cartData[i].id != productInfo.id) {
			continue
		}
		// 拼接下单需要的数据
		let tempObj = {}
		for (let key in cartData[i]) {
			if (keys.indexOf(key) >= 0) {
				if (key == 'id') {
					tempObj.productId = cartData[i][key]
				} else if (key == 'skuId') {
					tempObj.productSpecId = cartData[i][key]
				}
			}
		}
		tempObj.productSum = 1
		tempObj.activityType = "CASH_SCORE"
		cartItemList.push(tempObj)
	}
}

// 提交订单
function confirmOrder() {
	getCartItemList()
	console.log(cartItemList)
	if (cartItemList.length == 0) return
	let tel = $('#addressFormPhone').val(),
		userName = $('#addressFormUsername').val(),
		address = $('#addressFormDetail').val(),
		province = $('#addressFormProvince').text(),
		city = $('#addressFormCity').text(),
		area = $('#addressFormArea').text();
		
	// 校验地址
	if (userName.trim() == '') {
		layer.open({
			content: '请填写姓名',
			skin: 'msg',
			time: 1
		});
		$('#addressFormUsername').focus();
		return;
	}
	if (!/^1[3456789]\d{9}$/.test(tel)) {
		layer.open({
			content: '请填写正确的手机号',
			skin: 'msg',
			time: 1
		});
		$('#addressFormPhone').focus();
		return;
	}
	if (province == '请选择' || city == '请选择' || area == '请选择') {
		layer.open({
			content: '请选择地址',
			skin: 'msg',
			time: 1
		});
		$('#selCity').trigger("click");
		return;
	}
	if (address.trim() == '') {
		layer.open({
			content: '请填写详细地址',
			skin: 'msg',
			time: 1
		})
		$('#addressFormDetail').focus();
		return;
	}
	
	// 用户信息和地址存储本地
	let _address = {
		province,
		city,
		area
	}
	userAddress.addressObj = _address
	userAddress.addressStr = `${province}${city}${area}`
	userAddress.tel = tel
	userAddress.userName = userName
	userAddress.address = address
	localStorage.setItem('userAddress', JSON.stringify(userAddress))

	http('POST', `/mallv2/order/h5CartCreateOrder`, {
		cartItemList: cartItemList,
		createType: 'H5CART',
		tel: tel,
		userName: userName,
		address: address,
		province: province,
		city: city,
		area: area
	}).then((res) => {
		if (res.code == 200) {
			let orderId = res.data
			let cashPay = 0
			let token = getCookie('token')
			let channel = getCookie('channel')
			window.location.href = `https://sale.quanminyanxuan.com/h5/svip/pages/order/cartOrderDetails.html?orderId=${orderId}&cashPay=${cashPay}&sourcePlatform=${sourcePlatform}&token=${token}&channel=${channel}`;
		} else {
			layer.open({
				content: res.message,
				skin: 'msg',
				time: 1
			})
		}
	}, err => {
		console.log(err)
	})
}

// 提交订单 -- 意向订单（点关闭地址弹窗）
function fakeOrder() {
	getCartItemList()
	console.log(cartItemList)
	let tel = $('#addressFormPhone').val(),
		userName = $('#addressFormUsername').val(),
		address = $('#addressFormDetail').val(),
		province = $('#addressFormProvince').text(),
		city = $('#addressFormCity').text(),
		area = $('#addressFormArea').text();

	// 没输电话号码不提交地址
	if (!/^1[3456789]\d{9}$/.test(tel)) {
		province = ''
		city = ''
		area = ''
	}
		
	http('POST', `/mallv2/order/h5CreateOrder`, {
		cartItemList: cartItemList,
		createType: 'H5CART',

		tel: tel,
		userName: userName,
		address: address,
		province: province,
		city: city,
		area: area
	}).then((res) => {
		// let orderId = res.data
		// let cashPay = 0
		// let token = getCookie('token')
		// let channel = getCookie('channel')
		// window.location.href = `https://sale.quanminyanxuan.com/h5/svip/pages/order/cartOrderDetails.html?orderId=${orderId}&cashPay=${cashPay}&sourcePlatform=${sourcePlatform}&token=${token}&channel=${channel}`;
	}, err => {
		console.log(err)
	})
}

// 地址弹窗 
(function () {
	var nameEl = document.getElementById('selCity');
	
	var first = [];		//省，直辖市
	var second = [];	//市
	var third = [];		//镇
	
	var selectedIndex = [0, 0, 0];	//默认选中的地区
	var checked = [0, 0, 0];		//已选选项
	
	function creatList(obj, list) {
		obj.forEach(function (item, index, arr) {
			var temp = new Object();
			temp.text = item.name;
			temp.value = index;
			list.push(temp);
		})
	}
	
	creatList(city, first);
	
	if (city[selectedIndex[0]].hasOwnProperty('sub')) {
		creatList(city[selectedIndex[0]].sub, second);
	} else {
		second = [{text: '', value: 0}];
	}
	
	if (city[selectedIndex[0]].sub[selectedIndex[1]].hasOwnProperty('sub')) {
		creatList(city[selectedIndex[0]].sub[selectedIndex[1]].sub, third);
	} else {
		third = [{text: '', value: 0}];
	}
	
	var picker = new Picker({
		data: [first, second, third],
		selectedIndex: selectedIndex,
		title: '地址选择'
	});
	
	picker.on('picker.select', function (selectedVal, selectedIndex) {
		var text1 = first[selectedIndex[0]].text;
		var text2 = second[selectedIndex[1]].text;
		var text3 = third[selectedIndex[2]] ? third[selectedIndex[2]].text : '';
	
		// nameEl.innerText = text1 + ' ' + text2 + ' ' + text3;
		$('#addressFormProvince').text(text1);
		$('#addressFormCity').text(text2);
		$('#addressFormArea').text(text3);
	});
	
	picker.on('picker.change', function (index, selectedIndex) {
		if (index === 0) {
			firstChange();
		} else if (index === 1) {
			secondChange();
		}
	
		function firstChange() {
			second = [];
			third = [];
			checked[0] = selectedIndex;
			var firstCity = city[selectedIndex];
			if (firstCity.hasOwnProperty('sub')) {
				creatList(firstCity.sub, second);
	
				var secondCity = city[selectedIndex].sub[0]
				if (secondCity.hasOwnProperty('sub')) {
					creatList(secondCity.sub, third);
				} else {
					third = [{text: '', value: 0}];
					checked[2] = 0;
				}
			} else {
				second = [{text: '', value: 0}];
				third = [{text: '', value: 0}];
				checked[1] = 0;
				checked[2] = 0;
			}
	
			picker.refillColumn(1, second);
			picker.refillColumn(2, third);
			picker.scrollColumn(1, 0)
			picker.scrollColumn(2, 0)
		}
	
		function secondChange() {
			third = [];
			checked[1] = selectedIndex;
			var first_index = checked[0];
			if (city[first_index].sub[selectedIndex].hasOwnProperty('sub')) {
				var secondCity = city[first_index].sub[selectedIndex];
				creatList(secondCity.sub, third);
				picker.refillColumn(2, third);
				picker.scrollColumn(2, 0)
			} else {
				third = [{text: '', value: 0}];
				checked[2] = 0;
				picker.refillColumn(2, third);
				picker.scrollColumn(2, 0)
			}
		}
	
	});
	
	picker.on('picker.valuechange', function (selectedVal, selectedIndex) {
		console.log(selectedVal);
		console.log(selectedIndex);
	});
	
	nameEl.addEventListener('click', function () {
		picker.show();
	});
})()