// pages/mine/mineShiYan/mineShiYan.js 
var app = getApp();
var openId = app.getOpenid();
var startY, endY;
var clickDisabled = true//点赞能否进行
var canReloadCommentAndReply = true; //是否执行加载评论和回复的方法
//拾言界面全局的innerAudioContext
var CURRENT_INNERAUDIOCONTEXT = undefined
Page({
  /** 
   * 页面的初始数据 
   */
  data: {
    weburl: "https://xcx.gaoxiao114.cn:8888",
    havelike: [],//是否点赞
    // 我的评论内容
    json2: [],
    // 我的回复内容
    json3: [],
    current: 0,
    clickTime: 0
  },
  /** 
   * 生命周期函数--监听页面加载 
   */
  onLoad: function (options) {
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
    // this.getCommentInfo();
    
  },
  /** 
   * 生命周期函数--监听页面隐藏 
   */
  onHide: function () {
  },
  /** 
   * 生命周期函数--监听页面卸载 
   */
  onUnload: function () {
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

  shiyanContent(){
    this.setData({
      current: 0
    })

    setTimeout(() => {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 0
      })
    },50)

  },
  
  commentContent(){
    this.setData({
      current: 1
    })

    setTimeout(() => {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 0
      })
    }, 50)
  },

  getCardsInfo() {
    var that = this;
    wx.request({
      url: app.globalData.url + "/card/mycard",
      method: "GET",
      data: {
        myOpenId: openId,
        hisOpenId: openId
      },
      //这里还要传pages 
      success: function (res) {
        console.log("我的拾言内容");
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
              item.audioInfo[1] = that.data.weburl + item.audioInfo[1].split("/var/www/html")[1]
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
            //   wx.request({
            //     url: app.globalData.url + '/card/havelike',
            //     data: {
            //       cardId: item.cardInfo.cardId,
            //       openId: app.getOpenid()
            //     },
            //     success: function (res) {
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
        that.getReplyInfo();
        console.log(res.data, "result")
      },
      fail: function (res) {
        console.log('获取我的拾言内容失败');
      },
    })
  },
  // //获得我的评论内容
  // getCommentInfo() {
  //   var that = this;
  //   wx.request({
  //     url: app.globalData.url + "/comment/selectAllMyComment?openId=" + app.getOpenid() ,
  //     method: 'GET',
  //     success(res) {
  //       console.log(res.data, '评论内容');
  //       if(res.data.length > 0){
  //         for(let item of res.data){
  //           //设置标识
  //           res.data.flag = 'comment';
  //           //用户头像路径设置
  //           if (item.userPic.split("/var/www/html").length > 1) {
  //             item.userPic = item.userPic.split("/var/www/html")[1];
  //           }
  //           //评论图片路径设置
  //           if(item.picMsg != ""){
  //             item.picMsg = app.globalData.urlb + item.picMsg.substring(13, item.picMsg.length);
  //           }
  //         }
  //         //按时间顺序排序
  //         // res.data.sort((a, b) => {
  //         //   return a.createTime < b.createTime ? 1 : -1;
  //         // })
  //         that.setData({
  //           json2: res.data
  //         })
          
  //         console.log(res.data, "处理后评论"); 
  //         // return res.data;
  //       }
  //     },
  //     fail(res) {
  //       console.log(res);

  //     }
  //   })
  // },
  // //获得我的回复内容
  // getReplyInfo(){
  //   var that = this;
  //   var baseUrl = "https://www.easy-mock.com/mock/5d3f9a5a523fe95723ffbae0/pinglun2";
  //   wx.request({
  //     url: baseUrl + '/getReply',
  //     method: 'GET',
  //     success(res){
  //       console.log(res.data.data);
  //       that.setData({
  //         json3: res.data.data
  //       })
  //       console.log(that.data.json3, "json3");
  //     },
  //     fail(res){
  //       console.log(res);
  //     }
  //   })
  // },
  //获得我的回复内容
  getReplyInfo() {
    var that = this;
    wx.request({
      url: app.globalData.url + '/commentReply?openId=' + app.getOpenid(),
      method: 'GET',
      success(res) {
        console.log(res.data, '回复内容');
        if(res.data.length > 0){
          for (let item of res.data) {
            //设置标识
            item.flag = 'reply';
            //用户头像路径设置
            if (item.userPic.split("/var/www/html").length > 1) {
              item.userPic = item.userPic.split("/var/www/html")[1];
            }
            //评论图片路径设置
            if (item.picMsg != "") {
              item.picMsg = app.globalData.urlb + item.picMsg.substring(13, item.picMsg.length);
            }
          }
          that.setData({
            json3: res.data
          })
        }else{
          that.setData({
            json3: []
          })
        }
        that.getCommentAndReply().then((res) => {
          console.log(res, "res内容");
          //合并评论和回复
          res = res.concat(that.data.json3);
          //按时间顺序排序
          res.sort((a, b) => {
            return a.createTime < b.createTime ? 1 : -1;
          })
         return Promise.resolve(res);
        },(res2) => {
          //评论为空时
          res2 = that.data.json3;
          //按时间顺序排序
          res2.sort((a, b) => {
            return a.createTime < b.createTime ? 1 : -1;
          })
          return Promise.resolve(res2);
        }).then((res) => {
          that.setData({
            json4: res
          })
          console.log(that.data.json4, "json4");

        })
        // that.setData({
        //   json3: res.data.data
        // })
        // console.log(that.data.json3, "json3");
      },
      fail(res) {
        console.log(res);
      }
    })
  },
  //获取评论和回复
  getCommentAndReply(){
    return new Promise((resolve, reject) => {
      var that = this;
      wx.request({
        url: app.globalData.url + "/comment/selectAllMyComment?openId=" + app.getOpenid(),
        method: 'GET',
        success(res) {
          console.log(res.data, '评论内容');
          if (res.data.length > 0) {
            for (let item of res.data) {
              //设置标识
              item.flag = 'comment';
              //用户头像路径设置
              if (item.userPic.split("/var/www/html").length > 1) {
                item.userPic = item.userPic.split("/var/www/html")[1];
              }
              //评论图片路径设置
              // if (item.picMsg != "") {
              //   item.picMsg = app.globalData.urlb + item.picMsg.substring(13, item.picMsg.length);
              // }
              if(item.picMsg != ""){
                var picMsg = item.picMsg;
                // comment.picMsg = picMsg.replace(/\\var\\www\\html/g, '666');

                var temp = picMsg.substring(13)
                  .replace(/\/var\/www\/html/g, `,${that.data.weburl}`)
                  .replace(/shihesseparator/g, '')
                  .split(',');
                temp[0] = that.data.weburl + temp[0];
                console.log(temp, "temp");
                item.compressPath = [];
                item.picMsg = [];
                for (let i = 0; i < temp.length; i++) {
                  //偶数为缩略图，奇数为原图
                  if (i % 2 == 0) {
                    item.compressPath.push(temp[i]);
                  } else {
                    item.picMsg.push(temp[i]);
                  }
                }
                console.log(item.compressPath, "compress");
                console.log(item.picMsg, "picMsg");
              }
            }
            that.setData({
              json2: res.data
            })
            resolve(that.data.json2);
            console.log(res.data, "处理后评论");
            // return res.data;
          }else{
            reject([]);
          }
        },
        fail(res) {
          console.log(res);

        }
      })
      
    })
  },
  //预览评论图片
  previewCommentPic(e) {
    let commentIndex = e.currentTarget.dataset.commentindex;
    let imgIndex = e.currentTarget.dataset.imgindex;
    let imgs = this.data.json4[commentIndex].picMsg;
    let current = imgs[imgIndex];
    wx.previewImage({
      current,
      urls: imgs,
      success(res) {
        console.log("预览成功");
      }
    })
  },
  //删除评论
  removeComment(e){
    var that = this;
    var commentId = e.currentTarget.dataset.id;
    console.log(e.currentTarget.dataset.id)
    // if(that.data.json4.length == 1){
    //   canReloadCommentAndReply = false;
    // }
    wx.showModal({
      content: '是否删除此评论？',
      success(rs){
        if(rs.confirm){
          wx.request({
            url: app.globalData.url + '/comment/delete?commentId=' + commentId,
            method: 'GET',
            success(res){
              if(res.statusCode == '200'){
                that.getCardsInfo();
              }else{
                console.log('删除失败', `状态码为${res.statusCode}`);
              }
            },
            fail(res){
              console.log('后台无数据返回');
            }
          })
        }
      }
    })
  },
  //删除回复
  removeReply(e){
    var that = this;
    var replyId = e.currentTarget.dataset.id;
    console.log(e.currentTarget.dataset);
    // if (that.data.json4.length == 1) {
    //   canReloadCommentAndReply = false;
    // }
    wx.showModal({
      content: '是否删除此回复？',
      success(rs) {
        if (rs.confirm) {
          wx.request({
            url: app.globalData.url + '/commentReply/delete?commentReplyId=' + replyId,
            method: 'POST',
            // data: {
            //   commentReplyId: parseInt(e.currentTarget.dataset.id)
            // },
            success(res) {
              if (res.statusCode == '200') {
                that.getCardsInfo();
              } else {
                console.log('删除失败', `状态码为${res.statusCode}`);
              }
            },
            fail(res) {
              console.log('后台无数据返回');
            }
          })
        }
      }
    })
  },
  //评论点赞
  addCommentLikeNum(e){
    var that = this;
    var commentId = e.currentTarget.dataset.commentid;
    var index = e.currentTarget.dataset.index;
    var cardId = that.data.json4[index].cardId;
    console.log(typeof app.getOpenid());
    if(!clickDisabled){
      return;
    }
    if(that.data.json4[index].commentLiked){
      that.data.json4[index].likesNum -= 1;
    }else{
      that.data.json4[index].likesNum += 1;
    }
    that.data.json4[index].commentLiked = !that.data.json4[index].commentLiked;
    that.setData({
      json4: that.data.json4
    });
    wx.request({
      url: app.globalData.url + '/comment/like/{commentId}?cardId=' + cardId + '&commentId=' + commentId + '&openId=' + app.getOpenid(),  
      method: 'POST',
      success(res){
        if(res.statusCode == '200'){
          clickDisabled = true;
        }else{
          console.log("点赞失败", `状态码为${res.statusCode}`);
        }
      }
    })
  },

  fabushiyan(e) {
    wx.navigateTo({
      url: '/pages/square/fabushiyan/fabushiyan',
    })
  },
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
        url: app.globalData.url + "/card/like/{cardid}?cardId=" + cardId + "&openid=" + openId,
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
          }else{
            that.data.json[index].cardInfo.likesNum -= 1;
            that.data.json[index].cardInfo.liked = false;
            // var havelike = that.data.havelike;
            // havelike[index] = true;
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
      url: app.globalData.url + "/card/like/{cardid}?cardId=" + cardId + "&openid=" + openId,
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
  removeShiYan(e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否要删除本拾言',
      showCancel: true,
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.url + '/card/delete/{openId}/{cardId}?cardId=' + e.currentTarget.dataset.id + "&openId=" + openId,
            method: 'DELETE',
            success: function (res) {
              console.log(res.data)
              if (res.data == "SUCCESS") {
                that.setData({
                  havelike: []
                })
                that.getCardsInfo();
              }
            },
            fail: function (res) {
              console.log(res.data)
            },
            complete: function (res) { },
          })
        } else {
        }
      },
    })
  },
  getInnerAudioContext(data) {
    if (CURRENT_INNERAUDIOCONTEXT) {
      CURRENT_INNERAUDIOCONTEXT.pause()
    }
    CURRENT_INNERAUDIOCONTEXT = data.detail.innerAudioContext
  }
})