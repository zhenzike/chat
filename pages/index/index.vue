<template>

	<view class="content">

		<!-- 导航栏部分 -->
		<view class="top-bar">
			<navigator :url="'../userhome/userhome?id='+userid" class="top-bar-left">
				<!-- 	//用户头像 -->
				<image :src="imgurl"></image>
			</navigator>
			<view class="top-bar-center">
				<image src="../../static/images/index/logo.jpeg"></image>
			</view>
			<view class="top-bar-right">
				<view class="search">
					<image src="../../static/images/index/search.png" mode="" @tap="toSerch"></image>
				</view>
				<view class="add">
					<image src="../../static/images/index/add.png" @tap="toBuildGroup"></image>
				</view>
			</view>
		</view>


		<!-- 列表部分 -->
		<view class="main">
			<view class="Refresh" v-show="isRefresh">正在刷新</view>

			<!-- 好友申请 -->
			<view class="friends" v-show="requestNum>0" @tap="goRequest">
				<view class="friends-list">
					<view class="friend-list-l">
						<text class="tip">{{requestNum}}</text>
						<image src="../../static/images/image/2.jpeg"></image>
					</view>
					<view class="friend-list-r">
						<view class="top">
							<view class="name">好友申请</view>
							<view class="time">{{requestTime | changeTime}}</view>
						</view>
						<view class="news">有陌生人申请加你为好友</view>
					</view>
				</view>
			</view>

			<view class="nofriend" v-if="nofriend">
				<view class="tiptext">你还没有好友，去寻找盆友吧</view>
				<button class="searchfriend" @tap="toSerch">搜索好友</button>
			</view>

			<!-- 聊天框 -->
			<view v-else class="friends">
				<view class="friends-list" v-for="(item,index) in friend" :key="index" @tap="toChatRoom(item)">
					<view class="friend-list-l">
						<text class="tip" v-if="item.tip>0">{{item.tip}}</text>
						<image :src='item.imgurl'></image>
					</view>
					<view class="friend-list-r">
						<view class="top">
							<view class="name">{{item.name}}</view>
							<view class="time">{{item.lastTime | changeTime}}</view>
						</view>
						<view class="news">{{item.message}}</view>
					</view>
				</view>
			</view>


		</view>

	</view>

</template>

