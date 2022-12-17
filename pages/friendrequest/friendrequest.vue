<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-l">
				<view class="iconfont" @tap="back">&#xe779;</view>
			</view>
			<view class="top-bar-center">
				好友请求
			</view>
		</view>
		<view class="main">
			<view class="requester" v-for="(item,index) in friends" :key="item.id">
				<view class="request-top">
					<view class="reject btn" @tap="deleteFriend(item.id)">拒绝</view>
					<view class="user-icon">
						<image :src="item.imgurl"></image>
					</view>
					<view class="aggree btn" @tap="updateFriend(item.id)">同意</view>
				</view>
				<view class="request-center">
					<view class="title">{{item.name}}</view>
					<view class="time">{{item.lastTime | changeTime}}</view>
				</view>
				<view class="comments">
					<text>留言：</text>
					{{item.message}}
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
				friends: [],
				userid: null,
				token: null,
			}
		},

		onLoad() {
			this.getLoginStorage()
			this.friendRequest()

		},

		// onShow(){

		// },


		methods: {
			getLoginStorage() {
				try {
					const value = uni.getStorageSync('user')
					if (value) {
						this.userid = value.id
						this.token = value.token
					} else {
						uni.navigateTo({
							url: '../login/login'
						})
					}
				} catch {
					console.log('获取缓存失败');
				}
			},

			//获取申请加好友的用户列表
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
							res.map(item => {
								item.imgurl = this.$serverUrl + '/user/' + item.imgurl
								this.getMessage(item.id, item)
							})
							this.friends = res

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

			//获取留言

			getMessage(friendid, item) {
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
							this.$set(item, 'message', data.data.message)
						} else if (status == 300) {
							item.message = ''
						} else {
							uni.showToast({
								title: '获取留言失败',
								icon: 'none',
								duration: 2000
							});
						}
					}
				})
			},

			deleteFriend(friendid) {
				uni.request({
					url: this.$serverUrl + '/friend/deletefriend',
					data: {
						userid: this.userid,
						friendid: friendid
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status
						if (status == 200) {
							for (let i = 0; i < this.friends.length; i++) {
								if (this.friends[i].id == friendid) {
									this.friends = this.friends.splice(i, 1)
								}
							}
							// this.friendRequest()

							uni.showToast({
								title: '已拒绝该好友请求',
								icon: 'none',
								duration: 2000
							});
						} else {
							uni.showToast({
								title: '服务器错误',
								icon: 'none',
								duration: 2000
							});
						}
					}
				})
			},

			//同意好友请求
			updateFriend(friendid) {
				uni.request({
					url: this.$serverUrl + '/friend/updatefriendstate',
					data: {
						userid: this.userid,
						friendid: friendid
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status
						if (status == 200) {
							for (let i = 0; i < this.friends.length; i++) {
								if (this.friends[i].id == friendid) {
									this.friends = this.friends.splice(i, 1)
								}
							}
							// this.friendRequest()
							uni.showToast({
								title: '已同意该好友请求',
								icon: 'none',
								duration: 2000
							});
						} else {
							uni.showToast({
								title: '服务器错误',
								icon: 'none',
								duration: 2000
							});
						}
					}
				})
			},

			back() {
				uni.navigateBack({
					delta: 1
				})
			},


			// getFrends() {
			// 	console.log(datas.frineds());
			// 	this.friend = datas.frineds();
			// 	for (let i = 0; i < this.friend.length; i++) {
			// 		this.friend[i].imgUrl = `../../static/images/image/${this.friend[i].imgUrl}`
			// 	}

			// },
		},

		filters: {
			changeTime(time) {
				return myFunction.dateTime(time)
			}
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
		padding-top: var(--status-bar-height);
	}

	.top-bar {
		position: fixed;
		z-index: 1000;
		top: var(--status-bar-height);
		left: 0;
		width: 100%;
		height: 88rpx;
		background: rgba(255, 255, 255, 1);
		border-bottom: 1px solid $uni-border-color;

		.top-bar-center {
			position: absolute;
			right: 50%;
			margin-right: -64rpx;
			text-align: center;
			line-height: 88rpx;
			font-weight: 600;
		}

		.top-bar-l {
			float: left;
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

	.main {
		padding: 108rpx 40rpx;

		.requester {
			margin-top: 100rpx;
			padding: 20rpx;
			background: white;
			box-shadow: 0rpx 24rpx 64rpx -8rpx rgba(0, 0, 0, 0.1);
			border-radius: 20rpx;
		}

		.request-top {
			display: flex;
			flex-direction: row;

			.btn {
				flex: none;
				width: 160rpx;
				height: 64rpx;
				background: rgba(255, 93, 91, 0.1);
				border-radius: 40rpx;
				text-align: center;
				line-height: 64rpx;
				font-size: 32rpx;
			}

			.reject {
				color: $uni-color-warning;
				background-color: rgba(255, 93, 91, 0.1);
			}

			.aggree {
				color: black;
				background-color: rgba(12, 255, 182, 0.5);
			}

			.user-icon {
				flex: auto;
				text-align: center;

				image {
					margin-top: -25%;
					width: 144rpx;
					height: 144rpx;
					border-radius: 50%;
				}
			}
		}

		.request-center {
			text-align: center;
			padding-top: 20rpx;
			padding-bottom: 30rpx;

			.title {
				font-size: 36rpx;
				font-weight: 550;
				line-height: 48rpx;
			}

			.time {
				font-size: 24rpx;
				line-height: 32rpx;
				color: rgba(39, 40, 50, 0.4)
			}
		}

		.comments {
			padding: 32rpx;
			border-radius: 20rpx;
			background: rgba(243, 244, 246, 1);
			font-size: 28rpx;
			color: rgba(39, 40, 50, 0.8);
			line-height: 40rpx;
		}
	}
</style>
