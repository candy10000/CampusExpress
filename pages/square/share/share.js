// pages/square/square.js
const app = getApp();
var that = this;
var userPic = ''
var sharePic = []
var loadingImgPromise = []
Page({

  /**
   * 页面的初始数据
   */
  data: {

    hidden: true,

    is_first: true,

    topic: "#最喜欢的画",
    json: {},

    weburl: app.globalData.urlb,
    
    share: {
      height: 0,
      width: 0
    },

    qrcode: '',

    imags: [],

    imagesBox: null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.show_msg();
    var cardId = options.cardId;
    console.log(cardId)
    this.getShare(cardId);
    this.getQRCode(cardId)
  },
  getQRCode(cardId) {
    wx.request({
      url: `${app.globalData.url}/qrcode/qrcode/${cardId}`,
      method: 'GET',
      success: res => {
        res.data = res.data.replace(/[\r\n]/g, "")
        this.setData({ qrcode: res.data })
        console.log(res.data)

        const [, format, bodyData] = /data:image\/(\w+);base64,(.*)/.exec(res.data) || [];
        const filePath = `${wx.env.USER_DATA_PATH}/tmp_base64src.${format}`;
        const buffer = wx.base64ToArrayBuffer(bodyData);
        wx.getFileSystemManager().writeFile({
          filePath,
          data: buffer,
          encoding: 'binary',
          success: ()=> {
            console.log(filePath, 'QRTempPath')
            this.setData({QRTempPath: filePath})
          },
          fail() {
            console.log('保存QRCODE临时文件错误！')
          },
        });
      }
    })
  },
  getCssInfoById(id, func) {
    const query = wx.createSelectorQuery()
    query.select(id).boundingClientRect()
    query.exec(func)
  },
  getTime(msg) {
    var d = new Date()
    var year = d.getFullYear()
    var month = String(d.getMonth() + 1).padStart(2, 0)
    var day = String(d.getDate()).padStart(2, 0)
    var hour = String(d.getHours()).padStart(2, 0)
    var ms = String(d.getMinutes()).padStart(2, 0)
    var s = String(d.getSeconds()).padStart(2, 0)
    console.log(`${year}-${month}-${day} ${hour}:${ms}:${s}`, msg)
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
  //提示用户操作信息
  show_msg: function () {
    let that = this;
    if (that.data.is_first) {
      that.setData({
        hidden: false,
        is_first: false
    });
    }
  },
  //请求分享的数据
  getShare(cardId){
    var that = this;
    wx.request({
      url: app.globalData.url + "/card/share/{cardId}",
      method: "GET",
      data:{
        cardId: cardId,
      },
      success: function(res){
        var shareInfo = res.data;
        if (shareInfo.customerInfo.userPic != "") {
          var pic = shareInfo.customerInfo.userPic
          shareInfo.customerInfo.userPic = pic.substring(13, pic.length);
        }
        if (shareInfo.pictureInfo.length > 0) {
          var pic = shareInfo.pictureInfo
          for (var index in pic) {
            if (pic[index] != "") {
              var picMsg = pic[index];
              shareInfo.pictureInfo[index] = picMsg.substring(13, picMsg.length);
            }
          }
        }
        that.setData({
          json: shareInfo,
        })
        /**
         * write by 1999single
         */
        //语音时间设置
        if (shareInfo.audioInfo.length > 0) {
          var recordSrc = shareInfo.cardInfo.cardId;
          var recordTime = 0;
          if (recordSrc.split("_duration_").length > 1) {
            recordTime = recordSrc.split("_duration_")[1];
          }
          recordTime = parseInt(recordTime / 1000);
          shareInfo.record_time = recordTime;
        }
        that.setData({
          json: shareInfo,
          hidden: false
        })
      }
    })
  },
  //保存图片
  getfile(e){

    var imgsrc = e.currentTarget.dataset.imgsrc;

    wx.showModal({
      title: '提示',
      content: '确定要保存图片吗？',
      success: function (sm) {
        if (sm.confirm) {

          wx.downloadFile({
            url: imgsrc,
            success: function (res) {
              console.log(res, "下载的图片信息")

              if (res.statusCode === 200) {
                wx.saveImageToPhotosAlbum({
                  filePath: res.tempFilePath,
                  success: function (res) {
                    console.log(res, "保存图片成功")
                  },
                  fail: function (res) {
                    console.log(res, "保存图片失败")
                  },
                  complete: function (res) { },
                })
              }

            },
            fail: function (res) {
              console.log(res, "下载图片错误")

            },
            complete: function (res) { },
          })

        } else if (sm.cancel) {
          
        }
      }
    }) 

    
  },
  share() {
    this.setData({
      hidden: true,
    })
    this.setData({ share: { height: 300 } })
    wx.showToast({
      title: '分享图片生成中...',
      icon: 'loading',
      duration: 30000
    });
    this.loadingImages()
    Promise.all(loadingImgPromise).then((result) => {
      console.log("全部加载完成，开始预绘画")
      return this.getScreenshot(false)
    })
  },
  loadingImages() {
    var that = this
    var shareInfo = this.data.json
    for (let index in shareInfo.pictureInfo) {
      if (index % 2 == 0) {
        loadingImgPromise.push(new Promise((resolve, reject) => {
          wx.getImageInfo({
            src: that.data.weburl + shareInfo.pictureInfo[index],
            success: r => {
              sharePic[(index) / 2] = r.path
            },
            fail: r => {
              sharePic[(index) / 2] = ''
            },
            complete: () => {
              resolve()
            }
          })
        }))
      }
    }
    loadingImgPromise.push(new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: that.data.weburl + that.data.json.customerInfo.userPic,
        success: res => {
          that.setData({ tempUserPic: res.path })
          userPic = res.path
        },
        fail(r) {
        },
        complete() {
          resolve()
        }
      })
    }))
  },
  getTextLine(screenshot, text, css, maxWidth) {
    var charArr = text.split('')
    var temp = ''
    var line = []
    for (let idx = 0, len = text.length; idx < len; idx++) {
      if (screenshot.measureText(temp + charArr[idx]).width <= maxWidth) {
        temp += charArr[idx]
      } else {
        line.push(temp)
        temp = charArr[idx]
      }
    }
    line.push(temp)
    return line
  },
  drawRoundImage(screenshot, img, x, y, d, hasBorder) {
    var r = d*1.0/2
    screenshot.save()
    screenshot.beginPath()
    screenshot.setFillStyle('black')
    screenshot.setLineWidth(5)
    screenshot.arc(x+r, y+r, r, 0, 2 * Math.PI)
    screenshot.closePath();
    screenshot.fill();
    screenshot.clip()
    screenshot.drawImage(img, x, y, d, d)
    screenshot.restore()
    if (hasBorder)
      screenshot.arc(x + r, y + r, r, 0, 2 * Math.PI)
  },
  drawRoundRect(screenshot, x, y, w, h, r, func) {

    screenshot.save()
    screenshot.beginPath()
    screenshot.setFillStyle('transparent')
    // 左上角
    screenshot.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)
    // border-top
    screenshot.moveTo(x + r, y)
    screenshot.lineTo(x + w - r, y)
    // 右上角
    screenshot.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)
    // border-right
    screenshot.lineTo(x + w, y + h - r)
    screenshot.lineTo(x + w - r, y + h)
    // 右下角
    screenshot.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)
    // border-bottom
    screenshot.lineTo(x + r, y + h)
    screenshot.lineTo(x, y + h - r)
    // 左下角
    screenshot.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)
    // border-left
    screenshot.lineTo(x, y + r)
    screenshot.lineTo(x + r, y)
    screenshot.fill()
    screenshot.closePath()
    // 剪切
    screenshot.clip()
    func()
    screenshot.restore()
  },
  getScreenshot(isSave) {
    var json = this.data.json
    var screenshot = wx.createCanvasContext('screenshot')
    //蓝色底色背景
    this.getCssInfoById('#share-content', res => {
      this.setData({ share: res[0] })
      var share = res[0]
      screenshot.fillStyle = "#3f51b5"
      screenshot.fillRect(0, 0, share.width, share.height)
      //卡片白色背景
      this.getCssInfoById('#share-card', res => {
        console.log(res[0])
        this.setData({ whiteCard: res[0] })
        var whiteCard = res[0]
        screenshot.fillStyle = "white"
        var borderRadius = 8
        var px = borderRadius / 750 * share.width
        this.drawRoundRect(screenshot, whiteCard.left, whiteCard.left, whiteCard.width, whiteCard.height, px, function() {
          screenshot.fillStyle = "white"
          screenshot.fillRect(whiteCard.left, whiteCard.left, whiteCard.width, whiteCard.height)
        })
        //图片--拾和小程序
        this.getCssInfoById('#foot-logo-text', res => {
          this.setData({ footLogoText: res[0] })
          var logoText = this.data.footLogoText
          screenshot.drawImage('images/logo_text.png', logoText.left, logoText.top - whiteCard.top + whiteCard.left, logoText.width, logoText.height)
        //图片--logo
        this.getCssInfoById('#foot-logo', res => {
          this.setData({ footLogo: res[0] })
          var logo = this.data.footLogo
          screenshot.drawImage('images/logo.png', logo.left, logo.top - whiteCard.top + whiteCard.left, logo.width, logo.height)
        })
        //QR-text-1
        this.getCssInfoById('#QR-text-1', res => {
          this.setData({ QRText1: res[0] })
          var QRText1 = this.data.QRText1
          screenshot.setFontSize(12)
          screenshot.setFillStyle("#ffffff")
          screenshot.fillText('微信扫描', QRText1.left, QRText1.top - whiteCard.top + 2*whiteCard.left)
        })
        //QR-text-2
        this.getCssInfoById('#QR-text-2', res => {
          this.setData({ QRText2: res[0] })
          var QRText2 = this.data.QRText2
          screenshot.setFontSize(12)
          screenshot.setFillStyle("#ffffff")
          screenshot.fillText('查看拾言', QRText2.left, QRText2.top - whiteCard.top + 2*whiteCard.left)
        })
        //QR-image
        this.getCssInfoById('#QR-image', res => {
          this.setData({ QRImage: res[0] })
          var QRImage = this.data.QRImage
          screenshot.drawImage(this.data.QRTempPath, QRImage.left, QRImage.top - whiteCard.top + whiteCard.left, QRImage.width, QRImage.height)
        })
        //nickname
        this.getCssInfoById('#nickname', res => {
          this.setData({ nickname: res[0] })
          var nickname = this.data.nickname
          screenshot.setFontSize(18)
          screenshot.setFillStyle("#000000")
          screenshot.fillText(this.data.json.customerInfo.nickName, nickname.left, nickname.top - whiteCard.top + nickname.height + whiteCard.left)
        })
        //userTitle
        this.getCssInfoById('#userTitle', res => {
          this.setData({ userTitle: res[0] })
          var userTitle = this.data.userTitle
          screenshot.setFontSize(14)
          screenshot.setFillStyle("#000000")
          screenshot.fillText(this.data.json.customerInfo.userTitle, userTitle.left, userTitle.top - whiteCard.top + userTitle.height + whiteCard.left)
        })
        //desc
        this.getCssInfoById('#desc', res => {
          this.setData({ desc: res[0] })
          var desc = this.data.desc
          if (this.data.json.cardInfo.textMsg != '') {
            screenshot.setFontSize(12)
            screenshot.setFillStyle("#000000")
            var line = this.getTextLine(screenshot, this.data.json.cardInfo.textMsg, desc, share.width - desc.left * 2)
            var tempTop = desc.top - whiteCard.top + desc.height + whiteCard.left - desc.height
            var singleH = 1.0 * desc.height / line.length
            for (let idx = 0, len = line.length; idx < len; idx++) {
              screenshot.fillText(line[idx], desc.left, tempTop + (idx + 1) * singleH)
            }
          }
        })
        if (this.data.json.audioInfo.length) {
          //vedio-bg
          this.getCssInfoById('#vedio-bg', res => {
            var vedioBg = res[0]
            // console.log(res[0], whiteCard.top)
            // var borderRadius = 35
            // var px = borderRadius / 750.0 * share.width
            // this.drawRoundRect(screenshot, vedioBg.left - 1, vedioBg.top - whiteCard.top + whiteCard.left - 1, vedioBg.width + 2, vedioBg.height + 2, px, () => {
            //   screenshot.fillStyle = "gray"
            //   screenshot.setGlobalAlpha(0.3)
            //   screenshot.fillRect(0, 0, 200, 200)
            //   this.drawRoundRect(screenshot, vedioBg.left, vedioBg.top - whiteCard.top + whiteCard.left, vedioBg.width, vedioBg.height, px, () => {
            //     screenshot.fillStyle = "white"
            //     screenshot.setGlobalAlpha(1)
            //     screenshot.fillRect(vedioBg.left, vedioBg.top - whiteCard.top + whiteCard.left, vedioBg.width, vedioBg.height)
            //   })
            // })
            screenshot.drawImage('images/record-bg.png', vedioBg.left / 2, vedioBg.top - whiteCard.top + whiteCard.left - 0.25 * vedioBg.height, 1.2*vedioBg.width, 1.5*vedioBg.height)
          })
          //vedio-fa
          // this.getCssInfoById('#vedio-fa', res => {
          //   var vedioFa = res[0]
          //   screenshot.fillStyle = "#3F51B5"
          //   screenshot.beginPath()
          //   screenshot.moveTo(vedioFa.left, vedioFa.top - whiteCard.top + whiteCard.left)
          //   screenshot.lineTo(vedioFa.left + vedioFa.width, vedioFa.top - whiteCard.top + whiteCard.left + 0.5 * vedioFa.height)
          //   screenshot.lineTo(vedioFa.left, vedioFa.top - whiteCard.top + whiteCard.left + vedioFa.height)
          //   screenshot.fill()
          // })
          //vedio-second
          this.getCssInfoById('#vedio-second', res => {
            var vedioSecond = res[0]
            console.log(res[0], whiteCard.top)
            screenshot.setFillStyle('#3F51B5')
            screenshot.setFontSize(18)
            screenshot.fillText(this.data.json.record_time, vedioSecond.left, vedioSecond.top - whiteCard.top + whiteCard.left + 0.7 * vedioSecond.height, vedioSecond.width, vedioSecond.height)
          })
        }
        //userPic
        this.getCssInfoById('#userPic', res => {
          this.setData({ userPic: res[0] })
            var pic = this.data.userPic
            if (userPic != '') {
              //this.drawRoundImage(screenshot, userPic, pic.left, pic.top - whiteCard.top + whiteCard.left, pic.width, true)

              screenshot.drawImage(userPic, pic.left, pic.top - whiteCard.top + whiteCard.left, pic.width, pic.width)
              screenshot.drawImage('images/round-cover.png', pic.left, pic.top - whiteCard.top + whiteCard.left, pic.width, pic.width)
            }
        })
        //图片
        const query = wx.createSelectorQuery()
        query.selectAll(".line-img").boundingClientRect()
        query.exec(res => {
          console.log(res)
          for (let index in res[0]) {
            screenshot.drawImage(sharePic[index], res[0][index].left, res[0][index].top - whiteCard.top + whiteCard.left, res[0][index].width, res[0][index].height)
          }
          this.saveScreenshot(screenshot, isSave)
        })
      })
    })
    })
    return screenshot
  },
  saveScreenshot(screenshot, isSave) {
    if (isSave) {
      setTimeout(() => {
      screenshot.draw(true, wx.canvasToTempFilePath({
        canvasId: 'screenshot',
        success: res => {
          var tempFilePath = res.tempFilePath;
          this.setData({
            imagePath: tempFilePath
          });
          var share = this.data.share;
          console.log('开始保存')
          wx.saveImageToPhotosAlbum({
            width: share.width,
            heght: share.heght,
            destWidth: 4 * share.width,
            destHeight: 4 * share.heght,
            filePath: tempFilePath,
            success(res) {
              console.log('截屏保存成功');
              wx.hideToast();
              wx.showModal({
                content: '图片已保存到相册，赶紧晒一下吧~',
                showCancel: false,
                confirmText: '好的',
                confirmColor: '#333',
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定');
                  }
                }
              })
            },
            fail: function () {
              wx.hideToast();
              wx.showModal({
                content: '图片已保存失败！请重试！！',
                showCancel: false,
                confirmText: '好的',
                confirmColor: '#333',
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定');
                  }
                }
              })
            }
          })
        },
        fail: res => {
          console.log(res);
        }
      }))
      }, 1000)
    } else {
      screenshot.draw()
      this.getScreenshot(true)
    }
  }
})