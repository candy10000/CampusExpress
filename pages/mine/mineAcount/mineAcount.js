// pages/mine/mineAcount/mineAcount.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    weburl: "https://xcx.gaoxiao114.cn:8888",
    mHidden: true,
    isSelectGift: false,
    selectedGiftId: 1,
    customerData: [],

    balanceValue: 6800,
    giftTemp: 1,
    giftListLength: 0,
    chargeMoney: 0,
    //api获取的/gifts/selectGifts 查询用户拥有的所有礼物
    selectGifts: {},
    giftList: {
      // 'donuts': {
      //   giftid: 1,
      //   giftfrom: '小汤姆',
      //   giftPic: '/pages/pic/甜甜圈.png',
      //   giftName: '甜甜圈',
      //   giftNum: 3,
      //   message: '是很爱吃的小汤姆送你的',
      // },
      // 'chips': {
      //   giftid: 2,
      //   giftfrom: '小汤姆',
      //   giftPic: '/pages/pic/薯条.png',
      //   giftName: '薯条',
      //   giftNum: 2,
      //   message: '是很爱吃的小汤姆送你的',
      // },
      // 'drumstick': {
      //   giftid: 3,
      //   giftfrom: '大杰瑞',
      //   giftPic: '/pages/pic/鸡腿.png',
      //   giftName: '鸡腿',
      //   giftNum: 1,
      //   message: '',
      // },
      // 'watermelon': {
      //   giftid: 4,
      //   giftfrom: '产品精灵',
      //   giftPic: '/pages/pic/西瓜.png',
      //   giftName: '西瓜',
      //   giftNum: 1,
      //   message: '',
      // },
      // 'candy': {
      //   giftid: 4,
      //   giftfrom: '小汤姆',
      //   giftPic: '/pages/pic/糖果.png',
      //   giftName: '糖果',
      //   giftNum: 10,
      //   message: '',
      // },
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: app.globalData.url + "/customerSendgift/selectAllGiftsGetted",
      data: {
        openId: app.getOpenid(app.globalData.url)
        //这里测试礼物接口，用了一个有礼物的openId
        // openId: 'oqa7H5Y17NbRqhBrlPvsCHV0jwV0'
      }, success: function (res) {
        //设置礼物图标
        if (res.data.length > 0) {
          for (let item of res.data) {
            if (item.icon.split("/var/www/html").length > 1) {
              item.icon = item.icon.split("/var/www/html")[1];
            }
          }
        }

        that.setData({
          giftList: res.data
        })
        console.log("giftList", that.data.giftList);
      }
    })
    var that = this
    console.log("Object.keys(that.data.giftList).length");
    console.log(Object.keys(that.data.giftList).length)
    var length = Object.keys(that.data.giftList).length
    that.setData({
      giftTemp: 0,
      giftListLength: length,
    })

    that.getcustomerData();
  },
  ipsd: function (e) {
    this.data.chargeMoney = e.detail.value;

    console.log(e);
  },
  change: function () {
    this.setData({
      mHidden: false
    })
  },

  changeModal: function (e) {
    console.log(e);
    var that = this;
    console.log(this.data.chargeMoney);
    var random_number = Math.floor(Math.random() * 90000 + 10000);
    var time_stamp = "" + parseInt(new Date().getTime());
    time_stamp = time_stamp.substring(6, 13);
    var update_id = random_number + time_stamp;
    wx.request({
      url: app.globalData.url + "/bill/add",
      method: 'POST',
      header: {
        "Content-Type": "application/json",
      },
      data: {
        id: update_id,
        price: this.data.chargeMoney * 100,
        initOpenid: app.getOpenid(app.globalData.url),
        contactInfo: 'test',
        total_fee: this.data.chargeMoney * 100,
        reward: this.data.chargeMoney * 100
      }, success: function (res) {
        wx.request({
          url: app.globalData.url + "/wx/wxPay/recharge",
          data: {
            appid: app.globalData.appid,
            mch_id: "1510474321",
            body: "拾和点数充值",
            openid: app.getOpenid(app.globalData.url),
            out_trade_no: update_id,
            total_fee: that.data.chargeMoney *100
          }, success: function (res) {
            wx.request({
              url: getApp().globalData.url + "/wx/PaySign/task",
              data: {
                appid: app.globalData.appid,
                timeStamp: parseInt(new Date().getTime() / 1000),
                nonceStr: "",
                package: "prepay_id=" + res.data.pre,
                signType: "MD5",
              }, success: function (res) {
                wx.requestPayment({
                  timeStamp: res.data.timeStamp,
                  nonceStr: res.data.nonceStr,
                  package: res.data.package,
                  signType: 'MD5',
                  paySign: res.data.paySign,
                  success: function (res) {
                    console.log(res);
                    wx.navigateBack({
                      delta: 1
                    })
                  }, fail: function () {
                    wx.showToast({
                      title: '用户取消支付',
                      icon: 'loading'
                    })
                  }
                })

                console.log(res.data);
              }, fail: function () {
                wx.showToast({
                  title: '签名接口调用失败',
                  icon: 'loading'
                })
              }
            })

          }
        })

      }
    })

  },
  modalCancel: function (e) {
    this.setData({
      mHidden: true
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.onLoad();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  translate: function (e) {
    if (this.data.isSelectGift) {
      this.hide();
    } else {
      console.log(e.currentTarget)
      this.setData({ selectedGiftId: e.currentTarget.dataset.giftid })
      this.setData({ isSelectGift: true })
    }


  },
  hide: function () {
    this.setData({ isSelectGift: false })
  },

  cancelTrans: function (e) {

  },

  //得到用户信息
  getcustomerData() {
    var that = this;
    wx.request({
      url: app.globalData.url + '/customer/detail',
      data: {
        openId: app.getOpenid()
        // openId: 'oqa7H5Y17NbRqhBrlPvsCHV0jwV0'
      },
      method: 'GET',
      success: function (res) {
        console.log("用户数据", res);
        that.setData({
          customerData: res.data,
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  }



})