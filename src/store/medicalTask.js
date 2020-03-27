import { setStore, getStore, removeStore } from '@/common/js/utils'

export default {
  state:{
    transportantTaskMessage: null,
    isRefershHome: false,
    isHomeJumpOtherPage: false
  },
  getters:{
    transportantTaskMessage: state => state.transportantTaskMessage,
    isRefershHome: state => state.isRefershHome,
    isHomeJumpOtherPage: state => state.isHomeJumpOtherPage
  },
  mutations:{
    // 改变运送任务信息状态
    changetransportTypeMessage (state,payLoad) {
      state.transportantTaskMessage = payLoad.DtMsg
    },
    // 改变是否刷新首页的状态
    changeIsRefershHome (state,payLoad) {
      state.isRefershHome = payLoad
    },
     // 改变是否首页跳到其它页面状态
     changeIsHomeJumpOtherPage (state,payLoad) {
      state.isHomeJumpOtherPage = payLoad
    },
  },
  actions:{}
}