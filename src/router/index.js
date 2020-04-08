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
  },
{
  name: '家谱demo',
  path: '/familytree',
  view: '/demo/tree',
  component: () =>
    import( /* webpackChunkName: "main" */ '@/views/demo/tree.vue'),
  meta: {
    requiresAuth: false,
    resourceCode: ['user']
  }
}, {
  name: '平台管理',
  path: '/familymanage',
  view: '/demo/platformManage',
  component: () =>
    import( /* webpackChunkName: "main" */ '@/views/demo/platformManage.vue'),
  meta: {
    requiresAuth: false,
    resourceCode: ['user']
  }
}]
})
//非登录路由列表，
export const blankRouter = ['/forgetPwd']
export const asynRouter = [{
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
    name: '代理人管理',
    path: '/agent/agent',
    view: '/agent/agent',
    component: () =>
      import( /* webpackChunkName: "main" */ '@/views/agent/agent.vue'),
    meta: {
      requiresAuth: true,
      resourceCode: ['agent']
    }
  },
  {
    name: '承保数据查询',
    path: '/order/accOrder',
    view: '/order/accOrder',
    component: () =>
      import( /* webpackChunkName: "main" */ '@/views/order/accOrder.vue'),
    meta: {
      requiresAuth: true,
      resourceCode: ['order']
    }
  },
  {
    name: '收单数据查询',
    path: '/order/acqOrder',
    view: '/order/acqOrder',
    component: () =>
      import( /* webpackChunkName: "main" */ '@/views/order/acqOrder.vue'),
    meta: {
      requiresAuth: true,
      resourceCode: ['order']
    }
  },
  {
    name: '密码修改',
    path: '/account/inireset',
    view: '/account/resetPassWord',
    component: () =>
      import( /* webpackChunkName: "main" */ '@/views/account/resetPassWord.vue'),
    meta: {
      requiresAuth: true,
      resourceCode: ['user']
    }
  },{
    name: '子账户维护',
    path: '/account/subAccount',
    view: '/account/subAccount',
    component: () =>
      import( /* webpackChunkName: "main" */ '@/views/account/subAccount.vue'),
    meta: {
      requiresAuth: true,
      resourceCode: ['user']
    }
  },{
    name: '子角色维护',
    path: '/account/subRole',
    view: '/account/childRoleMatain',
    component: () =>
      import( /* webpackChunkName: "main" */ '@/views/account/childRoleMatain.vue'),
    meta: {
      requiresAuth: true,
      resourceCode: ['role']
    }
  }, {
    name: '查看账户信息',
    path: '/account/accountInfo',
    view: '/account/accountInfo',
    component: () =>
      import( /* webpackChunkName: "main" */ '@/views/account/accountInfo.vue'),
    meta: {
      requiresAuth: true,
      resourceCode: ['user']
    }
  },{
    name: '404',
    path: '*',
    component: () =>
      import( /* webpackChunkName: "main" */ '@/views/404.vue'),
    meta: {
      requiresAuth: true,
      resourceCode: ['user']
    }
  }

]


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
      name: '列表页面',
      path: '/table',
      view: '/demo/table',
      component: () =>
        import( /* webpackChunkName: "main" */ '@/views/demo/table.vue'),
      meta: {
        requiresAuth: false,
        resourceCode: ['user']
      }
    },
    {
      name: '表单页面',
      path: '/form',
      view: '/demo/form',
      component: () =>
        import( /* webpackChunkName: "main" */ '@/views/demo/form.vue'),
      meta: {
        requiresAuth: false,
        resourceCode: ['user']
      }
    },
    {
      name: '步骤页面',
      path: '/step',
      view: '/demo/step',
      component: () =>
        import( /* webpackChunkName: "main" */ '@/views/demo/step.vue'),
      meta: {
        requiresAuth: false,
        resourceCode: ['user']
      }
    },
    {
      name: '账户页面',
      path: '/card',
      view: '/demo/card',
      component: () =>
        import( /* webpackChunkName: "main" */ '@/views/demo/card.vue'),
      meta: {
        requiresAuth: true,
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
      name: '个人信息',
      path: '/account/accountInfo',
      view: '/account/accountInfo',
      component: () =>
        import( /* webpackChunkName: "main" */ '@/views/account/accountInfo.vue'),
      meta: {
        requiresAuth: false,
        resourceCode: ['user']
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
    },
    
    {
      name: '家谱demo',
      path: '/tree',
      view: '/demo/tree',
      component: () =>
        import( /* webpackChunkName: "main" */ '@/views/demo/tree.vue'),
      meta: {
        requiresAuth: false,
        resourceCode: ['user']
      }
    },
    {
      name: '平台管理',
      path: '/manage',
      view: '/demo/platformManage',
      component: () =>
        import( /* webpackChunkName: "main" */ '@/views/demo/platformManage.vue'),
      meta: {
        requiresAuth: false,
        resourceCode: ['user']
      }
    }
  ]
}
