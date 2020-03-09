import { setStore, getStore, removeStore } from '@/common/js/utils'

export default {
  state:{
    circulationTaskMessage: null,
    currentElectronicSignature: null,
  },
  getters:{
    circulationTaskMessage: state => state.circulationTaskMessage,
    currentElectronicSignature: state => state.currentElectronicSignature
  },
  mutations:{
    // 改变循环任务信息状态
    changeCirculationTaskMessage (state,payLoad) {
      state.circulationTaskMessage = payLoad.DtMsg
    },
    // 改变电子签名状态
    changeCurrentElectronicSignature (state,payLoad) {
      state.currentElectronicSignature = payLoad.DtMsg
    },
  },
  actions:{}
}