
import { getProducts, queryListByPage, getProductReviews, getFakeUsers } from "./api.js";
import { productParams, appendPopup,appendNavigation } from "./params.js"
import "../../../common/layer/layer.js"
// 广点通渠道统计
// gdt('track', 'VIEW_CONTENT', {});// 浏览
pageStatistics() 			// 页面统计
let { title,pageTitle, params } = JSON.parse(getUrlKey('data'))
$('#pageTitle').text(pageTitle)
document.title = pageTitle
let isLoading = false
let toHOT= false
// 随机热销指数,从大到小排列
let randomNumList = []
let randomNumList2 = []
for (let index = 0; index < 30; index++) {
    let num = (Math.round(Math.random() * 10 + 87) / 10).toFixed(1)
    let num2 = (Math.round(Math.random() * 10 + 11) / 10).toFixed(1)
    randomNumList.push(num)
    randomNumList2.push(num2)
}
randomNumList.sort((a, b) => b - a)
randomNumList2.sort((a, b) => b - a)
// 评论数据
let reviewsData = []
// 用户购买数据
let fakeUsersData = []
// 列表数据
let productList = []
// 其他榜单数据
let otherProdList = productParams('navProdList').list
let otherProdPageNum = 4
let httpList = otherProdList.map((value) => {
    let params = Object.assign(value.params, { pageSize: 3 })
    return value.httpType == 'queryListByPage' ? queryListByPage(params) : getProducts(params)
})
Promise.all(httpList).then((res) => {
    res.forEach((value, index) => {
        if (Array.isArray(value)) {
            otherProdList[index].list = value
        } else {
            otherProdList[index].list = value.list
        }
    })
    appendOtherProd(otherProdPageNum)
}).catch(e => {
    console.log("error", e)
})
created()
async function created() {
    await getProductReviewsList()
    await getFakeUsersList()
    await init()
}

async function getDataList (httpType) {
    if (isLoading) return
    isLoading = true
    switch (httpType) {
        case 'queryListByPage':
            await queryListByPage(params).then((res) => {
                productList = [...productList, ...res]
                toHOT = !res.length
                isLoading = false
                appendHtml(productList, productList.length - res.length,)

            })
            break;
        case 'getProducts':
            await getProducts(params).then((res) => {
                productList = [...productList, ...res.list]
                toHOT = !res.list.length
                isLoading = false
                appendHtml(productList, productList.length - res.list.length)
            })
            break;
    }
}
function appendHtml (res, num) {
    let toPach = 'HOTProductDetail'
    if (params.activityType == "OLD_FOR_NEW") {
        // 跳转补贴详情
        toPach = 'newsProductDetail'
    }else if(params.activityType == "CASH_SCORE"){
        // 跳转积分详情详情
        toPach = 'productDetail'
    }else if (params.id == 229 ) {
        toPach = 'guessProductDetail'
    }else{
        // 跳转红包详情
        toPach = 'brandSaleProductDetail'
    }
    
    let html = ''
    res.forEach((value, index) => {
        if (index >= num) {
            let randomNum = randomNumList[index]
            let randomNum2 = randomNumList2[index]
            let topIconIndex = index + 1
            let user = ''
            let userList = fakeUsersData.sort(randomSort)
            for (let index = 0; index < userList.length; index++) {
                const element = userList[index];
                if (index <= 5) {
                    user += `<div class="swiper-slide">
                        <div class="random">
                            <img class="random-img" src="${element.headImg}" />
                            <div class="random-name">${element.nickname} 在${Math.ceil(Math.random() * 10)}分钟前付款</div>
                        </div>
                    </div>`
                } else {
                    break
                }
            }
            html += `<div class="prod-box"  onclick="window.open('../productDetail/${toPach}.html?productId=${value.id}&topNum=${topIconIndex}&topName=${pageTitle}', '_self')">
                        <div class="top-icon ${topIconIndex <= 3 ? 'top-icon' + topIconIndex : ''}">${topIconIndex > 3 ? topIconIndex : ''}</div>
                        <div class="left">
                            <img src="${value.productImg}" alt="" style="width: 100%; height: 100%;object-fit:cover">
                        </div>
                        <div class="right">
                            <div class="text">
                                <i class="icon"></i>
                                综合热销指数${randomNum}
                            </div>
                            <div class="text2">
                            <img src="https://img.quanminyanxuan.com/other/a5c271aa838d47d29a03a682a6687d32.png" alt="" style="width: auto; height: .28rem;">
                                ${value.productName}
                            </div>
                            <div class="text3-box">
                                <!-- 用户滚动 -->
                                <div class="user-random">
                                    <div class="swiper-container swiper-container-random roll${num} swiper-no-swiping">
                                        <div class="swiper-wrapper" id="userRandom">
                                            ${user}
                                        </div>
                                        <div class="swiper-pagination swiper-pagination-random"></div>
                                    </div>
                                </div>
                                <p>${(reviewsData.sort(randomSort))[0].content}</p>
                            </div>
                        </div>
                        <div class="bottom-box">
                            <div class="bottom-box-left">
                                <span class="price">
                                    <span class="icon">￥</span>${value.price}
                                </span>
                                <div class="popularity">人气指数${randomNum2}万</div>
                            </div>
                            <div class="btn">去购买<i class="icon"></i></div>
                        </div>
                    </div>`
        }
    })
    $('#prodContent').append(html)
    new Swiper(`.roll${num}`, {
        direction: 'vertical',
        autoplay: {
            delay: 4000,
            disableOnInteraction: false
        },
        speed: 500,
        loop: true
    })
}
function appendOtherProd (otherProdPageNum) {
    let otherProdHtml = ''
    let arr = otherProdList.slice(otherProdPageNum - 4, otherProdPageNum);
    arr.forEach((value, index) => {
        if (otherProdPageNum >= index) {
            otherProdHtml += `<div class="other-prod-box" data-title="${value.title}" >
                                <div class="text">${value.title} <i class="icon"></i></div>
                                <div class="text2">热销${((+value.num) / 10000).toFixed(1)}万件</div>
                                <div class="top1-box">
                                    <div class="top1-icon"></div>
                                        <img src="${value.list[0].productImg}" alt="" style="width: 100%;height: 100%;object-fit:cover ">
                                    <span class="top1-box-text"><i class="icon"></i>热销榜首${getRandomNum(1, 3)}周</span>
                                </div>
                                <div class="other-top-prod">
                                    <div class="other-top-prod-box">
                                        <img src="${value.list[1].productImg}" alt="" style="width: 100%;height: 100%;object-fit:cover ">
                                        <i class="icon"></i>
                                    </div>
                                    <div class="other-top-prod-box">
                                        <img src="${value.list[2].productImg}" alt="" style="width: 100%;height: 100%;object-fit:cover ">
                                        <i class="icon top3"></i>
                                    </div>
                                </div>
                            </div>`
        }
    })
    $('#otherProd').append(otherProdHtml)
}
async function init () {
    if (params.activityType) {
        await getDataList('queryListByPage')
    } else {
        await getDataList('getProducts')
    }
}

