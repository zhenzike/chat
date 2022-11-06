<template>

	<view class="content">
		<!-- 导航栏部分 -->
		<view class="top-bar">			
			<navigator url="../userhome/userhome?id=aaa"  class="top-bar-left">
				<image src="../../static/images/image/1.jpeg"></image>
			</navigator>
			<view class="top-bar-center">
				<image src="../../static/images/index/logo.jpeg"></image>
			</view>
			<view class="top-bar-right">
				<view class="search">
					<image src="../../static/images/index/search.png" mode="" @tap="toSerch"></image>
				</view>
				<view class="add">
					<image src="../../static/images/index/add.png"></image>
				</view>
			</view>
		</view>


		<!-- 列表部分 -->
		<view class="main">
			<!-- 好友申请 -->
			<view class="friends">
				<view class="friends-list">
					<view class="friend-list-l">
						<text class="tip">1</text>
						<image src="../../static/images/image/2.jpeg"></image>
					</view>
					<view class="friend-list-r">
						<view class="top">
							<view class="name">好友申请</view>
							<view class="time">13：40</view>
						</view>
						<view class="news">有陌生人申请加你为好友</view>
					</view>
				</view>
			</view>

			<!-- 聊天框 -->
			<view class="friends">
				<view class="friends-list" v-for="(item,index) in friend" :key="item.id">
					<view class="friend-list-l">
						<text class="tip" v-if="item.tip>0">{{item.tip}}</text>
						<image :src='item.imgUrl'></image>
					</view>
					<view class="friend-list-r">
						<view class="top">
							<view class="name">{{item.name}}</view>
							<view class="time">{{item.time | changeTime}}</view>
						</view>
						<view class="news">{{item.news}}</view>
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
			}
		},
		onLoad() {
			this.getFrends()
		},
		methods: {
			getFrends() {
				this.friend = datas.frineds();
				for (let i = 0; i < this.friend.length; i++) {
					this.friend[i].imgUrl = `../../static/images/image/${this.friend[i].imgUrl}`
				}
				console.log(this.friend);
			},
			toSerch(){
				uni.navigateTo({
					url: '/pages/search/search'
				})
			}
		},
		filters: {
			changeTime(time) {
				return myFunction.dateTime(time)
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
			margin-left: -17rpx;

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
			}

			.add {
				display: inline-block;
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
	}

	.friends-list {
		height: 96rpx;
		padding: 16rpx $uni-spacing-col-base;

		&:active {
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
				border-radius:18rpx;
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
