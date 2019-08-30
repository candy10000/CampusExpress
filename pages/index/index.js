// pages/index/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */

  data: {
    curPage: 1,
    squarePage: 1,
    currentTab: 0,
    isSearch1: false, //任务广场是否在搜索状态
    isSearch2: false, //拾言广场是否在搜索状态
    initScroll: false,
    reloading: false, //是否正在分页加载
    items: [{
        //    "iconPath": app.globalData.urlb + "/images/pic/task.jpeg",
        //   "selectedIconPath": app.globalData.urlb + "/images/pic/task.jpeg",
        "iconPath": "fontAwesomeIcon fa-tasks",
        "selectedIconPath": "fontAwesomeIcon fa-tasks selected",
        "text": "首页"
      },
      {
        "iconPath": "fontAwesomeIcon fa-bolt",
        "selectedIconPath": "fontAwesomeIcon fa-bolt selected",
        "text": "专属"
      },
      {
        "iconPath": "fontAwesomeIcon fa-pagelines",
        "selectedIconPath": "fontAwesomeIcon fa-pagelines selected",
        "text": "拾言"
      },
      {
        "iconPath": "fontAwesomeIcon fa-child",
        "selectedIconPath": "fontAwesomeIcon fa-child selected",
        "text": "我的"
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */


  onLoad: function (options) {
    var openid = app.getOpenid(app.globalData.url);
    wx.request({
      url: app.globalData.url + "/customer/isRegister",
      data: {
        openId: openid
      },
      success: function (res) {
        console.log("*********");
        console.log("/customer/isRegister",res.data);
        //判断注册
        if (res.data) {
          app.globalData.isRegister = true;
        }
        console.log("app.globalData.isRegister", app.globalData.isRegister)
      }
    })
  },
  swicNav: function (e) {
    console.log(e.target.dataset);
    console.log("switch");
    let that = this;
    // var shiyan = this.selectComponent("#square");
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      //如果进入的是“我的”页面，则先判断是否注册用户
      if (e.target.dataset.current == 3 && !app.globalData.isRegister) {
        console.log("currentTab == 3,未注册")
        wx.navigateTo({
          // wx.redirectTo({
          url: '/pages/regist/regist',
        })
        return;
      }
      that.setData({
        currentTab: e.target.dataset.current,
        curPage: 1,
        squarePage: 1,
      })
      if (that.data.currentTab == 2) {
        that.setData({
          initScroll: true
        })

        //刚进入拾言广场进行懒加载
        if (that.data.initScroll) {
          // setTimeout(() => {
            that.selectComponent("#square").lazyload();
            that.setData({
              initScroll: false
            })
          // }, 1000);

        }
      }

    }
  },
  addTask: function () {
    if (!app.globalData.isRegister) {
      app.showRegister("发布任务")
      return
    }

    let that = this;
    if (this.data.isAddTask == true) {
      that.setData({
        isAddTask: false,
      })
    } else {
      that.setData({
        isAddTask: true,
      })
    }
  },
  forHelp: function () {
    wx.navigateTo({
      url: '/pages/taskPublish/taskPublish_t1',
    })
  },
  helpOthers: function () {
    wx.navigateTo({
      url: '/pages/taskPublish/taskPublish_t2',
    })
  },
  //从任务广场中获取是否处于搜索状态

  changeSearchInfo(e) {
    console.log(e.detail);
    this.setData({
      isSearch1: e.detail[0],
      curPage: e.detail[1]
    })
  },
  //从拾言广场获取是否处于搜索状态
  changeSearchInfo2(e) {
    console.log(e.detail);
    this.setData({
      isSearch2: e.detail
    })
  },
  //从拾言广场中获取加载是否完成
  isReload(e) {
    console.log(e.detail, "reloading");
    this.setData({
      reloading: e.detail
    })
  },
  // lazyload(e){
  //   console.log(e.detail);
  //   this.setData({
  //     squareInfo: e.detail
  //   })
  // },
  /**

   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},


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
    var that = this;
    console.log("begin onPullDownRefresh");
    wx.showNavigationBarLoading();

    that.onLoad();
    //专属页
    if (that.data.currentTab == 1) {
      that.setData({
        currentTab: 1
      })
      console.log("currentTab", that.data.currentTab);
      var comp = that.selectComponent('#exIndex');
      comp.re_attached();
    }
    //拾言广场
    else if (that.data.currentTab == 2) {
      that.setData({
        currentTab: 2
      })
      console.log("currentTab", that.data.currentTab);
      var comp = that.selectComponent('#square');
      comp.re_attached();
    } else if (that.data.currentTab == 3) {
      that.setData({
        currentTab: 3
      })
      console.log("currentTab", that.data.currentTab);
      var comp = that.selectComponent('#mine');
      comp.re_attached();
    } else if (that.data.currentTab == 0) {
      // that.setData({
      //   currentTab: 0
      // })
      // var comp = that.selectComponent('#task');
      // comp.getData();

    }
    // 隐藏导航栏加载框
    wx.hideNavigationBarLoading();
    // 停止下拉动作
    wx.stopPullDownRefresh();
    console.log("wx.stopPullDownRefresh()");


  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var comp = this.selectComponent('#task');
    var shiyan = this.selectComponent('#square');
    console.log(shiyan);
    console.log(comp);

    var that = this;
    console.log("hello");
    console.log(this.data.currentTab);

    if (this.data.currentTab == 0) {
      // if (that.data.isSearch1 == true) {
      //   console.log(that.data.isSearch1);
      //   return;
      // }
      // that.data.curPage = that.data.curPage + 1;
      // console.log(comp);

      // comp.reloadTask(that.data.curPage);

      // console.log(this.selectComponent.setData);

      //任务的加载
      // wx.request({
      //   // url: getApp().globalData.url + "/task/selectTaskPlazaForHelp",
      //   url: app.globalData.url + "/task/selectTaskPlaza",
      //   pages:2,
      //   //这里还要传pages

      //   success: function (res) {
      //     console.log(res.data.records);
      //     that.setData({
      //       taskList: res.data.records
      //     })
      //   }
      // })

    } else if (this.data.currentTab == 2) {
      if (that.data.isSearch2 == true) {
        console.log(that.data.isSearch2);
        return;
      }
      that.data.squarePage = that.data.squarePage + 1;
      shiyan.reloadSquare(that.data.squarePage);
      //加载结束
      // that.setData({
      //   reloading: true
      // })
      console.log("拾言广场加载");


    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //监听页面滑动
  onPageScroll: function (res) {
    // var shiyan = this.selectComponent('#square');
    // console.log(res);
    var that = this;
    var shiyan = this.selectComponent("#square");
    if (that.data.currentTab == 2 && !that.data.reloading) {

      // setTimeout(() => {
      shiyan.lazyload();
      // },1000)

    } else {
      console.log("loading...");
    }
    // shiyan.lazyload(this.data.squareInfo);
    // console.log(this.data.squareInfo);
  }
})