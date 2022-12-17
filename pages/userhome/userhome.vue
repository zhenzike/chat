<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-l">
				<view class="iconfont" @tap="back">&#xe779;</view>
			</view>
			<view class="top-bar-r" @tap="toUserDetial">
				<image src="../../static/images/common/more1.png"></image>
			</view>
		</view>
		<view class="bg">
			<view class="white-bg" :animation="aniAddFriendBgColor"></view>
			<image class="img-bg" :src="user.imgurl" mode="aspectFill"></image>
		</view>
		<view class="main">
			<view class="user-icon">
				<view class="sex" :style="{background:sexcolor}" :animation="aniAddFriendDataSex">
					<image :src="sexicon"></image>
				</view>
				<image class="icon" :src="user.imgurl" mode="aspectFill" :animation="aniAddFriendDataIcon"></image>
			</view>
			<view class="user-message">
				<view class="name">{{user.name}}</view>

				<view class="mess">{{user.message}}</view>
			</view>
		</view>
		<view class="btn-div" v-show="!isUser">
			<view class="btn" @tap="aniAddFriend" v-if="isfriend==0">加为好友</view>
			<view class="btn" v-else>发送消息</view>
		</view>

		<!-- 好友请求页面 -->
		<view class="add-friend" :animation="aniAddFriendData">
			<!-- :style="{height:addHeight+'px'}" -->
			<view class="name">{{user.name}}</view>
			<textarea class="add-main" v-model="message" maxlength="120"></textarea>
		</view>
		<view class="add-bt" :animation="aniAddFriendDataBtn">
			<view class="close" @tap="aniAddFriend">取消</view>
			<view class="send" @tap="addSubmit">发送</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				sexcolor: '',
				addHeight: '', //加好友页面高度
				isAdd: false, // 是否继续加好友
				userid: '', //登录用户id
				name: '',
				imgurl: '',
				token: '',
				isUser: false,
				message: '',
				friendid: '', //进入页面的对应用户id
				sexicon: '', //显示性别的图像
				isfriend: 0, //是否为好友
				user: {
					name: '',
					nickname: '莱莱',
					message: '',
					sex: '',
					imgurl: ''
				},
				aniAddFriendData: {},
				aniAddFriendDataBtn: {},
				aniAddFriendDataIcon: {},
				aniAddFriendDataSex: {},
				aniAddFriendBgColor: {}
			}
		},

		onLoad(e) {
			this.getStorages();
			this.friendid = e.id;
			if (e.id == this.userid) {
				this.isUser = true
			}
			this.getUserMsg()
	
		},
		
		onShow(){
			this.getUserMsg()
			this.isFriend()
		},

		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			//添加好友动画
			aniAddFriend() {
				this.isAdd = !this.isAdd
				var animation = uni.createAnimation({
					duration: 300,
					timingFunction: 'ease',
				})
				var animationBtn = uni.createAnimation({
					duration: 350,
					timingFunction: 'ease',
				})
				var animationIcon = uni.createAnimation({
					duration: 300,
					timingFunction: 'ease',
				})
				var animationSex = uni.createAnimation({
					duration: 0,
					timingFunction: 'ease',
				})
				var animationBgColor = uni.createAnimation({
					duration: 300,
					timingFunction: 'ease',
				})
				if (this.isAdd) {
					animation.bottom(0).step();
					animationBtn.bottom(0).step();
					animationIcon.width('240rpx').height('240rpx').top('80rpx').right('150rpx').step();
					animationSex.opacity(0).step()
					animationBgColor.backgroundColor('rgba(0, 170, 255, 0.6)').step()
				} else {
					animation.bottom(-this.addHeight).step();
					animationBtn.bottom(-this.addHeight).step();
					animationIcon.width('400rpx').height('400rpx').top(0).right(0).step();
					animationSex.opacity(1).step()
					animationBgColor.backgroundColor('rgba(0, 170, 255, 0)').step()
				}

				this.aniAddFriendData = animation.export();
				this.aniAddFriendDataBtn = animationBtn.export();
				this.aniAddFriendDataIcon = animationIcon.export();
				this.aniAddFriendDataSex = animationSex.export();
				this.aniAddFriendBgColor = animationBgColor.export();
				this.message = this.name + ' 请求加你为好友'
			},
			//获取节点高度，用于解决取消加好友下拉动画问题
			getElementStyle() {
				const query = uni.createSelectorQuery().in(this);
				query.select('.add-friend').boundingClientRect(data => {
					this.addHeight = data.height;
				}).exec();
			},

			//获取缓存
			getStorages() {
				try {
					let Storage = uni.getStorageSync('user')
					this.userid = Storage.id;
					this.name = Storage.name;
					this.imgurl = Storage.imgurl;
					this.token = Storage.token;
				} catch {
					console.log('获取缓存失败');
				}
			},

			//确认添加好友
			addSubmit() {
				this.aniAddFriend()
				if (this.message.length > 0) {
					uni.request({
						url: this.$serverUrl + '/friend/applyfriend',
						data: {
							userid: this.userid,
							friendid: this.friendid,
							message: this.message
						},
						method: 'POST',
						success: (data) => {
							let status = data.data.status
							if (status == 200) {
								uni.showToast({
									title: '好友请求发送成功',
									icon: 'none',
									duration: 2000
								});
							} else if (status == 500) {
								uni.showToast({
									title: '服务器出错',
									icon: 'none',
									duration: 2000
								});
							} else {
								uni.showToast({
									title: '其他出错',
									icon: 'none',
									duration: 2000
								});
							}
						}
					})
				}
			},

			//获取用户信息
			getUserMsg() {
				uni.request({
					url: this.$serverUrl + '/user/detail',
					data: {
						id: this.friendid
					},
					method: 'POST',
					success: (data) => {
						let res = data.data.results[0]						
						let status = data.data.status			
						if (status == 200) {
							this.user.name = res.name
							this.user.message = res.synopsis
							this.user.sex = res.sex
							this.user.imgurl = this.$serverUrl + '/user/' + res.imgurl
							this.getSex()
						
						} else {
							uni.showToast({
								title: '服务器出错',
								icon: 'none',
								duration: 2000
							});
						}
					}
				})
				
			},


			//判断是否为好友
			isFriend() {
				
				uni.request({
					url: this.$serverUrl + '/search/isfriend',
					data: {
						userid: this.userid,
						friendid: this.friendid
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status
						if (status == 200) {						
							this.isfriend = 1
						} else if (status == 400) {
							this.isfriend = 0
						} else {
							uni.showToast({
								title: '服务器出错',
								icon: 'none',
								duration: 2000
							});
						}
					}
				})
			},

			//性别判断
			getSex() {
				if (this.user.sex == '男') {
					this.sexicon = '../../static/images/common/man.png'
					this.sexcolor = 'rgba(67, 255, 249, 1.0)'
				} else {
					this.sexicon = '../../static/images/common/woman.png'
					this.sexcolor = 'rgba(255,93,91,1)'
				}
			},


			//前往用户详情
			toUserDetial() {
				if (this.isUser) {
					uni.navigateTo({
						url: '../userdetail/userdetail?id=' + this.friendid 
					})
				} else {
					uni.navigateTo({
						url: '../userdetail/userdetail?id=' + this.friendid 
					})
				}
			}

		},
		onReady() {
			this.getElementStyle()
		},


	}
