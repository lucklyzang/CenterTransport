import { setStore, getStore, removeStore } from '@/common/js/utils'

export default {
  state:{
    // 运送类型信息
    transportTypeMessage: null,
    isRefershHome: false,
    // 首页是否跳转到过其它页面
    isHomeJumpOtherPage: false
  },
  getters:{
    transportTypeMessage: state => state.transportTypeMessage,
    isRefershHome: state => state.isRefershHome,
    isHomeJumpOtherPage: state => state.isHomeJumpOtherPage
  },
  mutations:{
    // 改变运送信息状态
    changetransportTypeMessage (state,payLoad) {
      state.transportTypeMessage = payLoad.DtMsg
    },
    // 改变运送类型信息页跳转回首页状态
     changeIsRefershHome (state,payLoad) {
      state.isRefershHome = payLoad.DtMsg
    },

    // 改变首页是否跳转到过其它页面状态
    changeIsHomeJumpOtherPage (state,payLoad) {
      state.isHomeJumpOtherPage = payLoad.DtMsg
    }
  },
  actions:{}
}