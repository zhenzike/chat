<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-l">
				<view class="iconfont" @tap="back">&#xe779;</view>
			</view>
			<view class="top-bar-r">
				<image src="../../static/images/common/更多.png"></image>
			</view>
		</view>
		<view class="bg">
			<view class="white-bg" :animation="aniAddFriendBgColor"></view>
			<image class="img-bg" src="../../static/images/image/1.jpeg" mode="aspectFill"></image>
		</view>
		<view class="main">
			<view class="user-icon">
				<view class="sex" :style="{background:sexcolor}" :animation="aniAddFriendDataSex" >
					<image src="../../static/images/common/性别女.png" ></image>
				</view>
				<image class="icon"  src="../../static/images/image/1.jpeg" mode="aspectFill" :animation="aniAddFriendDataIcon"></image>
			</view>
			<view class="user-message">
				<view class="name">{{user.name}}</view>
				<view class="nick">昵称：{{user.nickname}}</view>
				<view class="mess">{{user.message}}</view>
			</view>
		</view>
		<view class="btn-div">
			<view class="btn" @tap="aniAddFriend">加为好友</view>
		</view>

		<!-- 好友请求页面 -->
		<view class="add-friend" :animation="aniAddFriendData">
			<!-- :style="{height:addHeight+'px'}" -->
			<view class="name">{{user.name}}</view>
			<textarea class="add-main" :value="myname+'请求加为好友'"  maxlength="120" ></textarea>
		</view>
		<view class="add-bt" :animation="aniAddFriendDataBtn">
			<view class="close" @tap="aniAddFriend">取消</view>
			<view class="send">发送</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				sexcolor: 'rgba(255,93,91,1)',
				myname: '郭少',
				addHeight:'',//加好友页面高度
				isAdd:false,// 是否继续加好友
				user: {
					name: '中森明莱',
					nickname: '莱莱',
					message: '似乎靓丽得蓬松又恣意的旧日美人，总能勾起我们对往日的念恤。她们诚实、自在、美丽，自带往事光环，让人很容易产生复古一个时空的愿望'
				},
				aniAddFriendData: {},
				aniAddFriendDataBtn: {},
				aniAddFriendDataIcon:{},
				aniAddFriendDataSex:{},
				aniAddFriendBgColor:{}
			}
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			aniAddFriend() {
				this.isAdd=!this.isAdd
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
				if(this.isAdd){
				animation.bottom(0).step();
				animationBtn.bottom(0).step();
				animationIcon.width('240rpx').height('240rpx').top('80rpx').right('150rpx').step();				
				animationSex.opacity(0).step()
				animationBgColor.backgroundColor('rgba(0, 170, 255, 0.6)').step()
				}else{
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
			},
           //获取节点高度，用于解决取消加好友下拉动画问题
			getElementStyle() {
				const query = uni.createSelectorQuery().in(this);
				query.select('.add-friend').boundingClientRect(data => {
					console.log(data.height);
					this.addHeight=data.height;
				}).exec();
			}
		},
		
		onReady(){
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
			top:50rpx;
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
				top:0;
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

			.nick {
				font-size: 28rpx;
				color: #272832;
				font-weight: 450;
				line-height: 40rpx;
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
			margin:auto auto auto 40rpx;
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
