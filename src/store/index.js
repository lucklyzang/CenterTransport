import Vue from 'vue';
import Vuex from 'vuex';
import dispatchTask from './dispatchTask.js'
import appointTask from './appointTask.js'
import circulationTask from './circulationTask.js'
import login from './login.js'
import scratchCodeMsg from './scratchCodeMsg.js'
import warningMessage from './warningMessage.js'
import medicalTask from './medicalTask.js'
Vue.use(Vuex);
export default new Vuex.Store({
  modules:{
    dispatchTask,
    appointTask,
    circulationTask,
    medicalTask,
    login,
    scratchCodeMsg,
    warningMessage
  }
});