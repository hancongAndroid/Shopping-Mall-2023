let sourcePlatform = window.location.href.split('://')[1].split('.quan')[0]

let pageNum = 1
let isLoading = false		//判断瀑布流是否加载中
let advertHomePageList = []
let headImgCarouselResponseList = []
let productTabList = []
let sceneId = getUrlKey('goodsId') || 2
let columnId = 0
pageStatistics() 			// 页面统计
getUserInfo(sourcePlatform)	// 获取用户信息
getPageData()
let urlType = window.location.href.indexOf('goodsDiscProductList') > -1
// ?sceneId=35&advertLocation=5  16
getTopData()
function getTopData(){
    http('POST','/mallv2/palletChannel/queryPalletChannel',
    {
        pageNum:1,
        pageSize:100,
        sceneId:sceneId,
    }).then( res=>{
        if (res.code == 200) {
            document.title = res.data.list[0].sceneName
        }
    })
    
}
function getPageData () {
    http('GET', `/mallv2/home/page/newFindHomePageAdvertAll?sceneId=${sceneId}&advertLocation=5`).then((res) => {
        advertHomePageList = res.data.advertHomePageList
        headImgCarouselResponseList = res.data.headImgCarouselResponseList
        let html = ''
        let headImg = `<img class="top-bg" style="margin-top:${sceneId=='2'?'-1.2rem':'0'}" src="${headImgCarouselResponseList[0].advertBackImgVos[0].backgroundImg}"></img>`
        if (!urlType) {
            advertHomePageList.forEach((v) => {
                let dom = ''
                if (v.advertHomePageRelationResponse) {
                    switch (v.advertType) {
                        // 运营位
                        case 'OPERATION_POSITION':
                            v.advertHomePageRelationResponse.length = 3
                            v.advertHomePageRelationResponse.forEach((val) => {
                                dom += ` <img class="item-img" src="${val.img}?x-oss-process=image/resize,w_300,m_lfit" alt="" onclick="window.open('../productDetail/guessProductDetail.html?productId=${val.productId}', '_self')">`
                            })
                            html += ` <div class="one-line-box">
                                        ${dom}
                                    </div>`
                            break;
                        // 四横幅
                        case 'BANNER_FOUR':
                            v.advertHomePageRelationResponse.forEach((val) => {
                                dom += ` <img class="item-img" src="${val.img}?x-oss-process=image/resize,w_300,m_lfit" alt="" onclick="window.open('../productDetail/guessProductDetail.html?productId=${val.productId}', '_self')">`
                            })
                            html += ` <div class="four-banner" style="background-image:url(${v.advertBackImgVOS[0].backgroundImg});">
                                        ${dom}
                                    </div>`
                            break;
                        // 2横幅
                        case 'BANNER_TWO':
                            dom += `<div class="left" >
                                        <img src="${v.advertHomePageRelationResponse[0].img}" alt="" onclick="window.open('../${v.advertHomePageRelationResponse[0].weappPath?'globalPurchase/goodsDiscProductList':'productDetail/guessProductDetail'}.html?productId=${v.advertHomePageRelationResponse[0].productId}&goodsId=${GetRequest(v.advertHomePageRelationResponse[0].weappPath)['goodsId']}', '_self')">
                                    </div>
                                    <div class="right">
                                        <img class="img1" src="${v.advertHomePageRelationResponse[1].img}" alt="" onclick="window.open('../${v.advertHomePageRelationResponse[1].weappPath?'globalPurchase/goodsDiscProductList':'productDetail/guessProductDetail'}.html?productId=${v.advertHomePageRelationResponse[1].productId}&goodsId=${GetRequest(v.advertHomePageRelationResponse[1].weappPath)['goodsId']}', '_self')">
                                    </div>`
                            html += ` <div class="one-two-banner">
                                        ${dom}
                                    </div>`
                            break;
                        // 左1右2
                        case 'LEFT_ONE_RIGHT_TWO':
                            dom += `<div class="left" >
                                        <img src="${v.advertHomePageRelationResponse[0].img}" alt="" onclick="window.open('../globalPurchase/goodsDiscProductList.html?goodsId=${GetRequest(v.advertHomePageRelationResponse[0].weappPath)['goodsId']}', '_self')">
                                    </div>
                                    <div class="right">
                                        <img class="img1" src="${v.advertHomePageRelationResponse[1].img}" alt="" onclick="window.open('../globalPurchase/goodsDiscProductList.html?goodsId=${GetRequest(v.advertHomePageRelationResponse[1].weappPath)['goodsId']}', '_self')">
                                        <img class="img1" src="${v.advertHomePageRelationResponse[2].img}" alt="" onclick="window.open('../globalPurchase/goodsDiscProductList.html?goodsId=${GetRequest(v.advertHomePageRelationResponse[1].weappPath)['goodsId']}', '_self')">
                                    </div>`
                            html += ` <div class="one-two-banner">
                                        ${dom}
                                    </div>`
                            break;
                        // 翻牌A
                        case 'FLIP_CARDS_A':
                            if (v.advertHomePageRelationResponse.length > 6) v.advertHomePageRelationResponse.length = 6
                            v.advertHomePageRelationResponse.forEach((val) => {
                                dom += ` <img class="item-img" src="${val.img}?x-oss-process=image/resize,w_300,m_lfit" alt="" onclick="window.open('../globalPurchase/goodsDiscProductList.html?goodsId=${GetRequest(val.weappPath)['goodsId']}', '_self')">`
                            })
                            html += ` <div class="bg-wall-two" style="background-image:url(${v.advertBackImgVOS[0].backgroundImg});">
                                        ${dom}
                                    </div>`
                            break;
                        // 单条幅
                        case 'BANNER_ONE':
                            if (v.advertHomePageRelationResponse.length == 1) {
                                html += ` <div class="one-banner">
                                            <img  class="item-img" src="${v.advertHomePageRelationResponse[0].img}" alt="" onclick="window.open('../globalPurchase/goodsDiscProductList.html?goodsId=${GetRequest(v.advertHomePageRelationResponse[0].weappPath)['goodsId']}', '_self')">
                                        </div>`
                            }
                            break;
                    }
                }
            })
            $('#pageContent').html(html)
            $('#pageContent').removeClass('dn')
        }

        $('.wrapper').css('background', headImgCarouselResponseList[0].advertBackImgVos[0].nameColor)
        $('.top-bg-box').html(headImg)
    }, err => {
        console.log(err)
    })
}

