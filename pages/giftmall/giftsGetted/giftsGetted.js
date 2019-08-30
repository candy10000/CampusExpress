// pages/giftmall/giftsGetted/giftsGetted.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    openId: String
  },
  options: {
    addGlobalClass: true,
  },

  /**
   * 组件的初始数据
   */
  data: {
    giftList: [],
    selectGift: [],
    giftInfoList: [],
    giftInfo: false,
    current: 0,
    gift_desc: false,
    giftDetail: {
      cantSee: true,
      icon: '',
      desc: ''
    } //礼物介绍信息
  },
  attached() {
    this.giftsGetted();
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //得到我收到的礼物
    giftsGetted() {
      var that = this;
      wx.request({
        url: app.globalData.url + '/customerSendgift/selectAllGiftsGetted',
        method: "GET",
        data: {
          openId: that.properties.openId != "" ? that.properties.openId : app.getOpenid()
        },
        success: function (res) {
          console.log(res, "成功得到我的礼物")
          console.log(typeof app.getOpenid());
          console.log(that.properties.openId);
          var giftList = that.data.giftList;
          var srotyList = '';
          for (var i in res.data) {
            res.data[i].icon = that.getImgPic(res.data[i].icon);
            res.data[i].story = false;
            giftList.push(res.data[i]);
          }
          if (res.data.length < 5) {
            for (var i = res.data.length; i < 5; i++) {
              giftList.push(null)
            }
          }



          that.setData({
            giftList: giftList,
            giftDetail: {
              cantSee: true,
              icon: '',
              desc: ''
            }
          })
        },
        fail: function (res) {
          console.log(res, "得到我的礼物失败")
        }
      })
    },

    //选中礼物，显示礼物详情
    giftInfo(e) {
      var that = this;
      var index = e.currentTarget.dataset.index;
      console.log(index, "选中的参数")
      var selectGift = this.data.giftList[index];
      var openId = that.properties.openId == "" ? app.getOpenid() : that.properties.openId;
      that.hideStory();
      wx.request({
        url: app.globalData.url + '/customerSendgift/selectDetailGiftsGetted',
        method: "GET",
        data: {
          giftId: selectGift.giftId,
          openId
        },
        success: function (res) {
          console.log(res.data, "成功得到我的礼物详细信息")
          var giftInfoList = [];
          for (var i in res.data) {
            res.data[i].icon = that.getImgPic(res.data[i].icon);
            giftInfoList.push(res.data[i])
          }
          if (res.data.length < 5) {
            for (var i = res.data.length; i < 5; i++) {
              giftInfoList.push(null)
            }
          }
          that.setData({
            giftInfoList: giftInfoList,
            selectGift: selectGift,
            giftInfo: true
          })
        },
        fail: function (res) {
          console.log(res, "得到我的礼物详细信息失败")
        }
      })

    },
    hiddenGiftIngo() {
      this.setData({
        giftInfoList: [],
        selectGift: [],
        giftInfo: false
      })
    },
    //选中的礼物
    showStory: function (e) {
      console.log(e, "选中礼物")
      var idx = e.currentTarget.dataset.idx;
      var giftDetail = e.currentTarget.dataset.giftdetail;
      if(this.data.idx == idx){
        giftDetail.cantSee = !this.data.giftDetail.cantSee;
        this.setData({
          giftDetail,
          idx
        })
      }else{
        giftDetail.cantSee = false;
        this.setData({
          giftDetail,
          idx
        })
      }

      // var List = this.data.giftList;
      // for (var i in List) {
      //   console.log(List[i], "List[idx].story")
      //   if (List[i] == null)
      //     continue;
      //   if (i == idx)
      //     List[idx].story = !List[idx].story;
      //   else
      //     List[i].story = false;
      // }
      //动态获取top值
      // this.createSelectorQuery().select(".giftItem").boundingClientRect().exec((res) => {
      //   let top = res[0].height;
      //   console.log(top, "height");
      //   this.setData({
      //     initTop: top * 0.2,
      //     itemTop: (164 + 6) * idx,
      //     giftList: List

      //   })
      // })
      // this.setData({
      //   giftList: List
      // })
    },
    //隐藏礼物故事
    hideStory: function () {
      this.data.giftDetail.cantSee = true;
      this.setData({
        giftDetail: this.data.giftDetail
      })
      // var List = this.data.giftList;
      // for (var i in List) {
      //   if (List[i] == null)
      //     continue;
      //   List[i].story = false;
      // }
      // this.setData({
      //   giftList: List
      // })
    },
    //跳转到用户详情页
    toOtgerInfo(e) {

      var id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '/pages/othersInfo/othersInfo?openId=' + id,
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
  }
})