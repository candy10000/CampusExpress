// pages/task/taskPickUp/taskPickUpHelp.js
var app = getApp();
var taskId = "";
// var tel = ""
Page({

  /**
   * 页面的初始数据
   */
  data: {

    taskStyle: 2,
    contactInfo: '',
    contactType: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options);
    taskId = options.taskId;
    console.log("taskId", taskId);
    wx.request({
      url: app.globalData.url + '/task/selectMyNodeHelp',
      method: 'GET',
      data: {
        openId: app.getOpenid()
      },
      success: function (res) {
        console.log(res.data.records);
        var records = res.data.records;
        var currentRecord = [];
        var tel = "";
        for (let i = 0; i < records.length; i++) {
          if (records[i].taskId == taskId) {
            currentRecord = records[i];
            break;
          }
        }
        console.log("currentRecord", currentRecord);
        that.setData({
          contactType: currentRecord.contactType,
          contactInfo: currentRecord.contactInfo
        })
      }
    })
  },
  phoneCall() {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.contactInfo,
      success: function () {
        console.log("拨打成功");
      }
    })
  },
  copy() {
    wx.setClipboardData({
      data: this.data.contactInfo,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res.data) // data
            wx.showToast({
              title: '复制成功',
              icon: 'success',
              duration: 2000
            })
          }
        })
      }
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

  }
})