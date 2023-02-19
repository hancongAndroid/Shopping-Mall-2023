function getNav (value,params) {
    // 积分样式
    function goldNav () {
        let that = this
        this.columnId = 0
        this.pageNum = 1
        this.isLoading = false
        let new_element = document.createElement('link');
        new_element.setAttribute('rel', 'stylesheet');
        new_element.setAttribute('href', '../../components/integralCenterNav/goldNav.css');
        document.body.appendChild(new_element);
        // 获取 商品导航
        this.getProductNav = function getProductNav (navList=null) {
            http('GET', `/mallv2/activity/getColumn`, {
                activityType: 'CASH_SCORE',
                isShow: 1
            }).then((res) => {
                let productNav = []
                productNav = navList || res.data
                let html = ''
                $.each(productNav, (i, n) => {
                    if (n.title.indexOf('H5') != -1) return true
                    if (n.title.indexOf('0元兑') != -1) return true
                    if (columnId == 0) {
                        columnId = n.id
                        this.getProductList()
                    }
                    html += `<div class="tab-item" data-columnid="${n.id}">
                            <div class="tab-title">${n.title}</div>
                        </div>`
                })
                $('#tabTopNav').append(html)
                $('#tabTopNav .tab-item').eq(0).addClass('tab-item-active')
            }, err => {
                console.log(err)
            })
        }
        // 获取 全部商品
        this.getProductList = function getProductList () {
            if (that.isLoading) return
            that.isLoading = true
            http('GET', `/mallv2/h5/activity/queryListByPage`, {
                columnId:columnId || that.columnId,
                pageNum:pageNum || that.pageNum,
                pageSize: 20,
                flag:flag,
                activityType: 'CASH_SCORE'
            }).then((res) => {
                that.isLoading = false
                let productList = res.data
                pageNum++
                that.pageNum++
                if (productList.length == 0) {
					isLoading = true
   //                  $('#productList').append(`<div class="guess-like">
			// 	<i class="line l"></i>
			// 	<img class="icon" src="https://img.quanminyanxuan.com/other/46b5dca9f8184401990bb3935d3d2ee0.png" >
			// 	<span class="title">你可能还喜欢</span>
			// 	<i class="line r"></i>
			// </div>`)
   //                  columnId = 187
   //                  pageNum = 1
   //                  that.columnId=187
   //                  that.pageNum=1
                }

                // 数据渲染
                productListScore(productList, $('#productList'))
            }, err => {
                console.log(err)
            })
        }
        // 获取 滚动用户列表 数据
        this.getFakeUsers = function getFakeUsers () {
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
							<div class="roll-text">${item.nickname}使用积分换购了${item.productName}，节省了${item.money}元!</div>
						</div>
					</div>`
                })
                $('#userRandom').html(user);
                new Swiper('.swiper-container-random', {
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
                        delay: 500,
                        disableOnInteraction: false
                    },
                    loop: true,
                    speed: 1500,
                    slidesPerView: 4,
                    observer: true,
                    observeParents: true
                })
                new Swiper('.swiper-container-user2', {
                    autoplay: {
                        delay: 500,
                        disableOnInteraction: false
                    },
                    loop: true,
                    speed: 1500,
                    slidesPerView: 4,
                    observer: true,
                    observeParents: true
                })
                let people = Number((Math.random() * 2000).toFixed(0))
                if (people == 0) {
                    people = (Math.random() * 2000).toFixed(0)
                } else if (people < 1000) {
                    people = people + 1000
                } else if (people > 3000) {
                    people = 2685
                }
                $('#peo').text(people)
            }, err => {
                console.log(err)
            })
        }
        this.scrollFn = function (){
            $(window).on('scroll', function () {
                let scrollTop = $(this).scrollTop()
                let wHeight = $(this).height()
                let dHeight =$(document).height() - 300
                // 滚动到底部
                if (scrollTop + wHeight > dHeight) {
                    that.getProductList()
                }
            })
        }
        this.navClick = function(value){
            $('.tab-box').on('click', '.tab-item', function() {
                if ($(this).hasClass('active')) return	//点击当前无操作
                $(this).addClass('tab-item-active').siblings().removeClass('tab-item-active')
                let productBoxTop = $('#productList').offset().top
                let _index = $(this).index()
                // 导航偏移
                $('.tab-top-nav').animate({
                    scrollLeft: 52.5 * (_index - 3) + 20
                }, 500)
                pageNum = 1
                that.pageNum = 1
                that.isLoading = false
                $('.select-box .select-item').removeClass('active up')
                $('#productList').html('')
                columnId = $(this).data('columnid')
                that.columnId = $(this).data('columnid')
                $('html, body').scrollTop(productBoxTop - (value || 85))
                that.getProductList()
            })
        }
        // this.getFakeUsers()
        // this.getProductNav()

    }
    // 会员中心原始样式
    function gainScoreNav () {
        let new_element = document.createElement('link');
        new_element.setAttribute('rel', 'stylesheet');
        new_element.setAttribute('href', '../../components/integralCenterNav/gainScoreNav.css');
        document.body.appendChild(new_element);
        // 获取 商品导航
        
        this.getProductNav = function getProductNav () {
            let navList = [
                { title: '会员精选', id: '1', activityType: 'CASH_SCORE' },
                { title: '补贴精选', id: '2', activityType: 'OLD_FOR_NEW' },
                { title: '特卖精选', id: '3', activityType: 'redPacket' },
            ]
            let html = ''
            $.each(navList, (i, n) => {
                this.getProductList('CASH_SCORE')
                html += `<div class="tab-item" data-columnid="${n.activityType}">
                    <div class="tab-title">${n.title}</div>
                </div>
				${i < 2 ? '<i class="tab-line"></i>' : ''}`
            })
            $('#tabTopNav').append(html)
            $('#tabTopNav .tab-item').eq(0).addClass('tab-item-active')
        }

        // 获取 全部商品
        this.getProductList = function getProductList (type) {
            if (isLoading) return
            isLoading = true
            http('GET', `/mallv2/h5/activity/queryListByPage`, {
                columnId: 0,
                pageNum,
                pageSize: 12,
                flag: 0,
                activityType: type
            }).then((res) => {
                isLoading = false
                let productList = res.data
                if (productList.length == 0) isLoading = true
                pageNum++
                switch (type) {
                    case 'CASH_SCORE':
                        productListScore(productList, $('#productList'))
                        break;
                    case 'OLD_FOR_NEW':
                        productListShow(productList.sort(randomSort), $('#productList'))
                        break;
                }
            }, err => {
                console.log(err)
            })
        }
        // 获取 专享抵扣全部商品
        this.getRedPacketProductList = function getRedPacketProductList () {
            if (isLoading) return
            isLoading = true
            http('GET', `/mallv2/subjectsController/getProducts`, {
                id: 190,
                pageSize: 10,
                pageNum
            }).then((res) => {
                isLoading = false
                let data = res.data
                let productList = data.list.sort(randomSort)
                if (productList.length == 0) isLoading = true
                pageNum++
                productListBrand(productList, $('#productList'))
            }, err => {
                console.log(err)
            })
        }
        this.getProductNav()
        this.init = function init () {
            if (activityType == 'redPacket') {
                this.getRedPacketProductList()
            } else {
                this.getProductList(activityType)
            }
        }

    }
    switch (value) {
        case 'goldNav':
            return new goldNav(params)
            break;
        case 'gainScoreNav':
            return new gainScoreNav()
            break;

        default:
            throw new Error('参数错误, 可选参数:prodList,navProdList');
            break;
    }
}