import App from './App'

// #ifndef VUE3
import Vue from 'vue'
//引入weapp.socket.io
// import io from 'components/socket/weapp.socket.io.js'
import io from 'components/socket/socket.io.js'
Vue.prototype.$socket = io('http://192.168.3.76:8082')
Vue.config.productionTip = false
App.mpType = 'app'



// Vue.prototype.$socket=io('http://192.168.3.76:8082')
// Vue.prototype.$socket.emit("send",1)
// Vue.prototype.$socket.on("getMsg",data=>{
// 	console.log(data);
// })

Vue.prototype.$serverUrl = 'http://192.168.3.76:3000' //在vue原型上挂载请求根路径
const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif
