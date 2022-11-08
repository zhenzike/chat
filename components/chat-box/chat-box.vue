<template>
	<view class="chat-box">
		<view class="chat">
			<view class="bt-img">
				<image src="../../static/images/common/语音.png" v-if="!inVoice" @tap="changeVoice"></image>
				<image src="../../static/images/common/键盘.png" v-else @tap="changeVoice"></image>
			</view>
			<textarea  class="chat-text btn" :class="inVoice?'noVoice':'isVoice'" auto-height="true"
				@input="inputs" v-model="msg" @tap="chooseInput"></textarea>
			<view class="voice btn" :class="inVoice?'isVoice':'noVoice'">按住录音</view>
			<view class="bt-img" @tap="emoji">
				<image src="../../static/images/common/笑脸.png"></image>
			</view>
			<view class="bt-img"  @tap="more">
				<image src="../../static/images/common/更多+.png"></image>
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
				<image src="../../static/images/common/图片.png"></image>
				<view class="more-list-title">图片</view>
			</view>
			<view class="more-list">
				<image src="../../static/images/common/位置.png"></image>
				<view class="more-list-title">位置</view>
			</view>
			<view class="more-list">
				<image src="../../static/images/common/拍摄.png"></image>
				<view class="more-list-title">拍摄</view>
			</view>
			<view class="more-list">
				<image src="../../static/images/common/文件夹.png"></image>
				<view class="more-list-title">文件</view>
			</view>
		</view>
	</view>
</template>

<script>
	import choEmoji from '../emoji/emoji.vue'
	export default {
		data() {
			return {
				inVoice: false,
				openEmoji: false,
				msg: '', //输入框内容
			openMore:true
			}
		},
		methods: {
			changeVoice() {
				this.inVoice = !this.inVoice
			},
			emoji() {
				this.openEmoji = !this.openEmoji
				this.openMore=false;
				setTimeout(() => {
					this.getElementHeight() //通过异步延迟获取高度
				}, 0)
			
			},
			more(){
				this.openMore = !this.openMore
				this.openEmoji=false
				setTimeout(() => {
					this.getElementHeight() //通过异步延迟获取高度
				}, 0)
			},
			// 向聊天页面发送文字
			inputs(e) {
				let chatContent = e.detail.value;
				let pos = chatContent.indexOf('\n');
				
				if (pos != -1 && chatContent.length > 1) {
					this.send(this.msg,0)
				}
				
			},
			//在表情页面中发送消息
			emojiInputs(e) {
				if (this.msg.length > 0) {
					this.send(this.msg,0)		
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
				setTimeout(() => {
					this.getElementHeight() //通过异步延迟获取高度
				}, 0)
			},
			// 发送
			send(msg,type){
				let data={
					message:msg,
					type:type
				};
				this.$emit('msgs', data)
				this.msg = ''	
			}
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

.more{
	width: 100%;
	height: 436rpx;
	background: rgba(236, 237, 238, 1);
	box-shadow: 0 -1rpx 0 0 rgba(0, 0, 0, 0.1);
	padding: 20rpx;
	box-sizing: border-box;
	.more-list{
		width:25%;
		text-align: center;
		float: left;
		
		image{
			width: 72rpx;
			height: 72rpx;
			padding: 24rpx;
			background-color: rgba(255,255,255,1);
			border-radius: 24rpx;
		}
		.more-list-title{
			font-size: 24rpx;
			color: rgba(39,40,50,0.5);
			line-height: 34rpx;
		}
	}
}

</style>
