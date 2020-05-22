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
    }, {
        /* 商品列表 */
        path: "/goodsList",
        name: "goodsList",
        meta: {
            parent: "商品管理",
            parentName: 'goodsManger',
            title: '商品列表',
        },
        component: () =>
            import("@/views/goodsManger/goodsList")
    }, {
        /* 商品详情 */
        path: "/goodsDetails",
        name: "goodsDetails",
        meta: {
            parent: "商品管理",
            parentName: 'goodsManger',
            title: '商品详情',
        },
        component: () =>
            import("@/views/goodsManger/goodsDetails")
    }, {
        /* 商品分类 */
        path: "/goodsClassify",
        name: "goodsClassify",
        meta: {
            parent: "商品管理",
            parentName: 'goodsManger',
            title: '商品分类',
        },
        component: () =>
            import("@/views/goodsManger/goodsClassify")
    }, {
        /* 新增商品 */
        path: "/goodsAdd",
        name: "goodsAdd",
        meta: {
            parent: "商品管理",
            parentName: 'goodsManger',
            title: '新增商品',
        },
        component: () =>
            import("@/views/goodsManger/goodsAdd")
    }, {
        /* 编辑商品 */
        path: "/updateGoods",
        name: "updateGoods",
        meta: {
            parent: "商品管理",
            parentName: 'goodsManger',
            title: '编辑商品',
        },
        component: () =>
            import("@/views/goodsManger/updateGoods")
    }, {
        /* 二级商品分类 */
        path: "/goodsTwo",
        name: "goodsTwo",
        meta: {
            parent: "商品管理",
            parentName: 'goodsManger',
            title: '二级商品分类',
        },
        component: () => import("@/views/goodsManger/goodsTwo")
    }, {
        /* 积分商品管理 */
        path: "/integralGoods",
        name: "integralGoods",
        meta: {
            parent: "商品管理",
            parentName: 'goodsManger',
            title: '积分商品管理',
        },
        component: () => import("@/views/goodsManger/integralGoods")
    }, {
        /* 新增积分商品 */
        path: "/integralAdd",
        name: "integralAdd",
        meta: {
            parent: "商品管理",
            parentName: 'goodsManger',
            title: '新增积分商品',
        },
        component: () => import("@/views/goodsManger/integralAdd")
    },
    {
        /* 查看积分商品详情 */
        path: "/integralShow",
        name: "integralShow",
        meta: {
            parent: "商品管理",
            parentName: 'goodsManger',
            title: '积分商品详情',
        },
        component: () => import("@/views/goodsManger/integralShow")
    },
    {
        /* 工单列表 */
        path: "/workList",
        name: "workList",
        meta: {
            parent: "工单管理",
            parentName: 'workOrder',
            title: '工单列表',
        },
        component: () =>
            import("@/views/workOrder/workList"),
    },
    /* 工单详情 */
    {
        path: "/workDetails",
        name: "workDetails",
        meta: {
            parent: "工单管理",
            parentName: 'workOrder',
            title: '工单详情',
        },
        component: () =>
            import("@/views/workOrder/workDetails"),
    }, {
        /* 新建工单 */
        path: "/addworkList",
        name: "addworkList",
        meta: {
            parent: "工单管理",
            parentName: 'workOrder',
            title: '新建工单',
        },
        component: () =>
            import("@/views/workOrder/addworklist")
    }, {
        /* 工单类型设置 */
        path: "/workType",
        name: "workType",
        meta: {
            parent: "工单管理",
            parentName: 'workOrder',
            title: '工单类型设置',
        },
        component: () =>
            import("@/views/workOrder/workType")
    }, {
        /* 分组设置 */
        path: "/workGroup",
        name: "workGroup",
        meta: {
            parent: "工单管理",
            parentName: 'workOrder',
            title: '工单分组设置',
        },
        component: () =>
            import("@/views/workOrder/workGroup")
    }, {
        /* 工单自定义字段设置 */
        path: "/workField",
        name: "workField",
        meta: {
            parent: "工单管理",
            parentName: 'workOrder',
            title: '工单自定义字段',
        },
        component: () =>
            import("@/views/workOrder/workField")
    }, {
        /* 工单自定义模板设置 */
        path: "/workTemplate",
        name: "workTemplate",
        meta: {
            parent: "工单管理",
            parentName: 'workOrder',
            title: '工单自定义模板',
        },
        component: () =>
            import("@/views/workOrder/workTemplate")
    }, {
        /* 工单自定义模板新增 */
        path: "/workAddTemplate",
        name: "workAddTemplate",
        meta: {
            parent: "工单管理",
            parentName: 'workOrder',
            title: '新增工单自定义模板',
        },
        component: () =>
            import("@/views/workOrder/workAddTemplate")
    }, {
        /* 系统上云订单 */
        path: "/systemOrder",
        name: "systemOrder",
        meta: {
            parent: "订单管理",
            parentName: 'orderManger',
            title: '系统上云订单',
        },
        component: () =>
            import("@/views/orderManage/systemOrder")
    }, {
        /* 标准化服务订单 */
        path: "/serverOrder",
        name: "serverOrder",
        meta: {
            parent: "订单管理",
            parentName: 'orderManger',
            title: '标准化服务订单',
        },
        component: () =>
            import("@/views/orderManage/serverOrder")
    }, {
        /* 标准化服务订单详情 */
        path: "/serverOrderDetails",
        name: "serverOrderDetails",
        meta: {
            parent: "订单管理",
            parentName: 'orderManger',
            title: '订单详情',
        },
        component: () =>
            import("@/views/orderManage/serverOrderDetails")
    }, {
        /* 非标准化服务订单 */
        path: "/offstandardOrder",
        name: "offstandardOrder",
        meta: {
            parent: "订单管理",
            parentName: 'orderManger',
            title: '非标准化服务订单',
        },
        component: () =>
            import("@/views/orderManage/offstandardOrder")
    }, {
        /* 积分兑换记录 */
        path: "/integralLog",
        name: "integralLog",
        meta: {
            parent: "订单管理",
            parentName: 'orderManger',
            title: '积分兑换记录',
        },
        component: () =>
            import("@/views/orderManage/integralLog")
    }, {
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
        /* 区域渠道管理 */
        path: "/channelRegionManger",
        name: "channelRegionManger",
        meta: {
            parent: "渠道管理",
            parentName: 'channelManger',
            title: '区域渠道管理',
        },
        component: () =>
            import("@/views/channelManger/channelRegionManger/index")
    }, {
        /* 销售渠道管理 */
        path: "/channelUserManger",
        name: "channelUserManger",
        meta: {
            parent: "渠道管理",
            parentName: 'channelManger',
            title: '用户代理管理',
        },
        component: () =>
            import("@/views/channelManger/channelUserManger/index")
    }, {
        /* 直销代理列表 */
        path: "/channelDirect",
        name: "channelDirect",
        meta: {
            parent: "渠道管理",
            parentName: 'channelManger',
            title: '直销代理列表',
        },
        component: () =>
            import("@/views/channelManger/channelDirect/index")
    }, {
        /* 代理商审核 */
        path: "/channelCheck",
        name: "channelCheck",
        meta: {
            parent: "渠道管理",
            parentName: 'channelManger',
            title: '代理商审核',
        },
        component: () =>
            import("@/views/channelManger/channelCheck/index")
    }, {
        /* 直销/用户代理列表 */
        path: "/directSumList",
        name: "directSumList",
        meta: {
            parent: "渠道管理",
            parentName: 'channelManger',
            title: '直销/用户代理列表',
        },
        component: () =>
            import("@/views/channelManger/directSumList/index")
    }, {
        /* 工程师管理 */
        path: "/engineer",
        name: "engineer",
        meta: {
            parent: "员工管理",
            parentName: 'staffManger',
            title: '工程师管理',
        },
        component: () =>
            import("@/views/staffManger/engineer")
    }, {
        /* 销售管理 */
        path: "/market",
        name: "market",
        meta: {
            parent: "员工管理",
            parentName: 'staffManger',
            title: '销售管理',
        },
        component: () =>
            import("@/views/staffManger/market")
    }, {
        /* 客服管理 */
        path: "/service",
        name: "service",
        meta: {
            parent: "员工管理",
            parentName: 'staffManger',
            title: '客服管理',
        },
        component: () =>
            import("@/views/staffManger/service")
    }, {
        /* 轮播图配置 */
        path: "/carouselAllocation",
        name: "carouselAllocation",
        meta: {
            parent: "内容管理",
            parentName: 'contentManger',
            title: '轮播图配置',
        },
        component: () =>
            import("@/views/contentManger/carouselAllocation")
    }, {
        /* 合作商配置 */
        path: "/cooperationAllocation",
        name: "cooperationAllocation",
        meta: {
            parent: "内容管理",
            parentName: 'contentManger',
            title: '合作商配置',
        },
        component: () =>
            import("@/views/contentManger/cooperationAllocation")
    }, {
        /* 公告栏编辑与添加 */
        path: "/noticeAllocationAddEdit",
        name: "noticeAllocationAddEdit",
        meta: {
            parent: "内容管理",
            parentName: 'contentManger',
            title: '公告栏编辑',
        },
        component: () =>
            import("@/views/contentManger/noticeAllocationAddEdit")
    }, {
        /* 公告栏配置 */
        path: "/noticeAllocation",
        name: "noticeAllocation",
        meta: {
            parent: "内容管理",
            parentName: 'contentManger',
            title: '公告栏配置',
        },
        component: () =>
            import("@/views/contentManger/noticeAllocation")
    }, {
        /* 用户协议配置 */
        path: "/userAllocation",
        name: "userAllocation",
        meta: {
            parent: "内容管理",
            parentName: 'contentManger',
            title: '用户协议配置',
        },
        component: () =>
            import("@/views/contentManger/userAllocation")
    }, {
        /* 用户协议--添加--编辑 */
        path: "/userAllocationAddEdit",
        name: "userAllocationAddEdit",
        meta: {
            parent: "内容管理",
            parentName: 'contentManger',
            title: '用户协议编辑',
        },
        component: () =>
            import("@/views/contentManger/userAllocationAddEdit")
    }, {
        /* 公司信息维护 */
        path: "/companyInfo",
        name: "companyInfo",
        meta: {
            parent: "内容管理",
            parentName: 'contentManger',
            title: '公司信息维护',
        },
        component: () =>
            import("@/views/contentManger/companyInfo")
    }, {
        /* 发票管理 */
        path: "/invoiceManger",
        name: "invoiceManger",
        meta: {
            parent: "费用管理中心",
            parentName: 'financeManger',
            title: '发票管理',
        },
        component: () =>
            import("@/views/financeManger/invoiceManger")
    }, {
        /* 提现管理 */
        path: "/withdrawalManger",
        name: "withdrawalManger",
        meta: {
            parent: "费用管理中心",
            parentName: 'financeManger',
            title: '提现管理',
        },
        component: () =>
            import("@/views/financeManger/withdrawalManger")
    }, {
        /* 对公打款审核 */
        path: "/remittance",
        name: "remittance",
        meta: {
            parent: "费用管理中心",
            parentName: 'financeManger',
            title: '对公打款审核',
        },
        component: () =>
            import("@/views/financeManger/remittance")
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
        /* 文章列表 */
        path: "/articleList",
        name: "articleList",
        meta: {
            parent: "帮助中心",
            parentName: 'helpCenter',
            title: '文章列表',
        },
        component: () =>
            import("@/views/helpCenter/articleList")
    }, {
        /* 新增文章 */
        path: "/articleAddEdit/:type/:id",
        name: "articleAddEdit",
        meta: {
            parent: "帮助中心",
            parentName: 'helpCenter',
            title: '新增文章',
        },
        component: () =>
            import("@/views/helpCenter/articleAddEdit")
    }, {
        /* 文章分类 */
        path: "/articleType",
        name: "articleType",
        meta: {
            parent: "帮助中心",
            parentName: 'helpCenter',
            title: '文章分类',
        },
        component: () =>
            import("@/views/helpCenter/articleType")
    }, {
        /* 在线客服 */
        path: "/customerHome",
        name: "customerHome",
        meta: {
            parent: "在线客服",
            parentName: 'serverCenter',
            title: '在线客服',
        },
        component: () =>
            import("@/views/customerService/customerHome")
    }, {
        /* 呼叫中心 */
        path: "/callHome",
        name: "callHome",
        meta: {
            parent: "在线客服",
            parentName: 'callCenter',
        },
        component: () =>
            import("@/views/callCenter/callHome")
    }, {
        /* 个人中心 */
        path: "/userCenter",
        name: "userCenter",
        meta: {
            title: '个人中心',
        },
        component: () =>
            import("@/views/others/userCenter")
    },
    {
        // 数据上传
        path: '/update',
        name: 'update',
        meta: {
            parent: "数据上传",
            parentName: 'DataToBed',
            title: '数据上传',
        },
        component: () => import('@/views/updateManger')
    },
    {
        // 返佣数据明细-订单明细
        path: '/OrderDetailsReabte',
        name: 'OrderDetailsReabte',
        meta: {
            parent: "返佣数据明细",
            parentName: 'RebateDate',
            title: '订单明细',
        },
        component: () => import('@/views/RebateDate/OrderDetailsReabte')
    },
    {
        // 返佣数据明细-返佣明细
        path: '/RebateDetails',
        name: 'RebateDetails',
        meta: {
            parent: "返佣数据明细",
            parentName: 'RebateDate',
            title: '返佣明细',
        },
        component: () => import('@/views/RebateDate/RebateDetails')
    },
    {
        // 返佣数据明细-返佣明细
        path: '/RebateFile',
        name: 'RebateFile',
        meta: {
            parent: "返佣数据明细",
            parentName: 'RebateDate',
            title: '返佣明细',
        },
        component: () => import('@/views/RebateDate/RebateFile')
    },
    {
        // 评价管理
        path: '/AssManger',
        name: 'AssManger',
        meta: {
            parent: "评价中心",
            parentName: 'Assessment',
            title: '评价管理'
        },
        component: () => import('@/views/Assessment/AssManger')
    },
    {
        // 
        path: '/SalesPerformanceManger',
        name: 'SalesPerformanceManger',
        meta: {
            parent: "销售业绩管理",
            parentName: 'SalesPerformance',
            title: '销售业绩管理列表'
        },
        component: () => import('@/views/SalesPerformance/SalesPerformanceManger/index')
    },
    ]
},
{
    /* 关联呼叫中心 */
    path: "/callRelevance",
    name: "callRelevance",
    component: () =>
        import("@/views/callCenter/callRelevance")
},
{
    /* 关联在线客服 */
    path: "/customerRelevance",
    name: "customerRelevance",
    component: () =>
        import("@/views/customerService/customerRelevance")
},
{
    /* 呼叫中心详情 */
    path: "/orderDetails",
    name: "orderDetails",
    component: () =>
        import("@/views/callCenter/orderDetails")
},
{
    /* 呼叫中心-新建工单 */
    path: "/callAddWork",
    name: "callAddWork",
    component: () =>
        import("@/views/callCenter/addworklist")
},
{
    /* 呼叫中心-工单详情 */
    path: "/callDetailsWork",
    name: "callDetailsWork",
    component: () =>
        import("@/views/callCenter/workDetails")
},
{
    /* 呼叫中心-用户详情 */
    path: "/callDetailsUser",
    name: "callDetailsUser",
    component: () =>
        import("@/views/callCenter/userDetails")
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