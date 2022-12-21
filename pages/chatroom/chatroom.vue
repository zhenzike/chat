<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-l">
				<view class="iconfont" @tap="back">&#xe779;</view>
			</view>
			<view class="top-bar-center">
				{{chatName}}
			</view>
			<view class="top-bar-r" v-if="!groupid">
				<image :src="chatIconImg" @tap="toUserHome"></image>
			</view>
			<view class="top-bar-r" v-else>
				<image src="../../static/images/common/more1.png" @tap="toGroupHome"></image>
			</view>
		</view>
		<scroll-view class="chat" scroll-y="true" scroll-with-animation="true" :scroll-into-view="scrollTo"
			:style="{paddingBottom:pdBottom+'px'}" refresher-enabled="true"
			refresher-background="rgba(243, 244, 246, 1.0)" :refresher-triggered="isLoading"
			@refresherpulling="loadingAni">
			<view class="chat-main">
				<!-- 加载 -->
				<!-- <view class="loading" v-show="isLoading">
					<image src="../../static/images/common/loading.png" :animation="animationLoading"></image>
				</view> -->

				<view class="chat-content" v-for="(item,index) in msgs" :key="index" :id="'msg'+item.msgId">
					<view class="chat-time" v-if="item.time!=''">{{item.time|changeTime}}</view>
					<view class="msg-main msg-left" v-if="item.userId!=userid">
						<image class="user-icon" :src="item.userImg"></image>
						<!-- 文字 -->
						<view class="message" v-if="item.type==0">
							<view class="message-text">{{item.message}}</view>
						</view>
						<!-- 图片 -->
						<view class="message" v-if="item.type==1">
							<image :src="item.message" mode="widthFix" @tap="previewImage(item.message)"></image>
						</view>
						<!-- 音频 -->
						<view class="message message-voice" v-if="item.type==2"
							:style="{width:item.message.time*4+'px'}" @tap="playVoice(item.message.voice)">
							<view class="message-text voice">
								<image class="voice-img" src="../../static/images/common/语音-左.png"></image>
								{{item.message.time}}``
							</view>
						</view>
					</view>
					<view class="msg-main msg-right" v-if="item.userId==userid">
						<image class="user-icon" :src="item.userImg"></image>

						<view class="message" v-if="item.type==0">
							<view class="message-text">{{item.message}}</view>
						</view>
						<view class="message" v-if="item.type==1">
							<image :src="item.message" mode="widthFix" @tap="previewImage(item.message)"></image>
						</view>
						<view class="message message-voice" v-if="item.type==2"
							:style="{width:item.message.time*4+'px'}" @tap="playVoice(item.message.voice)">
							<view class="message-text voice">
								<image class="voice-img" src="../../static/images/common/语音-右.png"></image>
								{{item.message.time}}``
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<chatBox @msgs="inputs" @getBoxHeight="getBoxHeight"></chatBox>
	</view>
</template>

