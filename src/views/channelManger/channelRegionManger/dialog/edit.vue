<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-04-28 17:20:27
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-05-09 09:24:19
 -->
<template>
  <Modal
    v-model="editStatus"
    title="编辑区域渠道"
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
import { getById, updateAgentTop } from "@/api";
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
        this.$refs.formData.getUserList();
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
        },
        default: {
          secondRatioTop: "",
          secondDirectSelling: "",
          secondRatioCustomer: ""
        }
      }
    };
  },
  methods: {
    getFormInfo() {
      getById({ id: this.editId }).then(res => {
        console.log(res);
        if (res.code == 200) {
          let obj = res.result;
          this.form.salesId = obj.salesId;
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
          obj.regionAndUserCommission = obj.regionAndUserCommission.split(",");
          obj.defaultSecondLevel = obj.defaultSecondLevel.split(",");
          this.form.commission = {
            ratioTop: obj.regionAndUserCommission[0].replace("%", ""),
            ratioCustomer: obj.regionAndUserCommission[1].replace("%", "")
          };
          this.form.default = {
            secondRatioTop: obj.defaultSecondLevel[0].replace("%", ""),
            secondDirectSelling: obj.defaultSecondLevel[1].replace("%", ""),
            secondRatioCustomer: obj.defaultSecondLevel[2].replace("%", "")
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
      obj.id = this.editId;
      obj.ratioTop = val.commission.ratioTop;
      obj.ratioCustomer = val.commission.ratioCustomer;
      obj.secondRatioTop = val.default.secondRatioTop;
      obj.secondDirectSelling = val.default.secondDirectSelling;
      obj.secondRatioCustomer = val.default.secondRatioCustomer;
      // 类型为数字类型，当为空时会自动带入null
      for (let i in obj) {
        if (obj[i] == null || obj[i] == "null") {
          delete obj[i];
        }
      }
      updateAgentTop(obj).then(res => {
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