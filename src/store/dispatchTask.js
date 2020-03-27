import { setStore, getStore, removeStore } from '@/common/js/utils'

export default {
  state:{
    navTitle: '中央运送',
    dispatchTaskMessage: null,
    dispatchTaskTransferIdList: [],
    isRefershDispatchTaskPage: false,
    dispatchTaskState: '',
    dispatchTaskDepartmentType: '',
    isCoerceTakePhoto: false
  },
  getters:{
    navTopTitle: state => state.navTitle,
    dispatchTaskMessage: state => state.dispatchTaskMessage,
    dispatchTaskTransferIdList: state => state.dispatchTaskTransferIdList,
    isRefershDispatchTaskPage: state => state.isRefershDispatchTaskPage,
    dispatchTaskState: state => state.dispatchTaskState,
    dispatchTaskDepartmentType: state => state.dispatchTaskDepartmentType,
    isCoerceTakePhoto: state => state.isCoerceTakePhoto
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
    // 改变是否刷新调度任务页面状态
    changeIsRefershDispatchTaskPage (state,payLoad) {
      state.isRefershDispatchTaskPage = payLoad
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
    }
  },
  actions:{}
}