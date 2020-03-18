import Vue from 'vue'
import Router from 'vue-router'
import {setStore, getStore} from '@/common/js/utils.js'
import store from '@/store'
const Home = () => import('../pages/Home')
const Login = () => import('../pages/Login')
const DispatchTask = () => import('../pages/taskPage/DispatchTask')
const CirculationTask = () => import('../pages/taskPage/CirculationTask')
const AppointTask = () => import('../pages/taskPage/AppointTask')
const AutonomicTask = () => import('../pages/taskPage/AutonomicTask')
const DispatchTaskSweepCode = () => import('../pages/sweepCodePage/DispatchTaskSweepCode')
const AppointTaskSweepCode = () => import('../pages/sweepCodePage/AppointTaskSweepCode')
const CirculationTaskSweepCode = () => import('../pages/sweepCodePage/CirculationTaskSweepCode')
const CirculationTaskCollectMessage = () => import('../pages/taskMessagePage/CirculationTaskCollectMessage')
const CirculationTaskCollectMessageSure = () => import('../pages/taskMessagePage/CirculationTaskCollectMessageSure')
const CirculationTaskMessageConnect = () => import('../pages/taskMessagePage/CirculationTaskMessageConnect')
const CirculationTaskConnectMessageSure = () => import('../pages/taskMessagePage/CirculationTaskConnectMessageSure')
const CirculationTaskCondition = () => import('../pages/taskMessagePage/CirculationTaskCondition')
const TransportTypeMessage = () => import('../pages/medicalTaskPage/TransportTypeMessage')
const DispatchTaskForm = () => import('../pages/taskFormPage/DispatchTaskForm')
Vue.use(Router)

let baseRoute  = [
  {
    path: '/',
    name: 'login',
    component: Login,
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/dispatchTask',
    name: 'dispatchTask',
    component: DispatchTask,
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/circulationTask',
    name: 'circulationTask',
    component: CirculationTask,
  },
  {
    path: '/appointTask',
    name: 'appointTask',
    component: AppointTask,
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/autonomicTask',
    name: 'autonomicTask',
    component: AutonomicTask
  },
  {
    path: '/dispatchTaskSweepCode',
    name: 'dispatchTaskSweepCode',
    component: DispatchTaskSweepCode
  },
  {
    path: '/appointTaskSweepCode',
    name: 'appointTaskSweepCode',
    component: AppointTaskSweepCode
  },
  {
    path: '/circulationTaskSweepCode',
    name: 'circulationTaskSweepCode',
    component: CirculationTaskSweepCode
  },
  {
    path: '/circulationTaskCollectMessage',
    name: 'circulationTaskCollectMessage',
    component: CirculationTaskCollectMessage
  },
  {
    path: '/circulationTaskCollectMessageSure',
    name: 'circulationTaskCollectMessageSure',
    component: CirculationTaskCollectMessageSure
  },
  {
    path: '/circulationTaskMessageConnect',
    name: 'circulationTaskMessageConnect',
    component: CirculationTaskMessageConnect
  },
  {
    path: '/circulationTaskConnectMessageSure',
    name: 'circulationTaskConnectMessageSure',
    component: CirculationTaskConnectMessageSure
  },
  {
    path: '/circulationTaskCondition',
    name: 'circulationTaskCondition',
    component: CirculationTaskCondition
  },
  {
    path: '/transportTypeMessage',
    name: 'transportTypeMessage',
    component: TransportTypeMessage
  },
  {
    path: '/dispatchTaskForm',
    name: 'dispatchTaskForm',
    component: DispatchTaskForm
  }
];
let router = new Router({
  routes: baseRoute
});
router.beforeEach((to, from, next) => {
  if (getStore('isLogin')) {
    if (to.name === 'login') {
      // 判断登录方式(用户名密码登录或扫码登录)
      if (getStore('userName') && getStore('userPassword')) {
        next({path: '/home'})
      } else {
        next()
      }
    } else {
      next()
    }
  } else {
    next()
  }
});
export default router

