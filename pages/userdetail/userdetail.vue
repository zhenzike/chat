<template>
	<view class="content">
		<view class="mask"></view>
		<view class="top-bar">
			<view class="top-bar-l">
				<view class="iconfont" @tap="back">&#xe779;</view>
			</view>
			<view class="top-bar-center">详情</view>
		</view>
		<view class="main">
			<view class="headerCol">
				<view class="head">
					<view class="title">头像</view>
					<view class="content">
						<image class="user-img" :src="dataArr.imgurl" @tap="isContainer"></image>
					</view>
					<!-- <view class="more" v-show="isUser">&#xe775</view> -->
				</view>
				<view class="head">
					<view class="title">签名</view>
					<view class="content">
						{{dataArr.sign}}
					</view>
					<view class="more" @tap="aniModify('签名',dataArr.sign,'sign')" v-show="isUser">&#xe775</view>
				</view>
				<view class="head">
					<view class="title">注册时间</view>
					<view class="content">
						{{dateTime(dataArr.time)}}
					</view>
					<!-- <view class="more">&#xe775</view> -->
				</view>
				<view class="head">
					<view class="title">性别</view>
					<view class="content">
						<!-- 这里使用了uniapp官方提供的选择器组件进行性别选择 -->

						<picker @change="bindPickerChange" :value="index" :range="array" v-if="isUser">
							<view class="uni-input">{{array[index]}}</view>
						</picker>
						<view class="uni-input" v-else>{{array[index]}}</view>
					</view>
				</view>
				<view class="head">
					<view class="title">电话</view>
					<view class="content">
						{{dataArr.tell}}
					</view>
					<view class="more" @tap="aniModify('电话',dataArr.tell,'tell')" v-show="isUser">&#xe775</view>
				</view>
				<view class="head">
					<view class="title">邮箱</view>
					<view class="content">
						{{dataArr.mail}}
					</view>
					<view class="more" @tap="aniModify('邮箱',dataArr.mail,'emial')" v-show="isUser">&#xe775</view>
				</view>
				<view class="head" v-show="isUser">
					<view class="title">密码</view>
					<view class="content">
						*********
					</view>
					<view class="more" @tap="aniModify('密码','','password')">&#xe775</view>
				</view>
			</view>
			<view class="bt" v-if="userid==friendid " @tap="closeLogin">退出登录</view>
			<view class="bt" v-else-if="isfriend==1" @tap="closeFriend">删除好友</view>
		</view>
		<!-- 裁剪工具 -->
		<view class="container" v-if="containerIs">
			<view class="cropper-wrap">
				<image-cropper id="image-cropper" :zoom="1" :angle="0" :src="src" canvasBackground="red"
					@cropped="cropped" @afterDraw="afterDraw" @beforeDraw="beforeDraw" />

			</view>
			<button @tap="selectImg">上传图片</button>
			<button @tap="uploadImg">上传</button>
		</view>
		<!-- 裁剪工具 -->

		<!-- 修改弹窗 -->
		<view class="modify" :animation="modifyAni">
			<view class="modify-header">
				<view class="close" @tap="aniModify">取消</view>
				<view class="title">{{modifyTitle}}</view>
				<view class="define" @tap="modifyDefine">确定</view>
			</view>
			<view class="modify-main">
				<textarea v-model="modifyData" class="modify-content"></textarea>
			</view>
		</view>
	</view>
</template>

