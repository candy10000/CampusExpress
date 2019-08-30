// component/Comment/Comment.js
var app = getApp()
const recordOptions = {
  duration: 600000,
  sampleRate: 44100,
  numberOfChannels: 1,
  encodeBitRate: 192000,
  format: 'mp3',
  frameSize: 50
}
var recorderManager;
var innerAudioContext;
var recordInterval;
Component({

  options: {
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    taskId: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    lineHeight: 0,
    cursorSpacing: 80,
    imgCount: 3,
    imgBox: [],
    recordSrc: '',
    text: '',

    isSendPicAndText: false,

    showTextArea:false,
    isImgBoxShow: true,
    isImgBoxUp: false,
    isRecordBoxShow: true,
    isRecordBoxUp: false,
    isCommentBoxUp: false,

    isRecording: false,
    isPlaying: false,
    recordAction: 'fa-microphone',
    tempSecond: 0,
    recordSecond: 0,

    allUrl: ''
  },

  lifetimes: {

    created: function () {
      console.log('created')
    },
    attached: function () {
      // 在组件实例进入页面节点树时执行
      console.log('attached')
      this.initRecorderManager()
      this.initInnerAudioContext()
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
      console.log('detached')
    },
    ready: function () {
      console.log('ready')
    },
    moved: function () {
      console.log('moved')
    },
    detached: function () {
      console.log('detached')
      // !innerAudioContext || innerAudioContext.destroy()
    },
    error: function () {
      console.log('error')
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 选择图片
     */
    choosePic: function () {
      var newImgbox = this.data.imgbox
      wx.chooseImage({
        count: this.data.imgCount - this.data.imgBox.length,
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: res => {
          this.setData({ imgBox: this.data.imgBox.concat(res.tempFilePaths) })
        }
      })
    },
    /**
     * 预览图片
     */
    previewImg: function (e) {
      const idx = e.target.dataset.idx
      const images = this.data.imgBox
      wx.previewImage({
        current: images[idx],  //当前预览的图片
        urls: images,  //所有要预览的图片
      })
    },
    /**
     * 
     * 删除图片
     */
    deleteImg: function (e) {
      const idx = e.target.dataset.idx
      var box = this.data.imgBox
      box.splice(idx, 1)
      this.setData({ imgBox: box })
    },
    textLineChange(e) {
      console.log(e.detail, '行数')
      var lineCount = e.detail.lineCount
      var heightRpx = e.detail.heightRpx
      /*
      if (lineCount == 1)
        this.setData({ lineHeight: e.detail.heightRpx })
      if (lineCount <= 3)
        this.setData({ cursorSpacing: 85 - heightRpx * (lineCount - 1) / lineCount })
      else if (lineCount == 4)
        this.setData({ cursorSpacing: this.data.cursorSpacing - heightRpx * 1.0 / lineCount * 0.5 })
      */
      if (lineCount <= 3)
        this.setData({ cursorSpacing: 80 - 40 * (lineCount-1) })
    },
    refreshText(e) {
      this.setData({ text: e.detail.value })
    },
    TextTrigger() {
      console.log('TextTrigger')
      if(!this.data.showTextArea)
        this.setData({ isSendPicAndText: true })
      if (this.data.showTextArea && !this.data.isImgBoxUp)
        this.setData({ isSendPicAndText: false })
      this.setData({ showTextArea: !this.data.showTextArea})
    },
    imgBoxTrigger() {
      this.setData({t: true})
      console.log('imgBoxTrigger--click')
      var data = this.data
      if (!data.isCommentBoxUp) {
        //工具栏上升，图片盒子上升显示，录音盒子上升隐藏
        console.log('up')
        this.setData({
          isCommentBoxUp: true,
          isImgBoxUp: true,
          isRecordBoxUp: true,
          isImgBoxShow: true,
          isRecordBoxShow: false,
          isSendPicAndText: true
        })
      } else if (data.isImgBoxShow) {
        //此时工具栏在上部分，并且图片盒子显示，所以整体向下移动
        console.log('down')
        this.setData({
          isCommentBoxUp: false,
          isImgBoxUp: false,
          isRecordBoxUp: false,
          isSendPicAndText: false
        })
      } else {
        //显示图片
        console.log('show')
        this.setData({
          isImgBoxShow: true,
          isRecordBoxShow: false,
          isSendPicAndText: true
        })
      }
    },
    sendPicAndText() {
      this.triggerEvent("sendData", {
        imgBox: this.data.imgBox,
        text: this.data.text,
        record: {
          src: this.data.recordSrc,
          duration: this.data.recordSecond
        }
      })
    },
    recordBoxTrigger() {
      console.log('recordBoxTrigger--click')
      if(this.data.isSendPicAndText) {
        this.sendPicAndText()
        return;
      }
      var data = this.data
      if (!data.isCommentBoxUp) {
        console.log('up')
        this.setData({
          isCommentBoxUp: true,
          isImgBoxUp: true,
          isRecordBoxUp: true,
          isImgBoxShow: false,
          isRecordBoxShow: true
        })
      } else if (data.isRecordBoxShow) {
        //显示图片盒子，隐藏录音盒子
        console.log('down')
        this.setData({
          isCommentBoxUp: false,
          isImgBoxUp: false,
          isRecordBoxUp: false
        })
      } else {
        console.log('show')
        this.setData({
          isImgBoxShow: false,
          isRecordBoxShow: true
        })
      }
    },
    initRecorderManager() {
      recorderManager = wx.getRecorderManager()
      recorderManager.onStart(() => {
        console.log('开始录音')
        this.setData({ isRecording: true, recordAction: 'fa-stop' })
        this.setRecordTime()
      })
      recorderManager.onStop( res => {
        console.log('停止录音')
        this.setData({
          isRecording: false,
          recordSrc: res.tempFilePath,
          recordSecond: this.data.tempSecond,
          recordAction: 'fa-play'
        })
        this.clearRecordTime()
      })
    },
    initInnerAudioContext() {
      //创建
      innerAudioContext = wx.createInnerAudioContext()
      innerAudioContext.src = this.data.src
      innerAudioContext.onPlay((res) => {
        console.log('开始播放录音')
        this.setData({ isPlaying: true, recordAction: 'fa-stop', tempSecond: 0 })
      })
      innerAudioContext.onTimeUpdate(() => {
        this.setData({ tempSecond: parseInt(innerAudioContext.currentTime) })
      })
      innerAudioContext.onSeeking((res) => {
        //console.log('seeking...')
      })
      innerAudioContext.onPause((res) => {
        this.setData({ isPlaying: false, recordAction: 'fa-play', tempSecond: this.data.recordSecond })
      })
      innerAudioContext.onStop((res) => {
        console.log('暂停播放录音')
        this.setData({ isPlaying: false, recordAction: 'fa-play', tempSecond: this.data.recordSecond })
      })
      innerAudioContext.onEnded((res) => {
        this.setData({
          isPlaying: false,
          recordAction: 'fa-play',
          tempSecond: this.data.recordSecond
        })
      })
    },
    startRecording() {
      console.log('click')
      var src = this.data.recordSrc
      var isRecording = this.data.isRecording
      var isPlaying = this.data.isPlaying
      if (src == '') {
        //record
        if (isRecording) {
          //stop
          recorderManager.stop()
        } else {
          //start
          recorderManager.start(recordOptions)
        }
      } else {
        //play
        if (isPlaying) {
          console.log('暂停')
          innerAudioContext.pause()
          innerAudioContext.stop()
        } else {
          innerAudioContext.src = src
          innerAudioContext.play()
        }
      }
    },
    removeRecord() {
      var isRecording = this.data.isRecording
      var isPlaying = this.data.isPlaying
      if (this.data.recordSrc != '') {
        wx.showModal({
          title: '提示',
          content: '确定要删除语音吗？',
          success: sm => {
            if (sm.confirm) {
              // 用户点击了确定 可以调用删除方法了
              if (isRecording) {
                recorderManager.stop()
              }
              if (isPlaying) {
                innerAudioContext.pause()
                innerAudioContext.stop()
              }
              this.setData({
                isRecording: false,
                isPlaying: false,
                recordSrc: '',
                recordAction: 'fa-microphone',
                tempSecond: 0,
                recordSecond: 0
              })
            } else if (sm.cancel) {
              
            }
          }
        })
      }
    },
    /**
     * 发送录音
     */
    saveRecord() {

      if (this.data.isRecording) {
        this.setData({ isRecording: false })
        recorderManager.stop()
      }
      if (this.data.isPlaying) {
        this.setData({ isPlaying: false })
        innerAudioContext.pause()
        innerAudioContext.stop()
      }
      if (this.data.recordSrc == '') {
        wx.showToast({
          title: '暂无录音',
          icon: 'none',
          duration: 1500
        })
        return
      }
      this.triggerEvent("sendRecord", {
        src: this.data.recordSrc,
        duration: this.data.recordSecond
      })
    },
    setRecordTime() {
      recordInterval = setInterval(() => {
        var t = this.data.tempSecond
        this.setData({
          tempSecond: t+1
        })
      }, 1000)
    },
    clearRecordTime() {
      clearInterval(recordInterval)
    },
    restore() {
      clearInterval(recordInterval)
      recorderManager.stop()
      innerAudioContext.pause()
      innerAudioContext.stop()
      this.setData({
        isRecording: false,
        isPlaying: false,
        recordAction: 'fa-microphone',
        tempSecond: 0,
        recordSecond: 0,
        imgBox: [],
        recordSrc: '',
        text: ''
      })
    }
  }
})
