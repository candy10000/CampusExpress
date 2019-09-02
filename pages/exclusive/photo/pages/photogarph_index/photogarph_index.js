const app = getApp()

Page({
  /* 页面的初始数据*/
  data: {
    winWidth: 0,
    winHeight: 0,
    // tab切换
    currentId: '2',
    section: [{
      name: '进阶摄影师',
      typeId: '1'
    }, {
      name: '见习摄影师',
      typeId: '2'
    }, {
      name: '高级摄影师',
      typeId: '3'
    }],


    // 小卡片
    startX: 0,
    endX: 0,
    iCenter: 3,
    datas: [],
    order: [],

    //bottom轮播图配置
    autoplay: true,
    interval: 3000,
    duration: 1200
  },

  /**
   * 生命周期函数
   * 页面加载时调用
   */
  onLoad: function (options) {
    this.__set__();
    this.move();
    var that = this;
  
    // 请求摄影师的数据
    wx.request({
      url: getApp().globalData.url + "/photoCameraman/selectCameramanByLevel",
      data: {
        level: 2
      },
      success: function (res) {
        console.log("*********");
        console.log("/photoCameraman/selectCameramanByLevel", res.data);

        var photographs = res.data;
        var photographDetail = [];
  
        photographDetail.push({
          id: 1,
          photographId: photographs[0].id,
          zIndex: 2,
          opacity: 0.4,
          left: -26,
          up: -0,
          charge: photographs[0].charge,
          image: getApp().globalData.urlb + "" + photographs[0].cameramanPhoto,
          detail: photographs[0].detail,
          animation: null
        });

        photographDetail.push({
          id: 2,
          photographId: photographs[1].id,
          zIndex: 4,
          opacity: 1,
          left: 0,
          up: -13,
          charge: photographs[1].charge,
          image: getApp().globalData.urlb + "" + photographs[1].cameramanPhoto,
          detail: photographs[1].detail,
          animation: null
        }
        );

        // 遍历获取到摄影师数组
        for (var i = 2; i < photographs.length; i++) {


          photographDetail.push({
            id: 3,
            photographId: photographs[i].id,
            zIndex: 2,
            opacity: 0.4,
            left: 26,
            up: 0,
            charge: photographs[i].charge,
            image: getApp().globalData.urlb + "" + photographs[i].cameramanPhoto,
            detail: photographs[i].detail,
            animation: null
          });

        }


      

        that.setData({
          datas: photographDetail
        });
        that.__set__();
        that.move();
      }
    })

    //请求摄影师套餐
    wx.request({
      url: 'https://xcx.gaoxiao114.cn/photoCambo/list',
      success: function (res) {
        console.log("***PhoneCameramanComboById***", res.data);
        var photoCambo = res.data;
        var comboPics = [];
        for(var i = 0; i < photoCambo.length; i++) {
          comboPics.push({
            id:photoCambo[i].id,
            image: getApp().globalData.urlb + "" + photoCambo[i].comboPic,
          })
        }
        that.setData({
          comboPics: comboPics,
          all: photoCambo,
          comboPic: photoCambo.comboPic,
        });
      }
    })

    /**
     * 获取系统信息
     */
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
   
  },

  // 监听页面初次渲染完成
  onReady: function () {
    //获得popup组件
    this.reserveForm = this.selectComponent("#reserveForm");
  },

  /**
   *  小卡片布局函数
   */
  // 新的排列复制到新的数组中
  __set__: function () {
    var that = this;
    var order = that.data.order;
    var datas = that.data.datas;
    for (var i = 0; i < datas.length; i++) {
      that.setData({
        ["order[" + i + "]"]: datas[i].id
      })
    }
  },

  // 设置小卡片的动画
  move: function () {
    var datas = this.data.datas;

    /*图片分布*/
    for (var i = 0; i < datas.length; i++) {
      var data = datas[i];

      var animation = wx.createAnimation({
        duration: 200
      });
      animation.translate(data.left, data.up).step();
      // animation.translateY(data.up).step;
      this.setData({
        ["datas[" + i + "].animation"]: animation.export(),
        ["datas[" + i + "].zIndex"]: data.zIndex,
        ["datas[" + i + "].opacity"]: data.opacity,
      })

      console.log("datas", this.data.datas);
      console.log("order", this.data.order);
    }

  },
  // 左箭头
  left: function () {
    //
    var last = this.data.datas.pop(); //获取数组的最后一个
    this.data.datas.unshift(last); //放到数组的第一个
    var orderFirst = this.data.order.shift();
    this.data.order.push(orderFirst);
    this.move();
  },
  // 右箭头
  right: function () {
    var first = this.data.datas.shift(); //获取数组的第一个
    this.data.datas.push(first); //放到数组的最后一个位置
    var orderLast = this.data.order.pop();
    this.data.order.unshift(orderLast);
    this.move();
  },
  //手指触发开始移动
  moveStart: function (e) {

    var startX = e.changedTouches[0].pageX;
    this.setData({
      startX: startX
    });
  },
  //手指触摸后移动完成触发事件
  moveItem: function (e) {

    var that = this;
    var endX = e.changedTouches[0].pageX;
    this.setData({
      endX: endX
    });
    //计算手指触摸偏移剧距离
    var moveX = this.data.startX - this.data.endX;
    //向左移动
    if (moveX > 20) {
      this.left();
    }
    if (moveX < -20) {
      this.right();
    }
  },
  

  /* 每个导航的点击事件 */
  handleTap: function (e) {
    let id = e.currentTarget.id;
    var that = this;


    // 请求摄影师的数据
    wx.request({
      url: getApp().globalData.url + "/photoCameraman/selectCameramanByLevel",
      data: {
        level: id
      },
      success: function (res) {
        console.log("*********");
        console.log("/photoCameraman/selectCameramanByLevel", res.data);

        var photographs = res.data;
        var photographDetail = [];

        photographDetail.push({
          id: 1,
          photographId: photographs[0].id,
          zIndex: 2,
          opacity: 0.4,
          left: -26,
          up: -0,
          charge: photographs[0].charge,
          image: getApp().globalData.urlb + "" + photographs[0].cameramanPhoto,
          detail: photographs[0].detail,
          animation: null
        });

        photographDetail.push({
          id: 2,
          photographId: photographs[1].id,
          zIndex: 4,
          opacity: 1,
          left: 0,
          up: -13,
          charge: photographs[1].charge,
          image: getApp().globalData.urlb + "" + photographs[1].cameramanPhoto,
          detail: photographs[1].detail,
          animation: null
        }
        );

        // 遍历获取到摄影师数组
        for (var i = 2; i < photographs.length; i++) {


          photographDetail.push({
            id: 3,
            photographId: photographs[i].id,
            zIndex: 2,
            opacity: 0.4,
            left: 26,
            up: 0,
            charge: photographs[i].charge,
            image: getApp().globalData.urlb + "" + photographs[i].cameramanPhoto,
            detail: photographs[i].detail,
            animation: null
          });

        }




        that.setData({
          datas: photographDetail
        });
        that.__set__();
        that.move();
      }
    })


    if (id) {
      this.setData({
        currentId: id
      })
    }
  },

  /**
   * 点击某个小卡片跳转到相应摄影师的个人作品集 "pages/works/works" 
   */
  choose: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../works/works?id='+id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

/**
 * bottom 套餐轮播图片
*/
  //  点击预约弹出表单reserveForm
  showReserveForm: function (e) {
    var id = e.currentTarget.dataset.id - 1;
    var all = this.data.all;
    var comboPhoto = JSON.stringify(all[id]);
    console.log("点击了图片");
    console.log(typeof comboPhoto);
    console.log(id);
    this.reserveForm.showReserveForm(all[id]);
  },

  //取消事件
  _error() {
    console.log('tt你点击了取消');
    this.reserveForm.hideReserveForm();
  },
  //确认事件
  _success() {
    console.log('tt你点击了确定');
    this.reserveForm.hideReserveForm();
  },

})