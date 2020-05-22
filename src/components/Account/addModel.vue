<template>
  <Modal v-model="modal" :title="title" width="800" @on-cancel="cancel" :styles="{top: '20px'}">
    <Form ref="formValidate" :model="addData" :label-width="120" :rules="ruleValidate">
      <FormItem label="账号" prop="accountType">
        <Select v-model="addData.accountType">
          <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="账号名称" prop="account">
        <Input v-model="addData.account" placeholder="请输入账号名称" />
      </FormItem>
      <FormItem label="客户ID" prop="cstId">
        <Select v-model="addData.cstId">
          <Option
            v-for="item in getAddCustomerList"
            :value="item.value"
            :key="item.value"
          >{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="渠道归属" prop="belongChannel">
        <Select v-model="addData.belongChannel" placeholder="请选择渠道归属">
          <Option v-for="item in List" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="平台销售人员" prop="platformCbm">
        <Input v-model="addData.platformCbm" placeholder="请输入平台销售人员" />
        <!-- <DatePicker type="date" placeholder="Select date"></DatePicker> -->
      </FormItem>
      <FormItem label="GC等级" prop="gcLevel">
        <Input v-model="addData.gcLevel" placeholder="请输入GC等级" />
      </FormItem>
      <FormItem label="系统激活" prop="isActive">
        <RadioGroup v-model="addData.isActive">
          <Radio :label="1">是</Radio>
          <Radio :label="0">否</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="认证情况" prop="certification">
        <RadioGroup v-model="addData.certification" @on-change="radioChange">
          <Radio label="CORP">企业</Radio>
          <Radio label="PERSONAL">个人</Radio>
          <Radio label="UNCERTIFIED">未认证</Radio>
          <Radio label="UNKNOW">未知</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="姓名" prop="name">
        <Input v-model="addData.name" placeholder="请输入姓名" />
      </FormItem>
      <FormItem label="电话号码" prop="phone">
        <Input v-model="addData.phone" placeholder="请输入电话号码" />
      </FormItem>
      <FormItem label="邮箱" prop="email">
        <Input v-model="addData.email" placeholder="请输入邮箱" />
      </FormItem>
      <FormItem label="备注信息" prop="remark">
        <Input v-model="addData.remark" :rows="4" placeholder="请输入备注信息" />
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="primary" @click="config">提交</Button>
      <Button @click="cancelBtn">取消</Button>
    </div>
  </Modal>
</template>
<script>
import { getAddCustomer, getAgencyList, addAccount, accountUP } from "@/api";
// import { ruleValidates } from "./table";
import bus from "@/utils/bus";
export default {
  data() {
    return {
      ruleValidate: {
        accountType: [
          { required: true, message: "账号不能为空", trigger: "change" }
        ],
        account: [
          { required: true, message: "账号名称不能为空", trigger: "blur" }
        ],
        cstId: [
          {
            required: true,
            message: "客户ID不能为空",
            trigger: "change",
            type: "number"
          }
        ],
        belongChannel: [
          { required: true, message: "渠道归属", trigger: "change" }
        ],
        platformCbm: [
          { required: true, message: "平台销售人员不能为空", trigger: "blur" }
        ],
        gcLevel: [
          { required: true, message: "GC等级不能为空", trigger: "blur" }
        ],
        isActive: [
          {
            required: true,
            message: "系统激活",
            trigger: "change",
            type: "number"
          }
        ],
        certification: [
          { required: true, message: "认证情况", trigger: "change" }
        ],
        name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
        phone: [
          { required: true, message: "电话号码不能为空", trigger: "blur" }
        ],
        email: [
          { required: true, message: "验证码不能为空", trigger: "blur" }
          // { type: 'email', message: '', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: "备注信息不能为空", trigger: "blur" }
        ]
      },
      isactive: "是",
      modal: false,
      title: "新增账号",
      cityList: [
        { value: "ALIYUN", label: "阿里云" },
        { value: "TENGXUNYUN", label: "腾讯云" },
        { value: "HUAWEIYUN", label: "华为云" },
        { value: "BAIDUYUN", label: "百度云" },
        { value: "JINSHANYUN", label: "金山云" }
      ],
      getAddCustomerList: [],
      addData: {
        accountType: "",
        account: "",
        cstId: "",
        isActive: "",
        certification: "",
        belongChannel: "",
        platformCbm: "",
        name: "",
        phone: "",
        remark: "",
        gcLevel: "",
        email: ""
      },
      List: [
        { value: "OWNED", label: "自有" },
        { value: "COMPETITORS", label: "竞争对手" }
      ],
      listByAgentTopData: {
        pageNumber: 1,
        pageSize: 20
      },
      txt: ""
    };
  },
  props: ["modelAdd"],
  watch: {
    modelAdd(newVal) {
      this.modal = newVal;
    }
  },
  created() {
    this._customerSave();
  },
  mounted() {
    bus.$off("txt");
    bus.$on("txt", item => {
      this.txt = item;
      this.title = `${item}账号`;
    });
    bus.$off("accountData");
    bus.$on("accountData", obj => {
      console.log(obj);
      // 深拷贝
      let item = JSON.parse(JSON.stringify(obj));
      switch (item.accountType) {
        case "阿里云":
          item.accountType = "ALIYUN";
          break;
        case "金山云":
          item.accountType = "JINSHANYUN";
          break;
        case "百度云":
          item.accountType = "BAIDUYUN";
          break;
        case "腾讯云":
          item.accountType = "TENGXUNYUN";
          break;
        case "华为云":
          item.accountType = "HUAWEIYUN";
          break;
        default:
          break;
      }
      switch (item.certification) {
        case "企业":
          item.certification = "CORP";
          break;
        case "个人":
          item.certification = "PERSONAL";
          break;
        case "未认证":
          item.certification = "UNCERTIFIED";
          break;
        case "未知":
          item.certification = "UNKNOW";
          break;
        default:
          break;
      }
      this.addData = item;
      this.modal = true;
    });
  },
  methods: {
    // isactiveChange(e) {
    //   e == "是" ? (this.addData.isActive = 1) : (this.addData.isActive = 0);
    // },
    radioChange(e) {
      switch (e) {
        case "企业":
          this.addData.certification = "CORP";
          break;
        case "个人":
          this.addData.certification = "PERSONAL";
          break;
        case "未认证":
          this.addData.certification = "UNCERTIFIED";
          break;
        case "未知":
          this.addData.certification = "UNKNOW";
          break;

        default:
          break;
      }
    },
    _customerSave() {
      getAddCustomer().then(res => {
        if (res.code == 200) {
          let arr = res.result;
          arr.map(item => {
            let obj = { value: item.id, label: item.name };
            this.getAddCustomerList.push(obj);
            return this.getAddCustomerList;
          });
        }
      });
    },
    config(name) {
      console.log(this.addData.isActive);
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          if (this.txt == "新增") {
            addAccount(this.addData).then(res => {
              if (res.code == 200) {
                this.$Message.success(res.message);
                this.$emit("configOK", false);
                this.modal = false;
                bus.$emit("ok", res.message);
                this.addData = {};
                this.modal = false;
              }
            });
          } else {
            accountUP(this.addData).then(res => {
              this.$Message.success(res.message);
              this.$emit("configOK", false);
              bus.$emit("ok", res.message);
              this.addData = {};
              this.modal = false;
            });
          }
        }
      });
    },
    cancelBtn(name) {
      this.$emit("configOK", false);
      this.modal = false;
      this.text = "";
      this.addData = {};
    },
    cancel() {
      this.$emit("configOK", false);
      this.modal = false;
      this.text = "";
      this.addData = {};
    }
  }
};
</script>
<style lang="scss" scoped>
</style>