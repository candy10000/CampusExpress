// pages/mine/TalkWithUs/TalkWithUs.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    equipmentNumber: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  
  goquestion:function(){
    wx.redirectTo({
      url: '../talkWithUs/question/question',
    })
  },

  bindEquipmentId: function (e) {
    this.setData({
      equipmentNumber: e.detail.value
    })
  },

  bindtest: function () {
    var that = this;
    wx.request({
      url: `${app.globalData.url}/feedback/mail`,//"http://localhost:8080/wxtest/response",
      data: {
        openId: app.getOpenid(),
        feedback: this.data.equipmentNumber
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data)
        if (res.data == "SUCCESS") {
          wx.showToast({
            title: '反馈成功',
            image: 'image/success.png',
            duration: 1500
          })
        } else {
          wx.showToast({
            title: '反馈失败',
            image: 'image/fail.png',
            duration: 1500
          })
        }
      },
      fail: function (res) {
        console.log(res)
        console.log("--------fail-------");
        wx.showToast({
          title: '反馈失败',
          image: 'image/fail.png',
          duration: 1500
        })
      }
    })
  },
  onLoad: function (options) {
   

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
