// /**
//  * app.vue
//  */
// AppNowPage = uni.getStorageSync('nowPage')
// // 去哪的路径
// let toPage = newVal.fullPath
// // 从哪来的路径
// let fromPage = oldVal ? oldVal.fullPath : ''
// // 传递的参数
// let param = newVal.query
// // 系统数据
// let systemInfo = store.state.app.systemInfo

// if (!uni.getStorageSync('uuid')) {
//   var uuid = util.generateRandomId()
//   uni.setStorageSync('uuid', uuid)
// } else {
//   var uuid = uni.getStorageSync('uuid')
// }
// let dataJson = {
//   toPage,
//   fromPage,
//   param,
//   model: systemInfo.model,
//   platform: systemInfo.platform,
//   uuid
// }
// setTimeout(() => {
// this.$http
//   .post('/mallv2/common/analysisData', {
// 	dataJson: JSON.stringify(dataJson)
//   })
//   .then(res => {
// 	console.log('日志-成功', res)
//   })
//   .catch(err => {
// 	console.log('日志-失败', err)
//   })
		
  /**
   * 操作埋点 mixin.js
   */
 //  clikStatisticsData(type) {
	// let { app } = store.state
	// // 系统数据
	// let model = app.systemInfo
	// this.$http
	//   .post('/mallv2/statistics/clikStatisticsData', {
	// 	model,
	// 	clikType: type
	//   })
	//   .then(res => {
  
	// 	console.log('埋点成功', res)
	//   })
	//   .catch(err => {
	// 	// console.error('操作埋点错误', err)
	//   })
 //  },
 
 
 // function pageStatistics() {
	// let dataJson = {
	// 	toPage: window.location.href.split('.com')[1],
	// 	fromPage: '',
	// 	param: {},
	// 	uuid: getCookie('token')
	// }
	//  http('POST', `/mallv2/common/analysisData`, {
	// 	dataJson: JSON.stringify(dataJson)
	//  }).then((res) => {
	//  	console.log(res)
	//  }, err => {
	//  	console.log(err)
	//  })
 // }