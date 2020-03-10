import { setStore, getStore, removeStore } from '@/common/js/utils'

export default {
  state:{
    navTitle: '中央运送',
    dispatchTaskMessage: null
  },
  getters:{
    navTopTitle: state => state.navTitle,
    dispatchTaskMessage: state => state.dispatchTaskMessage,
  },
  mutations:{
    // 改变页面标题
    changeTitleTxt (state,payLoad) {
      state.navTitle = payLoad.tit
    },

    // 改变调度任务信息状态
    changeDispatchTaskMessage (state,payLoad) {
      state.dispatchTaskMessage = payLoad.DtMsg
    },
  },
  actions:{}
}