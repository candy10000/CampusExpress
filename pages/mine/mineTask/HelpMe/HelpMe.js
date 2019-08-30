// pages/mine/mineTask/HelpMe/HelpMe.js
var app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的初始数据
   */
  data: {
    onOff: false,
    currentTab: 0,
    schoolIndex: 0,
    schoolList: ["福建农林大学", "福州大学", "福建师范大学"],
    taskListTmp: [],
    giftmall: false

  },

  /**
   * 组件的方法列表
   */
  methods: {
    cancel(e) {
      var that = this;
      console.log(e.currentTarget);
      var cure = e;

      var that = this;

      wx.showModal({
        title: '你真的想要取消任务吗?',
        content: '你真的想要取消任务吗?',
        success(e) {
          if (e.confirm == true) {
            wx.request({
              url: app.globalData.url + '/task/cancelTask/node',
              method: "POST",
              data: {
                taskId: cure.currentTarget.id,
                // tId: e.currentTarget.dataset.tId,
                openId: app.getOpenid(app.globalData.urlb)
              },
              success: function (res) {

                if (res.statusCode == 200) {
                  wx.showToast({
                    title: '取消任务成功',
                    icon: 'SUCCESS'
                  })
                  //删除一个卡片
                  var taskList = that.data.taskList;
                  taskList.splice(cure.currentTarget.dataset.index, 1);
                  that.setData({
                    taskList: taskList,
                  })
                } else {
                  wx.showModal({
                    title: '取消任务失败',
                    content: "取消任务失败",
                  })
                }


                console.log(res.data);
              },
              fail: function (res) {
                wx.showModal({
                  title: '取消任务失败',
                  content: res.data,
                })
              }
            })

          }
        }
      })

    },
    chooseGift(e) {
      var that = this
      console.log(e , "显示商城按钮传过来的值")
      var id = e.currentTarget.dataset.id
      var taskId = e.currentTarget.dataset.taskid;
      that.setData({
        receiverId: id,
        giftmall: true,
        sendgiftTaskId: taskId
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
    },
    //得到收到的礼物
    giftsGetted(taskId, openId) {
      return new Promise((resolve, reject) => {
        var that = this;
        wx.request({
          url: app.globalData.url + '/customerSendgift/selectAllGiftsGettedByType',
          method: "GET",
          data: {
            openId,
            taskId
          },
          success: function (res) {
            console.log(res, "成功得到我的礼物")

            var giftList = [];
            for (let item of res.data) {
              item.icon = that.getImgPic(item.icon);
              giftList.push(item);
            }
            console.log(giftList, "giftList");
            // if (res.data.length > 3) {
            //   for (var i = 0; i < 3; i++) {
            //     res.data[i].icon = that.getImgPic(res.data[i].icon);
            //     giftList.push(res.data[i]);
            //   }
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

            resolve(giftList);
            // that.setData({
            //   giftList: giftList,
            // })
          },
          fail: function (res) {
            console.log(res, "得到我的礼物失败")
          }
        })
      })
    },
    showGift() {
      this.setData({
        giftmall: true
      })
    },
    hideGiftMall(e) {
      var that = this
      that.setData({
        giftmall: false
      })
    },

    pickup(e) {
      console.log(e);
      var curid = e;
      var that = this;
      wx.showModal({
        title: '你真的要确认完成任务嘛?',
        content: '你真的要确认完成任务嘛?',
        success(e) {
          if (e.confirm == true) {
            wx.request({
              url: app.globalData.url + '/task/confirmEnd/node',
              data: {
                openId: app.getOpenid(app.globalData.url),
                taskId: curid.currentTarget.id,
                tId: curid.currentTarget.dataset.tid
              },
              success: function (res) {

                if (res.data.message == "success") {
                  wx.showToast({
                    title: '确认完成成功',
                    icon: 'SUCCESS'
                  })
                  //改变一个卡片的状态
                  var taskList = that.data.taskList;
                  taskList[curid.currentTarget.dataset.index].status = 1;
                  that.setData({
                    taskList: taskList,
                  })
                } else {
                  wx.showModal({
                    title: '确认完成失败',
                    content: '确认完成失败',
                  })
                }
                console.log(res.data);
              }
            })

          }
        }
      })


    },
    //删除已完成已取消订单
    deal(e) {
      var that = this;
      console.log(e.currentTarget);
      var cure = e;
      wx.showModal({
        title: '你真的想要删除任务吗?',
        content: '你真的想要删除任务吗?',
        success(e) {
          if (e.confirm == true) {
            wx.request({
              url: app.globalData.url + '/tasknode/del',
              data: {
                taskId: cure.currentTarget.id,
                "tId": cure.currentTarget.dataset.tid,
                "openId": app.getOpenid(app.globalData.urlb)
              },
              success: function (res) {
                console.log(res, "删除成功返回的值-----------------------")
                wx.showToast({
                  title: '删除任务成功',
                  icon: 'SUCCESS'
                })
                //删除一个卡片
                var taskList = that.data.taskList;
                taskList.splice(cure.currentTarget.dataset.index, 1);
                that.setData({
                  taskList: taskList,
                })
              },
              fail: function (res) {
                wx.showModal({
                  title: '取消任务失败',
                  content: res.data,
                })
                console.log(res.data);

              }
            })

          }
        }
      })
    },


    //隐藏礼物商城
    hiddenGiftsGetted() {
      this.setData({
        giftmall: false
      })
    },
    //跳转到用户详情页
    toOtgerInfo(e) {

      var id = e.currentTarget.dataset.id;
      console.log("this id is:" + id);
      wx.navigateTo({
        url: '/pages/othersInfo/othersInfo?openId=' + id,

      })
    },


    gotoEnvelope(e) {
      var id = e.currentTarget.dataset.id
      var idx = e.currentTarget.dataset.index
      console.log('taskId-->' + id)
      console.log(idx)
      console.log(this.data.taskList[idx])
      wx.navigateTo({
        url: '/pages/mine/mineTask/HelpMe/EnvelopDetail/EnvelopDetail?taskId=' + id + '&publisherId=' + this.data.taskList[idx].helpSeekerId
      })
    },

    cancelTask(data) {
      console.log(data)
    },

    onLoad() {

    },
  },
  lifetimes: {
    attached() {
      var that = this;
      wx.request({
        url: app.globalData.url + '/task/selectMyTaskForHelp',
        data: {
          openId: app.getOpenid(app.globalData.url),
          size: 10000
        },
        success: function (res) {
          console.log("===gift===");
          console.log("/task/selectMyTaskForHelp", res.data);
          for (var i = 0, len = res.data.records.length; i < len; i++) {
            if (res.data.records[i].userPic.split("/var/www/html").length > 1) {
              res.data.records[i].userPic = app.globalData.urlb + res.data.records[i].userPic.split("/var/www/html")[1];
            }
          }
          for (var i = 0, len = res.data.records.length; i < len; i++) {
            var date = new Date(res.data.records[i].iniTime.replace(/\-/g, '/'));
            var cardTime = '';
            var chnNumChar = ["", "一", "二", "三", "四", "五", "六", "日"];
            var month = date.getMonth() + 1;
            // cardTime = "周" + chnNumChar[date.getDay()] + " " + month + "月" + date.getDate() + "日 " +
            //   date.getHours() + ":" + date.getMinutes()
            var minutes = date.getMinutes();
            if (minutes < 10) {
              minutes = "0" + minutes;
            }
            cardTime = "周" + chnNumChar[date.getDay()] + " " + date.getHours() + ":" + minutes
            res.data.records[i].cardTime = cardTime;
          }
          //礼物显示
          for (let i in res.data.records) {
            let taskId = res.data.records[i].taskId;
            let openId = res.data.records[i].openId;
            that.giftsGetted(taskId, openId).then(rs => {
              console.log(rs, "giftlist2");
              res.data.records[i].giftList = rs
              res.data.records[i].giftListLength = rs.length;

              console.log(res.data);
              that.setData({
                taskList: res.data.records
              })
            });

          }
          // res.data.records[0].giftList = that.data.taskListTmp[0].giftList;
          // res.data.records[1].giftList = that.data.taskListTmp[1].giftList;
          // res.data.records[2].giftList = that.data.taskListTmp[2].giftList;
          // that.setData({
          //   taskList: res.data.records
          // })
        }
      })
    }
  }
})