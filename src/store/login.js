export default {
  state:{
    userInfo: null,
    // 判断模板类型
    isTemplateOne: 0,
    routerFlag: true,
    token: null, //请求token
    // 是否扫码登录
    loginSweepCode: false,
    // 用户身份
    userType: '',
    // 过期方式
    overDueWay: false,
    departmentInfoList: {},
    departmentInfoListNo: {},
    newTaskName: '',
    taskDetailsMessage: {},
    taskType: '',
    globalTimer: null,
    globalCircleTimer: null,
    isFreshHomePage: false,
    isNewCircle: false
  },
  getters:{
    userInfo : state => state.userInfo,
    isTemplateOne : state => state.isTemplateOne,
    routerFlag : state => state.routerFlag,
    loginSweepCode : state => state.loginSweepCode,
    token : state => state.token,
    userType: state => state.userType,
    overDueWay: state => state.overDueWay,
    departmentInfoList: state => state.departmentInfoList,
    departmentInfoListNo: state => state.departmentInfoListNo,
    newTaskName: state => state.newTaskName,
    taskDetailsMessage: state => state.taskDetailsMessage,
    taskType: state => state.taskType,
    globalTimer: state => state.globalTimer,
    globalCircleTimer: state => state.globalCircleTimer,
    isFreshHomePage: state => state.isFreshHomePage,
    isNewCircle: state => state.isNewCircle
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
    // 修改模板状态
    changeIsTemplateOne (state, playLoad) {
        state.isTemplateOne = playLoad
    },
    // 修改用户状态
    changeUserType (state, playLoad) {
      state.userType = playLoad
    },
    // 修改过期方式
    changeOverDueWay (state, playLoad) {
      state.overDueWay = playLoad
    },
    // 改变科室信息状态id
    changeDepartmentInfoList (state, playLoad) {
      state.departmentInfoList = playLoad
    },
    // 改变科室信息状态编号
    changeDepartmentInfoListNo (state, playLoad) {
      state.departmentInfoListNo = playLoad
    },
    // 改变新任务列表状态
    changeNewTaskList (state, playLoad) {
      state.newTaskName = playLoad
    },
    // 改变历史任务详情
    changeTaskDetailsMessage (state, playLoad) {
      state.taskDetailsMessage = playLoad
    },
    // 改变任务类型状态
    changeTaskType (state, playLoad) {
      state.taskType = playLoad
    },
    // 改变全局定时器的状态
    changeGlobalTimer (state, playLoad) {
      state.globalTimer = playLoad
    },
    // 改变全局定时器的状态
    changeGlobalCircleTimer (state, playLoad) {
      state.globalCircleTimer = playLoad
    },
    // 改变是否刷新首页的状态
    changeIsFreshHomePage (state, playLoad) {
      state.isFreshHomePage = playLoad
    },
    // 修改是否是新循环任务状态
    changeIsNewCircle (state, playLoad) {
      state.isNewCircle = playLoad
    }
  },
  actions:{}
}
