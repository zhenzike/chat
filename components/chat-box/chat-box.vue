<template>
	<view>
		<view class="chat-box">
			<view class="chat">
				<view class="bt-img">
					<image src="../../static/images/common/YY.png" v-if="!inVoice" @tap="changeVoice"></image>
					<image src="../../static/images/common/jianpan.png" v-else @tap="changeVoice"></image>
				</view>
				<textarea class="chat-text btn" :class="inVoice?'noVoice':'isVoice'" auto-height="true" @input="inputs"
					v-model="msg" @tap="chooseInput" :show-confirm-bar="false"></textarea>
				<view class="voice btn" :class="inVoice?'isVoice':'noVoice'" @touchstart="voiceStart"
					@touchmove="voiceMove" @touchend="voiceEnd">按住录音</view>
				<view class="bt-img" @tap="emoji">
					<image src="../../static/images/common/xiao.png"></image>
				</view>
				<view class="bt-img" @tap="more">
					<image src="../../static/images/common/more2.png"></image>
				</view>
			</view>
			<!-- 表情 -->
			<view class="emojiBox" v-if="openEmoji">
				<view class="emoji-send">
					<view class="emoji-send-del" @tap="emojiDel">退格</view>
					<view class="emoji-send-bt" @tap="emojiInputs">发送</view>
				</view>
				<choEmoji @chooseEm="chooseEm"></choEmoji>
			</view>

			<!-- 功能 -->
			<view class="more" v-if="openMore">
				<view class="more-list">
					<image src="../../static/images/common/tp.png" @tap="sendImg('album')"></image>
					<view class="more-list-title">图片</view>
				</view>
				
				<view class="more-list">
					<image src="../../static/images/common/paishe.png" @tap="sendImg('camera')"></image>
					<view class="more-list-title">拍摄</view>
				</view>
				<view class="more-list">
					<image src="../../static/images/common/files.png"></image>
					<view class="more-list-title">文件</view>
				</view>
			</view>

		</view>
		<view class="voice-bg" v-show="voiceBg">
			<view class="voice-bg-len">
				<view class="voice-bg-time" :style="{width:voiceTime/0.6+'%'}">{{voiceTime}}``</view>
				<!-- <view class="voice-bg-time" :style="{width:60/0.6+'%'}">{{voiceTime}}``</view> -->
			</view>
			<view class="voice-del">上滑取消录音</view>
		</view>
	</view>
</template>

<script>
	import choEmoji from '../emoji/emoji.vue'
	//用于录音
	const recorderManager = uni.getRecorderManager();
	// const innerAudioContext = uni.createInnerAudioContext();
	
	let voiceTimeInterval
	export default {
		data() {
			return {
				inVoice: false,
				openEmoji: false,
				msg: '', //输入框内容
				openMore: false,
				time: 0,
				voiceBg: false,
				voiceTime: 0,
				pageY: 0
			}
		},
		methods: {
			changeVoice() {
				this.inVoice = !this.inVoice;
				this.chooseInput()
			},
			emoji() {
				if (this.inVoice) {
					return
				}
				this.openEmoji = !this.openEmoji
				this.openMore = false;
				setTimeout(() => {
					this.getElementHeight() //通过异步延迟获取高度
				}, 0)

			},
			more() {

				if (this.inVoice) {
					return
				}
				this.openMore = !this.openMore
				this.openEmoji = false
				setTimeout(() => {
					this.getElementHeight() //通过异步延迟获取高度
				}, 0)
			},
			// 向聊天页面发送文字
			inputs(e) {
				let chatContent = e.detail.value;
				let pos = chatContent.indexOf('\n');

				if (pos != -1 && chatContent.length > 1) {
					this.send(this.msg, 0)
				}

			},
			//在表情页面中发送消息
			emojiInputs(e) {
				if (this.msg.length > 0) {
					this.send(this.msg, 0)
				}

			},
			//在表情页面中退格
			emojiDel() {
				if (this.msg.length > 0) {
					this.msg = this.msg.substring(0, this.msg.length - 2)
				}

			},
			getElementHeight() {
				const query = uni.createSelectorQuery().in(this);
				query.select('.chat-box').boundingClientRect(data => {
					this.$emit('getBoxHeight', data.height)
				}).exec();
			},
			chooseEm(emoji) {
				this.msg = this.msg + emoji
			},
			chooseInput() {
				this.openEmoji = false;
				this.openMore = false;
				setTimeout(() => {
					this.getElementHeight() //通过异步延迟获取高度
				}, 0)
			},
			// 发送
			send(msg, type) {
				let data = {
					message: msg,
					type: type
				};
				this.$emit('msgs', data)
				this.msg = ''
			},

			//发送图片
			sendImg(e) {
				if (e === 'album') {
					uni.chooseImage({
						count: 6, //默认9
						sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
						sourceType: [e], //从相册选择
						success: (res) => {
							const filePaths = res.tempFilePaths;
							for (let i = 0; i < filePaths.length; i++) {
								this.send(filePaths[i], 1)
							}
						}
					});
				} else {
					uni.chooseImage({
						count: 1, //默认9
						sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
						sourceType: [e], //从相机选择
						success: function(res) {
							console.log(JSON.stringify(res.tempFilePaths));
						}
					});
				}

			},

			// 以下函数为点击录音的处理函数
			voiceStart(e) {
				this.pageY = e.changedTouches[0].pageY

				this.voiceTime = 0
				this.voiceBg = true
				try {
					recorderManager.start(); //注意：这类方法在浏览器中不支持
				} catch (e) {
					console.log('浏览器不支持uni的录音功能');
				}
				this.time = e.timeStamp

				voiceTimeInterval = setInterval(() => {
					this.voiceTime++
				}, 1000)

			},
			voiceMove(e) {
				if (this.pageY - e.changedTouches[0].pageY > 120) {
					this.voiceBg = false
				}
			},
			voiceEnd(e) {

				clearInterval(voiceTimeInterval)
				try {
					recorderManager.stop();
				} catch (e) {
					console.log('浏览器不支持uni的录音功能');
				}

				let voiceTime = (Math.ceil((e.timeStamp - this.time) / 1000)); //录音时长
				recorderManager.onStop((res) => { //获取录音地址
					let data = {
						voice: res.tempFilePath,
						time: voiceTime
					}
				
					if (this.voiceBg) {
			
						this.send(data, 2)
					}
					this.voiceBg = false
				});
				
			},

			// 以上函数为点击录音的处理函数
			
	
		},
		components: {
			choEmoji
		}
	}
