export const ContactsData = {
    id: "", name: "",
    mobilePhone: "",
    telephone: "",
    email: "",
    corpName: "",
    department: "",
    position: "",
    corpAddress: "",
    sex: "",
    nation: "",
    wechat: "",
    qq: "",
    birthday: "",
    hobby: "",
    areaId: "",
    area: "",
    houseAddress: "",
    remark: ""
}

export const accountInformationData = {
    id: '',
    account: '',
    accountType: '',
    cstId: '',
    cstName: '',
    belongChannel: '',
    phone: '',
    name: '',
    email: '',
    isActive: '',
    platformCbm: '',
    remark: ''
}

export const ContactVerification = {
    name: [{ required: true, message: "名字不能为空", trigger: "blur" }],
    mobilePhone: [
        { required: true, message: "手机号码不能为空", trigger: "blur" },
        {
            type: "string",
            pattern: /^\d+$/,
            message: "请输入数字",
            trigger: "blur"
        }
    ],
    telephone: [
        { required: true, message: "电话号码不能为空", trigger: "blur" },
        {
            type: "string",
            pattern: /^\d+$/,
            message: "请输入数字",
            trigger: "blur"
        }
    ],
    telephone: [
        { required: true, message: "电话号码不能为空", trigger: "blur" },
        {
            type: "string",
            pattern: /^\d+$/,
            message: "请输入数字",
            trigger: "blur"
        }
    ],
    email: [
        { required: true, message: "个人邮箱不能为空", trigger: "blur" }
    ],
    corpName: [
        { required: true, message: "公司名称不能为空", trigger: "blur" }
    ],
    department: [
        { required: true, message: "部门不能为空", trigger: "blur" }
    ],
    position: [
        { required: true, message: "职务不能为空", trigger: "blur" }
    ],
    corpAddress: [
        { required: true, message: "公司地址不能为空", trigger: "blur" }
    ],
    sex: [{ required: true, message: "性别不能为空", trigger: "blur" }],
    nation: [{ required: true, message: "民族不能为空", trigger: "blur" }],
    wechat: [
        { required: true, message: "微信号不能为空", trigger: "blur" }
    ],
    qq: [
        { required: true, message: "QQ不能为空", trigger: "blur" },
        {
            type: "string",
            pattern: /^\d+$/,
            message: "请输入数字",
            trigger: "blur"
        }
    ],
    birthday: [
        // { required: true, message: "生日不能为空", trigger: "blur" }
    ],
    hobby: [
        { required: true, message: "兴趣爱好不能为空", trigger: "blur" }
    ],
    ProvinceVal: [
        { required: true, message: "省份不能为空", trigger: "blur" }
    ],
    CityVal: [{ required: true, message: "城市不能为空", trigger: "blur" }],
    area: [{ required: true, message: "县区不能为空", trigger: "blur" }],
    houseAddress: [
        { required: true, message: "家庭地址不能为空", trigger: "blur" }
    ],
    remark: [{ required: true, message: "备注不能为空", trigger: "blur" }]
};
export const accountInformationVerification = {
    account: [
        { required: true, message: "账号不能为空", trigger: "blur" },
    ],
    account: [
        { required: true, message: "账号类型不能为空", trigger: "blur" },
    ],
    cstName: [
        { required: true, message: "客户名不能为空", trigger: "blur" },
    ],
    belongChannel: [
        { required: true, message: "渠道归属不能为空", trigger: "blur" },
    ],
    phone: [
        { required: true, message: "联系方式不能为空", trigger: "blur" },
    ],
    name: [
        { required: true, message: "联系人不能为空", trigger: "blur" },
    ],
    email: [
        { required: true, message: "邮箱不能为空", trigger: "blur" },
    ],
    platformCbm: [
        { required: true, message: "平台销售人员不能为空", trigger: "blur" },
    ],
    remark: [
        { required: true, message: "平台销售人员不能为空", trigger: "blur" },
    ],
}