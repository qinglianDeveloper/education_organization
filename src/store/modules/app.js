import {
    getRouteTitleHandled,
    routeHasExist,
    setTagNavListInLocalstorage,
    getTagNavListFromLocalstorage,
    routeEqual,
    getNextRoute,
    getBreadCrumbList,
    getHomeRoute,
} from '@/libs/util';
import config from '@/config'
const { homeName } = config
import router from '@/router'

const closePage = (state, route) => {
    const nextRoute = getNextRoute(state.tagNavList, route)
    state.tagNavList = state.tagNavList.filter(item => {
        return !routeEqual(item, route)
    })
    router.push(nextRoute)
}

const app = {
    // 存储的数据
    state: {
        tagNavList: [
            {
                meta: {
                    title: '首页',
                },
                path: '',
                name: 'home'
            }
        ],
        breadCrumbList: [],
        homeRoute: {},
    },
    getters: {},
    // 修改存储的数据
    mutations: {
        /**
         * @description: 设置tag标签
         * @param {type} 
         * @return: 
         */
        setTagNavList(state, list) {
            let tagList = []
            let obj = {
                meta: {
                    title: '首页',
                },
                path: '',
                name: 'home'
            }
            if (list) {
                tagList = [...list]
            } else tagList = getTagNavListFromLocalstorage() || []
            if (tagList[0] && tagList[0].name !== homeName) tagList.shift()
            let homeTagIndex = tagList.findIndex(item => item.name === homeName)
            if (homeTagIndex > 0) {
                let homeTag = tagList.splice(homeTagIndex, 1)[0]
                tagList.unshift(homeTag)
            }
            let arr = tagList.filter((item, index) => {
                return item.name == 'home';
            });
            if (arr.length == 0) {
                tagList.unshift(obj);
            }
            state.tagNavList = tagList;

            setTagNavListInLocalstorage([...tagList])
        },
        /**
         * @description: 关闭tag标签
         * @param {type} 
         * @return: 
         */
        closeTag(state, route) {
            let tag = state.tagNavList.filter(item => routeEqual(item, route))
            route = tag[0] ? tag[0] : null
            if (!route) return
            closePage(state, route)
        },

        /**
        * @description: 新增tag标签
        * @param {type} 
        * @return: 
        */
        addTag(state, { route, type = 'unshift' }) {
            // 剔除对象上的get,set属性特性
            let router = getRouteTitleHandled(route)
            if (!routeHasExist(state.tagNavList, router)) {
                if (type === 'push') state.tagNavList.push(router)
                else {
                    if (router.name === homeName) state.tagNavList.unshift(router)
                    else state.tagNavList.splice(1, 0, router)
                }
                setTagNavListInLocalstorage([...state.tagNavList])
            }
        },

        /* ====面包屑==== */
        setBreadCrumb(state, route) {
            // console.log("34456778", route, state.homeRoute)
            state.breadCrumbList = getBreadCrumbList(route, state.homeRoute)
        },
        setHomeRoute(state, routes) {
            state.homeRoute = getHomeRoute(routes, homeName)
            // console.log("033331111", state.homeRoute)
        },
    }
};

export default app;