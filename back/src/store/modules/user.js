
const state = {
  token: {}
}

// getters
const getters = {
  getBackToken: state => state.token || {}
}

// actions
const actions = {
  setBackToken({ commit }, token) {
    commit('SET_TOKEN', { token })
    localStorage.setItem('backToken', JSON.stringify(token))
  },
  removeBackToken({ commit }) {
    commit('REMOVE_TOKEN')
    localStorage.removeItem('backToken')
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
