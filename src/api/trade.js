import http from '../utils/http'

export default {
  getBatchList(params) {
    return http.get('/trade/batchList', params)
  },
  getOrderList(params) {
    return http.get('/trade/orderList', params)
  }
}
