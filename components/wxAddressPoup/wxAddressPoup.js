var wxAddressPoup = {
    // 初始化
    addressList: [],
    initialize: async function (dom) {
        let that = this
        let new_element = document.createElement('link');
        new_element.setAttribute('rel', 'stylesheet');
        new_element.setAttribute('href', '../../components/wxAddressPoup/wxAddressPoup.css');
        document.body.appendChild(new_element);
        let html = `
        <div class="wx-simple-address" id="wxSimpleAddress">
            <div class="wx-content wx-buy-poup-content">
                <div class="title">
                    <div class="left"></div>
                    <div class="text">选择收货地址</div>
                    <img id="closeWxAddress" src="https://img.quanminyanxuan.com/service/0ed76a6a01aa478b96f04699692fbc24.png" />
                </div>
                <div class="wx-container" >
                </div>
                <div class="add-btn toAdd" >
                新增收货地址
                </div>
            </div>
        </div>
        `
        $('body').append(html)
        $('#closeWxAddress').on('click', function () {
            $('#wxSimpleAddress').removeClass('show')
        })
        
        $('.wx-container').on('click', '.toWx', function () {
            $('#wxSimpleAddress').removeClass('show')
            wx.miniProgram.navigateTo({
                url: `/pages/member/accountSet/address/listH5?fromUrl=${window.location.href}`
            })
        })
        $('.toAdd').on('click', function () {
            $('#wxSimpleAddress').removeClass('show')
            wx.miniProgram.navigateTo({
                url: `/pages/member/accountSet/address/add`
            })
        })
        // 修改地址
        $('.wx-container').on('click', '.toEdit', function () {
            let id = $(this).data('id')
            let obj = {}
            $.each(that.addressList, function (index, val) {
                if (val.id == id) {
                    obj = val
                }
            })
            let address = encodeURIComponent(JSON.stringify(obj))
            $('#wxSimpleAddress').removeClass('show')
            wx.miniProgram.navigateTo({
                url: `/pages/member/accountSet/address/add?address=${address}`
            })
        })
        $(dom).on('click', function () {
            $('#wxSimpleAddress').addClass('show')
            that.getWxUserAddress()
        })
    },
    getWxUserAddress: async function () {
        await http('GET', `/users/users/showAddress`).then((res) => {
            if (res.code == 200) {
                this.addressList = res.data
                let addressHtml = `<div class="item toWx">
                                <div class="item-left">
                                    <img src="https://img.quanminyanxuan.com/service/56a35f5209f14ddb93f879eac37c6e57.png" alt="">
                                    <div>获取微信收货地址</div>
                                </div>
                                <img class="right-icon" src="https://img.quanminyanxuan.com/service/e159487e794b42fdb6792a5920a23fc7.png" alt="">
                            </div>`
                $.each(this.addressList, function (index, obj) {
                    addressHtml += `<div class="item ">
                                <div class="item-left item-address" data-addressid="${obj.id}">
                                    <img src="https://img.quanminyanxuan.com/service/${obj.status == 1 ? 'eb2de3ac73134cc78ab713723c5e491d' : '5d1afce9d411464397a47aacdc6659aa'}.png" alt="">
                                    <div class="user-info">
                                        <div class="name">${obj.name} ${obj.tel}</div>
                                        <div class="address">${obj.province}${obj.city}${obj.area}${obj.address}</div>
                                    </div>
                                </div>
                                <img class="right-icon toEdit" data-id="${obj.id}" src="https://img.quanminyanxuan.com/other/68b94e5b204b476c9d6c6db71096b59c.png" alt="">
                            </div>`
                })
                $('.wx-container').html('')
                $('.wx-container').append(addressHtml)
            }
        }, err => {
        })
    },
    editAddress: function (res) {
        http('POST', '/users/users/editAddress', {
            name: res.userName,
            tel: res.telNumber,
            province: res.provinceName,
            city: res.cityName,
            area: res.countyName,
            address: res.detailInfo,
            nationalCode: res.nationalCode,
            status: 1
        })
            .then(res => {
                this.getWxUserAddress()
            })
    },
    // 选择地址
    chooseAddress: function (callback) {
        let that = this
        $('.wx-container').on('click', '.item-address', function () {
            let id = $(this).data('addressid')
            let wxAddress = null
            $.each(wxAddressPoup.addressList, function (index, val) {
                if (val.id == id) {
                    wxAddress = val
                }
            })
            $('#wxSimpleAddress').removeClass('show')
            that.changeAddress(wxAddress)
            callback(wxAddress)
        })
    },
    // 切换默认地址
    changeAddress: function (val) {
        http('POST', '/users/users/setDefaultAddress', {
            id: val.id,
            status: 1
        })
            .then(res => {
            })
    },

    // sale域名使用
    // 跳转小程序地址页面
    toAddress: function(dom,callback = ()=>{}){
        $(dom).on('click',  function () {
            callback()
            wx.miniProgram.navigateTo({
                url: `/pages/member/accountSet/address/listH5?fromUrl=${window.location.href}`
            })
        })
    },
    // 获取默认地址
    getDefaultAddress: async function(callback = ()=>{}){
        await this.getWxUserAddress()
        let obj = this.addressList.find((v) => v.status == 1) || null
        callback(obj)
    }
};