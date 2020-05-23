import Vue from "vue";
import Vuex from "vuex";
import app from "./modules/app"
import user from "./modules/user"
import menu from './menu';
import h5_user from './h5_user';

// 使用
Vue.use(Vuex);

//  实例化并配置参数
const store = new Vuex.Store({
    modules: {
        app,
        user,
        menu,
        h5_user
    }
});

export default store;