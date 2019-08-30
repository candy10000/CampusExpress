// pages/mine/mineFollow/Followers/Followers.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageList: [],
    messageShowInfo: [], //最终展示数组
    weburl: app.globalData.urlb,
    current: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMessage(this.data.current);
  },
  getMessage(current){

    var temp = [];
    temp = this.data.messageShowInfo;
    var list = temp;

    var that = this;
    wx.request({
      url: app.globalData.url + "/message/myMessageWithPage",
      data: {
        openId: app.getOpenid(app.globalData.url),
        size: 20,
        current
      },
      success: function (res) {
        console.log("mymessage", res.data)
        that.setData({
          messageList: res.data
        })
        for (var i in res.data) {
          //用户头像路径设置
          if (res.data[i].executorPicUrl.split("/var/www/html").length > 1) {
            res.data[i].executorPicUrl = res.data[i].executorPicUrl.split("/var/www/html")[1];
          }

          console.log(res.data[i].messageType)
          var message = {}
          message = res.data[i]
          switch (res.data[i].messageType) {
            case "取消任务":
              message.about = "如有争议请联系客服"
              message.icon = "fa fa-times message_icon"
              list.push(message)
              break;

            case "评论点赞":
              message.messageDetail = "赞了你的评论";
              message.about = null
              message.icon = "fa fa-thumbs-o-up message_icon"
              list.push(message)
              break;

            case "拾起任务":
              message.messageDetail = "拾起了你任务";
              message.about = "请等待TA的联系"
              message.icon = "fa fa-smile-o message_icon"
              list.push(message)
              break;

            case "确认任务":
              message.about = "看看你的钱包增加了多少"
              message.icon = "fa fa-check message_icon"
              list.push(message)
              break;

            case "收到礼物":
              message.messageDetail = "送了你礼物";
              message.about = "快去回赠他吧"
              message.icon = "fa fa-gift message_icon"
              list.push(message)
              break;
            case "收到任务":
              message.messageDetail = "决定给你一个任务";
              message.about = "请等待TA的联系"
              message.icon = "fa fa-smile-o message_icon"
              list.push(message)
              break;
            case "任务信封":
              message.messageDetail = "给你发送了一封任务信封";
              message.about = "快点点击看看吧"
              message.icon = "fa fa-envelope-o message_icon"
              list.push(message)
              break;
            case "回复拾言":
              message.messageDetail = "评论了你的拾言";
              // message.about = "快点点击看看吧"
              message.icon = "fa fa-comment-o message_icon"
              list.push(message)
              break;
            case "拾言点赞":
              // message.about = "快点点击看看吧"
              message.messageDetail = "赞了你的拾言"
              message.icon = "fa fa-thumbs-o-up message_icon"
              list.push(message)
              break;
            case "回复评论":
              message.messageDetail = "回复了你的评论"
              // message.about = "快点点击看看吧"
              message.icon = "fa fa-comment-o message_icon"
              list.push(message)
              break;
            case "收获粉丝":
              message.messageDetail = "关注了你"
              // message.about = "快点点击看看吧"
              message.icon = "fa fa-star message_icon"
              list.push(message)
              break;
            case "管理员消息":
              message.executorName = "系统通知";
              message.icon = "fa fa-headphones message_icon";
              list.push(message);
              break;
          }
        }
        that.setData({
          messageShowInfo: list
        })
        console.log("messageShowInfo", that.data.messageShowInfo);
      }
    })
  },
  goDetail: function (e) {
    console.log("goDetail", e.currentTarget.dataset);
    var messageType = e.currentTarget.dataset.hi.messageType;
    var url = e.currentTarget.dataset.hi.detailUrl;
    switch (messageType) {
      case "回复评论":
        wx.navigateTo({
          url: url,
        })
        break;
      case "收获粉丝":
        wx.navigateTo({
          url: '/pages/othersInfo/othersInfo?openId=' + e.currentTarget.dataset.hi.executorHomePage,
        })
        break;
      case "回复拾言":

        break;
      case "拾言点赞":
        wx.navigateTo({
          url: url,
        })
        break;
      case "评论点赞":
        wx.navigateTo({
          url: url,
        })
        break;
      case "收到礼物":
        // wx.navigateTo({
        //   url: '../mineAcount/mineAcount',
        // })
        wx.navigateTo({
          url: '/pages/othersInfo/othersInfo?openId=' + e.currentTarget.dataset.hi.executorHomePage,
        })
        break;
        // case "任务信封":

        //   break;
      default:
        wx.navigateTo({
          url: '/pages/othersInfo/othersInfo?openId=' + e.currentTarget.dataset.hi.executorHomePage,
        })
        break;
    }
    // var cardId = e.currentTarget.dataset.id;
    // var liked = e.currentTarget.dataset.liked;

  },
  toOtgerInfo(e) {
    console.log("e:", e);
    var id = e.target.dataset.id;
    // var id = e.currentTarget.dataset.openId;
    console.log("e.target.dataset.id.split(：id)", e.target.dataset.id.split("："))
    // if (e.target.dataset.id.split("：id").length > 1) {
    //   id = e.target.dataset.id.split("：id")[1];
    // }
    console.log("this id is:" + id);
    wx.navigateTo({
      url: '/pages/othersInfo/othersInfo?openId=' + id,
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
    this.getMessage(this.data.current + 1);
    this.setData({
      current: this.data.current + 1
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },



})