
var app = getApp();
// var openId = app.getOpenid();
var openId = "";
var is_speaking = false;
var record_time;
var innerAudioContext = wx.createInnerAudioContext();
var startY, endY;
var clickDisabled = true//点赞能否进行

Page({
  /** 
   * 页面的初始数据 
   */
  data: {
    weburl: "https://xcx.gaoxiao114.cn:8888",
    record_action: "none",//录音的按钮变化样式
    havelike: [],//是否点赞
    openId: ""
  },
  /** 
   * 生命周期函数--监听页面加载 
   */
  onLoad: function (options) {
    openId = options.openId;
    console.log(openId);
    this.setData({
      openId: openId
    })
    console.log(this.data.openId);
    this.getCardsInfo();
  },
  /** 
   * 生命周期函数--监听页面初次渲染完成 
   */
  onReady: function () {
  },
  /** 
   * 生命周期函数--监听页面显示 
   */
  onShow: function () {
    // this.setData({
    //   havelike: [],
    // })
      this.getCardsInfo();



  },
  /** 
   * 生命周期函数--监听页面隐藏 
   */
  onHide: function () {
    innerAudioContext.stop();
  },
  /** 
   * 生命周期函数--监听页面卸载 
   */
  onUnload: function () {
    innerAudioContext.stop();
  },
  /** 
   * 页面相关事件处理函数--监听用户下拉动作 
   */
  onPullDownRefresh: function () {
  },
  /** 
   * 页面上拉触底事件的处理函数 
   */
  onReachBottom: function () {
  },
  /** 
   * 用户点击右上角分享 
   */
  onShareAppMessage: function () {
  },
  getCardsInfo() {
    var that = this;
    wx.request({
      url: app.globalData.url + "/card/mycard",
      method: "GET",
      data: {
        hisOpenId: openId,
        myOpenId: app.getOpenid()
      },
      //这里还要传pages 
      success: function (res) {
        console.log("ta的拾言内容");
        console.log(res.data);
        if (res.data.length > 0) {
          for (let item of res.data) {
            //语音时间设置
            if (item.audioInfo.length > 0) {
              var recordSrc = item.cardInfo.cardId;
              //console.log(recordSrc.split("durationTime="),  "字符分割");
              var recordTime = 0;
              if (recordSrc.split("_duration_").length > 1) {
                recordTime = recordSrc.split("_duration_")[1];
              }
              recordTime = parseInt(recordTime / 1000);
              item.record_time = recordTime;
            }
            //用户头像路径设置
            if (item.customerInfo.userPic.split("/var/www/html").length > 1) {
              item.customerInfo.userPic = item.customerInfo.userPic.split("/var/www/html")[1];
            }
            //发布的视频封面路径设置

            if (item.videoInfo.length > 0) {
              for (var index in item.videoInfo) {
                if (item.videoInfo[index].picPath != "") {
                  var picMsg = item.videoInfo[index].picPath;
                  item.videoInfo[index].picPath = that.data.weburl + picMsg.substring(13, picMsg.length);
                }
                //发布的视频路径设置
                if (item.videoInfo[index].realPath != "") {
                  var vdoMsg = item.videoInfo[index].realPath;
                  item.videoInfo[index].realPath = that.data.weburl + vdoMsg.substring(13, vdoMsg.length);
                }
              }
            }
            //发布的图片路径设置(分为缩略图和原图数组)
            if (item.pictureInfo.length > 0) {
              let j = 0, k = 0;
              //缩略图
              let pictureInfo = [];
              //原图
              let pictureInfo2 = [];
              for (let i in item.pictureInfo) {
                //偶数为缩略图,奇数为原图
                if (i % 2 == 0) {
                  var picMsg = item.pictureInfo[i];
                  pictureInfo[j] = that.data.weburl + picMsg.substring(13);
                  j++;
                } else {
                  var picMsg2 = item.pictureInfo[i];
                  pictureInfo2[k] = that.data.weburl + picMsg2.substring(13);
                  k++;
                }
              }
              item.pictureInfo.length = 0;
              item.pictureInfo = item.pictureInfo.concat(pictureInfo);
              item.pictureInfo2 = pictureInfo2;
            }
            // //发布图片路径设置
            // if (item.pictureInfo.length > 0) {
            //   for (var index in item.pictureInfo) {
            //     if (item.pictureInfo[index] != "") {
            //       var picMsg = item.pictureInfo[index];
            //       item.pictureInfo[index] = app.globalData.urlb + picMsg.substring(13, picMsg.length);
            //     }
            //   }
            // }


            //得到用户是否点赞
            // if (item.cardInfo.cardId != "") {
            //   // console.log(app.getOpenid(), "用户的openid");
            //   wx.request({
            //     url: app.globalData.url + '/card/havelike',
            //     data: {
            //       cardId: item.cardInfo.cardId,
            //       openId: app.getOpenid()
            //     },
            //     success: function (res) {
            //       console.log(res);
            //       if ("SUCCESS" == res.data) {
            //         var havelike = that.data.havelike;
            //         havelike.push(true);
            //         that.setData({
            //           havelike: havelike,
            //         })//有点赞
            //       } else if ("ERROR" == res.data) {
            //         var havelike = that.data.havelike;
            //         havelike.push(false);
            //         that.setData({
            //           havelike: havelike,
            //         })//没有点赞
            //       }
            //     }
            //   })
            // }


          }
        }
        that.setData({
          json: res.data,
        })
        that.showImg();
      },
      fail: function (res) {
        console.log('获取我的拾言内容失败');
      },
    })
  },
  // fabushiyan(e) {
  //   wx.navigateTo({
  //     url: '/pages/square/fabushiyan/fabushiyan',
  //   })
  // },
  comment(e) {
    var cardId = e.currentTarget.dataset.id;
    var liked = e.currentTarget.dataset.liked;
    wx.navigateTo({
      url: '/pages/square/comment/comment?cardId=' + cardId + '&liked=' + liked,
    })
  },
  share(e) {
    var cardId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/square/share/share?cardId=' + cardId,
    })
  },
  playVideo(e) {
    innerAudioContext.stop();
    var paly_id = e.currentTarget.dataset.id;
    this.setData({
      play_id: paly_id,
    });
  },
  cover_video() {
    if (this.data.paly_id != "") {
      this.setData({
        play_id: "",
      });
    }
  },

  //滑动屏幕时关闭视频
  touchStart: function (e) {
    //console.log(e.touches,"pinmuyidong")
    startY = e.touches[0].clientY; // 获取触摸时的原点
  },
  touchMove: function (e) {
    //console.log(e.touches, "pinmu")
    endY = e.touches[0].clientY; // 获取触摸时的原点

    if (endY - startY > 150 || startY - endY > 150) {

      this.cover_video();

    }
  },
  //点赞
  addLikeNum(e) {
    var index = e.currentTarget.dataset.id;
    var that = this;
    var cardId = that.data.json[index].cardInfo.cardId;
    if(clickDisabled){
      clickDisabled = false;
      wx.request({
        url: app.globalData.url + "/card/like/{cardid}?cardId=" + cardId + "&openid=" + app.getOpenid(),
        method: 'POST',
        success: function (res) {
          console.log(res.data);
          if (res.data == "点赞成功") {
            that.data.json[index].cardInfo.likesNum += 1;
            that.data.json[index].cardInfo.liked = true;
            // var havelike = that.data.havelike;
            // havelike[index] = true;
            that.setData({
              json: that.data.json,
              // havelike: havelike
            })
          } else {
            that.data.json[index].cardInfo.likesNum -= 1;
            that.data.json[index].cardInfo.liked = false;

            // var havelike = that.data.havelike;
            // havelike[index] = false;
            that.setData({
              json: that.data.json,
              // havelike: havelike
            })
          }
          clickDisabled = true;
        },
        fail: function (res) {
          console.log("点赞失败");
          console.log(res);
        },
        complete: function (res) { },
      })
    }

  },
  addLikeNum2(e) {
    var index = e.currentTarget.dataset.id;
    var that = this;
    var cardId = that.data.json[index].cardInfo.cardId;
    if (!clickDisabled) {
      return;
    }
    if (that.data.json[index].cardInfo.liked) {
      that.data.json[index].cardInfo.likesNum -= 1;
    } else {
      that.data.json[index].cardInfo.likesNum += 1;
    }
    that.data.json[index].cardInfo.liked = !that.data.json[index].cardInfo.liked;
    clickDisabled = false;
    console.log(clickDisabled, "点赞前");
    that.setData({
      json: that.data.json
    })
    wx.request({
      url: app.globalData.url + "/card/like/{cardid}?cardId=" + cardId + "&openid=" + app.getOpenid(),
      method: 'POST',
      success: function (res) {
        if (res.statusCode != 200) {
          console.log("点赞失败,请检查接口或者网络状况", res.statusCode);
        }
        console.log(res.data);
        clickDisabled = true;
        console.log(clickDisabled, "点赞后");
      },
      fail: function (res) {
        console.log("点赞接口无数据返回");
        console.log(res);
      }
    })
  },
  showImg() {
    var that = this;
    for (let i in this.data.json) {
      console.log(this.data.json[i].pictureInfo.length);

      var length = that.data.json[i].pictureInfo.length;
      var picture = that.data.json[i].pictureInfo;
      let mode = '';
      switch (length) {
        case 1:
          mode = 'widthFix';
          // let item = {picInfo: [{ pic: picture[0], imgMode: mode }]};
          // that.data.json2.push(item);
          var temp = [];
          temp.push({ pic: picture[0], imgMode: mode });
          that.data.json[i].pictureInfo.length = 0;
          // that.data.json[i].pictureInfo = temp;
          that.data.json[i].pictureInfo = that.data.json[i].pictureInfo.concat(temp);

          break;
        case 2:
          mode = 'aspectFill';
          var temp = [];
          for (let index in picture) {
            // that.data.json2.push({picinfo: { pic: [picture[index]], imgMode: mode }});
            let item = { pic: picture[index], imgMode: mode };
            temp.push(item);
          }
          // that.data.json2.push({picInfo: temp});
          that.data.json[i].pictureInfo.length = 0;
          that.data.json[i].pictureInfo = that.data.json[i].pictureInfo.concat(temp);
          break;
        case 3:
          var temp = [];
          for (let index in picture) {
            if (index == 0) {
              mode = 'widthFix';
            } else {
              mode = 'aspectFill';
            }
            let item = { pic: picture[index], imgMode: mode };
            temp.push(item);
          }
          // that.data.json2.push({ picInfo: temp });
          that.data.json[i].pictureInfo.length = 0;
          that.data.json[i].pictureInfo = that.data.json[i].pictureInfo.concat(temp);

          break;
        case 4:
          var temp = [];
          mode = 'aspectFill';
          for (let index in picture) {
            let item = { pic: picture[index], imgMode: mode };
            temp.push(item);
          }
          // that.data.json2.push({ picInfo: temp });
          that.data.json[i].pictureInfo.length = 0;
          that.data.json[i].pictureInfo = that.data.json[i].pictureInfo.concat(temp);

          break;
      }
    }
    that.setData({
      json: that.data.json
    })
    console.log(that.data.json);
  },
  previewImg(e) {
    var that = this;
    var cardIndex = e.currentTarget.dataset.cardindex;
    var imgIndex = e.currentTarget.dataset.imgindex;
    console.log(cardIndex, imgIndex, "得到的数据")
    var imgs = that.data.json[cardIndex].pictureInfo2;
    var current = imgs[imgIndex];
    // var newArr = [];
    // for (let item of imgs) {
    //   console.log(item);
    //   newArr = newArr.concat(item.pic);
    // }
    wx.previewImage({
      current,
      urls: imgs,
      success: function (res) {
        console.log(res, "预览图片成功")
      },
      fail: function (res) {
        console.log(res, "预览图片失败")
      },
      complete: function (res) { },
    })
  },
  //删除我的拾言 
  // removeShiYan(e) {
  //   var that = this;
  //   wx.showModal({
  //     title: '提示',
  //     content: '是否要删除本拾言',
  //     showCancel: true,
  //     success: function (res) {
  //       if (res.confirm) {
  //         wx.request({
  //           url: app.globalData.url + '/card/delete/{openId}/{cardId}?cardId=' + e.currentTarget.dataset.id + "&openId=" + openId,
  //           method: 'DELETE',
  //           success: function (res) {
  //             console.log(res.data)
  //             if (res.data == "SUCCESS") {
  //               that.setData({
  //                 havelike: []
  //               })
  //               that.getCardsInfo();
  //             }
  //           },
  //           fail: function (res) {
  //             console.log(res.data)
  //           },
  //           complete: function (res) { },
  //         })
  //       } else {
  //       }
  //     },
  //   })

  // },
  //播放录音
  playvoice: function (e) {
    var that = this;
    that.cover_video();//停止视频
    var index = e.currentTarget.dataset.index;
    if (!is_speaking) {
      var recordSrc = that.data.json[index].audioInfo[0];
      recordSrc = that.data.weburl + recordSrc.substring(13, recordSrc.length);
      //console.log(recordSrc);
      innerAudioContext = wx.createInnerAudioContext();
      //innerAudioContext.autoplay = true
      innerAudioContext.src = recordSrc;
      innerAudioContext.play();
      innerAudioContext.onPlay(() => {
        is_speaking = true;
        that.data.json[index].record_time = 0;
        that.setData({
          record_action: index,
          json: that.data.json
        });
        that.set_record_time(index);
        console.log('开始播放')
      })
      innerAudioContext.onError((res) => {
        console.log(res.errMsg)
        console.log(res.errCode)
        innerAudioContext.destroy();
      })
      innerAudioContext.onEnded((res) => {
        console.log('自然结束播放')
        clearInterval(record_time);
        that.setData({
          record_action: "none",
        });
        is_speaking = false;
        innerAudioContext.destroy();
      })
      innerAudioContext.onStop((res) => {
        console.log('结束播放');
        clearInterval(record_time);
        that.setData({
          record_action: "none",
        });
        is_speaking = false;
        innerAudioContext.destroy();
      })
    } else {
      console.log("已在播放，不能再点击")
    }
  },
  //录音时间变化
  set_record_time(index) {
    var that = this;
    record_time = setInterval(() => {
      that.data.json[index].record_time += 1;
      that.setData({
        json: that.data.json
      })
    }, 1000);
  },
})