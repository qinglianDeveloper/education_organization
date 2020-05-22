<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-04-30 14:51:21
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-05-09 09:29:10
 -->
<template>
  <Modal
    v-model="editStatus"
    title="编辑直销代理"
    :mask-closable="false"
    @on-cancel="handleCancle"
    :width="800"
  >
    <formModal ref="formData" :form="form" @submitData="submitData" :isEdit="true"></formModal>
    <div slot="footer">
      <Button type="default" @click="handleCancle">取消</Button>
      <Button type="primary" @click="handleSubmit" :loading="loading">
        <span v-if="!loading">确定</span>
        <span v-else>Loading...</span>
      </Button>
    </div>
  </Modal>
</template>
<script>
import formModal from "../components/formModal";
import { getByDirectId, editAgentDirect } from "@/api";
export default {
  props: {
    status: {
      type: Boolean
    },
    editId: {}
  },
  watch: {
    status(val) {
      this.editStatus = val;
      this.$refs.formData.handleReset();
      if (val) {
        this.getFormInfo();
      }
    }
  },
  components: { formModal },
  data() {
    return {
      loading: false,
      editStatus: false,
      form: {
        agentCompanyName: "",
        status: "",
        companyName: "",
        channelName: "",
        connact: "",
        mobilePhone: "",
        uniformSocialCreditCode: "",
        legalPersonName: "",
        legalPersonPhone: "",
        registMoney: "",
        numberOfWorkers: "",
        customerType: "",
        customerType: "",
        companyAddress: "",
        businessDescription: "",
        businessLicense: "",
        sealAuthorizationBookUrl: "",
        commissionRate: {
          ratioTop: "",
          ratioSecond: "",
          ratioCustomer: ""
        }
      }
    };
  },
  methods: {
    getFormInfo() {
      // let obj = JSON.parse(JSON.stringify(this.editRow));
      // console.log("obj", obj);
      // this.form.agentId = obj.agentId;
      // this.form.agentCompanyName = obj.agentCompanyName;
      // this.form.status = obj.status;
      // this.form.companyName = obj.companyName;
      // this.form.channelName = obj.channelName;
      // this.form.connact = obj.connact;
      // this.form.mobilePhone = obj.mobilePhone;
      // this.form.uniformSocialCreditCode = obj.uniformSocialCreditCode;
      // this.form.legalPersonName = obj.legalPersonName;
      // this.form.legalPersonPhone = obj.legalPersonPhone;
      // this.form.registMoney = obj.registMoney;
      // this.form.numberOfWorkers = obj.numberOfWorkers;
      // this.form.customerType = obj.customerType;
      // this.form.customerType = obj.customerType;
      // this.form.companyAddress = obj.companyAddress;
      // this.form.businessDescription = obj.businessDescription;
      // this.form.businessLicense = obj.businessLicense;
      // this.form.sealAuthorizationBookUrl = obj.sealAuthorizationBookUrl;
      // obj.commissionRate = obj.commissionRate.split(",");
      // this.form.commissionRate = {
      //   ratioTop: obj.commissionRate[0].replace("%", ""),
      //   ratioSecond: obj.commissionRate[1].replace("%", ""),
      //   ratioCustomer: obj.commissionRate[2].replace("%", "")
      // };
      getByDirectId({ id: this.editId }).then(res => {
        let obj = JSON.parse(JSON.stringify(res.result));
        this.form.id = obj.id;
        this.form.agentId = obj.agentId;
        this.form.agentCompanyName = obj.agentCompanyName;
        this.form.status = obj.status;
        this.form.companyName = obj.companyName;
        this.form.channelName = obj.channelName;
        this.form.connact = obj.connact;
        this.form.mobilePhone = obj.mobilePhone;
        this.form.uniformSocialCreditCode = obj.uniformSocialCreditCode;
        this.form.legalPersonName = obj.legalPersonName;
        this.form.legalPersonPhone = obj.legalPersonPhone;
        this.form.registMoney = obj.registMoney;
        this.form.numberOfWorkers = obj.numberOfWorkers;
        this.form.customerType = obj.customerType;
        this.form.customerType = obj.customerType;
        this.form.companyAddress = obj.companyAddress;
        this.form.businessDescription = obj.businessDescription;
        this.form.businessLicense = obj.businessLicense;
        this.form.sealAuthorizationBookUrl = obj.sealAuthorizationBookUrl;
        obj.commissionRate = obj.commissionRate.split(",");
        this.form.commissionRate = {
          ratioTop: obj.commissionRate[0].replace("%", ""),
          ratioSecond: obj.commissionRate[1].replace("%", ""),
          ratioCustomer: obj.commissionRate[2].replace("%", "")
        };
      });
    },
    handleCancle() {
      this.editStatus = false;
      this.$emit("handleCancle");
    },
    submitData(val) {
      this.loading = true;
      let obj = JSON.parse(JSON.stringify(val));
      delete obj.commissionRate;
      obj.ratioTop = val.commissionRate.ratioTop;
      obj.ratioSecond = val.commissionRate.ratioSecond;
      obj.ratioCustomer = val.commissionRate.ratioCustomer;
      // 类型为数字类型，当为空时会自动带入null
      for (let i in obj) {
        if (obj[i] == null || obj[i] == "null") {
          delete obj[i];
        }
      }
      editAgentDirect(obj).then(res => {
        if (res.code == 200) {
          this.loading = false;
          this.$Message.success(res.message);
          this.$emit("channgeTableData");
          this.$emit("handleCancle");
        } else {
          this.loading = false;
        }
      });
    },
    handleSubmit() {
      this.$refs.formData.handleSubmit();
    }
  }
};
</script>