import Vue from "vue";
import VueRouter from "vue-router";
import {
    routers
} from "./router";
import { getUserMenu } from "@/api";
Vue.use(VueRouter);

// 请求回来的菜单



/**
 * 重写路由的push方法
 */
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return routerPush.call(this, location).catch(error => error)
}

const router = new VueRouter({
    routes: routers
});

// 匹配方法
let menuState = false;
function mateMenu(arr, name) {
    arr.forEach(item => {
        if (item.name == name) {
            menuState = true;
        }
        if (item.children) {
            mateMenu(item.children, name);
        }
    });
}

/**
 * 路由全局守卫
 */
let arr = [];
let flag = true;

let otherRouter = ["goodsDetails", "goodsAdd", "updateGoods", "goodsTwo", "integralAdd", "integralShow", "workDetails", "addworkList", "workAddTemplate", "serverOrderDetails", "userDetails", "noticeAllocationAddEdit", "userAllocationAddEdit", "clientDetails", "articleAddEdit", "userCenter", "error-502", "home", "update", "channelDirect", "NavigationDuplicated", "orderDetails", "callAddWork", "callDetailsWork", "callDetailsUser", "personInfo", "addApprove", 'detailApprove'];

router.beforeEach(async (to, from, next) => {
    /* 佳信判断-测试版 */
    if (to.name.indexOf('h5') > -1) {
        return next();
    }
    if (to.name == "customerRelevance" || to.name == "callRelevance") {
        return next();
    }
    if (sessionStorage.getItem('userInfo')) {
        // 判断是否已经登录且前往的是登录页
        if (to.name === 'login') {
            return next('/home');
        }
        // 不用校验的页面，放行
        // to.name != 'home' && to.name != 'error-502' && to.name != 'userCenter'
        if (otherRouter.indexOf(to.name) === -1) {
            if (arr.length === 0 && flag) {
                await getUserMenu().then(res => {
                    flag = false;
                    arr = res.result;
                });
            }
            menuState = false;
            // 递归判断是否有权限
            mateMenu(arr, to.name);
            if (menuState) {
                next();
            } else {
                router.replace('/502');
                next();
            }
        } else {
            next();
        }
    }
    // 判断本地是存储是否有用户信息
    if (!sessionStorage.getItem('userInfo')) {
        if (to.name == 'login') {
            next();
        } else {
            next('/login')
        }
    }
    if (to.name == "login") {
        arr = [];
        flag = true
    }
});






// 校验放行页面
router.afterEach((to, from) => {
    //console.log(77777, to, from);
    if (sessionStorage.getItem('userInfo')) {
        // router.push('/login')
        // console.log("test")
        //if (otherRouter.indexOf(to.name) === -1) router.go(-1);
    }
});

export default router;