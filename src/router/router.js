// import login from "@/views/Login"
export const routers = [{
    path: '/login',
    name: 'login',
    component: () =>
        import("@/views/Login"),
},
{
    path: '/main',
    name: 'main',
    component: () =>
        import("@/views/Main"),
    redirect: "/home",
    children: [{
        path: "/home",
        name: "home",
        meta: {
            title: '首页',
            icon: 'md-home'
        },
        component: () =>
            import("@/views/home/index")
    },
    {
        /* 组织架构 */
        path: "/organiZation",
        name: "organiZation",
        meta: {
            parent: "系统设置",
            parentName: 'sysSettings',
            title: '组织架构',
        },
        component: () =>
            import("@/views/sysSetting/organiZation")
    }, {
        /* 菜单管理 */
        path: "/menuManage",
        name: "menuManage",
        meta: {
            parent: "系统设置",
            parentName: 'sysSettings',
            title: '菜单管理',
        },
        component: () =>
            import("@/views/sysSetting/menuManage")
    }, {
        /* 角色权限管理 */
        path: "/roleManage",
        name: "roleManage",
        meta: {
            parent: "系统设置",
            parentName: 'sysSettings',
            title: '角色权限管理',
        },
        component: () =>
            import("@/views/sysSetting/roleManage")
    }, {
        /* 定时任务 */
        path: "/timeTask",
        name: "timeTask",
        meta: {
            parent: "系统设置",
            parentName: 'sysSettings',
            title: '定时任务',
        },
        component: () =>
            import("@/views/sysSetting/timeTask")
    }, {
        /* 日志管理 */
        path: "/logManage",
        name: "logManage",
        meta: {
            parent: "系统设置",
            parentName: 'sysSettings',
            title: '日志管理',

        },
        component: () =>
            import("@/views/sysSetting/logManage")
    },
    {
        /* 用户管理列表 */
        path: "/userList",
        name: "userList",
        meta: {
            parent: "用户管理",
            parentName: 'userManger',
            title: '用户管理列表',
        },
        component: () =>
            import("@/views/userManger/userList")
    }, {
        /* 账号管理 */
        path: '/AccountList',
        name: 'AccountList',
        meta: {
            parent: "用户管理",
            parentName: 'userManger',
            title: '账号管理',
        },
        component: () =>
            import('@/views/Account/index')
    }, {
        /* 用户管理-详情 */
        path: "/userDetails",
        name: "userDetails",
        meta: {
            parent: "用户管理",
            parentName: 'userManger',
            title: '用户详情',
        },
        component: () =>
            import("@/views/userManger/userDetails")
    }, {
        /* 客户列表 */
        path: "/clientList",
        name: "clientList",
        meta: {
            parent: "客户管理",
            parentName: 'customerManger',
            title: '客户列表',
        },
        component: () =>
            import("@/views/customerManger/clientList")
    }, {
        /* 客户详情 */
        path: "/clientDetails",
        name: "clientDetails",
        meta: {
            parent: "客户管理",
            parentName: 'customerManger',
            title: '客户详情',
        },
        component: () =>
            import("@/views/customerManger/clientDetails")
    }, {
        /* 客户查询 */
        path: "/customerQuery",
        name: "customerQuery",
        meta: {
            parent: "客户管理",
            parentName: 'customerManger',
            title: '客户查询',
        },
        component: () =>
            import("@/views/customerManger/customerQuery")
    }, {
        /* 个人中心 */
        path: "/userCenter",
        name: "userCenter",
        meta: {
            title: '个人中心',
        },
        component: () =>
            import("@/views/others/userCenter")
    }, {
        /* 培训机构列表 */
        path: "/TrainList",
        name: "TrainList",
        meta: {
            parent: "培训机构管理",
            parentName: 'trainManger',
            title: '培训机构列表',
        },
        component: () =>
            import("@/views/trainManger/TrainList")
    }, {
        /* 复学申请列表 */
        path: "/goBackList",
        name: "goBackList",
        meta: {
            parent: "复学申请管理",
            parentName: 'goBackApply',
            title: '复学申请列表',
        },
        component: () =>
            import("@/views/goBackApply/goBackList")
    }, {
        /* 学生&教师 */
        path: "/personInfo",
        name: "personInfo",
        meta: {
            parent: "学生教师",
            parentName: 'person',
            title: '学生教师信息列表',
        },
        component: () =>
            import("@/views/person/personInfo")
    },
    ]
},
{
    path: "/502",
    meta: {
        title: "502-权限不足"
    },
    name: "error-502",
    component: () => import("@/views/error-page/403.vue")
},
{
    path: "/",
    redirect: "/home" //重定向<首页>
}
]