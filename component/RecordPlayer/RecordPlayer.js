// component/RecordPlayer/RecordPlayer.js
Component({
  /**
   * 组件的属性列表
   */
  options: {
    addGlobalClass: true
  },

  properties: {
    second: Number,
    src: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    innerAudioContext: undefined,
    rpTempSecond: 0,
    rpIsSpeak: false
  },

  lifetimes: {
    created: function () {
    },
    attached: function () {
    },
    ready: function () {
    },
    moved: function () {
    },
    detached: function () {
      !this.data.innerAudioContext || this.data.innerAudioContext.destroy()
    },
    error: function () {
    }
  },

  pageLifetimes: {
    show: function () {
    },
    hide: function () {
      if (this.data.innerAudioContext) {
        this.data.innerAudioContext.pause()
      }
    },
    resize: function (size) {
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    initInnerAudioContext() {
      //创建
      this.setData({ innerAudioContext: wx.createInnerAudioContext() })
      var innerAudioContext = this.data.innerAudioContext
      innerAudioContext.src = this.data.src
      innerAudioContext.onPlay((res) => {
        this.setData({ rpIsSpeak: true })
      })
      innerAudioContext.onTimeUpdate(() => {
        this.setData({ rpTempSecond: innerAudioContext.currentTime})
      })
      innerAudioContext.onSeeking((res) => {
      })
      innerAudioContext.onPause((res) => {
        this.setData({ rpIsSpeak: false })
      })
      innerAudioContext.onStop((res) => {
        this.setData({ rpIsSpeak: false })
      })
      innerAudioContext.onEnded((res) => {
        this.setData({
          rpIsSpeak: false,
          rpTempSecond: 0
        })
      })
    },
    trigger() {
      if (!this.data.innerAudioContext) {
        this.initInnerAudioContext()
      }
      if (this.data.rpIsSpeak) {
        this.pause()
      } else {
        this.play()
      }
    },
    play() {
      //将当前组件的innerAudioContext传给上级component以便停止当前innerAudioContext
      this.triggerEvent("sendInnerAudioContext", {
        innerAudioContext: this.data.innerAudioContext
      })
      this.data.innerAudioContext.play()
    },
    pause() {
      this.data.innerAudioContext.pause()
    }
  }
})
