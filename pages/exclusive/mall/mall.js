// pages/exclusive/mall/mall.js
var list = []
const app = getApp()
function goodsListDeal(list){
  var arr = []
  for(var i=0;i<list.length;i++){
    if (list[i].title == "" || list[i].title === undefined)
      arr[i]=list[i].name
    else
      arr[i] = list[i].title
  }
  return arr
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    recipients: "",
    customerTelephone: "",
    destination: "",
    roomnum: "",
  
    expressageDescription: "",

    // 下标

    // 数组
    cards_main_groupId: [],
    cards: [],
    orders: [],
    school: ["福建农林大学","江夏","闽江","外语外贸"],
    schoolIndex: 0,
    express: ["顺丰", "韵达", "圆通", "中通", "申通", "百世", "邮政", "天天"],
    multiIndex: [0, 0,0],
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


    // 水印文字
    usernameph: "输入您的姓名",
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

    itemNum:1,
    goodsList_1:[{cateid:'1001',name:'蒙牛'},{cateid:'1002',name:'伊利'}],
    goodsList_2: [
      { cateid: '1', name:'纯甄酸牛奶200g*12盒',price:48.00},
      { cateid: '1', name: '纯甄酸牛奶200g*12盒', price: 48.00}
      ],
 
    goodsIndex:[0,0],

    imgs: [
      "https://xcx.gaoxiao114.cn:8888/images/milk1.jpg",
      "https://xcx.gaoxiao114.cn:8888/images/milk2.jpg",
      "https://xcx.gaoxiao114.cn:8888/images/milk3.jpg",
      "https://xcx.gaoxiao114.cn:8888/images/milk4.jpg",

    ],

    imgheights: [],
    current: 0,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
   
    wx.request({
      url: app.globalData.url + "/shopCategory/categoryList",
      success:function(res){
        // console.log("**********");
        // console.log(res.data);
        // goodsList_1.push(res.data[0]);
        // console.log(res.data.length);

        that.setData({
          goodsList_1:res.data
        })
          var defaultCateId = res.data[0].cateid
        wx.request({
          url: app.globalData.url + "/shopProduct/selectProductListByCateId",
          data:{
            cateId:defaultCateId
          },
          success:function(res){
            // console.log("Product");
            // console.log(res.data)
            that.setData({
              goodsList_2:res.data
            })
            // console.log(that.data.goodsList_1)
            var goodsListShow = []
            // console.log(that.data.goodsList_2)
            goodsListShow.push(goodsListDeal(that.data.goodsList_1))
            goodsListShow.push(goodsListDeal(that.data.goodsList_2))
            that.setData({
              goods: goodsListShow
            }) 
          }
          
        })

      }
    })
    
    // var goodsListShow = []
    // goodsListShow.push(goodsListDeal(that.data.goodsList_1))
    // goodsListShow.push(goodsListDeal(that.data.goodsList_2))
    // that.setData({
    //     goods: goodsListShow
    //   }) 





    // wx.showModal({
    //   title: '通知!',
    //   content: '这个学期拾和君的快递业务已经结束啦！感谢大家的支持 预祝大家考试全过 新年快乐!',
    // })
    // 版本更新
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      // console.log("是否含有新版本");
      // console.log(res.hasUpdate)
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

    // console.log("主页:");
    var openid = app.getOpenid(app.globalData.url);
    // 初始化随机数和时间戳
    var random_number = Math.floor(Math.random() * 90000 + 10000);
    var time_stamp = "" + parseInt(new Date().getTime());
    time_stamp = time_stamp.substring(6, 13)
    this.setData({
      random_number: random_number,
      time_stamp: time_stamp,
      openid: openid
    })

    // 初始化快递信息文本
    that.setData({
      expressageCompany: that.data.express[0],
      destination: that.data.multiArray[1][0],
      expressageArriveTime: that.data.date[0],
      // 下标
      expressageCompany_index: 0,
      expressageArriveTime_index: 0
    })
    // 获取卡片信息
    wx.request({
      url: getApp().globalData.url + "/storeOrder/wx/showOrder",
      data: {
        userid: that.data.openid,
      },
      success: function (res) {
        console.log(res.data);
        // console.log("获取openid成功，用来调用卡片信息：" + that.data.openid);
        that.setData({
          cards: res.data
        })
        // console.log("获取cards卡片信息：");
        // console.log(that.data.cards)
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
//================================================//======
   
    //从订单信息页回来 加载数据
    that.setData({
      buynum: app.globalData.goodsNum,
      orders: app.globalData.globalMallOrders,
    })

  },
  goodsColumnChange: function (e) {
    var that = this
    // console.log(e.detail.value)
    var tempIndex = that.data.goodsIndex
    var c = e.detail.column
    var v = e.detail.value
    switch (c){
      case 0:
        {
          // console.log(tempIndex)
          //一级目录改变时，二级目录index要变为默认值0  
          tempIndex[0] = v
          tempIndex[1] = 0
          var selectedId = that.data.goodsList_1[v].cateid
          that.setData({
          goodsIndex: tempIndex
         })
         
          wx.request({
            url: app.globalData.url + "/shopProduct/selectProductListByCateId",
            data:{
              cateId: selectedId
            },
            success:function(res){
              console.log(res.data)
              var goodsList=[];
              goodsList.push(goodsListDeal(that.data.goodsList_1))
              goodsList.push(goodsListDeal(res.data))
              that.setData({
                goodsList_2:res.data,
                goods:goodsList
              })
            }
          })

        };break;
        case 1:{
          tempIndex=that.data.goodsIndex
          tempIndex[1] = v
          that.setData({
            goodsIndex: tempIndex
          })
        };break;

    }
  },
  goodsChange:function(){
    var that = this
    
    var item = goodsListDeal(that.data.goodsList_2)
    item = item[that.data.goodsIndex[1]]
    // console.log(item)
    that.setData({
      goodsItem:item
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
    // this.onLoad();

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


 
  onPullDownRefresh: function () {
      wx.showNavigationBarLoading(); //在标题栏中显示加载
      // 刷新
      setTimeout(function () {
        app.globalData.goodsNum = 0
        wx.reLaunch({
          url: '/pages/exclusive/exIndex/exIndex',
          success: function (res) {
            // console.log("成功");
          }, fail: function (res) {
            // console.log("失败");
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
      // console.log(e.detail.value);
    },
    // 电话
    catch_customerTelephone(e) {
      var that = this;
      that.setData({
        customerTelephone: e.detail.value
      })
      // console.log(e.detail.value);
    },
    // 取件码
   
    // 宿舍号码
    catch_roomnum(e) {
      var that = this;
      that.setData({
        roomnum: e.detail.value
      })
      // console.log(e.detail.value);
    },
    // 其他备注
    catch_expressageDescription(e) {
      var that = this;
      that.setData({
        expressageDescription: e.detail.value
      })
      // console.log(e.detail.value);
    },
    // 快递规格大小
    

   

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


    // 加入购物车
    addclick: function (e) {
      var that = this;
      var datas = that.data;
      var school = app.globalData.globalSchool;
      var recipients=datas.recipients;;
      var customerTelephone = datas.customerTelephone;;
      var destination = datas.destination;;
      var roomnum = datas.roomnum;
      var expressageDescription = datas.expressageDescription;
      var goodsItem = datas.goodsList_2[datas.goodsIndex[1]];
      var itemInput = datas.goodsItem;

      var flag = "1";
      if (recipients.length == 0  ) {
        flag = "0";
        that.setData({
          recipients_color: "border: 1px red solid"
        })
      } else {
        that.setData({
          recipients_color: ""
        })
      }
      if (customerTelephone.length == 0){
        flag = "0";
        that.setData({
          customerTelephone_color: "border: 1px red solid"
        })
      } else {
        that.setData({
          customerTelephone_color: ""
        })
      }
      if (roomnum.length == 0){
        flag = "0"; 
        that.setData({
          roomnum_color: "border: 1px red solid"
        })
      } else {
        that.setData({
          roomnum_color: ""
        })
      }
      if (itemInput===undefined) {
        flag = "0";
        that.setData({
          itemInput_color: "border: 1px red solid"
        })
      } else {
        that.setData({
          itemInput_color: ""
        })
      }
      // console.log(itemInput)

      if (flag == "1") {  //  没有未填框
        that.setData({
          roomnum_enable: "disable",
          distination_enable: "disable"
        })

        // 遍历数据
        var temp_school;
        var temp_recipients;
        var temp_customerTelephone;
        var temp_destination;
        var temp_roomnum;
        var temp_goods;

        var temp_order;

        var hasSameOrder = false;
        for (var i = 0; i < that.data.orders.length; i++) {
          temp_order = that.data.orders[i];
          temp_school = temp_order.school;
          temp_recipients = temp_order.recipients;
          temp_customerTelephone = temp_order.customerTelephone;
          temp_destination = temp_order.destination;
          temp_roomnum = temp_order.roomnum;
          temp_goods = temp_order.goodsName;

          // if (school == temp_school && recipients == temp_recipients && customerTelephone == temp_customerTelephone && destination == temp_destination && roomnum == temp_roomnum && temp_goods == goodsItem.name) {
          //   hasSameOrder = true;
          //   wx.showToast({
          //     title: '已存在此订单',
          //   })
          //   break;
          // }
        }
        
        console.log(that.data.orders,"order 的数据");
        console.log("hasSameOrder的值：" + hasSameOrder);
        // 不存在重复订单，则添加进数组
        if (hasSameOrder == false) {
          this.bulidShopCarInfo();
        }
      
      }else{
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
     
      // 订单所需字段
      var Id = "" + Math.floor(Math.random() * 90000 + 10000) + that.data.time_stamp;
      var school = app.globalData.globalSchool;
      var customerName = "";
      var customerTelephone = datas.customerTelephone;
      var customerPlace = datas.destination + "#" + datas.roomnum;
      var itemNum = datas.itemNum
      var expressageDescription = datas.expressageDescription;
      
      var expressageStatus = 2;
      var recipients = datas.recipients;
      var orderTime = "";
     
      var timestamp = "";
      var pay = 0;
      
      var item = datas.goodsList_2[datas.goodsIndex[1]]
      


      var price = item.price
      var cateid = item.cateid
      var name = item.name
      var title = item.title

      // var customerName2 = item.customerName

      var totalprice = 0;
      var expectTime = "";  //  在修改页面赋值
      // console.log("加入购物车按钮获取openid：");
      var userid = app.getOpenid(app.globalData.url);
      var payid = "";  //  在修改页面赋值
      var nickname = "";
      var goodsItem = that.data.goodsList_2
      // 网页自定义字段
      var roomnum = datas.roomnum;
      var destination = datas.destination;
      var obj = {};


      obj.Id = Id;
      // obj.customerName = customerName2;
      obj.school = school;
      obj.customerTelephone = customerTelephone;

      obj.customerPlace = customerPlace;
      

      obj.goodsName = name
      obj.title = title
      obj.cateid = cateid
      obj.num = itemNum
      obj.expressageDescription = expressageDescription;
     
      obj.expressageStatus = expressageStatus;
      obj.recipients = recipients;
      obj.orderTime = orderTime;
     
      obj.timestamp = timestamp;
      obj.pay = pay;
      obj.price = price;
      obj.totalprice = totalprice
      obj.expectTime = expectTime;
      obj.userid = userid;
      obj.payid = payid;
      obj.nickname = nickname;


      // 网页自定义字段
      obj.roomnum = roomnum;
      obj.destination = destination;
      
      var orders = that.data.orders;
      orders.push(obj);

      app.globalData.globalMallOrders = orders;

      that.setData({
        orders: orders
      })
      wx.setStorageSync("orders", that.data.orders);

      that.setData({
        buynum: orders.length
      })

      var order = app.globalData.globalMallOrders;
      // console.log(order);
      // console.log(orders.length)
      // that.setData({
      //   index:index+1
      // })
    },

    // 用户尝试修改地址时候的提示信息
    destinationwarn: function () {
      if (this.data.orders.length >= 1) {
        wx.showToast({
          icon: "none",
          title: '只有同一个宿舍地址的订单才可以加入同一个购物车享受优惠哦',
          duration: 1600,
        })
      }
    },

    // 结算购物车
    buyclick: function () {
      var that = this;
      app.globalData.goodsNum = that.data.buynum
      if (that.data.orders.length == 0) {
        wx.showToast({
          icon: "none",
          title: '购物车为空，请先添加订单',
          duration: 800
        })
      } else {
        wx.navigateTo({
          url: '/pages/exclusive/mall/mall_confirm/mall_confirm',
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
            // console.log("取消的订单编号：");
            // console.log(e.currentTarget.dataset.id);
            var cancle_id = e.currentTarget.dataset.id;
            var cnum = e.currentTarget.dataset.num;
            console.log(cnum);
            var price;
            var total_price;
            for (var i = 0; i < that.data.cards.length; i++) {
              if (cancle_id == that.data.cards[i].id) {
                price = parseInt(that.data.cards[i].price * 100);
                
                //总价格
                total_price = parseInt(that.data.cards[i].totalprice*100);
                break;
              }
            }
            var main_id = cancle_id.substring(0, 12) + "0";
            wx.request({
              url: getApp().globalData.url + "/storeOrder/wx/wxrefund",
              data: {
                merchantId: main_id,
                refundId: cancle_id,
                total_price: total_price,
                userid: that.data.openid,
                price: price
              },
              header: { 'content-type': 'application/json' },
              success: function (res) {
                //console.log(res.data);
                wx.showToast({
                  title: res.data,
                  icon: "none"
                })
                if (res.data == "取消订单成功") {
                  that.setData({
                    cards_main_groupId: [],
                    cards: [],
                  })
                  that.onLoad();
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
        // console.log("目前的indextemp：" + that.data.indextemp)
      }
      if (indextemp == length || indextemp >= 8) {
        that.setData({
          morehidden: true,
          completehidden: false
        })
      }
    },

    
  addGoodsNum:function(){
    var that = this
    var num = that.data.itemNum
    num=num+1
    that.setData({
      itemNum:num
    })

  },
  subGoodsNum: function () {
    var that = this
    var num = that.data.itemNum
    if(num>1){
    num = num - 1
    that.setData({
      itemNum: num
    })
    }else{
      wx.showToast({
        title: '请至少购买一件',
        icon:"none"
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
    console.log(imgwidth, imgheight)
    // 计算的高度值
    var viewHeight = 750 / ratio;
    var imgheight = viewHeight;
    var imgheights = this.data.imgheights;
    //把每一张图片的对应的高度记录到数组里  
    imgheights[e.target.dataset.index] = imgheight;
    console.log('图片的高度：' + imgheights)
    this.setData({
      imgheights: imgheights
    })
  },


  setHeight(e) {
    this.setData({ current: e.detail.current })
  }
})