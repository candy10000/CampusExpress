import WxValidate from '../../utils/WxValidate.js'


const app = getApp()
//  成功传输订单的个数  
var successnum = 0;
var res1, res2;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: "", //获取用户的wxopenid
    canpay: true, // “支付”按钮是否生效
    orderList: [],

    //布尔类型
    showhidden: false,
    updatehidden: true,
    btn_modify: false, // “修改”按钮，默认为false即显示
    btn_confirm: true, // “确认修改”按钮，默认为true即隐藏
    btn_pay: false, // “支付”按钮，默认为false即显示
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //用于判断input中的数据是否变更
    var flag_n = false;
    var flag_p = false;
    //用于存放修改前的用户名和手机号码
    var name;
    var telephone;

    var that = this;
    var openid;
    let photoCamboOrder = JSON.parse(options.comboPhoto);
    console.log("**photoCamboOrder**", photoCamboOrder);

    var orderList = [];
    var random = "" + Math.floor(Math.random() * 90000 + 10000) + photoCamboOrder.time_stamp;
    photoCamboOrder.out_trade_no = random;
    photoCamboOrder.camboid = photoCamboOrder.id;
    photoCamboOrder.id = random;
    orderList.push(photoCamboOrder);
    // photoCamboOrder.photo_openid = "";

    console.log("**orderList**", orderList);

    //获取用户的openid
    while (openid == "" || openid == null) {
      openid = app.getOpenid(app.globalData.url);
      photoCamboOrder.photo_openid = openid;
    }
    //将订单信息放入数组
    that.setData({
      photoCamboOrder: photoCamboOrder,
      openid: openid,
      orderList: orderList,
      name: photoCamboOrder.username,
      telephone: photoCamboOrder.telephone,
    })
    // 执行表单验证方法
    this.initValidate();
  },

  // 验证表单字段
  initValidate: function() {
    const rules = {
      upUsername: {
        required: true,
        maxlength: 10
      },
      upTelephone: {
        required: true,
        tel: true
      }
    };
    const message = {
      upUsername: {
        required: '请填写名字',
        maxlength: '名字长度不超过10个字！'
      },
      upTelephone: {
        required: '请填写联系电话',
        tel: '请填写正确的联系电话'
      }
    };
    this.WxValidate = new WxValidate(rules, message);
  },

  // 点击“修改”按钮，从“信息显示”到“信息修改”
  tomodify: function() {
    console.log("==before--showhidden==", this.data.showhidden);
    console.log("==before--updatehidden==", this.data.updatehidden);
    var that = this;
    that.setData({
      btn_modify: true,
      btn_confirm: false,
      btn_pay: true,
      showhidden: true,
      updatehidden: false,
    })
    console.log("==showhidden==", that.data.showhidden);
    console.log("==updatehidden==", that.data.updatehidden);
  },

  // 点击“确认修改”按钮，通过表单验证后，从“信息修改”到“信息显示”
  toconfirm: function() {
    var msg = [];
    if (this.data.flag_n) {
      msg.upUsername = this.data.upUsername;
    } else {
      msg.upUsername = this.data.name;
    }
    if (this.data.flag_p) {
      msg.upTelephone = this.data.upTelephone;
    } else {
      msg.upTelephone = this.data.telephone;
    }
    console.log("===form===", msg);
    console.log(typeof msg);
    //验证表单
    if (!this.WxValidate.checkForm(msg)) {
      const error = this.WxValidate.errorList[0];
      this.showModal(error);
      return false;
    } else {
      var n = "photoCamboOrder.username";
      var p = "photoCamboOrder.telephone";
      this.setData({
        [n]: this.data.upUsername,
        [p]: this.data.upTelephone,
        btn_modify: false,
        btn_confirm: true,
        btn_pay: false,
        showhidden: false,
        updatehidden: true,
        flag_n: false,
        flag_p: false,
      })
    }
  },

  /* 表单校验报错 */
  showModal(error) {
    wx.showModal({
      content: error.msg
    })
  },

  /* 获取订单数据 */
  // 获取修改后的名字，只有数据修改时才执行此方法
  update_username: function(e) {
    var that = this;
    var upUsername = e.detail.value;
    console.log("===upUsername***", upUsername);
    that.setData({
      upUsername: upUsername,
      flag_n: true,
    })
  },

  // 获取修改后的电话号码，只有数据修改时才执行此方法
  update_telephone: function(e) {
    var that = this;
    var upTelephone = e.detail.value;
    console.log("===upTelephone***", upTelephone);
    that.setData({
      upTelephone: upTelephone,
      flag_p: true,
    })
  },

  // 支付
  orderPay: function() {
    var that = this;
    var canpay = that.data.canpay;

    if (canpay) {
      // 禁用支付按钮
      that.setData({
        canpay: false
      });

      var timestamp = parseInt(new Date().getTime() / 1000);
      var successOrderNum = 0;
      wx.request({
        url: getApp().globalData.url + "/wx/wxPay/photo/combo",
        data: {
          appid: app.globalData.appid,
          mch_id: "1529434831",
          body: "Express",
          out_trade_no: that.data.photoCamboOrder.out_trade_no,
          total_fee: 1,
          spbill_create_ip: "",
          notify_url: "",
          trade_type: "JSAPI",
          openid: that.data.openid,
          sign: ""
        },
        success: function(res) {
          console.log("======" + res.data);

          that.setData({
            res1: res.data
          })
          console.log("===== 预添加订单信息进数据库 ===== ");

          console.log("test----", res1);
          // 由于小程序对数组的引用是指针类型的，因此将其转化一下，再赋值给datas
          console.log("**list**", that.data.orderList);

          wx.request({
            url: getApp().globalData.url + '/photoCamboOrder/ordersAdd',
            data: {
              orderList: that.data.orderList
            },
            header: {
              'content-type': 'application/json'
            },
            method: "POST",
            success: function(resa) {
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
                  success: function(res) {
                    console.log("正在调起支付窗口");
                    console.log(res.data);
                    wx.requestPayment({
                      timeStamp: res.data.timeStamp,
                      nonceStr: res.data.nonceStr,
                      package: res.data.package,
                      signType: 'MD5',
                      paySign: res.data.paySign,
                      success: function() {
                        // 支付成功后，返回主页
                        console.log("支付成功，准备返回主页");

                        wx.setStorageSync("orders", []);
                        app.globalData.orders = [];
                        app.globalData.bignum = 0;
                        app.globalData.smallnum = 0;

                        setTimeout(function() {
                          wx.reLaunch({
                            url: '../photogarph_index/photogarph_index',
                            success: function(res) {
                              // console.log("成功");
                            },
                            fail: function(res) {
                              // console.log("失败");
                            }
                          })
                          // wx.navigateBack({
                          //   delta:1
                          // })

                        }, 1000)

                      },
                      fail: function(err) {
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
                  fail: function(err) {

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
  },
})