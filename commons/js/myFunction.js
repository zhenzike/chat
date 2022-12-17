
export default {
	dateTime(date) {
		let oldTime = new Date(date);
		let nowTime = new Date();
		//得到获取消息的具体时间
		let d = oldTime.getTime();
		let h = oldTime.getHours();
		let m = oldTime.getMinutes();
		let Y = oldTime.getFullYear();
		let M = oldTime.getMonth() + 1;
		let D = oldTime.getDate();
		//获取当前具体时间
		let nowd = nowTime.getTime();
		let nowh = nowTime.getHours();
		let nowm = nowTime.getMinutes();
		let nowY = nowTime.getFullYear();
		let nowM = nowTime.getMonth() + 1;
		let nowD = nowTime.getDate();

		//当天时间则只输出时、分
		if (D == nowD && M == nowM && Y == nowY) {
			return addZero(h) + ':' + addZero(m)
		} else if (D + 1 == nowD && M == nowM && Y == nowY) { //昨天的时间
			return '昨天' + addZero(h) + ':' + addZero(m)
		} else {
			return addZero(Y) + '年' + addZero(M) + '月' + addZero(D) + '日'
		}

	},
	
	// 判断聊天时间间隔，若没有超过约定时间则返回消息回复时间
	spaceTime(old, now) {	
		let oldTime = new Date(old);
		let nowTime = new Date(now);
		var told = oldTime.getTime();
		var tnow = nowTime.getTime();
		if ((told+1000 * 60 * 5) < tnow ) { //如果当前时间超过旧时间5分钟返回当前时间
			return nowTime
		} else {
			return ''
		}
	},

	//用于根据最后的聊天时间降序排序
	messageOrder(arr, target) {
		let t = null;
		for (let i = 0; i < arr.length; i++) {
			for (let j = i; j > 0; j--) {
				if (arr[j][target] > arr[j - 1][target]) {
					t = arr[j]
					arr[j] = arr[j - 1]
					arr[j - 1] = t
				}
			}
		}
		return arr
	},

	fileTimeName(date) {
		let Y = date.getFullYear();
		let M = date.getMonth() + 1;
		let D = date.getDate();

		return addZero(Y) +''+  addZero(M)+''+   addZero(D)
	}
}

function addZero(n) {
	return n > 9 ? n : '0' + n;
}
