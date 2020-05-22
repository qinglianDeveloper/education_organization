const state = {
    list:[]
}
const getters = {
    getData(state) {
        return state.list;
    }
}

const mutations = {
    setData(state, obj) {
        state.list = obj;
    }
}

const actions = {
    asyncData({ commit }, obj) {
        commit('setData', {
            obj: obj
        })
    }
}

const modelData = {
    namespaced: true,
    state: state,
    getters: getters,
    mutations: mutations,
    actions: actions
}

export default modelData;