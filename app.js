//app.js
//获取应用实例
const app = getApp()
App({
  onLaunch: function (options) {
    wx.hideTabBar()
    this.getPhoneInfo()
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  onShow: function (options) {
    if (options.scene >= 1011 && options.scene <= 1013) {
      console.log("扫描QRCode进入小程序")
    }
  },
  getOpenid: function (url) {
    var appGetOpenid = wx.getStorageSync("openid");
    if (!appGetOpenid) {
      console.log("缓存中没有openid,正在从后台获取");
      wx.login({
        success: res => {
          if (res.code) {
            wx.request({
              url: this.globalData.url + "/wx/wxlogin",
              data: {
                code: res.code
              },
              success: res => {
                wx.setStorageSync("openid", res.data.openid);
                this.globalData.openId = res.data.openid;
                console.log("成功从后台获取openid，openid进缓存");
                console.log("缓存中存在openid：" + wx.getStorageSync("openid"))
                return appGetOpenid;
              }
            })
          }
        }
      })
    } else {
      console.log("缓存中存在openid：" + wx.getStorageSync("openid"))
      return appGetOpenid;
    }
  },
  getPhoneInfo() {
    wx.getSystemInfo({
      success: res => {
        this.globalData.phoneInfo = res
        console.log(res)
      }
    })
  },
  getDateStr: function (addDayCount) {
    var dd = new Date();
    dd.setDate(dd.getDate() + addDayCount);
    var year = dd.getFullYear();
    var month = dd.getMonth() + 1;
    var day = dd.getDate();
    if (month < 10) {
      month = '0' + month;
    }
    if (day < 10) {
      day = '0' + day;
    }
    return year + "-" + month + "-" + day;
  },
  //给未注册用户的提示
  showRegister(content) {
    wx.showModal({
      title: '提示', //提示的标题,
      content: '你还没注册,不能' + content + '哦', //提示的内容,
      showCancel: true, //是否显示取消按钮,
      cancelText: '取消', //取消按钮的文字，默认为取消，最多 4 个字符,
      cancelColor: '#000000', //取消按钮的文字颜色,
      confirmText: '我要注册', //确定按钮的文字，默认为取消，最多 4 个字符,
      confirmColor: '#3F51B5', //确定按钮的文字颜色,
      success: res => {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.navigateTo({
            // wx.redirectTo({
            url: '/pages/regist/regist',
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    });
  },

  globalData: {
    userInfo: true,
    url:"https://xcx.gaoxiao114.cn",
    urlb:"https://xcx.gaoxiao114.cn:8888",
    bignum:0,
    smallnum:0,
    globalOrders:[],
    globalMallOrders:[],
    globalPhotoOrders:[],
    goodsNum: 0,
    clickCommentPageBackBtn: false,
    isRegister: false,
    appid: "wx1376550dc322e50a",
    //页面临时数据传递
    temp: {
      //拾言假第一
      fackerSY: undefined
    }
  }
})