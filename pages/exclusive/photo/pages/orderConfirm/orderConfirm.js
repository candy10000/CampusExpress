// pages/orderConfirm/orderConfirm.js
//  成功传输订单的个数  
const app = getApp()
var successnum = 0;
var res1, res2;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    width: "",
    photoOrder:'',//订单信息
    orderList: [],
    photoCameramanName: "", //摄影师的名字
    openid: "" ,//获取用户的wxopenid

    //布尔类型
    showhidden:false,
    updatehidden:true,
    btn_modify: false,  // “修改”按钮，默认为false即显示
    btn_confirm: true,  // “确认修改”按钮，默认为true即隐藏
    btn_pay: false,  // “支付”按钮，默认为false即显示
    canpay: true,  // “支付”按钮是否生效
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var photoOrder = JSON.parse(options.photoOrder);
    var order = photoOrder.order;
    console.log("order的类型"+ typeof order)
    var photoCameramanName = photoOrder.photoCameramanName;
    var openid;
    
    //获取用户的openid
    while (openid == "" || openid == null) {
      openid = app.getOpenid(app.globalData.url);
    }

     
     //将订单信息放入数组
      var list = [];
      list.push(order);
      that.setData({
        photoOrder: order,
        photoCameramanName: photoCameramanName,
        openid:openid,
        orderList: list
      });

      // 获取系统宽度
      wx.getSystemInfo({
        success: function(res) {
          that.setData({
            width: res.windowWidth
          })
        },
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
    })
  },

  /* 修改订单数据 */
  // 实时修改名字
  update_photoUsername:function(e){
    var that =this;
    var s = "photoOrder.photoUsername"
    that.setData({
      [s]: e.detail.value
    });
    console.log(that.data.photoOrder)
  },
   
  // 实时修改电话号码
  update_photoTelephone: function(e){
    var that = this;
    var s = "photoOrder.photoTelephone"
    that.setData({
      [s]: e.detail.value
    });
    console.log(that.data.photoOrder)
  },
  // 实时修改联系
  update_photoContact: function(e){
    var that = this;
    var s = "photoOrder.photoContact"
    that.setData({
      [s]: e.detail.value
    });
    console.log(that.data.photoOrder)
  },

 
  // 支付
  orderPay: function(){
    var that = this;
    var canpay = that.data.canpay;

    if(canpay){
      // 禁用支付按钮
      that.setData({
        canpay: false
      });

      var timestamp = parseInt(new Date().getTime() / 1000);
      var successOrderNum = 0;
      wx.request({
        url: getApp().globalData.url + "/wx/wxPay/photo",
        data: {
          appid: app.globalData.appid,
          mch_id: "1529434831",
          body: "Express",
          out_trade_no: that.data.photoOrder.Id,
          total_fee: 1,
          spbill_create_ip: "",
          notify_url: "",
          trade_type: "JSAPI",
          openid: that.data.openid,
          sign: ""
        }, success: function (res) {
          console.log("======"+res.data);

          that.setData({
            res1: res.data
          })
          console.log("===== 预添加订单信息进数据库 ===== ");

          // 由于小程序对数组的引用是指针类型的，因此将其转化一下，在赋值给datas

          wx.request({
            url: getApp().globalData.url + '/photoOrder/ordersAddMany',
            data: {
              orderList: that.data.orderList
            },
            header: {
              'content-type': 'application/json'
            },
            method: "POST",
            success: function (resa) {
              if (resa.data == "SUCCESS") {
                successOrderNum = successOrderNum + 1;
                console.log("成功传输订单的个数：" + successOrderNum);

                // setTimeout(function () {
                console.log("succenum值：" + successnum)
                // if (successOrderNum == 1) {
                wx.showToast({
                  icon: "none",
                  title: '订单生成完毕,请支付',
                  duration: 1500
                })
                // 订单传输成功后，调起支付
                console.log("正在向后台请求支付信息")
                wx.request({
                  url: getApp().globalData.url + "/wx/PaySign",
                  data: {
                    appid: app.globalData.appid,
                    timeStamp: timestamp,
                    nonceStr: "",
                    package: "prepay_id=" + res.data.pre,
                    signType: "MD5",
                  },
                  success: function (res) {
                    console.log("正在调起支付窗口");
                    console.log(res.data);
                    wx.requestPayment({
                      timeStamp: res.data.timeStamp,
                      nonceStr: res.data.nonceStr,
                      package: res.data.package,
                      signType: 'MD5',
                      paySign: res.data.paySign,
                      success: function () {
                        // 支付成功后，返回主页
                        console.log("支付成功，准备返回主页");

                        wx.setStorageSync("orders", []);
                        app.globalData.orders = [];
                        app.globalData.bignum = 0;
                        app.globalData.smallnum = 0;

                        setTimeout(function () {
                          wx.reLaunch({
                            url: '../photogarph_index/photogarph_index',
                            success: function (res) {
                              // console.log("成功");
                            }, fail: function (res) {
                              // console.log("失败");
                            }
                          })
                          // wx.navigateBack({
                          //   delta:1
                          // })

                        }, 1000)

                      },
                      fail: function (err) {
                        // that.setData({
                        //   canpay: true
                        // })
                        console.log("支付失败！！！");
                        console.log(err);
                        // 支付失败，提示用户重新支付
                        wx.showModal({
                          title: '提示',
                          content: '支付失败，请重新支付',
                          showCancel: false,
                        })

                        // // 重新生成订子订单id
                        // var random_number = Math.floor(Math.random() * 90000 + 10000);
                        // var time_stamp = "" + parseInt(new Date().getTime());
                        // time_stamp = time_stamp.substring(6, 13);
                        // var update_id = random_number + time_stamp;
                        // var update_orders = that.data.orders;
                        // for (var m = 0; m < that.data.orders.length; m++) {
                        //   update_orders[m].Id = update_id;
                        // }
                        // that.setData({
                        //   orders: update_orders
                        // })
                        // that.updateDatasToPrepage();
                        // // 同时更新random_number和time_stamp到上一个页面
                        // // 页面
                        // var pages = getCurrentPages();
                        // var prevPage = pages[pages.length - 2];
                        // prevPage.setData({
                        //   random_number: random_number,
                        //   time_stamp: time_stamp
                        // })
                      }
                    })
                  },
                  // 调起支付窗口失败，正在重新调起
                  fail: function (err) {

                  }
                })
                // } else {
                that.setData({
                  canpay: true
                })
                // wx.showToast({
                //   icon: "none",
                //   title: '当前网络信号弱，,请重新点击支付按钮',
                //   duration: 1500
                // })
                // }
                // }, 500)

              }
            },
          })
          // }
        }
      });
      
    }



  }
})