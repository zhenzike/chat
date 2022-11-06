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
			<view class="requester" v-for="(item,index) in friend" :key="item.id">
				<view class="request-top">
					<view class="reject btn">拒绝</view>
					<view class="user-icon">
						<image :src="item.imgUrl"></image>
					</view>
					<view class="aggree btn">同意</view>
				</view>
				<view class="request-center">
					<view class="title">{{item.name}}</view>
					<view class="time">{{item.time | changeTime}}</view>
				</view>
				<view class="comments">
					<text>留言：</text>
					{{item.news}}
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
				friends: []
			}
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			getFrends() {
				this.friend = datas.frineds();
				for (let i = 0; i < this.friend.length; i++) {
					this.friend[i].imgUrl = `../../static/images/image/${this.friend[i].imgUrl}`
				}
				console.log(this.friend);
			},
		},
		onLoad() {
			this.getFrends()
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
