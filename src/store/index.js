import Vue from 'vue';
import Vuex from 'vuex';
import dispatchTask from './dispatchTask.js'
import login from './login.js'
import scratchCodeMsg from './scratchCodeMsg.js'
import warningMessage from './warningMessage.js'
Vue.use(Vuex);
export default new Vuex.Store({
  modules:{
    dispatchTask,
    login,
    scratchCodeMsg,
    warningMessage
  }
});