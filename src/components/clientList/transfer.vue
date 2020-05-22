<template>
  <div>
    <Modal
      v-model="transferStatus"
      :title="transferTitle"
      :closable="false"
      :width="600"
      :mask-closable="false"
    >
      <div v-if="typeName=='administration' ">
        <p class="transfer-header">已选商机</p>
        <Table :columns="columns1" :data="data1" border class="contacts-table"></Table>
      </div>
      <!-- <div v-if="typeName=='customer' ">
        <p class="transfer-header">已选客户</p>
        <Table
          :columns="columns2"
          :data="selectTable"
          border
          class="contacts-table"
          max-height="200"
        ></Table>
      </div> -->

      <!-- 转移信息 -->
      <Form
        ref="formItem"
        :model="formItem"
        :label-width="70"
        label-position="right"
        :rules="ruleValidate"
      >
        <!-- 客户--详情 -->
        <div v-if="typeName=='customerinfo' ">
          <FormItem label="客户全称:" :label-width="120">
            <Input disabled v-model="transTitle" style="width:400px" />
          </FormItem>
          <FormItem label="负责人:" :label-width="120">
            <Input disabled v-model="person" style="width:300px" />
          </FormItem>
        </div>
        <!-- 客户--详情 -->

        <!-- 商机--详情 -->
        <div v-if="typeName=='statistics' ">
          <FormItem label="商机标题:" :label-width="75">
            <Input disabled v-model="busTitle" style="width:400px" />
          </FormItem>
          <FormItem label="负责人:" :label-width="75">
            <Input disabled v-model="person" style="width:300px" />
          </FormItem>
        </div>
        <!-- 商机--详情 -->

        <p class="transferInfo">转移信息</p>

        <FormItem
          label="负责人类型:"
          prop="principalType"
          :label-width="120"
          style="white-space: nowrap;"
        >
          <Select v-model="formItem.principalType" style="width:400px;">
            <Option
              v-for="item in cityList"
              :value="item.value"
              :key="item.value"
              @click.native="selectTyle"
            >{{item.label}}</Option>
          </Select>
        </FormItem>
        <FormItem label="转移给:" prop="principalName" :label-width="120">
          <Input
            v-model="formItem.principalName"
            placeholder="请选择"
            style="width: 400px"
            @click.native="onDepList"
          />
        </FormItem>

        <FormItem label="账号转移生效类型:" prop="effectType" :label-width="140" v-if="isShow">
          <RadioGroup v-model="formItem.effectType">
            <Radio label="立刻生效">立刻生效</Radio>
            <Radio label="下月生效">下月生效</Radio>
            <Radio label="非0新购订单生效">非0新购订单生效</Radio>
          </RadioGroup>
        </FormItem>
      </Form>
      <!-- 转移信息 -->

      <!-- 树弹框 -->
      <!-- <tree
        ref="bussDistriPage"
        :depModalVisible="depModalVisible"
        typeName="single"
        @submitDepCancel="submitDepCancel"
        @submitDepEdit="submitDepEdit"
      ></tree> -->
      <!-- 树弹框 -->
      <div slot="footer">
        <Button @click="cancel">取消</Button>
        <Button type="primary" @click="ok">确认保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
// import Tree from "@/components/clientList/tree"; //树
export default {
  props: [
    "transferStatus",
    "transferTitle",
    "typeName",
    "person",
    "selectTable",
    "detailName"
  ],
  // components: {
  //   Tree
  // },
  data() {
    return {
      isShow: true,
      transTitle: "",
      busTitle: "",
      cityList: [
        {
          value: "销售",
          label: "销售"
        },
        {
          value: "架构师",
          label: "架构师"
        }
      ],
      depModalVisible: false,
      data1: [],
      data2: [],
      // 表单验证
      ruleValidate: {
        principalType: [
          {
            required: true,
            message: "负责人类型不能为空",
            trigger: "blur"
          }
        ],
        principalName: [
          {
            required: true,
            message: "转移人不能为空",
            trigger: "blur"
          }
        ]
      },
      formItem: {
        principalType: "",
        principalName: "",
        effectType: ""
      },
      columns1: [
        {
          title: "商机标题",
          key: "name"
        },

        {
          title: "电销负责任",
          key: "age"
        },
        {
          title: "直销负责人",
          key: "address"
        },
        {
          title: "技术负责人",
          key: "address"
        }
      ],
      columns2: [
        {
          title: "客户名称",
          key: "name",
          tooltip: true
        },

        {
          title: "电销负责人",
          key: "telesalesName"
        },
        {
          title: "直销负责人",
          key: "salesName"
        },
        {
          title: "技术负责人",
          key: "technicalSptName"
        }
      ]
    };
  },
  mounted() {
    if (this.detailName) {
      this.transTitle = this.detailName;
    }
  },

  methods: {
    // 父级--客户列表转移
    getAddTransParams() {
      this.$refs.formItem.resetFields();
    },

    // 选择客户转移类型
    selectTyle() {
      if (this.formItem.principalType == "销售") {
        this.formItem.principalName = "";
        this.formItem.principalId = "";
        this.isShow = true;
      } else if (this.formItem.principalType == "架构师") {
        this.formItem.principalName = "";
        this.formItem.principalId = "";
        this.isShow = false;
      }
    },

    //   树
    onDepList() {
      if (!this.formItem.principalType) {
        this.$Message.error("请先选择负责人类型");
        return;
      }
      this.depModalVisible = true;
      if (this.formItem.principalType == "销售") {
        this.$refs.bussDistriPage.getReceiveParams();
      } else if (this.formItem.principalType == "架构师") {
        this.$refs.bussDistriPage.getBussTechParams();
      }
    },
    submitDepEdit(val) {
      if (val.length > 0) {
        this.formItem.principalName = val[0].title;
        this.formItem.principalId = val[0].id;
      }
      this.depModalVisible = false;
    },
    submitDepCancel() {
      this.depModalVisible = false;
    },
    // 负责人类型
    changeType(v) {
      console.log(v);
    },
    // 转移原因
    changeReason(v) {
      console.log(v);
    },
    cancel() {
      this.$emit("transferCancel");
    },
    ok() {
      let newForm = JSON.parse(JSON.stringify(this.formItem));
      let { effectType, principalType } = this.formItem;
      // 账号转移生效类型
      if (effectType) {
        let tranName = ["立刻生效", "下月生效", "非0新购订单生效"];
        let tranCode = ["EffectNow", "EffectNextMonth", "EffectByOrder"];
        let tranIndex = tranName.findIndex(v => v == effectType);
        newForm.effectType = tranCode[tranIndex];
        newForm.isTransforAccount = 1;
      } else {
        newForm.isTransforAccount = 0;
      }

      // 负责人类型
      if (principalType == "销售") {
        newForm.principalType = "Sales";
      } else if (principalType == "架构师") {
        newForm.principalType = "TechnicalSpt";
      }

      this.$refs.formItem.validate(valid => {
        if (valid) {
          this.$emit("transferOk", newForm);
        } else {
        }
      });
    }
  },
  created() {}
};
</script>

<style lang="scss" scoped>
.transfer-header {
  padding-bottom: 5px;
  border-bottom: 1px solid rgb(239, 239, 239);
  margin-bottom: 10px;
}
.transferInfo {
  padding-top: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid rgb(239, 239, 239);
  margin-bottom: 10px;
}
.val_length {
  position: absolute;
  right: 5%;
  bottom: 3%;
  color: rgb(188, 192, 198);
}
</style>


