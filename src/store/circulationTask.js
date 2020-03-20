import { setStore, getStore, removeStore } from '@/common/js/utils'

export default {
  state:{
    circulationTaskMessage: null,
    currentElectronicSignature: null,
    circulationCollectMessage: null
  },
  getters:{
    circulationTaskMessage: state => state.circulationTaskMessage,
    currentElectronicSignature: state => state.currentElectronicSignature,
    circulationCollectMessage: state => state.circulationCollectMessage,
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
    // 改变循环采集信息状态
     changeCirculationCollectMessage (state,payLoad) {
      state.circulationCollectMessage = payLoad.DtMsg
    }
  },
  actions:{}
}