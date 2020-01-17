import http from '../utils/http'


let URL = ''
if ('true' !== process.env.VUE_APP_USE_MOCK) {
  URL = process.env.VUE_APP_BASE_EPORTAL
}


export default {
  login(params) {
    return http.get(URL + '/user/login', params)
  },

  checkLogin(token) {
    return http.get(URL + '/public/checkToken', {
      token: token
    })
  },
  getMenus() {
    return http.get(URL + '/user/menus')
  },
  // 获取客户信息
  getUserInfo() {
    return http.get(URL + '/user/info')
  },
  // 修改密码
  modifyPass(params) {
    console.log(params)
    return http.post(URL + '/user/modifyPass', params)
  },
  // 获取子账户列表
  getSubUserList(params) {
    console.log(params)
    return http.get(URL + '/subUser/subUserList', params)
  },
  // 获取子账户详情
  querySubUserInfo(params) {
    console.log(params)
    return http.get(URL + '/subUser/querySubUserInfo', params)
  },
  // 新增子账户
  insertSubUser(params) {
    console.log(params)
    return http.post(URL + '/subUser/insertSubUser', params)
  },
  // 修改子账户
  updateSubUser(params) {
    console.log(params)
    return http.post(URL + '/subUser/updateSubUser', params)
  },
  // 修改子账户密码
  updateSubUserPwd(params) {
    console.log(params)
    return http.post(URL + '/subUser/updateSubUserPwd', params)
  },
  // 删除子账户
  delSubUser(params) {
    console.log(params)
    return http.get(URL + '/subUser/delSubUser', params)
  },
  // 获取图形验证码
  getGraph(params) {
    return http.get(URL + '/verify/graph',params)
  },
  // 展示图形验证码
  showgraph(params) {
    return URL + '/verify/showgraph/' + params
  },
  // 发送验证码
  sendVerifyCode(params) {
    console.log(params)
    return http.get(URL + '/verify/sendVerifyCode', params)
  },
  // 重置密码提交
  forgetPwdSubmit(params) {
    console.log(params)
    return http.get(URL + '/verify/checkVerifyCode', params)
  },
  // 验证账号
  checkAccount(params) {
    return http.get(URL + '/verify/checkAccount', params)
  },
  // 查询子角色列表
  getSubRoleList(params) {
    return http.get(URL + '/subRole/querySubRole', params)
  },
  //新增子角色
  addNewSubRole(params) {
    return http.post(URL + '/subRole/saveSubRole', params)
  },
  //修改子角色
  updateSubRole(params) {
    return http.post(URL + '/subRole/updateSubRole', params)
  },
  //删除子角色
  deleteSubRole(params) {
    return http.get(URL + '/subRole/delSubRole', params)
  },
  //子角色详情
  getSubRoleDetail(params) {
    return http.get(URL + '/subRole/getSubRoleInfo', params)
  },
  //资源查询
  getResourceList(params) {
    return http.get(URL + '/resource/queryResource', params)
  },
  updateSubRoleAndResource(params){
    return http.post(URL + '/subRole/updateSubRoleAndResource', params)
  }
}
