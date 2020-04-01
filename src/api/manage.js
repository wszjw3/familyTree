import http from '../utils/http'


let URL = ''
if ('true' !== process.env.VUE_APP_USE_MOCK) {
  URL = process.env.VUE_APP_BASE_MANAGE
}


export default {
  //管理员任命
  familyManagePeopleAppointment(params) {
    console.log(params)
    return http.post(URL + '/Backend/familyManagePeopleAppointment', params)
  },
  // 管理员姓名查询
  familyManagePpeopleFind(params) {
    console.log(params)
    return http.post(URL + '/Backend/familyManagePpeopleFind', params)
  },
  // 管理员列表查询
  familyManageListFind(params) {
    console.log(params)
    return http.post(URL + '/Backend/familyManageListFind', params)
  },
  //基础数据查询
  baseSetup(params) {
    console.log(params)
    return http.post(URL + '/Backend/baseSetup', params)
  },
  //基础数据查询
  baseSetupFind() {
    return http.post(URL + '/Backend/baseSetupFind')
  },
  //  百家姓维护
  surnameOpertion(params) {
    return http.post(URL + '/Backend/surnameOpertion', params)
  },
  
  //  百家姓查询
  surnameFind() {
    return http.post(URL + '/Backend/surnameFind')
  },
  // 新增标签
  labelMaintainOperation(params) {
    console.log(params)
    return http.post(URL + '/Backend/labelMaintainOperation', params)
  },
  // 家谱树列表查询
  labelFindOperation(params) {
    console.log(params)
    return http.post(URL + '/Backend/labelFindOperation', params)
  },
  // 家谱树列表查询
  familyTreeFind(params) {
    console.log(params)
    return http.post(URL + '/Backend/familyTreeFind', params)
  },
  // 家谱树信息下拉框查询
  familyTreeDropDownFind(params) {
    console.log(params)
    return http.post(URL + '/Backend/familyTreeDropDownFind', params)
  },
  // 地区联动查询
  familyDistrictFind(params) {
    console.log(params)
    return http.post(URL + '/currency/familyDistrictFind', params)
  },
}
