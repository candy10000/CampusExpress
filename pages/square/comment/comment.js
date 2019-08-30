const app = getApp();
var openId = app.getOpenid();
var cardId;
var textMsg;
var commentId; //评论的id
var replyId; //回复的id
var replyMsg;
var islock = false;
var is_speaking = false;
var record_time;
var innerAudioContext = wx.createInnerAudioContext();
var clickDisabled = true //点赞能否进行

Page({
  /**
   * 页面的初始数据
   */
  data: {
    hideBackBtn: true,
    button_i_class: "fa-gift",
    button_view_class: "gift-but",
    button_id: "gift",
    concernMethod: "POST",
    concernTitle: "关注",
    beConcernId: "", //被关注者的ID  发布这个拾言者的ID
    myedit: "",
    weburl: app.globalData.urlb,
    hiddenTitle: "评论...",
    focus: false, //输入款获得焦点
    images: [],
    topic: "#最喜欢的画",
    json: [], //拾言详情
    second: 0,
    commentInfo: [], //评论详情
    nickName: {}, //用户id和名字的数据字典
    userPic: {}, //用户id和头像的数据字典
    record_time: 0, //录音时间
    record_action: "fa-play", //录音的按钮变化样式

    havelike: false, //是否点赞
    comment_havelike: [], //评论的是否点赞
    giftList: [],

    giftmall: false,
    receiverId: "",
    realLength: 0, //图片数组的真实长度
    curLength: 0, //目前已经完成上传的图片数组长度
    allUrl: '',
    compressPath: '',
    concernedStyle: 'title' //关注和未关注的样式类
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    openId = app.getOpenid(app.globalData.url);

    this.initInnerAudioContext()

    console.log(options, 'options参数')

    var scene = app.globalData.scene

    if (options.q) {
      this.setData({
        hideBackBtn: false
      })
      let url = decodeURIComponent(options.q).split('/')
      cardId = url[url.length - 1]
      console.log(cardId, 'QRCode')
    } else {
      cardId = options.cardId;
      console.log(cardId, 'not QRCode')
    }
    // if(options.liked)
    this.setData({
      havelike: options.liked === "false" ? false : true,
      sendgiftCardId: cardId
    })
    console.log(this.data.havelike);
    console.log(typeof this.data.havelike, "havelike");
    this.showCardInfo();
    // this.giftsGetted();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    //console.log("onHide")
    innerAudioContext.pause();
    //放入本地缓存中
    wx.setStorage({
      key: 'detailData',
      data: this.data.json,
    })
    console.log("detail hided");
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    //console.log("onUnload")
    innerAudioContext.stop();
    //放入本地缓存中
    wx.setStorage({
      key: 'detailData',
      data: this.data.json,
    })
    console.log("detail unloaded");
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
  /**
   * 返回首页的按钮（只在扫描分享卡片时进入该page时出现，场景值1011-1013）
   */
  backToHome() {
    console.log('reLaunch')
    wx.reLaunch({
      url: '../../index/index'
    })
  },
  change_img2: function (e) {

    if (typeof (commentId) != "undefined" && commentId != "") {
      replyMsg = e.detail.value;
    } else if (typeof (replyId) != "undefined" && replyId != "") {
      replyMsg = e.detail.value;
    } else {
      textMsg = e.detail.value;
    }
    var that = this;

    setTimeout(function () {
      that.setData({
        button_i_class: "fa-gift",
        button_view_class: "gift-but",
        button_id: "gift",
        focus: false,
      });
    }, 100)

  },
  playVideo(e) {
    innerAudioContext.stop(); //停止语音
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

  //得到详情页
  showCardInfo() {
    var that = this;
    console.log(app.globalData.url + "/card/detail/" + cardId)
    wx.request({
      url: app.globalData.url + "/card/detail/" + cardId,
      method: "POST",
      //这里还要传pages
      success: function (res) {
        console.log(res, "拾言详情页");
        that.setData({
          receiverId: res.data.customerInfo.openId
        })
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

        // //发布的图片路径设置
        // if (res.data.pictureInfo.length > 0) {
        //   for (var index in res.data.pictureInfo) {
        //     if (res.data.pictureInfo[index] != "") {
        //       var picMsg = res.data.pictureInfo[index];
        //       res.data.pictureInfo[index] = that.data.weburl + picMsg.substring(13, picMsg.length);
        //     }
        //   }
        // }

        // // 得到用户是否点赞
        // if (cardId != "") {
        //   wx.request({
        //     url: app.globalData.url + '/card/havelike',
        //     data: {
        //       cardId: cardId,
        //       openId: openId,
        //     },
        //     success: function (res) {
        //       if ("SUCCESS" == res.data) {
        //         var havelike = that.data.havelike;
        //         havelike = true;
        //         that.setData({
        //           havelike: havelike,
        //         })//有点赞
        //       } else if ("ERROR" == res.data) {
        //         var havelike = that.data.havelike;
        //         havelike = false;
        //         that.setData({
        //           havelike: havelike,
        //         })//没有点赞
        //       }
        //     }
        //   })
        // }
        //设置点赞liked方便返回数据给之前页面
        res.data.cardInfo.liked = that.data.havelike;

        that.setData({
          json: res.data,
          beConcernId: res.data.customerInfo.openId,
        });
        console.log(that.data.json, "card_json");
        that.showImg();
        that.isConcernFun(); //判断是否关注
        that.showCommentInfo(); //获取评论内容
        that.giftsGetted(); //获取礼物
      },
      fail: function (res) {
        console.log('获取拾言详情页失败');
      },
    });
  },

  //进入页面判断是否关注
  isConcernFun() {
    var that = this;
    //判断是否关注
    wx.request({
      url: app.globalData.url + "/card/concern/other",
      method: "GET",
      data: {
        openId: openId
      },
      //这里还要传pages
      success: function (res) {

        if (res.data["SUCCESS"] != null && res.data["SUCCESS"].length > 0) {
          for (let item of res.data["SUCCESS"]) {
            if (item.customerInfo.openId == that.data.beConcernId) {
              that.setData({
                concernTitle: "已关注",
                concernMethod: "DELETE",
                concernedStyle: "concernedTitle"
              });
              console.log("进入页面  判断为 已关注的");
              break;
            }
          }
        } else {
          console.log("进入页面  判断为 没有关注的人");
          that.setData({
            concernedStyle: "title"
          })
        }


      },
      fail: function (res) {
        console.log('得到关注的人失败');
      },
    });
  },
  //点击关注和取消关注
  concernFun() {
    var that = this;
    if (that.data.beConcernId != "") {
      wx.request({
        url: app.globalData.url + "/card/concern/" + that.data.beConcernId + "?openId=" + openId,
        method: that.data.concernMethod,
        //这里还要传pages
        success: function (res) {
          console.log(that.data.beConcernId);
          console.log(openId);
          console.log(that.data.concernMethod);
          console.log(res);
          if (that.data.concernMethod == "POST") {
            if (res.data == "SUCCESS") {
              that.setData({
                concernTitle: "已关注",
                concernMethod: "DELETE",
                concernedStyle: "concernedTitle"
              })
            }
          } else if (that.data.concernMethod == "DELETE") {
            if (res.data == "SUCCESS") {
              that.setData({
                concernTitle: "关注",
                concernMethod: "POST",
                concernedStyle: "title"
              })
            }
          } else {
            console.log("concernMethod  出错")
          }
        },
        fail: function (res) {
          console.log('关注或取消关注失败');
        },
      });
    } else {
      console.log("没有得到要关注人的openID")
    }

  },
  //显示评论
  showCommentInfo() {
    commentId = "";
    replyId = "";
    textMsg = "";
    replyMsg = "";
    var comment_havelike = [];
    var that = this;
    wx.request({
      url: app.globalData.url + "/comment/getcomment?cardId=" + cardId,
      method: 'GET',
      success: function (res) {
        console.log("获取评论内容");
        console.log(res.data);
        var comments = res.data;
        for (let comment of comments) {
          that.getCustomer(comment.executorId);

          if (comment.picMsg != "") {
            var picMsg = comment.picMsg;
            // comment.picMsg = picMsg.replace(/\\var\\www\\html/g, '666');
            
            var temp = picMsg.substring(13)
                            .replace(/\/var\/www\/html/g, `,${that.data.weburl}`)
                            .replace(/shihesseparator/g, '')
                            .split(',');
            temp[0] = that.data.weburl + temp[0];
            console.log(temp, "temp");
            comment.compressPath = [];
            comment.picMsg = [];
            for(let i = 0; i < temp.length; i++){
              //偶数为缩略图，奇数为原图
              if(i % 2 == 0){
                comment.compressPath.push(temp[i]);
              }else{
                comment.picMsg.push(temp[i]);
              }
            }
            console.log(comment.compressPath, "compress");
            console.log(comment.picMsg, "picMsg");
            // console.log(comment.picMsg);
            // comment.picMsg = that.data.weburl + picMsg.substring(13, picMsg.length);
          }
          if (comment.replys != null && comment.replys.length > 0) {
            for (let reply of comment.replys) {
              that.getCustomer(reply.beReplyerId);
              if (reply.picMsg != "") {
                var picMsg = reply.picMsg;
                reply.picMsg = that.data.weburl + picMsg.substring(13, picMsg.length);
              }

            }
          }

          //得到评论的是否点赞
          if (comment.commentId != "") {
            wx.request({
              url: app.globalData.url + '/card/havelike',
              data: {
                cardId: comment.commentId,
                openId: app.getOpenid()
              },
              success: function (res) {

                if ("SUCCESS" == res.data) {
                  comment_havelike.push(true);
                  that.setData({
                    comment_havelike: comment_havelike,
                  }) //有点赞
                } else if ("ERROR" == res.data) {
                  comment_havelike.push(false);
                  that.setData({
                    comment_havelike: comment_havelike,
                  }) //没有点赞
                }
              }
            })
          }
        }
        console.log(that.data.nickName, "用户名字");
        console.log(that.data.userPic, "用户头像");
        console.log(comments, "commentInfo");
        that.setData({
          commentInfo: comments,
          focus: false,
          images: []
        });
      },
      fail: function (res) {
        console.log("获取评论内容失败");
        console.log(res);
      },
      complete: function (res) {},
    })

  },
  //查询用户信息
  getCustomer(customerId) {
    var that = this;
    var nickName = that.data.nickName;
    if (nickName[customerId] == null) {
      wx.request({
        url: app.globalData.url + "/customer/detail?openId=" + customerId,
        method: "GET",
        success: function (res) {

          // console.log(customerId, "获取用户信息");
          var nickName = that.data.nickName;
          var userPic = that.data.userPic;
          nickName[customerId] = res.data.nickName;
          userPic[customerId] = res.data.userPic.replace('/var/www/html', '')
          that.setData({
            nickName: nickName,
            userPic: userPic,
          })
        },
        fail: function (res) {
          console.log("获取用户信息失败");
          console.log(res)
        }
      })
    }

  },
  //提交评论
  submitComment() {
    var that = this;

    setTimeout(function () {

      if (typeof (commentId) != "undefined" && commentId != "") {

        if (that.data.images[0] != null) {
          that.replyCommentImg();
        } else {
          if (typeof (replyMsg) != "undefined" && replyMsg != "") {
            that.replyComment();
          }
        }
      } else if (typeof (replyId) != "undefined" && replyId != "") {

        if (that.data.images[0] != null) {
          that.replyReplyImg();
        } else {
          if (typeof (replyMsg) != "undefined" && replyMsg != "") {
            that.replyReply();
          }

        }
      } else {

        if (that.data.images[0] != null) {
          that.setData({
            realLength: that.data.images.length
          })
          for(let item of that.data.images){
            that.addcommentImg(item);
          }
        } else {
          if (typeof (textMsg) != "undefined" && textMsg != "") {
            that.addcomment();
          }
        }
      }
    }, 200)


  },
  //发表评论
  addcomment() {
    var that = this;

    wx.request({
      url: app.globalData.url + "/comment/addcomment?cardId=" + cardId + "&compressPath=" + "&openId=" + openId + "&textMsg=" + textMsg,
      method: "POST",
      success: function (res) {
        that.showCommentInfo();
        that.showCardInfo();
        that.setData({
          myedit: "",
          focus: false
        });
      },
      fail: function (res) {}
    })
  },
  //预览评论图片
  previewCommentPic(e){
    let commentIndex = e.currentTarget.dataset.commentindex;
    let imgIndex = e.currentTarget.dataset.imgindex;
    let imgs = this.data.commentInfo[commentIndex].picMsg;
    let current = imgs[imgIndex];
    wx.previewImage({
      current,
      urls: imgs,
      success(res){
        console.log("预览成功");
      }
    })
  },
  //回复评论
  replyComment() {
    var that = this;
    wx.request({
      url: app.globalData.url + "/commentReply/reply/comment?cardId=" + cardId + "&commentId=" + commentId + "&openId=" + openId + "&textMsg=" + replyMsg,
      method: "GET",
      success: function (res) {
        that.showCommentInfo();
        that.showCardInfo();
        that.setData({
          myedit: ""
        });
      },
      fail: function (res) {}
    })
  },
  //回复评论的回复
  replyReply() {
    var that = this;
    wx.request({
      url: app.globalData.url + "/commentReply/reply/reply?beReplyId=" + replyId + "&openId=" + openId + "&textMsg=" + replyMsg,
      method: "POST",
      success: function (res) {
        that.showCommentInfo();
        that.showCardInfo();
        that.setData({
          myedit: ""
        });
      },
      fail: function (res) {}
    })
  },
  //发表评论的上传图片
  addcommentImg(img) {
    var that = this;
    wx.uploadFile({
      url: app.globalData.url + "/card/upload",
      filePath: img,
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data"
      },
      formData: {
        'length': that.data.realLength,
        'cardId': cardId,
        'openId': openId
      },
      success: function (res) {
        var data = JSON.parse(res.data)
        console.log(data, "发布评论的返回信息")
        var allUrl = '' + data.compressPath + data.path;
        var compressPath = data.compressPath;
        // that.showCommentInfo();
        // that.showCardInfo();
        that.setData({
          myedit: "",
        });

        that.data.allUrl += allUrl;
        that.data.compressPath += compressPath;

        that.setData({
          curLength: that.data.curLength + 1
        });

      },fail(res){
        console.log('发送失败，后台无数据返回');
      },complete(res){
        //图片上传完成进行发布
        if(that.data.realLength == that.data.curLength){
          wx.request({
            url: app.globalData.url + '/comment/addcomment',
            method: 'POST',
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
              allUrl: that.data.allUrl,
              cardId,
              compressPath: that.data.compressPath,
              openId,
              textMsg,
            },success(res){
              console.log("发布评论成功");
              that.showCommentInfo();
              that.showCardInfo();
            }
          })
        }
        // console.log(res, "completed");
      }
    })
  },
  //回复评论的图片
  replyCommentImg() {
    var that = this;
    wx.uploadFile({
      url: app.globalData.url + "/commentReply/reply/comment",
      filePath: that.data.images[0],
      name: 'picMsg',
      formData: {
        'commentId': commentId,
        'openId': openId,
        'textMsg': replyMsg,
      },
      success: function (res) {
        var data = JSON.parse(res.data)
        console.log(data, "发布评论的返回信息")
        that.showCommentInfo();
        that.showCardInfo();
        that.setData({
          myedit: ""
        });
      }
    })
  },
  //回复评论的回复的图片
  replyReplyImg() {
    var that = this;
    wx.uploadFile({
      url: app.globalData.url + "/commentReply/reply/reply",
      filePath: that.data.images[0],
      name: 'picMsg',
      formData: {
        'beReplyId': replyId,
        'openId': openId,
        'textMsg': replyMsg,
      },
      success: function (res) {
        var data = JSON.parse(res.data)
        console.log(data, "发布评论的返回信息")
        that.showCommentInfo();
        that.showCardInfo();
        that.setData({
          myedit: ""
        });
      }
    })
  },

  editComment(e) {
    commentId = "";
    replyId = "";
    this.setData({
      hiddenTitle: "评论...",
      myedit: textMsg,

      focus: true,
      button_i_class: "fa-paper-plane",
      button_view_class: "gift-but1",
      button_id: "send"
    });
  },
  //唤起键盘得到传参
  getKeyboard(e) {
    this.setData({
      focus: false,
    })
    var that = this;
    setTimeout(function () {
      commentId = "";
      replyId = "";
      if (e.currentTarget.dataset.commentid != null && e.currentTarget.dataset.commentid.length > 0) {
        commentId = e.currentTarget.dataset.commentid;
        replyId = "";
        var replyName = e.currentTarget.dataset.name
        that.setData({
          hiddenTitle: "回复：" + replyName,
          myedit: replyMsg
        })
      }
      if (e.currentTarget.dataset.replyid != null && e.currentTarget.dataset.replyid.length > 0) {
        commentId = "";
        replyId = e.currentTarget.dataset.replyid;
        var replyName = e.currentTarget.dataset.name;
        that.setData({
          hiddenTitle: "回复：" + replyName,
          myedit: replyMsg,
        })
      }
      that.setData({
        button_i_class: "fa-paper-plane",
        button_view_class: "gift-but1",
        button_id: "send",
        focus: true
      })
    }, 250)

  },
  //点赞
  addCardLikeNum(e) {
    var cardId = e.currentTarget.dataset.id;
    var that = this;
    if (clickDisabled) {
      clickDisabled = false;
      wx.request({
        url: app.globalData.url + "/card/like/{cardid}?cardId=" + cardId + "&openid=" + openId,
        method: 'POST',
        success: function (res) {
          console.log(res.data);

          if (res.data == "点赞成功") {
            that.data.json.cardInfo.likesNum += 1;
            // that.data.json.cardInfo.liked = true;
            that.setData({
              havelike: true,
              json: that.data.json,
            })
          } else {
            that.data.json.cardInfo.likesNum -= 1;
            // that.data.json.cardInfo.liked = false;

            that.setData({
              havelike: false,
              json: that.data.json,
            })
          }
          //赋值给liked返回给前页
          that.data.json.cardInfo.liked = that.data.havelike

          clickDisabled = true;
          console.log(that.data.json);
          // that.toPreData(that.data.json);



        },
        fail: function (res) {
          console.log("点赞失败");
          console.log(res);
        },
        complete: function (res) {},
      })
    }

  },
  addCardLikeNum2(e) {
    var cardId = e.currentTarget.dataset.id;
    var that = this;
    // var cardId = that.data.json[index].cardInfo.cardId;
    if (!clickDisabled) {
      return;
    }
    if (that.data.json.cardInfo.liked) {
      that.data.json.cardInfo.likesNum -= 1;
    } else {
      that.data.json.cardInfo.likesNum += 1;
    }
    that.data.json.cardInfo.liked = !that.data.json.cardInfo.liked;
    clickDisabled = false;
    console.log(clickDisabled, "点赞前");
    that.setData({
      json: that.data.json,
      havelike: !that.data.havelike
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
  //给上一个页面传参
  // toPreData(data){

  //   var pages = getCurrentPages(); // 获取页面栈
  //   // var currPage = pages[pages.length - 1]; // 当前页面
  //   var prevPage = pages[pages.length - 2]; // 上一个页面
  //   console.log(prevPage);
  //   prevPage.setData({
  //     detail: data
  //   })
  // },
  //评论回复点赞
  addCommentLikeNum(e) {

    var that = this;
    var commentId = e.currentTarget.dataset.commentid;
    var index = e.currentTarget.dataset.index;
    var likeArr = that.data.comment_havelike;
    if (!clickDisabled) {
      return;
    }
    if (likeArr[index]) {
      that.data.commentInfo[index].likesNum -= 1;
    } else {
      that.data.commentInfo[index].likesNum += 1;
    }
    likeArr[index] = !likeArr[index];
    that.setData({
      comment_havelike: likeArr,
      commentInfo: that.data.commentInfo
    })
    wx.request({
      url: app.globalData.url + "/comment/like/{commentId}?cardId=" + cardId + "&commentId=" + commentId + "&openId=" + openId,
      method: 'POST',
      success: function (res) {
        if (res.statusCode == '200') {
          clickDisabled = true;
        } else {
          console.log("点赞失败", `状态码为${res.statusCode}`);
        }
      },
      fail: function (res) {
        console.log("后台无数据返回");
      },
      complete: function (res) {},
    })
  },
  chooseImage(e) {
    var that = this;
    setTimeout(function () {
      if (!islock) {
        wx.chooseImage({
          count: 3,
          sizeType: ['original'], //可选择原图或压缩后的图片
          sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
          success: res => {
            const images = that.data.images.concat(res.tempFilePaths)
            console.log(images, "images");
            that.setData({
              // images: images.length <= 1 ? images : images.slice(1, 2),
              images,
              button_i_class: "fa-paper-plane",
              button_view_class: "gift-but1",
              button_id: "send",
              focus: true
            })
          }
        })
      }
    }, 100)

  },
  removeImg() {
    var that = this;
    islock = true
    wx.showModal({
      title: '提示',
      content: '确定要删除图片吗？',
      success: function (sm) {
        if (sm.confirm) {
          // 用户点击了确定 可以调用删除方法了
          that.setData({
            images: [],
            button_i_class: "fa-paper-plane",
            button_view_class: "gift-but1",
            button_id: "send",
            focus: true,
          });
          setTimeout(function () {
            islock = false
          }, 100)

        } else if (sm.cancel) {
          that.setData({
            button_i_class: "fa-paper-plane",
            button_view_class: "gift-but1",
            button_id: "send",
            focus: true
          })
          setTimeout(function () {
            islock = false
          }, 100)
        }
      }
    })

  },
  showImg() {
    var that = this;
    // for (let i in this.data.json) {
      console.log(this.data.json.pictureInfo.length);

      var length = that.data.json.pictureInfo.length;
      var picture = that.data.json.pictureInfo;
      let mode = '';
      switch (length) {
        case 1:
          mode = 'widthFix';
          // let item = {picInfo: [{ pic: picture[0], imgMode: mode }]};
          // that.data.json2.push(item);
          var temp = [];
          temp.push({ pic: picture[0], imgMode: mode });
          that.data.json.pictureInfo.length = 0;
          // that.data.json[i].pictureInfo = temp;
          that.data.json.pictureInfo = that.data.json.pictureInfo.concat(temp);

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
          that.data.json.pictureInfo.length = 0;
          that.data.json.pictureInfo = that.data.json.pictureInfo.concat(temp);
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
          that.data.json.pictureInfo.length = 0;
          that.data.json.pictureInfo = that.data.json.pictureInfo.concat(temp);

        break;
      case 4:
        var temp = [];
        mode = 'aspectFill';
        for (let index in picture) {
          let item = {
            pic: picture[index],
            imgMode: mode
          };
          temp.push(item);
        }
        // that.data.json2.push({ picInfo: temp });
        that.data.json.pictureInfo.length = 0;
        that.data.json.pictureInfo = that.data.json.pictureInfo.concat(temp);

        break;
    }
    // }
    that.setData({
      json: that.data.json
    })
    console.log(that.data.json);

  },
  previewImg(e) {
    var that = this;
    var imgs = that.data.json.pictureInfo2;
    var current = that.data.json.pictureInfo2[e.currentTarget.dataset.index];
    // var newArr = [];
    // for (let item of imgs) {
    //   console.log(item);
    //   newArr = newArr.concat(item.pic);
    // }
    wx.previewImage({
      current,
      // urls: that.data.json.pictureInfo,
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
  share(e) {
    wx.navigateTo({
      url: '/pages/square/share/share?cardId=' + cardId,
    })
  },
  //得到保存的输入信息
  getSaveMsg() {
    if (commentId != "" || replyId != "") {
      if (replyMsg != "") {
        this.setData({
          myedit: replyMsg
        })
        console.log(this.data.myedit);
      }
    } else if (textMsg != "") {
      this.setData({
        myedit: textMsg
      })
    }
  },
  initInnerAudioContext() {
    //创建
    innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.onPlay((res) => {
      is_speaking = true
      this.setData({
        record_action: 'fa-pause'
      })
      this.start_record_time()
      console.log('开始播放' + ' is_speaking = ' + is_speaking)
    })
    innerAudioContext.onPause((res) => {
      is_speaking = false
      //暂停时间变动
      clearInterval(record_time)
      this.setData({
        record_action: 'fa-play'
      })
      console.log('暂停播放' + ' is_speaking = ' + is_speaking)
    })
    innerAudioContext.onStop((res) => {
      is_speaking = false
      console.log('行为结束播放, 杀死录音' + ' is_speaking = ' + is_speaking)
    })
    innerAudioContext.onEnded((res) => {
      is_speaking = false
      clearInterval(record_time)
      this.data.second = 0;
      this.setData({
        second: this.data.second,
        record_action: 'fa-play'
      })
      console.log('自然结束播放' + ' is_speaking = ' + is_speaking)
    })
  },
  //播放录音
  playvoice: function (e) {
    var that = this;
    that.cover_video(); //停止
    var index = e.currentTarget.dataset.index;
    if (!is_speaking) {
      var recordSrc = that.data.json.audioInfo[1];
      recordSrc = that.data.weburl + recordSrc.substring(13, recordSrc.length);
      innerAudioContext.src = recordSrc
      innerAudioContext.seek(that.data.second)
      innerAudioContext.play();
    } else {
      innerAudioContext.pause()
    }
  },
  //录音时间变化
  start_record_time() {
    var that = this;
    record_time = setInterval(() => {
      that.data.second += 0.1;
      that.setData({
        second: that.data.second,
        second2: parseInt(that.data.second)
      })
    }, 100);
    // record_time = setInterval(() => {
    //   that.data.json.record_temp_time += 0.1;
    //   that.setData({
    //     json: that.data.json
    //   })
    // }, 100);
  },

  //显示送礼物页面
  sendGift() {
    if (this.data.giftmall) {
      this.setData({
        giftmall: false,
      })
    } else {
      this.setData({
        giftmall: true,
      })
    }
  },
  


  //跳转到用户详情页
  toOtgerInfo(e) {

    var id = e.currentTarget.dataset.index;
    console.log("this id is:" + id);
    wx.navigateTo({
      url: '/pages/othersInfo/othersInfo?openId=' + id,
    })

  },
  //得到收到的礼物
  giftsGetted() {
    var that = this;
    console.log("得到收到的礼物receiverId:", that.data.receiverId)
    wx.request({
      url: app.globalData.url + '/customerSendgift/selectAllGiftsGettedByType',
      method: "GET",
      // header: "accept: */*;Content-Type: application/json",
      data: {
        openId: that.data.beConcernId,
        cardId: cardId,
        sendgiftType: 2
      },
      success: function (res) {
        console.log(res, "成功得到我的礼物")

        var giftList = [];
        // if (res.data.length > 3) {
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].icon = that.getImgPic(res.data[i].icon);
          giftList.push(res.data[i]);
        }
        // } else {
        //   console.log("数据小于3")
        //   for (var i in res.data) {
        //     res.data[i].icon = that.getImgPic(res.data[i].icon);
        //     giftList.push(res.data[i]);
        //   }
        //   if (res.data.length < 3) {
        //     for (var i = res.data.length; i < 3; i++) {
        //       giftList.push(null);
        //     }
        //   }
        // }


        that.setData({
          giftList: giftList,
        })
      },
      fail: function (res) {
        console.log(res, "得到我的礼物失败")
      }
    })
  },
  //得到图片的路径
  getImgPic: function (icon) {
    var src = "";
    if (icon.split("/var/www/html").length > 1) {
      src = app.globalData.urlb + icon.split("/var/www/html")[1];
      //console.log(src , "处理后的图片路径")
    }

    return src;
  }
})