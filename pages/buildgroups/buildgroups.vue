<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-l">
				<view class="title" @tap="back">取消</view>
			</view>
			<view class="top-bar-center">创建群聊</view>
		</view>
		<view class="main">
			<!-- 群头像 -->
			<view class="group-img" @tap="sendImg">
				<image class="pen" src="../../static/images/common/change.png"></image>
				<image class="group-icon" :src="tempFilePaths" mode="scaleToFill"></image>
			</view>
			<!-- 群名 -->
			<view class="group-name">
				<input class="inputName" type="text" placeholder="输入群名" @blur="isNull">
			</view>

			<!-- 选择用户 -->
			<view class="friends">
				<view class="title">用户</view>
				<scroll-view class="scroll-view" scroll-y="true">
					<view class="user" v-for="(item,index) in user" :key="index" @tap="selectFriend(index)">
						<view class="selected" :class="item.select?'is-selected':''">
							<image src="../../static/images/common/True.png" v-if="item.select"></image>
						</view>
						<image class="user-icon" :src="item.imgUrl"></image>
						<view class="name">{{item.name}}</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<view class="btn-div">
			<view class="btn" :class="friendNumber!=0&&inputVal?'select-btn':''">创建({{friendNumber}})</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tempFilePaths: '',
				user: [{
						select: false,
						imgUrl: '../../static/images/image/1.jpeg',
						name: '张三'
					},
					{
						select: true,
						imgUrl: '../../static/images/image/2.jpeg',
						name: '李四'
					},
					{
						select: false,
						imgUrl: '../../static/images/image/3.jpeg',
						name: '王五'
					},
					{
						select: false,
						imgUrl: '../../static/images/image/4.jpeg',
						name: '赵六'
					},
					{
						select: false,
						imgUrl: '../../static/images/image/1.jpeg',
						name: '张三'
					},
					{
						select: true,
						imgUrl: '../../static/images/image/2.jpeg',
						name: '李四'
					},
					{
						select: false,
						imgUrl: '../../static/images/image/3.jpeg',
						name: '王五'
					},
					{
						select: false,
						imgUrl: '../../static/images/image/4.jpeg',
						name: '赵六'
					},
					{
						select: false,
						imgUrl: '../../static/images/image/1.jpeg',
						name: '张三'
					},
					{
						select: true,
						imgUrl: '../../static/images/image/2.jpeg',
						name: '李四'
					},
					{
						select: false,
						imgUrl: '../../static/images/image/3.jpeg',
						name: '王五'
					},
					{
						select: false,
						imgUrl: '../../static/images/image/4.jpeg',
						name: '赵六'
					},
					{
						select: false,
						imgUrl: '../../static/images/image/1.jpeg',
						name: '张三'
					},
					{
						select: true,
						imgUrl: '../../static/images/image/2.jpeg',
						name: '李四'
					},
					{
						select: false,
						imgUrl: '../../static/images/image/3.jpeg',
						name: '王五'
					},
					{
						select: false,
						imgUrl: '../../static/images/image/4.jpeg',
						name: '赵六'
					},

				],
				friendNumber: 0,
				inputVal:false  //群名是否为空
			}
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			//选择群头像
			sendImg() {
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album'],
					success: (res) => {
						this.tempFilePaths = res.tempFilePaths[0]
					}
				});
			},

			// 选择好友
			selectFriend(e) {
				this.user[e].select = !this.user[e].select;
				this.friendNum()
			},

			// 获取选择好友的个数
			friendNum() {
				this.friendNumber = 0
				this.user.forEach(k => {
					if (k.select == true) {
						this.friendNumber++
					}
				})
				
			},
			isNull(Val){
				if(Val.detail.value==''){
					console.log(this.inputVal);
					this.inputVal=false
				}else{					
					this.inputVal=true
					console.log(this.inputVal);
				}
			}
		}
	}
</script>

<style lang="scss">
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
		background: rgba(255, 255, 255, 1);
		border-bottom: 1px solid rgba(39, 40, 50, 0.1);

		.top-bar-l {
			float: left;
			padding-left: 32rpx;
			line-height: 88rpx;
			width: 88rpx;

			.title {
				font-size: 32rpx;
				color: #272832;
				font-weight: 400;
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
		padding-top: 168rpx;
		display: flex;
		flex-direction: column;

		.group-img {
			position: relative;
			margin: 0 auto;
			width: 196rpx;
			height: 196rpx;
			border: 1px solid #dfe7f6;
			border-radius: 40rpx;
			overflow: hidden;

			.pen {
				position: absolute;
				margin: auto;
				z-index: 10;
				left: 0;
				right: 0;
				top: 0;
				bottom: 0;
				width: 56rpx;
				height: 56rpx;
			}

			.group-icon {
				width: 100%;
				height: 100%;
			}
		}

		.group-name {
			padding: 62rpx 32rpx 0;

			.inputName {
				width: 686rpx;
				height: 92rpx;
				background: #F3F4F6;
				border-radius: 46rpx;
				font-size: 36rpx;
				color: #272832;
				font-weight: 400;
				text-align: center;
			}
		}

		.friends {

			.scroll-view {
				box-sizing: border-box;
				height: 938rpx;
				padding-bottom: 35rpx;
			}

			padding: 32rpx 20rpx;

			.title {
				font-size: 44rpx;
				color: #272832;
				font-weight: 600;
			}

			.user {
				display: flex;
				flex-direction: row;
				align-items: center;
				height: 120rpx;

				.selected {
					width: 48rpx;
					height: 48rpx;
					margin-right: 32rpx;
					background: rgba(41, 255, 166, 0.3);
					border-radius: 24rpx;

					image {
						width: 48rpx;
						height: 48rpx;
					}
				}

				.is-selected {
					width: 48rpx;
					height: 48rpx;
					margin-right: 32rpx;
					background: rgba(41, 255, 166, 1);
					border-radius: 24rpx;

					image {
						width: 48rpx;
						height: 48rpx;
					}
				}

				.user-icon {
					width: 80rpx;
					height: 80rpx;
					border-radius: 20rpx;
				}

				.name {
					margin-left: 32rpx;
					font-size: 36rpx;
					color: #272832;
					font-weight: 400;
				}
			}
		}

	}

	.btn-div {
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 104rpx;
		padding: 0 40rpx 12rpx;
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
		
		.select-btn{
			background: #2ba245;			
		}
	}
</style>
