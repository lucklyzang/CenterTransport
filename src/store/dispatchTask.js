import { setStore, getStore, removeStore } from '@/common/js/utils'

export default {
  state:{
    navTitle: '中央运送',
    dispatchTaskMessage: null,
    dispatchTaskTransferIdList: [],
    dispatchTaskCancelIdList: [],
    dispatchTaskState: '',
    dispatchTaskDepartmentType: '',
    isCoerceTakePhoto: false,
    isCompleteSweepCode: [],
    isDispatchTaskFirstSweepCode: true
  },
  getters:{
    navTopTitle: state => state.navTitle,
    dispatchTaskMessage: state => state.dispatchTaskMessage,
    dispatchTaskTransferIdList: state => state.dispatchTaskTransferIdList,
    dispatchTaskCancelIdList: state => state.dispatchTaskCancelIdList,
    dispatchTaskState: state => state.dispatchTaskState,
    dispatchTaskDepartmentType: state => state.dispatchTaskDepartmentType,
    isCoerceTakePhoto: state => state.isCoerceTakePhoto,
    isCompleteSweepCode: state => state.isCompleteSweepCode,
    isDispatchTaskFirstSweepCode: state => state.isDispatchTaskFirstSweepCode
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
    // 改变取消原因列表状态
    changedispatchTaskCancelIdList (state,payLoad) {
      state.dispatchTaskCancelIdList = payLoad.DtMsg
    },
    // 改变调度任务状态的状态
    changeDispatchTaskState (state,payLoad) {
      state.dispatchTaskState = payLoad
    },
    // 改变调度任务科室类型的状态
    changeDispatchTaskDepartmentType (state,payLoad) {
      state.dispatchTaskDepartmentType = payLoad
    },
    //改变是否强制拍照的状态
    changeIsCoerceTakePhoto (state,payLoad) {
      state.isCoerceTakePhoto = payLoad
    },
    //改变是否完成扫码的状态
    changeisCompleteSweepCode (state,payLoad) {
      state.isCompleteSweepCode = payLoad
    },
    //改变是否首次扫码的状态
    changeIsDispatchTaskFirstSweepCode (state,payLoad) {
      state.isDispatchTaskFirstSweepCode = payLoad
    }
  },
  actions:{}
}