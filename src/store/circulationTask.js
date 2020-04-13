import { deepClone } from '@/common/js/utils'

export default {
  state:{
    circulationTaskId: '',
    arriveDepartmentId: false,
    storeArriveDeparnmentId: '',
    circulationTaskMessage: null,
    currentElectronicSignature: null,
    circulationCollectMessageList: [],
    isCollectEnterSweepCodePage: false,
    circulationConnectMessageList: [],
    isrefreshCirculationConnectPage: false,
    isDispatchTaskCompleteSweepCodeOfficeList: [],
    // completeDeparnmentInfo: {
    //   "departmentIdList": [],
    //   "taskId": ''
    // },
    completeDeparnmentInfo: [],
    stipulateOfficeList: [],
    storeAlreadyConnectSample: [],
    storeNoConnectSample: []
  },
  getters:{
    circulationTaskId: state => state.circulationTaskId,
    circulationTaskMessage: state => state.circulationTaskMessage,
    currentElectronicSignature: state => state.currentElectronicSignature,
    circulationCollectMessageList: state => state.circulationCollectMessageList,
    isCollectEnterSweepCodePage: state => state.isCollectEnterSweepCodePage,
    circulationConnectMessageList: state => state.circulationConnectMessageList,
    isrefreshCirculationConnectPage: state => state.isrefreshCirculationConnectPage,
    completeDeparnmentInfo: state => state.completeDeparnmentInfo,
    stipulateOfficeList: state => state.stipulateOfficeList,
    arriveDepartmentId: state => state.arriveDepartmentId,
    storeArriveDeparnmentId: state => state.storeArriveDeparnmentId,
    isDispatchTaskCompleteSweepCodeOfficeList: state => state.isDispatchTaskCompleteSweepCodeOfficeList,
    storeAlreadyConnectSample: state => state.storeAlreadyConnectSample,
    storeNoConnectSample: state => state.storeNoConnectSample
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
    // 改变采集完成科室信息的状态
    changeCompleteDeparnmentInfo (state,payLoad) {
      state.completeDeparnmentInfo = deepClone(payLoad.DtMsg)
    },
    // 改变要扫码的科室列表状态
    changeStipulateOfficeList (state,payLoad) {
      state.stipulateOfficeList = payLoad
    },
    // 改变送达科室是否扫码状态
    changeArriveDepartmentId (state,payLoad) {
      state.arriveDepartmentId = payLoad
    },
    // 改变送达科室id状态
    changeStoreArriveDeparnmentId (state,payLoad) {
      state.storeArriveDeparnmentId = payLoad
    },
    // 改变是否完成扫码科室列表状态
    changeIsDispatchTaskCompleteSweepCodeOfficeList (state,payLoad) {
      state.isDispatchTaskCompleteSweepCodeOfficeList = payLoad
    },
    // 改变已经交接的标本状态
    changeIsstoreAlreadyConnectSample (state,payLoad) {
      state.storeAlreadyConnectSample = deepClone(payLoad)
    },
    // 改变没有交接的标本状态
    changeIsStoreNoConnectSample (state,payLoad) {
      state.storeNoConnectSample = deepClone(payLoad)
    }
  },
  actions:{}
}