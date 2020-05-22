import Vue from "vue";
import Vuex from "vuex";
import app from "./modules/app"
import user from "./modules/user"
import menu from './menu';

// 使用
Vue.use(Vuex);

//  实例化并配置参数
const store = new Vuex.Store({
    modules: {
        app,
        user,
        menu
    }
});

export default store;