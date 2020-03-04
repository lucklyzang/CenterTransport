import Vue from 'vue'
import Router from 'vue-router'
import {setStore, getStore} from '@/common/js/utils.js'
import store from '@/store'
const Home = () => import('../pages/Home')
const Login = () => import('../pages/Login')
const DispatchTask = () => import('../pages/taskPage/DispatchTask')
const CirculationTask = () => import('../pages/taskPage/CirculationTask')
const AppointTask = () => import('../pages/taskPage/AppointTask')
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
  },
  {
    path: '/dispatchTask',
    name: 'dispatchTask',
    component: DispatchTask,
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
  }
];
let router = new Router({
  routes: baseRoute
});
// router.beforeEach((to, from, next) => {
//   if (getStore('isLogin')) {
//     if (to.name === 'login') {
//       // 判断登录方式(用户名密码登录或扫码登录)
//       if (getStore('loginSweepCode') == 'false') {
//         if (getStore('userName') && getStore('userPassword')) {
//           next({path: '/home'})
//         } else {
//           next()
//         }
//       } else {
//         if (getStore('userName')) {
//           next({path: '/home'})
//         } else {
//           next()
//         }
//       }
//     } else {
//       next()
//     }
//   } else {
//     if (!store.getters.routerFlag) { // 禁用路由返回，保存到vuex内的
//       next(false)
//       return
//     } else {
//       next()
//     }
//   }
// });
export default router

