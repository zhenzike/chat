<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-r">
				<view class="text" @tap="toRegistered">注册</view>
			</view>
		</view>
		<!-- 图标 -->
		<view class="logo">
			<image src="../../static/images/index/logo.jpeg"></image>
		</view>
		<!-- 内容 -->
		<view class="main">
			<view class="title">登录</view>
			<view class="inputs">
				<input class="user" v-model="user" type="text" placeholder="请输入账号"
					placeholder-style="color:#aaa;font-width:400">
				<input class="pas" v-model="password" type="password" placeholder="请输入密码"
					placeholder-style="color:#aaa;font-width:400">
			</view>
			<view class="tips" v-if="tipshow==1">用户名或密码错误</view>
			<view class="tips" v-else-if="tipshow==2">用户名或密码不能为空</view>
		</view>
		<view class="submit" @tap="sunFun">登录</view>
	</view>
</template>

<script>

	export default {
		data() {
			return {
				user: '',
				password: '',
				tipshow:0
			}
		},
		onLoad(e) {
			if (e.user) {
				this.user = e.user
				uni.showToast({
					title: '注册成功请登录',
					icon: 'none',
					duration: 2000
				});
			}
		},
		methods: {

			//登录提交
			sunFun() {
				if (this.user && this.password) {
					uni.request({
						url: this.$serverUrl + "/signin/match",
						data: {
							data: this.user,
							password: this.password,

						},
						method: 'POST',
						success: (data) => {
							let status = data.data.status
							if (status == 200) {
								this.tipshow=false
								let res = data.data.back
								try {
									uni.setStorageSync('user', {
										'id': res.id,
										'name': res.name,
										'imgurl': res.imgurl,
										'token': res.token
									});
								} catch {
									console.log('缓存错误');
								}
								uni.navigateTo({
									url:'../index/index'
								})
							} else if (status == 400) {
								this.tipshow=1
								this.password=''
							} else {
								uni.showToast({
									title: '服务器出错',
									icon: 'none',
									duration: 2000
								});
							}
						}
					})
				} else {
					this.tipshow=2
				}

			},

			//跳转去注册
			toRegistered() {
				uni.navigateTo({
					url: '/pages/registered/registered'
				})
			},
		}
	}
</script>

<style lang="scss">
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

		.top-bar-r {
			float: right;
			padding-right: 32rpx;

			.text {
				font-size: $uni-font-size-lg;
				font-weight: 600;
				color: $uni-text-color;
				line-height: 88rpx;
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
		}

		.tips {
			float: left;
			font-size: $uni-font-size-lg;
			font-weight: 400;
			color: $uni-color-warning;
			line-height: 56rpx;
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
</style>
