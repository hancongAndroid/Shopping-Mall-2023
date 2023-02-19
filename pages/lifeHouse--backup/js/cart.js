// let specMap = {}	//查规格信息

// 获取 购物车 数据
getCartDataToShow()
function getCartDataToShow() {
	let cartList = getCartDataFromLocal()	
	let html = ''
	$.each(cartList, (index, item) => {
		html += `<li class="cart-item">
					<label class="checked-one">
						<input class="checked-one-ipt" type="checkbox" ${item.selectStatus ? "checked" : ""} data-id="${item.id}">
						<i></i>
					</label>
					<div class="cart-item-product">
						<img class="cover-img" src="${item.productImg}">
						<div class="product-info">
							<div class="name">
								<img class="icon" src="https://img.quanminyanxuan.com/other/88e8f616266b49fcb938dd77fe28d6c6.png">
								<span>${item.productName}</span>
							</div>
							<div class="select">已选择 雾霾深紫</div>
							<div class="bottom">
								<div class="price">￥${item.price}/件</div>
								<div class="btn-group">
									<i class="btn-cut btnChange" data-id=${item.id} data-type='cut'>-</i>
									<span class="num">${item.counts}</span>
									<i class="btn-add btnChange" data-id=${item.id} data-type='add'>+</i>
								</div>
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
function addToCart() {
	let productId = $(this).data('id')
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
		if (Object.keys(specMap).length > 1) {
			console.log(Object.keys(specMap).length)
		} else {
			$(this).addClass('dn').siblings('.btn-group').removeClass('dn').find('.num').text(1)
			add(tempObj, 1)
		}
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
		// if (hasInfo.data.counts > 1) {
			cartData[hasInfo.index].counts += counts
			if (hasInfo.data.counts < 1) {
				cartData.splice(hasInfo.index, 1)	//数目减到0，从购物车删除这一项
			}
		// }
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
	$(document).on('click', '.btn-add-o', addToCart)
	
	// 加减商品数目（外部--商品列表）
	$(document).on('click', '.btnChangeExt', changeCounts)
	
	// 加减商品数目（内部--购物车）
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

})