import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import Account from './account'
import User from './user'

export default {
  /**
   * mock bootstrap
   */
  bootstrap() {
    const mock = new MockAdapter(axios)

    mock.onGet('/user/login').reply(200, Account.login())

    mock.onGet('/public/checkToken').reply(200, Account.check())

    mock.onGet('/user/menus').reply(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([200, Account.getMenus()])
        }, 1000)
      })
    })

    mock.onGet('/user/listpage').reply(config => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([200, User.getUserList(config)])
        }, 1000)
      })
    })   

    mock.onAny().passThrough()
  }
  
}