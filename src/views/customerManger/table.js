export const columnList = [
  {
    title: "客户全称",
    align: "center",
    key: "name",
    minWidth: 100
    // sortable: true,
  },
  {
    title: "行业",
    align: "center",
    key: "age",
    minWidth: 100
    // sortable: true,
  },
  {
    title: "类型",
    align: "center",
    key: "industry",
    minWidth: 100
    // sortable: true,
  },
  {
    title: "客户业务等级",
    align: "center",
    key: "achievementLevel",
    minWidth: 130
    // sortable: true,
  },
  {
    title: "客户利润等级",
    align: "center",
    key: "profitLevel",
    minWidth: 130
    // sortable: true,
  },
  {
    title: "状态",
    align: "center",
    key: "status",
    minWidth: 80
    // sortable: true,
  },
  {
    title: "直销负责人",
    align: "center",
    key: "contact",
    // sortable: true,
    minWidth: 110
  },
  {
    title: "操作",
    slot: 'action',
    align: "center",
    minWidth: 160
  }
];

export const ruleValidates = {
  name: [
    {
      required: true,
      message: "客户名称不能为空",
      trigger: "change"
    }
  ],
  // userId: [
  //   {
  //     required: true,
  //     message: "客户关联不能为空",
  //     trigger: "change"
  //   }
  // ],
  type: [
    {
      required: true,
      message: "请选择类型",
      trigger: "change"
    }
  ],
  contact: [
    { required: true, message: "请输入默认联系人", trigger: "blur" }
  ],
  mobilePhone: [
    { required: true, message: "请输入联系人电话", trigger: "blur" }
  ]
}