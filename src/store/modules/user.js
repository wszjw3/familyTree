
const state = {
  token: {}
}

// getters
const getters = {
  getToken: state => state.token
}

// actions
const actions = {
  setToken({ commit }, token) {
    commit('SET_TOKEN', { token })
  },
  removeToken({ commit }) {
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
