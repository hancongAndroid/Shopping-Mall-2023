// 获取省市区地址库
function getCityData() {
	http('GET', `/mallv2/address/getH5Address`).then((res) => {
		let city = res.data
		city.unshift({
			"name": "请选择",
			"sub": [
				{
					"name": "请选择",
					"sub": [
						{
							"name": "请选择"
						}
					],
					"type": 0
				}
			],
			"type": 1
		})
		
		checkoutCityOfUser(city)
	}, err => {
		console.log(err)
	})
}

// 弹窗地址对应用户地址
function checkoutCityOfUser(city) {
	let selectedIndex = [0, 0, 0]
	let checked = [0, 0, 0]
	let addProvince = $('#addressFormProvince').text()
	let addCity = $('#addressFormCity').text()
	let addArea = $('#addressFormArea').text()
	
	$(city).each(function(i) {
		if (city[i].name.indexOf(addProvince) != -1) {
			selectedIndex[0] = i
			checked[0] = i
			$('#addressFormProvince').text(city[i].name)
			$(city[i].sub).each(function(j) {
				if (city[i].sub[j].name.indexOf(addCity) != -1) {
					selectedIndex[1] = j
					checked[1] = j
					$('#addressFormCity').text(city[i].sub[j].name)
					$(city[i].sub[j].sub).each(function(k) {
						if (city[i].sub[j].sub[k].name.indexOf(addArea) != -1) {
							selectedIndex[2] = k
							checked[2] = k
							$('#addressFormArea').text(city[i].sub[j].sub[k].name)
							return false
						}
					})
					return false
				}
			})
			return false
		}
	})
	selCityFn(city, selectedIndex, checked)
}

// 地址弹窗
function selCityFn(city, selectedIndex, checked) {
	var nameEl = document.getElementById('selCity');
	
	var first = [];		//省，直辖市
	var second = [];	//市
	var third = [];		//镇
	
	var selectedIndex = selectedIndex;	//默认选中的地区
	var checked = checked;				//已选选项
	
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
	
	// 选择地区添加事件
	// nameEl.addEventListener('click', function () {
	// 	picker.show();
	// })
	
	// 选择地区添加事件
	if (nameEl.pickerShow) {
		// 防止重复绑定事件
		nameEl.removeEventListener('click', nameEl.pickerShow)
	}
	nameEl.pickerShow = () => {
		picker.show()
	}
	nameEl.addEventListener('click', nameEl.pickerShow)
}