// pages/confirm/confirm.js
const app = getApp()
var util = require('../../../../utils/util.js');
var openid;
var res1, res2;
var list = [];

//  成功传输订单的个数  
var successnum = 0;
Page({
  data: {
    // 数组
    orders: [],
    oldPrices:[],
    express: ["顺丰", "韵达", "圆通", "中通", "申通", "百世", "邮政", "天天"],
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

        { "regid": "18", "parid": "4", "regname": "北1", "regtype": "2", "ageid": "0" },
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
    date: ["选择收到快递短信的日期", "今天", "昨天", "前天"],
    MailSpecification: [
      { name: "std1", value: '小于40cm*40cm', checked: true },
      { name: "std2", value: '大于40cm*40cm', checked: false }
    ],


    // 数值变量
    bignum: "",
    smallnum: "",
    totalprice: "",
    pricefree: "",
    openid: "",

    // 下标
    currentid: 0,

    // 布尔变量
    showhidden: false,
    updatehidden: true,
    delhidden: false,  // “删除”按钮，默认为false即显示
    btn_modify: false,  // “修改”按钮，默认为false即显示
    btn_confirm: true,  // “确认修改”按钮，默认为true即隐藏
    btn_pay: false,  // “支付”按钮，默认为false即显示
    canpay: true,  // “支付”按钮是否生效

  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    var that = this;
    var openid;
    console.log(app.globalData.globalMallOrders)


    var oldPrices = that.data.oldPrices;
    for (var i in app.globalData.globalMallOrders){
      oldPrices[i] = app.globalData.globalMallOrders[i].price;
      console.log(i)
    }

    while (openid == "" || openid == null) {
      openid = app.getOpenid(app.globalData.url);
    }
    var openid = app.getOpenid(app.globalData.url);

    

    // 初始化数据
    that.setData({
      // 价格
      buynum : app.globalData.goodsNum,
      totalnum: that.getTotalNum(app.globalData.globalMallOrders),
      totalprice: that.getTotalPrice(app.globalData.globalMallOrders, 1)[0],
      pricefree: that.getTotalPrice(app.globalData.globalMallOrders, 1)[1],
      oldPrices: oldPrices,
      // 卡片
      // orders:wx.getStorageSync("orders"),
      orders: app.globalData.globalMallOrders,

      openid: openid
    })

    //订单价格

    for (var i in app.globalData.globalMallOrders) {
      app.globalData.globalMallOrders[i].totalprice = that.getTotalPrice(app.globalData.globalMallOrders, 1)[0];
    }

    
    

  },
  onUnload: function () {
    
    for (var i in app.globalData.globalMallOrders) {
      app.globalData.globalMallOrders[i].price = this.data.oldPrices[i];
      console.log(i)
    }
  },

  onHide:function(){
    for (var i in app.globalData.globalMallOrders) {
      app.globalData.globalMallOrders[i].price = this.data.oldPrices[i];
      console.log(i)
    }
  },

  // 计算总金额
  getTotalPrice: function (orderList, discount) {
    // 满两单，每单减2元
    // 满三单及以上，每单减3元
    var sum = 0 
    var youhui = 0
    var oldPrices = this.data.oldPrices;

    for (var i in orderList){
      
      if (this.getTotalNum(orderList) == 2) {
         
        sum = sum + (oldPrices[i]* orderList[i].num - 2 * orderList[i].num) 
        orderList[i].price = (oldPrices[i] * orderList[i].num - 2 * orderList[i].num)
        youhui += 2 * orderList[i].num;
      } else if (this.getTotalNum(orderList) > 2) {
        sum = sum + (oldPrices[i] * orderList[i].num - 3 * orderList[i].num)
        orderList[i].price = (oldPrices[i] * orderList[i].num - 3 * orderList[i].num)
        youhui += 3 * orderList[i].num;
      } else {
        sum = sum + (oldPrices[i] * orderList[i].num)
        orderList[i].price = oldPrices[i] * orderList[i].num
      }
    } 

    return [sum * discount, youhui]
  },
  getTotalNum:function(orderList){
    var num = 0
    for (var i in orderList) {
      num = num + orderList[i].num
    }
    return num
  },
  // 更新数据到上一个页面
  updateDatasToPrepage: function () {
    var that = this;
    var orders = that.data.orders;
    for (var index in orders){
      orders[index].totalprice = that.getTotalPrice(orders, 1)[0];
    }
    // 页面
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.setData({
      orders: orders,
      buynum: app.globalData.goodsNum
    })
    app.globalData.globalMallOrders = that.data.orders;
    wx.setStorageSync("orders", that.data.orders);
  },

  // 多级选择器
  bindMultiPickerChange: function (e) {
    var that = this;
    that.setData({
      "multiIndex[0]": e.detail.value[0],
      "multiIndex[1]": e.detail.value[1],
    })
    for (var i = 0; i < that.data.orders.length; i++) {
      var s1 = "orders[" + i + "].destination";
      var s2 = "orders[" + i + "].customerPlace";
      var roomnum = that.data.orders[that.data.currentid].roomnum;
      that.setData({
        [s1]: that.data.multiArray[1][that.data.multiIndex[1]],
        [s2]: that.data.multiArray[1][that.data.multiIndex[1]] + "#" + roomnum
      })
    }

    that.updateDatasToPrepage(); // 同步数据
  },
  // 多级选择器
  bindMultiPickerColumnChange: function (e) {
    var that = this;
    switch (e.detail.column) {
      case 0:
        list = []
        for (var i = 0; i < that.data.objectMultiArray.length; i++) {
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
  },

  // 实时修改收件人姓名
  update_recipients: function (e) {
    var that = this;
    var s = "orders[" + that.data.currentid + "].recipients";
    that.setData({
      [s]: e.detail.value
    })
    console.log(that.data.orders)
    that.updateDatasToPrepage(); // 同步数据
    console.log(that.data.orders[that.data.currentid].recipients)
  },
  // 实时修改号码
  update_customerTelephone: function (e) {
    var that = this;
    var s = "orders[" + that.data.currentid + "].customerTelephone";
    that.setData({
      [s]: e.detail.value
    })
    that.updateDatasToPrepage(); // 同步数据
    console.log(that.data.orders[that.data.currentid].customerTelephone)
  },
  // 实时修改取件码
  update_expressageCode: function (e) {
    var that = this;
    var s = "orders[" + that.data.currentid + "].expressageCode";
    that.setData({
      [s]: e.detail.value
    })
    that.updateDatasToPrepage(); // 同步数据
    console.log(that.data.orders[that.data.currentid].expressageCode)
  },
  // 实时修改宿舍号
  update_roomnum: function (e) {
    var that = this;

    for (var i = 0; i < that.data.orders.length; i++) {
      var s1 = "orders[" + i + "].roomnum";
      var s2 = "orders[" + i + "].customerPlace";
      var destination = that.data.orders[that.data.currentid].destination;
      that.setData({
        [s1]: e.detail.value,
        [s2]: destination + "#" + e.detail.value
      })
    }
    that.updateDatasToPrepage(); // 同步数据
    console.log(that.data.orders[that.data.currentid].roomnum)
  },

  // 快递公司下拉框
  expressageCompanyChange: function (e) {
    var that = this;
    var s1 = "orders[" + that.data.currentid + "].expressageCompany_index";
    var s2 = "orders[" + that.data.currentid + "].expressageCompany";
    that.setData({
      [s1]: e.detail.value,
      [s2]: that.data.express[e.detail.value]
    })
    that.updateDatasToPrepage(); // 同步数据
    console.log(that.data.orders[that.data.currentid].expressageCompany_index);
    console.log(that.data.orders[that.data.currentid].expressageCompany);
  },
  // 快递规格大小
  update_specification: function (e) {
    var that = this;
    var s1 = "orders[" + that.data.currentid + "].specification";
    var s2 = "orders[" + that.data.currentid + "].price";
    that.setData({
      [s1]: e.detail.value == "小于40cm*40cm" ? 0 : 1,
      [s2]: e.detail.value == "小于40cm*40cm" ? 2 : 4,
      bignum: e.detail.value == "小于40cm*40cm" ? that.data.bignum - 1 : that.data.bignum + 1,
      smallnum: e.detail.value == "小于40cm*40cm" ? that.data.smallnum + 1 : that.data.smallnum - 1,

    })
    app.globalData.smallnum = that.data.smallnum;
    app.globalData.bignum = that.data.bignum;
    that.setData({
      totalprice: that.getTotalPrice(app.globalData.smallnum, app.globalData.bignum)[0]
    })
    that.updateDatasToPrepage(); // 同步数据
  },
  // 到件日期
  update_expressageArriveTime: function (e) {
    var that = this;
    var s1 = "orders[" + that.data.currentid + "].expressageArriveTime";
    var s2 = "orders[" + that.data.currentid + "].expressageArriveTime_index";
    that.setData({
      [s1]: that.data.date[e.detail.value],
      [s2]: e.detail.value
    })
    that.updateDatasToPrepage(); // 同步数据
  },



  // 原始显示页面“滑动intem-swiper”事件
  onSlideChange: function (e) {
    var that = this;
    that.setData({
      currentid: e.detail.current  //  更新currentid为当前子订单的id
    })
  },

  // 点击“修改”按钮，从“信息显示”到“信息修改”
  tomodify: function () {
    var that = this;
    that.setData({
      btn_modify: true,
      btn_confirm: false,
      btn_pay: true,
      showhidden: true,
      updatehidden: false,
      delhidden: true,
    })
  },

  // 点击“确认修改”按钮，从“信息修改”到“信息显示”
  toconfirm: function () {
    this.setData({
      btn_modify: false,
      btn_confirm: true,
      btn_pay: false,
      showhidden: false,
      updatehidden: true,
      delhidden: false,
    })
  },

  // 删除订单
  deleteclick: function () {
    var that = this;
    wx.showModal({

      title: '提示',

      content: '确定要删除此订单',

      success: function (res) {

        if (res.confirm) {//这里是点击了确定以后
          console.log("删除的订单的下标：" + that.data.currentid);
          var currentid = that.data.currentid;
          var orders = that.data.orders;
          var buynum_temp = app.globalData.goodsNum;
          var num = orders[currentid].num
          orders.splice(that.data.currentid, 1);
          app.globalData.goodsNum = buynum_temp-1;
          app.globalData.globalMallOrders = orders;
          that.setData({
            buynum: buynum_temp-1,
            totalnum:that.data.totalnum-num,
            totalprice: that.getTotalPrice(app.globalData.globalMallOrders, 1)[0]
          })
          
        
        
          
          if (currentid == orders.length) {
            currentid = 0;
          }
          that.setData({
            orders: orders,
            currentid: currentid,
            pricefree: that.getTotalPrice(app.globalData.globalMallOrders, 1)[1]
          })
          if (that.data.orders.length == 0) {
            that.setData({
              delhidden: true
            })
          }
          that.updateDatasToPrepage(); // 同步数据
        } else {//这里是点击了取消以后

          console.log('用户点击取消')

        }

      }

    })
  },

  //  支付按钮
  orderPay: function () {
    this.updateDatasToPrepage();
    console.log(app.globalData.globalMallOrders);
    var that = this;
    var canpay = that.data.canpay;
    // if (canpay) {
    //   // 禁用支付按钮
    //   that.setData({
    //     canpay: false
    //   })
    // }
  //     // 从缓存更新订单数据，防止二次点击支付按钮后，id的变化
      // var neworders = wx.getStorageSync("orders");
      // var neworders = app.globalData.globalOrders
      // that.setData({
      //   orders: neworders
      // })
      // var successOrderNum = 0;  //  成功传输订单的个数
      // var hour = util.formatHour(new Date());
      // var minute = util.formatMinute(new Date());
      // var second = util.formatSecond(new Date());
      // var expectTime;
      // if (hour < 16 || (hour == 16 && minute < 30) || (hour == 16 && minute == 30 && second == 0)) {
      //   expectTime = app.getDateStr(0);
      // } else {
      //   expectTime = app.getDateStr(1);
      // }
      // console.log("预计送达时间:" + expectTime);
      // var timestamp = parseInt(new Date().getTime() / 1000);
      // console.log(timestamp)
      // var totalprice = that.data.totalprice * 100;
      // console.log("totalprice值" + totalprice)
      // var pricefree = 1;
      // if (that.data.pricefree != "不打") {
      //   pricefree = that.data.pricefree * 0.1
      // }


  //     // 更新订单的id，，，加上下标
      // var storageOrders=wx.getStorageSync("orders");
      // var storageOrders = app.globalData.globalMallOrders;

    var random_number = Math.floor(Math.random() * 90000 + 10000);
    var time_stamp = "" + parseInt(new Date().getTime());
    time_stamp = time_stamp.substring(6, 13);
    var update_id = random_number + time_stamp;

    for (var i = 0; i < app.globalData.globalMallOrders.length; i++) {
      app.globalData.globalMallOrders[i].Id = update_id + i;
      }
      console.log("加了下标的订单：")
    console.log(app.globalData.globalMallOrders)


  //     // --------------------  支付的主要过程  --------------------------------
  //     var res1;
  //     var res2;
  //     var loops = 0;  //  重复请求pre的次数

  //     // 吊起预支付接口，
  //     console.log("正在调起预支付接口")
 
    var that = this;
    let datas = [];

    wx.request({
      url: app.globalData.url + "/storeOrder/wx/storeOrdersAdd",
      method:'POST',
      data:{
        storeOrderList: app.globalData.globalMallOrders
      },success:function(res){

        console.log("======订单======");
        console.log(app.globalData.globalMallOrders);
        console.log(res.data);
        
        wx.request({
          url: getApp().globalData.url + "/wx/wxPay/shop",
          data: {
            appid: app.globalData.appid,
            mch_id: "1529434831",
            body: "Express",
            out_trade_no: app.globalData.globalMallOrders[0].Id,
            total_fee: parseInt(that.getTotalPrice(app.globalData.globalMallOrders, 1)[0]*100),
            spbill_create_ip: "",
            notify_url: "",
            trade_type: "JSAPI",
            openid: that.data.openid,
            sign: ""
          }, success: function (res) {
            console.log("===微信价格===");
            console.log(that.getTotalPrice(app.globalData.globalMallOrders, 1)[0]);
            console.log(res.data);
            var timestamp = parseInt(new Date().getTime() / 1000);
            wx.request({
              url: getApp().globalData.url + "/storeOrder/wx/PaySign",
              data: {
                appid: app.globalData.appid,
                timeStamp: timestamp,
                nonceStr: "",
                package: "prepay_id=" + res.data.pre,
                signType: "MD5",
              }, success: function (res) {
                console.log(res.data);
                wx.requestPayment({
                  timeStamp: res.data.timeStamp,
                  nonceStr: res.data.nonceStr,
                  package: res.data.package,
                  signType: 'MD5',
                  paySign: res.data.paySign,
                  success: function (res) {
                    console.log(res.data);
                    wx.reLaunch({
                      url: '/pages/exclusive/exIndex/exIndex',
                      success: function (res) {
                        // console.log("成功");
                      }, fail: function (res) {
                        // console.log("失败");
                      }
                    })
                                 
                  }
                })
              }
            })
          }
        })

      }
    })

      // wx.request({
      //   url: getApp().globalData.url + "/wx/wxPay",
      //   data: {
      //     appid: app.globalData.appid,
      //     mch_id: "1517608931",
      //     body: "Express",
      //     out_trade_no: app.globalData.globalMallOrders[0].Id,
      //     total_fee: app.globalData.globalMallOrders[0].price,
      //     spbill_create_ip: "",
      //     notify_url: "",
      //     trade_type: "JSAPI",
      //     openid: that.data.openid,
      //     sign: ""
      //   }, success: function (res) {
      //     while (res.data.pre == "" && loops < 3) {  //  pre_payid为空时重新获取
      //       wx.request({
      //         url: getApp().globalData.url + "/wx/wxPay",
      //         data: {
      //           appid: app.globalData.appid,
      //           mch_id: "1517608931",
      //           body: "Express",
      //           out_trade_no: that.data.orders[0].Id,
      //           total_fee: totalprice,
      //           spbill_create_ip: "",
      //           notify_url: "",
      //           trade_type: "JSAPI",
      //           openid: that.data.openid,
      //           sign: ""
      //         }, success: function (res1) {
      //           res = res1;
      //         }

      //       })
      //       loops++;
      //     }
      //     console.log(res)

      //     if (res.data.pre == "") {
      //       wx.showModal({
      //         title: '提示',
      //         content: '当前网络信号弱，请重新尝试支付',
      //         showCancel: false
      //       })
      //       that.setData({
      //         canpay: true
      //       })
      //     } else {
      //       that.setData({
      //         res1: res.data
      //       })
      //       console.log("===== 预添加订单信息进数据库 ===== ");

      //       // 由于小程序对数组的引用是指针类型的，因此将其转化一下，在赋值给datas
      //       let datas = [];
      //       datas = JSON.parse(JSON.stringify(that.data.orders))


      //       // 最后更新orders数据
      //       console.log("前datas：")
      //       console.log(+ datas)
      //       console.log("pricefree的值：" + pricefree)
      //       for (var i = 0; i < that.data.orders.length; i++) {
      //         datas[i].price = datas[i].price * pricefree;
      //         datas[i].timestamp = timestamp;
      //         datas[i].totalprice = totalprice / 100;
      //         //一定要写成元为单位
      //         datas[i].expectTime = expectTime;
      //         datas[i].userid = that.data.openid;
      //         datas[i].payid = that.data.res1.pre;
      //       }
      //       console.log("前datas：")
      //       console.log(+ datas)

      //       wx.request({
      //         url: getApp().globalData.url + '/wx/wxadd',
      //         data: {
      //           orderList: datas
      //         },
      //         header: {
      //           'content-type': 'application/json'
      //         },
      //         method: "POST",
      //         success: function (res) {
      //           if (res.data == "Success") {
      //             successOrderNum = successOrderNum + 1;
      //             console.log("成功传输订单的个数：" + successOrderNum);
      //           }
      //         },
      //       })
      //       setTimeout(function () {
      //         console.log("succenum值：" + successnum)
      //         if (successOrderNum == 1) {
      //           wx.showToast({
      //             icon: "none",
      //             title: '订单生成完毕,请支付',
      //             duration: 1500
      //           })
      //           // 订单传输成功后，调起支付
      //           console.log("正在向后台请求支付信息")
      //           wx.request({
      //             url: getApp().globalData.url + "/wx/PaySign",
      //             data: {
      //               appid: app.globalData.appid,
      //               timeStamp: timestamp,
      //               nonceStr: "",
      //               package: "prepay_id=" + that.data.res1.pre,
      //               signType: "MD5",
      //             },
      //             success: function (res) {
      //               console.log("正在调起支付窗口")
      //               wx.requestPayment({
      //                 timeStamp: res.data.timeStamp,
      //                 nonceStr: res.data.nonceStr,
      //                 package: res.data.package,
      //                 signType: 'MD5',
      //                 paySign: res.data.paySign,
      //                 success: function () {
      //                   // 支付成功后，返回主页
      //                   console.log("支付成功，准备返回主页");
      //                   setTimeout(function () {
      //                     wx.reLaunch({
      //                       url: '/pages/info/index',
      //                       success: function (res) {
      //                         console.log("返回主页成功");
      //                       }, fail: function (res) {
      //                         console.log("返回主页失败");
      //                       }
      //                     })
      //                   }, 1000)
      //                   wx.setStorageSync("orders", []);
      //                   app.globalData.orders = [];
      //                   app.globalData.bignum = 0;
      //                   app.globalData.smallnum = 0;
      //                 },
      //                 fail: function (err) {
      //                   that.setData({
      //                     canpay: true
      //                   })
      //                   console.log("支付失败！！！");
      //                   console.log(err);
      //                   // 支付失败，提示用户重新支付
      //                   wx.showModal({
      //                     title: '提示',
      //                     content: '支付失败，请重新支付',
      //                     showCancel: false,
      //                   })

      //                   // 重新生成订子订单id
      //                   var random_number = Math.floor(Math.random() * 90000 + 10000);
      //                   var time_stamp = "" + parseInt(new Date().getTime());
      //                   time_stamp = time_stamp.substring(6, 13);
      //                   var update_id = random_number + time_stamp;
      //                   var update_orders = that.data.orders;
      //                   for (var m = 0; m < that.data.orders.length; m++) {
      //                     update_orders[m].Id = update_id;
      //                   }
      //                   that.setData({
      //                     orders: update_orders
      //                   })
      //                   that.updateDatasToPrepage();
      //                   // 同时更新random_number和time_stamp到上一个页面
      //                   // 页面
      //                   var pages = getCurrentPages();
      //                   var prevPage = pages[pages.length - 2];
      //                   prevPage.setData({
      //                     random_number: random_number,
      //                     time_stamp: time_stamp
      //                   })
      //                 }
      //               })
      //             },
      //             // 调起支付窗口失败，正在重新调起
      //             fail: function (err) {
      //               console.log("调起支付窗口失败，正在重新调起")
      //               wx.request({
      //                 url: getApp().globalData.url + "/wx/PaySign",
      //                 data: {
      //                   appid: app.globalData.appid,
      //                   timeStamp: timestamp,
      //                   nonceStr: "",
      //                   package: "prepay_id=" + that.data.res1.pre,
      //                   signType: "MD5",
      //                 }
      //               })
      //             }
      //           })
      //         } else {
      //           that.setData({
      //             canpay: true
      //           })
      //           wx.showToast({
      //             icon: "none",
      //             title: '当前网络信号弱，,请重新点击支付按钮',
      //             duration: 1500
      //           })
      //         }
      //       }, 500)
      //     }



  //       }
  //     })
  //   }


  // },
  },
  subGoodsNum: function (e) {

    var that = this
    var currentid = that.data.currentid
    var orders = that.data.orders
    var num = orders[currentid].num
    if(num > 1){
      num = num - 1
      orders[currentid].num = num
      that.setData({
        orders: orders,
        totalnum: that.getTotalNum(orders),
        pricefree: that.getTotalPrice(orders, 1)[1],
        totalprice: that.getTotalPrice(orders, 1)[0],
      })
      that.updateDatasToPrepage();
    }
    
  },
  addGoodsNum: function (e) {
    
    var that = this
    var currentid = that.data.currentid
    var orders = that.data.orders
    var num = orders[currentid].num
    num = num + 1
    orders[currentid].num = num
    that.setData({
      orders:orders,
      totalnum: that.getTotalNum(orders),
      pricefree: that.getTotalPrice(orders, 1)[1],
      totalprice: that.getTotalPrice(orders, 1)[0],
    })
    that.updateDatasToPrepage();
  },
})