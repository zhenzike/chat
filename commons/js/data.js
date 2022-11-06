export default {
	//聊天列表
	frineds: function() {
		let frendArr = [{
				id: 1,
				imgUrl: '3.jpeg',
				tip: 2,
				mail:'sadas@qq.com',
				name: '刘亦菲',
				time: new Date(),
				news: '仿佛在不经意间，一股清甜渗入鼻间。你四处寻觅，还没来得及见到桂树，周遭却早已沉浸在桂花香'
			},
			{
				id: 2,
				imgUrl: '4.jpeg',
				tip: 4,
				mail:'dsadas@qq.com',
				name: '杨幂',
				time: new Date(),
				news: '你四处寻觅，还没来得及见到桂树，周遭却早已沉浸在桂花香'
			},
			{
				id: 3,
				imgUrl: '4.jpeg',
				tip: 8,
				mail:'dsadas@qq.com',
				name: '古力娜扎',
				time: new Date(),
				news: '周遭却早已沉浸在桂花香'
			},
			{
				id: 4,
				imgUrl: '4.jpeg',
				mail:'sadas@qq.com',
				tip: 10,
				name: '迪丽热巴',
				time: new Date(),
				news: '一股清甜渗入鼻间。你四处寻觅，仿佛在不经意间，还没来得及见到桂树，周遭却早已沉浸在桂花香'
			},
			{
				id: 5,
				imgUrl: '4.jpeg',
				tip: 0,
				mail:'dsadas@qq.com',
				name: '迪丽热巴',
				time: new Date(),
				news: '一股清甜渗入鼻间。你四处寻觅，仿佛在不经意间，还没来得及见到桂树，周遭却早已沉浸在桂花香'
			},
			{
				id: 6,
				imgUrl: '4.jpeg',
				tip: 10,
				mail:'dsadas@qq.com',
				name: '迪丽热巴',
				time: new Date(),
				news: '一股清甜渗入鼻间。你四处寻觅，仿佛在不经意间，还没来得及见到桂树，周遭却早已沉浸在桂花香'
			},
			{
				id: 7,
				imgUrl: '4.jpeg',
				tip: 10,
				mail:'dsadas@qq.com',
				name: '迪丽热巴',
				time: new Date(),
				news: '一股清甜渗入鼻间。你四处寻觅，仿佛在不经意间，还没来得及见到桂树，周遭却早已沉浸在桂花香'
			},
			{
				id: 8,
				imgUrl: '4.jpeg',
				tip: 10,
				mail:'dsadas@qq.com',
				name: '迪丽热巴',
				time: new Date(),
				news: '一股清甜渗入鼻间。你四处寻觅，仿佛在不经意间，还没来得及见到桂树，周遭却早已沉浸在桂花香'
			},
			{
				id: 9,
				imgUrl: '4.jpeg',
				tip: 10,
				mail:'dsadas@qq.com',
				name: '迪丽热巴',
				time: new Date(),
				news: '一股清甜渗入鼻间。你四处寻觅，仿佛在不经意间，还没来得及见到桂树，周遭却早已沉浸在桂花香'
			},
			{
				id: 10,
				imgUrl: '4.jpeg',
				tip: 10,
				mail:'dsadas@qq.com',
				name: '迪丽热巴',
				time: new Date(),
				news: '一股清甜渗入鼻间。你四处寻觅，仿佛在不经意间，还没来得及见到桂树，周遭却早已沉浸在桂花香'
			},
			{
				id: 11,
				imgUrl: '4.jpeg',
				tip: 10,
				mail:'dsadas@qq.com',
				name: '迪丽热巴',
				time: new Date(),
				news: '一股清甜渗入鼻间。你四处寻觅，仿佛在不经意间，还没来得及见到桂树，周遭却早已沉浸在桂花香'
			},
		];
		return frendArr
	},

	//好友列表
	isFriend() {
		let isfriend = [{
				userid: 1,
				friend: 2
			},
			{
				userid: 1,
				friend: 3
			},
			{
				userid: 1,
				friend: 4
			},
			{
				userid: 1,
				friend: 5
			},
		]
		return isfriend;
	},
	//聊天消息
	message(){
		let msg=[
			{				
					id:'a',
					imgUrl: '4.jpeg',
					tip: 0,
					type:0, //内容类型(0文字，1图片链接，2音频链接...)
					time: new Date()-1000,
					message: '还没来得及见到桂树，周遭却早已沉浸在桂花香'				
			},
			{
					id:'a',
					imgUrl: '4.jpeg',
					tip: 1,
					type:0,
					time: new Date()-1000*60*6,
					message: '一股清甜渗入鼻间'				
			},
			{
					id:'a',
					imgUrl: '4.jpeg',
					tip: 2,
					type:1,
					time: new Date()-1000*60*5*5,
					message: '2.jpeg'				
			},
			{
					id:'b',
					imgUrl: '2.jpeg'-1000*60*10,
					tip: 3,
					type:0,
					time: new Date(),
					message: '你四处寻觅，仿佛在不经意间，'				
			},
			{
					id:'b',
					imgUrl: '2.jpeg',
					tip: 4,
					type:1,
					time: new Date()-1000*60*60*240,
					message: '3.jpeg'				
			},
			{
					id:'b',
					imgUrl: '2.jpeg',
					tip: 4,
					type:0,
					time: new Date()-1000*60*60*24*1000,
					message: '2. 已经比较久了'				
			},
			{
					id:'a',
					imgUrl: '2.jpeg',
					tip: 4,
					type:0,
					time: new Date()-1000*60*60*24*1000*10,
					message: '1.很久以前'				
			},
		]
		return msg
	}
}
