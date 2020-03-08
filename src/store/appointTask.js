import { setStore, getStore, removeStore } from '@/common/js/utils'

export default {
  state:{
    apointTaskMessage: null
  },
  getters:{
    appointTaskMessage: state => state.apointTaskMessage,
  },
  mutations:{
    // 改变调度任务信息状态
    changeAppointTaskMessage (state,payLoad) {
      state.apointTaskMessage = payLoad.DtMsg
    },
  },
  actions:{}
}