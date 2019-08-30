// pages/mine/mineFollow/Followers/Followers.js
var app = getApp();

Component({

  /**
   * 页面的初始数据
   */
  properties:{
    followersList: Array
  },
  data: {
    
    followersList: [
      // {
      //   id: '1',
      //   name: '超级农大快递代领1',
      //   picUrl: '/pages/pic/tom.jpg',
      //   desc: '我是映辉楼抗盒子有快递当然得找我',
      //   is_follow: true

      // },
      // {
      //   id: '2',
      //   name: '农大商城1',
      //   picUrl: '/pages/pic/jerry.jpg',
      //   desc: '饮料花生矿泉水有需要的吗',
      //   is_follow: false

      // },
    ]

  },
  attached() {
    // var followersList = wx.getStorageSync('followersList');
    var followersList = this.properties.followersList;
    if(followersList)
      this.setData({ followersList });

  },
  methods:{
    toList(e){
      console.log(e);
        console.log(e.currentTarget.dataset.index);
        wx.request({
          url: app.globalData.url + "/card/concern/" + e.currentTarget.dataset.index,
          method:'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
            },
          data: {
            beConcernId: e.currentTarget.dataset.index,
            openId: app.getOpenid(app.globalData.url)
          }, success(res) {
            console.log(res.data);
          }
        })

    },
    follow(e){
      var that = this;
      var isfollow = e.currentTarget.dataset.isfollow;
      var index = e.currentTarget.dataset.index;
      if(isfollow){
        wx.showModal({
          title: '提示',
          content: '是否要取消关注',
          success(res){
            if(res.confirm){
              console.log("confirm");
              wx.request({
                url: app.globalData.url + "/card/concern/" + index + "?openId=" + app.getOpenid(),
                method: 'DELETE',
                success: function(res){
                  console.log(app.getOpenid(app.getOpenid(app.globalData.url)));
                  console.log(e.currentTarget.dataset.index);
                  console.log(res);
                  var followersList = that.data.followersList;
                  wx.showToast({
                    title: '取关成功',
                    icon: 'success'
                  });
                  console.log("删除前" + that);
                  // that.is_follow = false;
                  for(let i = 0; i < followersList.length; i++){
                    if(followersList[i].id == index){
                      console.log("jjj");
                      followersList[i].is_follow = false;
                    }
                  }
                  wx.setStorageSync("followersList", followersList);
                  
                  console.log("删除后" + followersList);
                  that.refresh();

                },
                fail: function(){
                  console.log("取关失败");
                }

              })
            }else if(res.cancel){
              console.log("cancel");
            }
          }
        })
      }else{
        wx.showModal({
          title: '提示',
          content: '是否要关注TA',
          success(res){
            if(res.confirm){
              wx.request({
                url: app.globalData.url + "/card/concern/" + index,
                method: 'POST',
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                data:{
                  openId: app.getOpenid(app.globalData.url)
                },
                success: function(res){
                  var followersList = that.data.followersList;
                  wx.showToast({
                    title: '关注成功',
                    icon: 'success'
                  });
                  for (let i = 0; i < followersList.length; i++) {
                    if (followersList[i].id == index) {
                      console.log("aaa");
                      followersList[i].is_follow = true;
                    }
                  }
                  wx.setStorageSync("followersList", followersList);
                  that.refresh();
                },
                fail: function(){
                  console.log("关注失败");
                }
              })
            }else if(res.cancel){
                  console.log("cancel");
            }
          }
        })
      }
    },
    refresh(){
      console.log("刷新页面")
      var followersList = wx.getStorageSync('followersList');
      if (followersList)
      this.setData({"followersList": followersList });
      //用于主页面刷新人数
      this.triggerEvent('myEvent', { num: followersList.length }, {});
    },
    //跳转到用户详情页
    toOtgerInfo(e) {

      var id = e.currentTarget.dataset.index;
      console.log("this id is:" + id);
      wx.navigateTo({
        url: '/pages/othersInfo/othersInfo?openId=' + id,
      })
    }
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