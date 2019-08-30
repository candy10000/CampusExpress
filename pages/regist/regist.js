// pages/mine/mineEdit/mineEdit.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    school: ['福建农林大学', '江夏学院'],
    gender: ['女', '男'],
    genderIdx: 0,
    schoolIdx: 0,
    addressIdx: 0,
    address1: ['1号楼', '2号楼', '3号楼', '4号楼', '5号楼', '6号楼', '7号楼', '8号楼', '9号楼', '10号楼', '11号楼', '12号楼', '13号楼', '14号楼', '15号楼', '16号楼', '17号楼', '18号楼', '19号楼', '20号楼', '21号楼', '22号楼', '23号楼', '24号楼', '25号楼', '26号楼'],
    address2: ['桃1', '桃2', '桃3', '桃4', '桃5', '桃6', '桃7', '桃8', '南1', '南2', '南3', '南4', '北11', '北12', '东1', '东2', '东3', '东4', '东5', '东6', '东7', '东8'],
    address: [],
    tempFilePaths: [],
    userInfo: {},
    tel: '点击验证手机号',
    iv: '',
    encryptedData: '',
    nickName: ''
  },
  regist: function (e) {
    console.log(e);
    var that = this;

    wx.uploadFile({
      url: app.globalData.url + '/customer/register',
      filePath: that.data.tempFilePaths[0],
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data"
      },
      formData: {
        nickName: e.detail.value.nickname,
        openId: app.getOpenid(app.globalData.url),
        address: that.data.address[e.detail.value.address1] + e.detail.value.address3,
        major: e.detail.value.major,
        encryptedData: that.data.encryptedData,
        iv: that.data.iv,
        gender: e.detail.value.gender,
        school: that.data.school[e.detail.value.school]
      },
      success: function (res) {
        var data = res.data;
        console.log(data);
        if (res.statusCode == 200) {
          app.globalData.isRegister = true;
          wx.reLaunch({
            url: '/pages/index/index',
          })
        }
        //do something  
      }

    })

    // wx.request({
    //   url: app.globalData.url + '/customer/register' ,
    //   method: 'POST',
    //   data:{

    //   },success:function(res){
    //     console.log(res.data);
    //   }
    // })
  },
  /**
   * 切换头像函数
   */
  chooseImg: function () {
    var that = this
    var userData = this.data.userInfo
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        console.log(res.tempFilePaths[0]);
        // tempFilePath可以作为img标签的src属性显示图片
        that.data.tempFilePaths = res.tempFilePaths
        userData.userPic = that.data.tempFilePaths[0]
        that.setData({
          userInfo: userData,
        })

      }
    })

  },
  bindNameInput: function (e) {
    var that = this;
    if (e.detail.value.replace(/[^\x00-\xff]/g, "**").length > 16) {
      that.setData({
        'userInfo.nickname': that.data.nickName
      })
      wx.showToast({
        title: '用户名过长!', //提示的内容,
        icon: 'none', //图标,
        // duration: 2000, //延迟时间,
        mask: true, //显示透明蒙层，防止触摸穿透,
        success: res => {}
      });
      return;
    }
    that.setData({
      'userInfo.nickname': e.detail.value,
      nickName: e.detail.value
    })
  },

  /**
   * 选择性别
   */
  genderChange: function (e) {
    var that = this
    console.log(e.detail.value)
    this.setData({
      genderIdx: e.detail.value
    })
  },

  schoolChange: function (e) {
    var that = this
    console.log(e.detail.value)
    if (e.detail.value == 0) {
      this.setData({
        address: that.data.address1
      })
    } else {
      this.setData({
        address: that.data.address2
      })
    }
    this.setData({
      schoolIdx: e.detail.value
    })

  },
  addressChange: function (e) {
    var that = this
    console.log(e.detail);
    this.setData({
      addressIdx: e.detail.value
    })
  },
  getPhoneNumber: function (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    if (e.detail.errMsg.split(":")[1] == 'ok') {
      this.setData({
        tel: '已验证手机号',
        iv: e.detail.iv,
        encryptedData: e.detail.encryptedData
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userData = this.data.userInfo
    var that = this;
    this.setData({
      address: that.data.address1
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