<script>
	import ImageCropper from '../../components/uniapp-nice-cropper/cropper.vue'
	export default {
		data() {
			return {
				dataArr: {
					name: '',
					imgurl: '',
					sign: '', //签名
					time: new Date(),
					sex: '',
					tell: '',
					mail: '',
					password: ''
				},
				userid: null,
				token: null,
				imgurl: null,
				name: null,
				index: '0',
				array: [], //性别选项
				src: '',
				containerIs: false, //裁剪工具是否可见
				modifyData: '想要修改的内容',
				modifyTitle: '',
				modifyAni: {},
				ismodify: false,
				modifyHeight: '0', //修改页面高度
				friendid: 0, //用户id
				isUser: false,
				isfriend: 0,
				imagePath: '', //裁剪好的图片路径
				pathName: '', //文件经后端处理后的文件名
				updateMsgType: null,
				oldImgUrl: '' //头像的旧路径
			}
		},
		onLoad(e) {
			this.friendid = e.id; //用户id
			this.getStorages();
			if (e.id == this.userid) {
				this.isUser = true
			}

		},

		onShow() {
			this.isFriend()
		},

		methods: {
			getStorages() {
				try {
					let Storage = uni.getStorageSync('user')
					this.userid = Storage.id;
					this.name = Storage.name;
					this.imgurl = Storage.imgurl;
					this.token = Storage.token;
					this.getUserMsg()
				} catch {
					console.log('获取缓存失败');
				}
			},

			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			//确认修改性别
			bindPickerChange(e) {
				this.index = e.detail.value
				this.updateDate()
			},
			//裁剪插件方法--------------------
			selectImg() {
				uni.chooseImage({
					count: 1,
					sizeType: ['original'],
					sourceType: ['album', 'camera'],
					success: res => {
						var tempFilePaths = res.tempFilePaths
						this.src = tempFilePaths[0]

					}
				})
			},
			//控制图片背景色
			beforeDraw(context, transform) {
				context.setFillStyle('white')
				transform.zoom = 2
			},
			afterDraw(ctx, info) {
				ctx.fillText('', 20, 20)
				// console.log(`当前画布大小：${info.width}*${info.height}`)

			},
			//获取裁剪好的图片路径
			cropped(imagePath, imageInfo) {
				// console.log(imagePath, imageInfo)
				this.imagePath = imagePath

			},

			//上传头像
			uploadImg() {
				uni.uploadFile({
					url: this.$serverUrl + '/files/upload', //
					filePath: this.imagePath,
					name: 'file',
					fileType: 'image',
					formData: {
						'url': 'user'
					},
					success: (uploadFileRes) => {
						let data = JSON.parse(uploadFileRes.data)
						this.pathName = data[0].filename
						try {
							uni.setStorageSync('user', {
								id: this.userid,
								imgurl: this.pathName,
								name: this.name,
								token: this.token,
							})
							this.dataArr.imgurl = this.$serverUrl + '/user/' + this.pathName //上传头像后将头像内容修改
							// console.log(this.pathName,this.dataArr.imgurl);
							this.updateDate()
						} catch {
							console.log('修改缓存数据出错');
						}
					}
				});
			},
			//裁剪插件方法-----------------
			isContainer() {
				if (!this.isUser) {
					return
				}
				this.containerIs = !this.containerIs
			},
			//修改数据栏弹出动画
			aniModify(title, data, type) {

				this.ismodify = !this.ismodify
				var animation = uni.createAnimation({
					duration: 300,
					timingFunction: 'ease',
				})
				if (this.ismodify) {
					animation.bottom(0).step()
					this.modifyTitle = title;
					this.modifyData = data;
					this.updateMsgType = type
				} else {
					animation.bottom(-this.modifyHeight).step();
				}

				this.modifyAni = animation.export();
			},

			getElementStyle() {
				const query = uni.createSelectorQuery().in(this);
				query.select('.modify').boundingClientRect(data => {
					this.modifyHeight = data.height;
				}).exec();
			},

			//确认修改签名等
			modifyDefine() {
				this.aniModify()
				this.dataArr[this.updateMsgType] = this.modifyData
				this.updateDate()

			},

			dateTime(time) {
				//得到获取消息的具体时间		
				let date = new Date(time);
				let d = date.getTime();
				let h = date.getHours();
				let m = date.getMinutes();
				let Y = date.getFullYear();
				let M = date.getMonth() + 1;
				let D = date.getDate();
				return this.addZero(Y) + '-' + this.addZero(M) + '-' + this.addZero(D)
			},

			addZero(n) {
				return n > 0 ? n : '0' + n;
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
							this.dataArr.name = res.name
							this.dataArr.sex = res.sex
							this.dataArr.imgurl = this.$serverUrl + '/user/' + res.imgurl
							this.oldImgUrl = res.imgurl
							this.dataArr.tell = res.phone
							this.dataArr.password = res.password
							this.dataArr.sign = res.synopsis
							this.dataArr.mail = res.email
							this.dataArr.time = res.time
							if (res.sex == '男') {
								this.array = ['男', '女']
							} else {
								this.array = ['女', '男']
							}
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
			// 数据修改
			updateDate() {
				uni.request({
					url: this.$serverUrl + '/user/userupdate',
					data: {
						name: this.dataArr.name,
						password: this.dataArr.password,
						email: this.dataArr.mail,
						sex: this.array[this.index],
						phone: this.dataArr.tell,
						synopsis: this.dataArr.sign,
						imgurl: this.pathName == '' ? this.oldImgUrl : this.pathName,
						id: this.friendid,
						isUpdatePassword: this.updateMsgType == 'password' ? true : false //是否修改的是密码
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status
						if (status == 200) {
							uni.showToast({
								title: '修改用户信息成功',
								icon: 'none',
								duration: 2000
							});
						} else {
							uni.showToast({
								title: '修改用户信息出错',
								icon: 'none',
								duration: 2000
							});
						}
					}
				})
			},

			//退出登录
			closeLogin() {
				uni.removeStorageSync('user')
				uni.navigateTo({
					url: '/pages/login/login'
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
							//是好友
							this.isfriend = 1
						} else if (status == 400) {
							//不是好友
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

			//删除好友
			closeFriend() {
				uni.request({
					url: this.$serverUrl + '/friend/deletefriend',
					data: {
						userid: this.userid,
						friendid: parseInt(this.friendid)
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status
						if (status == 200) {
							uni.showToast({
								title: '已删除该好友',
								icon: 'none',
								duration: 2000
							});
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
			}

		},
		onReady() {
			this.getElementStyle()
		},

		components: {
			ImageCropper
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
		position: relative;
	}

	.top-bar {
		position: fixed;
		z-index: 100;
		top: var(--status-bar-height);
		left: 0;
		width: 100%;
		height: 88rpx;
		background: rgba(255, 255, 255, 0);
		border-bottom: 1px solid rgba(39, 40, 50, 0.1);

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

		.top-bar-center {
			font-size: 40rpx;
			color: #272832;
			font-weight: 400;
			line-height: 88rpx;
			text-align: center;
			margin-right: 78rpx;
		}
	}

	.main {
		padding-top: 118rpx;
		display: flex;
		flex-direction: column;

		.headerCol {
			display: flex;
			flex-direction: column;

			.head {
				display: flex;
				flex-direction: row;


				.title {
					flex: none;
					margin: auto;
					padding: 0 32rpx;
					font-size: 32rpx;
					color: #272832;
					font-weight: 400;
					line-height: 112rpx;

				}

				.content {
					flex: auto;
					font-size: 32rpx;
					color: rgba(39, 40, 50, 0.6);
					line-height: 112rpx;
					/*1．先强制一行内显示文本*/
					white-space: nowrap; //(默认normal自动换行)
					/*2．超出的部分隐藏*/
					overflow: hidden;
					/*3．文字用省略号替代超出的部分*/
					text-overflow: ellipsis;

					image {
						width: 108rpx;
						height: 100%;
						border-radius: 20rpx;
					}
				}

				.more {
					flex: none;
					margin: auto;
					font-family: "iconfont" !important;
					font-size: 38rpx;
					font-style: normal;
					-webkit-font-smoothing: antialiased;
					-moz-osx-font-smoothing: grayscale;

				}
			}
		}

		.bt {
			padding-top: 160rpx;
			text-align: center;
			line-height: 44rpx;
			font-size: 36rpx;
			color: #FF5D5B;
			font-weight: 500;
		}
	}

	.container {
		position: fixed;
		top: 260rpx;
		height: 400rpx;
		width: 100%;

		.cropper-wrap {
			height: calc(100% - 96rpx);
		}
	}

	.modify {
		position: fixed;
		bottom: -100%;
		left: 0;
		z-index: 300;
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
</style>
