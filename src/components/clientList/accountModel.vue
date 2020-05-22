<template>
  <Modal v-model="modal" :title="title" width="800" @on-cancel="cancel">
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
      </FormItem>
      <FormItem label="GC等级" prop="gcLevel">
        <Input v-model="addData.gcLevel" placeholder="请输入GC等级" />
      </FormItem>
      <FormItem label="系统激活" prop="isactive">
        <RadioGroup v-model="isactive" @on-change="isactiveChange">
          <Radio label="是"></Radio>
          <Radio label="否"></Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="认证情况" prop="isActive">
        <RadioGroup v-model="active" @on-change="radioChange">
          <Radio label="企业"></Radio>
          <Radio label="个人"></Radio>
          <Radio label="未认证"></Radio>
          <Radio label="未知"></Radio>
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
import { getAddCustomer, addAccount, accountUP } from "@/api";
import { validateEmail,checkTel,validatePhone } from '@/utils/current' 
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
        cstId: [{ required: true, message: "客户ID不能为空", trigger: "blur" }],
        belongChannel: [
          { required: true, message: "渠道归属", trigger: "blur" }
        ],
        platformCbm: [
          { required: true, message: "平台销售人员不能为空", trigger: "blur" }
        ],
        gcLevel: [
          { required: true, message: "GC等级不能为空", trigger: "blur" }
        ],
        isactive: [{ required: true, message: "系统激活", trigger: "blur" }],
        isActive: [{ required: true, message: "认证情况", trigger: "blur" }],
        name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
        phone: [
          { required: true, message: "电话号码不能为空", trigger: "blur" },
          { required: true, validator: validatePhone, trigger: "blur" }
        ],
        email: [
          { required: true, message: "邮箱不能为空", trigger: "blur" },
          { required: true, validator: validateEmail, trigger: "blur" }
        ],
        remark: [
          { required: true, message: "备注信息不能为空", trigger: "blur" }
        ]
      },
      active: "企业",
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
        isActive: "1",
        certification: "CORP",
        belongChannel: "",
        platformCbm: "",
        name: "",
        phone: "",
        remark: "",
        gcLevel: "",
        email: ""
      },
      List: [
        {value:'OWNED',label:'自有'},
        {value:'COMPETITORS',label:'竞争对手'}
      ],
      listByAgentTopData: {
        pageNumber: 1,
        pageSize: 20
      }
    };
  },
  props: ["modelShow"],
  watch: {
    modelShow(newVal) {
      this.modal = newVal;
    }
  },
  created() {
    this._customerSave();
  },
  methods: {
    config() {
      addAccount(this.addData).then(res => {
        if (res.code == 200) {
          this.$Message.success(res.message);
          this.$emit("configOK", false);
        }
      });
    },
    cancelBtn() {
      this.$emit("cancelModel", false);
    },
    cancel() {
      this.$emit("cancelModel", false);
    },
    isactiveChange(e) {
      e == "是" ? (this.addData.isActive = 1) : (this.addData.isActive = 0);
    },
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
  }
};
</script>