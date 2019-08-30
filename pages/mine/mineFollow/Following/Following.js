  // pages/mine/mineFollow/Following/Following.js
var app = getApp();
Component({

  /**
   * 页面的初始数据
   */
  
  properties: {
    folloingList: Array
  },
  
  data: {
    
    followingList: [
      // {
      //   id: '1',
      //   name: '超级农大快递代领2',
      //   picUrl: '/pages/pic/tom.jpg',
      //   desc: '我是映辉楼抗盒子有快递当然得找我',
      // },
      // {
      //   id: '2',
      //   name: '农大商城2',
      //   picUrl: '/pages/pic/jerry.jpg',
      //   desc: '饮料花生矿泉水有需要的吗',

      // },
    ]
  },    
  attached() {
      // var followingList = wx.getStorageSync('followingList');
      var followingList = this.properties.folloingList;
      if(followingList)
        this.setData({followingList});
      
    },
    methods:{
      toList(e){
        wx.request({
          url: app.globalData.url + "/card/concern/" + e.currentTarget.dataset.index,
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            beConcernId: e.currentTarget.dataset.index,
            openId: app.getOpenid(app.globalData.url)
          }, success(res) {
            console.log(res);
          }
        })
      },
      cancelFollow(e){
        var that = this;
        wx.showModal({
          title: '提示',
          content: '是否要取消关注',
          success(res){
            if(res.confirm){
              console.log("confirm");
              // this.setData({})
              wx.request({
                url: app.globalData.url + "/card/concern/" + e.currentTarget.dataset.index + "?openId=" + app.getOpenid(),
                method: 'DELETE', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                success: function(res){
                  console.log(app.getOpenid(app.getOpenid(app.globalData.url)));
                  console.log(e.currentTarget.dataset.index);
                  console.log(res);
                  wx.showToast({
                    title: '取关成功',
                    icon: 'success'
                  });
                  var followingList = that.data.followingList;
                  console.log("删除前" + followingList);
                  for(let i = 0; i < followingList.length; i++){
                    if(followingList[i].id == e.currentTarget.dataset.index){
                      followingList.splice(i, 1);
                      break;
                    }
                  }
                  console.log("删除后" + followingList);
                  wx.setStorageSync("followingList", followingList);
                  that.refresh();
                },
                fail: function() {
                  // fail
                  console.log("删除失败");
                }
              })

              // that.onLoad();
            }else if(res.cancel){
              console.log("cancel");
            }
          }
        })
      },
      refresh: function(){
        console.log("执行刷新");
        var followingList = wx.getStorageSync('followingList');
        if(followingList)
          this.setData({followingList: followingList});
          //用于主页面刷新人数
          this.triggerEvent('myEvent',{num: followingList.length}, {});
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
    // this.data.followingList = wx.getStorageSync('followingList');
    
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
    var followingList = wx.getStorageSync('followingList');
    if (followingList)
      this.setData({ followingList: followingList });
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