import http from '../utils/http'


let URL = ''
if ('true' !== process.env.VUE_APP_USE_MOCK) {
  URL = process.env.VUE_APP_BASE_FAMILY
}


export default {
  register(params) {
    console.log(params)
    return http.post(URL + '/familyRegister', params)
  },

  login(params) {
    console.log(params)
    return http.post(URL + '/familyLogin', params)
  },

  // 发送验证码
  sendVerifyCode(params) {
    console.log(params)
    return http.post(URL + '/phoneShortInfo', params)
  },
  // 展示图形验证码
  showgraph() {
    return URL + '/createCheckCodeImg?aa=' + Math.random()
  },
  
}
