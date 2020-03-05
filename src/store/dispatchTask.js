 import { setStore, getStore, removeStore } from '@/common/js/utils'

export default {
  state:{
    navTitle: '首页',
  },
  getters:{
    navTopTitle: state => state.navTitle,
  },
  mutations:{
    // 改变页面标题
    changeTitleTxt (state,payLoad) {
      state.navTitle = payLoad.tit
    }
  },
  actions:{}
}