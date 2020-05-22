const user = {
    state: {
        userInfo: {},
    },
    mutations: {
        ADD_USER_INFO(state, userInfo) {
            sessionStorage.setItem("userInfo", userInfo);
            state.userInfo = userInfo;
        }
    }
}
export default user;