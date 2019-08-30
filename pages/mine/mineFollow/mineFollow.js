// pages/mine/mineTask/myTask.js
var app = getApp();
;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 0,
    followersList: [],
    followingList: [],
    num: 0
  },
  select1: function () {
    var that = this;
    // that.follow = that.selectComponent("#followingList");
    that.setData({
      current: 0,
      followingList: []
    })
    wx.request({
      url: app.globalData.url + "/card/concern/other",
      data: {
        openId: app.getOpenid(app.globalData.url)
      }, success(res) {
        var followingList = [];
        console.log("other");
        
        console.log(res.data.SUCCESS);
        if (res.data['SUCCESS']){
          for (var i = 0; i < res.data['SUCCESS'].length; i++) {
            var curpiclUrl = res.data['SUCCESS'][i].customerInfo.userPic.replace("/var/www/html", app.globalData.urlb);
            followingList = followingList.concat({ "id": res.data['SUCCESS'][i].customerInfo.openId, "name": res.data['SUCCESS'][i].customerInfo.nickName, "picUrl": curpiclUrl, "desc": res.data['SUCCESS'][i].customerInfo.signature });
          }
          console.log("查询关注成功");
          wx.setStorageSync('followingList', followingList);
          that.setData({
            num: followingList.length
          })
          var following = that.selectComponent("#following");
          following.refresh();
        }else{
          //没人关注时设置数量为0
          that.setData({
            num: 0,
            followingList: []
          })
        }
        console.log(followingList);
      }
    })

  },
  select2: function () {
    var that = this;
    that.setData({
      followersList: []
    })
    wx.request({
      url: app.globalData.url + "/card/concern/me",
      data: {
        openId: app.getOpenid(app.globalData.url)
      }, success(res) {
        var followersList = [];

        console.log(res.data['SUCCESS']);
        if (res.data['SUCCESS']) {
          for (var i = 0; i < res.data['SUCCESS'].length; i++) {
            var curpiclUrl = res.data['SUCCESS'][i].customerInfo.userPic.replace("/var/www/html", app.globalData.urlb);

            followersList = followersList.concat({ "id": res.data['SUCCESS'][i].customerInfo.openId, "name": res.data['SUCCESS'][i].customerInfo.nickName, "picUrl": curpiclUrl, "desc": res.data['SUCCESS'][i].customerInfo.signature, is_follow: res.data['SUCCESS'][i].haveConcern });
          }
          console.log("查询关注我的成功");
          wx.setStorageSync('followersList', followersList);
          that.setData({
            num: followersList.length
          })
          var followers = that.selectComponent("#followers");
          followers.refresh();
          console.log(followersList);
      }else{
        that.setData({
          num: 0,
          followersList: []
        })
      }
      }
    })

    that.setData({
      current: 1
    })

  },
  okEvent: function(e){
    console.log(e.detail);
    this.setData({
      num: e.detail.num
    })
  },

  
  showFollowers: function(){
    //进入页面时触发事件
    var followers = this.selectComponent("#followers");
    // var followers = this.selectComponent("#followers");
    console.log("进入页面");
    this.select2();
    //等待页面更新数据进入缓存
    setTimeout(function () {
      console.log("等待");
      followers.refresh();
    }, 200);
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
    //进入页面时触发事件
    var following = this.selectComponent("#following");
    console.log("进入页面");
    this.select1();
    //等待页面更新数据进入缓存
    // setTimeout(function(){
    //   console.log("等待");
    //   following.refresh();
    // },100);

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
      console.log("执行hide")
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