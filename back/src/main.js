import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import NProgress from 'nprogress'
import 'babel-polyfill'

import './assets/icon/iconfont.css'
import 'element-ui/lib/theme-chalk/index.css'
import 'nprogress/nprogress.css'
import Mock from './mock'

import {
  // asynRouter,
  demoRouter
} from './router'
Vue.use(ElementUI)

NProgress.configure({
  showSpinner: false
})
Vue.prototype.$np = NProgress
console.log('mock' + process.env.VUE_APP_USE_MOCK)
if ('true' === process.env.VUE_APP_USE_MOCK) {
  Mock.bootstrap()
}

// import Account from './api/account'
if (!store.getters.isLoadRoutes) initRouterAndMenuBefore()
router.beforeEach((to, from, next) => {
  NProgress.start()
  console.log(from)
  console.log(to)
  // store.dispatch('initMenus', [].push(demoRouter))
  // if (store.getters.getBackToken) {

  //   if (to.path === '/login' || to.path === '/forgetPwd' ||
  //     blankRouter.filter(item => to.path.indexOf(item) > -1).length > 0) {
  //     next('/')
  //     NProgress.done()
  //   } else {
  //     Account.checkLogin(store.getters.getBackToken).then(res => {
  //       if (res.token) {
  //         // 初始化菜单
  //         if (!store.getters.loadLoginRoutes) initRouterAndMenu()
  //         next()
  //       } else {
  //         //token失效，清除toke n，跳转登录页面
  //         store.dispatch('removeBackToken')
  //         next('/login')
  //         NProgress.done()
  //       }
  //     })
  //   }
  // } else {
    if (!store.getters.isLoadRoutes)  initRouterAndMenuBefore()
    if (to.matched.length == 0 || to.meta.requiresAuth ) {
      next('/login')
      NProgress.done()
    } else {
      next()
    }
  // }
})

router.afterEach(() => {
  NProgress.done()
})

Vue.config.productionTip = false

console.log(process.env.VUE_APP_API_ROOT)

function initRouterAndMenuBefore() {
  console.log('initRouterAndMenuBefore')
  const demoMenus = []
  demoMenus.push(demoRouter)
  store.dispatch('initMenus', demoMenus)
  const homeRouter = [{
    path: '/',
    component: () => import( /* webpackChunkName: "layout" */ '@/components/layout/layout.vue'),
    children:  demoRouter.children
  }]
  console.log(homeRouter)
  router.addRoutes(homeRouter)
  store.dispatch('loadRoutes')
}

// function initRouterAndMenu() {
//   console.log(asynRouter)
//   console.log('initRouterAndMenu')
//   Account.getMenus().then(res => {
//     if (res.menusList && res.viewCodes) {
//       res.menusList.push(demoRouter) //添加demo菜单正式上线请删除相关代码
//       store.dispatch('initMenus', res.menusList)
//       const homeRouter = [{
//         path: '/',
//         component: () => import( /* webpackChunkName: "layout" */ '@/components/layout/layout.vue'),
//         children: menuToRoutes(res.viewCodes, demoRouter.children.concat(asynRouter))
//       }]
//       console.log(homeRouter)
//       router.addRoutes(homeRouter)
//       router.addRoutes([{
//         path: '*',
//         component: () => import( /* webpackChunkName: "404" */ '@/views/404.vue')
//       }])
//       store.dispatch('loadLoginRoutes')
//     }
//   })
// }

// function menuToRoutes(codes = [], menus = [], routes = []) {
//   //添加子路由
//   for (let i = 0; i < menus.length; i++) {
//     const item = menus[i]
//     let flag = false
//     if (item.meta.resourceCode) {
//       let resourceCode = item.meta.resourceCode
//       if (codes.filter(item => resourceCode.indexOf(item) > -1).length > 0) {
//         flag = true
//       }
//     }
//     if (flag) {
//       //if (item.view) item.component = () => import( /* webpackChunkName: "main" */ '@/views' + item.view + '.vue')
//       if (item.path && item.component) routes.push(item)
//       menuToRoutes(codes, item.children, routes)
//     }
//   }
//   return routes
// }

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')