</script>

<style lang="scss""">
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
		background: rgba(255, 255, 255, 0);

		.top-bar-r {
			float: right;
			padding-top: 12rpx;
			padding-right: 32rpx;

			image {
				width: 64rpx;
				height: 64rpx;
			}
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

	.bg {
		position: fixed;
		top: 0;
		left: 0;
		z-index: -2;
		width: 100%;
		height: 100%;

		.white-bg {
			width: 100%;
			height: 100%;
		}

		.img-bg {
			position: absolute;
			top: -10rpx;
			left: -10rpx;
			z-index: -1;
			width: 110%; //这里多设置为10%，是为了结合上面的偏移去除填充图片后的白边
			height: 110%;
			filter: blur(5px);
			opacity: 0.6;
		}
	}

	.main {
		text-align: center;
		padding-top: 148rpx;

		.user-icon {
			position: relative;
			width: 400rpx;
			height: 400rpx;
			top: 50rpx;
			margin: 0 auto;

			.sex {
				position: absolute;
				z-index: 10;
				bottom: 24rpx;
				right: 24rpx;
				width: 64rpx;
				height: 64rpx;
				// background: #FF5D5B;  //考虑到性别不同颜色不同，这里不写死
				border-radius: 56rpx;

				image {
					padding: 16rpx;
					width: 32rpx;
					height: 32rpx;
					line-height: 64rpx;
				}
			}

			.icon {
				z-index: 9;
				top: 0;
				width: 400rpx;
				height: 400rpx;
				border: 6rpx solid #FFFFFF;
				border-radius: 120rpx;
			}
		}

		.user-message {
			padding-top: 70rpx;

			.name {
				font-size: 52rpx;
				color: #272832;
				font-weight: 500;
				line-height: 68rpx;
			}



			.mess {
				padding: 20rpx 120rpx;
				font-size: 28rpx;
				color: #272832;
				line-height: 48rpx;
				font-weight: 200;
			}
		}

	}

	.btn-div {
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 104rpx;
		padding: 12rpx 40rpx;
		box-sizing: border-box;

		.btn {
			width: 684rpx;
			height: 80rpx;
			background: #7FFFD4;
			border-radius: 10rpx;
			text-align: center;
			line-height: 80rpx;
			font-size: 32rpx;
			color: white;
		}
	}

	.add-friend {
		position: fixed;
		box-sizing: border-box;
		bottom: -75%;
		width: 100%;
		height: 75%;
		padding: 0 56rpx;
		background: rgb(255, 255, 255);
		border-radius: 40rpx 40rpx 0px 0px;

		.name {
			padding: 200rpx 0 40rpx;
			font-size: 52rpx;
			color: #272832;
			font-weight: 400;
			line-height: 74rpx;
		}

		.add-main {
			height: 320rpx;
			background: #F3F4F6;
			border-radius: 20px;
			font-size: 32rpx;
			color: #272832;
			font-weight: 400;
			padding: 18rpx 20rpx;
			line-height: 44rpx;
		}
	}

	.add-bt {
		display: flex;
		position: fixed;
		bottom: -25%;
		width: 100%;
		height: 15%;
		padding: 12rpx 40rpx;
		box-sizing: border-box;

		.close {
			margin: auto;
			height: 80rpx;
			width: 172rpx;
			background: #F3F4F6;
			border-radius: 10rpx;
			text-align: center;
			line-height: 80rpx;
			font-size: 32rpx;
			color: #272832;
		}

		.send {
			flex: auto;
			margin: auto auto auto 40rpx;
			height: 80rpx;
			background: #7FFFD4;
			border-radius: 10rpx;
			text-align: center;
			line-height: 80rpx;
			font-size: 32rpx;
			color: white;
		}
	}
</style>
