
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
    sessionStorage.setItem('token', JSON.stringify(token))
  },
  removeToken({ commit }) {
    commit('REMOVE_TOKEN')
    sessionStorage.removeItem('token')
  },
  createSuccess({ commit }) {
    commit('CREATE_SUCCESS')
  }
}

// mutations
const mutations = {
  SET_TOKEN(state, { token }) {
    state.token = token
  },
  REMOVE_TOKEN(state) {
    state.token = null
  },
  CREATE_SUCCESS(state) {
    state.token.user_type = '3'
    sessionStorage.setItem('token', JSON.stringify(state.token))
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
