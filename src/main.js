
import Vue from 'vue'
import router from './router'
import store from './store'
import Vant from 'vant';
import 'vant/lib/index.css';
import moment from 'moment'
import {setStore, getStore, IsPC} from '@/common/js/utils.js'
import echarts from 'echarts'
// import SocketIO from 'socket.io-client';
import VueSocketIO from 'vue-socket.io';

Vue.prototype.$echarts = echarts
// 全局挂载时间格式化方法
Vue.filter('dateformat', function(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern)
});
Vue.prototype.$moment = moment;
// 全局挂载监听设备物理返回按键的方法
function gotoURL(callback){
  window.onpopstate = null;
  window.onpopstate = function(){
    callback()
  }
}
Vue.prototype.gotoURL = gotoURL;
//初始化样式
import './common/stylus/index.less'
//移动端适配
import 'lib-flexible/flexible.js'
import App from './App'
Vue.use(Vant);
Vue.config.productionTip = false;
// 页面刷新时重新存入用户信息
if (getStore('userInfo')) {
  store.commit('storeUserInfo',JSON.parse(getStore('userInfo')));
}
if (getStore('userType')) {
  store.commit('changeUserType',getStore('userType'));
}
// 页面刷新后重新存入当前标题
if (getStore('currentTitle')) {
  store.commit('changeTitleTxt', {tit: getStore('currentTitle')});
}
// 页面刷新重新存入请求token
if (getStore('questToken')) {
  store.commit('changeToken', getStore('questToken'));
}
// 页面刷新重新存入调度任务具体信息
if (getStore('currentDispatchTaskMessage')) {
  store.commit('changeDispatchTaskMessage', {DtMsg: getStore('currentDispatchTaskMessage')});
}
// 页面刷新重新存入预约任务具体信息
if (getStore('currentAppointTaskMessage')) {
  store.commit('changeAppointTaskMessage', {DtMsg: getStore('currentAppointTaskMessage')});
}
// 页面刷新重新存入循环任务具体信息
if (getStore('currentCirculationTaskMessage')) { 
  store.commit('changeCirculationTaskMessage', {DtMsg: JSON.parse(getStore('currentCirculationTaskMessage'))});
}
// 页面刷新重新存入循环任务科室采集信息
if (getStore('currentCirculationCollectMessage')) {
  store.commit('changeCirculationCollectMessageList', {DtMsg: (JSON.parse(getStore('currentCirculationCollectMessage'))['innerMessage'])})
};
// 页面刷新重新存入循环任务科室交集信息
if (getStore('currentCirculationConnectMessage')) {
  store.commit('changeCirculationConnectMessageList', {DtMsg: (JSON.parse(getStore('currentCirculationConnectMessage'))['innerMessage'])})
};
// 页面刷新重新存入医护人员生成运送类型信息
if (getStore('currentTransportTypeMessage')) {
  store.commit('changetransportTypeMessage', {DtMsg: getStore('currentTransportTypeMessage')});
}
// 页面刷新重新存入循环任务完成采集科室信息
if (getStore('completeDepartmentMessage')) {
  store.commit('changeCompleteDeparnmentInfo', {DtMsg: JSON.parse(getStore('completeDepartmentMessage'))});
}
if (IsPC()) {
  Vue.use(new VueSocketIO({
     debug: true,
     connection: 'http://localhost:10001'
  }))
};

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
