import Vue from 'vue'
import Router from 'vue-router'
import {setStore, getStore} from '@/common/js/utils.js'
import store from '@/store'
const Home = () => import('@/pages/Home')
const Login = () => import('@/pages/Login')
const DispatchTask = () => import('@/pages/taskPage/DispatchTask')
const CirculationTask = () => import('@/pages/taskPage/CirculationTask')
const AppointTask = () => import('@/pages/taskPage/AppointTask')
const AutonomicTask = () => import('@/pages/taskPage/AutonomicTask')
const DispatchTaskSweepCode = () => import('@/pages/sweepCodePage/DispatchTaskSweepCode')
const AppointTaskSweepCode = () => import('@/pages/sweepCodePage/AppointTaskSweepCode')
const CirculationTaskSweepCode = () => import('@/pages/sweepCodePage/CirculationTaskSweepCode')
const CirculationTaskCollectMessage = () => import('@/pages/taskMessagePage/CirculationTaskCollectMessage')
const NewCirculationTaskCollectMessage = () => import('@/pages/taskMessagePage/NewCirculationTaskCollectMessage')
const NewCirculationTaskConnectMessage = () => import('@/pages/taskMessagePage/NewCirculationTaskConnectMessage')
const CirculationTaskCollectMessageSure = () => import('@/pages/taskMessagePage/CirculationTaskCollectMessageSure')
const CirculationTaskMessageConnect = () => import('@/pages/taskMessagePage/CirculationTaskMessageConnect')
const CirculationTaskConnectMessageSure = () => import('@/pages/taskMessagePage/CirculationTaskConnectMessageSure')
const CirculationTaskCondition = () => import('@/pages/taskMessagePage/CirculationTaskCondition')
const CurrentCirculationTaskSampleMessage = () => import('@/pages/taskMessagePage/CurrentCirculationTaskSampleMessage')
const NewCirculationTaskHistoryDetails = () => import('@/pages/taskMessagePage/NewCirculationTaskHistoryDetails')
const TransportTypeMessage = () => import('@/pages/medicalTaskPage/TransportTypeMessage')
const DispatchTaskTransferForm = () => import('@/pages/taskFormPage/DispatchTaskTransferForm')
const DispatchTaskCancelForm = () => import('@/pages/taskFormPage/DispatchTaskCancelForm')
const AppointTaskForm = () => import('@/pages/taskFormPage/AppointTaskForm')
const AppointTaskCustomerInfo = () => import('@/pages/taskFormPage/AppointTaskCustomerInfo')
const DispatchTaskJudge = () => import('@/pages/taskJudgePage/dispatchTaskJudge')
const TaskDetailsMessage = () => import('@/pages/taskMessagePage/TaskDetailsMessage')
const PadDispatchTaskCancelForm = () => import('@/pages/medicalTaskPage/PadDispatchTaskCancelForm')
const CirculationDetails = () => import('@/pages/taskDetailsPage/CirculationDetails')
const DispatchDetails = () => import('@/pages/taskDetailsPage/DispatchDetails')
const AppointDetails = () => import('@/pages/taskDetailsPage/AppointDetails')
const DispatchTaskPhotoSure = () => import('@/pages/sweepCodePage/DispatchTaskPhotoSure')
const DispatchTakePhoto = () => import('@/pages/takePhotoPage/DispatchTakePhoto')
const TaskScheduling = () => import('@/pages/taskSchedulingPage/TaskScheduling')
const SchedulingDispathTaskDetails = () => import('@/pages/taskSchedulingPage/SchedulingDispathTaskDetails')
const SchedulingAppointTaskDetails = () => import('@/pages/taskSchedulingPage/SchedulingAppointTaskDetails')
const CreateDispathTask = () => import('@/pages/taskSchedulingPage/CreateDispathTask')
const CreateAppointTask = () => import('@/pages/taskSchedulingPage/CreateAppointTask')
const EditDispathTask = () => import('@/pages/taskSchedulingPage/EditDispathTask')
const EditAppointTask = () => import('@/pages/taskSchedulingPage/EditAppointTask')
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
    component: Home
  },
  {
    path: '/taskDetailsMessage',
    name: 'taskDetailsMessage',
    component: TaskDetailsMessage
  },
  {
    path: '/dispatchTask',
    name: 'dispatchTask',
    component: DispatchTask
  },
  {
    path: '/circulationTask',
    name: 'circulationTask',
    component: CirculationTask
  },
  {
    path: '/appointTask',
    name: 'appointTask',
    component: AppointTask
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
    path: '/newCirculationTaskCollectMessage',
    name: 'newCirculationTaskCollectMessage',
    component: NewCirculationTaskCollectMessage
  },
  {
    path: '/newCirculationTaskConnectMessage',
    name: 'newCirculationTaskConnectMessage',
    component: NewCirculationTaskConnectMessage
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
    path: '/currentCirculationTaskSampleMessage',
    name: 'currentCirculationTaskSampleMessage',
    component: CurrentCirculationTaskSampleMessage
  },
  {
    path: '/newCirculationTaskHistoryDetails',
    name: 'newCirculationTaskHistoryDetails',
    component: NewCirculationTaskHistoryDetails
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
    path: '/dispatchTaskTransferForm',
    name: 'dispatchTaskTransferForm',
    component: DispatchTaskTransferForm
  },
  {
    path: '/dispatchTaskCancelForm',
    name: 'dispatchTaskCancelForm',
    component: DispatchTaskCancelForm
  },
  {
    path: '/appointTaskForm',
    name: 'appointTaskForm',
    component: AppointTaskForm
  },
  {
    path: '/appointTaskCustomerInfo',
    name: 'appointTaskCustomerInfo',
    component: AppointTaskCustomerInfo
  },
  {
    path: '/dispatchTaskJudge',
    name: 'dispatchTaskJudge',
    component: DispatchTaskJudge
  },
  {
    path: '/padDispatchTaskCancelForm',
    name: 'padDispatchTaskCancelForm',
    component: PadDispatchTaskCancelForm
  },
  {
    path: '/circulationDetails',
    name: 'circulationDetails',
    component: CirculationDetails
  },
  {
    path: '/dispatchDetails',
    name: 'dispatchDetails',
    component: DispatchDetails
  },
  {
    path: '/appointDetails',
    name: 'appointDetails',
    component: AppointDetails
  },
  {
    path: '/dispatchTaskPhotoSure',
    name: 'dispatchTaskPhotoSure',
    component: DispatchTaskPhotoSure
  },
  {
    path: '/dispatchTakePhoto',
    name: 'dispatchTakePhoto',
    component: DispatchTakePhoto
  },
  {
    path: '/taskScheduling',
    name: 'taskScheduling',
    component: TaskScheduling
  },
  {
    path: '/schedulingDispathTaskDetails',
    name: 'schedulingDispathTaskDetails',
    component: SchedulingDispathTaskDetails
  },
  {
    path: '/schedulingAppointTaskDetails',
    name: 'schedulingAppointTaskDetails',
    component: SchedulingAppointTaskDetails
  },
  {
    path: '/createDispathTask',
    name: 'createDispathTask',
    component: CreateDispathTask
  },
  {
    path: '/createAppointTask',
    name: 'createAppointTask',
    component: CreateAppointTask
  },
  {
    path: '/editDispathTask',
    name: 'editDispathTask',
    component: EditDispathTask
  },
  {
    path: '/editAppintTask',
    name: 'editAppintTask',
    component: EditAppointTask
  }
];
let router = new Router({
  routes: baseRoute,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {
        x: 0,
        y: 0
      }
    }
  }
});
// router.beforeEach((to, from, next) => {
//   if (getStore('isLogin')) {
//     if (to.name === 'login') {
//       // 判断登录方式(用户名密码登录或扫码登录)PadDispatchTaskCancelForm
//       if (getStore('userName') && getStore('userPassword')) {
//         next({path: '/home'})
//       } else {
//         next()
//       }
//     } else {
//       next()
//     }
//   } else {
//     next()
//   }
// });
router.beforeEach((to, from, next) => {
  let login = getStore('isLogin');
  let name = to.name;
  if (name === 'login') {
    if (login) {
      next({path: '/home'})
    } else {
      next()
    }
  } else {
    if (login) {
      next()
    } else {
      next({path: '/'})
    }
  }
});
export default router

