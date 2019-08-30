// pages/othersInfo/othersSquare/othersSquare.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topic: "#最喜欢的画",
    json: [
      {
        cardId: "123123123",
        userTitle: "喵喵摄影师",
        userId: "123123123",
        nickname: "不抓老鼠的白猫",
        userPic: "https://xcx.gaoxiao114.cn/images/pic//tom.jpg",
        desc: "悄悄画下舍友的猫",
        resourseNum: 4,
        resourse: [{ type: 0, url: "https://xcx.gaoxiao114.cn/images/pic/jerry.jpg" }, { type: 0, url: "https://xcx.gaoxiao114.cn/images/pic/jerry.jpg" }, { type: 1, url: "http://localhost:8080/test/fighting.mp4" }, { type: 1, url: "http://localhost:8080/test/fighting.mp4" }],
        audioNum: 0,
        audioResourse: [],
        likesNum: 168,
        commentNum: 32,
        shareNum: 12,

      },
      {
        cardId: "123123123",
        userTitle: "喵喵摄影师",
        userId: "123123123",
        nickname: "不抓老鼠的白猫",
        userPic: "https://xcx.gaoxiao114.cn/images/pic/tom.jpg",
        desc: "悄悄画下舍友的猫",
        resourseNum: 3,
        resourse: [{ type: 0, url: "https://xcx.gaoxiao114.cn/images/pic/jerry.jpg" }, { type: 0, url: "https://xcx.gaoxiao114.cn/images/pic/jerry.jpg" }, { type: 1, url: "http://localhost:8080/test/fighting.mp4" }],
        audioNum: 0,
        audioResourse: [],
        likesNum: 168,
        commentNum: 32,
        shareNum: 12,

      },

    ],

  },

  /**
   * 生命周期函数--监听页面加载
   */
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