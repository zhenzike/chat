<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-l">
				<view class="iconfont" @tap="back">&#xe779;</view>
			</view>
			<view class="top-bar-center">
				用户名
			</view>
			<view class="top-bar-r">
				<image src="../../static/images/image/1.jpeg"></image>
			</view>
		</view>
		<scroll-view class="chat" scroll-y="true" scroll-with-animation="true" :scroll-into-view="scrollTo"
			:style="{paddingBottom:pdBottom+'px'}">
			<view class="chat-main">
				<view class="chat-content" v-for="(item,index) in msgs" :key="index" :id="'msg'+item.tip">
					<view class="chat-time" v-if="item.time!=''">{{item.time|changeTime}}</view>
					<view class="msg-main msg-left" v-if="item.id!='b'">
						<image class="user-icon" :src="item.imgUrl"></image>
						<view class="message" v-if="item.type==0">
							<view class="message-text">{{item.message}}</view>
						</view>
						<view class="message" v-if="item.type==1">
							<image :src="item.message" mode="widthFix" @tap="previewImage(item.message)"></image>
						</view>
					</view>
					<view class="msg-main msg-right" v-if="item.id!='a'">
						<image class="user-icon" :src="item.imgUrl"></image>
						<view class="message" v-if="item.type==0">
							<view class="message-text">{{item.message}}</view>
						</view>
						<view class="message" v-if="item.type==1">
							<image :src="item.message" mode="widthFix" @tap="previewImage(item.message)"></image>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<chatBox @msgs="inputs" @getBoxHeight="getBoxHeight"></chatBox>
	</view>
</template>

<script>
	import datas from '../../commons/js/data.js'
	import myFunction from '../../commons/js/myFunction.js'
	import chatBox from '../../components/chat-box/chat-box.vue'
	export default {
		data() {
			return {
				msgs: [],
				previewImg: [], //预览图片
				oldTime: new Date(),
				scrollTo: '', //控制聊天内容滚动至底部
				pdBottom: 50
			}
		},
		onLoad() {
			this.getMsg()
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			getMsg() {
				let msg = datas.message()
				for (var i = 0; i < msg.length; i++) { //这里本来是用的let 但是为了方便获取最后一个内容的索引，改用var，
					msg[i].imgUrl = `../../static/images/image/${msg[i].imgUrl}`;
					let t = myFunction.spaceTime(this.oldTime, msg[i].time);
					if (t) {
						this.oldTime = t; //方便将当前回复时间作为下一条回复消息时间的比对对象
					}
					msg[i].time = t

					if (msg[i].type == 1) {
						msg[i].message = `../../static/images/image/${msg[i].message}`;
						this.previewImg.unshift(msg[i].message)
					}
					this.msgs.unshift(msg[i]) //因为之前的消息是旧消息，所以需要倒序插入，使得旧消息在数组后方
				}
				this.$nextTick(function() {
					this.scrollTo = 'msg' + this.msgs[i - 1].tip
				})

			},


			// 使用的uni提供的API预览图片
			previewImage(msg) {
				let index = this.previewImg.findIndex(item => item == msg) //通过传入的地址信息，寻找对应的图片索引，锁定点击时，应该预览的图片
				uni.previewImage({
					current: index,
					urls: this.previewImg,
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {
							console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});
			},
			//滚动到底部
			goBottom() {
				this.scrollTo = '';
				this.$nextTick(function() {
					let len = this.msgs.length - 1
					this.scrollTo = 'msg' + this.msgs[len].tip
				})
			},
			inputs(e) {
				let len = this.msgs.length;
				let my = {
					id: 'b',
					imgUrl: '2.jpeg',
					tip: len,
					type: e.type,
					time: new Date(),
					message: e.message
				};
				this.msgs.push(my);
				this.goBottom()
			},
			getBoxHeight(e) {
				this.pdBottom = e //这里由于传过来的是以px单位为基础的数字，只能将原本的bottom设置成px单位方便设置
				this.goBottom()
			}
		},
		filters: {
			changeTime(time) {
				return myFunction.dateTime(time)
			}
		},
		components: {
			chatBox
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
		background-color: rgba(243, 244, 246, 1);
		height: 100vh;
	}

	.top-bar {
		position: fixed;
		display: flex;
		z-index: 1000;
		top: var(--status-bar-height);
		left: 0;
		width: 100%;
		height: 88rpx;
		background: rgba(255, 255, 255, 0.97);
		border-bottom: 1px solid rgba(39, 40, 50, 0.1);

		.top-bar-r {

			padding-top: 12rpx;
			padding-right: 46rpx;

			image {
				width: 64rpx;
				height: 64rpx;
				border-radius: 20rpx;
			}
		}

		.top-bar-center {
			flex: auto;
			font-size: 40rpx;
			color: #272832;
			font-weight: 400;
			line-height: 88rpx;
			text-align: center;
		}

		.top-bar-l {

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

	.chat {
		height: 100%;
		box-sizing: border-box;
		padding-left: 32rpx;
		padding-right: 32rpx;
		padding-top: 88rpx;

		.chat-main {
			display: flex;
			flex-direction: column;
		}


		.msg-main {
			display: flex;
			padding: 20rpx 0;

			.user-icon {
				flex: none;
				width: 80rpx;
				height: 80rpx;
				border-radius: 20rpx;
			}
		}

		.chat-content {
			flex-direction: row;

			.chat-time {
				font-size: 24rpx;
				color: rgba(39, 40, 50, 0.3);
				line-height: 34rpx;
				padding: 20rpx 0;
				text-align: center;
			}

		}

		.msg-right {
			flex-direction: row-reverse;

			.message-text {
				margin-right: 18rpx;
				background-color: #29ffa6;
				border-radius: 20rpx 0 20rpx 20rpx;
				color: #fff !important;
			}
		}

		.msg-left {
			.message-text {
				margin-left: 18rpx;
				background-color: #fff;
				border-radius: 0 20rpx 20rpx 20rpx;
			}
		}

		.message {
			max-width: 480rpx;

			.message-text {
				font-size: 32rpx;
				color: #272832;
				font-weight: 400;
				line-height: 44rpx;
				padding: 16rpx 8rpx 16rpx 16rpx;
			}

			image {
				width: 400rpx;
				border-radius: 20rpx;
			}
		}
	}
</style>
