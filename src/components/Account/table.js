export const columnList = [
    {
        type: 'selection',
        width: 60,
        align: 'center'
    },
    {
        title: '账号',
        width: 160,
        key: 'account'
    },
    {
        title: '主账号归属',
        width: 160,
        key: 'accountType'
    },
    {
        title: '姓名',
        width: 160,
        key: 'cstName'
    },
    {
        title: '电话',
        // width: 160,
        key: 'phone'
    },
    {
        title: '激活时间',
        // width: 160,
        key: 'activeTime'
    },
    {
        title: 'GC等级',
        // width: 160,
        key: 'gcLevel'
    },
    {
        title: '认证情况',
        // width: 160,
        key: 'certification'
    },
    {
        title: '平台销售人员',
        // width: 160,
        key: 'platformCbm'
    },
    {
        title: '操作',
        slot: 'action',
        align: 'center',
        width: 200,
    },
];

export const ruleValidates = {
    accountType: [
        { required: true, message: '账号不能为空', trigger: 'change' }
    ],
    account: [
        { required: true, message: '账号名称不能为空', trigger: 'blur' }
    ],
    cstId: [
        { required: true, message: '客户ID不能为空', trigger: 'blur' }
    ],
    belongChannel: [
        { required: true, message: '渠道归属', trigger: 'blur' }
    ],
    platformCbm: [
        { required: true, message: '平台销售人员不能为空', trigger: 'blur' }
    ],
    gcLevel: [
        { required: true, message: 'GC等级不能为空', trigger: 'blur' }
    ],
    isactive: [
        { required: true, message: '系统激活', trigger: 'blur' }
    ],
    isActive: [
        { required: true, message: '认证情况', trigger: 'blur' }
    ],
    name: [
        { required: true, message: '姓名不能为空', trigger: 'blur' }
    ],
    phone: [
        { required: true, message: '电话号码不能为空', trigger: 'blur' }
    ],
    email: [
        { required: true, message: '验证码不能为空', trigger: 'blur' },
        // { type: 'email', message: '', trigger: 'blur' }
    ],
    remark: [
        { required: true, message: '备注信息不能为空', trigger: 'blur' }
    ],
}