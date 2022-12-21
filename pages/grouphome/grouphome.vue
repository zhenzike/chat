<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-l">
				<view class="iconfont" @tap="back">&#xe779;</view>
			</view>
		</view>
		<view class="bg">
			<image class="bg-img" :src="groupImgurl" mode="aspectFill"></image>
		</view>
		<view class="main">

			<view class="main-centent">
				<!-- 群简介 -->
				<view class="synopsis">
					<view class="name">{{dataArr.groupName}}</view>
					<view class="time">{{fileTimeName(buildTime)}}</view>
					<view class="sign">{{dataArr.groupTip}}</view>
				</view>

				<!-- 群成员 -->
				<view class="member">
					<view class="top">
						<view class="title">群成员</view>
						<view class="more" @tap="moreUser">查看更多</view>
						<image src="../../static/images/common/right.png"></image>
					</view>
					<view class="member-ls">
						<view class="list" v-for="(item,index) in groupMenber.slice(0,4)" :key="index">
							<view class="msg">
								<image class="X" src="../../static/images/common/flase.png"></image>
								<image class="msg-icon" :src="item.imgurl"></image>
							</view>
							<view class="name">{{item.name}}</view>
						</view>
						<view class="list list-add">
							<view class="msg">
								<image class="msg-add" src="../../static/images/index/add.png"></image>
							</view>
							<view class="name">邀请</view>
						</view>
					</view>
				</view>

				<!-- 群设置 -->
				<view class="item">
					<view class="row">
						<view class="title">群名称</view>
						<view class="cont">{{dataArr.groupName}}</view>
						<view class="more">
							<image src="../../static/images/common/right.png" @tap="aniModify('群名称',dataArr.groupName)">
							</image>
						</view>
					</view>
					<view class="row">
						<view class="title">群头像</view>
						<view class="cont">
							<image :src="groupImgurl" @tap="sendImg"></image>
						</view>
						<view class="more">
							<image src="../../static/images/common/right.png"></image>
						</view>
					</view>
					<view class="row">
						<view class="title">群公告</view>
						<view class="cont">{{dataArr.groupTip}}</view>
						<view class="more">
							<image src="../../static/images/common/right.png" @tap="aniModify('群公告',dataArr.groupTip)">
							</image>
						</view>
					</view>

					<view class="row">
						<view class="title">消息免打扰</view>
						<view class="switch">
							<switch @change="switch1Change" style="transform:scale(0.9)" :checked="shield==1" />
						</view>
					</view>
				</view>

			</view>
			<view class="bt" @tap="exitGroup">退出群聊</view>
		</view>
		<!-- 修改弹窗 -->
		<view class="modify" :animation="modifyAni">
			<view class="modify-header">
				<view class="close" @tap="aniModify">取消</view>
				<view class="title">{{modifyTitle}}</view>
				<view class="define" @tap="modifyDefine(modifyData)">确定</view>
			</view>
			<view class="modify-main">
				<textarea v-model="modifyData" class="modify-content"></textarea>
			</view>
		</view>

		<!-- 更多成员 -->

		<view class="moreuser" :animation="moreUserAni">
			<view class="moreuser-header">
				<view class="back" @tap="moreUser">取消</view>
				<view class="title">群聊成员</view>
			</view>
			<view class="userList" v-for="(item,index) in groupMenber" :key="index">
				<view class="userItem">
					<view class="iconBox">
						<image class="userIcon" :src="item.imgurl"></image>
					</view>
					<view class="userName">{{item.name}}</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import myfun from '../../commons/js/myFunction.js'
	export default {
		data() {
			return {
				groupId: 0, //群id
				groupImgurl: '', //群头像
				groupMenber: [], //群成员
				userid: 0, //登录用户id
				buildTime: '', //建群时间
				groupIconName: '', //上传后返回的图片名称
				shield: 0, //是否开启勿扰
				modifyAni: {}, //修改页弹出动画
				moreUserAni: {}, //群成员弹出动画
				modifyData: '想要修改的内容', //修改栏得到的内容
				modifyTitle: '',
				ismodify: false, //是否修改资料
				isMoreUser: false,
				modifyHeight: '0', //修改页面高度
				moreUserHeight: '0',
				oldData: '',
				dataArr: {
					groupName: '',
					groupTip: '',
				}
			}
		},
		onLoad(e) {
			this.groupId = e.groupid
			this.getLoginStorage()
			this.getGroupDetail()
		},

		onShow() {
			this.getMember()
		},

		onReady() {
			this.getElementStyle()
		},
		methods: {
			getLoginStorage() {
				try {
					const value = uni.getStorageSync('user')
					if (value) {
						this.userid = value.id
					} else {
						uni.navigateTo({
							url: '../login/login'
						})
					}
				} catch {
					console.log('获取缓存失败');
				}
			},



			back() {
				uni.navigateBack({
					delta: 1
				})
			},

			//获取群详情
			getGroupDetail() {
				uni.request({
					url: this.$serverUrl + '/group/getgroupdetail',
					data: {
						userid: this.userid,
						groupid: this.groupId
					},
					method: 'POST',
					success: ({
						data: data
					}) => {
						if (data.status == 200) {

							this.dataArr.groupName = data.data.name
							this.dataArr.groupTip = data.data.notice
							this.shield = data.data.shield
							this.buildTime = data.data.time
							this.groupImgurl = this.$serverUrl + '/group/' + data.data.imgurl
							this.groupIconName = data.data.imgurl
						} else {
							uni.showToast({
								title: '获取信息失败',
								icon: 'none',
								duration: 2000
							});
						}
					}
				})
			},

			//获取群成员
			getMember() {
				// let member = datas.frineds()
				// member.forEach((k) => {
				// 	k.imgUrl = `../../static/images/image/${k.imgUrl}`
				// })
				// this.groupMenber = member

				uni.request({
					url: this.$serverUrl + '/group/getgroupuser',
					data: {
						groupid: this.groupId
					},
					method: 'POST',
					success: ({
						data: data
					}) => {
						if (data.status == 200) {
							data.data.forEach(k => {
								k.imgurl = this.$serverUrl + '/user/' + k.imgurl
							})
							this.groupMenber = data.data

						} else {
							uni.showToast({
								title: '获取信息失败',
								icon: 'none',
								duration: 2000
							});
						}
					}
				})
			},
			switch1Change() {
				this.shield = this.shield == 0 ? 1 : 0;
				this.updateGroupdetail()
			},

			//选择图片
			sendImg() {
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (res) => {

						this.sendGroupImg(res.tempFilePaths[0])
					}
				});
			},

			//上传群头像
			sendGroupImg(imgurl) {
				const uploadTask = uni.uploadFile({
					url: this.$serverUrl + '/files/upload',
					filePath: imgurl,
					name: 'file',
					formData: {
						'url': 'group'
					},
					success: (uploadFileRes) => {
						let data = JSON.parse(uploadFileRes.data)
						this.groupIconName = data[0].filename //上传后的图片名称
						this.groupImgurl = this.$serverUrl + '/group/' + this.groupIconName
						this.updateGroupdetail()
					}
				});
			},


			//修改群资料
			updateGroupdetail() {
				uni.request({
					url: this.$serverUrl + '/group/updategroupdetail',
					data: {
						userId: this.userid,
						groupId: this.groupId,
						shield: this.shield,
						groupName: this.dataArr.groupName,
						groupTip: this.dataArr.groupTip,
						groupIcon: this.groupIconName
					},
					method: 'POST',
					success: ({
						data: data
					}) => {
						console.log(data);
					}
				})
			},


			//修改页弹出
			aniModify(type, data) {
				this.ismodify = !this.ismodify
				var animation = uni.createAnimation({
					duration: 300,
					timingFunction: 'ease',
				})
				if (this.ismodify) {
					animation.bottom(0).step()
					this.modifyTitle = type;
					this.modifyData = data;
					this.oldData = data;
				} else {
					animation.bottom(-this.modifyHeight).step();
				}

				this.modifyAni = animation.export();
			},

			//群成员弹出
			moreUser() {

				this.isMoreUser = !this.isMoreUser
				console.log(this.isMoreUser);
				var animation1 = uni.createAnimation({
					duration: 300,
					timingFunction: 'ease',
				})
				if (this.isMoreUser) {
					animation1.bottom(0).step()
				} else {
					animation1.bottom(-this.moreUserHeight).step();
				}
				this.moreUserAni = animation1.export()
			},

			getElementStyle() {
				const query = uni.createSelectorQuery().in(this);
				query.select('.modify').boundingClientRect(data => {
					this.modifyHeight = data.height;
				}).exec();
				query.select('.moreuser').boundingClientRect(data => {
					this.moreUserHeight = data.height;
				}).exec();
			},

			//确认修改签名等
			modifyDefine(data) {
				let arr = Object.keys(this.dataArr)
				let key = arr.find(k => this.dataArr[k] == this.oldData)
				this.dataArr[key] = data;
				this.updateGroupdetail()
				this.aniModify()
			},

			//退出群聊
			exitGroup() {
				uni.request({
					url: this.$serverUrl + '/group/exitgroup',
					data: {
						userid: this.userid,
						groupid: this.groupId
					},
					method: 'POST',
					success: (data) => {
						console.log(data);
					}
				})
			},

			//格式化时间
			fileTimeName(time) {
				return (new Date(time).getFullYear()) + '/' + (new Date(time).getMonth() + 1) + '/' + (new Date(time)
					.getDate())
			}
		},
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
		width: 100%;
		height: 100%;
		background-color: #fff;
		position: fixed;
		top: 0;
		left: 0;
		z-index: -1;

		.bg-img {
			width: 100%;
			height: 750rpx;
		}
	}

	.main {
		padding-top: 360rpx;

		.main-centent {
			width: 100%;
			min-height: 400rpx;
			background-color: #fff;
			border-radius: 40rpx 40rpx 0 0;

			.synopsis {
				padding: 40rpx 32rpx;
				box-sizing: border-box;
				border-bottom: 1px solid #eee;

				.name {
					float: left;
					font-size: 48rpx;
					color: #272832;
					font-weight: 600;
					line-height: 66rpx;
				}

				.time {
					float: right;
					font-size: 28rpx;
					color: rgba(39, 40, 50, 0.50);
					font-weight: 400;
					line-height: 66rpx;
				}

				.sign {
					padding-top: 20rpx;
					clear: both;
					font-size: 28rpx;
					color: #272832;
					font-weight: 400;
					overflow: hidden;
					text-overflow: ellipsis;
					/*弹性伸缩盒子模型显示*/
					display: -webkit-box;
					/*限制在一个块元素显示的文本的行数*/
					-webkit-line-clamp: 2;
					/*设置或检索伸缩盒对象的子元素的排列方式*/
					-webkit-box-orient: vertical;
				}
			}

			.member {
				border-bottom: 1px solid #eee;

				.top {
					padding: 40rpx 32rpx;
					box-sizing: border-box;
					height: 100rpx;
					width: 100%;
					display: flex;
					align-items: center;

					.title {
						flex: auto;
						font-size: 36rpx;
						color: #272832;
						font-weight: 600;
					}

					.more {
						flex: none;
						padding-right: 20rpx;
						font-size: 32rpx;
						color: rgba(39, 40, 50, 0.60);
						font-weight: 400;
					}

					image {
						flex: none;
						width: 32rpx;
						height: 32rpx;
					}
				}

				.member-ls {
					width: 100%;
					padding: 20rpx 16rpx;
					box-sizing: border-box;

					.list {
						padding-bottom: 32rpx;
						width: 20%;
						float: left;
						text-align: center;


						.msg {
							position: relative;
							display: inline-block;
							width: 104rpx;
							height: 104rpx;
							border-radius: 20rpx;

						}

						.msg-add {
							width: 104rpx;
							height: 104rpx;
							padding: 32rpx;
							box-sizing: border-box;
							background-color: #eee;
							border-radius: 20rpx;
						}

						.msg-icon {

							width: 104rpx;
							height: 104rpx;
							border-radius: 20rpx;

						}

						.X {
							position: absolute;
							top: -15rpx;
							right: -15rpx;
							width: 30rpx;
							height: 30rpx;
							z-index: 2;
						}

						.name {
							padding: 0 8rpx;
							line-height: 40rpx;
							font-size: 28rpx;
							color: #272832;
							font-weight: 400;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						}
					}
				}

				.member-ls:after {
					//用于清除浮动影响
					content: "";
					display: block;
					height: 0;
					clear: both;
					visibility: hidden;
				}

			}

			.item {
				display: flex;
				flex-direction: column;
				padding: 40rpx 32rpx;
				width: 100%;
				border-bottom: 1px solid #eee;
				box-sizing: border-box;

				.row {
					flex: none;
					display: flex;
					flex-direction: row;
					line-height: 88rpx;

					.title {
						flex: none;
						font-size: 32rpx;
						color: #272832;
						font-weight: 400;
						margin: auto;

					}

					.cont {
						padding: 0 20rpx;
						flex: auto;
						font-size: 32rpx;
						color: rgba(39, 40, 50, 0.60);
						font-weight: 400;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;

						image {
							width: 80rpx;
							height: 80rpx;
							border-radius: 20rpx;
						}
					}

					.more {
						flex: none;
						margin: auto;

						image {
							width: 32rpx;
							height: 32rpx;
						}
					}

					.switch {
						text-align: right;
						flex: auto
					}
				}
			}


		}

		.bt {
			padding-top: 50rpx;
			text-align: center;
			line-height: 44rpx;
			font-size: 36rpx;
			color: #FF5D5B;
			font-weight: 500;
		}
	}

	.modify {
		position: fixed;
		bottom: -100%;
		left: 0;
		z-index: 1005;
		height: 100%;
		width: 100%;
		background: white;

		.modify-header {
			display: flex;
			flex-direction: row;
			padding-top: var(--status-bar-height);
			width: 100%;
			height: 88rpx;
			align-items: center;

			.close {
				padding-left: 32rpx;
				font-size: 32rpx;
				color: #272832;
				font-weight: 400;
			}

			.title {
				flex: auto;
				font-size: 40rpx;
				color: #272832;
				font-weight: 600;
				line-height: 88rpx;
				text-align: center;
			}

			.define {
				padding-right: 32rpx;
				font-size: 32rpx;
				color: #00aaff;
				font-weight: 400;
			}
		}

		.modify-main {
			display: flex;
			padding: 34rpx 32rpx 42rpx;

			.modify-content {
				flex: auto;
				padding: 16rpx 20rpx;
				height: 386rpx;
				background: #F3F4F6;
				border-radius: 20rpx;
				font-size: 32rpx;
				color: #272832;
				font-weight: 400;
			}
		}
	}

	.moreuser {
		position: fixed;
		bottom: -100%;
		z-index: 1000;
		width: 100%;
		height: 100%;
		background-color: white;

		.moreuser-header {
			display: flex;
			flex-direction: row;
			padding-top: var(--status-bar-height);
			margin-bottom: 24rpx;
			width: 100%;
			height: 88rpx;
			align-items: center;
			border-bottom: 1px solid #eae2e6;

			.back {
				padding-left: 32rpx;
				font-size: 32rpx;
				color: #272832;
				font-weight: 400;
			}

			.title {
				flex: auto;
				font-size: 40rpx;
				color: #272832;
				font-weight: 600;
				line-height: 88rpx;
				text-align: center;
				padding-right: 96rpx;
			}
		}

		.userItem {
			display: flex;
			height: 112rpx;
			width: 100%;
			padding: 0 24rpx 36rpx;


			.iconBox {
				flex: none;
				margin: auto 0;
				padding-right: 36rpx;

				.userIcon {
					height: 88rpx;
					width: 88rpx;
					border-radius: 50%;
				}
			}

			.userName {
				flex: auto;
				margin: auto 0;

			}
		}
	}
</style>
