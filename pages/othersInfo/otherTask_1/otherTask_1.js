// pages/othersInfo/otherTask_1/otherTask_1.js
var app = getApp();
var openId = "";
var taskList = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    openId = options.openId;
    console.log(openId);
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
    this.getTaskList();
    console.log("显示成功");
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
  getTaskList(){
    var that = this;
    taskList = [];
    wx.request({
      url: app.globalData.url + "/task/selectCustomerTaskPlaza",
      method: 'POST',
      data: {
        openid: app.getOpenid(app.globalData.url)
      },
      success: function(res){
        console.log("res.data.records:");
        console.log(res.data.records);
        var totalTask = res.data.records;
        
        //本地进行筛选任务
        for(let item of totalTask){
          if(item.initiatorId == openId){
            //用户头像路径设置
            item.userPic = app.globalData.urlb + item.userPic.split("/var/www/html")[1];
            taskList.push(item);

          }

        }
        console.log("ta的任务列表" + taskList);
        //看是否为空，任务列表为空需提示
        that.setData({
          taskList: taskList
        })
      },
      fail(){
        console.log("显示失败");
      }
    })
  },
  pickup1(e){
    var that = this;
    console.log(e);
    //跳转到拾起任务后继界面
    wx.request({
      url: app.globalData.url + "/task/tasknode/" + wx.getStorageSync("openid") + "/" + e.currentTarget.id,
      data: {
        "taskId": e.currentTarget.id,
        "openid": wx.getStorageSync("openid"),
      },
      success: function (res) {
        console.log(res);
        if (res.data.code == '500') {
          wx.showToast({
            title: '自己的任务不能拾取哦~',
            icon: 'none'
          });
        } else {
          wx.showModal({
            title: '',
            content: '你确定要拾取此任务吗？',
            success(res) {
              if (res.confirm) {
                wx.showToast({
                  title: '任务拾取成功',
                  duration: 500
                });
                wx.navigateTo({
                  url: '/pages/task/taskPickUp/taskPickUpHelp?taskId=' + e.currentTarget.id
                });
              }
            },
            fail(data) {
              wx.showToast({
                title: '给TA任务失败，请重试',
                icon: 'none'
              })
            },
          })

        }
        // console.log(res.data);
        // console.log(e);
      }, complete: function (res) {
        console.log("====complete===");
      }

    })
  },
  pickup2(e){
    //跳转到给TA任务后继界面
    wx.request({
      url: app.globalData.url + "/task/tasknode/" + app.getOpenid(app.globalData.url) + "/" + e.currentTarget.id,
      data: {
        "taskId": e.currentTarget.id,
        "openid": app.getOpenid(app.globalData.url),
      },
      success: function (res) {
        if (res.data.code == '500') {
          wx.showToast({
            title: '自己不能给自己任务哦~',
            icon: 'none'
          })
        } else {
          wx.showModal({
            title: '',
            content: '你确定要给TA此任务吗，若TA设置有赏金，要先支付哦',
            success(res) {
              if (res.confirm) {
                wx.showToast({
                  title: '给TA任务成功',
                  duration: 500
                });
                wx.navigateTo({
                  url: '/pages/task/taskPickUp/pickUpFinish?taskId=' + e.currentTarget.id
                });
              }
            }
          })
        };
      },
      fail(data) {
        wx.showToast({
          title: '拾取失败，请重试',
          icon: 'none'
        })
      }
      , complete: function (res) {
        console.log("====complete===");
      }

    })
  },
  toEnvelope(e){
    wx.navigateTo({
      url: '/pages/mine/mineTask/taskEnvelop/taskEnvelop?taskId=' + e.currentTarget.id
    })
  },
  //跳到任务详情页
  toTaskInfo(e) {
    wx.navigateTo({
      url: '/pages/task/taskInfo/taskInfo?taskId=' + e.currentTarget.dataset.id,
    })
  }
  

})