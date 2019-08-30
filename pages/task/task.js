// pages/task/task.js
const app = getApp();

var startX, endX, tempMarginLeft = 20
var moveFlag = true; // 判断执行滑动事件

var moveTimer = null;

//触屏开始点坐标
var startDot = {}
//触屏到点坐标
var endDot = {}
var lastMarginLeft = 0
var scrollTime = 0
var scrollInterval = undefined

var scroll = {
  time: 0,
  interval: undefined,
  top: 0,
  startTop: undefined
}
Component({
    /**
     * 组件的属性列表
     */
    id: 'task',

    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
      curTaskPage: 1,
      isHiddenTop: false,
      isHiddenPick: true,
      windowHeight: app.globalData.phoneInfo.windowHeight,
        schoolIndex: 0,
        schoolList: ["福建农林大学", "福州大学", "福建师范大学"],
        ordersDTOList: [],
        order: {
            "id": "223",
            "userid": "124521",
            "totalprice": 2,
            "expectTime": "1"
        },
        openPicker: false,
        needAnimation: false,
        contentHeight: 0,
        radio_checked: [true, false, false],
        taskPlaceArray: [
            ["无需地点", "食堂", "快递点", "超市", "小店"],
            ['无需地点']
        ],
        personPlaceArray: [
            ["无需地点", "宿舍", "教学楼", "图书馆", "操场", "景点"],
            ["无需地点"],
            []
        ],
        tagArray: [
            ["生活类", "互动类", "问答类"],
            ["生活类其他", "餐食打包", "快递代领", "商品代买", "二手交易", "共享借用", "拼单合买", "资源分享", "出行拼车"]
        ],
        taskplace_index: 0,
        personplace_index: 0,
        label_index: 0,

        tagMultiIndex: [0, 0, 0],
        placeMultiIndex: [0, 0, 0],
        minePlaceMultiIndex: [0, 0, 0],

        class_checked: [true, false, false, false],
        searchText: '',
        searchList: [], //存储tasklist内容
        isSearch: false, //是否处于搜索状态
        flag: 0, //小标签的编号
        total: 0, //任务卡片总数
        isFocus: false, //搜索框是否被
        page: 0,
        ani1: '',
        ani2: '',
        ani3: '',
        ani4: '',
        postTask: false,
    },

    /**
     * 组件的方法列表
     */
    options: {
      addGlobalClass: true
    },

    /*
      组建进入页面节点树时调用
    */

    attached: function () {

      console.log(app.globalData.phoneInfo)

        this.initInfo();
        //回到顶部
        wx.pageScrollTo({
            scrollTop: 0,
            duration: 0
        })

        // wx.request({
        //   // url: getApp().globalData.url + "/task/selectTaskPlazaForHelp",
        //   url: "https://xcx.gaoxiao114.cn:8886/task/selectMyTaskHelp",
        //   data:{
        //     openId: "2019030322"
        //   },
        //   success: function (res) {
        //     console.log(res.data);
        //   }
        // })

        // wx.request({
        //   // url: getApp().globalData.url + "/task/selectTaskPlazaForHelp",
        //   url: "https://xcx.gaoxiao114.cn:8886/task/selectMyTaskForHelp",
        //   data: {
        //     openId: "2019030322"
        //   },
        //   success: function (res) {
        //     console.log(res.data);
        //   }
        // })


    },

    methods: {
        getData() {
            var that = this;
            // console.log(1)
            wx.request({
                // url: getApp().globalData.url + "/task/selectTaskPlazaForHelp",
                url: app.globalData.url + "/task/selectCustomerTaskPlaza",
                method: 'POST',
                data: {
                    openid: app.getOpenid(app.globalData.url),
                },
                //这里还要传pages

                success: function (res) {
                    //用户头像路径设置
                    for (var i = 0, len = res.data.records.length; i < len; i++) {
                        if (res.data.records[i].userPic.split("/var/www/html").length > 1) {
                            res.data.records[i].userPic = app.globalData.urlb + res.data.records[i].userPic.split("/var/www/html")[1];
                        }
                    }
                    console.log("res.data.records:");
                    console.log(res.data.records);
                    that.getTheDay(res);

                    that.setData({
                        page: 2,
                        class_checked: [true, false, false, false],
                        taskList: res.data.records,
                    })
                    that.move2right();
                }
            })


            var that = this;
            wx.getSystemInfo({
                success: function (res) {
                    that.setData({
                        //动态根据手机分辨率来计算内容的高度（屏幕总高度-顶部筛选栏的高度）
                        contentHeight: (res.windowHeight - 72 * res.screenWidth / 750)
                    });
                }
            })


            // wx.request({
            //   // url: getApp().globalData.url + "/task/selectTaskPlazaForHelp",
            //   url: "https://xcx.gaoxiao114.cn:8886/task/selectMyTaskHelp",
            //   data:{
            //     openId: "2019030322"
            //   },
            //   success: function (res) {
            //     console.log(res.data);
            //   }
            // })

            // wx.request({
            //   // url: getApp().globalData.url + "/task/selectTaskPlazaForHelp",
            //   url: "https://xcx.gaoxiao114.cn:8886/task/selectMyTaskForHelp",
            //   data: {
            //     openId: "2019030322"
            //   },
            //   success: function (res) {
            //     console.log(res.data);
            //   }
            // })


        },
        initInfo() {
            var that = this;
            // console.log(1)
            // if(typeof(that.data.taskList) == 'undefined' || that.data.taskList.length == 0){
            //   console.log("任务广场数据为空");
            //   return;
            // }
            // var tagFather = (that.data.flag == 0) ? '' : that.data.taskList[0].tagFather;
            wx.request({
                // url: getApp().globalData.url + "/task/selectTaskPlazaForHelp",
                url: app.globalData.url + "/task/selectCustomerTaskPlaza",
                method: 'POST',
                data: {
                    openid: app.getOpenid(app.globalData.url),
                    // tagFather
                },
                //这里还要传pages

                success: function (res) {
                    //用户头像路径设置
                    for (var i = 0, len = res.data.records.length; i < len; i++) {
                        if (res.data.records[i].userPic.split("/var/www/html").length > 1) {
                          res.data.records[i].userPic = app.globalData.urlb + res.data.records[i].userPic.split("/var/www/html")[1];
                        }
                    }
                    console.log("res.data.records:");
                    that.getTheDay(res);
                    console.log(res);
                    that.setData({
                        taskList: res.data.records,
                        total: parseInt(res.data.total)
                    })
                    console.log(that.data.total);
                }
            })

            var that = this;
            wx.getSystemInfo({
                success: function (res) {
                    that.setData({
                        //动态根据手机分辨率来计算内容的高度（屏幕总高度-顶部筛选栏的高度）
                        contentHeight: (res.windowHeight - 72 * res.screenWidth / 750)
                    });
                }
            })
        },

        //输入为空时自动刷新页面内容
        initInfo2() {
            var that = this;
            // console.log(1)
            if (typeof (that.data.taskList) == 'undefined' || that.data.taskList.length == 0) {
                console.log("任务广场数据为空");
                return;
            }
            var tagFather = (that.data.flag == 0) ? '' : that.data.taskList[0].tagFather;
            wx.request({
                // url: getApp().globalData.url + "/task/selectTaskPlazaForHelp",
                url: app.globalData.url + "/task/selectCustomerTaskPlaza",
                method: 'POST',
                data: {
                    openid: app.getOpenid(app.globalData.url),
                    tagFather
                },
                //这里还要传pages

                success: function (res) {
                    //用户头像路径设置
                    for (var i = 0, len = res.data.records.length; i < len; i++) {
                        if (res.data.records[i].userPic.split("/var/www/html").length > 1) {
                          res.data.records[i].userPic = app.globalData.urlb + res.data.records[i].userPic.split("/var/www/html")[1];
                        }
                    }
                    console.log("res.data.records:");
                    that.getTheDay(res);
                    console.log(res);

                    that.setData({
                        taskList: res.data.records,
                        total: parseInt(res.data.total),
                        isSearch: false
                    })
                    that.triggerEvent('changeSearchInfo', [that.data.isSearch, 1]);

                    console.log(that.data.total);
                }
            })


            var that = this;
            wx.getSystemInfo({
                success: function (res) {
                    that.setData({
                        //动态根据手机分辨率来计算内容的高度（屏幕总高度-顶部筛选栏的高度）
                        contentHeight: (res.windowHeight - 72 * res.screenWidth / 750)
                    });
                }
            })
        },
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
        changeSearchInfo() {
            //用来传数据到page
            this.setData({
                isSearch: false
            })
        },
        searchInfo() {
            var that = this;
            var tagFather = "";
            console.log(that.data.taskList);
            if (that.data.taskList.length == 0 || that.data.searchText.length == 0) {
                console.log("无数据不执行搜索");
                return;
            }
            // console.log(that.data.isSearch);
            //改变搜索状态
            that.setData({
                isSearch: true
            })
            //使上拉刷新停止，为了集中显示搜索数据
            that.triggerEvent('changeSearchInfo', [that.data.isSearch, 1]);

            console.log(that.data.isSearch);
            tagFather = (that.data.flag == 0) ? '' : that.data.taskList[0].tagFather;
            console.log("tagFAther" + tagFather);
            wx.request({
                // url: getApp().globalData.url + "/task/selectTaskPlazaForHelp",
                url: app.globalData.url + "/task/selectCustomerTaskPlaza",
                method: 'POST',
                data: {
                    openid: app.getOpenid(app.globalData.url),
                    tagFather,
                    size: that.data.total //根据推荐总数设置显示数量
                },
                //这里还要传pages

                success: function (res) {
                    //用户头像路径设置
                    for (var i = 0, len = res.data.records.length; i < len; i++) {
                        if (res.data.records[i].userPic.split("/var/www/html").length > 1) {
                            res.data.records[i].userPic = app.globalData.urlb + res.data.records[i].userPic.split("/var/www/html")[1];
                        }
                    }
                    console.log("res.data.records:");
                    console.log(res.data);
                    // that.setData({
                    //   taskList: res.data.records
                    // })

                    let searchText = that.data.searchText;
                    // let taskList = that.data.taskList;
                    let taskList = res.data.records;
                    let searchList = that.data.searchList;
                    console.log(typeof searchText);
                    let temp = [];
                    // setTimeout(() => {
                    for (let item of taskList) {
                        console.log(item.label.indexOf(searchText));
                        if (item.label.indexOf(searchText) != -1 || item.decs.indexOf(searchText) != -1 || item.place.indexOf(searchText) != -1 || item.tPlace.indexOf(searchText) != -1 || item.nickName.indexOf(searchText) != -1) {
                            temp.push(item);
                        }
                    }
                    console.log(temp, "temp");
                    if (temp.length == 0) {
                        wx.showToast({
                            title: '无相符内容',
                            icon: 'none',
                            duration: 1000
                        })
                    } else {
                        console.log(temp);
                        that.setData({
                            taskList: temp
                        })
                        console.log("搜索完成");
                    }
                    // }, 200)
                }
            })

        },
        bindKeyInput: function (e) {
            if (e.detail.value.length > 0) {
                this.data.searchText = e.detail.value;
                console.log(this.data.searchText, "搜索内容");
            } else {
                this.initInfo2();
            }


        },
        confirmFilter: function () {
            var that = this;
            var temp = []; //存放筛选数据的临时数组
            var taskPlace = this.data.taskPlaceArray[1][this.data.placeMultiIndex[1]];
            var personPlace = this.data.personPlaceArray[1][this.data.minePlaceMultiIndex[1]];
            var tag = this.data.tagArray[1][this.data.tagMultiIndex[1]];
            taskPlace = taskPlace == '无需地点' ? '无' : taskPlace;
            personPlace = this.data.personPlaceArray[1][0] == '北区' ? personPlace + this.data.personPlaceArray[2][this.data.minePlaceMultiIndex[2]] : personPlace;
            personPlace = personPlace == '无需地点' ? '无' : personPlace;
            console.log(taskPlace, "任务地点");
            console.log(personPlace, "我的或他的地点");
            console.log(tag, "标签");

            console.log(this.data.radio_checked[0]);
            console.log(this.data.radio_checked[1]);
            console.log(this.data.radio_checked[2]);
            var taskType = '';
            if (this.data.radio_checked[1]) {
                taskType = "1";
            } else if (this.data.radio_checked[2]) {
                taskType = "2";
            }
            console.log(taskType, "taskType");

            wx.request({
                url: app.globalData.url + "/task/selectTaskScreening",
                method: 'POST',
                data: {
                    // openId: app.getOpenid(),
                    // size: that.data.total
                    place: personPlace,
                    tplace: taskPlace,
                    label: tag,
                    taskType
                },
                success(res) {
                    console.log(res, "筛选结果");
                    //用户头像路径设置
                    for (var i = 0, len = res.data.records.length; i < len; i++) {
                        if (res.data.records[i].userPic.split("/var/www/html").length > 1) {
                            res.data.records[i].userPic = app.globalData.urlb + res.data.records[i].userPic.split("/var/www/html")[1];
                        }
                    }

                    that.getTheDay(res);
                    console.log(res.data);

                    that.setData({
                        taskList: res.data.records
                    })
                }
            })
        },
        reloadTask: function (time) {
            var that = this;
            console.log(time);
            //无数据不执行reload
            console.log(that.data.taskList);
            if (typeof (that.data.taskList) == 'undefined' || that.data.taskList.length == 0) {
                return;
            }
            var tagFather = (that.data.flag == 0) ? '' : that.data.taskList[0].tagFather;
            console.log(tagFather)
            wx.request({
                // url: getApp().globalData.url + "/task/selectTaskPlazaForHelp",
                url: app.globalData.url + "/task/selectCustomerTaskPlaza",
                method: 'POST',
                data: {
                    openid: app.getOpenid(app.globalData.url),
                    tagFather,
                    current: time
                },

                //这里还要传pages

                success: res => {
                    //用户头像路径设置
                    for (var i = 0, len = res.data.records.length; i < len; i++) {
                        if (res.data.records[i].userPic.split("/var/www/html").length > 1) {
                            res.data.records[i].userPic = app.globalData.urlb + res.data.records[i].userPic.split("/var/www/html")[1];
                        }
                    }
                    console.log(res);
                    var taskList = that.data.taskList;
                    taskList = taskList.concat(res.data.records);
                    if(res.data.records.length > 0)
                      this.setData({ curTaskPage: this.data.curTaskPage+1 })
                    that.setData({
                        taskList
                    })
                }
            })
        },
        changeRadio: function (e) {
            var flag = e.currentTarget.dataset.type
            var truth_value = this.data.radio_checked
            switch (flag) {
                case '0':
                    truth_value = [true, false, false];
                    break
                case '1':
                    truth_value = [false, true, false];
                    break
                case '2':
                    truth_value = [false, false, true];
                    break
            }
            this.setData({
                radio_checked: truth_value
            })

        },
        taskPlaceChange: function (e) {
            console.log('taskPlace发送选择改变，携带值为', e.detail.value);
            // this.setData({
            //     taskplace_index: e.detail.value
            // })
        },
        taskPlaceColChange(e) {
            var data = {
                taskPlaceArray: this.data.taskPlaceArray,
                placeMultiIndex: this.data.placeMultiIndex
            };
            var that = this;
            console.log('taskColPlace发送选择改变，携带值为', e.detail.value);
            data.placeMultiIndex[e.detail.column] = e.detail.value;
            console.log(data.placeMultiIndex[0]);

            switch (e.detail.column) {
                case 0:
                    switch (data.placeMultiIndex[0]) {
                        case 0:
                            data.taskPlaceArray[1] = ["无需地点"];
                            break;
                        case 1:
                            data.taskPlaceArray[1] = ["北区一堂", "北区二堂", "北区三堂（教工）", "南区八堂 ", "南区九堂 ", "南区十堂（教工）", "南区青年餐厅 ", "下安十一堂 ", "下安十二堂", "下安十三堂", "东苑餐厅"];
                            break;
                        case 2:
                            data.taskPlaceArray[1] = ["映辉楼前", "拓荒广场", "京东快递"];
                            break;
                        case 3:
                            data.taskPlaceArray[1] = ["兴福兴超市", "爱慕超市", "优多便利"];
                            break;
                        case 4:
                            data.taskPlaceArray[1] = ["XX打印店", "青年烘焙", "老塞咖啡", "茶人码头", "水舞功夫", "一点点", "古茗", "蜜雪冰城", "东苑片皮鸭", "东苑水果捞"];
                            break;

                    }
                    data.placeMultiIndex[1] = 0;
                    data.placeMultiIndex[2] = 0;

                    break;
            }
            console.log(data);
            console.log(data.taskPlaceArray[1][data.placeMultiIndex[1]]);
            that.setData(data);
        },
        personPlaceChange: function (e) {
            // this.setData({
            //     personplace_index: e.detail.value
            // })
            console.log('personPlace发送选择改变，携带值为', e.detail.value);
        },
        personPlaceColChange(e) {
            var data = {
                personPlaceArray: this.data.personPlaceArray,
                minePlaceMultiIndex: this.data.minePlaceMultiIndex
            };
            console.log('发送选择改变，携带值为', e.detail.value);
            data.minePlaceMultiIndex[e.detail.column] = e.detail.value;
            console.log("e.detail.column", e.detail.column);

            switch (e.detail.column) {
                case 0:
                    switch (data.minePlaceMultiIndex[0]) {
                        case 0:
                            data.personPlaceArray[1] = ["无需地点"];
                            data.personPlaceArray[2] = [];
                            break;
                        case 1:
                            data.personPlaceArray[1] = ["北区", "南区", "桃区", "东苑"];
                            data.personPlaceArray[2] = ["全区域", "北1", "北2", "北3", "北4", "北5", "北11", "北12"];
                            break;
                        case 2:
                            data.personPlaceArray[1] = ["创新楼", "田家炳", "金综楼", "宝铃楼", "禧强楼", "诚智楼"];
                            //默认第三列为无
                            data.personPlaceArray[2] = [];
                            break;
                        case 3:
                            // data.personPlaceArray[1] = ["李长盛图书馆", "逸夫图书馆"];
                            data.personPlaceArray[1] = ["李长盛", "逸夫"];
                            data.personPlaceArray[2] = [];
                            break;
                        case 4:
                            data.personPlaceArray[1] = ["北区田径场", "北区篮球场", "下安田径场"];
                            data.personPlaceArray[2] = [];
                            break;
                        case 5:
                            data.personPlaceArray[1] = ["观音湖", "拓荒广场", "西门沙滩", "中华园", "紫荆广场"];
                            data.personPlaceArray[2] = [];
                            break;
                        case 6:
                            data.personPlaceArray[1] = ["手动输入"];
                            data.personPlaceArray[2] = [];
                            break;

                    }
                    data.minePlaceMultiIndex[1] = 0;
                    data.minePlaceMultiIndex[2] = 0;
                    break;
                case 1:
                    console.log("=====");
                    console.log(data);
                    switch (data.minePlaceMultiIndex[0]) {
                        case 1:
                            switch (data.minePlaceMultiIndex[1]) {
                                case 0:
                                    data.personPlaceArray[2] = ["全区域", "北1", "北2", "北3", "北4", "北5", "北11", "北12"];
                                    break;
                                case 1:
                                    data.personPlaceArray[2] = ["全区域", "南1", "南2", "南3", "南4"];
                                    break;
                                case 2:
                                    data.personPlaceArray[2] = ["全区域", "桃1", "桃2", "桃3", "桃4", "桃5", "桃6", "桃7", "桃8"];
                                    break;
                                case 3:
                                    data.personPlaceArray[2] = ["全区域", "东1", "东2", "东3", "东4", "东5", "东6", "东7", "东8"];
                                    break;

                            }
                            break;
                        case 6:
                            data.personPlaceArray[2] = [];
                            break;
                        default:
                            data.personPlaceArray[2] = [];
                            break;
                    }
                    data.minePlaceMultiIndex[2] = 0;
                    break;


            }
            console.log(data);
            this.setData(data);
        },
        labelChange: function (e) {
            console.log('labelChange发送选择改变，携带值为', e.detail.value)
            this.setData({
                label_index: e.detail.value
            })
        },
        labelColChange(e) {
            var data = {
                tagArray: this.data.tagArray,
                tagMultiIndex: this.data.tagMultiIndex
            };

            console.log('labelColchange发送选择改变，携带值为', e.detail.value);
            data.tagMultiIndex[e.detail.column] = e.detail.value;
            console.log(data.tagMultiIndex[0]);

            switch (e.detail.column) {
                case 0:
                    switch (data.tagMultiIndex[0]) {
                        case 0:
                            data.tagArray[1] = ["生活类其他", "餐食打包", "快递代领", "商品代买", "二手交易", "共享借用", "拼单合买", "资源分享", "出行拼车"];
                            break;
                        case 1:
                            data.tagArray[1] = ["互动类其他", "灵魂歌手", "游戏开黑", "结伴游玩", "摄影大师", "运动健身", "一周CP"];
                            break;
                        case 2:
                            data.tagArray[1] = ["问答类其他", "生活咨询", "学习答疑", "情感解惑", "求职考研", "好物安利"];
                            break;

                    }
                    data.tagMultiIndex[1] = 0;
                    data.tagMultiIndex[2] = 0;

                    break;
            }
            console.log(data);
            this.setData(data);
        },
        classChange: function (e) {
            console.log(e);
            var that = this;
            var flag = e.currentTarget.dataset.clazz;
            if(flag != this.data.page)
              this.setData({ taskList: [] })
            that.setData({ page: flag })
        },
        //发布任务
        postTask: function () {
            if (!app.globalData.isRegister) {
                app.showRegister("发布任务")
                return
            }
            var that = this;
            that.setData({
                postTask: !that.data.postTask
            })
            console.log("postTask", that.data.postTask)
        },
        postTask_hide: function () {
            var that = this;
            that.setData({
                postTask: false
            })
            console.log("postTask_hide", that.data.postTask)
        },
        onPickHeaderClick: function () {
            this.setData({
                // openPicker: !this.data.openPicker,
                // needAnimation: true
                isHiddenPick: !this.data.isHiddenPick
            })
        },
        pickup1: function (e) {
            if (!app.globalData.isRegister) {
                app.showRegister("拾起任务")
                return
            }
            var that = this;
            console.log(e);

            // this.data.ordersDTOList.push(this.data.order)

            // console.log("1111");
            // console.log(this.data.ordersDTOList.taskId);

            // var that = this;
            // wx.request({
            //   url: app.globalData.url + "/task/tasknode/" + wx.getStorageSync("openid") + "/" + e.currentTarget.id,
            //   data: {
            //     "taskId": e.currentTarget.id,
            //     "openid": wx.getStorageSync("openid"),
            //   },
            //   success: function (res) {
            //     wx.navigateTo({
            //       url: '/pages/mine/mineTask/myTask',
            //     })
            //     // console.log(that.data.ordersDTOList);
            //     console.log(res.data);
            //     // console.log(e);
            //   }, complete: function (res) {
            //     console.log("====complete===");
            //   }

            // })
            // console.log(this.data)

            //前端提示任务不能拾取
            // wx.showToast({
            //   title: '自己的任务不能拾取哦',
            //   duration: 1000,
            //   icon: 'none',
            // });
            //跳转到拾起任务后继界面
            wx.request({
                url: app.globalData.url + "/task/tasknode/" + wx.getStorageSync("openid") + "/" + e.currentTarget.id,
                data: {
                    "taskId": e.currentTarget.id,
                    "openid": wx.getStorageSync("openid"),
                },
                success: function (res) {
                    console.log(res);
                    if (res.data.code == '500') {
                        wx.showToast({
                            title: '自己的任务不能拾取哦~',
                            icon: 'none'
                        });
                    } else {
                        wx.showModal({
                            title: '',
                            content: '你确定要拾取此任务吗？',
                            success(res) {
                                if (res.confirm) {
                                    wx.showToast({
                                        title: '任务拾取成功',
                                        duration: 500
                                    });
                                    wx.navigateTo({
                                        url: '/pages/task/taskPickUp/taskPickUpHelp?taskId=' + e.currentTarget.id
                                    });
                                }
                            },
                            fail(data) {
                                wx.showToast({
                                    title: '给TA任务失败，请重试',
                                    icon: 'none'
                                })
                            },
                        })

                    }
                    // console.log(res.data);
                    // console.log(e);
                },
                complete: function (res) {
                    console.log("====complete===");
                }

            })
            // console.log(this.data)


        },
        pickup2: function (e) {
            if (!app.globalData.isRegister) {
                app.showRegister("给TA任务")
                return
            }
            console.log(e);
            var taskid = e.currentTarget.id;
            var reward = e.currentTarget.dataset.reward;
            var openid = app.getOpenid(app.globalData.url);
            // wx.request({
            //   url: app.globalData.url + "/task/tasknode/" + wx.getStorageSync("openid") + "/" + e.currentTarget.id,
            //   data: {
            //     openId: openid,
            //     taskId: taskid
            //   }, success: function (res) {
            //     console.log("===tasKNode===");
            //     console.log(res.data);

            //   }, fail: function (res) {
            //     wx.showToast({
            //       title: res.data,
            //       icon: 'loading'
            //     })

            //   }
            // })

            // wx.showToast({
            //   title: '自己不能给自己任务哦',
            //   duration: 1000,
            //   icon: 'none',
            // })
            //跳转到给TA任务后继界面
            wx.request({
                url: app.globalData.url + "/task/tasknode/" + app.getOpenid(app.globalData.url) + "/" + e.currentTarget.id,
                data: {
                    "taskId": e.currentTarget.id,
                    "openid": app.getOpenid(app.globalData.url),
                },
                success: function (resa) {
                    if (resa.data.code == '500') {
                        wx.showToast({
                            title: '自己不能给自己任务哦~',
                            icon: 'none'
                        })
                    } else {
                        wx.showModal({
                            title: '',
                            content: '你确定要给TA此任务吗，若TA设置有赏金，要先支付哦',
                            success(res) {
                                if (res.confirm) {
                                    wx.request({
                                        url: app.globalData.url + "/wx/wxPay/task/iCanHelp",
                                        data: {
                                            appid: app.globalData.appid,
                                            body: "taskPayment",
                                            mch_id: "1510474321",
                                            openid: wx.getStorageSync("openid"),
                                            out_trade_no: resa.data.orderId,
                                            total_fee: reward
                                        },
                                        success: function (res2) {
                                            wx.request({
                                                url: getApp().globalData.url + "/wx/PaySign/task",
                                                data: {
                                                    appid: app.globalData.appid,
                                                    timeStamp: parseInt(new Date().getTime() / 1000),
                                                    nonceStr: "",
                                                    package: "prepay_id=" + res2.data.pre,
                                                    signType: "MD5",
                                                },
                                                success: function (res3) {
                                                    wx.requestPayment({
                                                        timeStamp: res3.data.timeStamp,
                                                        nonceStr: res3.data.nonceStr,
                                                        package: res3.data.package,
                                                        signType: 'MD5',
                                                        paySign: res3.data.paySign,
                                                        success: function (res4) {
                                                            wx.showToast({
                                                                title: '给TA任务成功',
                                                                duration: 500
                                                            });
                                                            wx.navigateTo({
                                                                url: '/pages/task/taskPickUp/pickUpFinish?taskId=' + e.currentTarget.id
                                                            });

                                                            console.log(res4);
                                                        },
                                                        fail: function () {
                                                            wx.showToast({
                                                                title: '用户取消支付',
                                                                icon: 'loading'
                                                            })
                                                        }
                                                    })

                                                    console.log(res3.data);
                                                },
                                                fail: function () {
                                                    wx.showToast({
                                                        title: '签名接口调用失败',
                                                        icon: 'loading'
                                                    })
                                                }
                                            })

                                            console.log(res2.data);
                                        },
                                        fail: function (res) {
                                            wx.showToast({
                                                title: res.data,
                                                icon: 'loading'
                                            })
                                        }
                                    })
                                }
                            }
                        })
                    };
                },
                fail(data) {
                    wx.showToast({
                        title: '拾取失败，请重试',
                        icon: 'none'
                    })
                },
                complete: function (res) {
                    console.log("====complete===");
                }
            })
            // console.log(this.data)
        },

        toEnvelope: function (e) {
            if (!app.globalData.isRegister) {
                app.showRegister("查看发送信封")
                return
            }
            console.log("taskid=" + e.currentTarget.id);
            //跳转到任务信封发送页
            wx.navigateTo({
                url: '/pages/mine/mineTask/taskEnvelop/taskEnvelop?taskId=' + e.currentTarget.id
            })
        },
        //得到推荐
        getTuiJian() {
            var that = this;
            this.changeSearchInfo();
            this.triggerEvent('changeSearchInfo', [that.data.isSearch, 1]);

            wx.request({
                url: app.globalData.url + "/task/selectCustomerTaskPlaza",
                method: 'POST',
                header: {
                    "Content-Type": "application/json;charset=UTF-8"
                },
                data: {
                    place: '',
                    tplace: '',
                    label: '',
                    decs: '',
                    taskType: '',
                    tagFather: '',
                    size: 10,
                    current: 1,
                    openId: app.getOpenid(app.globalData.url)
                },
                success(res) {
                    //用户头像路径设置
                    for (var i = 0, len = res.data.records.length; i < len; i++) {
                        if (res.data.records[i].userPic.split("/var/www/html").length > 1) {
                            res.data.records[i].userPic = app.globalData.urlb + res.data.records[i].userPic.split("/var/www/html")[1];
                        }
                    }
                    that.getTheDay(res);
                    console.log(res.data, "推荐的任务");
                    that.setData({
                        taskList: res.data.records
                    });
                    moveFlag = true;
                }
            })
        },

        //得到生活
        getShengHuo() {
            var that = this;
            this.changeSearchInfo();
            this.triggerEvent('changeSearchInfo', [that.data.isSearch, 1]);

            wx.request({
                url: app.globalData.url + "/task/selectCustomerTaskPlaza",
                method: 'POST',
                header: {
                    "Content-Type": "application/json;charset=UTF-8"
                },
                data: {
                    place: '',
                    tplace: '',
                    label: '',
                    decs: '',
                    taskType: '',
                    tagFather: '生活类',
                    size: 10,
                    current: 1,
                    openId: app.getOpenid(app.globalData.url)
                },
                success(res) {
                    //用户头像路径设置
                    for (var i = 0, len = res.data.records.length; i < len; i++) {
                        if (res.data.records[i].userPic.split("/var/www/html").length > 1) {
                            res.data.records[i].userPic = app.globalData.urlb + res.data.records[i].userPic.split("/var/www/html")[1];
                        }
                    }
                    that.getTheDay(res);
                    console.log(res.data, "生活的任务");
                    that.setData({
                        taskList: res.data.records
                    });
                    moveFlag = true;
                }
            })
        },

        //得到互动
        getHuDong() {
            var that = this;
            this.changeSearchInfo();
            this.triggerEvent('changeSearchInfo', [that.data.isSearch, 1]);

            wx.request({
                url: app.globalData.url + "/task/selectCustomerTaskPlaza",
                method: 'POST',
                header: {
                    "Content-Type": "application/json;charset=UTF-8"
                },
                data: {
                    place: '',
                    tplace: '',
                    label: '',
                    decs: '',
                    taskType: '',
                    tagFather: '互动类',
                    size: 10,
                    current: 1,
                    openId: app.getOpenid(app.globalData.url)
                },
                success(res) {
                    //用户头像路径设置
                    for (var i = 0, len = res.data.records.length; i < len; i++) {
                        if (res.data.records[i].userPic.split("/var/www/html").length > 1) {
                            res.data.records[i].userPic = app.globalData.urlb + res.data.records[i].userPic.split("/var/www/html")[1];
                        }
                    }
                    that.getTheDay(res);
                    console.log(res.data, "互动的任务");
                    that.setData({
                        taskList: res.data.records
                    });
                    moveFlag = true;
                }
            })
        },

        //得到问答
        getWenDa() {
            var that = this;
            this.changeSearchInfo();
            this.triggerEvent('changeSearchInfo', [that.data.isSearch, 1]);

            wx.request({
                url: app.globalData.url + "/task/selectCustomerTaskPlaza",
                method: 'POST',
                header: {
                    "Content-Type": "application/json;charset=UTF-8"
                },
                data: {
                    place: '',
                    tplace: '',
                    label: '',
                    decs: '',
                    taskType: '',
                    tagFather: '问答类',
                    size: 10,
                    current: 1,
                    openId: app.getOpenid(app.globalData.url)
                },
                success(res) {
                    //用户头像路径设置
                    for (var i = 0, len = res.data.records.length; i < len; i++) {
                        if (res.data.records[i].userPic.split("/var/www/html").length > 1) {
                            res.data.records[i].userPic = app.globalData.urlb + res.data.records[i].userPic.split("/var/www/html")[1];
                        }
                    }
                    that.getTheDay(res);
                    console.log(res.data, "问答的任务");
                    that.setData({
                        taskList: res.data.records
                    });
                    moveFlag = true;
                }
            })
        },
        //日期改正
        getTheDay(res) {
            for (var i = 0, len = res.data.records.length; i < len; i++) {
                var date = new Date(res.data.records[i].iniTime.replace(/\-/g, '/'));
                // console.log("未修正的日期:", res.data.records[i].iniTime.replace(/\-/g, '/'))
                var cardTime = '';
                var chnNumChar = ["", "一", "二", "三", "四", "五", "六", "日"];
                // var month = date.getMonth() + 1;
                // cardTime = "周" + chnNumChar[date.getDay()] + " " + month + "月" + date.getDate() + "日 " +
                //   date.getHours() + ":" + date.getMinutes()
                var minutes = date.getMinutes();
                if (minutes < 10) {
                    minutes = "0" + minutes;
                }
                cardTime = "周" + chnNumChar[date.getDay()] + " " + date.getHours() + ":" + minutes
                res.data.records[i].cardTime = cardTime;
            }
        },
        //跳转到用户详情页
        toOtgerInfo(e) {
            if (!app.globalData.isRegister) {
                app.showRegister("查看个人主页")
                return
            }
            var id = e.currentTarget.dataset.id;
            wx.navigateTo({
                url: '/pages/othersInfo/othersInfo?openId=' + id,
            })
        },
        //跳到任务详情页
        toTaskInfo(e) {
          // wx.navigateTo({
          // 	url: '/pages/task/taskInfo/taskInfo?taskId=' + e.currentTarget.dataset.id,
          // })
        },
        scrollReloadTask() {
          console.log('reload')
          this.reloadTask(this.data.curTaskPage+1)
        },
        cardScroll(event) {
          var curTop = event.detail.scrollTop
          if(scroll.startTop === undefined) {
            scroll.startTop = curTop
          }
          if(scroll.time >= 0.2) {
            //上拉隐藏
            if (curTop - scroll.startTop > 15) {
              if (!this.data.isHiddenTop)
                this.setData({ isHiddenTop: true, isHiddenPick: true })
            } else if (scroll.startTop - curTop > 70) {//下拉显示
              if (this.data.isHiddenTop)
                this.setData({ isHiddenTop: false })
            }
          }
          if(event.detail.scrollTop === 0) {
            if (this.data.isHiddenTop)
              this.setData({ isHiddenTop: false })
          }
        },
        touchS(event) {
          scroll.interval = setInterval(() => {
            scroll.time += 0.1
          }, 100)
        },
        touchE(event) {
          scroll = {
            time: 0,
            interval: undefined,
            top: 0,
            startTop: undefined
          }
          clearInterval(scrollInterval)
        },
        swiperChange(event) {
          this.setData({ taskList: [] })
          switch(event.detail.current) {
            case 0: this.getTuiJian(); break
            case 1: this.getShengHuo(); break
            case 2: this.getHuDong(); break
            case 3: this.getWenDa(); break
          }
          if(event.detail.source == 'touch')
            this.setData({ page: event.detail.current })
          if (this.data.isHiddenTop == true)
            this.setData({ isHiddenTop: false })
        }
    }
})