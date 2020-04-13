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
  }, {
    name: 'register',
    path: '/register',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import( /* webpackChunkName: "login" */ '@/views/register.vue'),
    meta: {
      requiresAuth: false
    }
  }, {
    name: 'forgetPwd',
    path: '/resetPassWord',
    component: () =>
      import( /* webpackChunkName: "login" */ '@/views/resetPassWord.vue'),
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
      requiresAuth: false,
      resourceCode: ['user']
    }
  },
  {
    name: '搜索页',
    path: '/family/index',
    view: '/family/index',
    component: () =>
      import( /* webpackChunkName: "main" */ '@/views/family/index.vue'),
    meta: {
      requiresAuth: false,
    }
  },
  {
    name: '家谱详情页',
    path: '/family/detail',
    view: '/family/detail',
    component: () =>
      import( /* <webpack></webpack>ChunkName: "main" */ '@/views/family/detail.vue'),
    meta: {
      requiresAuth: false,
    }
  },
  {
    name: '创建家谱',
    path: '/family/create',
    view: '/family/create',
    component: () =>
      import( /* webpackChunkName: "main" */ '@/views/family/create.vue'),
    meta: {
      requiresAuth: false,
    }
  },
  {
    name: '个人资料',
    path: '/user/index',
    view: '/user/index',
    component: () =>
      import( /* webpackChunkName: "main" */ '@/views/user/index.vue'),
    meta: {
      requiresAuth: false,
    }
  },
  {
    name: '基金收入',
    path: '/user/fund',
    view: '/user/fund',
    component: () =>
      import( /* webpackChunkName: "main" */ '@/views/user/fund.vue'),
    meta: {
      requiresAuth: false,
    }
  },
  {
    name: '待办事项',
    path: '/user/task',
    view: '/user/task',
    component: () =>
      import( /* webpackChunkName: "main" */ '@/views/user/task.vue'),
    meta: {
      requiresAuth: false,
    }
  }
  ]
}
