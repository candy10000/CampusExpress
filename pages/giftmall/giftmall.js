// pages/giftmall/giftmall.js
var app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    receiverId:String,
    sendgiftCardId: String,
    sendgiftTaskId: String,
    sendgiftType: String //任务礼物赠送1， 拾言礼物赠送2， 主页礼物赠送0
  },
  options: {
    addGlobalClass: true,
  },

  /**
   * 组件的初始数据
   */
  data: {
    tab_list: [{ id: 0, text: "特质" }, { id: 1, text: "珍藏" }, { id: 2, text:"才艺"}],

    gift_list_sliced: [],
    gift_selected: [],
    num:1,
    current:0,
    message:"",
    gift_desc: false,
    showGiftMall: false,

  },

  /**
   * 组件的方法列表
   */
  attached() {
    var that = this;


    //如果礼物送给自己  结束初始化方法  不显示页面
    if(app.getOpenid() == that.properties.receiverId){
      wx.showToast({
        title: '自己不能给自己送礼物哦',
        icon: 'none'
      })
      return;
    }

    that.setData({
      showGiftMall: true,
    })

    var caiyi = [];
    var tezhi = [];
    var zhencang = [];

    console.log(that.properties.receiverId,"被送给礼物人的iD")

    wx.request({
      url: app.globalData.url + "/gifts/list",
      success(res){
        for  (let item of res.data) {
          item.icon = that.getImgPic(item.icon)
          if (item.label == "才艺"){
            caiyi.push(item);
          } else if (item.label == "特质"){
            tezhi.push(item);
          } else if (item.label == "珍藏"){
            zhencang.push(item);
          }
        }
        that.data.gift_list_sliced.push(zhencang);
        that.data.gift_list_sliced.push(caiyi);
        that.data.gift_list_sliced.push(tezhi);


        that.setData({
          gift_list_sliced: that.data.gift_list_sliced,
          gift_selected: that.data.gift_list_sliced[0][0],
        })
        console.log(that.data.gift_list_sliced,"liwuId");

      }
    })
  },

  methods: {
    changeTab:function(e){

      //礼物栏的下标
      var current = this.data.current;



      var index=e.currentTarget.dataset.index
      var list = this.data.tab_list
      var t;
      switch(index){
        case '0':{
          console.log("==切换0==");
          t=list[0]
          list[0] = list[2]
          list[2] = list[1]
          list[1] = t

          if(current == 0){
            current = 2;
          }else{
            current --;
          }

          this.setData({
            tab_list:list,
            current: current
          })
        };break;
        case '2':{
          console.log("==切换2==");
          t = list[2];
          list[2] = list[0]
          list[0] = list[1]
          list[1] = t

          if (current == 2) {
            current = 0;
          } else {
            current++;
          }
          this.setData({
            tab_list: list,
            current: current
          })
        };break;
      }
      console.log(t);
      switch(t.text){
        case '才艺':{
          wx.request({
            url: app.globalData.url + "/gifts/selectGiftsByLabel",
            data: {
              label: "才艺"
            }, success: function (res) {
              var gift_list_sliced = [];
              console.log(res.data);
              var cnt = 1;
              var temp = [];
              for (var i = 0; i < res.data.length; i++) {
                if (cnt % 10 != 0) {
                  var realicon = res.data[i].icon;
                  console.log(realicon);
                  realicon = realicon.replace("/var/www/html/", "https://xcx.gaoxiao114.cn/");
                  temp.push({ "id": res.data[i].giftId, "name": res.data[i].giftsName, "pic": realicon, "price": 1 });
                  cnt = cnt + 1;
                } else {
                  console.log(temp);
                  gift_list_sliced.push(temp);
                  temp = [];
                  temp.push({ "id": res.data[i].giftId, "name": res.data[i].giftsName, "pic": realicon, "price": 1 });
                  cnt = 1;

                }
              }
              gift_list_sliced.push(temp);
              console.log(gift_list_sliced);
              that.setData({
                gift_list_sliced: gift_list_sliced
              });

            }
          })

        };break;
        case '珍藏':{
          wx.request({
            url: app.globalData.url + "/gifts/selectGiftsByLabel",
            data: {
              label: "珍藏"
            }, success: function (res) {
              var gift_list_sliced = [];
              console.log(res.data);
              var cnt = 1;
              var temp = [];
              for (var i = 0; i < res.data.length; i++) {
                if (cnt % 10 != 0) {
                  var realicon = res.data[i].icon;
                  console.log(realicon);
                  realicon = realicon.replace("/var/www/html/", "https://xcx.gaoxiao114.cn/");
                  temp.push({ "id": res.data[i].giftId, "name": res.data[i].giftsName, "pic": realicon, "price": 1 });
                  cnt = cnt + 1;
                } else {
                  console.log(temp);
                  gift_list_sliced.push(temp);
                  temp = [];
                  temp.push({ "id": res.data[i].giftId, "name": res.data[i].giftsName, "pic": realicon, "price": 1 });
                  cnt = 1;

                }
              }
              gift_list_sliced.push(temp);
              console.log(gift_list_sliced);
              that.setData({
                gift_list_sliced: gift_list_sliced
              });

            }
          })

        };break;
        case '特质':{
          wx.request({
            url: app.globalData.url + "/gifts/selectGiftsByLabel",
            data: {
              label: "特质"
            }, success: function (res) {
              var gift_list_sliced = [];
              console.log(res.data);
              var cnt = 1;
              var temp = [];
              for (var i = 0; i < res.data.length; i++) {
                if (cnt % 10 != 0) {
                  var realicon = res.data[i].icon;
                  console.log(realicon);
                  realicon = realicon.replace("/var/www/html/", "https://xcx.gaoxiao114.cn/");
                  temp.push({ "id": res.data[i].giftId, "name": res.data[i].giftsName, "pic": realicon, "price": 1 });
                  cnt = cnt + 1;
                } else {
                  console.log(temp);
                  gift_list_sliced.push(temp);
                  temp = [];
                  temp.push({ "id": res.data[i].giftId, "name": res.data[i].giftsName, "pic": realicon, "price": 1 });
                  cnt = 1;

                }
              }
              gift_list_sliced.push(temp);
              console.log(gift_list_sliced);
              that.setData({
                gift_list_sliced: gift_list_sliced
              });

            }
          })
        };break;
      }
    },
    //礼物栏滑动
    giftsChange(e){
      //console.log(e , "礼物栏滑动数据的变化")
      //第几栏
      var index = e.detail.current;
      this.gitfs_tab_bChange(index);
    },

    //礼物状态栏的改变, 根据礼物栏而改变
    gitfs_tab_bChange(index){
      var tab_list = [{ id: 0, text: "特质" }, { id: 1, text: "珍藏" }, { id: 2, text: "才艺" }];
      
      var item1 = []; 
      var item2 = []; 
      var item3 = [];
      if (index == 0){
        item1 = tab_list[0];
        item2 = tab_list[1];
        item3 = tab_list[2];
      } else if (index == 1) {
        item1 = tab_list[1];
        item2 = tab_list[2];
        item3 = tab_list[0];
      } else if (index == 2) {
        item1 = tab_list[2];
        item2 = tab_list[0];
        item3 = tab_list[1];
      }
      tab_list = [];
      tab_list.push(item1); 
      tab_list.push(item2); 
      tab_list.push(item3);
      
      //console.log(tab_list, "状态栏的变化");
      this.setData({
        tab_list: tab_list,
      })
    }, 

    //选中的礼物
    getgift:function(e){
      
      var id1 = e.currentTarget.dataset.id1;
      var id2 = e.currentTarget.dataset.id2;
      var gift = this.data.gift_list_sliced[id1][id2]
      //console.log(gift, "选中礼物")
      this.setData({
        gift_selected:gift,
        num:1,
        gift_desc: true,
      })
    },  

    //礼物数量减少
    num_sub:function(){
      var num = this.data.num;
      if( num <= 1){
        wx.showToast({
          title: '请至少赠送一件',
          icon: "none"
        });
        return;
      }
      this.setData({
        num: num-1,
      })
    },
    //礼物数量增加
    num_add: function () {
      var num = this.data.num;
      this.setData({
        num: num + 1,
      })
    },

    //得到图片的路径
    getImgPic:function(icon){
      var src = "";
      if (icon.split("/var/www/html").length > 1) {
        src = app.globalData.urlb + icon.split("/var/www/html")[1];
        //console.log(src , "处理后的图片路径")
      }
      return src;
    },

    send:function(){
      var that =this;
      wx.showModal({
        title: "提示",
        content: '是否赠送' + that.data.gift_selected.giftsName,
        success: function (res) {
          if (!res.confirm) {
            return;
          }else{
            var num = that.data.num;//赠送礼物的数量
            var value = that.data.gift_selected.value;//赠送礼物的单价
            var totalPrice = num * value;//赠送礼物的金额

            var timestamp = Date.parse(new Date());
            timestamp = timestamp / 1000;
            var id = String(parseInt(Math.random() * 100000) + parseInt(timestamp))
            //任务、拾言、主页礼物赠送
            if(that.properties.sendgiftType == "1"){
              wx.request({
                url: app.globalData.url + '/customerSendgift/giftSending',
                method: "POST",
                header: "accept: */*;Content-Type: application/json",
                data: {
                  "giftId": that.data.gift_selected.giftId,
                  "giverId": app.getOpenid(),
                  "id": id,
                  "message": that.data.message,
                  "payFlag": true,
                  "receiverId": that.properties.receiverId,
                  "sendgiftTaskId": that.properties.sendgiftTaskId,
                  "sendgiftType": that.properties.sendgiftType,
                  "sendNum": num,
                  "value": value
                },
                success: function (res) {
                  console.log(res.data, "赠送礼物成功返回的值")
                  if (res.data["余额赠送礼物成功"] == "success") {
                    wx.showToast({
                      icon: "none",
                      title: '礼物赠送成功',
                      duration: 1600
                    });
                    that.setData({
                      message: ""
                    });
                  } else if (res.data["余额不足，请充值"] == "") {
                    wx.request({
                      url: getApp().globalData.url + "/wx/wxPay/gift",
                      data: {
                        appid: app.globalData.appid,
                        body: "taskPayment",
                        mch_id: "1510474321",
                        openid: app.getOpenid(),
                        out_trade_no: id,
                        total_fee: totalPrice
                      },
                      success: function (res) {
                        console.log(res, "===礼物微信支付接口返回的值==============");
                        setTimeout(function () {
                          console.log("正在向后台请求支付信息")
                          wx.request({
                            url: getApp().globalData.url + "/wx/PaySign/task",
                            data: {
                              appid: app.globalData.appid,
                              timeStamp: timestamp,
                              nonceStr: "",
                              package: "prepay_id=" + res.data.pre,
                              signType: "MD5",
                            },
                            success: function (res) {
                              console.log("正在调起支付窗口")
                              wx.requestPayment({
                                timeStamp: res.data.timeStamp,
                                nonceStr: res.data.nonceStr,
                                package: res.data.package,
                                signType: 'MD5',
                                paySign: res.data.paySign,
                                success: function () {
                                  // 支付成功后，返回主页
                                  wx.showToast({
                                    icon: "none",
                                    title: '礼物赠送成功',
                                    duration: 1600
                                  })

                                  that.setData({
                                    message: ""
                                  })
                                },
                                fail: function (err) {

                                  console.log("支付失败！！！");
                                  console.log(err);
                                  // 支付失败，提示用户重新支付
                                  wx.showModal({
                                    title: '提示',
                                    content: '支付失败，请重新支付',
                                    showCancel: false,
                                  })
                                }
                              })
                            },
                            // 调起支付窗口失败，正在重新调起
                            fail: function (err) {
                              console.log("调起支付窗口失败，正在重新调起")
                            }
                          })

                        }, 500)


                      }
                    })
                  }

                },
                fail: function (res) {
                  console.log(res, "赠送礼物失败返回的值")
                }
              })
            }else if(that.properties.sendgiftType == "2"){
              wx.request({
                url: app.globalData.url + '/customerSendgift/giftSending',
                method: "POST",
                header: "accept: */*;Content-Type: application/json",
                data: {
                  "giftId": that.data.gift_selected.giftId,
                  "giverId": app.getOpenid(),
                  "id": id,
                  "message": that.data.message,
                  "payFlag": true,
                  "receiverId": that.properties.receiverId,
                  "sendgiftCardId": that.properties.sendgiftCardId,
                  "sendgiftType": that.properties.sendgiftType,
                  "sendNum": num,
                  "value": value
                },
                success: function (res) {
                  console.log(res, "赠送礼物成功返回的值")
                  if (res.data["余额赠送礼物成功"] == "success") {
                    wx.showToast({
                      icon: "none",
                      title: '礼物赠送成功',
                      duration: 1600
                    });
                    that.setData({
                      message: ""
                    });
                  } else if (res.data["余额不足，请充值"] == "") {
                    wx.request({
                      url: getApp().globalData.url + "/wx/wxPay/gift",
                      data: {
                        appid: app.globalData.appid,
                        body: "taskPayment",
                        mch_id: "1510474321",
                        openid: app.getOpenid(),
                        out_trade_no: id,
                        total_fee: totalPrice
                      },
                      success: function (res) {
                        console.log(res, "===礼物微信支付接口返回的值==============");
                        setTimeout(function () {
                          console.log("正在向后台请求支付信息")
                          wx.request({
                            url: getApp().globalData.url + "/wx/PaySign/task",
                            data: {
                              appid: app.globalData.appid,
                              timeStamp: timestamp,
                              nonceStr: "",
                              package: "prepay_id=" + res.data.pre,
                              signType: "MD5",
                            },
                            success: function (res) {
                              console.log("正在调起支付窗口")
                              wx.requestPayment({
                                timeStamp: res.data.timeStamp,
                                nonceStr: res.data.nonceStr,
                                package: res.data.package,
                                signType: 'MD5',
                                paySign: res.data.paySign,
                                success: function () {
                                  // 支付成功后，返回主页
                                  wx.showToast({
                                    icon: "none",
                                    title: '礼物赠送成功',
                                    duration: 1600
                                  })

                                  that.setData({
                                    message: ""
                                  })
                                },
                                fail: function (err) {

                                  console.log("支付失败！！！");
                                  console.log(err);
                                  // 支付失败，提示用户重新支付
                                  wx.showModal({
                                    title: '提示',
                                    content: '支付失败，请重新支付',
                                    showCancel: false,
                                  })
                                }
                              })
                            },
                            // 调起支付窗口失败，正在重新调起
                            fail: function (err) {
                              console.log("调起支付窗口失败，正在重新调起")
                            }
                          })

                        }, 500)


                      }
                    })
                  }

                },
                fail: function (res) {
                  console.log(res, "赠送礼物失败返回的值")
                }
              })
            } else if(that.properties.sendgiftType == "0"){
              wx.request({
                url: app.globalData.url + '/customerSendgift/giftSending',
                method: "POST",
                header: "accept: */*;Content-Type: application/json",
                data: {
                  "giftId": that.data.gift_selected.giftId,
                  "giverId": app.getOpenid(),
                  "id": id,
                  "message": that.data.message,
                  "payFlag": true,
                  "receiverId": that.properties.receiverId,
                  "sendgiftType": that.properties.sendgiftType,
                  "sendNum": num,
                  "value": value
                },
                success: function (res) {
                  console.log(res.data, "赠送礼物成功返回的值")
                  if (res.data["余额赠送礼物成功"] == "success") {
                    wx.showToast({
                      icon: "none",
                      title: '礼物赠送成功',
                      duration: 1600
                    });
                    that.setData({
                      message: ""
                    });
                  } else if (res.data["余额不足，请充值"] == "") {
                    wx.request({
                      url: getApp().globalData.url + "/wx/wxPay/gift",
                      data: {
                        appid: app.globalData.appid,
                        body: "taskPayment",
                        mch_id: "1510474321",
                        openid: app.getOpenid(),
                        out_trade_no: id,
                        total_fee: totalPrice
                      },
                      success: function (res) {
                        console.log(res, "===礼物微信支付接口返回的值==============");
                        setTimeout(function () {
                          console.log("正在向后台请求支付信息")
                          wx.request({
                            url: getApp().globalData.url + "/wx/PaySign/task",
                            data: {
                              appid: app.globalData.appid,
                              timeStamp: timestamp,
                              nonceStr: "",
                              package: "prepay_id=" + res.data.pre,
                              signType: "MD5",
                            },
                            success: function (res) {
                              console.log("正在调起支付窗口")
                              wx.requestPayment({
                                timeStamp: res.data.timeStamp,
                                nonceStr: res.data.nonceStr,
                                package: res.data.package,
                                signType: 'MD5',
                                paySign: res.data.paySign,
                                success: function () {
                                  // 支付成功后，返回主页
                                  wx.showToast({
                                    icon: "none",
                                    title: '礼物赠送成功',
                                    duration: 1600
                                  })

                                  that.setData({
                                    message: ""
                                  })
                                },
                                fail: function (err) {

                                  console.log("支付失败！！！");
                                  console.log(err);
                                  // 支付失败，提示用户重新支付
                                  wx.showModal({
                                    title: '提示',
                                    content: '支付失败，请重新支付',
                                    showCancel: false,
                                  })
                                }
                              })
                            },
                            // 调起支付窗口失败，正在重新调起
                            fail: function (err) {
                              console.log("调起支付窗口失败，正在重新调起")
                            }
                          })

                        }, 500)


                      }
                    })
                  }

                },
                fail: function (res) {
                  console.log(res, "赠送礼物失败返回的值")
                }
              })
            }

          }

        }
      });

      

      //console.log(that.properties.receiverId, "得到传过来的参数")
      
    },

    //得到礼物数量
    getNum(e){
      var reg = /^[1-9]+[0-9]*]*$/; //判断正整数用
      if (!reg.test(e.detail.value)) {
        wx.showToast({
          title: '请输入正整数',
          icon: "none"
        });
        this.setData({
          num: this.data.num
        })
        return;
      }
      this.setData({
        num: parseInt(e.detail.value)
      })
      
      
    },

    //隐藏礼物描述
    hiddenGiftDesc(){
      this.setData({
        gift_desc:false,
      })
    },


    
    getMsg(e){
      this.setData({
        message: e.detail.value,
      })
    }

  }

  
})
