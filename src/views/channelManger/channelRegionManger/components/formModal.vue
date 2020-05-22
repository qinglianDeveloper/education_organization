<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-04-28 17:31:08
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-05-08 15:22:20
 -->
<template>
  <Form
    ref="formValidate"
    :model="form"
    :rules="ruleValidate"
    :label-width="140"
    style="height:600px;overflow:auto"
  >
    <div class="twoitem">
      <FormItem label="所属销售:" prop="salesId">
        <Select :disabled="isEdit" class="input" v-model="form.salesId" placeholder="请选择所属销售(分配)">
          <Option v-for="item in userList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="状态:" prop="status">
        <Select class="input" v-model="form.status" placeholder="请输选择状态">
          <Option value="ENABLE">启用</Option>
          <Option value="DISABLE">禁用</Option>
        </Select>
      </FormItem>
    </div>
    <div class="twoitem">
      <FormItem label="企业名称:" prop="companyName">
        <Input class="input" v-model="form.companyName" placeholder="请输入企业名称" />
      </FormItem>
      <FormItem label="公司简称:" prop="channelName">
        <Input class="input" v-model="form.channelName" placeholder="请输入公司简称" />
      </FormItem>
    </div>
    <div class="twoitem">
      <FormItem label="联系人姓名:" prop="connact">
        <Input class="input" v-model="form.connact" placeholder="请输入联系人姓名" />
      </FormItem>
      <FormItem label="联系人手机号:" prop="mobilePhone">
        <Input :disabled="isEdit" class="input" v-model="form.mobilePhone" placeholder="请输入联系人手机号" />
      </FormItem>
    </div>
    <FormItem label="统一社会信用代码:" prop="uniformSocialCreditCode">
      <Input style="width:600px" v-model="form.uniformSocialCreditCode" placeholder="请输入统一社会信用代码" />
    </FormItem>
    <div class="twoitem">
      <FormItem label="法人姓名:" prop="legalPersonName">
        <Input class="input" v-model="form.legalPersonName" placeholder="请输入联系人姓名" />
      </FormItem>
      <FormItem label="法人联系方式:" prop="legalPersonPhone">
        <Input class="input" v-model="form.legalPersonPhone" placeholder="请输入联系人手机号" />
      </FormItem>
    </div>
    <div class="twoitem">
      <FormItem label="注册资金:" prop="registMoney">
        <Input
          class="input"
          v-model="form.registMoney"
          placeholder="请输入注册资金"
          type="number"
          :number="true"
        />
      </FormItem>
      <FormItem label="职工人数:" prop="numberOfWorkers">
        <Input
          class="input"
          v-model="form.numberOfWorkers"
          placeholder="请输入职工人数"
          type="number"
          :number="true"
        />
      </FormItem>
    </div>
    <div class="twoitem">
      <FormItem label="主要客户群体类型:" prop="customerType">
        <Input class="input" v-model="form.customerType" placeholder="请输入主要客户群体类型" />
      </FormItem>
      <FormItem label="主营业务内容:" prop="businessDescription">
        <Input class="input" v-model="form.businessDescription" placeholder="请输入主营业务内容" />
      </FormItem>
    </div>
    <FormItem label="单位地址:" prop="companyAddress">
      <Input style="width:600px" v-model="form.companyAddress" placeholder="请输入单位地址" />
    </FormItem>
    <FormItem label="营业执照:" prop="businessLicense">
      <uploadImage
        ref="businessLicense"
        :imgNum="1"
        :data="form.businessLicense"
        @success="businessSuccess"
      ></uploadImage>
    </FormItem>
    <FormItem ref="sealAuthorizationBookUrl" label="授权书:" prop="sealAuthorizationBookUrl">
      <uploadImage :imgNum="1" :data="form.sealAuthorizationBookUrl" @success="seabookSuccess"></uploadImage>
    </FormItem>
    <FormItem label="佣金比例:" prop="commission">
      <div style="display:flex">
        <div style="margin-right:20px">
          <Input
            style="width:140px;margin-right:2px"
            v-model="form.commission.ratioTop"
            placeholder="区域代理比例"
          />
          <span style="font-weight:bold">%</span>
        </div>

        <div style="margin-right:20px">
          <Input
            style="width:140px;margin-right:2px"
            v-model="form.commission.ratioCustomer"
            placeholder="用户比例"
          />
          <span style="font-weight:bold">%</span>
        </div>
      </div>
    </FormItem>
    <FormItem label="默认二级佣金比例:" prop="default">
      <div style="display:flex">
        <div style="margin-right:20px">
          <Input
            style="width:140px;margin-right:2px"
            v-model="form.default.secondRatioTop"
            placeholder="区域代理比例"
          />
          <span style="font-weight:bold">%</span>
        </div>
        <div style="margin-right:20px">
          <Input
            style="width:140px;margin-right:2px"
            v-model="form.default.secondDirectSelling"
            placeholder="直销代理比例额"
          />
          <span style="font-weight:bold">%</span>
        </div>
        <div style="margin-right:20px">
          <Input
            style="width:140px;margin-right:2px"
            v-model="form.default.secondRatioCustomer"
            placeholder="用户比例"
          />
          <span style="font-weight:bold">%</span>
        </div>
      </div>
    </FormItem>
  </Form>
