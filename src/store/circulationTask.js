import { deepClone } from '@/common/js/utils'

export default {
  state:{
    circulationTaskMessage: null,
    currentElectronicSignature: null,
    circulationCollectMessageList: [],
    isCollectEnterSweepCodePage: false
  },
  getters:{
    circulationTaskMessage: state => state.circulationTaskMessage,
    currentElectronicSignature: state => state.currentElectronicSignature,
    circulationCollectMessageList: state => state.circulationCollectMessageList,
    isCollectEnterSweepCodePage: state => state.isCollectEnterSweepCodePage
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
     changeCirculationCollectMessageList (state,payLoad) {
      state.circulationCollectMessageList = deepClone(payLoad.DtMsg)
    },
    // 改变是否是采集环节进入扫码页面
    changeIsCollectEnterSweepCodePage (state,payLoad) {
      state.isCollectEnterSweepCodePage = payLoad
    }
  },
  actions:{}
}