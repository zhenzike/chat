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
				<image src="../../static/images/image/1.jpeg" @tap="goGroupHome"></image>
			</view>
		</view>
		<scroll-view class="chat" scroll-y="true" scroll-with-animation="true" :scroll-into-view="scrollTo"
			:style="{paddingBottom:pdBottom+'px'}" @scrolltoupper="loadingAni" refresher-enabled="true">
			<view class="chat-main">
				<!-- 加载 -->
				<view class="loading" v-show="isLoading">
					<image src="../../static/images/common/loading.png" :animation="animationLoading"></image>
				</view>

				<view class="chat-content" v-for="(item,index) in msgs" :key="index" :id="'msg'+item.tip">
					<view class="chat-time" v-if="item.time!=''">{{item.time|changeTime}}</view>
					<view class="msg-main msg-left" v-if="item.id!='b'">
						<image class="user-icon" :src="item.imgUrl"></image>
						<!-- 文字 -->
						<view class="message" v-if="item.type==0">
							<view class="message-text">{{item.message}}</view>
						</view>
						<!-- 图片 -->
						<view class="message" v-if="item.type==1">
							<image :src="item.message" mode="widthFix" @tap="previewImage(item.message)"></image>
						</view>
						<!-- 音频 -->
						<view class="message message-voice" v-if="item.type==2"
							:style="{width:item.message.time*4+'px'}" @tap="playVoice(item.message.voice)">
							<view class="message-text voice">
								<image class="voice-img" src="../../static/images/common/语音-左.png"></image>
								{{item.message.time}}``
							</view>
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
						<view class="message message-voice" v-if="item.type==2"
							:style="{width:item.message.time*4+'px'}" @tap="playVoice(item.message.voice)">
							<view class="message-text voice">
								<image class="voice-img" src="../../static/images/common/语音-右.png"></image>
								{{item.message.time}}``
							</view>
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
	const innerAudioContext = uni.createInnerAudioContext(); //这个值必须定义在外部，否则音频直接会互性干扰
	let loadingRotate
	export default {
		data() {
			return {
				msgs: [],
				previewImg: [], //预览图片
				oldTime: new Date(),
				scrollTo: '', //控制聊天内容滚动至底部
				pdBottom: 50,
				animationLoading: {}, //加载动画
				isLoading: false, //是否加载数据
				nowPage: 0 ,//页码
				beginLoading:false,
				id:1,
				imgurl:'../../static/images/image/2.jpeg'
			}
		},
		onLoad() {
			this.getMsg(this.nowPage);
			this.loadingAni()
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			getMsg(page) {
				this.nowPage++;
				let msg = datas.message()
				let maxPages=msg.length;
				if(msg.length>(page + 1) * 4){
					maxPages=(page + 1) * 4
				}else{
					//数据获取完毕
					this.nowPage=-1
				}
				for (var i = page * 4; i < maxPages; i++) { //这里本来是用的let 但是为了方便获取最后一个内容的索引，改用var，
					msg[i].imgUrl = `../../static/images/image/${msg[i].imgUrl}`;
					let t = myFunction.spaceTime(this.oldTime, msg[i].time);
					if (t) {
						this.oldTime = t; //方便将当前回复时间作为下一条回复消息时间的比对对象
					}
					msg[i].time = t

					if (msg[i].type == 1) {
						msg[i].message = `../../static/images/image/${msg[i].message}`;
						this.previewImg.unshift(msg[i].message) //将图片插入图片数组
					}
					this.msgs.unshift(msg[i]) //因为之前的消息是旧消息，所以需要倒序插入，使得旧消息在数组后方
				}
				
				this.$nextTick(function() {
					this.scrollTo = 'msg' + this.msgs[i - 1].tip
				})
				clearInterval(loadingRotate);
				this.isLoading = false;
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
				let nowTime = new Date()
				let t = myFunction.spaceTime(this.oldTime, nowTime);
				if (t) {
					this.oldTime = t; //方便将当前回复时间作为下一条回复消息时间的比对对象
				}
				nowTime = t
				let my = {
					id: 'b',
					imgUrl: `../../static/images/image/2.jpeg`,
					tip: len,
					type: e.type,
					time: nowTime,
					message: e.message
				};
				this.msgs.push(my);
				this.goBottom();
				if (e.type == 1) {
					this.previewImg.push(e.message)
				}
			},
			getBoxHeight(e) {
				this.pdBottom = e //这里由于传过来的是以px单位为基础的数字，只能将原本的bottom设置成px单位方便设置
				this.goBottom()
			},
			//音频播放
			playVoice(e) {

				innerAudioContext.src = e;
				innerAudioContext.play();
			},

			//顶部加载动画
			loadingAni() {
				if(this.nowPage==-1){return}
				//禁止重复加载
				if(!this.beginLoading){//false
					this.beginLoading=true
				}else{
					return console.log('不允许重复加载');
				}
				this.isLoading = true
				var animation = uni.createAnimation({
					duration: 1000,
					timingFunction: 'ease',
				})
				let i = 1;
				loadingRotate = setInterval(() => {
					animation.rotate(i * 30).step()
					this.animationLoading = animation.export()
					i++
					if (i > 30) {
						this.getMsg(this.nowPage)
						this.beginLoading=false
					}
				}, 80)
				
			},
			goGroupHome(){
				uni.navigateTo({
					url:'/pages/grouphome/grouphome?id='+this.id+'&img='+this.imgurl,
				})
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
		box-sizing: border-box;
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

		.loading {
			text-align: center;

			image {
				height: 30rpx;
				width: 30rpx;
			}

		}

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

			.voice {
				text-align: right;

				.voice-img {
					float: left;
					padding: 8rpx 0 0 0;
				}
			}

			.message {
				image {
					margin-right: 18rpx;
				}
			}
		}

		.msg-left {
			.message-text {
				margin-left: 18rpx;
				background-color: #fff;
				border-radius: 0 20rpx 20rpx 20rpx;
			}

			.voice {
				.voice-img {
					float: right;
					padding: 8rpx 0 0 0;
				}
			}

			.message {
				image {
					margin-left: 18rpx;
				}
			}

		}

		.message {
			max-width: 500rpx;


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


			.voice {
				.voice-img {
					width: 32rpx;
					height: 32rpx;
				}
			}
		}

		.message-voice {
			min-width: 150rpx
		}
	}
</style>
