// pages/mine/mineTask/HelpMe/HelpMe.js
var app = getApp();
Component({
  /**
   * 组件的属性列表
   */

  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    currentTab: 0,
    schoolIndex: 0,
    schoolList: ["福建农林大学", "福州大学", "福建师范大学"],
    taskList: [
      {
        taskId: 20190001,
        nickName: '大杰瑞',
        initiatorId: '000001',
        initiatorPic: app.globalData.urlb + '/images/pic/tom.jpg',
        gender: 'm',
        initiatorTitle: '感动中国',
        contactInfo: '手机：123123123',
        decs: '正在等奶茶好无聊又要顺便带的吗？正在等奶茶好无聊又要顺便带的吗？正在等奶茶好无聊又要顺便带的吗？',
        tPlace: '学生街道',
        place: '南区全区域',
        label: '#我要帮Ta #餐食打包',
        reward: 200,
        iniTime: '周日 14:32',
        taskType: 1,
        overTime: '周日 15:32',
        taskState: 2,
        giftListLength: 5,
        giftList: {
          'donuts': {
            giftPic: '/pages/pic/甜甜圈.png',
            giftName: '甜甜圈',
            giftNum: 3,
          },
          'chips': {
            giftPic: '/pages/pic/薯条.png',
            giftName: '薯条',
            giftNum: 2,
          },
          'drumstick': {
            giftPic: '/pages/pic/鸡腿.png',
            giftName: '鸡腿',
            giftNum: 1,
          },
          'watermelon': {
            giftPic: '/pages/pic/西瓜.png',
            giftName: '西瓜',
            giftNum: 1,
          },
          'candy': {
            giftPic: '/pages/pic/糖果.png',
            giftName: '糖果',
            giftNum: 10,
          },
        },
      },

      {
        taskId: 20190002,
        nickName: '小汤姆',
        initiatorId: '000002',
        initiatorPic: app.globalData.urlb + '/pic/jerry.jpg',
        gender: 'm',
        initiatorTitle: '见习雷锋',
        contactInfo: '微信：123123123',
        decs: '想听一首《the road is lonesome》',
        tPlace: '不需要地点',
        place: '不需要地点',
        label: '#找Ta帮我#灵魂歌手',
        reward: 100,
        iniTime: '周日 15:32',
        taskType: 2,
        overTime: '周日 16:32',
        taskState: 0,
        giftListLength: 5,
        giftList: {
          'donuts': {
            giftPic: '/pages/pic/甜甜圈.png',
            giftName: '甜甜圈',
            giftNum: 3,
          },
          'chips': {
            giftPic: '/pages/pic/薯条.png',
            giftName: '薯条',
            giftNum: 2,
          },
          'drumstick': {
            giftPic: '/pages/pic/鸡腿.png',
            giftName: '鸡腿',
            giftNum: 1,
          },
          'watermelon': {
            giftPic: '/pages/pic/西瓜.png',
            giftName: '西瓜',
            giftNum: 1,
          },
          'candy': {
            giftPic: '/pages/pic/糖果.png',
            giftName: '糖果',
            giftNum: 10,
          },
        },
      },

      {
        taskId: 20190003,
        nickName: '产品精灵',
        initiatorId: '000003',
        initiatorPic: app.globalData.urlb + '/pic/cute.jpg',
        gender: 'f',
        initiatorTitle: '少先队员',
        contactInfo: '手机：123123123',
        decs: '有人在九堂吗，带份玉米饼？有人在九堂吗，带份玉米饼？有人在九堂吗，带份玉米饼？',
        tPlace: '第九食堂',
        place: '南二 275',
        label: '#找Ta帮我 #餐食打包',
        reward: 300,
        iniTime: '周日 14:32',
        taskType: 2,
        overTime: '周日 16:32',
        taskState: 1,
        giftListLength: 5,
        giftList: {
          'donuts': {
            giftPic: '/pages/pic/甜甜圈.png',
            giftName: '甜甜圈',
            giftNum: 3,
          },
          'chips': {
            giftPic: '/pages/pic/薯条.png',
            giftName: '薯条',
            giftNum: 2,
          },
          'drumstick': {
            giftPic: '/pages/pic/鸡腿.png',
            giftName: '鸡腿',
            giftNum: 1,
          },
          'watermelon': {
            giftPic: '/pages/pic/西瓜.png',
            giftName: '西瓜',
            giftNum: 1,
          },
          'candy': {
            giftPic: '/pages/pic/糖果.png',
            giftName: '糖果',
            giftNum: 10,
          },
        },
      },
    ],


  },

  /**
   * 组件的方法列表
   */
  methods: {
    onLoad() {

    },

    cancel(e) {
      console.log(e.currentTarget.id);
      wx.request({
        url: app.globalData.url + '/task/cancelTask/node',
        data: {
          taskId: e.currentTarget.id,
          tId: e.currentTarget.tId,
          openId: app.getOpenid(app.globalData.url)
        }, success: function (res) {
          console.log(res.data);
        }
      })
    },
    pickup(e) {
      console.log(e);
      wx.request({
        url: app.globalData.url + '/task/confirmEnd/node',
        data: {
          openId: app.getOpenid(app.globalData.url),
          taskId: e.currentTarget.id,
          tId: e.currentTarget.dataset.tid
        }, success: function (res) {
          console.log(res.data);
        }
      })

    }

  },
  lifetimes: {
    attached() {
      var that = this;

      wx.request({
        url: app.globalData.url + '/task/selectMyTaskHelp',
        data: {
          openId: app.getOpenid(app.globalData.url)
        }, success: function (res) {
          console.log(res.data);

          that.setData({
            taskList: res.data.records
          })
        }
      })

    }
  }

})
