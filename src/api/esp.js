import http from '../utils/http'


let URL = ''
if ('true' !== process.env.VUE_APP_USE_MOCK) {
  URL = process.env.VUE_APP_BASE_ESP
}

export default{
  // 代理人列表查询
  getAgentList(params) {
    return http.post(URL + '/agent/list',params)
  },
  // 代理人详情
  getAgentDetail(params) {
    return http.get(URL + '/agent/detail', params)
  },
  // 代理人资料修改
  modifyAgent(params) {
    return http.post(URL + '/agent/modify', params)
  },
  // 承保订单查询
  getaccOrderList(params) {
    return http.get(URL + '/order/accList', params)
  },
  // 收单订单查询
  getacqOrderList(params) {
    return http.get(URL + '/order/normalList', params)
  },
}