async function getProductReviewsList () {
    const res = await getProductReviews()
    reviewsData = res
}
async function getFakeUsersList () {
    const res = await getFakeUsers({ number: 100 })
    fakeUsersData = res
}
// 部分dom操作
$(function () {
    $('#moreProd').on('click', async function () {
        if (productList.length >= 30) return window.open('../HOT/index.html', '_self')
        params.pageNum++
        await init()
        if (toHOT) return window.open('../HOT/index.html', '_self')
    })
    $('#moreProd2').on('click', function () {
        if (otherProdPageNum >= otherProdList.length) return window.open('../HOT/index.html', '_self')
        otherProdPageNum += 4
        appendOtherProd(otherProdPageNum)
    })
    $('#otherProd').on('click', '.other-prod-box', function () {
        title = $(this).data('title')
        // $('#pageTitle').text(title)
        let data = otherProdList.find((value, index) => {
            return title == value.title
        })
        params = Object.assign(data.params, { pageSize: 10 })
        let props = JSON.stringify({
            title: data.title,
            pageTitle: data.pageTitle,
            params
        })
        window.open(`../HOT/${data.pageType}.html?num=${data.num}&data=${encodeURI(props)}`, '_self')
    })
    appendPopup('.header-box .rule')
    let saleNum = + getUrlKey('num')
    let num = saleNum
    let odo1 = new Odometer('#Odometer', {
        num: num,
        symbol: ','
    });
    //改变数值
    setInterval(() => {
        num += Math.floor(Math.random() * 10) + 1
        odo1.update(num);
    }, 3000)
    let navigationList = [
        {href:'../HOT/index.html',name:'首页',icon:'https://img.quanminyanxuan.com/service/241ffc0372cc4d39a93fda24f69ae476.png'},
        {href:'javascript: void(0)',name:'热销榜单',icon:'https://img.quanminyanxuan.com/other/4b9a560f1a1c4f21837837ff4b24fb7e.png'},
        {href:'../integralCenter/gainScore.html',name:'会员中心',icon:'https://img.quanminyanxuan.com/other/50a0f5485c3c41bfa47fc14b0ffe7e6b.png'},
    ]
    appendNavigation(navigationList)
})
