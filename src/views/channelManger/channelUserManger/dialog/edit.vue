<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-04-28 17:20:27
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-05-12 14:27:15
 -->
<template>
  <Modal
    v-model="editStatus"
    title="编辑用户代理"
    :mask-closable="false"
    @on-cancel="handleCancle"
    :width="800"
  >
    <formModal
      ref="formData"
      :form="form"
      @submitData="submitData"
      :isEdit="true"
      :salesDisable="salesDisable"
    ></formModal>
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
import { getByIsvId, editAgentIsv } from "@/api";
export default {
  components: { formModal },
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
        this.$refs.formData.getUserList();
        this.getFormInfo();
      }
    }
  },
  data() {
    return {
      loading: false,
      editStatus: false,
      salesDisable: false,
      form: {
        salesId: "",
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
        commission: {
          ratioTop: "",
          ratioCustomer: ""
        }
      }
    };
  },
  methods: {
    getFormInfo() {
      getByIsvId({ id: this.editId }).then(res => {
        if (res.code == 200) {
          let obj = res.result;
          this.form.id = obj.id;
          this.form.salesId = obj.salesId;
          if (obj.salesId) {
            this.salesDisable = true;
          } else {
            this.salesDisable = false;
          }
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
          this.form.commission = {
            ratioTop: obj.commissionRate[0].replace("%", ""),
            ratioCustomer: obj.commissionRate[1].replace("%", "")
          };
        }
      });
    },
    handleCancle() {
      this.addStatus = false;
      this.$emit("handleCancle");
    },
    submitData(val) {
      this.loading = true;
      let obj = JSON.parse(JSON.stringify(val));
      delete obj.commission;
      delete obj.default;
      obj.ratioTop = val.commission.ratioTop;
      obj.ratioCustomer = val.commission.ratioCustomer;
      // 类型为数字类型，当为空时会自动带入null
      for (let i in obj) {
        if (obj[i] == null || obj[i] == "null") {
          delete obj[i];
        }
      }
      editAgentIsv(obj).then(res => {
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