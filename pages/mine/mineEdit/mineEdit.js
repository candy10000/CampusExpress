// pages/mine/mineEdit/mineEdit.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    shorName: '',
    weburl: "https://xcx.gaoxiao114.cn",
    school: ['福建农林大学', '江夏学院'],
    schoolIndex: 0,
    userInfo: {
      // userPic:'',
      // nickname:'',
      // gender:'', 
      // school:'福建农林大学',
      // major:'',
      // adress:'',
      // contactInfo:'',
      // isRealNameAuthentication:false,

    },
    gender: ['女', '男'],
    //联系方式，目前只有手机的
    contact: ['未知', '手机', 'QQ', '微信'],
    contactIdx: 0,
    address1: ['未知', '1号楼', '2号楼', '3号楼', '4号楼', '5号楼', '6号楼', '7号楼', '8号楼', '9号楼', '10号楼', '11号楼', '12号楼', '13号楼', '14号楼', '15号楼', '16号楼', '17号楼', '18号楼', '19号楼', '20号楼', '21号楼', '22号楼', '23号楼', '24号楼', '25号楼', '26号楼'],
    address2: ['未知', '桃1', '桃2', '桃3', '桃4', '桃5', '桃6', '桃7', '桃8', '南1', '南2', '南3', '南4', '北11', '北12', '东1', '东2', '东3', '东4', '东5', '东6', '东7', '东8'],
    addressIdx: 0,
    // address_spli: '',
    // contact_spli: '',
    Img: '',
  },

  /**
   * 切换头像函数
   */
  chooseImg: function () {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          'userInfo.userPic': tempFilePaths[0],
          weburl: '',
        })
        console.log("ChangePic", that.data.userInfo.userPic);
        //在选择图片成功的回调函数里调用上传头像的接口
        // 上传头像
        wx.uploadFile({
          url: app.globalData.url + '/customer/changeImg',
          // filePath: 'TEST',
          filePath: that.data.userInfo.userPic,
          name: 'file',
          method: "POST",
          header: {
            "Content-Type": "multipart/form-data"
          },
          formData: {
            openId: app.getOpenid(app.globalData.url)
          },
          success: function (res) {
            console.log("wx.uploadFile:", res);
            console.log("openId:", app.getOpenid(app.globalData.url));
          }
        })
      }
    })

  },
  EditFormSubmit: function () {
    var that = this;
    // var address_spli = that.data.addressIdx + ',' + that.data.userInfo.address;
    // var contact_spli = that.data.contactIdx + ',' + that.data.userInfo.tel;
    // that.setData({
    //   address_spli: address_spli,
    //   contact_spli: contact_spli
    // })
    // console.log("spliling", that.data.address_spli, '--', that.data.contact_spli)

    wx.request({
      url: app.globalData.url + '/customer/customerEdit',
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: {
        openId: app.getOpenid(app.globalData.url),
        nickName: that.data.userInfo.nickName,
        signature: that.data.userInfo.signature,
        laber: that.data.userInfo.laber,
        gender: that.data.userInfo.gender,
        school: that.data.school[that.data.schoolIndex],
        major: that.data.userInfo.major,
        address: that.data.address2[that.data.addressIdx] + ',' + that.data.userInfo.address,
        contact: that.data.contact[that.data.contactIdx] + ',' + that.data.userInfo.contact
      },
      success: function (res) {
        console.log("res.statusCode:", res.statusCode);
        if (res.statusCode == 200) {
          // wx.redirectTo({
          //   url: '/pages/mine/mine',
          // })
          wx.showModal({
            title: '提示',
            content: '修改成功!',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
                // //跳转会导致底部导航栏消失
                // wx.switchTab({
                //   url: '/pages/mine/mine',
                // })
                // let pages = getCurrentPages() //获取页面数组
                // let curPage = pages[pages.length - 1]  //获取当前页
                // curPage.onShow() //手动调用生命周期函数
                // wx.navigateBack({
                //   delta:1
                // })
                // wx.switchTab({
                //   url: '/pages/index/index',
                //   success: (result) => {
                //     let page = getCurrentPages().pop();
                //     if (page == undefined || page == null) return;
                //     page.onLoad();
                //   },
                //   fail: () => {},
                //   complete: () => {}
                // });
                wx.navigateBack({
                  delta: 1
                })

              } else if (res.cancel) {
                console.log('用户点击取消')

              }
            }
          })


        }
      }
    })

  },

  //---------begin 输入框和userInfo的双向绑定函数---------

  bindNameInput: function (e) {
    var that = this;
    if (e.detail.value.replace(/[^\x00-\xff]/g, "**").length > 16) {
      that.setData({
        'userInfo.nickName': that.data.shorName
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
      'userInfo.nickName': e.detail.value,
      shorName: e.detail.value
    })
  },
  bindSigInput: function (e) {
    var that = this;
    that.setData({
      'userInfo.signature': e.detail.value
    })
    // console.log("signature:", that.data.userInfo.signature)
  },
  bindLaberInput: function (e) {
    var that = this;
    that.setData({
      'userInfo.laber': e.detail.value
    })
    // console.log("bindLaberInput", userInfo.laber)

  },
  bindGenderInput: function (e) {
    var that = this;
    that.setData({
      'userInfo.gender': e.detail.value
    })
  },
  bindSchollInput: function (e) {
    var that = this;
    that.setData({
      schoolIndex: e.detail.value
    })
  },
  bindMajorInput: function (e) {
    var that = this;
    that.setData({
      'userInfo.major': e.detail.value
    })
  },
  bindTelInput: function (e) {
    var that = this;
    that.setData({
      contactIdx: e.detail.value
    })
    // console.log("bindTelInput", that.data.contactIdx)
  },
  bindTelInput2: function (e) {
    var that = this;
    that.setData({
      'userInfo.contact': e.detail.value
    })
  },
  bindAddrInput: function (e) {
    var that = this;
    that.setData({
      addressIdx: e.detail.value
    })
  },
  bindAddrInput2: function (e) {
    var that = this;
    that.setData({
      'userInfo.address': e.detail.value
    })
  },

  //---------end 输入框和userInfo的双向绑定函数---------
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var userInfo_obj = JSON.parse(options.userInfo);
    //用户头像路径设置
    if (userInfo_obj.userPic.split("/var/www/html").length > 1) {
      console.log("item.userPic.split", userInfo_obj.userPic.split("/var/www/html"));
      userInfo_obj.userPic = userInfo_obj.userPic.split("/var/www/html")[1];
    }
    //地址、联系方式回显
    if (userInfo_obj.address.indexOf(",") != -1) {
      that.setData({
        addressIdx: that.data.address2.indexOf(userInfo_obj.address.split(",")[0]),
      })
      userInfo_obj.address = userInfo_obj.address.split(",")[1];
    } else {
      that.setData({
        addressIdx: that.data.address2.indexOf(userInfo_obj.address),
      })
      userInfo_obj.address = "";
    }

    if (userInfo_obj.contact.indexOf(",") != -1) {
      that.setData({
        contactIdx: that.data.contact.indexOf(userInfo_obj.contact.split(",")[0]),
      })
      userInfo_obj.contact = userInfo_obj.contact.split(",")[1];
    }
    //学校回显
    that.setData({
      schoolIndex: that.data.school.indexOf(userInfo_obj.school)
    })

    that.setData({
      userInfo: userInfo_obj
    })
    console.log("this.data.userInfo", that.data.userInfo)

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