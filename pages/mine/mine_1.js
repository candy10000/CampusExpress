Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: [{
      message: '我的任务',
    }, {
        message: '我的拾言'
      },{
        message: '我的消息'
      },{
        message: '我的关注'
      },{
        message: '我的钱包'
      },{
        message: '联系我们'
      }, {
        message: '分享好友'
      }
      ],
      userInfo:{
        userPic:'./test.jpeg',
        nickname:'不抓老鼠的白猫',
        gender:'m',
        fans:813,
        sign:'考研压力让我放弃了抓老鼠的爱好',
        label_1:'#考研党',
        label_2: '#风景园林',
        label_3: '#福建农林大学',
      },
      titleList:[{title:'少先队员'},{title:'见习雷锋'},{title:'标杆雷锋'},{title:'感动中国'}],
      giftList:[
        {
          giftPic:'/pages/pic/甜甜圈.png',
          giftName:'甜甜圈',
          giftNum:3,
          },
        {
          giftPic: '/pages/pic/薯条.png',
          giftName: '薯条',
          giftNum: 2,
        },
        {
          giftPic: '/pages/pic/鸡腿.png',
          giftName: '鸡腿',
          giftNum: 1,
        },
        {
          giftPic: '/pages/pic/西瓜.png',
          giftName: '西瓜',
          giftNum: 1,
        },
        {
          giftPic: '/pages/pic/糖果.png',
          giftName: '糖果',
          giftNum: 10,
        },

      ] ,
    message:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(this.data.giftList.length)
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
  MineSwitchPage:function(e){
    console.log(e.currentTarget.id);
    if (e.currentTarget.id == 0){
      wx.navigateTo({
        url: '/pages/mine/mineTask/HelpMe/HelpMe',
      })
    }
  }
})