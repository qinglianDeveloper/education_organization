// import login from "@/views/Login"
export const routers = [
    //h5路由start
    {
        path: '/h5-login',
        name: 'h5-login',
        component: () =>
            import("@/views/h5/login"),
    },
    {
        path: '/h5-register',
        name: 'h5-register',
        component: () =>
            import("@/views/h5/register"),
    },
    {
        path: '/h5-report',
        name: 'h5-report',
        component: () =>
            import("@/views/h5/report"),
    },
    {
        path: '/h5-organizationApply',
        name: 'h5-organizationApply',
        component: () =>
            import("@/views/h5/organizationApply"),
    },
    {
        path: '/h5-healthyWrite',
        name: 'h5-healthyWrite',
        component: () =>
            import("@/views/h5/healthyWrite"),
    },
    {
        path: '/h5-healthyReport',
        name: 'h5-healthyReport',
        component: () =>
            import("@/views/h5/healthyReport"),
    },
    {
        path: '/h5-monitorDetails',
        name: 'h5-monitorDetails',
        component: () =>
            import("@/views/h5/monitorDetails"),
    },
    {
        path: '/h5-user',
        name: 'h5-user',
        component: () =>
            import("@/views/h5/user"),
    },
    {
        path: '/h5-applyFail/:id',
        name: 'h5-applyFail',
        component: () =>
            import("@/views/h5/applyFail"),
    },
    {
        path: '/h5-applyList',
        name: 'h5-applyList',
        component: () =>
            import("@/views/h5/applyList"),
    },
    {
        path: '/h5-monitorList',
        name: 'h5-monitorList',
        component: () =>
            import("@/views/h5/monitorList"),
    },
    {
        path: '/h5-applyWork',
        name: 'h5-applyWork',
        component: () =>
            import("@/views/h5/applyWork"),
    },
    {
        path: '/h5-applyListTrusteeship',
        name: 'h5-applyListTrusteeship',
        component: () =>
            import("@/views/h5/applyListTrusteeship"),
    },
    //h5路由end




    {
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
                parent: "机构管理",
                parentName: 'trainManger',
                title: '培训机构列表',
            },
            component: () =>
                import("@/views/trainManger/TrainList")
        }, {
            /* 健康日报信息列表 */
            path: "/everyDay",
            name: "everyDay",
            meta: {
                parent: "机构管理",
                parentName: 'person',
                title: '健康信息列表',
            },
            component: () =>
                import("@/views/trainManger/everyDay")
        }, {
            /* 托管机构列表 */
            path: "/EntrustList",
            name: "EntrustList",
            meta: {
                parent: "机构管理",
                parentName: 'trainManger',
                title: '托管机构列表',
            },
            component: () =>
                import("@/views/trainManger/EntrustList")
        }, {
            /* 培训复学申请列表 */
            path: "/goBackList",
            name: "goBackList",
            meta: {
                parent: "复学申请管理",
                parentName: 'goBackApply',
                title: '培训复学申请列表',
            },
            component: () =>
                import("@/views/goBackApply/goBackList")
        }, {
            /* 托管复学申请列表 */
            path: "/EntrustApplyList",
            name: "EntrustApplyList",
            meta: {
                parent: "复学申请管理",
                parentName: 'goBackApply',
                title: '托管复学申请列表',
            },
            component: () =>
                import("@/views/goBackApply/EntrustApplyList")
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
        }, {
            /* 新增培训机构审批 */
            path: "/addApprove",
            name: "addApprove",
            meta: {
                parent: "复学申请管理",
                parentName: 'goBackApply',
                title: '新增培训机构复学审批',
            },
            component: () =>
                import("@/views/goBackApply/addApprove")
        }, {
            /* 新增托管机构审批 */
            path: "/addEntrust",
            name: "addEntrust",
            meta: {
                parent: "复学申请管理",
                parentName: 'goBackApply',
                title: '新增托管机构复学审批',
            },
            component: () =>
                import("@/views/goBackApply/addEntrust")
        }, {
            /* 培训详情审批 */
            path: "/detailApprove",
            name: "detailApprove",
            meta: {
                parent: "复学申请管理",
                parentName: 'goBackApply',
                title: '培训机构复学审批详情',
            },
            component: () =>
                import("@/views/goBackApply/detailApprove")
        }, {
            /* 托管详情审批 */
            path: "/detailEntrust",
            name: "detailEntrust",
            meta: {
                parent: "复学申请管理",
                parentName: 'goBackApply',
                title: '托管机构复学审批详情',
            },
            component: () =>
                import("@/views/goBackApply/detailEntrust")
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