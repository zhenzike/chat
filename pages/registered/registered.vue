<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-l">
				<view class="iconfont" @tap="tologin">&#xe779;</view>
			</view>
		</view>
		<!-- 图标 -->
		<view class="logo">
			<image src="../../static/images/index/logo.jpeg"></image>
		</view>
		<!-- 内容 -->
		<view class="main">
			<view class="title">注册</view>
			<view class="inputs">
				<view class="input-div">
					<input class="user" type="text" placeholder="请输入注册用户名" placeholder-style="color:#aaa;font-width:400"
						@blur="getUser">
					<view class="userPlaceholder" v-if="userPlaceholder">已占用</view>
					<view class="user-ok" v-else>&#xe6d4;</view>
				</view>
				<view class="input-div">
					<input class="mail" type="text" placeholder="请输入注册邮箱" placeholder-style="color:#aaa;font-width:400"
						@blur="getMail">
					<view class="mailPlaceholder" v-if="mailPlaceholder">已占用</view>
					<view class="mail-ok" v-else-if="mailOK">&#xe6d4;</view>
					<view class="voidMail" v-else>无效的邮箱</view>

				</view>
				<view class="input-div">
					<input class="pas" :type="type" placeholder="请输入注册密码" placeholder-style="color:#aaa;font-width:400"
						@input="getpas">
					<image :src="'../../static/images/common/'+eyeImg" style="height: 40rpx;width: 40rpx;"
						@tap="lookChange"></image>

				</view>
			</view>
		</view>
		<view :class="subOk?'submit':'submitNo'" @tap="signUp">注册</view>
	</view>
</template>

<script>
	import loginVue from '../login/login.vue'
	export default {
		data() {
			return {
				type: 'password',
				eyeImg: 'no_eye.png',
				user: '',
				mail: '',
				password: '',
				userOk: true, //用户名是否可用
				userPlaceholder: false, //用户名是否被占有
				mailOK: true, //邮箱是否可用
				mailPlaceholder: false, //邮箱是否被占有
				subOk: false //注册是否激活
			}
		},
		computed: {
			// 是否可注册
			isSub() {
				if (this.userOk && this.mailOK && this.password.length > 0) {
					this.subOk = true;
				} else {
					this.subOk = false;
				}
				return this.subOk
			},
		},

		methods: {
			lookChange() {
				this.type = this.type == 'password' ? 'text' : 'password';
				this.eyeImg = this.eyeImg == 'no_eye.png' ? 'eye-fill.png' : 'no_eye.png'
			},
			//判断用户名是否合法
			getUser(e) {
				this.user = e.detail.value;
				if (this.user == '') {
					this.userOk = false
					this.isSub
				}
				if (this.user.length > 0) {
					uni.request({
						url: this.$serverUrl + "/signup/judge",
						data: {
							data: this.user,
							type: 'name',

						},
						method: 'POST',
						success: (data) => {
							let status = data.data.status

							if (status == 200) {
								let num = data.data.number
								if (num > 0) {
									//用户名已经存在
									this.userPlaceholder = true;
									this.userOk = false
								} else {
									this.userPlaceholder = false;
									this.userOk = true
								}
								this.isSub
							} else if (status == 500) {
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
			//判断邮箱是否合法
			getMail(e) {
				var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
				this.mail = e.detail.value;
				if (this.mail == '') {
					this.mailOK = false;
					this.isSub
				}
				if (this.mail.length > 0) {
					//判断邮箱格式是否正确
					if (reg.test(this.mail)) {
						uni.request({
							url: this.$serverUrl + "/signup/judge",
							data: {
								data: this.mail,
								type: 'email',
							},
							method: 'POST',
							success: (data) => {
								let status = data.data.status
								if (status == 200) {
									let num = data.data.number
									if (num > 0) {
										//邮箱已经存在
										this.mailPlaceholder = true;
									} else {
										this.mailPlaceholder = false;
										this.mailOK = true;
									}
									this.isSub
								} else if (status == 500) {
									uni.showToast({
										title: '服务器出错',
										icon: 'none',
										duration: 2000
									});
								}
							}
						})
					} else {
						this.mailOK = false;
					}
				}
				this.isSub
			},
			//密码框是否输入
			getpas(e) {
				this.password = e.detail.value;
				this.isSub
			},

			//注册提交
			signUp() {
				console.log(1);
				if (this.subOk) {
					uni.request({
						url: this.$serverUrl + "/signup/add",
						data: {
							name: this.user,
							email: this.mail,
							password: this.password
						},
						method: 'POST',
						success: (data) => {
							let status = data.data.status
							if (status == 200) {
								//注册成功跳转至登录页面
								uni.navigateTo({
									url: '/pages/login/login?user=' + this.user,
								})
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

			tologin() {
				uni.navigateTo({
					url: '/pages/login/login'
				})
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

	.user-ok,
	.mail-ok {
		font-family: "iconfont" !important;
		font-size: 48rpx;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		color: green;
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
		background: $uni-bg-color;

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

	.logo {
		text-align: center;

		image {
			padding-top: 192rpx;
			width: 90px;
			height: 180rpx;
			margin: 0 auto;
		}
	}

	.main {
		box-sizing: border-box;
		padding: 54rpx $uni-spacing-row-lg 120rpx;
		width: 100%;

		.title {
			font-size: 56rpx;
			color: $uni-text-color;
			font-weight: 600;
			line-height: 80rpx;
		}

		.inputs {
			padding-top: 8rpx;

			input {
				padding-top: 40rpx;
				height: 88rpx;
				font-size: $uni-font-size-lg;
				font-weight: 600;
				color: $uni-text-color;
				line-height: 88rpx;
				border-bottom: 1px solid $uni-border-color;
			}

			.input-div {
				position: relative;
			}

			.userPlaceholder,
			.mailPlaceholder,
			.voidMail {
				position: absolute;
				right: 0;
				top: 40rpx;
				font-size: $uni-font-size-base;
				color: $uni-color-warning;
				font-weight: 500;
				line-height: 88rpx;
			}

			.user-ok,
			.mail-ok {
				position: absolute;
				right: 0;
				top: 60rpx;
			}

			image {
				position: absolute;
				right: 7rpx;
				top: 60rpx;
			}
		}

	}

	.submit {
		margin: 0 auto;
		width: 520rpx;
		height: 96rpx;
		background: #BBFFFF;
		box-shadow: 0rpx 50rpx 32rpx -36rpx rgba(188, 255, 255, 0.4);
		border-radius: 48rpx;

		font-size: 32rpx;
		color: $uni-text-color;
		font-weight: 600;
		line-height: 96rpx;
		text-align: center;
	}

	.submitNo {
		margin: 0 auto;
		width: 520rpx;
		height: 96rpx;
		background: rgba(39, 40, 50, 0.20);
		;
		box-shadow: 0rpx 50rpx 32rpx -36rpx rgba(39, 40, 50, 0.20);
		;
		border-radius: 48rpx;

		font-size: 32rpx;
		color: #fafafa;
		font-weight: 600;
		line-height: 96rpx;
		text-align: center;
	}
</style>
