import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [{
    name: 'login',
    path: '/login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import( /* webpackChunkName: "login" */ '@/views/login.vue'),
    meta: {
      requiresAuth: false
    }
  }]
})
//非登录路由列表，
export const blankRouter = ['/forgetPwd']


export const demoRouter = {
  name: '组件示例',
  icon: 'el-icon-message',
  children: [{
    name: '首页',
    path: '/',
    view: '/',
    component: () =>
      import( /* webpackChunkName: "main" */ '@/views/index.vue'),
    meta: {
      requiresAuth: false
    }
  },
  {
    name: '修改密码',
    path: '/changepasswd',
    view: '/changepasswd',
    component: () =>
      import( /* webpackChunkName: "main" */ '@/views/changepasswd.vue'),
    meta: {
      requiresAuth: false,
    }
  },
  ]
}
