<template>
	<view>
		<view class="upload" @tap="upload">
			上传文件
		</view>
		<image v-for="(item,index) in imgurl" :key="index" :src="item">11</image>
	</view>
</template>

<script>
	import myfun from '../../commons/js/myFunction.js'
	export default {

		data() {
			return {
				imgurl: []
			}
		},
		methods: {
			upload() {
				// uni.request({
				// 	url:this.$serverUrl+'/user/',
				// 	data:{

				// 	},
				// 	method:'POST',
				// 	success:(data)=> {
				// 		let status=data.data.status
				// 	}
				// })




				let time = myfun.fileTimeName(new Date())
				uni.chooseImage({
					count: 6,
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (chooseImageRes) => {
						const tempFilePaths = chooseImageRes.tempFilePaths;
						for (let i = 0; i < tempFilePaths.length; i++) {
							const uploadTask = uni.uploadFile({
								url: this.$serverUrl + '/files/upload', //仅为示例，非真实的接口地址
								filePath: tempFilePaths[0],
								name: 'file',
								formData: {
									'url': time
								},
								success: (uploadFileRes) => {
									let data = JSON.parse(uploadFileRes.data)
									console.log(data);
									console.log(uploadFileRes);
									let path = this.$serverUrl  +`/${time}/` + data[0].filename
									
									console.log(path);
									this.imgurl.push(path)
									
								}
							});
						}

						// uploadTask.onProgressUpdate((res) => {
						// 	console.log('上传进度' + res.progress);
						// 	console.log('已经上传的数据长度' + res.totalBytesSent);
						// 	console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);						
						// });
					}
				});
			}
		}
	}
</script>

<style>
	image {
		width: 200rpx;
		height: 300rpx;
	}
</style>
