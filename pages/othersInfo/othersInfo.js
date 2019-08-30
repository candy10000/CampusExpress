// pages/mine/mine.js
var app = getApp();
var otherId = "";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userFans: 0,
    isFollow: false,
    array: [{
      message: 'TA的任务',
      icon: 'fa fa-tasks'
    }, {
      message: 'TA的拾言',
      icon: 'fa fa-pagelines'
    }, ],
    userInfo: {
      // userPic: './test.jpeg',
      // nickname: '不抓老鼠的白猫',
      // gender: 'm',
      // fans: 813,
      // sign: '考研压力让我放弃了抓老鼠的爱好',
      // label_1: '#考研党',
      // label_2: '#风景园林',
      // label_3: '#福建农林大学',
    },
    titleList: [
      // { title: '少先队员' }, { title: '见习雷锋' }, { title: '标杆雷锋' }, { title: '感动中国' }
    ],
    giftList: [],
    giftsGetted: false,
    otherId: '',
    giftList: [
      //   {
      //     giftPic: 'https://xcx.gaoxiao114.cn/images/pic/iceCream.png',
      //     giftName: '甜甜圈',
      //     giftNum: 3,
      //   },
      //   {
      //     giftPic: 'https://xcx.gaoxiao114.cn/images/pic/FrenchFries.png',
      //     giftName: '薯条',
      //     giftNum: 2,
      //   },
      //   {
      //     giftPic: 'https://xcx.gaoxiao114.cn/images/pic/chickenLeg.png',
      //     giftName: '鸡腿',
      //     giftNum: 1,
      //   },
      //   {
      //     giftPic: 'https://xcx.gaoxiao114.cn/images/pic/watermelon.png',
      //     giftName: '西瓜',
      //     giftNum: 1,
      //   },
      //   {
      //     giftPic: 'https://xcx.gaoxiao114.cn/images/pic/candy.png',
      //     giftName: '糖果',
      //     giftNum: 10,
      //   },

    ],
    message: true,
    giftmall: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var openId = options.openId;
    otherId = openId;
    this.setData({
      otherId: otherId
    })
    this.getOtherInfo(openId);
    this.giftsGetted();

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
  MineSwitchPage: function (e) {
    //console.log(typeof(e.currentTarget.id));
    var pageNum = Number(e.currentTarget.id);
    //console.log(typeof(pageNum))

    switch (pageNum) {
      case 0:
        wx.navigateTo({
          url: '/pages/othersInfo/otherTask_1/otherTask_1?openId=' + otherId,
        });
        break;
      case 1:
        wx.navigateTo({
          url: '/pages/othersInfo/othersShiyan/othersShiyan?openId=' + otherId,
        });
        break;

      default:
    }
  },

  //点击关注和取消关注
  follow: function (e) {

    var that = this;

    var method = "";
    //点关注或取消的请求Method
    if (that.data.isFollow) {

      method = "DELETE";

    } else {

      method = "POST"

    }

    if (otherId != "") {
      wx.request({
        url: app.globalData.url + "/card/concern/" + otherId + "?openId=" + app.getOpenid(),
        method: method,
        //这里还要传pages
        success: function (res) {
          //console.log(res);
          console.log(method);
          console.log(res.data);
          if (method == "POST") {
            if (res.data == "SUCCESS") {
              that.setData({
                isFollow: true,
              })
            }
          } else if (method = "DELETE") {
            if (res.data == "SUCCESS") {
              that.setData({
                isFollow: false,
              })
            }
          }

          that.getfans();
        },
        fail: function (res) {
          console.log('关注或取消关注失败');
        },
      });
    } else {
      console.log("没有得到要关注人的openID")
    }
  },
  chooseGift(e) {
    var that = this
    // console.log(e , "显示商城按钮传过来的值")
    // var id = e.currentTarget.dataset.id
    that.setData({
      receiverId: otherId,
      giftmall: true
    })
  },

  getOtherInfo(openId) {
    var that = this;
    wx.request({
      url: app.globalData.url + '/customer/detail',
      data: {
        openId: openId
      },
      method: 'GET',
      success: function (res) {
        //用户头像

        if (res.data.userPic.split("/var/www/html").length > 1) {
          res.data.userPic = app.globalData.urlb + res.data.userPic.split("/var/www/html")[1];
        }

        console.log("getOtherInfo", res)
        that.data.userInfo.userPic = res.data.userPic; //用户头像
        that.data.userInfo.sign = res.data.signature; //用户签名
        that.data.userInfo.nickname = res.data.nickName; //用户签名
        that.data.userInfo.gender = res.data.gender; //用户性别
        that.data.userInfo.label_1 = res.data.laber; //用户标签
        that.data.userInfo.label_2 = res.data.major; //用户专业
        that.data.userInfo.label_3 = res.data.school; //用户学校
        that.setData({
          userInfo: that.data.userInfo
        })
        //console.log(res.data , "de dao yong hu shu j")

        that.isFollow(openId);
        that.getfans();
      },
      fail: function (res) {},
      complete: function (res) {},
    });


  },

  isFollow(openId) {
    var that = this;
    //判断是否关注
    wx.request({
      url: app.globalData.url + "/card/concern/other",
      method: "GET",
      data: {
        openId: app.getOpenid()
      },
      success: function (res) {
        //console.log(res, "guanzhu de shuju")
        if (res.data["SUCCESS"] != null && res.data["SUCCESS"].length > 0) {
          for (let item of res.data["SUCCESS"]) {
            if (item.customerInfo.openId == openId) {

              that.setData({
                isFollow: true
              })
              console.log("进入页面  判断为 已关注的");
              break;
            }
          }
        } else {
          console.log("进入页面  判断为 没有关注的人");
        }


      },
      fail: function (res) {
        console.log('得到关注的人失败');
      },
    });
  },

  getfans() {
    var that = this;
    wx.request({
      url: app.globalData.url + '/card/concern/me',
      data: {
        openId: otherId,
      },
      success: function (res) {
        //这里还需要取出来
        console.log("res.data", res.data);

        if (res.data["ERROR"] != "暂无关注者") {
          if (res.data["SUCCESS"]["0"]) {
            console.log("res.data[SUCCESS][0].customerInf", res.data["SUCCESS"]["0"].customerInfo);
            console.log("length", res.data["SUCCESS"].length);
            var fans = res.data["SUCCESS"].length

            console.log("userinfo");

            // that.data.userInfo.fans = res.data["SUCCESS"].length;
            // console.log(that.data.userInfo);
            that.setData({
              userFans: fans
            })
          }
        } else {
          that.setData({
            userFans: 0
          })
        }
      },
      fail: function (res) {},
      complete: function (res) {},
    })
  },
  //得到我收到的礼物
  giftsGetted() {
    var that = this;
    wx.request({
      url: app.globalData.url + '/customerSendgift/selectAllGiftsGetted',
      method: "GET",
      data: {
        // openId: app.getOpenid()
        openId: otherId
      },
      success: function (res) {
        console.log(res, "成功得到我的礼物")

        var giftList = [];
          for (var i = 0; i < res.data.length; i++) {
            res.data[i].icon = that.getImgPic(res.data[i].icon);
            giftList.push(res.data[i]);
          }


        that.setData({
          giftList: giftList,
        })
      },
      fail: function (res) {
        console.log(res, "得到我的礼物失败")
      }
    })
  },
  hideGiftMall(e) {
    var that = this
    that.setData({
      giftmall: false
    })
  },
  showGiftsGetted() {
    this.setData({
      giftsGetted: true,
    })
  },
  hiddenGiftsGetted() {
    this.setData({
      giftsGetted: false,
    })
  },
  showGift() {
    this.setData({
      giftmall: true,
    })
  },
  hiddenGiftmall() {
    this.setData({
      giftmall: false,
    })
  },
  //得到图片的路径
  getImgPic: function (icon) {
    var src = "";
    if (icon.split("/var/www/html").length > 1) {
      src = app.globalData.urlb + icon.split("/var/www/html")[1];
      //console.log(src , "处理后的图片路径")
    }

    return src;
  },
})