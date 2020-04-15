import http from '../utils/http'

let URL = ''
if ('true' !== process.env.VUE_APP_USE_MOCK) {
  URL = process.env.VUE_APP_BASE_FAMILY
}
export default {
  familyTreeQuery(params) {
    const str = params.isMyTree ? '/tree/queryMyTree' : '/tree/query'
    let obj = {}
    if (params.tree_user_id) {
      obj.tree_user_id = params.tree_user_id
    }
    if (params.family_id) {
      obj.family_id = params.family_id
    }
    return http.post(URL + str, obj)
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
  },
  // 地区联动查询
  familyDistrictFind(params) {
    return http.post(URL + '/currency/familyDistrictFind', params)
  },
  familyWeChartPayLink(params) {
    return http.post(URL + '/currency/familyWeChartPayLink', params)
  },
  familyWeChartPayFind(params) {
    return http.post(URL + '/currency/familyWeChartPayFind', params)
  },
  findUserMessage(params) {
    return http.post(URL + '/currency/findUserMessage', params)
  },
  baseDataHandle(params) {
    return http.post(URL + '/currency/baseDataHandle', params)
  },
  passwdHandle(params) {
    return http.post(URL + '/currency/passwdHandle', params)
  },
  contactHandle(params) {
    return http.post(URL + '/currency/contactHandle', params)
  },
  familyHomePageFind(params) {
    return http.post(URL + '/currency/familyHomePageFind', params)
  },
  familyManageFind(params) {
    return http.post(URL + '/currency/familyManageFind', params)
  },
  familyTreeStatistics(params) {
    return http.post(URL + '/currency/familyTreeStatistics', params)
  },
  familyFundIncomeFind(params) {
    return http.post(URL + '/currency/familyFundIncomeFind', params)
  },
  familyFundAddIncome(params) {
    return http.post(URL + '/currency/familyFundAddIncome', params)
  },
  checkTaskList(params) {
    return http.post(URL + '/tree/checkTaskList', params)
  },
  auditRefusedTask(params) {
    return http.post(URL + '/tree/auditRefusedTask', params)
  },
  auditPassTask(params) {
    return http.post(URL + '/tree/auditPassTask', params)
  },
  baseBankDataHandle(params) {
    return http.post(URL + '/currency/baseBankDataHandle', params)
  },
  familyManageTransfer(params) {
    return http.post(URL + '/currency/familyManageTransfer', params)
  },
  familyDonateRecordStatistics(params) {
    return http.post(URL + '/currency/familyDonateRecordStatistics', params)
  },
  familyDonateRecordStream(params) {
    return http.post(URL + '/currency/familyDonateRecordStream', params)
  },
  familyDonateRecordRanking(params) {
    return http.post(URL + '/currency/familyDonateRecordRanking', params)
  },
  queryUserTree(params) {
    return http.post(URL + '/tree/queryUserTree', params)
  },
  familyStatisticsFind(params) {
    return http.post(URL + '/currency/familyStatisticsFind', params)
  },
  deleteEducation(params) {
    return http.post(URL + '/tree/deleteEducation', params)
  }
}
