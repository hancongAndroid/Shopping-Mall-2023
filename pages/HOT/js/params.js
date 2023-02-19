export function productParams (value) {
    // 首页列表数据
    function prodList () {
        this.list = [
            {
                title: '会员补贴榜', pageTitle: '会员补贴排行榜', leftText: '精选大牌', rightText: '大额补贴', num: '1323246', httpType: 'queryListByPage', pageType: 'gundongCategory',
                params: {
                    columnId: 0,
                    pageNum: 1,
                    pageSize: 2,
                    flag: 0,
                    activityType: 'OLD_FOR_NEW'
                },
            },
            {
                title: '大牌女装榜', pageTitle: '大牌女装排行榜', leftText: '潮流新款', rightText: '全场5折', num: '823246', httpType: 'getProducts', pageType: 'womensCategory',
                params: {
                    pageNum: 1,
                    pageSize: 2,
                    id: 229
                }
            },
            {
                title: '实力家电榜', pageTitle: '实力家电排行榜', leftText: '生活电器', rightText: '厨房必备', num: '1123248', httpType: 'queryListByPage', pageType: 'appliancesCategory',
                params: {
                    columnId: 189,
                    pageNum: 1,
                    pageSize: 2,
                    flag: 0,
                    activityType: 'CASH_SCORE'
                }
            },
            {
                title: '硬核数码榜', pageTitle: '硬核数码排行榜', leftText: '智能新品', rightText: '超强性能', num: '1223848', httpType: 'queryListByPage', pageType: 'digitalCategory',
                params: {
                    columnId: 191,
                    pageNum: 1,
                    pageSize: 2,
                    flag: 0,
                    activityType: 'CASH_SCORE'
                }
            },
            {
                title: '热卖酒水榜', pageTitle: '热卖酒水排行榜', leftText: '热销好货', rightText: '品质佳酿', num: '1423548', httpType: 'queryListByPage', pageType: 'liquorCategory',
                params: {
                    columnId: 193,
                    pageNum: 1,
                    pageSize: 2,
                    flag: 0,
                    activityType: 'CASH_SCORE'
                }
            },
            {
                title: '美妆护肤榜', pageTitle: '美妆护肤排行榜', leftText: '口碑爆棚', rightText: '人气推荐', num: '1093548', httpType: 'queryListByPage', pageType: 'skinCareCategory',
                params: {
                    columnId: 192,
                    pageNum: 1,
                    pageSize: 2,
                    flag: 0,
                    activityType: 'CASH_SCORE'
                }
            },
            {
                title: '精品腕表榜', pageTitle: '精品腕表排行榜', leftText: '大牌汇聚', rightText: '新款手表', num: '923548', httpType: 'queryListByPage', pageType: 'luxuryCategory',
                params: {
                    columnId: 202,
                    pageNum: 1,
                    pageSize: 2,
                    flag: 0,
                    activityType: 'CASH_SCORE'
                }
            },
            {
                title: '品质鞋服榜', pageTitle: '品质鞋服排行榜', leftText: '人气热卖', rightText: '时尚舒适', num: '773548', httpType: 'queryListByPage', pageType: 'ShoeBagCategory',
                params: {
                    columnId: 199,
                    pageNum: 1,
                    pageSize: 2,
                    flag: 0,
                    activityType: 'CASH_SCORE'
                }
            },
        ]
    }
    // 热销榜请求数据
    function navProdList () {
        let data = new prodList()
        this.list = [
            ...data.list,
            {
                title: '日用百货榜', pageTitle: '日用百货排行榜', leftText: '人气热卖', rightText: '时尚舒适', num: '673548', httpType: 'queryListByPage', pageType: 'commodityCategory',
                params: {
                    columnId: 190,
                    pageNum: 1,
                    pageSize: 2,
                    flag: 0,
                    activityType: 'CASH_SCORE'
                }
            },
            {
                title: '养生健康榜', pageTitle: '养生健康排行榜', leftText: '人气热卖', rightText: '时尚舒适', num: '503548', httpType: 'queryListByPage', pageType: 'healthCategory',
                params: {
                    columnId: 200,
                    pageNum: 1,
                    pageSize: 2,
                    flag: 0,
                    activityType: 'CASH_SCORE'
                }
            },
        ]
    }
    switch (value) {
        case 'prodList':
            return new prodList()
            break;
        case 'navProdList':
            return new navProdList()
            break;
        default:
            throw new Error('参数错误, 可选参数:prodList,navProdList');
            break;
    }
}
export function appendPopup (el) {
    //规则
    let regulation = `
      <div class="layer dn" id="ruleBox">
          <div class="regulation">
              <div class="regulation-head">
                  <div class="regulation-title">入选规则</div>
              </div>
              <div class="detail">
                  <div class="regulation-item">
                      <div class="detail-title indent"> 热销榜单是以平台海量商品的销量、好评率、加购率、收藏率、回购率、商品人气等为参考依据，计算并反映出当下最热门的好物，致力于为用户打造出最具参考性的购物风向标。</div>
                  </div>
                  <div class="regulation-item">
                      <div class="digit">1.</div>
                      <div class="detail-title">
                          真实客观数据打分模型。
                      </div>
                  </div>
                  <div class="regulation-item">
                      <div class="digit">2.</div>
                      <div class="detail-title">
                          多维度算法的综合排序。
                      </div>
                  </div>
                  <div class="regulation-item">
                      <div class="digit">3.</div>
                      <div class="detail-title">
                          挖掘全网好物，生成TOP榜单。
                      </div>
                  </div>
              </div>
              <img class="regulation-close" id="ruleHide"  src="https://img.quanminyanxuan.com/service/be8f697741bf4a8aa1264d9db0bde41a.png" />
          </div>
      </div>`
    $('body').append(regulation)
    // 规则弹窗
    $('#ruleHide').on('click', function () {
        $('#ruleBox').addClass('dn')
    })
    $(el).on('click', function () {
        $('#ruleBox').removeClass('dn')
    })
}
export function appendNavigation (arr) {
    //规则
    let item = ''
    arr.forEach((value, index) => {
        item += `
        <div class="nav-item">
            <a href="${value.href}">
            <div class="nav-item-content">
                <img class="nav-img" src="${value.icon}" />
                <span class="nav-txt ${index == 1 ? 'active' : ''}">${value.name}</span>
            </div>
            </a>
        </div>
        `
    })
    let regulation = `
    <!-- 底部导航 -->
    <div class="navigation">
        ${item}
    </div>
    `
    $('body').append(regulation)
    //  <div class="nav-item">
    //         <a href="../discover/discover.html">
    //         <div class="nav-item-content">
    //             <img class="nav-img" src="https://img.quanminyanxuan.com/service/241ffc0372cc4d39a93fda24f69ae476.png" />
    //             <span class="nav-txt">首页</span>
    //         </div>
    //         </a>
    //     </div>
    //     <div class="nav-item">
    //         <div class="nav-item-content">
    //             <img class="nav-img" src="https://img.quanminyanxuan.com/other/4b9a560f1a1c4f21837837ff4b24fb7e.png" />
    //             <span class="nav-txt active">榜单</span>
    //         </div>
    //     </div>
    //     <div class="nav-item">
    //         <a href="../integralCenter/gainScore.html">
    //         <div class="nav-item-content">
    //             <img class="nav-img" src="https://img.quanminyanxuan.com/other/50a0f5485c3c41bfa47fc14b0ffe7e6b.png" />
    //             <span class="nav-txt">会员中心</span>
    //         </div>
    //         </a>
    //     </div>
}
