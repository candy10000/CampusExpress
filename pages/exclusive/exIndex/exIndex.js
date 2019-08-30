var app = getApp();
// pages/exclusive/exIndex/exIndex.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached() {
      this.re_attached();
    },
    moved() {},
    detached() {},
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    //退回首页清空信息
    show() {

      app.globalData.bignum = 0;
      app.globalData.smallnum = 0;
      app.globalData.globalOrders = [];
      app.globalData.globalMallOrders = [];
      app.globalData.goodsNum = 0;
    },
    hide() {},
    resize() {},
  },


  /**
   * 组件的初始数据
   */
  data: {
    school: ["福建农林大学"], //"江夏", "闽江", "外语外贸"
    schoolIndex: 0,
    businessList: [{
        id: '1',
        name: '零零七快递代领',
        picUrl: 'https://xcx.gaoxiao114.cn:8888/images/007new.png',
        desc: '我是映辉楼抗盒子有快递当然得找我'

      },
      {
        id: '2',
        name: '源梦奶品',
        picUrl: 'https://xcx.gaoxiao114.cn:8888/images/cownew.jpg',
        desc: '睡前一杯牛奶会有好梦哦'

      },
       {
        id: '3',
        name: '摄影约拍',
        picUrl: 'https://xcx.gaoxiao114.cn:8888/images/cownew.jpg',
        desc: '美美哒'

      }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 学校下拉框
    schoolSelect: function (e) {
      var that = this;
      that.setData({
        schoolIndex: e.detail.value
      });
      wx.setStorageSync('school', this.data.school[this.data.schoolIndex]);

      app.globalData.globalSchool = that.data.school[e.detail.value];
    },
    toList: function (e) {
      var index = e.currentTarget.dataset.index
      console.log(index)
      switch (index) {
        case "1":

          wx.navigateTo({
            url: '/pages/exclusive/exclusive',
            success: function (res) {},
            fail: function (res) {
              console.log(res)
            },
            complete: function (res) {},
          });
          // wx.showModal({
          //   title: '本学期007服务暂停了哦，期待下学期的再见',
          //   content: '本学期007服务暂停了哦，期待下学期的再见',
          //   showCancel: 'false'
          // })

          break;
        case "2":

          wx.navigateTo({
            url: '/pages/exclusive/mall/mall',
            success: function (res) {},
            fail: function (res) {},
            complete: function (res) {},
          })
          // wx.showModal({
          //   title: '本学期源梦奶品服务暂停了哦，期待下学期的再见',
          //   content: '本学期源梦奶品服务暂停了哦，期待下学期的再见',
          //   showCancel: 'false'
          // })
          break;
        case "3":

          wx.navigateTo({
            url: '/pages/exclusive/photo/pages/photogarph_index/photogarph_index',
            success: function (res) { },
            fail: function (res) {
              console.log(res)
            },
            complete: function (res) { },
          });
          // wx.showModal({
          //   title: '本学期007服务暂停了哦，期待下学期的再见',
          //   content: '本学期007服务暂停了哦，期待下学期的再见',
          //   showCancel: 'false'
          // })

          break;
        default:
          ;
      }
    },
    //下拉刷新调用的方法，attached()
    re_attached: function () {
      wx.setStorageSync('school', this.data.school[this.data.schoolIndex]);
      app.globalData.globalSchool = this.data.school[this.data.schoolIndex];
    }
  }
})