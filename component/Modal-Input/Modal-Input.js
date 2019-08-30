// component/Modal-Input/Modal-Input.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: String,
    confirmText: String,
    cancelText: String,
    hidden: Boolean,
    placeholder: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    text: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getText(e) {
      this.setData({ text: e.detail.value })
    },
    modalConfirm() {
      console.log('确认')
      this.triggerEvent('confirmEvent', {
        text: this.data.text
      })
      this.setData({ hidden: true, text: '' })
    },
    modalCancel() {
      console.log('取消')
      this.setData({ hidden: true, text: '' })
    }
  }
})