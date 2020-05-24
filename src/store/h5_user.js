import { getUserMenu } from "@/api";
//
const h5_user = {
    state: {
        h5_userInfo: {},
    },
    mutations: {
        h5_saveUserInfo(state, userInfo) {
            console.log('userInfo: ', userInfo);
            if(!userInfo)return;
            //this.$store.commit("h5_saveUserInfo", userInfo);
            //this.$store.state.h5_user.h5_userInfo;
            localStorage.setItem('h5_userInfo',JSON.stringify(userInfo));
            state.h5_userInfo = userInfo;
        }
    },
    actions: {
        getMenuList(context) {
            //this.$store.dispatch('action方法名',值);
            //获取menu列表
            return getUserMenu().then(res => {
                context.commit('h5_saveUserInfo', menuList);
            });
        }
    }
}
export default h5_user;