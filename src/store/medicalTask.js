import { setStore, getStore, removeStore } from '@/common/js/utils'

export default {
  state:{
    transportTypeMessage: null
  },
  getters:{
    transportTypeMessage: state => state.transportTypeMessage,
  },
  mutations:{
    // 改变循环任务信息状态
    changetransportTypeMessage (state,payLoad) {
      state.transportTypeMessage = payLoad.DtMsg
    },
  },
  actions:{}
}