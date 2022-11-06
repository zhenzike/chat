<template>
	<view class="chat-box">
		<view class="chat">
			<view class="bt-img">
				<image src="../../static/images/common/语音.png" v-if="!inVoice" @tap="changeVoice"></image>
				<image src="../../static/images/common/键盘.png" v-else @tap="changeVoice"></image>
			</view>
			<textarea class="chat-text btn" :class="inVoice?'noVoice':'isVoice'" auto-height="true"></textarea>
			<view class="voice btn" :class="inVoice?'isVoice':'noVoice'">按住录音</view>
			<view class="bt-img" @tap="emoji">
				<image src="../../static/images/common/笑脸.png"></image>
			</view>
			<view class="bt-img">
				<image src="../../static/images/common/更多+.png"></image>
			</view>
		</view>
		<view class="emojiBox" v-if="openEmoji">
			表情
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				inVoice: true,
				openEmoji: true
			}
		},
		methods: {
			changeVoice() {
				this.inVoice = !this.inVoice
			},
			emoji() {
				this.openEmoji = !this.openEmoji
			}
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
		padding-bottom: var(--status-bar-height);
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
	}
</style>
