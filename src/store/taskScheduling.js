import { setStore, getStore, removeStore } from '@/common/js/utils'

export default {
  state:{
    // 任务调度类型
    taskType: ''
  },

  getters:{
    taskType: (state) => {
        return state.taskType
    },
  },

  mutations:{

    // 保存任务调度切换类型
    changeTaskType (state, payLoad) {
        state.taskType = payLoad
    }
  },
  
  actions:{}
}
