export const addColumns = [
    {
        title: "联系人",
        key: "name",
        align: "cneter"
    },
    {
        title: "部门",
        key: "age",
        align: "cneter"
    },
    {
        title: "职务",
        key: "address",
        align: "cneter"
    },
    {
        title: "电话号码",
        key: "address",
        align: "cneter"
    }
];

export const methodsArray = [
    {
        value: "邮件",
        label: "Email"
    },
    {
        value: "电话",
        label: "Phone"
    },
    {
        value: "QQ",
        label: "QQ"
    },
    {
        value: "上门拜访",
        label: "Visit"
    },
    {
        value: "微信",
        label: "WeChat"
    },
    {
        value: "钉钉",
        label: "DingDing"
    },
    {
        value: "客户来访",
        label: "CustomerVisited"
    },
    {
        value: "其他",
        label: "Other"
    }
];
export const FromData = {
    id:'', // 唯一标识
    followType:'', //跟进类型
    followTargetId:'', // 跟进对象
    followTargetName:'', // 跟进对象名称
    contactId:'', // 对接联系人id
    contactName:'', // 对接联系人姓名
    followMethod:'', // 跟进方式
    followTime:'', // 跟进时间
    followContent:'', //跟进内容
    annexIds:'', // 附件id集（多个用,分隔）
    annexNames:'', //附件名称集合(多个,隔开)
}