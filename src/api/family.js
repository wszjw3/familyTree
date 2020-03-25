import http from '../utils/http'


let URL = ''
if ('true' !== process.env.VUE_APP_USE_MOCK) {
  URL = process.env.VUE_APP_BASE_FAMILY
}


export default {


  familyquery(params) {
    console.log(params)
    return http.post(URL + '/tree/query', params)
  },

  resetPasswd(params) {
    console.log(params)
    return http.post(URL + '/currency/resetPasswd', params)
  },

  register(params) {
    console.log(params)
    return http.post(URL + '/currency/familyRegister', params)
  },

  login(params) {
    console.log(params)
    return http.post(URL + '/currency/familyLogin', params)
  },

  // 发送验证码
  sendVerifyCode(params) {
    console.log(params)
    return http.post(URL + '/currency/phoneShortInfo', params)
  },
  // 展示图形验证码
  showgraph() {
    return URL + '/currency/createCheckCodeImg?aa=' + Math.random()
  },
  familyInfo (params) {
    return http.post(URL + '/tree/queryTree', params)
  },
  familyCreate (params) {
    return http.post(URL + '/tree/add', params)
  }
}
