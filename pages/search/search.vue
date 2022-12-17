<template>
	<view class="content">
		<view class="top-bar">
			<!-- 搜索栏 -->
			<view class="search-div">
				<input class="search" type="search" placeholder="搜索用户/群" v-model="searchContent"
					placeholder-style="color:#aaa;font-width:400" @input="inputSearch">
				<image src='../../static/images/common/搜索.png'></image>
			</view>
			<view class="top-bar-r">
				<view class="text" @tap="back">取消</view>
			</view>
		</view>
		<!-- 搜索内容 -->
		<view class="main">
			<view class="search-user result">
				<view class="title" v-if="userArr.length>0">用户</view>
				<view class="list-user" v-for="(item,index) in userArr" :key="index">
					<navigator :url="'../userhome/userhome?id='+item.id" class="top-bar-left">
						<image :src="item.imgurl"></image>
					</navigator>
					<view class="names">
						<view class="name" v-html="item.name"></view>
						<view class="mail" v-html="item.email"></view>
					</view>
					<view class="right-bt-add" v-if="item.tip==0" @tap="goUserHome(item.id)">加好友</view>
					<view class="right-bt-send" v-else-if="item.tip==1">发消息</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import datas from '../../commons/js/data.js'
	import myfun from '../../commons/js/myFunction.js'
	export default {
		data() {
			return {
				userArr: [],
				timer: null,
				userid: '',
				name: '',
				imgurl: '',
				token: '',
				searchContent: ''
			}
		},

		onLoad() {
			this.getStorages()
		},

		onShow() {
			this.searchContent = ''
			this.userArr = [];
		},

		methods: {
			// 获取关键词
			inputSearch(e) {
				this.debounce(() => {
					this.userArr = [];
					let searchVal = e.detail.value;
					if (searchVal.length > 0) {
						this.searchUser(searchVal)
					}
				}, 500)
			},

			//防抖
			debounce(func, wait) {
				if (this.timer) clearTimeout(this.timer)
				this.timer = setTimeout(() => {
					func()
				}, wait)
			},

			//通过关键词匹配用户
			searchUser(Val) {
				uni.request({
					url: this.$serverUrl + '/search/user',
					data: {
						data: Val,
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status
						if (status == 200) {
							let arr = data.data.results

							// let arr = datas.frineds();
							let exp = eval("/" + Val + "/g"); //全局匹配输入的信息，用于高亮
							for (let i = 0; i < arr.length; i++) {
								if (arr[i].email.search(Val) != -1 || arr[i].name.search(Val) != -1) {
									this.isFriend(arr[i]);
									arr[i].imgurl = this.$serverUrl + '/user/' + arr[i].imgurl;
									arr[i].name = arr[i].name.replace(exp, "<span style='color:#4AAAFF;'>" +
										Val + "</span>")
									arr[i].email = arr[i].email.replace(exp, "<span style='color:#4AAAFF;'>" +
										Val + "</span>")
									this.userArr.push(arr[i])
								}
							}
						} else {
							uni.showToast({
								title: '服务器出错',
								icon: 'none',
								duration: 2000
							});
						}
					}
				})



			},
			// 判断是否为好友
			isFriend(Val) {
				let tip = 0; //默认状态为非好友
				Val.tip = 0;
				// let arr = datas.isFriend()
				if (Val.id == this.userid) {
					Val.tip = 2
				} else {
					uni.request({
						url: this.$serverUrl + '/search/isfriend',
						data: {
							userid: this.userid,
							friendid: Val.id
						},
						method: 'POST',
						success: (data) => {
							let status = data.data.status;
							if (status == 200) {
								tip = 1
								Val.tip = tip
							} else if (status == 400) {
								//不是好友
								tip = 0
								Val.tip = tip
							} else {
								uni.showToast({
									title: '服务器出错',
									icon: 'none',
									duration: 2000
								});
							}

						}
					})
				}
			},

			//获取缓存数据
			getStorages() {
				try {
					let Storage = uni.getStorageSync('user')
					this.userid = Storage.id;
					this.name = Storage.name;
					this.imgurl = Storage.imgurl;
					this.token = Storage.token;
				} catch {
					console.log('获取缓存失败');
				}
			},

			goUserHome(id, tip = 0) {
				uni.navigateTo({
					url: '../userhome/userhome?id=' + id,
				})
			},

			back() {
				uni.navigateBack({
					delta: 1
				})
			}


		},

	}
</script>

<style lang="scss">
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
		background: $uni-bg-color;

		.top-bar-r {
			float: right;
			padding-right: 32rpx;

			.text {
				font-size: $uni-font-size-lg;
				font-weight: 600;
				color: $uni-text-color;
				line-height: 88rpx;
			}
		}

		.search-div {
			position: absolute;
			float: left;
			top: 0;
			left: 0;
			width: 100%;
			z-index: -1;
			box-sizing: border-box;
			padding: 14rpx 118rpx 14rpx 32rpx;

			.search {
				padding: 0 60rpx 0 12rpx;
				height: 60rpx;
				background: #F3F4F6;
				border-radius: 10px;
			}

			image {
				position: absolute;
				right: 130rpx;
				top: 24rpx;
				width: 40rpx;
				height: 40rpx;
			}
		}
	}

	.main {
		padding: 88rpx $uni-spacing-col-base 0;
		box-sizing: border-box;

		.result {
			padding-top: 34rpx;

			.title {
				font-size: 44rpx;
				color: $uni-text-color;
				font-weight: 600;
				line-height: 60rpx;
			}

			.list-user {
				width: 100%;
				padding: 20rpx 0;
				height: 80rpx;

				image {
					float: left;
					width: 80rpx;
					height: 80rpx;
					border-radius: $uni-border-radius-base;
				}

				.names {
					float: left;
					padding-left: $uni-spacing-col-base;

					.name {
						font-size: 36rpx;
						color: $uni-text-color;
						line-height: 50rpx;
						font-weight: 400;
					}

					.mail {
						font-size: 24rpx;
						color: $uni-text-color;
						line-height: 28rpx;
					}
				}

				.right-bt-send {
					float: right;
					width: 120rpx;
					height: 48rpx;
					background: #7FFFD4;
					border-radius: 12rpx;
					font-size: 24rpx;
					color: white;
					font-weight: 500;
					line-height: 48rpx;
					text-align: center;
					margin-top: 16rpx;
				}

				.right-bt-add {
					float: right;
					width: 120rpx;
					height: 48rpx;
					border-radius: 12rpx;
					border: 1px solid #bebebe;
					font-size: 24rpx;
					color: $uni-text-color;
					font-weight: 500;
					line-height: 48rpx;
					text-align: center;
					margin-top: 16rpx;
				}
			}
		}
	}
</style>
