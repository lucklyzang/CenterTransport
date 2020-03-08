import { setStore, getStore, removeStore } from '@/common/js/utils'

export default {
  state:{
    circulationTaskMessage: null
  },
  getters:{
    circulationTaskMessage: state => state.circulationTaskMessage,
  },
  mutations:{
    // 改变循环任务信息状态
    changeCirculationTaskMessage (state,payLoad) {
      state.circulationTaskMessage = payLoad.DtMsg
    },
  },
  actions:{}
}