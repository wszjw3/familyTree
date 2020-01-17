import http from '../utils/http'

export default {
  getUserList(params) {
    return http.get('/user/listpage', params)
  }
}
