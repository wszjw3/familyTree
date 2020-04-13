import Mock from 'mockjs'

const Users = []

for (let i = 0; i < 86; i++) {
  Users.push(Mock.mock({
    id: Mock.Random.guid(),
    name: Mock.Random.cname(),
    addr: Mock.mock('@county(true)'),
    birth: Mock.Random.date(),
    sex: Mock.Random.integer(0, 1)
  }))
}

export default {
  /**
   * mock bootstrap
   */
  getUserList(config) {
    const {
      page,
      name
    } = config.params
    let mockUsers = Users.filter(user => {
      if (name && user.name.indexOf(name) === -1) return false
      return true
    })
    const total = mockUsers.length
    mockUsers = mockUsers.filter((u, index) => index < 20 * page && index >= 20 * (page - 1))
    console.log(mockUsers)
    return {
      code: 0,
      message: '成功',
      content: {
        total: total,
        users: mockUsers
      }
    }
  }
}
