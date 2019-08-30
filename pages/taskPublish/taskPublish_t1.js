// pages/taskPublish/taskPublish.js
var app = getApp();
Component({

	properties: {
		paramA: Number,
		paramB: String,
	},

	data: {
		rewardInput: false,
		reward: '',
		tplaceInput: false,
		tplaceInput2: false,
		openid: "",
		textDesc: "",
		tagMultiIndex: [0, 0, 0],
		placeMultiIndex: [0, 0, 0],
		minePlaceMultiIndex: [0, 0, 0],
		minePlaceDetail: "",
		telDetail: "",
		contactInfo: "",
		timeLimStampArray: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
		tagArray: [
			["生活类", "互动类", "问答类"],
			["生活类其他", "餐食打包", "快递代领", "商品代买", "二手交易", "共享借用", "拼单合买", "资源分享", "出行拼车"]
		],
		placeArray: [
			["无需地点", "食堂", "快递点", "超市", "小店", "手动输入"],
			['无需地点']
			// ["北区一堂", "北区二堂", "北区三堂（教工）", "南区八堂 ", "南区九堂 ", "南区十堂（教工）", "南区青年餐厅 ", "下安十一堂 ", "下安十二堂", "下安十三堂", "东苑餐厅"],

		],

		minePlaceArray: [
			["无需地点", "宿舍", "教学楼", "图书馆", "操场", "景点", "手动输入地点"],
			["无需地点"],
			[]
			// ["北区", "南区", "桃区", "东苑"],
			// ["北1", "北2", "北3", "北4", "北5", "北11", "北12"]
		],
		rewardArray: ["不设赏金", "1", "2", "3", "4", "5", "手动输入"],
		telArray: ["微信", "QQ", "手机号", "任务信封"],
		timeLimArray: ["无时限", "0.5h", "1h", "1.5h", "2h", "2.5h", "3h", "3.5h", "4h", "4.5h", "5h"],
		amountArray: ["1", "2", "3", "4", "5", "6", "7", "8", "不限数量"],
		amountArray1: ["1", "2", "3", "4", "5", "6", "7", "8", "99"],
		objectArray: [{
				id: 0,
				name: '美国'
			},
			{
				id: 1,
				name: '中国'
			},
			{
				id: 2,
				name: '巴西'
			},
			{
				id: 3,
				name: '日本'
			}
		],
		index1: 0,
		index2: 0,
		index3: 0,
		index4: 0,
		index5: 0,
		index6: 0,
		index7: 0,
	},

	methods: {
		onLoad() {
			var that = this
			that.data.paramA // 页面参数 paramA 的值
			that.data.paramB // 页面参数 paramB 的值
			that.data.openid = app.getOpenid(app.globalData.url);
			wx.request({
				url: app.globalData.url + "/customer/detail",
				data: {
					openId: that.data.openid
				},
				success: function (res) {
					console.log("得到的userInfo:", res.data);
					if (res.data.contact.indexOf(",") != -1) {
						that.setData({
							index5: that.data.telArray.indexOf(res.data.contact.split(",")[0]),
							contactInfo: res.data.contact.split(",")[1]
						})
					}
				}
			})

		},

		bindPickerChange1(e) {
			console.log('picker1发送选择改变，携带值为', e.detail.value)
			this.setData({
				index: e.detail.value
			})
		},
		bindPickColChange1(e) {
			var data = {
				tagArray: this.data.tagArray,
				tagMultiIndex: this.data.tagMultiIndex
			};

			console.log('picker发送选择改变，携带值为', e.detail.value);
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

		bindPickerChange2(e) {
			console.log('picker2发送选择改变，携带值为', e.detail.value);
		},
		bindPickColChange2(e) {
			var data = {
				placeArray: this.data.placeArray,
				placeMultiIndex: this.data.placeMultiIndex
			};

			console.log('picker发送选择改变，携带值为', e.detail.value);
			data.placeMultiIndex[e.detail.column] = e.detail.value;
			console.log(data.placeMultiIndex[0]);

			switch (e.detail.column) {
				case 0:
					switch (data.placeMultiIndex[0]) {
						case 0:
							data.placeArray[1] = ["无需地点"];
							this.setData({
								tplaceInput: false
							});
							break;
						case 1:
							data.placeArray[1] = ["北区一堂", "北区二堂", "北区三堂（教工）", "南区八堂 ", "南区九堂 ", "南区十堂（教工）", "南区青年餐厅 ", "下安十一堂 ", "下安十二堂", "下安十三堂", "东苑餐厅"];
							this.setData({
								tplaceInput: false
							});
							break;
						case 2:
							data.placeArray[1] = ["映辉楼前", "拓荒广场", "京东快递"];
							this.setData({
								tplaceInput: false
							});
							break;
						case 3:
							data.placeArray[1] = ["兴福兴超市", "爱慕超市", "优多便利"];
							this.setData({
								tplaceInput: false
							});
							break;
						case 4:
							data.placeArray[1] = ["XX打印店", "青年烘焙", "老塞咖啡", "茶人码头", "水舞功夫", "一点点", "古茗", "蜜雪冰城", "东苑片皮鸭", "东苑水果捞"];
							this.setData({
								tplaceInput: false
							});
							break;
						case 5:
							data.placeArray[1] = ["手动输入"];
							this.setData({
								tplaceInput: true
							});
							break;

					}
					data.placeMultiIndex[1] = 0;
					data.placeMultiIndex[2] = 0;

					break;
			}
			console.log(data);
			this.setData(data);
		},


		bindPickerChange3(e) {
			console.log('picker3发送选择改变，携带值为', e.detail.value);

		},
		bindPickColChange3(e) {
			var data = {
				minePlaceArray: this.data.minePlaceArray,
				minePlaceMultiIndex: this.data.minePlaceMultiIndex
			};

			console.log('picker3发送选择改变，携带值为', e.detail.value);
			data.minePlaceMultiIndex[e.detail.column] = e.detail.value;
			console.log("data.minePlaceMultiIndex[0]", data.minePlaceMultiIndex[0]);
			console.log("e.detail.column", e.detail.column);
			switch (e.detail.column) {
				case 0:
					switch (data.minePlaceMultiIndex[0]) {
						case 0:
							data.minePlaceArray[1] = ["无需地点"];
							data.minePlaceArray[2] = [];
							this.setData({
								tplaceInput2: false
							})
							break;
						case 1:
							data.minePlaceArray[1] = ["北区", "南区", "桃区", "东苑"];
							data.minePlaceArray[2] = ["全区域", "北1", "北2", "北3", "北4", "北5", "北11", "北12"];
							this.setData({
								tplaceInput2: true
							})
							break;
						case 2:
							data.minePlaceArray[1] = ["创新楼", "田家炳", "金综楼", "宝铃楼", "禧强楼", "诚智楼"];
							//默认第三列为无
							data.minePlaceArray[2] = [];
							this.setData({
								tplaceInput2: true
							})
							break;
						case 3:
							// data.minePlaceArray[1] = ["李长盛图书馆", "逸夫图书馆"];
							data.minePlaceArray[1] = ["李长盛", "逸夫"];
							data.minePlaceArray[2] = [];
							this.setData({
								tplaceInput2: true
							})
							break;
						case 4:
							data.minePlaceArray[1] = ["北区田径场", "北区篮球场", "下安田径场"];
							data.minePlaceArray[2] = [];
							this.setData({
								tplaceInput2: true
							})
							break;
						case 5:
							data.minePlaceArray[1] = ["观音湖", "拓荒广场", "西门沙滩", "中华园", "紫荆广场"];
							data.minePlaceArray[2] = [];
							this.setData({
								tplaceInput2: true
							})
							break;
						case 6:
							data.minePlaceArray[1] = ["手动输入"];
							this.setData({
								tplaceInput2: true
							})
							data.minePlaceArray[2] = [];
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
									data.minePlaceArray[2] = ["全区域", "北1", "北2", "北3", "北4", "北5", "北11", "北12"];
									break;
								case 1:
									data.minePlaceArray[2] = ["全区域", "南1", "南2", "南3", "南4"];
									break;
								case 2:
									data.minePlaceArray[2] = ["全区域", "桃1", "桃2", "桃3", "桃4", "桃5", "桃6", "桃7", "桃8"];
									break;
								case 3:
									data.minePlaceArray[2] = ["全区域", "东1", "东2", "东3", "东4", "东5", "东6", "东7", "东8"];
									break;

							}
							break;
						case 6:
							data.minePlaceArray[2] = [];
							break;
						default:
							data.minePlaceArray[2] = [];
							break;
					}
					data.minePlaceMultiIndex[2] = 0;
					break;


			}
			console.log(data);
			this.setData(data);

		},


		bindPickerChange4(e) {
			console.log('picker4发送选择改变，携带值为', e.detail.value)
			this.setData({
				index4: e.detail.value,
				reward: '',
				rewardInput: false,
			})
			if (e.detail.value == 6) {
				this.setData({
					rewardInput: true
				})
				console.log("rewardInput:", this.data.rewardInput)
			}
		},

		bindPickerChange5(e) {
			console.log('picker5发送选择改变，携带值为', e.detail.value)
			this.setData({
				index5: e.detail.value
			})

		},

		bindPickerChange6(e) {
			console.log('picker6发送选择改变，携带值为', e.detail.value)
			this.setData({
				index6: e.detail.value
			})

		},

		bindPickerChange7(e) {
			console.log('picker7发送选择改变，携带值为', e.detail.value)
			this.setData({
				index7: e.detail.value
			})

		},







		TaskPost: function (e) {
			console.log(this.data.openid);
			// console.log(e.detail);


		},

		telDetailInput(e) {
			console.log("1111");
			console.log(e);

			this.setData({
				telDetail: e.detail.value
			})

		},
		bindFormSubmit(e) {
			console.log("提交");
			console.log(e);
			console.log(e.detail.value.desc);

			console.log(this.data.tagMultiIndex);
			console.log(this.data.placeMultiIndex);
			console.log(this.data.minePlaceMultiIndex);
			console.log(this.data.index4);
			console.log(this.data.index5);
			console.log(this.data.index6);
			console.log(this.data.index7);


			var formData = e.detail.value;

			formData.desc = e.detail.value.desc;
			formData.label = this.data.tagArray[1][this.data.tagMultiIndex[1]];
			formData.tagFather = this.data.tagArray[0][this.data.tagMultiIndex[0]];

			if (this.data.tplaceInput) {
				formData.tplace = e.detail.value.tplaceDetail;
			} else {
				formData.tplace = this.data.placeArray[1][this.data.placeMultiIndex[1]];
			}
			if (this.data.placeArray[1][this.data.placeMultiIndex[1]] == '无需地点') {
				formData.tplace = '无';
			}
			console.log("this.data.minePlaceArray", this.data.minePlaceArray);

			//我的地点
			if (this.data.minePlaceArray[1][this.data.minePlaceMultiIndex[1]] == '无需地点') {
				formData.place = '无'
			} else if (this.data.minePlaceArray[1][this.data.minePlaceMultiIndex[1]] == '手动输入') {
				formData.place = e.detail.value.minePlaceDetail;
				//判断当前选中的是不是宿舍	
			} else if (this.data.minePlaceArray[1][0] == '北区') {
				formData.place = this.data.minePlaceArray[1][this.data.minePlaceMultiIndex[1]] + this.data.minePlaceArray[2][this.data.minePlaceMultiIndex[2]] + e.detail.value.minePlaceDetail;
			} else {
				formData.place = this.data.minePlaceArray[1][this.data.minePlaceMultiIndex[1]] + e.detail.value.minePlaceDetail;
			}

			if (this.data.index4 == 6) {
				formData.reward = e.detail.value.rewardDetail;
			} else {
				formData.reward = this.data.rewardArray[this.data.index4];
			}
			if (this.data.index4 == 0) {
				formData.reward = 0;
			}

			// formData.contactInfo = this.data.telArray[this.data.index5] + e.detail.value.telDetail;
			if (e.detail.value.telDetail == '') {
				formData.contactInfo = '未填写';
			} else {
				formData.contactInfo = e.detail.value.telDetail;
			}
			//联系方式
			formData.contactType = this.data.telArray[this.data.index5];

			formData.deadline = this.data.timeLimStampArray[this.data.index6];



			formData.helpLimit = this.data.amountArray1[this.data.index7];
			console.log("hhhh====>", formData.helpLimit);
			formData.openid = this.data.openid;
			formData.taskType = "1";
			formData.orderId = Date.parse(new Date()) + Math.ceil(Math.random() * 10000);
			console.log("=====");

			console.log(formData);
			wx.request({
				url: app.globalData.url + '/task/post',
				method: 'POST',
				header: {
					'content-type': 'application/json'
				},
				data: {
					openid: formData.openid,
					taskType: formData.taskType,
					reward: formData.reward * 100,
					helpLimit: formData.helpLimit,
					desc: formData.desc,
					label: formData.label,
					place: formData.place,
					tplace: formData.tplace,
					deadline: formData.deadline,
					contactInfo: formData.contactInfo,
					//联系方式
					contactType: formData.contactType,
					orderId: formData.orderId,
					tagFather: formData.tagFather
				},
				success: function (res) {
					console.log(formData.reward);
					console.log("=====******====");
					console.log(res.data);
					var total = res.data.total_fee;
					wx.request({
						url: app.globalData.url + "/wx/wxPay/task",
						data: {
							appid: app.globalData.appid,
							body: "taskPayment",
							mch_id: "1510474321",
							openid: wx.getStorageSync("openid"),
							out_trade_no: formData.orderId,
							total_fee: parseInt(total)
						},
						success: function (res) {
							console.log(formData.reward);
							if (formData.reward == 0) {
								wx.showModal({
									title: '发布成功',
									content: '发布成功',
									showCancel: false,
									success: function () {
										wx.navigateBack({
											delta: 1
										})
									}
								})


							} else {
								console.log("task Pay");
								console.log(res.data);
								console.log(parseInt(total));
								wx.request({
									url: getApp().globalData.url + "/wx/PaySign/task",
									data: {
										appid: app.globalData.appid,
										timeStamp: parseInt(new Date().getTime() / 1000),
										nonceStr: "",
										package: "prepay_id=" + res.data.pre,
										signType: "MD5",
									},
									success: function (res) {
										wx.requestPayment({
											timeStamp: res.data.timeStamp,
											nonceStr: res.data.nonceStr,
											package: res.data.package,
											signType: 'MD5',
											paySign: res.data.paySign,
											success: function (res) {
												console.log(res);
												wx.navigateBack({
													delta: 1
												})
											},
											fail: function () {
												wx.showToast({
													title: '用户取消支付',
													icon: 'loading'
												})
											}
										})

										console.log(res.data);
									},
									fail: function () {
										wx.showToast({
											title: '签名接口调用失败',
											icon: 'loading'
										})
									}
								})

								console.log(res.data);
							}
						}
					})
				}


			})

		},



	}





})