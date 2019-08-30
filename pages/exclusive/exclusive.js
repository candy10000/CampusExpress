// pages/exclusive/exclusive.js
var list = []
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    recipients: "",
    companyNum:"",
    customerTelephone: "",
    expressageCompany: "",
    expressageCode: "",
    destination: "",
    roomnum: "",
    expressageArriveTime: "",
    expressageDescription: "",
    specification: "",
    // 下标
    expressageCompany_index: "",
    expressageArriveTime_index: "",
    // index:0,


    // 数组
    cards_main_groupId: [],
    cards: [],
    orders: [],
    school: ["福建农林大学", "江夏", "闽江", "外语外贸"],
    schoolIndex: 0,
    express: ["快递公司","顺丰", "韵达", "圆通", "中通", "申通", "百世", "EMS邮政", "天天", "苏宁", "京东","芝麻开门"],
    multiIndex: [0, 0],
    multiArray: [["桃区", "南区", "北区", "东苑"], ["桃1", "桃2", "桃3", "桃4", "桃5", "桃6", "桃7", "桃8",]],
    objectMultiArray:
      [
        { "regid": "2", "parid": "1", "regname": "桃区", "regtype": "1", "ageid": "0" },
        { "regid": "3", "parid": "1", "regname": "南区", "regtype": "1", "ageid": "0" },
        { "regid": "4", "parid": "1", "regname": "北区", "regtype": "1", "ageid": "0" },
        { "regid": "5", "parid": "1", "regname": "东苑", "regtype": "1", "ageid": "0" },

        { "regid": "6", "parid": "2", "regname": "桃1", "regtype": "2", "ageid": "0" },
        { "regid": "7", "parid": "2", "regname": "桃2", "regtype": "2", "ageid": "0" },
        { "regid": "8", "parid": "2", "regname": "桃3", "regtype": "2", "ageid": "0" },
        { "regid": "9", "parid": "2", "regname": "桃4", "regtype": "2", "ageid": "0" },
        { "regid": "10", "parid": "2", "regname": "桃5", "regtype": "2", "ageid": "0" },
        { "regid": "11", "parid": "2", "regname": "桃6", "regtype": "2", "ageid": "0" },
        { "regid": "12", "parid": "2", "regname": "桃7", "regtype": "2", "ageid": "0" },
        { "regid": "13", "parid": "2", "regname": "桃8", "regtype": "2", "ageid": "0" },

        { "regid": "14", "parid": "3", "regname": "南1", "regtype": "2", "ageid": "0" },
        { "regid": "15", "parid": "3", "regname": "南2", "regtype": "2", "ageid": "0" },
        { "regid": "16", "parid": "3", "regname": "南3", "regtype": "2", "ageid": "0" },
        { "regid": "17", "parid": "3", "regname": "南4", "regtype": "2", "ageid": "0" },

        { "regid": "2185588881148", "parid": "4", "regname": "北1", "regtype": "2", "ageid": "0" },
        { "regid": "19", "parid": "4", "regname": "北2", "regtype": "2", "ageid": "0" },
        { "regid": "20", "parid": "4", "regname": "北3", "regtype": "2", "ageid": "0" },
        { "regid": "21", "parid": "4", "regname": "北4", "regtype": "2", "ageid": "0" },
        { "regid": "22", "parid": "4", "regname": "北5", "regtype": "2", "ageid": "0" },
        { "regid": "23", "parid": "4", "regname": "北11", "regtype": "2", "ageid": "0" },

        { "regid": "24", "parid": "5", "regname": "东1", "regtype": "2", "ageid": "0" },
        { "regid": "25", "parid": "5", "regname": "东2", "regtype": "2", "ageid": "0" },
        { "regid": "26", "parid": "5", "regname": "东3", "regtype": "2", "ageid": "0" },
        { "regid": "27", "parid": "5", "regname": "东4", "regtype": "2", "ageid": "0" },
        { "regid": "28", "parid": "5", "regname": "东5", "regtype": "2", "ageid": "0" },
        { "regid": "29", "parid": "5", "regname": "东6", "regtype": "2", "ageid": "0" },
        { "regid": "30", "parid": "5", "regname": "东7", "regtype": "2", "ageid": "0" },
        { "regid": "31", "parid": "5", "regname": "东8", "regtype": "2", "ageid": "0" },
      ],
    date: ["收到快递短信的日期", "今天", "昨天", "前天"],
    MailSpecification: [
      { name: "std1", value: '小件', checked: true },
      { name: "std2", value: '大件', checked: false }
    ],

    // 水印文字
    usernameph: "输入快递单上的姓名",
    phonenumph: "输入联系电话",
    codeph: "取件号码",
    roomnumph: "宿舍号码",
    otherph: "输入需要额外备注的内容",

    // 数字变量
    buynum: 0,
    indextemp: 0,

    // 布尔变量
    card3: true,
    card4: true,
    card5: true,
    card6: true,
    card7: true,
    card8: true,
    // 加载和完成图标
    morehidden: true,
    completehidden: true,
    distination_enable: "",
    roomnum_enable: "",


    imgs: [
      "https://xcx.gaoxiao114.cn:8888/images/post1.jpg",
      "https://xcx.gaoxiao114.cn:8888/images/post2.jpg",
      "https://xcx.gaoxiao114.cn:8888/images/post3.jpg",
      "https://xcx.gaoxiao114.cn:8888/images/post4.jpg",

    ],

    imgheights: [],
    current: 0,



  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log("----------onload-------")
    var that = this;
    // wx.showModal({
    //   title: '通知!',
    //   content: '这个学期拾和君的快递业务已经结束啦！感谢大家的支持 预祝大家考试全过 新年快乐!',
    // })
    // 版本更新
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log("是否含有新版本");
      console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })

    console.log("主页:");
    var openid = app.getOpenid(app.globalData.url);
    // 初始化随机数和时间戳
    var random_number = Math.floor(Math.random() * 90000 + 10000);
    var time_stamp = "" + parseInt(new Date().getTime());
    time_stamp = time_stamp.substring(6, 13)

    that.data.orders = [];
    app.globalData.orders = [];
    that.data.buynum = 0;
    that.data.bignum = 0;

    var orders = [];
    app.globalData.globalOrders = [];
    var strOrders = "app.globalData.globalOrders";

    this.setData({
      random_number: random_number,
      time_stamp: time_stamp,
      openid: openid
    })

    // 初始化快递信息文本
    that.setData({
      orders: orders,
      name:"",
      companyNum: "",
      tel:"",
      [strOrders]:[],
      recipients: "",
      customerTelephone: "",
      expressageCompany: "",
      expressageCode: "",
      destination: "",
      roomnum: "",
      expressageArriveTime: "",
      expressageDescription: "",
      specification: "",
      // 下标
      expressageCompany_index: "",
      expressageArriveTime_index: "",


      expressageCompany: that.data.express[0],
      destination: that.data.multiArray[1][0],
      expressageArriveTime: that.data.date[0],
      specification: "小于40cm*40cm",
      // 下标
      expressageCompany_index: 0,
      expressageArriveTime_index: 0
    })

    // 获取卡片信息
    wx.request({
      url: getApp().globalData.url + "/wx/showOrder",
      data: {
        userid: that.data.openid,
      },
      success: function (res) {
        console.log("获取openid成功，用来调用卡片信息：" + that.data.openid);
        that.setData({
          cards: res.data
        })
        console.log("获取cards卡片信息：");
        console.log(that.data.cards)
        //  将母订单id存进data中
        var cards_main_groupId = [];
        var temp_id = "";
        for (var i = 0; i < that.data.cards.length; i++) {
          var main_id = that.data.cards[i].id.substring(0, 12);
          if (temp_id != main_id) {
            temp_id = main_id;
            cards_main_groupId.push(temp_id);
            that.setData({
              cards_main_groupId
            })
          }
          var s = "cards[" + i + "].main_id";
          that.setData({
            [s]: main_id
          })
        }
        console.log("卡片分组id：");
        console.log(that.data.cards_main_groupId);

        // 由于onload的异步请求，所以讲一下代码放到此地
        // 若卡片数量小于2，显示加载完成，否则，显示加载更多
        if (that.data.cards_main_groupId.length <= 2) {
          that.setData({
            morehidden: true,
            completehidden: false
          })
        } else {
          that.setData({
            morehidden: false,
            completehidden: true
          })
        }

        if (that.data.cards_main_groupId.length > 2) {
          that.setData({
            indextemp: 2
          })
        }

      }
    })

    //从订单信息页回来 加载数据
    that.setData({
      bignum: app.globalData.bignum,
      smallnum: app.globalData.smallnum,
      orders: app.globalData.globalOrders,
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //console.log("----------onReady-------")
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //console.log("----------onShow-------")
    // 初始化快递信息文本
    // this.setData({
    //   // 下标
      
    //   expressageCompany_index: 0,
    //   expressageArriveTime_index: 0
    // })
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    //console.log("----------onHide-------")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    //console.log("----------onUnload-------")
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */



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



  onPullDownRefresh: function () {
    wx.showNavigationBarLoading(); //在标题栏中显示加载
    // 刷新
    setTimeout(function () {
      app.globalData.bignum = 0;
      app.globalData.smallnum = 0;
      wx.reLaunch({
        url: '/pages/exclusive/exIndex/exIndex',
        success: function (res) {
          console.log("成功");
        }, fail: function (res) {
          console.log("失败");
        }
      })
    }, 1000)

    //模拟加载
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1000);
  },

  // 学校下拉框
  schoolSelect: function (e) {
    var that = this;
    that.setData({
      schoolIndex: e.detail.value
    })
  },

  // 实时捕捉文本信息
  // 姓名
  catch_recipients(e) {
    var that = this;
    that.setData({
      recipients: e.detail.value
    })
    console.log(e.detail.value);
  },
  // 电话
  catch_customerTelephone(e) {
    var that = this;
    that.setData({
      customerTelephone: e.detail.value
    })
    console.log(e.detail.value);
  },
  // 取件码
  catch_expressageCode(e) {
    var that = this;
    that.setData({
      expressageCode: e.detail.value
    })
    console.log(e.detail.value);
  },
  // 宿舍号码
  // catch_roomnum(e) {
  //   var that = this;
  //   that.setData({
  //     roomnum: e.detail.value
  //   })
  //   console.log(e.detail.value);
  // },
  // 其他备注
  catch_expressageDescription(e) {
    var that = this;
    that.setData({
      expressageDescription: e.detail.value
    })
    console.log(e.detail.value);
  },
  // 快递规格大小
  catch_specification(e) {
    var that = this;
    that.setData({
      specification: e.detail.value
    })
    console.log(e.detail.value);
  },

  // 快递公司选择框
  expressChange: function (e) {
    var that = this;
    that.setData({
      expressageCompany_index: e.detail.value,
      expressageCompany: that.data.express[e.detail.value]
    })
    console.log(e.detail.value);
  },

  // 多级选择器
  bindMultiPickerChange: function (e) {
    var that = this;
    that.setData({
      "multiIndex[0]": e.detail.value[0],
      "multiIndex[1]": e.detail.value[1],
    })
    that.setData({
      destination: that.data.multiArray[1][that.data.multiIndex[1]]
    })
  },

  // 多级选择器
  bindMultiPickerColumnChange: function (e) {
    console.log(e, "xiugai dizhi")
    var that = this;
    switch (e.detail.column) {
      case 0:
        if (that.destinationwarn()) {
          list = []
          for (var i = 1; i < that.data.objectMultiArray.length; i++) {
            if (that.data.objectMultiArray[i].parid == that.data.objectMultiArray[e.detail.value].regid) {
              list.push(that.data.objectMultiArray[i].regname)
            }
          }
          that.setData({
            "multiArray[1]": list,
            "multiIndex[0]": e.detail.value,
            "multiIndex[1]": 0,
          })
        }

    }
  },

  // 日期选择框
  dateChange: function (e) {
    var that = this;
    that.setData({
      expressageArriveTime_index: e.detail.value,
      expressageArriveTime: that.data.date[e.detail.value]
    })
  },

  // 加入购物车
  addclick: function (e) {
    var that = this;
    var datas = that.data;

    // 定义快递信息变量
    var school;
    var recipients;
    var customerTelephone;
    var expressageCompany;
    var expressageCode;
    var destination;
    var roomnum;
    var expressageArriveTime;
    var expressageDescription;
    var specification;
    // 定义下标
    var expressageCompany_index;
    //var expressageArriveTime_index;
    // var index;


    // 以上变量赋值
    // school = app.globalData.globalSchool;
    school = wx.getStorageSync('school');

    recipients = datas.recipients;
    customerTelephone = datas.customerTelephone;
    expressageCompany = datas.expressageCompany;
    expressageCode = datas.expressageCode;
    destination = datas.destination;
    roomnum = datas.roomnum;
    expressageArriveTime = datas.expressageArriveTime;
    expressageDescription = datas.expressageDescription;
    specification = datas.specification;
    // 下标
    expressageCompany_index = datas.expressageCompany_index;
    //expressageArriveTime_index = datas.expressageArriveTime_index;
    // index=datas.index;


    var flag = "1";
    if (recipients.length == 0) {
      flag = "0";
      that.setData({
        recipients_color: "border: 1px red solid"
      })
    } else {
      that.setData({
        recipients_color: ""
      })
    }
    if (customerTelephone.length == 0) {
      flag = "0";
      that.setData({
        customerTelephone_color: "border: 1px red solid"
      })
    } else {
      that.setData({
        customerTelephone_color: ""
      })
    }
    if (expressageCode.length == 0) {
      flag = "0";
      that.setData({
        expressageCode_color: "border: 1px red solid"
      })
    } else {
      that.setData({
        expressageCode_color: ""
      })
    }

    if (expressageCompany_index == 0) {
      flag = "0";
      that.setData({
        expressageCompany_color: "border: 1px red solid"
      })
    } else {
      that.setData({
        expressageCompany_color: ""
      })
    }
    // if (roomnum.length == 0) {
    //   flag = "0";
    //   that.setData({
    //     roomnum_color: "border: 1px red solid"
    //   })
    // } else {
    //   that.setData({
    //     roomnum_color: ""
    //   })
    // }

    // if (expressageArriveTime_index == 0) {
    //   flag = "0";
    //   that.setData({
    //     expressageArriveTime_color: "border: 1px red solid"
    //   })
    // } else {
    //   that.setData({
    //     expressageArriveTime_color: ""
    //   })
    // }

    if (flag == "1") {  //  没有未填框
      //   that.setData({
      //     roomnum_enable: "disable",
      //     distination_enable: "disable"
      //   })
      // 判断是否是重复订单

      // if (expressageArriveTime == "今天") {
      //   expressageArriveTime = app.getDateStr(0);
      // } else if (expressageArriveTime == "昨天") {
      //   expressageArriveTime = app.getDateStr(-1);
      // } else {
      //   expressageArriveTime = app.getDateStr(-2);
      // }

      // 遍历数据
      var temp_school;
      var temp_recipients;
      var temp_customerTelephone;
      var temp_expressageCompany;
      var temp_expressageCode;
      var temp_destination;
      //var temp_roomnum;
      //var temp_expressageArriveTime;

      var temp_order;

      var hasSameOrder = false;
      for (var i = 0; i < that.data.orders.length; i++) {
        temp_order = that.data.orders[i];
        temp_school = temp_order.school;
        temp_recipients = temp_order.recipients;
        temp_customerTelephone = temp_order.customerTelephone;
        temp_expressageCompany = temp_order.expressageCompany;
        temp_expressageCode = temp_order.expressageCode;
        temp_destination = temp_order.destination;
        //temp_roomnum = temp_order.roomnum; && roomnum == temp_roomnum
        //temp_expressageArriveTime = temp_order.expressageArriveTime;
        if ( school == temp_school && recipients == temp_recipients && customerTelephone == temp_customerTelephone && expressageCompany == temp_expressageCompany && expressageCode == temp_expressageCode && destination == temp_destination ) {
          hasSameOrder = true;
          wx.showToast({
            title: '已存在此订单',
          })
          break;
        }
      }
      console.log("orders的长度：" + that.data.orders.length);
      console.log("hasSameOrder的值：" + hasSameOrder);
      // 不存在重复订单，则添加进数组
      if (hasSameOrder == false) {
        this.bulidShopCarInfo();
      }
    } else {
      wx.showToast({
        icon: "none",
        title: '请完善数据',
        duration: 800
      })
    }

  },

  // 组件购物车
  bulidShopCarInfo: function () {
    var that = this;
    var datas = that.data;
    console.log(that.data.random_number)
    console.log(that.data.time_stamp)
    // 订单所需字段
    var Id = "" + that.data.random_number + that.data.time_stamp;
    var customerName = "";
    var school = app.globalData.globalSchool;
    var customerTelephone = datas.customerTelephone;
    var expressageCompany = datas.expressageCompany;
    var customerPlace = datas.destination;//+ "#" + datas.roomnum
    // var expressageArriveTime = datas.expressageArriveTime;
    // if (expressageArriveTime == "今天") {
    //   expressageArriveTime = app.getDateStr(0);
    // } else if (expressageArriveTime == "昨天") {
    //   expressageArriveTime = app.getDateStr(-1);
    // } else {
    //   expressageArriveTime = app.getDateStr(-2);
    // }
    var expressageDescription = datas.expressageDescription;
    var expressageCode = datas.expressageCode;
    var expressageStatus = 2;
    var recipients = datas.recipients;
    var orderTime = "";
    var specification = 0;
    // if (datas.specification == "小于40cm*40cm") {
    //   specification = 0;
    // } else {
    //   specification = 1;
    // }
    var timestamp = "";
    var pay = 0;
    var price = 1;
    // if (datas.specification == "小于40cm*40cm") {
    //   price = 1;//小件快递价格
    // } else {
    //   price = 2;//大件快递价格
    // }
    var totalprice = 0;
    var expectTime = "";  //  在修改页面赋值
    console.log("加入购物车按钮获取openid：");
    var userid = app.getOpenid(app.globalData.url);
    var payid = "";  //  在修改页面赋值
    var nickname = "";

    // 网页自定义字段
    var roomnum = datas.roomnum;
    var destination = datas.destination;
    var expressageCompany_index = datas.expressageCompany_index;
    var expressageArriveTime_index = datas.expressageArriveTime_index;
    // var index=datas.index;


    var obj = {};
    obj.Id = Id;
    obj.school = school;
    obj.customerName = customerName;
    obj.customerTelephone = customerTelephone;
    obj.expressageCompany = expressageCompany;
    obj.customerPlace = customerPlace;
    //obj.expressageArriveTime = expressageArriveTime;
    obj.expressageDescription = expressageDescription;
    obj.expressageCode = expressageCode;
    obj.expressageStatus = expressageStatus;
    obj.recipients = recipients;
    obj.orderTime = orderTime;
    obj.specification = specification;
    obj.timestamp = timestamp;
    obj.pay = pay;
    obj.price = price * 100;
    obj.totalprice = totalprice;
    obj.expectTime = expectTime;
    obj.userid = userid;
    obj.payid = payid;
    obj.nickname = nickname;


    // 网页自定义字段
    //obj.roomnum = roomnum;
    obj.destination = destination;
    obj.expressageCompany_index = expressageCompany_index;
    //obj.expressageArriveTime_index = expressageArriveTime_index;
    // obj.index=index;

    var orders = that.data.orders;
    orders.push(obj);

    app.globalData.globalOrders = orders;

    that.setData({
      orders: orders
    })
    wx.setStorageSync("orders", that.data.orders);

    if (specification == 0) {
      app.globalData.smallnum += 1;
    } else {
      app.globalData.bignum += 1;
    }
    that.setData({
      buynum: app.globalData.bignum + app.globalData.smallnum
    })
    console.log("bignum:" + app.globalData.bignum);
    console.log("smallnum:" + app.globalData.smallnum);
    // var order=wx.getStorageSync("orders");
    var order = app.globalData.globalOrders;
    console.log(order);
    // that.setData({
    //   index:index+1
    // })
  },

  // 用户尝试修改地址时候的提示信息
  destinationwarn: function () {
    if (this.data.orders.length >= 1) {
      wx.showToast({
        icon: "none",
        title: '只有同一个片区的订单才可以加入同一个购物车享受优惠哦',
        duration: 1600
      })
      return false;
    }
    return true;
  },

  // 结算购物车
  buyclick: function () {
    var that = this;
    if (that.data.orders.length == 0) {
      wx.showToast({
        icon: "none",
        title: '购物车为空，请先添加订单',
        duration: 800
      })
    } else {
      that.clearRedbord();
      wx.navigateTo({
        url: '/pages/exclusive/confirm/confirm',
      })
    }
  },

  // 取消订单
  cancleclick: function (e) {
    var that = this;
    wx.showModal({
      title: '请确认',
      content: '是否取消该订单',
      success: function (res) {
        if (res.confirm) {
          console.log("取消的订单编号：");
          console.log(e.currentTarget.dataset.id);
          var cancle_id = e.currentTarget.dataset.id;
          var price;
          var total_price;
          for (var i = 0; i < that.data.cards.length; i++) {
            if (cancle_id == that.data.cards[i].id) {
              price = that.data.cards[i].price;
              total_price = that.data.cards[i].totalprice;
              break;
            }
          }
          var main_id = cancle_id.substring(0, 12) + "0";
          //价格信息
          wx.request({
            url: getApp().globalData.url + "/wx/wxrefund",
            data: {
              merchantId: main_id,
              refundId: cancle_id,
              total_price: total_price,
              userid: that.data.openid,
              price: price
            },
            header: { 'content-type': 'application/json' },
            success: function (res) {
              console.log("======");
              console.log(total_price);
              console.log(price);
              wx.showToast({
                title: res.data,
                icon: "none"
              })
              if (res.data == "取消订单成功") {
                that.onLoad();
                // wx.reLaunch({
                //   url: '/pages/index/index',
                //   success: function (res) {
                //     // console.log("成功");
                //   }, fail: function (res) {
                //     // console.log("失败");
                //   }
                // })

              }
            }
          })
        }
      }
    })
  },

  // 加载更多
  showmore: function () {
    var that = this;
    var indextemp = that.data.indextemp;
    var length = that.data.cards_main_groupId.length;
    var i, j;
    var s;
    if (indextemp < length) {
      wx.showLoading({
        title: '正在加载中',
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 400)
    }
    for (j = 0; indextemp < length && j < 3; j++ , indextemp++) {
      s = "card" + (indextemp + 1);
      this.setData({
        [s]: false,
        indextemp: indextemp + 1
      })
      console.log("目前的indextemp：" + that.data.indextemp)
    }
    if (indextemp == length || indextemp >= 8) {
      that.setData({
        morehidden: true,
        completehidden: false
      })
    }
  },


  //获取图片高度
  getImgHeight(e) {
    //当图片载入完毕时
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      //宽高比  
      ratio = imgwidth / imgheight;
    // console.log(imgwidth, imgheight)
    // 计算的高度值
    var viewHeight = 750 / ratio;
    var imgheight = viewHeight;
    var imgheights = this.data.imgheights;
    //把每一张图片的对应的高度记录到数组里  
    imgheights[e.target.dataset.index] = imgheight;
    //console.log('图片的高度：' + imgheights)
    this.setData({
      imgheights: imgheights
    })
  },


  setHeight(e) {
    this.setData({ current: e.detail.current })
  },

  clearRedbord(){
    this.setData({
      recipients_color: "",
      customerTelephone_color: "",
      expressageCode_color: "",
      expressageCompany_color: "",
      expressageArriveTime_color: ""
    })
  }
})
