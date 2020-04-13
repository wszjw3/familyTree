const state = {
  all: [],
  isLoadRoutes: false,
  isLoadLoginRoutes: false
}

// getters
const getters = {
  getMenus: state => state.all,
  isLoadRoutes: state => state.isLoadRoutes,
  isLoadLoginRoutes: state => state.isLoadLoginRoutes
}

// actions
const actions = {
  initMenus({ commit }, menus) {
    commit('INIT_MENU', { menus })
  },

  loadRoutes({ commit }) {
    commit('LOAD_ROUTES')
  },
  loadLoginRoutes({ commit }) {
    commit('LOAD_LOGIN_ROUTES')
  },
  removeRoutes({ commit }) {
    commit('REMOVE_ROUTES')
  }
}

// mutations
const mutations = {
  INIT_MENU(state, { menus }) {
    state.all = menus
  },
  LOAD_ROUTES(state) {
    state.isLoadRoutes = true
  },
  LOAD_LOGIN_ROUTES(state) {
    state.isLoadLoginRoutes = true
  },
  REMOVE_ROUTES() {
    state.all = []
    state.isLoadRoutes = false
    state.isLoadLoginRoutes = false
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