<script>
	import datas from '../../commons/js/data.js'
	import myFunction from '../../commons/js/myFunction.js'
	export default {
		data() {
			return {
				friend: [],
				userid: '',
				imgurl: '',
				token: '',
				requestNum: 0, //好友申请数量
				requestTime: '', //最后的好友申请时间
				isRefresh: false,
				nofriend: false
			}
		},
		onShow() {
			this.getLoginStorage()
			this.getFriendList()
			this.friendRequest()
			this.join(this.userid)
			// this.groupSocket()
		},



		onPullDownRefresh() { //监听下拉刷新
			this.isRefresh = true
			this.getFriendList()
		},


		methods: {
			//获取由登录页缓存的数据
			getLoginStorage() {
				try {
					const value = uni.getStorageSync('user')
					if (value) {
						this.userid = value.id
						this.token = value.token
						this.imgurl = this.$serverUrl + '/user/' + value.imgurl
					} else {
						uni.navigateTo({
							url: '../login/login'
						})
					}
				} catch {
					console.log('获取缓存失败');
				}
			},



			// getFrends() {
			// 	this.friend = datas.frineds();
			// 	for (let i = 0; i < this.friend.length; i++) {
			// 		this.friend[i].imgUrl = `../../static/images/image/${this.friend[i].imgUrl}`
			// 	}
			// 	// console.log(this.friend);
			// },

			//获取好友列表
			getFriendList() {
				this.friend = []
				uni.request({
					url: this.$serverUrl + '/index/getfriend',
					data: {
						userid: this.userid,
						state: 0
					},
					method: 'POST',
					success: ({
						data: data
					}) => {
						let status = data.status
						let res = data.data //好友列表
						if (status == 200) {
							if (res.length > 0) {
								res.map(item => {
									item.imgurl = this.$serverUrl + '/user/' + item.imgurl
									this.getFriendMessage(item.id, item)
									this.unReadyNum(item.id, item)
									this.friend.push(item)
								})
							}
							this.getGroupList()

						} else {
							uni.showToast({
								title: '获取好友列表失败',
								icon: 'none',
								duration: 2000
							});
						}
						if (this.isRefresh) {
							this.isRefresh = false
							uni.stopPullDownRefresh()
						}
					}
				})
			},

			//好友申请信息获取
			friendRequest() {
				uni.request({
					url: this.$serverUrl + '/index/getfriend',
					data: {
						userid: this.userid,
						state: 1
					},
					method: 'POST',
					success: ({
						data: data
					}) => {
						let status = data.status
						let res = data.data //向用户发送好友申请的列表
						if (status == 200) {
							this.requestNum = res.length
							for (let i = 0; i < res.length; i++) {
								if (this.requestTime < res[i].lastTime) {
									this.requestTime = res[i].lastTime
								}
							}

						} else {
							uni.showToast({
								title: '获取申请列表失败',
								icon: 'none',
								duration: 2000
							});
						}
					}
				})
			},


			//获取群列表
			getGroupList() {
				uni.request({
					url: this.$serverUrl + '/index/getgroup',
					data: {
						userid: this.userid
					},
					method: 'POST',
					success: ({
						data: data
					}) => {
						let status = data.status
						let res = data.data
						if (status == 200) {
							if (res.length > 0) {
								res.map(item => {
									item.imgurl = this.$serverUrl + '/group/' + item.imgurl
									this.getGroupMessage(item.groupid, item)
									this.$socket.emit('joinGroup',item.groupid)
									this.friend.push(item)
								})
							}
							
							this.friend = myFunction.messageOrder(this.friend, 'lastTime')
							if (this.friend.length == 0) {

								this.nofriend = true
							} else {
								this.nofriend = false
							}
						} else {
							uni.showToast({
								title: '获取申请列表失败',
								icon: 'none',
								duration: 2000
							});
						}
					}
				})
			},

			//获取好友最后消息
			getFriendMessage(friendid, item) {
				uni.request({
					url: this.$serverUrl + '/index/getlastmsg/',
					data: {
						userid: this.userid,
						friendid: friendid
					},
					method: 'POST',
					success: ({
						data: data
					}) => {
						let status = data.status
						if (status == 200) {
							// item.message=data.data.message
							if (data.data.type == '0') {
								this.$set(item, 'message', data.data.message)
							} else if (data.data.type == '1') {
								this.$set(item, 'message', '[图片]')
							} else {
								this.$set(item, 'message', '[链接]')
							}

						} else if (status == 300) {
							item.message = ''
						} else {
							uni.showToast({
								title: '获取消息失败',
								icon: 'none',
								duration: 2000
							});
						}
					}
				})
			},


			//获取群最后消息
			getGroupMessage(groupid, item) {
				uni.request({
					url: this.$serverUrl + '/index/getonegroupmsg',
					data: {
						groupid: groupid,
					},
					method: 'POST',
					success: ({
						data: data
					}) => {
						let status = data.status

						if (status == 200) {
							if (data.data.type == '0') {
								this.$set(item, 'message', data.data.message)
							} else if (data.data.type == '1') {
								this.$set(item, 'message', '[图片]')
							} else {
								this.$set(item, 'message', '[链接]')
							}
						} else if (status == 300) {
							item.message = ''
						} else {
							uni.showToast({
								title: '获取消息失败',
								icon: 'none',
								duration: 2000
							});
						}
					}
				})
			},

			//获取好友间未读消息数量
			unReadyNum(friendid, item) {
				uni.request({
					url: this.$serverUrl + '/index/unreadymsg',
					data: {
						userid: this.userid,
						friendid: friendid
					},
					method: 'POST',
					success: ({
						data: data
					}) => {
						let status = data.status
						if (status == 200) {
							this.$set(item, 'tip', data.num)
						} else {
							uni.showToast({
								title: '获取未读消息数量失败',
								icon: 'none',
								duration: 2000
							});
						}
					}
				})

			},

            // 群即时消息接收
			groupSocket(){
				this.$socket.on('groupmsg',(msg,groupid)=>{
					console.log(msg,groupid);
				})
			},

			goRequest() {
				uni.navigateTo({
					url: '/pages/friendrequest/friendrequest'
				})
			},

			toSerch() {

				uni.navigateTo({
					url: '/pages/search/search'
				})
			},
			toChatRoom(item) {

				if (item.id) {
					uni.navigateTo({
						url: '/pages/chatroom/chatroom?id=' + item.id + '&name=' + item.name + '&img=' + item
							.imgurl
					})
				} else {
					uni.navigateTo({
						url: '/pages/chatroom/chatroom?gid=' + item.groupid + '&name=' + item.name + '&img=' + item
							.imgurl
					})
				}

			},

			toBuildGroup() {
				uni.navigateTo({
					url: '/pages/buildgroups/buildgroups'
				})
			},

			// socket模块
			//用户登录socket注册
			join(userid) {
				this.$socket.emit('login', userid)
			}
			
		},
		filters: {
			changeTime(time) {
				if (time == '') {
					return ''
				} else {
					return myFunction.dateTime(time)
				}
			}
		}
	}
