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
      import( /* webpackChunkName: "login" */ '@/views/front/login.vue'),
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
      import( /* webpackChunkName: "login" */ '@/views/front/register.vue'),
    meta: {
      requiresAuth: false
    }
  }, {
    name: 'forgetPwd',
    path: '/resetPassWord',
    component: () =>
      import( /* webpackChunkName: "login" */ '@/views/front/resetPassWord.vue'),
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
      import( /* webpackChunkName: "main" */ '@/views/front/index.vue'),
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
      import( /* webpackChunkName: "main" */ '@/views/front/family/index.vue'),
    meta: {
      requiresAuth: false,
    }
  },
  {
    name: '家谱详情页',
    path: '/family/detail',
    view: '/family/detail',
    component: () =>
      import( /* <webpack></webpack>ChunkName: "main" */ '@/views/front/family/detail.vue'),
    meta: {
      requiresAuth: false,
    }
  },
  {
    name: '创建家谱',
    path: '/family/create',
    view: '/family/create',
    component: () =>
      import( /* webpackChunkName: "main" */ '@/views/front/family/create.vue'),
    meta: {
      requiresAuth: false,
    }
  },
  {
    name: '个人资料',
    path: '/user/index',
    view: '/user/index',
    component: () =>
      import( /* webpackChunkName: "main" */ '@/views/front/user/index.vue'),
    meta: {
      requiresAuth: false,
    }
  },
  {
    name: '基金收入',
    path: '/user/fund',
    view: '/user/fund',
    component: () =>
      import( /* webpackChunkName: "main" */ '@/views/front/user/fund.vue'),
    meta: {
      requiresAuth: false,
    }
  },
  {
    name: '待办事项',
    path: '/user/task',
    view: '/user/task',
    component: () =>
      import( /* webpackChunkName: "main" */ '@/views/front/user/task.vue'),
    meta: {
      requiresAuth: false,
    }
  },
  {
    name: '管理首页',
    path: '/platform/manage',
    view: '/platform/manage',
    component: () =>
      import( /* webpackChunkName: "main" */ '@/views/back/platformManage.vue'),
    meta: {
      requiresAuth: false,
      resourceCode: ['user']
    }
  },
  {
    name: '管理登录',
    path: '/platform/login',
    view: '/platform/login',
    component: () =>
      import( /* webpackChunkName: "main" */ '@/views/back/login.vue'),
    meta: {
      requiresAuth: false,
      resourceCode: ['user']
    }
  }
  ]
}
