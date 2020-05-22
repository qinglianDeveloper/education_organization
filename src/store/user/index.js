const user = {
    state: {
        userInfo: {}
    },
    mutations: {
        addUserInfo(state, userInfo) {
            state.userInfo = userInfo;
        }
    }
}
export default user;