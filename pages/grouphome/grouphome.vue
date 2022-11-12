<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-l">
				<view class="iconfont" @tap="back">&#xe779;</view>
			</view>
		</view>
		<view class="bg">
			<image class="bg-img" :src="imgurl" mode="aspectFill"></image>
		</view>
		<view class="main">

			<view class="main-centent">
				<!-- 群简介 -->
				<view class="synopsis">
					<view class="name">黑色玫瑰</view>
					<view class="time">202-11-12</view>
					<view class="sign">无论一个朋友对你有多好，总有一天他做的某件事会让你悲哀，而到时你就应学会原谅。</view>
				</view>
				<view class="member">
					<view class="top">
						<view class="title">群成员</view>
						<view class="more">成员管理</view>
						<image src="../../static/images/common/right.png"></image>
					</view>
					<view class="member-ls">
						<view class="list" v-for="(item,index) in groupMenber" :key="index">
							<view class="msg">
								<image class="X" src="../../static/images/common/flase.png"></image>
								<image class="msg-icon" :src="item.imgUrl"></image>
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
			</view>

		</view>
	</view>
</template>

<script>
	import datas from '../../commons/js/data.js'
	export default {
		data() {
			return {
				id: 0,
				imgurl: '',
				groupMenber: []
			}
		},
		onLoad(e) {
			this.id = e.id
			this.imgurl = e.img
			this.getMember()

		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			//获取群成员
			getMember() {
				let member = datas.frineds()
				member.forEach((k) => {
					k.imgUrl = `../../static/images/image/${k.imgUrl}`
				})
				this.groupMenber = member
				console.log(this.groupMenber);
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
		}
	}
</style>
