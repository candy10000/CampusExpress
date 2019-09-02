import WxValidate from '../../utils/WxValidate.js'

Component({
  /* 组件的生命周期方法 */
  lifetimes: {
    attached: function () {
      console.log("组件开始");
     
      // 初始化随机数和时间戳
      var time_stamp = "" + parseInt(new Date().getTime());
      time_stamp = time_stamp.substring(6, 13)
      this.setData({
        time_stamp: time_stamp,
      })

      // 验证方法
      this.initValidate();
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
      console.log("组件销毁");
    },
  },

  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    title: {            // 属性名
      type: String,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '标题'     // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    // 弹窗内容
    content: {
      type: String,
      value: '内容'
    },
    // 弹窗取消按钮文字
    btn_no: {
      type: String,
      value: '取消'
    },
    // 弹窗确认按钮文字
    btn_ok: {
      type: String,
      value: '确定'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    form:{
      photoTelephone: '',
      photoUsername: '',
      photoContact: ''
    },
    flag: true,
    phoneCameramanCombos: "",
    photoCameramanId:"", //摄影师id
    photoCameramanName: "",//摄影师的名字
    index:0, //套餐选项的下标
    time_stamp:"" //生成订单号使用
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 验证表单字段
    initValidate: function(){
      const rules = {
        photoUsername: {
          required: true,
          maxlength: 10
        },
        photoTelephone: {
          required: true,
          tel: true
        },
        photoContact: {
          required: true
        }
      };

      const message = {
        photoUsername: {
          required: '请填写名字',
          maxlength: '名字长度不超过10个字！'
        },
        photoTelephone: {
          required: '请填写联系电话',
          tel: '请填写正确的联系电话'
        },
        photoContact: {
          required: '请填写联系方式'
        }
      };
      this.WxValidate = new WxValidate(rules, message);
    },
  
    //隐藏弹框
    hideOrderForm: function () {
      this.setData({
        flag: !this.data.flag
      })
    },
    //展示弹框
    showOrderForm() {
      this.setData({
        flag: !this.data.flag
      })
    },

    //添加摄影师的信息
    setId:function(id,name){
      var that = this;
       console.log("组件获取值摄影师的ID："+id);
       console.log("摄影师的名字："+name);
      wx.request({
        url: getApp().globalData.url+"/photoCameraman/selectPhoneCameramanComboById",
        data: {
          cameramanId: id
        },
        success: function (res) {
          console.log("*********");
          console.log("/photoCameraman/selectPhoneCameramanComboById", res.data);

          that.setData({
            phoneCameramanCombos: res.data,
            photoCameramanId: id,
            photoCameramanName: name
          });       
        }
      })
    },

    // 监听用户选择的套餐id
    bindPickerChange: function(e){

      console.log("选择的套餐："+e.detail.value);
      this.setData({
        index: e.detail.value
      })
    },

    /* 校验报错 */
    showModal(error){
      wx.showModal({ 
        content: error.msg
      })
    },
    
    /* 提交表单信息 */
    formSubmit: function(e){
      console.log("order_form发生了submit事件，携带的数据为");
      console.log(e.detail.value)
      var order = e.detail.value;
      var orderMsg;//发送给支付表单信息

      // 验证表单
      if (!this.WxValidate.checkForm(order)){
        const error = this.WxValidate.errorList[0];
        this.showModal(error);
        return false;
      }
 
      //  添加一些摄影师或其他信息
      order.photoCameramanid = this.data.photoCameramanId;
      order.Id = "" + Math.floor(Math.random() * 90000 + 10000) + this.data.time_stamp;
    
      order.photoDetail = this.data.phoneCameramanCombos[this.data.index].comeramanComboDeatil;
      order.photoIspay = 0;
      order.photoNickname = "无";
      order.photoOpenid = "无";
      order.photoOrderTime = "";
      order.photoPrice = this.data.phoneCameramanCombos[this.data.index].comeramanComboPrice;
      order.photoTotalprice = 100;
      order.photoCameraman = this.data.phoneCameramanCombos[this.data.index].cameramanName;
      console.log("添加后的order信息：");
      console.log(order);
      orderMsg = {
        order: order,
        photoCameramanName: this.data.photoCameramanName
      }
     var orderMsgStr = JSON.stringify(orderMsg);
      
     
      // 添加成功跳转页面
      wx.navigateTo({
        url: '../../pages/orderConfirm/orderConfirm?photoOrder=' + orderMsgStr,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    },

    /*
   * 内部私有方法建议以下划线开头
   * triggerEvent 用于触发事件
   */
    _error() {
      //触发取消回调
      this.triggerEvent("error")
    },
    _success() {
      //触发成功回调
      wx.navigateTo({
        url: '../../pages/orderConfirm/orderConfirm',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
      this.triggerEvent("success");
    }
  }
})