</script>

<style lang="scss">
	.chat-box {
		background: rgba(255, 255, 255, 0.97);
		border-top: 1px solid rgba(39, 40, 50, 0.1);
		width: 100%;
		position: fixed;
		bottom: 0;
		z-index: 100;

	}

	.chat {
		width: 100%;
		display: flex;
		align-items: flex-end;
		box-sizing: border-box;
		padding: 14rpx 14rpx;

		image {
			width: 56rpx;
			height: 56rpx;
			margin: 0 10rpx;
			flex: auto;
		}

		.btn {
			flex: auto;
			background-color: #F4F4F4;
			border-radius: 10rpx;
			padding: 20rpx;
			max-height: 160rpx;
		}

		.chat-text {
			text-align: left !important;
			// line-height: 72rpx;
		}

		.isVoice {
			text-align: center;
			font-size: 24rpx;
			color: rgba(39, 40, 50, 0.6);
		}

		.noVoice {
			display: none;
		}
	}

	.emojiBox {
		width: 100%;
		height: 436rpx;
		background: rgba(236, 237, 238, 1);
		box-shadow: 0 -1rpx 0 0 rgba(0, 0, 0, 0.1);

		.emoji-send {
			width: 260rpx;
			height: 104rpx;
			// background: rgba(236,237,238,1);
			// box-shadow: 0px -1rpx 0px 0px rgba(0,0,0,0.1);
			position: fixed;
			bottom: 0;
			right: 0;
			display: flex;

			.emoji-send-del {
				flex: 1;
				margin: auto;
				margin-right: 20rpx;
				width: 120rpx;
				height: 60rpx;
				background-color: rgba(39, 40, 50, 0.4);
				font-size: 32rpx;
				text-align: center;
				line-height: 60rpx;
				border-radius: 12rpx;
			}

			.emoji-send-bt {
				background-color: #29ffa6;
				flex: 1;
				margin: auto;
				margin-right: 20rpx;
				width: 120rpx;
				height: 60rpx;
				font-size: 32rpx;
				text-align: center;
				line-height: 60rpx;
				border-radius: 12rpx;
			}
		}
	}

	.more {
		width: 100%;
		height: 436rpx;
		background: rgba(236, 237, 238, 1);
		box-shadow: 0 -1rpx 0 0 rgba(0, 0, 0, 0.1);
		padding: 20rpx;
		box-sizing: border-box;

		.more-list {
			width: 25%;
			text-align: center;
			float: left;

			image {
				width: 72rpx;
				height: 72rpx;
				padding: 24rpx;
				background-color: rgba(255, 255, 255, 1);
				border-radius: 24rpx;
			}

			.more-list-title {
				font-size: 24rpx;
				color: rgba(39, 40, 50, 0.5);
				line-height: 34rpx;
			}
		}
	}

	.voice-bg {
		position: fixed;
		top: 0;
		bottom: 0;
		z-index: 1000;
		height: 100%;
		width: 100%;
		background: rgba(0, 0, 0, 0.3);

		.voice-bg-len {
			height: 84rpx;
			width: 600rpx;
			position: absolute;
			right: 0;
			left: 0;
			top: 0;
			bottom: 0;
			margin: auto;
			background: rgba(255, 255, 255, 0.6);
			border-radius: 42rpx;
			text-align: center;
		}

		.voice-bg-time {
			display: inline-block;
			max-width: 600rpx;
			min-width: 120rpx;
			width: 120rpx;
			line-height: 84rpx;
			background: #29ffa6;
			border-radius: 42rpx;
		}

		.voice-del {
			position: absolute;
			bottom: 120rpx;
			width: 100%;
			text-align: center;
			color: #fff;
			font-size: 500;
		}
	}
</style>
