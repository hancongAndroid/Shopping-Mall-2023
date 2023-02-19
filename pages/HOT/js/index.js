
import { getProducts, queryListByPage } from "./api.js";
import { productParams, appendPopup,appendNavigation } from "./params.js"
// 广点通渠道统计
// gdt('track', 'VIEW_CONTENT', {});// 浏览
pageStatistics() 			// 页面统计
let isLoading = false
let activityType = 'CASH_SCORE'
// 品牌特卖热销榜
let carnivalParams = {
    pageNum: 1,
    pageSize: 3,
    id: 190,
}
// 积分兑换热销榜
let goldParams = {
    columnId: 187,
    pageNum: 1,
    pageSize: 3,
    flag: 0,
    activityType: 'CASH_SCORE'
}
let navParams = {
    columnId: 0,
    pageNum: 1,
    pageSize: 12,
    flag: 0,
    activityType: 'CASH_SCORE'
}
let navParams2 = {
    columnId: 239,
    pageNum: 1,
    pageSize: 12,
    flag: 0,
    activityType: 'H5_RED_PACKET'
}
let otherProdList = productParams('prodList').list
let navProdList = productParams('navProdList').list
let httpList = otherProdList.map((value) => value.httpType == 'queryListByPage' ? queryListByPage(value.params) : getProducts(value.params))
Promise.all(httpList).then((res) => {
    res.forEach((value, index) => {
        if (Array.isArray(value)) {
            otherProdList[index].list = value
        } else {
            otherProdList[index].list = value.list
        }
    })
    let otherProdHtml = ''
    otherProdList.forEach((value, index) => {
        if (value.list.length) {
            let params = Object.assign(value.params, { pageSize: 10 })
            let data = JSON.stringify({
                title: value.title,
                pageTitle: value.pageTitle,
                params
            })
            otherProdHtml += `<div class="prod-box" onclick="window.open('../HOT/${value.pageType}.html?num=${value.num}&data=${encodeURI(data)}', '_self')">
                        <div class="title">${value.title}</div>
                        <ul>
                            <li>
                                <div class="prod-img" , '_self')">
                                    <img src="${value.list[0].productImg}" alt="" style="width: 100%;height: 100%;object-fit: cover;">
                                </div>
                                <div class="prod-text">${value.leftText}</div>
                            </li>
                            <li>
                                <div class="prod-img">
                                    <img src="${value.list[1].productImg}" alt="" style="width: 100%;height: 100%;object-fit: cover;">
                                </div>
                                <div class="prod-text">${value.rightText}</div>
                            </li>
                        </ul>
                    </div>`
        }
    })
    $('.hot-sale-box2').append(otherProdHtml)
}).catch(e => {
    console.log("error", e)
})

