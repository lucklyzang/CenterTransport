import { setStore, getStore, removeStore } from '@/common/js/utils'

export default {
  state:{
    navTitle: '中央运送',
    dispatchTaskMessage: null,
    dispatchTaskTransferIdList: []
  },
  getters:{
    navTopTitle: state => state.navTitle,
    dispatchTaskMessage: state => state.dispatchTaskMessage,
    dispatchTaskTransferIdList: state => state.dispatchTaskTransferIdList
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

    // 改变转移人员列表状态
    changedispatchTaskTransferIdList (state,payLoad) {
      state.dispatchTaskTransferIdList = payLoad.DtMsg
    },
  },
  actions:{}
}