<script>
	import datas from '../../commons/js/data.js'
	import myFunction from '../../commons/js/myFunction.js'
	import chatBox from '../../components/chat-box/chat-box.vue'
	const innerAudioContext = uni.createInnerAudioContext(); //这个值必须定义在外部，否则音频直接会互性干扰
	let loading

	export default {
		data() {
			return {
				msgs: [],
				previewImg: [], //预览图片
				oldTime: new Date(),
				scrollTo: '', //控制聊天内容滚动至底部
				pdBottom: 50,
				// animationLoading: {}, //加载动画
				isLoading: false, //是否加载数据
				nowPage: 1, //页码
				beginLoading: false,
				friendid: null, //当前聊天好友id
				groupid: null, //当前聊天群id
				chatName: '',
				chatIconImg: '',
				userid: null, //登录用户id	
				userimg: null //登录用户头像
			}
		},
		onLoad(e) {
			this.getLoginStorage()
			this.chatName = e.name
			this.chatIconImg = e.img

			if (e.id) {
				this.friendid = e.id //当进入一对一聊天页面时		
				this.getMsg(this.nowPage);
			} else {
				this.groupid = e.gid //当进入群聊天页面时
				this.getGroupMsg(this.nowPage)

			}
			this.receiveSocket() //为socket绑定事件
			// this.loadingAni()
		},
		
		onUnload(){
			this.offEvent()
		},
		
		methods: {
			getLoginStorage() {
				try {
					const value = uni.getStorageSync('user')
					if (value) {
						this.userid = value.id
						this.userimg = value.imgurl
						// this.token = value.token
					} else {
						uni.navigateTo({
							url: '../login/login'
						})
					}
				} catch {
					console.log('获取缓存失败');
				}
			},


			//获取好友聊天列表
			getMsg(nowpage) {

				uni.request({
					url: this.$serverUrl + '/chat/frinedchat',
					data: {
						userid: this.userid,
						friendid: this.friendid,
						nowpage: this.nowPage,
						pagesize: 2
					},
					method: 'POST',
					success: ({
						data: data
					}) => {
						let res = data.data //聊天信息列表

						let maxPage = data.maxPage //最大页数
						let status = data.status
						if (status == 200) { //时间从大到小
							for (var i = 0; i < res.length; i++) { //这里本来是用的let 但是为了方便获取最后一个内容的索引，改用var，
								res[i].userImg = this.$serverUrl + '/user/' + res[i].userImg;
								if (i != res.length - 1) {
									this.oldTime = res[i + 1].time
								} else {
									this.oldTime = 0
								}
								let t = myFunction.spaceTime(this.oldTime, res[i].time);
								res[i].time = t
								if (res[i].type == 1) {
									res[i].message = this.$serverUrl + '/' + res[i].message;
									this.previewImg.unshift(res[i].message) //将图片插入图片数组
								}
								this.msgs.unshift(res[i]) //因为之前的消息是旧消息，所以需要倒序插入，使得旧消息在数组后方
							}

							this.$nextTick(function() {
								this.scrollTo = 'msg' + this.msgs[i - 1].msgId
							})
							clearInterval(loading);
							this.isLoading = false;
							if (maxPage > this.nowPage) {
								this.nowPage++; //下一次请求第二页数据
							} else {
								this.nowPage = -1
							}
						} else {
							uni.showToast({
								title: '获取聊天信息失败',
								icon: 'none',
								duration: 2000
							});
						}
					}
				})
			},



			// getMsg(page) {
			// 	this.nowPage++;
			// 	let msg = datas.message()
			// 	let maxPages=msg.length;
			// 	if(msg.length>(page + 1) * 4){
			// 		maxPages=(page + 1) * 4
			// 	}else{
			// 		//数据获取完毕
			// 		this.nowPage=-1
			// 	}
			// 	for (var i = page * 4; i < maxPages; i++) { //这里本来是用的let 但是为了方便获取最后一个内容的索引，改用var，
			// 		msg[i].imgUrl = `../../static/images/image/${msg[i].imgUrl}`;
			// 		let t = myFunction.spaceTime(this.oldTime, msg[i].time);
			// 		if (t) {
			// 			this.oldTime = t; //方便将当前回复时间作为下一条回复消息时间的比对对象
			// 		}
			// 		msg[i].time = t

			// 		if (msg[i].type == 1) {
			// 			msg[i].message = `../../static/images/image/${msg[i].message}`;
			// 			this.previewImg.unshift(msg[i].message) //将图片插入图片数组
			// 		}
			// 		this.msgs.unshift(msg[i]) //因为之前的消息是旧消息，所以需要倒序插入，使得旧消息在数组后方
			// 	}

			// 	this.$nextTick(function() {
			// 		this.scrollTo = 'msg' + this.msgs[i - 1].tip
			// 	})
			// 	clearInterval(loadingRotate);
			// 	this.isLoading = false;
			// },

			// 获取群聊天列表
			getGroupMsg(nowpage) {
				uni.request({
					url: this.$serverUrl + '/chat/groupchat',
					data: {
						groupid: this.groupid,
						nowpage: this.nowPage,
						pagesize: 2 //每页信息条数
					},
					method: 'POST',
					success: ({
						data: data
					}) => {
						let res = data.data //聊天信息列表

						let maxPage = data.maxPage //最大页数
						let status = data.status
						if (status == 200) { //时间从大到小
							for (var i = 0; i < res.length; i++) { //这里本来是用的let 但是为了方便获取最后一个内容的索引，改用var，
								res[i].userImg = this.$serverUrl + '/user/' + res[i].userImg;
								if (i != res.length - 1) {
									this.oldTime = res[i + 1].time
								} else {
									this.oldTime = 0
								}
								let t = myFunction.spaceTime(this.oldTime, res[i].time);
								res[i].time = t
								if (res[i].type == 1) {
									res[i].message = this.$serverUrl + '/' + res[i].message;
									this.previewImg.unshift(res[i].message) //将图片插入图片数组
								}
								this.msgs.unshift(res[i]) //因为之前的消息是旧消息，所以需要倒序插入，使得旧消息在数组后方
							}


							this.$nextTick(function() {
								this.scrollTo = 'msg' + this.msgs[i - 1].msgId
							})
							clearInterval(loading);
							this.isLoading = false;
							if (maxPage > this.nowPage) {
								this.nowPage++; //下一次请求第二页数据
							} else {
								this.nowPage = -1
							}
						} else {
							uni.showToast({
								title: '获取聊天信息失败',
								icon: 'none',
								duration: 2000
							});
						}
					}
				})
			},




			// 使用的uni提供的API预览图片
			previewImage(msg) {
				let index = this.previewImg.findIndex(item => item == msg) //通过传入的地址信息，寻找对应的图片索引，锁定点击时，应该预览的图片
				uni.previewImage({
					current: index,
					urls: this.previewImg,
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {
							console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});
			},
			//滚动到底部
			goBottom() {
				this.scrollTo = '';
				this.$nextTick(function() {
					let len = this.msgs.length - 1
					this.scrollTo = 'msg' + this.msgs[len].msgId
				})
			},

			//自己发送消息至滚动栏
			inputs(e) {
				this.receive(e, this.userid, this.userimg, 0)
			},

			//后端接收信息
			receive(e, id, img, isSelf) {
				//isSelf=0时代表自己发的消息
				let len = this.msgs.length;
				let nowTime = new Date()
				this.oldTime = this.msgs[len - 1].time //旧时间等于聊天列表最后一个时间
				let t = myFunction.spaceTime(this.oldTime, nowTime);

				uni.request({
					url: this.$serverUrl + (this.friendid ? '/chat/lastmsgid' : '/chat/grouplastmsgid'),
					data: {
						groupid: this.groupid
					},
					method: 'POST',
					success: ({
						data: data
					}) => {
						let nowMsgId = data.lastMsgId + 1

						if (data.status == 200) {

							let my = {
								userId: this.userid,
								userImg: this.$serverUrl + '/user/' + img,
								msgId: nowMsgId,
								type: e.type,
								time: t,
								message: e.message
							};

							this.msgs.push(my);
							this.goBottom();
							if (e.type == 1) { //发送图片处理
								this.previewImg.push(e.message)

								let time = myFunction.fileTimeName(new Date())

								const uploadTask = uni.uploadFile({
									url: this.$serverUrl + '/files/upload',
									filePath: e.message,
									name: 'file',
									formData: {
										'url': time
									},
									success: (uploadFileRes) => {
										let data = JSON.parse(uploadFileRes.data)
										this.sendSocket({
											message: time + '/' + data[0].filename,
											msgId: nowMsgId,
											userImg: img,
											type: '1'
										})

									}
								});

							} else if (e.type == 0) { //纯文字处理
								this.sendSocket({
									message: e.message,
									msgId: nowMsgId,
									userImg: img,
									type: '0'
								})
							} else if (e.type == 2) { //发送录音处理
								let time = myFunction.fileTimeName(new Date())
								const uploadTask = uni.uploadFile({
									url: this.$serverUrl + '/files/upload',
									filePath: e.message.voice,
									name: 'file',
									formData: {
										'url': time
									},
									success: (uploadFileRes) => {
										let data = JSON.parse(uploadFileRes.data)
										this.sendSocket({
											message: time + '/' + data[0].filename,
											msgId: nowMsgId,
											userImg: img,
											type: '2'
										})

									}
								});
							}
						} else {
							uni.showToast({
								title: '发送信息失败',
								icon: 'none',
								duration: 2000
							});
						}
					}
				})

			},


			//客户端接收并渲染后端发来的聊天信息
			receiveSocket() {
				//渲染与好友聊天时的信息

				this.$socket.on('msg', (msg, userid) => {

					if (userid == this.friendid) { //发送者id与当前好友id相同才进行渲染
						let len = this.msgs.length;
						let nowTime = new Date()
						let Message = ''

						this.oldTime = this.msgs[len - 1].time //旧时间等于聊天列表最后一个时间
						let t = myFunction.spaceTime(this.oldTime, nowTime);
						if (msg.type == '1' || msg.type == '2') {
							Message = this.$serverUrl + '/' + msg.message
						} else {
							Message = msg.message
						}
						let my = {
							userId: userid,
							userImg: this.chatIconImg,
							msgId: msg.msgId,
							type: msg.type,
							time: t,
							message: Message
						};
						this.msgs.push(my);
						this.goBottom();
						if (msg.type == 1) {
							this.previewImg.push(Message)
						}
					}
				})

				//渲染群聊天信息
				this.$socket.on('groupmsg', (msg, userid, groupid) => {
					if (groupid == this.groupid) { //发送消息的群id与当前群id相同才进行渲染

						let len = this.msgs.length;
						let nowTime = new Date()
						let Message = ''

						this.oldTime = this.msgs[len - 1].time //旧时间等于聊天列表最后一个时间
						let t = myFunction.spaceTime(this.oldTime, nowTime);
						if (msg.type == '1' || msg.type == '2') {
							Message = this.$serverUrl + '/' + msg.message
						} else {
							Message = msg.message
						}
						let my = {
							userId: userid,
							userImg: this.$serverUrl + '/user/' + msg.userImg,
							msgId: msg.msgId,
							type: msg.type,
							time: t,
							message: Message
						};
						this.msgs.push(my);
						this.goBottom();
						if (msg.type == 1) {
							this.previewImg.push(Message)
						}
					}

				})
			},




			//聊天数据发送给后端
			sendSocket(e) {
				if (this.friendid) {
					//一对一聊天
					this.$socket.emit('msg', e, this.userid, this.friendid)
				} else {
					//群聊天		

					this.$socket.emit('groupMsg', e, this.userid, this.groupid)
				}
			},

			getBoxHeight(e) {
				this.pdBottom = e //这里由于传过来的是以px单位为基础的数字，只能将原本的bottom设置成px单位方便设置
				this.goBottom()
			},
			//音频播放
			playVoice(e) {
				innerAudioContext.src = e;
				innerAudioContext.play();
			},


			// 顶部加载动画
			loadingAni() {
				if (this.nowPage == -1) {
					var that = this;
					if (!this.isLoading) {
						this.isLoading = true; //下拉加载，先让其变true再变false才能关闭
						//关闭加载状态 (转动的圈)，需要一点延时才能关闭
						setTimeout(e => {
							that.isLoading = false;
						}, 500)
					}
					return uni.showToast({
						title: '没有更多记录了',
						icon: 'none',
						duration: 2000
					});

				}
				//禁止重复加载
				if (!this.beginLoading) { //false
					this.beginLoading = true
				} else {
					return console.log('不允许重复加载');
				}
				this.isLoading = true
				let i = 1;
				loading = setInterval(() => {
					i++
					if (i > 10) {
						if (this.friendid) {
							this.getMsg(this.nowPage)
						} else {
							this.getGroupMsg(this.nowPage)
						}
						this.beginLoading = false
					}
				}, 100)

			},
			
			
			//清除未读消息数量
			clearUnReady(){
				uni.request({
					url:this.$serverUrl+'/user/',
					data:{

					},
					method:'POST',
					success:(data)=> {
						let status=data.data.status
					}
				})
			},

			//解除绑定的事件，防止重复绑定
			offEvent() {
				this.$socket.removeAllListeners("msg")
				this.$socket.removeAllListeners("groupmsg")
			},

			//前往用户详情
			toUserHome() {
				
				uni.navigateTo({
					url: '/pages/userdetail/userdetail?id=' + this.friendid
				})
			},

			//前往群详情
			toGroupHome() {
			
				uni.navigateTo({
					url: '/pages/grouphome/grouphome?groupid=' + this.groupid ,
				})
			},


			back() {
				uni.navigateBack({
					delta: 1
				})
			},

		},
		filters: {
			changeTime(time) {
				return myFunction.dateTime(time)
			}
		},
		components: {
			chatBox
		}
	}
</script>

<style lang="scss">
	@font-face {
		font-family: 'iconfont';
		src: url('../../static/images/common/font/iconfont.woff2?t=1656943243731') format('woff2'),
			url('../../static/images/common/font/iconfont.woff?t=1656943243731') format('woff'),
			url('../../static/images/common/font/iconfont.ttf?t=1656943243731') format('truetype');
	}

	.content {
		box-sizing: border-box;
		padding-top: var(--status-bar-height);

		background-color: rgba(243, 244, 246, 1);
		height: 100vh;
	}

	.top-bar {
		position: fixed;
		display: flex;
		z-index: 1000;
		top: var(--status-bar-height);
		left: 0;
		width: 100%;
		height: 88rpx;
		background: rgba(255, 255, 255, 0.97);
		border-bottom: 1px solid rgba(39, 40, 50, 0.1);

		.top-bar-r {

			padding-top: 12rpx;
			padding-right: 46rpx;

			image {
				width: 64rpx;
				height: 64rpx;
				border-radius: 20rpx;
			}
		}

		.top-bar-center {
			flex: auto;
			font-size: 40rpx;
			color: #272832;
			font-weight: 400;
			line-height: 88rpx;
			text-align: center;
		}

		.top-bar-l {

			padding-left: 32rpx;
			line-height: 88rpx;
			width: 88rpx;

			.iconfont {
				font-family: "iconfont" !important;
				font-size: 48rpx;
				font-style: normal;
				-webkit-font-smoothing: antialiased;
				-moz-osx-font-smoothing: grayscale;
			}
		}
	}

	.chat {
		height: 100%;
		box-sizing: border-box;
		padding-left: 32rpx;
		padding-right: 32rpx;
		padding-top: 88rpx;

		.loading {
			text-align: center;

			image {
				height: 30rpx;
				width: 30rpx;
			}

		}

		.chat-main {
			display: flex;
			flex-direction: column;
		}


		.msg-main {
			display: flex;
			padding: 20rpx 0;

			.user-icon {
				flex: none;
				width: 80rpx;
				height: 80rpx;
				border-radius: 20rpx;
			}
		}

		.chat-content {
			flex-direction: row;

			.chat-time {
				font-size: 24rpx;
				color: rgba(39, 40, 50, 0.3);
				line-height: 34rpx;
				padding: 20rpx 0;
				text-align: center;
			}

		}

		.msg-right {
			flex-direction: row-reverse;

			.message-text {
				margin-right: 18rpx;
				background-color: #29ffa6;
				border-radius: 20rpx 0 20rpx 20rpx;
				color: #fff !important;
			}

			.voice {
				text-align: right;

				.voice-img {
					float: left;
					padding: 8rpx 0 0 0;
				}
			}

			.message {
				image {
					margin-right: 18rpx;
				}
			}
		}

		.msg-left {
			.message-text {
				margin-left: 18rpx;
				background-color: #fff;
				border-radius: 0 20rpx 20rpx 20rpx;
			}

			.voice {
				.voice-img {
					float: right;
					padding: 8rpx 0 0 0;
				}
			}

			.message {
				image {
					margin-left: 18rpx;
				}
			}

		}

		.message {
			max-width: 500rpx;


			.message-text {
				font-size: 32rpx;
				color: #272832;
				font-weight: 400;
				line-height: 44rpx;
				padding: 16rpx 8rpx 16rpx 16rpx;
			}

			image {
				width: 400rpx;
				border-radius: 20rpx;

			}


			.voice {
				.voice-img {
					width: 32rpx;
					height: 32rpx;
				}
			}
		}

		.message-voice {
			min-width: 150rpx
		}
	}
</style>
