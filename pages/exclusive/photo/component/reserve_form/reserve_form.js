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
    flag: true,
    username:'',
    telephone:'',
    comboPhoto:null,
    list:null,
    time_stamp: "" //生成订单号使用
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 验证表单字段
    initValidate: function () {
      const rules = {
        username: {
          required: true,
          maxlength: 10
        },
        telephone: {
          required: true,
          tel: true
        }
      };
      const message = {
        username: {
          required: '请填写名字',
          maxlength: '名字长度不超过10个字！'
        },
        telephone: {
          required: '请填写联系电话',
          tel: '请填写正确的联系电话'
        }
      };
      this.WxValidate = new WxValidate(rules, message);
    },

    getUsername:function(e){
      var username = e.detail.value;
      console.log("***username***", e.detail.value);
      this.setData({
        username:username,
      })
    },
    getTelephone: function (e) {
      var telephone = e.detail.value;
      this.setData({
        telephone: telephone,
      })
    },
    //隐藏弹框
    hideReserveForm: function () {
      this.setData({
        flag: !this.data.flag
      })
    },
    //展示弹框
    showReserveForm(e) {
      // var comboPhoto = JSON.stringify(e);
      // console.log("***comboPhoto***", comboPhoto);
      console.log("eeee====", e);
      console.log(typeof e);
      this.setData({
        flag: !this.data.flag,
        list:e,
        // comboPhoto: comboPhoto,
      })
    },

    /* 校验报错 */
    showModal(error) {
      wx.showModal({
        content: error.msg
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
    /* 提交表单信息 */
    formSubmit: function (e) {
      var msg = e.detail.value;
      console.log("===form===",msg);
      console.log(typeof msg);

      // 验证表单
      if (!this.WxValidate.checkForm(msg)) {
        const error = this.WxValidate.errorList[0];
        this.showModal(error);
        return false;
      }

      var order = this.data.list;
      order.username = msg.username;
      order.telephone = msg.telephone;
      order.time_stamp = this.data.time_stamp;
      console.log("===order===", order);
      console.log(typeof order);
      var comboPhoto = JSON.stringify(order);
      wx.navigateTo({
        url: '../../pages/reserveConfirm/reserveConfirm?comboPhoto=' + comboPhoto,
        // url: '../../pages/reserveConfirm/reserveConfirm?username='+ this.data.username + '&telephone=' + 
        //   this.data.telephone + '&comboPhoto=' + this.data.comboPhoto + '&time_stamp=' + this.data.time_stamp,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
      this.triggerEvent("success");
    }
  }
})