</script>

<style lang="scss">
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-top: var(--status-bar-height);
		padding-bottom: $uni-spacing-col-base;
	}

	.top-bar {
		position: fixed;
		z-index: 1000;
		top: var(--status-bar-height);
		left: 0;
		width: 100%;
		height: 88rpx;
		box-sizing: border-box;
		background: $uni-bg-color;
		border-bottom: 1px solid $uni-border-color;
		padding-left: $uni-spacing-col-base;
		padding-right: $uni-spacing-col-base;

		.top-bar-left {
			float: left;
			margin-top: 10rpx;

			image {
				width: 68rpx;
				height: 68rpx;
				border-radius: 16rpx;
				background-color: $uni-color-primary;
			}
		}

		.top-bar-center {
			position: absolute;
			left: 50%;
			top: 50%;
			margin-top: -34rpx;
			margin-left: -30rpx;

			image {
				width: 68rpx;
				height: 68rpx;
			}
		}

		.top-bar-right {
			float: right;
			margin-top: 15rpx;

			.search {
				display: inline-block;
				margin-right: 20rpx;
				border: 1px solid red;
			}

			.add {
				display: inline-block;
				border: 1px solid red;
			}

			image {
				width: 52rpx;
				height: 52rpx;
			}

		}
	}

	.main {
		width: 100%;
		padding-top: 96rpx;
		box-sizing: border-box;

		.Refresh {
			height: 150rpx;
			text-align: center;
			line-height: 250rpx;
			border-bottom: 1px solid rgba(223, 223, 223, 1.0);
		}

		.nofriend {
			padding-top: 400rpx;

			.tiptext {
				text-align: center;
				padding-bottom: 50rpx;
			}

			.searchfriend {
				width: 200rpx;
				border-radius: 40rpx;
				color: white;
				background-color: rgba(0, 155, 219, 1.0);
			}
		}
	}

	.friends-list {
		height: 96rpx;
		padding: 16rpx $uni-spacing-col-base;
		border-bottom: 1px solid rgba(241, 241, 241, 1.0);

		&:active {
			//点击变色
			background-color: $uni-bg-color-grey;
		}

		.friend-list-l {
			position: relative;
			float: left;

			image {
				width: 96rpx;
				height: 96rpx;
				border-radius: $uni-border-radius-base;
			}

			.tip {
				position: absolute;
				z-index: 10;
				top: -8rpx;
				left: 68rpx;
				height: 36rpx;
				min-width: 20rpx;
				padding: 0 8rpx;
				background-color: $uni-color-warning;
				border-radius: 18rpx;
				font-size: $uni-font-size-sm;
				color: $uni-text-color-inverse;
				line-height: 36rpx;
				text-align: center;
			}
		}

		.friend-list-r {
			padding-left: 128rpx;

			.top {
				height: 50rpx;

				.name {
					float: left;
					font-size: 36rpx;
					color: $uni-text-color;
					line-height: 50rpx;
				}

				.time {
					float: right;
					font-size: $uni-font-size-sm;
					color: $uni-text-color-disable;
				}
			}

			.news {
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				font-size: $uni-font-size-base;
				color: $uni-text-color-grey;
				line-height: 40rpx;
			}
		}
	}
</style>
