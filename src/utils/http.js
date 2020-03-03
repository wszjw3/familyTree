import axios from 'axios'
import store from '../store'
import { Message, MessageBox } from 'element-ui'

axios.defaults.timeout = 10000
axios.defaults.baseURL = process.env.VUE_APP_API_ROOT
axios.defaults.headers.post['Content-Type'] = 'application/json charset=UTF-8'

// request拦截器
// axios.interceptors.request.use(
//   config => {
//     if (store.getters.getToken) {
//       config.headers['token'] = store.getters.getToken
//     }
//     return config
//   },
//   error => {
//     return Promise.reject(error)
//   }
// )

// respone拦截器  //拦截响应response，并做一些错误处理
axios.interceptors.response.use(

  response => {
    //console.log('response' + JSON.stringify(response))
    // 通用逻辑，请求出错，全屏弹层提示
    const data = response.data
    return data
  },
  error => {
    if(error.message.indexOf('timeout') != -1){
      error.message = '本次操作请求超时，请重新操作'
    }
    MessageBox.alert( error.message, '', {
      confirmButtonText: '确定',
    })
    //Message({ showClose: true, message: error.message + 'ww', type: 'error', duration: 0 })
    return Promise.reject(error)
  }
)

export default {
  get(url, params = {}) {
    params['t_'+new Date().getTime()]=Math.random()
    return axios.get(url, {
      params: params
    })
  },
  post(url, data = {}) {
    return axios.post(url, data)
  }
}
