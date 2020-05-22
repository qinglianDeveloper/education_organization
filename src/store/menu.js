import { getUserMenu } from "@/api";
const menu = {
    namespaced: true, //用于在全局引用此文件里的方法时标识这一个的文件名
    state: {
        menuList: [],
        menuBtns: [],
        str: ""
    },
    mutations: {
        setMenuList(state, arr) {
            state.menuList = arr;
        },
        setMenuBtns(state, arr) {
            state.menuBtns = arr;
        }
    },
    getters: {

    },
    actions: {
        getMenuList(context) {
            //获取menu列表
            return getUserMenu().then(res => {
                if (res.code == 200) {
                    let menuList = res.result;
                    // console.log(menuList)
                    // menuList.forEach((item, index) => {
                    //     if (item.name == "home") {
                    //         menuList.splice(index, 1);
                    //     }
                    // });
                    let sortIdFn = function (obj1, obj2) {
                        var val1 = obj1.id;
                        var val2 = obj2.id;
                        if (val1 < val2) {
                            return -1;
                        } else if (val1 > val2) {
                            return 1;
                        } else {
                            return 0;
                        }
                    };
                    menuList.sort(sortIdFn);

                    menuList.forEach((item, index) => {
                        item.children.sort(sortIdFn);
                    });
                    context.commit('setMenuList', menuList);

                    let test = function (arr) {
                        let href = window.location.href;
                        if (href.indexOf('workDetails') !== -1) {
                            href = 'workList'
                        }
                        if (href.indexOf('clientDetails') !== -1) {
                            href = 'clientList'
                        }
                        arr.forEach(item => {
                            if (href.indexOf(item.name) !== -1) {
                                // console.log(item)
                                context.commit('setMenuBtns', item.permTypes);
                            }
                            if (item.children) {
                                test(item.children)
                            }
                        })
                    }
                    test(menuList);
                    window.vm.$watch('$route', function (old, newva) {
                        test(menuList);
                    });
                }
            });
        }
    }
}

export default menu