// 品牌特卖热销榜
getProducts(carnivalParams).then((res) => {
    res.list.forEach((value, index) => {
        let img = `<img class="img" src="${value.productImg}" alt="" style="width: 100%;height: 100%;pointer-events: initial;object-fit: cover;">`
        $(`.carnival .top${index + 1} .prod-img`).append(img)
    })
})
// 积分兑换热销榜
queryListByPage(goldParams).then((res) => {
    res.forEach((value, index) => {
        let img = `<img class="img" src="${value.productImg}" alt="" style="width: 100%;height: 100%;pointer-events: initial;object-fit: cover;">`
        $(`.gold .top${index + 1} .prod-img`).append(img)
    })
})
async function handleClickNav (httpType,type) {
    if (isLoading) return
    isLoading = true
    switch (httpType) {
        case 'queryListByPage':
            await queryListByPage(navParams).then((res) => {
                isLoading = false
                let productList = res.sort(randomSort)
                if (productList.length == 0) {
                    $('#productList').append(`<div class="guess-like">
                        <i class="line l"></i>
                        <img class="icon" src="https://img.quanminyanxuan.com/other/46b5dca9f8184401990bb3935d3d2ee0.png" >
                        <span class="title">你可能还喜欢</span>
                        <i class="line r"></i>
                    </div>`)
                    navParams.pageNum = 0
                }
                navParams.pageNum++
                productListScore(productList, $('#productList'),type)
            })
            break;
        case 'getProducts':
            await getProducts(navParams2).then((res) => {
                isLoading = false
                let productList = res.list.sort(randomSort)
                if (productList.length == 0) {
                    $('#productList').append(`<div class="guess-like">
                        <i class="line l"></i>
                        <img class="icon" src="https://img.quanminyanxuan.com/other/46b5dca9f8184401990bb3935d3d2ee0.png" >
                        <span class="title">你可能还喜欢</span>
                        <i class="line r"></i>
                    </div>`)
                    navParams2.pageNum = 0
                }
                navParams2.pageNum++
                productListScore(productList, $('#productList'),type)
            })
            break;
    }
}
init()
async function init () {
    switch (activityType) {
        case 'CASH_SCORE':
            navParams.activityType = activityType
            navParams.columnId = 0
            navParams.flag = 0
            await handleClickNav('queryListByPage','productDetail')
            break;
        case 'OLD_FOR_NEW':
            navParams.activityType = activityType
            navParams.columnId = 0
            navParams.flag = 0
            await handleClickNav('queryListByPage','newsProductDetail')
            break;
        case 'H5_RED_PACKET':
            navParams.activityType = activityType
            navParams.columnId = 239
            navParams.flag = 1
            await handleClickNav('queryListByPage','brandSaleProductDetail')
            break;
    }
}
// 部分dom操作
$(function () {
    // 选项卡切换商品列表
    $('.nav2').on('click', 'li',async function () {
        $(this).addClass('active').siblings().removeClass('active')
        $('#productList').html('')
        activityType = $(this).data('columnid')
        navParams.pageNum = 1
        navParams2.pageNum = 1
        await init()
        $('html, body').scrollTop($('.product-container').offset().top - 60)
    })
    $('.nav').on('click', 'li', function () {
        let id = $(this).data('columnid')
        let data = navProdList.find((value) => {
            let itemId = value.params.columnId || value.params.id
            return itemId == id
        })
        let params = Object.assign(data.params, { pageSize: 10 })
        let paramsData = JSON.stringify({
            title: data.title,
            pageTitle: data.pageTitle,
            params
        })
        window.open(`../HOT/${data.pageType}.html?num=${data.num}&data=${paramsData}`, '_self')
        // $(this).addClass('active').siblings().removeClass('active')
        // $('#productList').html('')

        // navParams.pageNum = 1
        // navParams2.pageNum = 1
        // init()
    })
    $('.carnival, .gold').on('click', function () {
        let id = $(this).data('columnid')
        let dataList = [
            {num: '1523246', title: '品牌特卖热销榜',pageTitle:"品牌特卖热销榜", params: carnivalParams },
            {num: '2523246', title: '积分兑换热销榜',pageTitle:"积分兑换热销榜", params: goldParams },
        ]
        let data = dataList.find((value) => {
            let itemId = value.params.columnId || value.params.id
            return itemId == id
        })
        let params = Object.assign(data.params, { pageSize: 10 })
        let paramsData = JSON.stringify({
            title: data.title,
            pageTitle: data.pageTitle,
            params
        })
        if (data.title == '品牌特卖热销榜') {
            window.open(`../HOT/HotCategory.html?num=${data.num}&data=${paramsData}`, '_self')
        }else{
            window.open(`../HOT/integralCategory.html?num=${data.num}&data=${paramsData}`, '_self')
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
    appendPopup('.header-box .text')
    let navigationList = [
        {href:'../discover/discover.html',name:'首页',icon:'https://img.quanminyanxuan.com/service/241ffc0372cc4d39a93fda24f69ae476.png'},
        {href:'javascript: void(0)',name:'热销榜单',icon:'https://img.quanminyanxuan.com/other/4b9a560f1a1c4f21837837ff4b24fb7e.png'},
        {href:'../integralCenter/gainScore.html',name:'会员中心',icon:'https://img.quanminyanxuan.com/other/50a0f5485c3c41bfa47fc14b0ffe7e6b.png'},
    ]
    appendNavigation(navigationList)
})

