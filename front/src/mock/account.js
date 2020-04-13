export default {
  // 登录
  login() {
    return {
      code: 0,
      message: '成功',
      content: {
        result: '0',
        resultMessage: '登录成功！',
        appid: 'isc',
        comcode: '003',
        token: 'be261c80ef76448a9ed4d828bf0405c7'
      }
    }
  },
  check() {
    return {
      code: 0,
      message: '成功',
      content: {
        token: 'be261c80ef76448a9ed4d828bf0405c7'
      }
    }
  },
  getMenus() {
    return {
      code: 0,
      message: '成功',
      content: {
        viewCodes:['user','account','role'],
        menusList: [{
            name: '组件示例',
            meta: {
              icon: 'el-icon-message'
            },
            children: [{
                name: '首页',
                path: '/',
                view: '/demo/Hello',
                meta: {
                  requiresAuth: true,
                  resourceCode: ['user']
                }
              },
              {
                name: '列表页面',
                path: '/table',
                view: '/demo/table',
                meta: {
                  requiresAuth: true,
                  resourceCode: ['user']
                }
              },
              {
                name: '表单页面',
                path: '/form',
                view: '/demo/form',
                meta: {
                  requiresAuth: true,
                  resourceCode: ['user']
                }
              },
              {
                name: '步骤页面',
                path: '/step',
                view: '/demo/step',
                meta: {
                  requiresAuth: true,
                  resourceCode: ['user']
                }
              },
              {
                name: '账户页面',
                path: '/card',
                view: '/demo/card',
                meta: {
                  requiresAuth: true,
                  resourceCode: ['user']
                }
              }
            ]
          },
          {
            name: '导航二',
            meta: {
              icon: 'el-icon-menu'
            }
          },
          {
            name: '导航三',
            meta: {
              icon: 'el-icon-setting'
            }
          }
        ]
      }
    }
  }
}