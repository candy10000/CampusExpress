// pages/task/postTask/postTask.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    helpMe: function () {
      wx.navigateTo({
        url: '/pages/taskPublish/taskPublish_t1'
      });
    },
    helpOthers: function () {
      wx.navigateTo({
        url: '/pages/taskPublish/taskPublish_t2'
      });
    }
  }
})