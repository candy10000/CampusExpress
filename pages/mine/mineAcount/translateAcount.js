// pages/mine/mineAcount/translateAcount.js
const app = getApp();
Component({

    options: {
      addGlobalClass: true
    },
    /**
     * 组件的属性列表
     */
    options: {
        addGlobalClass: true
    },

    properties: {
        giftId: {
            type: String,
            value: ''
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        giftList: [1, 2, 3, 4],
        trans_balance: 0,
        scroll_height: 0,
        //礼物价格
        gift_price: 2,
        //余额转换倍数
        trans_times: 0.72,
        gifts_checked: []
    },

    attached() {
        var that = this
        console.log("that.data.giftId", that.data.giftId)
        console.log(this.data.giftId)
        //获取礼物详情
        wx.request({
            url: app.globalData.url + '/customerSendgift/selectDetailGiftsGetted',
            data: {
                openId: app.getOpenid(app.globalData.url),
                //这里测试礼物接口，用了一个有礼物的openId
                // openId: 'oqa7H5Y17NbRqhBrlPvsCHV0jwV0',
                giftId: that.data.giftId
            },
            success: res => {
                console.log("giftList res.data:", res.data)
                that.setData({
                    giftList: res.data

                })
                console.log("giftList:", that.data.giftList)
            }
        })

        //获取礼物单价
        wx.request({
            url: app.globalData.url + '/gifts/detail/' + that.data.giftId,
            data: {},
            success: res => {
                that.setData({
                    gift_price: res.data.value
                })
                console.log("gift_price:", that.data.gift_price)
            }
        })


        let windowHeight = wx.getSystemInfoSync().windowHeight // 屏幕的高度
        let windowWidth = wx.getSystemInfoSync().windowWidth // 屏幕的宽度
        this.setData({
            // scroll_height: windowHeight * 750 / windowWidth - 30
            scroll_height: windowHeight * 0.55
        })
    },
    /**
     * 组件的方法列表
     */
    methods: {
        Transform: function () {
            var that = this;
            wx.showModal({
                title: '提示',
                content: '确定要转换吗？',
                success: function (sm) {
                    if (sm.confirm) {
                        // 用户点击了确定 可以调用方法
                        console.log('用户点击确定')
                        var arr = that.data.gifts_checked;
                        var transBalance = that.data.trans_balance * 100;
                        for (var i = 0; i < arr.length; i++) {
                            if (i != 0) {
                                console.log(i != 0);
                                transBalance = 0;
                            }
                            console.log("arr:", arr);
                            wx.request({
                                // header: {
                                //     'content-type': 'application/x-www-form-urlencoded'
                                // },
                                url: app.globalData.url + '/customerGifts/transBalanceById',
                                method: "GET",
                                data: {
                                    openId: app.getOpenid(app.globalData.url),
                                    transBalance: transBalance,
                                    // id: JSON.stringify(arr)
                                    id: arr[i]
                                },
                                success: res => {
                                    //跳转到我的钱包页面
                                    wx.redirectTo({
                                        url: '/pages/mine/mineAcount/mineAcount'
                                    })
                                }
                            })
                        }
                        // wx.redirectTo({
                        //     url: '/pages/mine/mineAcount/mineAcount'
                        // })

                    } else if (sm.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
        },
        checkboxChange: function (e) {
            var that = this;
            console.log("复选框", e.detail);
            let arr = e.detail.value;
            let gifts_checked = [];
            // console.log("array.length:", arr.length)
            //数组累加，计算要转换的余额
            var sum = 0;
            for (var i = 0; i < arr.length; i++) {
                sum += parseInt(arr[i].split(",")[0]);
                gifts_checked.push(parseInt(arr[i].split(",")[1]))
            }

            this.setData({
                trans_balance: sum * that.data.gift_price * that.data.trans_times,
                gifts_checked: gifts_checked
            })
            console.log("gifts_checked", gifts_checked);

            // if (e.checked) {
            //     this.setData({
            //         trans_balance: that.data.trans_balance + 0 + e.detail.value
            //     })
            // }else{
            //     this.setData({
            //         trans_balance: that.data.trans_balance - 0 - e.detail.value
            //     })
            // }

        },
        translate: function (e) {
            this.triggerEvent("translate", {})
        },
    }
})