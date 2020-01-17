import Cookies from 'js-cookie'

const state = {
  token: Cookies.get('token')
}

// getters
const getters = {
  getToken: state => state.token
}

// actions
const actions = {
  setToken({ commit }, token) {
    Cookies.set('token', token)
    commit('SET_TOKEN', { token })
  },
  removeToken({ commit }) {
    Cookies.remove('token')
    commit('REMOVE_TOKEN')
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
