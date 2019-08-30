Page({
  /**
   * 页面的初始数据
   */
  data: {
    winWidth: 0,
    winHeight: 0,
    works: [],
    photographDetail:""
  },

  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    console.log("id:" + options.id);
    var that = this;

    // 请求摄影师的详细信息
    wx.request({
      url: getApp().globalData.url +"/photoCameraman/selectCameramanDetailById",
      data: {
        id: options.id
      },
      success: function (res) {
        console.log("*********");
        console.log("/photoCameraman/selectCameramanDetailById", res.data);

        var imgs = [];
        imgs = res.data.cameramanSamplereels.split(",");
        for (var i = 0; i < imgs.length; i++) {
          imgs[i] = getApp().globalData.urlb + "" + imgs[i];
        }
        
        that.setData({
          photographDetail: res.data,
          works: imgs
        });
      }
    })
  
    //  请求系统数据
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          winHeight: res.windowHeight,
          winWidth: res.windowWidth
        })
      }
    });
  },
  onReady: function () {
    this.orderForm = this.selectComponent("#orderForm");
  },

  /* 作品集展示加载函数 */
  lower() {
    var result = this.data.works;
    var len = this.data.works.length;

    var resArr = [];
    for (let i = 0; i < 10; i++) {
      resArr.push(this.data.works[i]);
    };
    var cont = result.concat(resArr);
    console.log(resArr.length);
    if (cont.length >= len) {
      wx.showToast({ //如果全部加载完成了也弹一个框
        title: '我也是有底线的',
        icon: 'success',
        duration: 300
      });
      return false;
    } else {
      wx.showLoading({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中”  
        title: '加载中',
        icon: 'loading',
      });
      setTimeout(() => {
        this.setData({
          works: cont
        });
        wx.hideLoading();
      }, 1500)
    }
  },
 
  
  /*点击立即约拍弹出来orderForm表单 */
  showOrderForm(e){
    var id = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.name;
    console.log("摄影师的名字"+name);
    this.orderForm.setId(id,name);
    this.orderForm.showOrderForm();
  },
 
  //取消事件
  _error() {
    console.log('你点击了取消');
    this.orderForm.hideOrderForm();
  },
  //确认事件
  _success() {
    console.log('你点击了确定'); 
    this.orderForm.hideOrderForm();
  }
})