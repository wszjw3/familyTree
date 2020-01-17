import http from '../utils/http'

export default {
  getApplyList(params) {
    return http.get('/invoice/applyList', params)
  }
}
