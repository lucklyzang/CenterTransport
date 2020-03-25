import { deepClone } from '@/common/js/utils'

export default {
  state:{
    circulationTaskId: '',
    circulationTaskMessage: null,
    currentElectronicSignature: null,
    circulationCollectMessageList: [],
    isCollectEnterSweepCodePage: false,
    circulationConnectMessageList: [],
    isrefreshCirculationConnectPage: false,
    isrefreshCirculationTaskPage: false,
    completeDeparnmentInfo: {
      "departmentIdList": [],
      "taskId": ''
    }
  },
  getters:{
    circulationTaskId: state => state.circulationTaskId,
    circulationTaskMessage: state => state.circulationTaskMessage,
    currentElectronicSignature: state => state.currentElectronicSignature,
    circulationCollectMessageList: state => state.circulationCollectMessageList,
    isCollectEnterSweepCodePage: state => state.isCollectEnterSweepCodePage,
    circulationConnectMessageList: state => state.circulationConnectMessageList,
    isrefreshCirculationConnectPage: state => state.isrefreshCirculationConnectPage,
    isrefreshCirculationTaskPage: state => state.isrefreshCirculationTaskPage,
    completeDeparnmentInfo: state => state.completeDeparnmentInfo
  },
  mutations:{
    // 改变循环任务ID状态
    changeCirculationTaskId (state,payLoad) {
      state.circulationTaskId = payLoad
    },
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
    },
    // 改变循环信息交接状态
    changeCirculationConnectMessageList (state,payLoad) {
      state.circulationConnectMessageList = deepClone(payLoad.DtMsg)
    },
    // 改变是否刷新交接页面状态
    changeIsrefreshCirculationConnectPage (state,payLoad) {
      state.isrefreshCirculationConnectPage = payLoad
    },
    // 改变是否刷新循环任务页面
    changeIsrefreshCirculationTaskPage (state,payLoad) {
      state.isrefreshCirculationTaskPage = payLoad
    },
    // 改变采集完成科室信息的状态
    changeCompleteDeparnmentInfo (state,payLoad) {
      state.completeDeparnmentInfo = deepClone(payLoad.DtMsg)
    }
  },
  actions:{}
}