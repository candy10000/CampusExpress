
// pages/square/fabushiyan/fabushiyan.js
var app = getApp();
var record_time;//定时器
var is_speaking = false;//用户是否正在播放录音
var innerAudioContext;
var img_vdo_count = 0;//已有图片和视频总数
var photoLength = 0;
Component({
  options: {
    addGlobalClass: true,
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
    textMsg:'',
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
    compressPath: '',
    sendingHidden: true,
    textHeight: 0,
    textButton: false
  },
  lifetimes: {
    attached() {
      img_vdo_count = 0
      is_speaking = false;//用户是否正在播放录音
      innerAudioContext;
      img_vdo_count = 0;//已有图片和视频总数
      wx.setKeepScreenOn({
        keepScreenOn: true
      })
    },
    moved() {
    },
    detached() {
    },
  },
  pageLifetimes: {
    show() {
    },
    hide() {
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    submit: function (e) {
      var that = this;
      var fileArr = this.data.imageArray.concat(this.data.recordArray)
      //fileArr = fileArr.concat(this.data.viedoArray);
      var mark = 0;
      // 多个文件上传的，和cardId同一组的还没写。
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;
      //that.data.cardId = String(parseInt(Math.random() * 100000) + parseInt(timestamp));
      var cardId = String(parseInt(Math.random() * 100000) + parseInt(timestamp)) + that.data.cardId;
      that.setData({
        cardId: cardId,
        sendingHidden: false,
      })
      // var cardId = "1112222333";
      // var allUrl = "";
      that.data.reallength = fileArr.length;
      console.log("文件传输开始");
      console.log(fileArr);
      if (fileArr.length > 0) {
        for (var i = 0; i < fileArr.length; i++) {
          console.log(fileArr);
          that.uploadMyFile(1, parseInt(i), fileArr);
        }
        // if(that.data.imageArray.length > 0){
        //   that.data.imageArray.forEach((item, i) => {
        //     //上传图片到安全接口
        //     that.validateImage(item);
        //   })
        // }
      }else {
        console.log('无文件，直接发布文字信息');
        that.replaceText().then((rs) => {
          that.setData({
            textHeight: rs.height * 2,
            textButton: true
          })
        });
        wx.request({
          url: app.globalData.url + "/card/publish",
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded" 
          },
          data: {
            cardId: that.data.cardId,
            openId: app.getOpenid(app.globalData.url),
            textMsg: that.data.textMsg,
            topic: "222",
            allUrl: that.data.allUrl,
            compressPath: that.data.compressPath,
          },
          success: res => {
            console.log(res)
            if (res.statusCode == 200) {
              wx.showModal({
                title: '发布成功',
                content: '发布成功',
                showCancel: false,
                success(res) {
                  console.log(res.data);
                  wx.navigateBack({})
                }
              })
              that.setData({
                sendingHidden: true,
              })
              app.globalData.temp.fackerSY = that.data.cardId
            } else {
              wx.showModal({
                title: '发布失败',
                content: '发布失败',
                showCancel: false,
                success(res) {
                  console.log(res.data)
                }
              })
            }
          }
        })
      }
      // var timer = setInterval(function () {
      //   console.log("循环定时器等待循环请求结束")
      //   // wx.request({
      //   // url: app.globalData.url + "/card/getfile",
      //   // data:{
      //   // length: that.data.curLength,
      //   // openId: app.getOpenid(app.globalData.url),
      //   // cardId: that.data.cardId
      //   // },success:function(res){
      //   // if(res.data=="ERROR"){
      //   // console.log("ERROR");
      //   // }else{
      //   // console.log("SUCCESS");
      //   // clearInterval(timer);
      //   console.log(that.data.curLength);
      //   console.log(that.data.reallength);
      //   //     }
      //   //   }
      //   // })
      // }, 1000)
    },
    // validateImage(item){
    //   var that = this;
    //   console.log(item, "item");
    //   var src = item.src;
    //   wx.uploadFile({
    //     url: app.globalData.url + '/wx/picDetect',
    //     filePath: src,
    //     name: 'media',
    //     success(res){
    //       console.log(res.data, "安全接口返回");
    //     }
    //   })
    // },
    uploadMyFile: function (sw, i, datae) {
      var that = this;
      console.log(i);
      // var dataArray = [];
      console.log("date");
      console.log(datae);
      console.log(sw);
      if (sw == 1) {
        console.log("1111");
        console.log(datae[i].src, "src");
        // dataArray = dataArray.concat(that.data.imageArray);

        //用view替换textarea
        that.replaceText().then((rs) => {
          that.setData({
            textHeight: rs.height * 2,
            textButton: true
          })
        });
        var uploadTask1 = wx.uploadFile({
          url: app.globalData.url + "/card/upload", // 仅为示例，非真实的接口地址
          filePath: datae[i].src,
          name: 'file',
          header: {
            "Content-Type": "multipart/form-data" 
          },
          formData: {
            length: that.data.reallength,
            cardId: that.data.cardId,
            openId: app.getOpenid(app.globalData.url),
          },
          success(res) {
            console.log(res.data, "upload返回值");
            //返回的是Map类型需要解析
            const data = JSON.parse(res.data);
            var allUrl = '' +  data.compressPath + data.path;
            var compressPath = data.compressPath;
            console.log(data.path, "path");
            console.log(allUrl, "allURL");
            console.log(res,"图片上传");
            // var tmp = that.data.allUrl + res.data;
            console.log("临时URl");
            that.data.allUrl += allUrl;
            that.data.compressPath += compressPath;
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
          },complete :res =>{
            // that.data.reallength
            if(that.data.curLength == that.data.reallength){
              console.log(that.data.allUrl, "allUrl");
              console.log(that.data.compressPath, "compressPath");
                wx.request({
                  url: app.globalData.url + "/card/publish",
                  method: 'POST',
                  header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  },
                  data: {
                    cardId: that.data.cardId,
                    openId: app.getOpenid(app.globalData.url),
                    textMsg: this.data.textMsg,
                    topic: "222",
                    allUrl: that.data.allUrl,
                    compressPath: that.data.compressPath
                  },
                  success: res => {
                    wx.showModal({
                      title: '发布成功',
                      content: '发布成功',
                      showCancel: false,
                      success(res) {
                        console.log(res.data);
                        wx.navigateBack({})
                      }
                    })
                    that.setData({
                      sendingHidden: true,
                    })
                    app.globalData.temp.fackerSY = that.data.cardId
                  }
                })
            }
          }
        })
      }
      // console.log(dataArray);
    },
    replaceText(){
      return new Promise((resolve, reject) => {
        this.createSelectorQuery().select(".edit").boundingClientRect().exec((res) => {
          console.log(res, "获取的节点信息");
          resolve({width: res[0].width, height: res[0].height});
        })
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

      this.setData({
        textMsg: e.detail.value
      })
      // textMsg = e.detail.value;
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
              //创立下标数组避免下标重复
              var arr = that.getImgIdx(that.data.imageArray);
              console.log(arr);
              wx.chooseImage({
                //添加多张图片
                count: 4 - photoLength,
                sizeType: ['original'],
                sourceType: ['album'],
                success(res) {
                  // tempFilePath可以作为img标签的src属性显示图片
                  console.log(res);
                  const tempFiles = res.tempFiles;
                  const tempFilePaths = res.tempFilePaths;
                  const picType = res.tempFilePaths[0].substring(res.tempFilePaths[0].length - 3);
                  const tempLength = res.tempFilePaths.length;
                  console.log(tempFilePaths);
                  const length = that.data.imageArray.length;
                  console.log(res.tempFiles[0].size, "size");
                  console.log(picType,"type");
                  console.log(tempFiles,"tempFiles");
                  //判断每个图片的大小

                  for(let idx = 0; idx < tempLength; idx++){
                      that.compressPic({res: tempFiles[idx]}).then(path => {
                        // temp.push(path);
                        tempFilePaths[idx] = path;
                        that.data.imageArray = that.data.imageArray.concat([{ id: arr[idx], unique: 'unique_' + arr[idx], src: tempFilePaths[idx] }]);
                        that.setData({
                          imageArray: that.data.imageArray
                        });
                        console.log(that.data.imageArray);
                        // console.log(temp);
                        // return temp;
                      },path => {
                        // temp.push(path);
                        that.data.imageArray = that.data.imageArray.concat([{ id: arr[idx], unique: 'unique_' + arr[idx], src: tempFilePaths[idx] }]);
                        that.setData({
                          imageArray: that.data.imageArray
                        });
                        console.log(that.data.imageArray);
                        // console.log(path);

                        // return temp;
                      })

                    // }else{
                      // that.data.imageArray = that.data.imageArray.concat([{ id: idx, unique: 'unique_' + idx, src: tempFilePaths[idx] }]);
                      // that.setData({
                      //   imageArray: that.data.imageArray
                      // });
                      // console.log("else");
                    // }

                  }

                      // tempFilePath可以作为img标签的src属性显示图片
                      console.log(tempFilePaths);
                      // for (let i = 0; i < tempLength; i++) {
                      //   that.data.imageArray = that.data.imageArray.concat([{ id: i, unique: 'unique_' + i, src: tempFilePaths[i] }])
                      // }
                      // that.setData({
                      //   imageArray: that.data.imageArray
                      // })
                      console.log(that.data.imageArray);

                      img_vdo_count += tempLength;



                  //压缩图片

                  // // tempFilePath可以作为img标签的src属性显示图片
                  // console.log(tempFilePaths);
                  // for(let i = 0; i < tempLength; i++){
                  //   that.data.imageArray = that.data.imageArray.concat([{ id: i, unique: 'unique_' + i, src: tempFilePaths[i] }])
                  // }
                  // console.log(that.data.imageArray);
                  // that.setData({
                  //   imageArray: that.data.imageArray
                  // });
                  // img_vdo_count += tempLength;

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
              //创立下标数组避免下标重复
              var arr = that.getImgIdx(that.data.imageArray);
              console.log(arr);
              wx.chooseImage({
                count: 1,
                sizeType: ['original'],
                sourceType: ['camera'],
                success(res) {
                  const tempFiles = res.tempFiles;
                  const length = that.data.imageArray.length;
                  // tempFilePath可以作为img标签的src属性显示图片
                  const tempFilePaths = res.tempFilePaths;
                  console.log(tempFilePaths, "tempFilePaths_photo");
                  console.log(tempFiles[0].size, "size");
                  for (let idx in tempFiles) {

                    that.compressPic({ res: tempFiles[idx] }).then(path => {
                      // temp.push(path);
                      tempFilePaths[idx] = path;
                      that.data.imageArray = that.data.imageArray.concat([{ id: arr[idx], unique: 'unique_' + arr[idx], src: tempFilePaths[idx] }]);
                      that.setData({
                        imageArray: that.data.imageArray
                      });
                      console.log(that.data.imageArray, "photo压缩");
                      // console.log(temp);
                      // return temp;
                    }, path => {
                      // temp.push(path);
                      that.data.imageArray = that.data.imageArray.concat([{ id: arr[idx], unique: 'unique_' + arr[idx], src: tempFilePaths[idx] }]);
                      that.setData({
                        imageArray: that.data.imageArray
                      });
                      console.log(that.data.imageArray, "photo不压缩");
                    })


                    // //大于500kb进行压缩
                    // if (tempFiles[idx].size > 500000) {
                    //   //分情况进行不同级别的压缩
                    //   wx.compressImage({
                    //     src: tempFiles[idx].path, // 图片路径
                    //     quality: 50, // 压缩质量
                    //     success(res) {
                    //       // tempFilePath可以作为img标签的src属性显示图片
                    //       tempFilePaths[idx] = res.tempFilePath;
                    //       console.log(tempFilePaths[idx]);
                    //       that.data.imageArray = that.data.imageArray.concat([{ id: idx, unique: 'unique_' + idx, src: tempFilePaths[idx] }]);
                    //       that.setData({
                    //         imageArray: that.data.imageArray
                    //       });
                    //     }
                    //   })
                    // } else {
                    //   that.data.imageArray = that.data.imageArray.concat([{ id: idx, unique: 'unique_' + idx, src: tempFilePaths[idx] }]);
                    //   that.setData({
                    //     imageArray: that.data.imageArray
                    //   });
                    // }
                  }

                  // that.data.imageArray = that.data.imageArray.concat([{ id: length, unique: 'unique_' + length, src: tempFilePaths[0] }])
                  // console.log(that.data.imageArray);
                  // that.setData({
                  //   imageArray: that.data.imageArray
                  // });
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
    //压缩图片改进
    compressPic(picInfo){
      return new Promise((resolve, reject) => {
        // for(let i in picInfo.res){
          if (picInfo.res.size > 3000000 && picInfo.res.size <= 6000000) {
            wx.compressImage({
              src: picInfo.res.path, // 图片路径
              quality: 90, // 压缩质量
              success(res) {
                console.log(res.tempFilePath, "tempFilePath_1");
                resolve(res.tempFilePath);
              },fail(msg){
                console.log(msg,"error");
              }
            })
          }else if(picInfo.res.size > 600000){
            wx.compressImage({
              src: picInfo.res.path, // 图片路径
              quality: 70, // 压缩质量
              success(res) {
                console.log(res.tempFilePath, "tempFilePath_2");
                resolve(res.tempFilePath);
              }, fail(msg) {
                console.log(msg, "error");
              }
            })
          }else {
            console.log("不压缩");
            reject(picInfo.res.path);
          }
        // }



      })
    },
    //获取imgarr下标
    getImgIdx(imgs){
      var that = this;
      var arr = [0, 1, 2, 3];
      var newArr = [];
      var arr1 = [];
      if(imgs.length != 0){
        arr1 = imgs.map(v => {
          return v.id
        });
        console.log(arr1, "arr1");
        newArr = that.getArrDifference(arr1, arr);
      }else{
        newArr = arr1.concat(arr);
      }
      return newArr;

    },
    //返回两个数组的不同值组成一个新数组
    getArrDifference(arr1, arr2) {
      return arr1.concat(arr2).filter(function (v, i, arr) {
        return arr.indexOf(v) === arr.lastIndexOf(v);
    });
  },

    //压缩图片
    // compressPic(picInfo){
    //   var tempPath = '';
    //   this.setData({
    //     cw: 120,
    //     ch: 120
    //   })
    //   var ctx = wx.createCanvasContext("picCanvas");
    //   ctx.clearRect(0, 0, 120, 120);
    //   ctx.drawImage(picInfo.tempPath, 0, 0, 120, 120);
    //   ctx.draw(false, () => {
    //     wx.canvasToTempFilePath({
    //       canvasId: 'picCanvas',
    //       fileType: picInfo.picType,
    //       quality: picInfo.picType,
    //       success(res){
    //         tempPath = res.tempFilePath;
    //         console.log(tempPath);
    //         return tempPath;
    //       }
    //     }, this)
    //   });


    // },
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
        });
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