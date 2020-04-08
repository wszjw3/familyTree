
const state = {
  token: {
    user_type: '0'
  }
}

// getters
const getters = {
  getToken: state => state.token || {}
}

// actions
const actions = {
  setToken({ commit }, token) {
    commit('SET_TOKEN', { token })
    localStorage.setItem('token', JSON.stringify(token))
  },
  removeToken({ commit }) {
    commit('REMOVE_TOKEN')
    localStorage.removeItem('token')
  }
}

// mutations
const mutations = {
  SET_TOKEN(state, { token }) {
    state.token = token
  },
  REMOVE_TOKEN(state) {
    state.token = null
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
