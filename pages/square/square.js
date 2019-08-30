const app = getApp();
var is_speaking = false;
var record_time;
var innerAudioContext
var lastRecord = undefined
var curRecode = undefined
var startY, endY;
var clickDisabled = true //点赞能否进行

// var time = 1; //刷新次数
// pages/square/square.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {},
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的初始数据
   */
  data: {
    topic: "#最喜欢的画",
    json: [],
    localJson: [], //用于搜索前存储当前广场相关信息
    json2: [], //用于展示图片
    isSearch: false,
    total: 0, //拾言广场卡片总数
    canShow: false, //是否能看到图片
    windowHeight: 0, //获取的屏幕高度
    addLikeNumId: "",
    likeNum: 0,
    weburl: app.globalData.urlb,
    searchMsg: "",
    isSearch: false,
    pages: 0,

    record_time: 0, //录音时间
    record_action: "none", //录音的按钮变化样式

    havelike: [], //记录是否点赞
  },
  lifetimes: {

    attached() {
      this.re_attached();
    },
    moved() { //console.log("moved")
    },
    detached() {
      //console.log("detached")
      innerAudioContext.stop();
    },
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show() {
      this.getDetail();
      //设置屏幕高度
      this.setData({
        windowHeight: wx.getSystemInfoSync().windowHeight
      })
      console.log("show");
      this.showCardInfo()
    },
    hide() {
      console.log("hide")
      innerAudioContext.stop();
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getFocus() {
      this.setData({
        isFocus: true
      })
    },
    outFocus() {
      this.setData({
        isFocus: false
      })
    },
    //下拉刷新调用的方法，attached()
    re_attached() {
      // this.initInnerAudioContext();
      // this.getCardsInfo();
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 0
      })
      //设置屏幕高度
      this.setData({
        windowHeight: wx.getSystemInfoSync().windowHeight
      })
      this.initInnerAudioContext();
      this.getCardsInfo();
      //实现懒加载
      setTimeout(() => {
        this.lazyload();
      }, 1000);
      // //重置分页次数
      // var time = 1;
      // this.showImg();

      console.log("attached");


    },
    //得到页面详情信息
    getDetail() {
      var that = this;
      wx.getStorage({
        key: 'detailData',
        success: function (res) {
          //更新页面内容
          console.log(that.data.json);
          for (let item of that.data.json) {
            if (item.cardInfo.cardId == res.data.cardInfo.cardId) {
              item.cardInfo.commentNum = res.data.cardInfo.commentNum;
              item.cardInfo.likesNum = res.data.cardInfo.likesNum;
              item.cardInfo.liked = res.data.cardInfo.liked;
              item.cardInfo.shareNum = res.data.cardInfo.shareNum;
              console.log(item, "item");
              break;
            }
          }
          that.setData({
            json: that.data.json
          })
        },
      })
    },
    getCardsInfo() {

      var havelike = [];
      var that = this;

      wx.request({
        url: app.globalData.url + "/card/squarewithpage",
        data: {
          current: 1,
          size: 10,
          openId: app.getOpenid(),
        },
        //这里还要传pages
        success: function (res) {
          that.data.pages = res.data.pages;
          console.log("拾言广场的内容");
          console.log(res.data);
          //获取拾言总数
          that.setData({
            total: parseInt(res.data.total)
          })
          if (res.data.records.length > 0) {
            for (let item of res.data.records) {
              //设置图片不可显示
              item.canShow = false;
              //语音时间设置
              console.log(item.cardInfo.liked);
              if (item.audioInfo.length > 0) {
                var recordSrc = item.cardInfo.cardId;
                //console.log(recordSrc.split("durationTime="),  "字符分割");
                var recordTime = 0;
                if (recordSrc.split("_duration_").length > 1) {
                  recordTime = recordSrc.split("_duration_")[1];
                }
                recordTime = parseInt(recordTime / 1000);
                item.record_time = recordTime;
                item.record_temp_time = 0;
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
              // //发布的图片路径设置(分为缩略图和原图数组)
              // if (item.pictureInfo.length > 0) {
              //     for (var index in item.pictureInfo) {
              //         if (item.pictureInfo[index] != "") {
              //             var picMsg = item.pictureInfo[index];
              //             item.pictureInfo[index] = that.data.weburl + picMsg.substring(13, picMsg.length);
              //         }
              //     }
              // }
              //发布的图片路径设置(分为缩略图和原图数组)
              if (item.pictureInfo.length > 0) {
                let j = 0,
                  k = 0;
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

              //得到用户是否点赞
              // if (item.cardInfo.cardId != "") {
              //   wx.request({
              //     url: app.globalData.url + '/card/havelike',
              //     data: {
              //       cardId: item.cardInfo.cardId,
              //       openId: app.getOpenid()
              //     },
              //     success: function (res) {
              //       if ("SUCCESS" == res.data) {
              //         havelike.push(true);
              //         that.setData({
              //           havelike: havelike,
              //         })//有点赞
              //       } else if ("ERROR" == res.data) {
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
          //console.log(res.data, '拾言广场');
          //console.log(res.data.records, '获取拾言广场内容');
          that.setData({
            json: that.showImg(res.data.records)
          })
          console.log(that.data.json, "json");
        },
        fail: function (res) {
          console.log('获取拾言广场内容失败');
        },
      })
    },
    //搜索时使用
    getCardsInfo2() {

      var havelike = [];
      var that = this;

      wx.request({
        url: app.globalData.url + "/card/squarewithpage",
        data: {
          current: 1,
          size: that.data.total,
          openId: app.getOpenid,
        },
        //这里还要传pages
        success: function (res) {
          that.data.pages = res.data.pages;
          console.log("搜索拾言广场的内容");
          console.log(res.data);
          // that.setData({
          //   total: parseInt(res.data.total)
          // })
          if (res.data.records.length > 0) {
            for (let item of res.data.records) {
              //语音时间设置
              console.log(item.cardInfo.liked)
              if (item.audioInfo.length > 0) {
                var recordSrc = item.cardInfo.cardId;
                //console.log(recordSrc.split("durationTime="),  "字符分割");
                var recordTime = 0;
                if (recordSrc.split("_duration_").length > 1) {
                  recordTime = recordSrc.split("_duration_")[1];
                }
                recordTime = parseInt(recordTime / 1000);
                item.record_time = recordTime;
                item.record_temp_time = 0;
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
                let j = 0,
                  k = 0;
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

              // //发布的图片路径设置
              // if (item.pictureInfo.length > 0) {
              //   for (var index in item.pictureInfo) {
              //     if (item.pictureInfo[index] != "") {
              //       var picMsg = item.pictureInfo[index];
              //       item.pictureInfo[index] = that.data.weburl + picMsg.substring(13, picMsg.length);
              //     }
              //   }
              // }

            }
          }
          that.setData({
            localJson: res.data.records,
          })
          console.log(that.data.localJson, "搜索前");
          // setTimeout(() => {
          let searchJson = that.data.localJson;
          let searchMsg = that.data.searchMsg;
          let temp = [];
          if (searchJson != []) {
            for (let item of searchJson) {
              if (item.cardInfo.textMsg.indexOf(searchMsg) != -1 || item.customerInfo.nickName.indexOf(searchMsg) != -1) {
                temp.push(item);
              }
            }
            // if (that.data.localJson.length == 0) {
            //   that.setData({
            //     localJson: that.data.json
            //   })
            // }
            that.setData({
              json: that.showImg(temp),
              isSearch: true
            });
            console.log(that.data.json, "搜索后");
          }
          if (that.data.json === []) {
            wx.showToast({
              icon: 'none',
              title: '抱歉没有您要搜索的内容',
              duration: 1000
            })
          }
          wx.pageScrollTo({
            scrollTop: 0,
            duration: 0
          })
          console.log("complete");
          // }, 100);
        },
        fail: function (res) {
          console.log('搜索失败');
        },
      })
    },
    reloadSquare: function (times) {
      var havelike = [];
      var that = this;
      // if(times < this.data.pages){
      that.triggerEvent("isReload", true);
      wx.request({
        url: app.globalData.url + "/card/squarewithpage",
        data: {
          current: times,
          size: 10,
          openId: app.getOpenid(),
        },
        //这里还要传pages
        success: function (res) {

          console.log("拾言广场的内容");
          console.log(res.data);
          if (res.data.records.length > 0) {
            for (let item of res.data.records) {
              //设置图片不可显示
              item.canShow = false;
              //语音时间设置
              console.log(item.cardInfo.liked)
              if (item.audioInfo.length > 0) {
                var recordSrc = item.cardInfo.cardId;
                //console.log(recordSrc.split("durationTime="),  "字符分割");
                var recordTime = 0;
                if (recordSrc.split("_duration_").length > 1) {
                  recordTime = recordSrc.split("_duration_")[1];
                }
                recordTime = parseInt(recordTime / 1000);
                item.record_time = recordTime;
                item.record_temp_time = 0;
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
                let j = 0,
                  k = 0;
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

              // //发布的图片路径设置
              // if (item.pictureInfo.length > 0) {
              //   for (var index in item.pictureInfo) {
              //     if (item.pictureInfo[index] != "") {
              //       var picMsg = item.pictureInfo[index];
              //       item.pictureInfo[index] = that.data.weburl + picMsg.substring(13, picMsg.length);
              //     }
              //   }
              // }

              //得到用户是否点赞
              // if (item.cardInfo.cardId != "") {
              // wx.request({
              //   url: app.globalData.url + '/card/havelike',
              //   data: {
              //     cardId: item.cardInfo.cardId,
              //     openId: app.getOpenid()
              //   },
              //   success: function (res) {
              //     if ("SUCCESS" == res.data) {
              //       havelike.push(true);
              //       that.setData({
              //         havelike: havelike,
              //       })//有点赞
              //     } else if ("ERROR" == res.data) {
              //       havelike.push(false);
              //       that.setData({
              //         havelike: havelike,
              //       })//没有点赞
              //     }
              //   }
              // })

              // }
              //设置图片缩放
              // res.data.records = that.showImg(res.data.records);
            }
          }
          that.setData({
            json: that.data.json.concat(that.showImg(res.data.records))

          })
          // setTimeout(() => {
          //   that.lazyload();
          // //向index页面传参，表示加载结束
          //   that.triggerEvent('isReload', false);
          that.syncLazyload().then((rs) => {
            console.log(rs);
            that.triggerEvent('isReload', rs)
          })
          // },100);

          // setTimeout(() => {
          //   that.lazyload();
          // },500);
          console.log(that.data.json, "reload结束");

        },
        fail: function (res) {
          console.log('获取拾言广场内容失败');
        },
      })
      // }

    },
    fabushiyan(e) {
      if (!app.globalData.isRegister) {
        app.showRegister("发布拾言")
        return
      }
      wx.navigateTo({
        url: '/pages/square/fabushiyan/fabushiyan',
      })
    },
    comment(e) {
      if (!app.globalData.isRegister) {
        app.showRegister("查看拾言")
        return
      }
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
      if (endY - startY > 100 || startY - endY > 100) {
        this.cover_video();
      }
    },

    //点赞
    addLikeNum(e) {
      if (!app.globalData.isRegister) {
        app.showRegister("点赞")
        return
      }
      var index = e.currentTarget.dataset.id;
      var that = this;
      var cardId = that.data.json[index].cardInfo.cardId;
      // that.setData({
      //   clickDisabled: false
      // })
      // clickDisabled = false;
      if (clickDisabled) {
        clickDisabled = false;
        wx.request({
          url: app.globalData.url + "/card/like/{cardid}?cardId=" + cardId + "&openid=" + app.getOpenid(),
          // url: app.globalData.url + "/card/squarewithpage",
          // data:{
          //   openId: app.getOpenid()
          // },
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
              that.setData({
                json: that.data.json
              })
            }
            // that.setData({
            //   clickDisabled: true
            // })
            clickDisabled = true;
            console.log(clickDisabled);
          },
          fail: function (res) {
            console.log("点赞失败");
            console.log(res);
          },
          complete: function (res) {},
        })
      }
    },
    //点赞2
    addLikeNum2(e) {
      app.showRegister("点赞")
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
    //展示图片
    showImg(imgs) {
      var that = this;
      // for(let i in this.data.json){
      // console.log(this.data.json[i].pictureInfo.length);
      for (let i in imgs) {
        // var length = that.data.json[i].pictureInfo.length;
        // var picture = that.data.json[i].pictureInfo;
        var length = imgs[i].pictureInfo.length;
        var picture = imgs[i].pictureInfo;
        let mode = '';
        switch (length) {
          case 1:
            mode = 'widthFix';
            // let item = {picInfo: [{ pic: picture[0], imgMode: mode }]};
            // that.data.json2.push(item);
            var temp = [];
            // temp.push({pic: picture[0], imgMode: mode});
            temp.push({
              pic: picture[0],
              imgMode: mode
            });

            // that.data.json[i].pictureInfo.length = 0;;
            // that.data.json[i].pictureInfo = that.data.json[i].pictureInfo.concat(temp);
            imgs[i].pictureInfo.length = 0;
            imgs[i].pictureInfo = imgs[i].pictureInfo.concat(temp);

            break;
          case 2:
            mode = 'aspectFill';
            var temp = [];
            for (let index in picture) {
              // that.data.json2.push({picinfo: { pic: [picture[index]], imgMode: mode }});
              // let item = {pic: picture[index], imgMode: mode};
              let item = {
                pic: picture[index],
                imgMode: mode
              };

              temp.push(item);
            }
            // that.data.json[i].pictureInfo.length = 0;
            // that.data.json[i].pictureInfo = that.data.json[i].pictureInfo.concat(temp);
            imgs[i].pictureInfo.length = 0;
            imgs[i].pictureInfo = imgs[i].pictureInfo.concat(temp);
            break;
          case 3:
            var temp = [];
            let height = 0;
            for (let index in picture) {
              if (index == 0) {
                mode = 'widthFix';
              } else {
                mode = 'aspectFill';
              }
              let item = {
                pic: picture[index],
                imgMode: mode,
                height
              };

              temp.push(item);
            }
            // that.data.json2.push({ picInfo: temp });
            // that.data.json[i].pictureInfo.length = 0;
            // that.data.json[i].pictureInfo = that.data.json[i].pictureInfo.concat(temp);
            imgs[i].pictureInfo.length = 0;
            imgs[i].pictureInfo = imgs[i].pictureInfo.concat(temp);

            break;
          case 4:
            var temp = [];
            mode = 'aspectFill';
            for (let index in picture) {
              // let item = { pic: picture[index], imgMode: mode };
              let item = {
                pic: picture[index],
                imgMode: mode
              };

              temp.push(item);
            }
            // that.data.json2.push({ picInfo: temp });
            // that.data.json[i].pictureInfo.length = 0;
            // that.data.json[i].pictureInfo = that.data.json[i].pictureInfo.concat(temp);
            imgs[i].pictureInfo.length = 0;
            imgs[i].pictureInfo = imgs[i].pictureInfo.concat(temp);

            break;
        }
      }
      console.log(imgs);
      return imgs;
      // that.setData({
      //   json: that.data.json
      // })
      // console.log(that.data.json);
    },
    // showarea(e){
    //   e = true;
    // },
    previewImg(e) {
      var that = this;
      var cardIndex = e.currentTarget.dataset.cardindex;
      var imgIndex = e.currentTarget.dataset.imgindex;
      console.log(cardIndex, imgIndex, "得到的数据")
      var imgs = that.data.json[cardIndex].pictureInfo2;
      var current = that.data.json[cardIndex].pictureInfo2[imgIndex];
      // var newArr = [];
      // for (let item of imgs) {
      //     console.log(item);
      //     newArr = newArr.concat(item.pic);
      // }
      // console.log(newArr);
      wx.previewImage({
        current,
        urls: imgs,
        success: function (res) {
          console.log(res, "预览图片成功")
        },
        fail: function (res) {
          console.log(res, "预览图片失败")
        },
        complete: function (res) {},
      })
    },

    changeSearchInfo2() {
      //用来传数据到page
      this.setData({
        isSearch: false
      })
    },
    //模糊搜索
    searchCards2() {
      var that = this;
      if (that.data.searchMsg.length == 0 || that.data.json.length == 0) {
        console.log("无搜索条件或拾言广场为空");
        // getCardsInfo();
        return;
      }
      that.setData({
        isSearch: true
      })
      //使上拉刷新停止，为了集中显示搜索数据
      that.triggerEvent('changeSearchInfo2', that.data.isSearch);
      that.getCardsInfo2();
      //实现懒加载
      setTimeout(() => {
        that.lazyload();
      }, 1000);
    },
    getSearchMsg(e) {
      var searchMsg = e.detail.value.replace(/\s+/g, '');
      if (searchMsg.length > 0) {
        this.setData({
          searchMsg: e.detail.value,
        })
      } else {
        if (this.data.isSearch) {
          this.getCardsInfo();
          wx.pageScrollTo({
            scrollTop: 0,
            duration: 0
          })
          //图片懒加载
          setTimeout(() => {
            this.lazyload();
          }, 500);
        }
        this.setData({
          searchMsg: "",
          isSearch: false,
        })
        this.triggerEvent('changeSearchInfo2', this.data.isSearch);
      }
    },
    initInnerAudioContext() {
          //创建
          innerAudioContext = wx.createInnerAudioContext()
          innerAudioContext.onPlay((res) => {
              lastRecord = curRecode
              is_speaking = true
              this.start_record_time(curRecode.index)
          })
          innerAudioContext.onSeeking((res) => {
          })
          innerAudioContext.onPause((res) => {
              is_speaking = false
              //暂停时间变动
              this.stop_record_time()
          })
          innerAudioContext.onStop((res) => {
              is_speaking = false;
              lastRecord = undefined
              this.stop_record_time()
          })
          innerAudioContext.onEnded((res) => {
              is_speaking = false
              lastRecord = undefined
              clearInterval(record_time);
              this.data.json[curRecode.index].record_temp_time = 0;
              this.setData({
                  record_index: -1,
                  json: this.data.json
              });
          })
        },
        //播放录音
        playvoice: function (e) {
            this.cover_video(); //停止视频
            var that = this;
            curRecode = e.currentTarget.dataset
            var index = e.currentTarget.dataset.index
            //多次点击同一个
            if (lastRecord != undefined && lastRecord.index == curRecode.index) {
                if (is_speaking) {
                    //console.log('点击了同一个，暂停播放')
                    innerAudioContext.pause()
                } else {
                    //console.log('点击了同一个，继续播放')
                    innerAudioContext.play()
                }
            } else { //首次播放 或者 上个录音自然播放完 或者不同个 ---> 开启新的录音
                if (lastRecord) {
                    //关闭
                    clearInterval(record_time)
                }
                //重新设置播放资源
                var recordSrc = that.data.json[index].audioInfo[1];
                recordSrc = that.data.weburl + recordSrc.substring(13, recordSrc.length);
                innerAudioContext.src = recordSrc
                innerAudioContext.seek(that.data.json[index].record_temp_time)
                innerAudioContext.play()
            }
        },
        //录音时间变化
        start_record_time(index) {
            var that = this
            this.setData({
                record_index: index
            })
            record_time = setInterval(() => {
                that.data.json[index].record_temp_time += 0.1;
                that.setData({
                    json: that.data.json
                })
            }, 100);
        },
        stop_record_time() {
            clearInterval(record_time)
            this.setData({
                record_index: -1
            })
        },
        //跳转到用户详情页
        toOtgerInfo(e) {
            if (!app.globalData.isRegister) {
                app.showRegister("查看个人主页")
                return
            }
            var id = e.currentTarget.dataset.index;
            console.log("this id is:" + id);
            wx.navigateTo({
                url: '/pages/othersInfo/othersInfo?openId=' + id,
            })
        },
    //滑动监听
    lazyload() {
      var that = this;
      var arr = that.data.json;
      var height = that.data.windowHeight;
      // console.log(height, "height");

      // that.createSelectorQuery().selectAll('.card').boundingClientRect().exec((res) => {
      //   console.log(res[0]);
      //   if(res[0].length != arr.length){
      //     console.log("------")
      //   }
      // })

      that.createSelectorQuery().selectAll('.imgAndVedio').boundingClientRect(res => {
        res.forEach((item, index) => {
          if (item.top < height || index == 0) {
            arr[index].canShow = true
          }
        })
        that.setData({
          json: arr
        })
      }).exec();

      // arr.forEach((item, index) => {
      //   that.createIntersectionObserver().relativeToViewport({ bottom: 10 }).observe(`.img-${index}`, res => {
      //     if (res.intersectionRatio > 0) {
      //       item.pictureInfo.forEach((val, idx2) => {
      //         console.log(val, "val");
      //         val.canShow = true;
      //         that.setData({
      //           json: arr
      //         })
      //         // that.triggerEvent('lazyload', that.data.json);
      //       })
      //     }
      //   })
      // })

    },
    //使懒加载同步
    syncLazyload() {
      // var that = this;
      return new Promise((resolve, reject) => {
        this.lazyload();
        resolve(false);
      })
    },
    //得到详情页
    showCardInfo() {
      if (!app.globalData.temp.fackerSY)
        return
      var that = this;
      console.log(app.globalData.url + "/card/detail/" + app.globalData.temp.fackerSY)
      wx.request({
        url: app.globalData.url + "/card/detail/" + app.globalData.temp.fackerSY,
        method: "POST",
        //这里还要传pages
        success: function (res) {
          //语音时间设置
          if (res.data.audioInfo.length > 0) {
            var recordSrc = res.data.cardInfo.cardId;
            //console.log(recordSrc.split("durationTime="),  "字符分割");
            var recordTime = 0;
            if (recordSrc.split("_duration_").length > 1) {
              recordTime = recordSrc.split("_duration_")[1];
            }
            recordTime = parseInt(recordTime / 1000);
            res.data.record_time = recordTime;
            res.data.record_temp_time = 0;
          }
          //用户头像路径设置
          if (res.data.customerInfo.userPic.split("/var/www/html").length > 1) {
            res.data.customerInfo.userPic = res.data.customerInfo.userPic.split("/var/www/html")[1];
          }
          //发布的视频封面路径设置
          if (res.data.videoInfo.length > 0) {
            for (var index in res.data.videoInfo) {
              if (res.data.videoInfo[index].picPath != "") {
                var picMsg = res.data.videoInfo[index].picPath;
                res.data.videoInfo[index].picPath = that.data.weburl + picMsg.substring(13, picMsg.length);
              }
              //发布的视频路径设置
              if (res.data.videoInfo[index].realPath != "") {
                var vdoMsg = res.data.videoInfo[index].realPath;
                res.data.videoInfo[index].realPath = that.data.weburl + vdoMsg.substring(13, vdoMsg.length);
              }
            }
          }
          //发布的图片路径设置(分为缩略图和原图数组)
          if (res.data.pictureInfo.length > 0) {
            let j = 0, k = 0;
            //缩略图
            let pictureInfo = [];
            //原图
            let pictureInfo2 = [];
            for (let i in res.data.pictureInfo) {
              //偶数为缩略图,奇数为原图
              if (i % 2 == 0) {
                var picMsg = res.data.pictureInfo[i];
                pictureInfo[j] = that.data.weburl + picMsg.substring(13);
                j++;
              } else {
                var picMsg2 = res.data.pictureInfo[i];
                pictureInfo2[k] = that.data.weburl + picMsg2.substring(13);
                k++;
              }
            }
            res.data.pictureInfo.length = 0;
            res.data.pictureInfo = res.data.pictureInfo.concat(pictureInfo);
            res.data.pictureInfo2 = pictureInfo2;
          }
          console.log(res.data);
          var temp = that.showImg([res.data])

          that.setData({
            json: temp.concat(that.data.json)
          })
          app.globalData.temp.fackerSY = undefined
        },
        fail: function (res) {
          console.log('获取拾言详情页失败');
        },
      });
    },
  }
})