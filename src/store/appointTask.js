import { setStore, getStore, removeStore } from '@/common/js/utils'

export default {
  state:{
    appointTaskMessage: null,
    isRefershAppointTaskPage: false,
    appointTaskTransferIdList: [],
    appointTaskState: '',
    appointTaskDepartmentType: '',
    appointSweepCodeNumber: false,
    appointSweepCodeIntoPage: false,
    cancelTaskIdList: [],
    originalSignature: null,
  },
  getters:{
    appointTaskMessage: state => state.appointTaskMessage,
    isRefershAppointTaskPage : state => state.isRefershAppointTaskPage,
    appointTaskTransferIdList: state => state.appointTaskTransferIdList,
    appointTaskState: state => state.appointTaskState,
    appointTaskDepartmentType: state => state.appointTaskDepartmentType,
    appointSweepCodeNumber: state => state.appointSweepCodeNumber,
    appointSweepCodeIntoPage: state => state.appointSweepCodeIntoPage,
    cancelTaskIdList: state => state.cancelTaskIdList,
    originalSignature: state => state.originalSignature
  },
  mutations:{
    // 改变调度任务信息状态
    changeAppointTaskMessage (state,payLoad) {
      state.appointTaskMessage = payLoad.DtMsg
    },
    // 改变是否刷新预约任务页面状态
     changeIsRefershAppointTaskPage (state,payLoad) {
      state.isRefershAppointTaskPage = payLoad
    },
    // 改变转移人员列表状态
    changeAppointTaskTransferIdList (state,payLoad) {
      state.appointTaskTransferIdList = payLoad.DtMsg
    },
    // 改变预约任务状态的状态
    changeAppointTaskState (state,payLoad) {
      state.appointTaskState = payLoad
    },
    // 改变预约任务科室类型的状态
    changeAppointTaskDepartmentType (state,payLoad) {
      state.appointTaskDepartmentType = payLoad
    },
    // 改变预约任务的扫码次数状态
    changeAppointSweepCodeNumber (state,payLoad) {
      state.appointSweepCodeNumber = payLoad
    },
    // 改变预约任务扫码后进入页面的状态
    changeAppointSweepCodeIntoPage (state,payLoad) {
      state.appointSweepCodeIntoPage = payLoad
    },
    // 改变取消原因列表状态
    changeAppoinTaskCancelIdList (state,payLoad) {
      state.cancelTaskIdList = payLoad.DtMsg
    },
    // 改变原始签名状态
    changeOriginalSignature (state,payLoad) {
      state.originalSignature = payLoad
    },
  },
  actions:{}
}