getGoodsTab()
function getGoodsTab () {
    http('POST', '/mallv2/palletChannel/querySubjectPlateBySceneId/' + sceneId).then(res => {
        if (res.data.length > 0) {
            productTabList = res.data
            let html = ''
            $.each(productTabList, (i, n) => {
                html += `<div class="tab-item" data-columnid="${n.id}">
                            <div class="tab-title">${n.title}</div>
                        </div>`
            })
            $('#tabTopNav').append(html)
            $('#tabTopNav .tab-item').eq(0).addClass('tab-item-active')
            getProductList()
        }
    })
}

// 获取 全部商品
function getProductList () {
    if (isLoading) return
    isLoading = true
    let obj = {}
    if (!columnId) {
        obj = {
            subjectType: productTabList[0].subjectType,
            subjectId: productTabList[0].subjectId,
            plateId: productTabList[0].id,
        }
    }else{
        let productTabListItem = productTabList.find((v) => {
            return v.id == columnId
        })
        obj ={
            subjectType: productTabListItem.subjectType,
            subjectId: productTabListItem.subjectId,
            plateId: productTabListItem.id,
        }
    }
    http('POST', `/mallv2/palletChannel/queryProductByPlateId`, {
        ...obj,
        pageNum: pageNum,
        pageSize: 10
    }).then((res) => {
        if (res.code == 200) {
            isLoading = false
            let productList = res.data.list
            pageNum++
            if (productList.length == 0) {
                isLoading = true
            }
            // 数据渲染
            productListGuess(productList, $('#productList'))
        }
    }, err => {
        console.log(err)
    })
}
function GetRequest (value) {
    var url = value; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("?");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}
// 页面滚动事件
$(window).on('scroll', function () {
    let scrollTop = $(this).scrollTop()
    let wHeight = $(this).height()
    let dHeight = $(document).height() - 300
    // 滚动到底部
    if (scrollTop + wHeight > dHeight) {
        if (urlType) {
            getProductList()
        }
    }
})
// 选项卡切换商品列表
$('.tab-box').on('click', '.tab-item', function() {
    $(this).addClass('tab-item-active').siblings().removeClass('tab-item-active')
    let productBoxTop = $('.product-box').offset().top
    let _index = $(this).index()
    // 导航偏移
    $('.tab-top-nav').animate({
        scrollLeft: 53 * (_index - 2) + 25
    }, 500)
    isLoading = false
    pageNum = 1
    $('.select-box .select-item').removeClass('active up')
    $('#productList').html('')
    columnId = $(this).data('columnid')
    $('html, body').scrollTop(productBoxTop - 40)
    getProductList()
})