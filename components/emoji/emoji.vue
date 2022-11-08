<template>
	<view class="emoji">
		<view class="emoji-line" v-for="(itemLine,index) in emoji" :key="index">
			<view class="emoji-item"  v-for="(item,i) in itemLine" :key="i" @tap="choose(item)">{{item}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"emoji",
		data() {
			return {
				emoji:[
					['😀','😁','😂','🤣','😄','😅'],
					['😃','😄','😅','😆','😉','😊'],
					['😉','😊','😋','😎','😃','😄'],
					['😀','😁','😂','🤣','😄','😅'],
					['😃','😄','😅','😆','😉','😊'],
					['😉','😊','😋','😎','😃','😄'],
					['😉','😊','😋','😎','😃','😄'],
					['😀','😁','😂','🤣','😄','😅']
				]
			};
		},
		methods:{
			choose(item){
				this.$emit('chooseEm',item)
			}
		}
	}
</script>

<style lang="scss">
.emoji{
	width: 100%;
	height: 436rpx;
	padding: 12rpx 12rpx 80rpx 12rpx;
	box-sizing: border-box;
	overflow: hidden;
	overflow-y: auto;
	.emoji-line{
		display: flex;
		.emoji-item{
			flex: 1;
			text-align: center;
			line-height: 68rpx;
		}
	}
}
</style>