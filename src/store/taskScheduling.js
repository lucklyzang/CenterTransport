import { setStore, getStore, removeStore } from '@/common/js/utils'

export default {
  state:{
    // 任务调度类型
    taskType: {},
    // 任务调度详情
    schedulingTaskDetails: {},
    //操作按钮点击记录
    operateBtnClickRecord: {
      allocationBtnClick: false,
      delayBtnClick: false,
      cancelBtnClick: false
    }
  },

  getters:{
    taskType: (state) => {
      return state.taskType
    },
    schedulingTaskDetails: (state) => {
      return state.schedulingTaskDetails
    },
    operateBtnClickRecord: (state) => {
      return state.operateBtnClickRecord
    },
  },

  mutations:{

    // 保存任务调度切换类型
    changeTaskType (state, payLoad) {
      state.taskType = payLoad
    },

    // 保存任务调度详情
    changeSchedulingTaskDetails (state, payLoad) {
      state.schedulingTaskDetails = payLoad
    },

    // 保存操作按钮点击记录
    changeOperateBtnClickRecord (state, payLoad) {
      state.operateBtnClickRecord = payLoad
    }
  },
  
  actions:{}
}
