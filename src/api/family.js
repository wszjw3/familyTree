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
  familyInfo(params) {
    return http.post(URL + '/tree/queryTree', params)
  },
  familyCreate(params) {
    return http.post(URL + '/tree/add', params)
  },
  familyNodeView(params) {
    return http.post(URL + '/tree/queryLifeHis', params)
  },
  familyAddRecord(params) {
    return http.post(URL + '/tree/addRecord', params)
  },
  familyQueryLabel(params) {
    return http.post(URL + '/tree/queryLabel', params)
  },
  familyQueryUser(params) {
    return http.post(URL + '/tree/queryUser', params)
  },
  familyUpdateUser(params) {
    return http.post(URL + '/tree/update', params)
  },
  familyQueryMother(params) {
    return http.post(URL + '/tree/queryMother', params)
  },
  familyAddUser(params) {
    return http.post(URL + '/tree/insert', params)
  },
  familyQuery(params) {
    return http.post(URL + '/tree/queryEldest', params)
  },
  familyQueryEducation(params) {
    return http.post(URL + '/tree/queryEducation', params)
  },
  familyQueryOptions(params) {
    return http.post(URL + '/Backend/familyTreeDropDownFind', params)
  },
  familyClaim(params) {
    return http.post(URL + '/tree/claim', params)
  }
}
