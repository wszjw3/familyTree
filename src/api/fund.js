import http from '../utils/http'

export default {
  getAccount(params) {
    return http.get('/fund/account', params)
  },

  getRechargeList(params) {
    return http.get('/fund/rechargeList', params)
  },

  getHistoryList(params) {
    return http.get('/fund/historyList', params)
  }
}
