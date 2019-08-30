// pages/mine/mineTask/HelpMe/EnvelopDetail/EvelopDetail.js
var app = getApp()
var allUrl =''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskId: '',
    envelopeId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options, "envelope_detail_options")
    this.setData({ taskId: options.taskId, publisherId: options.publisherId })
    this.initEnvelope()
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

  /**
   * 获取comment组件的数据
   */
  initEnvelope() {
    wx.request({
      //app.globalData.url
      url: `${app.globalData.url}/envelope/detail/${this.data.taskId}/${this.data.publisherId}`,
      success: res => {
        console.log(res, "init_envelop")
        this.setData({ envelopeId: res.data.head.envelopeId })
        
      }, fail: res => {
        console.log(res)
      }
    })
  },
  getDataFromComment(data) {
    console.log(data)
    //发送图文回复
    var fileArr = data.imgBox;
    if (fileArr.length > 0) {
      this.uploadFile(0, fileArr)
    } else {
      this.uploadEnvelop(res)
    }
  },
  getRecordFromComment(data) {
    console.log(data)
    //发送语音回复
    var fileArr = data.imgBox;
    if (fileArr.length > 0) {
      this.uploadFile(0, fileArr)
    } else {
      this.uploadEnvelop(res)
    }
  },
  uploadFile(idx, fileArr) {
    wx.uploadFile({
      url: `${app.globalData.url}/envelope/upload`,
      filePath: fileArr[idx],
      name: 'file',
      header: {},
      formData: {
        taskId: this.data.taskId
      },
      success: res => {
        if(idx == fileArr.length - 1) {
          this.uploadEnvelop(res)
        } else {
          this.uploadFile(idx + 1, fileArr)
        }
      },
      fail: res => {

      }
    })
  },
  uploadEnvelop(res) {
    wx.request({
      url: `${app.globalData.url}/envelope/reply`,
      data: {
        envelopeId: this.data.envelopeId,
        openId: app.globalData.openId,
        textMsg: res.text,
        allUrl: allUrl
      },
      success: res => {
        allUrl = ''
        wx.showToast({
          title: res.data,
          icon: 'none',
          duration: 1500
        })
      },
      fail: res => {

      }
    })
  }
})