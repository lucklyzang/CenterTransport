export default {
  state:{
    userInfo: null,
    routerFlag: true,
    token: null, //请求token
    // 是否扫码登录
    loginSweepCode: false,
    // 用户身份
    userType: '',
    // 过期方式
    overDueWay: false,
    departmentInfoList: {}
  },
  getters:{
    userInfo : state => state.userInfo,
    routerFlag : state => state.routerFlag,
    loginSweepCode : state => state.loginSweepCode,
    token : state => state.token,
    userType: state => state.userType,
    overDueWay: state => state.overDueWay,
    departmentInfoList: state => state.departmentInfoList
  },
  mutations:{
    storeUserInfo (state, playLoad) {
      state.userInfo = playLoad
    },
    changeRouterFlag (state, playLoad) {
      state.routerFlag = playLoad
    },
    changeLoginMethod (state, playLoad) {
      state.loginSweepCode = playLoad
    },
    // 修改token状态
    changeToken (state, playLoad) {
      if (playLoad && playLoad != 'null') {
        state.token = playLoad
      }
    },
    // 修改用户状态
    changeUserType (state, playLoad) {
      state.userType = playLoad
    },
    // 修改过期方式
    changeOverDueWay (state, playLoad) {
      state.overDueWay = playLoad
    },
    // 改变科室信息状态
    changeDepartmentInfoList (state, playLoad) {
      state.departmentInfoList = playLoad
    },
  },
  actions:{}
}