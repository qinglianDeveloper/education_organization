export default {
    menuList: [{
        title: "系统设置",
        icon: "ios-settings",
        name: "sysSettings",
        children: [{
            title: "组织架构",
            name: "organiZation",
            icon: "md-apps"
        },
        {
            title: "菜单权限",
            name: "menuManage",
            icon: "md-apps"
        },
        {
            title: "角色权限管理",
            name: "roleManage",
            icon: "md-apps"
        },
        {
            title: "日志管理",
            name: "logManage",
            icon: "md-apps"
        },
        {
            title: "定时任务",
            name: "timeTask",
            icon: "md-apps"
        }
        ],
    }, {
        title: "商品管理",
        icon: "md-cube",
        name: "goodsManger",
        children: [{
            title: "商品列表",
            name: "goodsList",
            icon: "md-apps"
        },
        {
            title: "商品分类",
            name: "goodsClassify",
            icon: "md-apps"
        },
        {
            title: "积分商品",
            name: "integralGoods",
            icon: "md-apps"
        }
        ],
    },
    /* {
           title: "在线客服",
           icon: "md-chatboxes",
           children: [{
               title: "在线客服主页",
               name: "customerHome",
               icon: "md-apps"
           }, {
               title: "咨询单列表",
               name: "customerList",
               icon: "md-apps"
           }, {
               title: "快捷回复配置",
               name: "fastReply",
               icon: "md-apps"
           }, {
               title: "快捷回复分类设置",
               name: "fastType",
               icon: "md-apps"
           }]
       }, {
           title: "呼叫中心",
           icon: "md-megaphone",
           children: [{
               title: "呼叫中心主页",
               name: "callHome",
               icon: "md-apps"
           }]
       },  */
    {
        title: "工单管理",
        icon: "md-pricetags",
        name: "workOrder",
        children: [{
            title: "工单列表",
            name: "workList",
            icon: "md-apps"
        }, {
            title: "工单类型设置",
            name: "workType",
            icon: "md-apps"
        },/*  {
            title: "分组设置",
            name: "workGroup",
            icon: "md-apps"
        }, */ {
            title: "工单自定义字段设置",
            name: "workField",
            icon: "md-apps"
        }, {
            title: "工单自定义模板设置",
            name: "workTemplate",
            icon: "md-apps"
        }],
    }, {
        title: "订单管理",
        icon: "md-ribbon",
        name: "orderManger",
        children: [{
            title: "系统上云订单",
            name: "systemOrder",
            icon: "md-apps"
        }, {
            title: "标准化服务订单",
            name: "serverOrder",
            icon: "md-apps"
        }, {
            title: "非标准化服务订单",
            name: "offstandardOrder",
            icon: "md-apps"
        }, {
            title: "积分兑换记录",
            name: "integralLog",
            icon: "md-apps"
        }],
    },
    {
        title: "用户管理",
        icon: "md-person",
        name: "userManger",
        children: [{
            title: "用户管理列表",
            name: "userList",
            icon: "md-apps"
        },
        {
            title: "账号管理",
            name: "AccountList",
            icon: "md-apps"
        }],
    }, {
        title: "渠道管理",
        icon: "md-git-pull-request",
        name: "channelManger",
        children: [{
            title: "代理商审核",
            name: "channelCheck",
            icon: "md-apps"
        }, {
            title: "区域渠道管理",
            name: "channelRegionManger",
            icon: "md-apps"
        }, {
            title: "销售渠道管理",
            name: "channelSaleManger",
            icon: "md-apps"
        }],
    }, {
        title: "员工管理",
        icon: "md-contacts",
        name: "staffManger",
        children: [{
            title: "销售管理",
            name: "market",
            icon: "md-apps",
        }, {
            title: "工程师管理",
            name: "engineer",
            icon: "md-apps",
        }, {
            title: "客服管理",
            name: "service",
            icon: "md-apps",
        }]
    }, {
        title: "内容管理",
        icon: "ios-create",
        name: "contentManger",
        children: [{
            title: "轮播图配置",
            name: "carouselAllocation",
            icon: "md-apps",
        }, {
            title: "合作商配置",
            name: "cooperationAllocation",
            icon: "md-apps",
        }, {
            title: "公告栏配置",
            name: "noticeAllocation",
            icon: "md-apps",
        }, {
            title: "用户协议配置",
            name: "userAllocation",
            icon: "md-apps",
        }]
    }, {
        title: "财务管理",
        icon: "logo-usd",
        name: "financeManger",
        children: [{
            title: "发票管理",
            name: "invoiceManger",
            icon: "md-apps",
        }, {
            title: "提现管理",
            name: "withdrawalManger",
            icon: "md-apps",
        }, {
            title: "对公打款审核",
            name: "remittance",
            icon: "md-apps",
        }]
    },
    {
        title: "客户管理",
        icon: "md-contacts",
        name: "customerManger",
        children: [{
            title: "客户管理",
            name: "clientList",
            icon: "md-apps",
        },
            /* {
            title: "客户查询",
            name: "customerQuery",
            icon: "md-apps",
            } */
        ]
    },
    {
        title: "帮助中心",
        icon: "md-help-circle",
        name: "helpCenter",
        children: [{
            title: "文章列表",
            name: "articleList",
            icon: "md-apps",
        }, {
            title: "文章分类",
            name: "articleType",
            icon: "md-apps",
        }]
    },
    {
        title: "在线客服",
        icon: "md-chatbubbles",
        name: "serverCenter",
        children: [{
            title: "在线客服",
            name: "customerHome",
            icon: "md-apps",
        }, {
            title: "关联在线客服",
            name: "customerRelevance",
            icon: "md-apps",
        }]
    },
    {
        title: "呼叫中心",
        icon: "md-call",
        name: "callCenter",
        children: [{
            title: "呼叫中心",
            name: "callHome",
            icon: "md-apps",
        }, {
            title: "关联呼叫中心",
            name: "callRelevance",
            icon: "md-apps",
        }]
    },
    {
        title: '数据上传',
        icon: "md-calculator",
        name: 'DataToBed',
        children: [
            {
                title: '数据上传',
                icon: 'md-apps',
                name: 'update'
            }
        ]
    }
    ]
}