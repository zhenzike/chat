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
				<input class="user" type="text" placeholder="请输入账号" placeholder-style="color:#aaa;font-width:400"
					@blur="getuser">
				<input class="pas" type="password" placeholder="请输入密码" placeholder-style="color:#aaa;font-width:400"
					@blur="getpas">
			</view>
			<view class="tips">用户名或密码错误</view>
		</view>
		<view class="submit" @tap="sunFun">登录</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				user: '',
				password: ''
			}
		},
		methods: {
			toRegistered() {
				uni.navigateTo({
					url: '/pages/registered/registered'
				})
			},
			getuser(e) {
				this.user=e.detail.value;
			},
			getpas(e) {
				this.password=e.detail.value;
			},
			sunFun(){
				if(this.user && this.password){
					return console.log('提交');
				}
				return console.log('不能为空');
			}
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
