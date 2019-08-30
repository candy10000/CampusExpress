
// pages/square/fabushiyan/fabushiyan.js
var app = getApp();
var record_time;//定时器
var is_speaking = false;//用户是否正在播放录音
var innerAudioContext;
var img_vdo_count = 0;//已有图片和视频总数
var textMsg = "";
var photoLength = 0;
Component({
  options: {
    addGlobalClass: true
  },
  /**
   * 页面的初始数据
   */
  data: {
    imageArray: [
      // {
      //   id:0,
      //   src:"https://xcx.gaoxiao114.cn/images/pic/jerry.jpg",
      //   unique:"unique_0"
      // }
    ],
    color: { col: "#3f51b5" },
    tapCount: 0,
    recordArray: [
    ],
    viedoArray: [
    ],

    isRecord: false,
    recording: false,
    show_stop_item: true,
    record_time: 6,
    loadBytes: 0,
    needBytes: 0,
    is_speak: false,//是否有以保存到recordArray的数据
    record_show: "none",//显示录音按钮区
    record_time: 0,//录音时间
    record_action: "fa-microphone",//录音的按钮变化样式
    show_voiceArea: "none",//在编辑栏中是否要实现录音框
    reallength: 0,
    curLength: 0,
    curBackLength: 0,
    cardId: '',
    allUrl: '',

    sendingHidden: true,
  },
  lifetimes: {

    attached() {
      img_vdo_count = 0
      is_speaking = false;//用户是否正在播放录音
      innerAudioContext;
      img_vdo_count = 0;//已有图片和视频总数
      textMsg = "";
      wx.setKeepScreenOn({
        keepScreenOn: true
      })

      //console.log("发布拾言attached")
    },
    moved() {
      //console.log("发布拾言moved") 
    },
    detached() {
      //console.log("发布拾言detached")
    },
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show() {
      //console.log("发布拾言show")
    },
    hide() {
      //console.log("发布拾言hide")
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {

    onLoad: function(op) {
      this.data.taskId = op.taskId
    },

    submit: function (e) {
      var that = this;
      //图片+录音+视频
      var fileArr = this.data.imageArray.concat(this.data.recordArray);
      fileArr = fileArr.concat(this.data.viedoArray);
      var mark = 0;
      // 多个文件上传的，和cardId同一组的还没写。
      var cardId = String(parseInt(Math.random() * 100000) + parseInt(Date.parse(new Date())/1000)) + that.data.cardId;
      that.setData({
        cardId: cardId,
        sendingHidden: false,
      })
      // var cardId = "1112222333";
      // var allUrl = "";
      that.data.reallength = fileArr.length;
      console.log("文件传输开始");

      console.log(fileArr);


      if (that.data.imageArray.length > 0) {
        for (var i = 0; i < fileArr.length; i++) {
          console.log(fileArr);
          that.uploadMyFile(1, parseInt(i), fileArr);
        }
      } else {
        that.uploadEnvelop()
      }
    },
    uploadMyFile: function (sw, i, datae) {
      var that = this;
      console.log(i);
      // var dataArray = [];
      console.log("date");
      console.log(datae);
      console.log(sw);
      if (sw == 1) {
        console.log("1111");
        console.log(datae[i].src);
        // dataArray = dataArray.concat(that.data.imageArray);
        var uploadTask1 = wx.uploadFile({
          url: app.globalData.url + "/envelope/upload", // 仅为示例，非真实的接口地址
          filePath: datae[i].src,
          name: 'file',
          header: {
            "Content-Type": "multipart/form-data"
          },
          formData: {
            taskId: that.data.taskId
          },
          success(res) {
            const data = res.data

            console.log(res, "图片上传");
            // var tmp = that.data.allUrl + res.data;
            console.log("临时URl");
            that.data.allUrl += res.data;

            // that.data.curLength = that.data.curLength + 1;

            that.setData({
              curLength: that.data.curLength + 1
            })
            console.log(that.data.allUrl);


            // console.log(tmp);
            // that.setData({
            //   allUrl: tmp
            // })
            // do something
          }, complete: res => {
            // that.data.reallength
            if (that.data.curLength == that.data.reallength) {
              that.uploadEnvelop()

            }
          }
        })
      }
      // console.log(dataArray);
    },
    uploadEnvelop() {
      var that = this
      wx.request({
        url: app.globalData.url + "/envelope/publish/" + that.data.taskId,
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          openId: app.getOpenid(app.globalData.url),
          textMsg: textMsg,
          allUrl: that.data.allUrl
        },
        success: res => {
          console.log(res.data)
          if (res.data.result == 'SUCCESS') {
            wx.showModal({
              title: '发布成功',
              content: '发布成功',
              showCancel: false,
              success(res) {
                console.log(res.data);
                wx.navigateBack({})
              }
            })
          } else {
            wx.showModal({
              title: '发布失败',
              content: '发布失败',
              showCancel: false,
              success(res) {
                console.log(res.data);
                wx.navigateBack({})
              }
            })
          }
        },
        fail: () => {
          wx.showModal({
            title: '发布失败',
            content: '请重试！！',
            showCancel: false,
            success(res) {
              console.log(res.data);
              wx.navigateBack({})
            }
          })
        },
        complete: () => {

          that.setData({
            sendingHidden: true,
          })
        }
      })
    },
    playvoice: function (e) {
      var that = this;
      if (!is_speaking) {
        console.log(that.data.recordArray);
        innerAudioContext = wx.createInnerAudioContext()
        innerAudioContext.autoplay = true
        innerAudioContext.src = that.data.recordArray[0].src
        var item_time = that.data.record_time;
        innerAudioContext.onPlay(() => {
          is_speaking = true;
          that.setData({
            record_time: 0,
            record_action: "fa-stop",
          });
          that.set_record_time();
          console.log('开始播放')
        })
        innerAudioContext.onError((res) => {
          console.log(res.errMsg)
          console.log(res.errCode)
        })
        innerAudioContext.onEnded((res) => {
          console.log('自然结束播放')
          clearInterval(record_time);
          that.setData({
            record_action: "fa-play",
          });
          is_speaking = false;
        })
        innerAudioContext.onStop((res) => {
          console.log('结束播放');
          clearInterval(record_time);
          that.setData({
            record_action: "fa-play",
            record_time: item_time
          });
          is_speaking = false;
        })
      } else {
        console.log("已在播放，不能再点击")
      }
    },
    isrecord: function (e) {
      this.setData({
        isRecord: true
      })
    },
    cancelRecord: function () {
      this.setData({
        isRecord: false,
        recording: false,
        show_stop_item: true,
        tapCount: 0,
      })
    },
    record: function (e) {
      var that = this;
      const recorderManager = wx.getRecorderManager()
      that.data.tapCount = that.data.tapCount + 1;
      console.log(that.data.tapCount);
      recorderManager.onStart(() => {
        // wx.showModal({
        //   title: '注意',
        //   content: '由于系统限制，录音最多持续10分钟，重新按录音按钮结束录音',
        // })
        console.log('recorder start')
        that.data.color.col = "#FF3030";
        that.setData({
          color: that.data.color,
          record_action: "fa-stop",
          record_time: 0,
        })
        that.set_record_time();
      })
      recorderManager.onPause(() => {
        console.log('recorder pause');
        that.setData({
          record_action: "fa-play",
        })
      })
      recorderManager.onStop((res) => {
        console.log('recorder stop', res)
        that.data.color.col = "#3f51b5";
        var cardId = that.data.cardId + "_duration_" + res.duration
        that.data.recordArray = that.data.recordArray.concat([{ src: res.tempFilePath }])
        clearInterval(record_time);
        that.setData({
          record_action: "fa-play",
          color: that.data.color,
          recordArray: that.data.recordArray,
          is_speak: true,
          tapCount: 0,
          cardId: cardId,
        })
        console.log(that.data.cardId, "设置的cardId")
        const { tempFilePath } = res
      })
      recorderManager.onFrameRecorded((res) => {
        const { frameBuffer } = res
        console.log('frameBuffer.byteLength', frameBuffer.byteLength)
      })
      const options = {
        duration: 600000,
        sampleRate: 44100,
        numberOfChannels: 1,
        encodeBitRate: 192000,
        format: 'mp3',
        frameSize: 50
      }
      if (that.data.tapCount % 2 == 0)
        recorderManager.stop();
      else
        recorderManager.start(options);
    },
    getMsg: function (e) {
      textMsg = e.detail.value;
    },
    choosePhoto(e) {
      console.log(img_vdo_count, "选择的数量")
      var that = this;
      if (img_vdo_count < 4) {
        photoLength = img_vdo_count;
        wx.showActionSheet({
          itemList: ['图片', '视频'],
          success(res) {
            if (res.tapIndex == 0) {
              wx.chooseImage({
                //添加多张图片
                count: 4 - photoLength,
                sizeType: ['original', 'compressed'],
                sourceType: ['album'],
                success(res) {
                  // tempFilePath可以作为img标签的src属性显示图片
                  const tempFilePaths = res.tempFilePaths
                  const tempLength = res.tempFilePaths.length;
                  console.log(tempFilePaths);
                  const length = that.data.imageArray.length
                  // tempFilePath可以作为img标签的src属性显示图片
                  console.log(tempFilePaths);
                  for (let i = 0; i < tempLength; i++) {
                    that.data.imageArray = that.data.imageArray.concat([{ id: i, unique: 'unique_' + i, src: tempFilePaths[i] }])
                  }
                  console.log(that.data.imageArray);
                  that.setData({
                    imageArray: that.data.imageArray
                  });
                  img_vdo_count += tempLength;
                }
              })
            } else {

              wx.showModal({
                title: '提示',
                content: '暂时不能发布录像啦，敬请期待~',
                success(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })

              // wx.chooseVideo({
              //   sourceType: ['album'],
              //   maxDuration: 60,
              //   camera: 'back',
              //   success(res) {
              //     console.log("chooseviedo");
              //     console.log(res);
              //     const length = that.data.viedoArray.length
              //     that.data.viedoArray = that.data.viedoArray.concat([{ id: length, unique: 'v_unique_' + length, src: res.tempFilePath }])
              //     console.log(that.data.viedoArray);
              //     that.setData({
              //       viedoArray: that.data.viedoArray
              //     });
              //     img_vdo_count += 1;
              //   }
              // })
            }
          }
        })
      }
    },
    takePhoto(e) {
      var that = this;
      console.log(img_vdo_count, "选择的数量")
      if (img_vdo_count < 4) {
        wx.showActionSheet({
          itemList: ['拍照', '录像'],
          success(res) {
            if (res.tapIndex == 0) {
              wx.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'],
                sourceType: ['camera'],
                success(res) {
                  const length = that.data.imageArray.length
                  // tempFilePath可以作为img标签的src属性显示图片
                  const tempFilePaths = res.tempFilePaths;
                  console.log(tempFilePaths);
                  that.data.imageArray = that.data.imageArray.concat([{ id: length, unique: 'unique_' + length, src: tempFilePaths[0] }])
                  console.log(that.data.imageArray);
                  that.setData({
                    imageArray: that.data.imageArray
                  });
                  img_vdo_count += 1;
                }
              })
            } else {

              //由于微信小程序政策，涉及视频上传需要提供文网文许可证，保险起见暂时删除视频相关功能。     
              wx.showModal({
                title: '提示',
                content: '暂时不能发布视频啦，敬请期待~',
                success(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
              // wx.chooseVideo({
              //   sourceType: ['camera'],
              //   maxDuration: 60,
              //   camera: 'back',
              //   success(res) {
              //     console.log("viedo");
              //     console.log(res.tempFilePath);
              //     const length = that.data.viedoArray.length
              //     that.data.viedoArray = that.data.viedoArray.concat([{ id: length, unique: 'v_unique_' + length, src: res.tempFilePath }])
              //     console.log(that.data.viedoArray);
              //     that.setData({
              //       viedoArray: that.data.viedoArray
              //     });
              //     img_vdo_count += 1;
              //   }
              // })
            }
            console.log(res.tapIndex)
          },
          fail(res) {
            console.log(res.errMsg)
          }
        })
      }
    },
    //显示录音按钮区
    record_show() {
      this.setData({
        record_show: "flex",
        isRecord: true,
      })
    },
    //录音时间变化
    set_record_time() {
      record_time = setInterval(() => {
        var time = this.data.record_time + 1;
        this.setData({
          record_time: time,
        });
      }, 1000);
    },
    //取消删除录音
    clear_record() {
      var that = this;
      console.log(that.data.tapCount);
      if (is_speaking) {
        innerAudioContext.stop();
      } else if (that.data.tapCount == 0 && that.data.recordArray.length == 0) {
        that.setData({
          record_show: "none",
          isRecord: false,
        });
        return;
      } else if (!that.data.is_speak) {
        that.record();
      }
      wx.showModal({
        title: '提示',
        content: '确定要删除语音吗？',
        success: function (sm) {
          if (sm.confirm) {
            // 用户点击了确定 可以调用删除方法了
            setTimeout(() => {
              that.setData({
                record_time: 0,
                is_speak: false,
                record_show: "none",
                record_action: "fa-microphone",
                isRecord: false,
                recordArray: [],
                show_voiceArea: "none",
              })
            }, 500)
          } else if (sm.cancel) {
          }
        }
      })
    },
    //确定要保存录音
    save_record() {
      var that = this;
      if (is_speaking) {
        innerAudioContext.stop();
      } else if (that.data.tapCount == 0 && that.data.recordArray.length == 0) {
        that.setData({
          record_show: "none",
          isRecord: false,
        });
        return;
      } else if (!that.data.is_speak) {
        that.record();
      }
      setTimeout(() => {
        that.setData({
          is_speak: true,
          record_show: "none",
          isRecord: false,
          show_voiceArea: "inline-block",
        })
      }, 500)
    },
    //删除图片和视频
    remove_img_vdo(e) {
      var that = this;
      var type = e.currentTarget.dataset.type;
      var index = parseInt(e.currentTarget.dataset.index);
      if (type == "img") {
        console.log("img" + index);
        wx.showModal({
          title: '提示',
          content: '确定要删除该图片？',
          success: function (sm) {
            if (sm.confirm) {
              // 用户点击了确定 可以调用删除方法了
              that.data.imageArray.splice(index, 1)
              that.setData({
                imageArray: that.data.imageArray
              });
              img_vdo_count -= 1;
            }
          }
        })
        console.log(that.data.imageArray);
      } else if (type = "vdo") {
        console.log("vdo" + index);
        wx.showModal({
          title: '提示',
          content: '确定要删除该视频？',
          success: function (sm) {
            if (sm.confirm) {
              // 用户点击了确定 可以调用删除方法了
              that.data.viedoArray.splice(index, 1)
              that.setData({
                viedoArray: that.data.viedoArray
              });
              img_vdo_count -= 1;
            }
          }
        });
        console.log(that.data.viedoArray);
      }
    }
  }
})