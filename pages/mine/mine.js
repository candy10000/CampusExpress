// pages/mine/mine.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  options: {
    addGlobalClass: true,
  },

  /**
   * 组件的初始数据
   */
  data: {
    weburl: app.globalData.urlb,
    array: [{
        class: 'fa fa-tasks',
        message: '我的任务',
      },
      {
        class: 'fa fa-pagelines',
        message: '我的拾言'
      },
      {
        class: 'fa fa-envelope',
        message: '我的消息'
      },
      {
        class: 'fa fa-star',
        message: '我的关注'
      },
      {
        class: 'fa fa-jpy',
        message: '我的钱包'
      },
      {
        class: 'fa fa-bell',
        message: '联系我们'
      },
      {
        class: 'fa fa-share',
        message: '分享好友'
      }
    ],
    // userInfo: {
    //   userPic: './test.jpeg',
    //   nickname: '不抓老鼠的白猫',
    //   gender: 'm',
    //   fans: 813,
    //   sign: '考研压力让我放弃了抓老鼠的爱好',
    //   label_1: '#考研党',
    //   label_2: '#风景园林',
    //   label_3: '#福建农林大学',
    // },
    userInfo: {},

    titleList: [{
      title: '少先队员'
    }, {
      title: '见习雷锋'
    }, {
      title: '标杆雷锋'
    }, {
      title: '感动中国'
    }],
    giftList: [],
    giftsGetted: false,
    message: false,
  },
  lifetimes: {
    attached() {
      // console.log("attached--------------");
      // this.giftsGetted();

      // var that = this;
      // wx.request({
      //   url: app.globalData.url + "/customer/detail",
      //   data: {
      //     openId: app.getOpenid(app.globalData.url)
      //   },
      //   success: function (res) {
      //     res.data.userPic = that.getImgPic(res.data.userPic);

      //     that.setData({
      //       userInfo: res.data
      //     })
      //     console.log("得到的userInfo:", that.data.userInfo);
      //     if (that.data.userInfo.message > 0) {
      //       that.message = true;
      //     } else {
      //       that.message = false;
      //     }
      //   }
      // })
      this.re_attached();
    }
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show() {
      this.re_attached();
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //下拉刷新调用的方法，attached()
    re_attached() {
      console.log("attached--------------");
      this.giftsGetted();

      var that = this;
      wx.request({
        url: app.globalData.url + "/customer/detail",
        data: {
          openId: app.getOpenid(app.globalData.url)
        },
        success: function (res) {
          console.log("原始userInfo", res.data)
          res.data.userPic = that.getImgPic(res.data.userPic);

          that.setData({
            userInfo: res.data
          })
          console.log("得到的userInfo:", that.data.userInfo);
        }
      })
      wx.request({
        url: app.globalData.url + "/message/new/index",
        data: {
          openId: app.getOpenid(app.globalData.url)
        }, //请求的参数",
        method: 'GET',
        success: res => {
          console.log("res.data.isnew", res.data.isnew);
          if (res.data.isnew) {
            that.setData({
              message: true
            })
          } else {
            that.setData({
              message: false
            })
          }
          console.log("message", that.data.message)
        },
        fail: () => {},
        complete: () => {}
      });
    },
    MineSwitchPage: function (e) {
      //console.log(typeof(e.currentTarget.id));
      var pageNum = Number(e.currentTarget.id);
      //console.log(typeof(pageNum))
      switch (pageNum) {
        case 0:
          wx.navigateTo({
            url: '/pages/mine/mineTask/myTask',
          });
          break;
          // case 1:
          //   wx.navigateTo({
          //     url: '/pages/mine/mineMessage/mineMessage',
          //   });
          //   break;

        case 1:
          wx.navigateTo({
            url: '/pages/mine/mineShiYan/mineShiYan',
          });
          break;

        case 2:
          wx.navigateTo({
            url: '/pages/mine/mineMessage/mineMessage',
          });
          break;
          // case 2:
          //   wx.navigateTo({
          //     url: '/pages/mine/mineAcount/mineAcount',
          //   });
          //   break;

        case 3:
          wx.navigateTo({
            url: '/pages/mine/mineFollow/mineFollow',
          });
          break;
        case 4:
          wx.navigateTo({
            url: '/pages/mine/mineAcount/mineAcount',
          });
          break;
        case 5:
          wx.navigateTo({
            url: '/pages/mine/talkWithUs/talkWithUs',
          });
          break;
        case 6:
          wx.navigateTo({
            url: 'https://xcx.gaoxiao114.cn/images/mine/mineTask/HelpMe/HelpMe',
          });
          break;
        default:
      }
    },
    editInfo: function (e) {
      var that = this
      console.log("userInfo_1", that.data.userInfo)
      var userInfo_obj = JSON.stringify(that.data.userInfo)
      wx.navigateTo({
        url: '/pages/mine/mineEdit/mineEdit?userInfo=' + userInfo_obj,
      })
    },

    //得到我收到的礼物
    giftsGetted() {
      var that = this;
      wx.request({
        url: app.globalData.url + '/customerSendgift/selectAllGiftsGetted',
        method: "GET",
        data: {
          openId: app.getOpenid()
        },
        success: function (res) {
          console.log(res, "成功得到我的礼物")

          var giftList = [];
          if (res.data.length > 3) {
            for (var i = 0; i < 3; i++) {
              res.data[i].icon = that.getImgPic(res.data[i].icon);
              giftList.push(res.data[i]);
            }
          } else {
            console.log("数据小于3")
            for (var i in res.data) {
              res.data[i].icon = that.getImgPic(res.data[i].icon);
              giftList.push(res.data[i]);
            }
            if (res.data.length < 3) {
              for (var i = res.data.length; i < 3; i++) {
                giftList.push(null);
              }
            }
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

    //得到图片的路径
    getImgPic: function (icon) {
      var src = "";
      if (icon.split("/var/www/html").length > 1) {
        src = app.globalData.urlb + icon.split("/var/www/html")[1];
        //console.log(src , "处理后的图片路径")
      }

      return src;
    },
  },
})