</template>
<script>
import uploadImage from "@/components/uploadImage";
import { salesList } from "@/api";
export default {
  props: {
    form: {
      type: Object
    },
    isEdit: {
      type: Boolean
    }
  },
  components: { uploadImage },
  data() {
    const validCommission = (rule, value, callback) => {
      let top = value.ratioTop * 1;
      let down = value.ratioCustomer * 1;
      var regPos = /^\d+(\.\d+)?$/;
      var regFlot = /^-?\d+\.?\d{0,2}$/;
      if (!value.ratioTop) {
        callback(new Error("请输入相对应的比例"));
      } else if (!value.ratioCustomer) {
        callback(new Error("请输入相对应的比例"));
      } else if (
        !regPos.test(value.ratioTop) ||
        !regPos.test(value.ratioCustomer)
      ) {
        callback(new Error("请输入非负数字"));
      } else if (
        !regFlot.test(value.ratioTop) ||
        !regFlot.test(value.ratioCustomer)
      ) {
        callback(new Error("不能超过两位小数"));
      } else if (top + down > 100) {
        callback(new Error("总计不超过100%"));
      } else {
        callback();
      }
    };
    const validDefault = (rule, value, callback) => {
      let top = value.secondRatioTop * 1;
      let selling = value.secondDirectSelling * 1;
      let customer = value.secondRatioCustomer * 1;
      var regPos = /^\d+(\.\d+)?$/;
      var regFlot = /^-?\d+\.?\d{0,2}$/;
      if (!value.secondRatioTop) {
        callback(new Error("请输入相对应的比例"));
      } else if (!value.secondDirectSelling) {
        callback(new Error("请输入相对应的比例"));
      } else if (!value.secondRatioCustomer) {
        callback(new Error("请输入相对应的比例"));
      } else if (
        !regPos.test(value.secondRatioTop) ||
        !regPos.test(value.secondDirectSelling) ||
        !regPos.test(value.secondRatioCustomer)
      ) {
        callback(new Error("请输入非负数字"));
      } else if (
        !regFlot.test(value.secondRatioTop) ||
        !regFlot.test(value.secondDirectSelling) ||
        !regFlot.test(value.secondRatioCustomer)
      ) {
        callback(new Error("不能超过两位小数"));
      } else if (top + selling + customer > 100) {
        callback(new Error("总计不超过100%"));
      } else {
        callback();
      }
    };
    return {
      ruleValidate: {
        salesId: [
          {
            required: true,
            message: "请选择所属销售",
            trigger: "change",
            type: "number"
          }
        ],
        status: [
          {
            required: true,
            message: "请选择状态",
            trigger: "change"
          }
        ],
        companyName: [
          {
            required: true,
            message: "请输入企业名称",
            trigger: "blur"
          }
        ],
        channelName: [
          {
            required: true,
            message: "请输入公司简称",
            trigger: "blur"
          }
        ],
        connact: [
          {
            required: true,
            message: "请输入联系人",
            trigger: "blur"
          }
        ],
        mobilePhone: [
          {
            type: "number",
            required: true,
            message: "请填写正确的手机号",
            trigger: "blur",
            transform(value) {
              var myreg = /^[1][0-9]{10}$/;
              if (!myreg.test(value)) {
                return false;
              } else {
                return Number(value);
              }
            }
          }
        ],
        uniformSocialCreditCode: [
          {
            required: true,
            message: "请输入统一社会信用代码",
            trigger: "blur"
          }
        ],
        businessLicense: [
          {
            required: true,
            message: "请上传营业执照",
            trigger: "blur",
            trigger: "change"
          }
        ],
        sealAuthorizationBookUrl: [
          {
            required: true,
            message: "请上传授权书",
            trigger: "blur",
            trigger: "change"
          }
        ],
        commission: [
          {
            type: "object",
            required: true,
            validator: validCommission
          }
        ],
        default: [
          {
            type: "object",
            required: true,
            validator: validDefault
          }
        ]
      },
      userList: []
    };
  },
  methods: {
    businessSuccess(e) {
      this.form.businessLicense = e;
      this.$refs["formValidate"].validateField("businessLicense");
    },
    seabookSuccess(e) {
      this.form.sealAuthorizationBookUrl = e;
      this.$refs["formValidate"].validateField("sealAuthorizationBookUrl");
    },
    getUserList() {
      return salesList().then(res => {
        if (res.code == 200) {
          let list = [];
          res.result.map(item => {
            let obj = { value: item.id, label: item.name };
            list.push(obj);
            return list;
          });
          this.userList = list;
        }
      });
    },
    handleSubmit() {
      this.$refs["formValidate"].validate(valid => {
        if (valid) {
          this.$emit("submitData", this.form);
        }
      });
    },
    handleReset() {
      this.$refs["formValidate"].resetFields();
    }
  }
};
</script>
<style lang="scss" scoped>
.twoitem {
  display: flex;
  .input {
    width: 230px;
  }
}
</style>