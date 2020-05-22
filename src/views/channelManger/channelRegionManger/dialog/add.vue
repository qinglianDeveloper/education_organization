<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-04-28 17:20:21
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-05-09 09:24:06
 -->
<template>
  <Modal
    v-model="addStatus"
    title="新增区域渠道"
    :mask-closable="false"
    @on-cancel="handleCancle"
    :width="800"
  >
    <formModal ref="formData" :form="form" @submitData="submitData" :isEdit="false"></formModal>
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
import { addAgentTop } from "@/api";
export default {
  props: {
    status: {
      type: Boolean
    }
  },
  watch: {
    status(val) {
      this.form = {
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
      };
      this.addStatus = val;
      this.$refs.formData.handleReset();
      if (val) {
        this.$refs.formData.getUserList();
      }
    }
  },
  components: { formModal },
  data() {
    return {
      loading: false,
      addStatus: false,
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
      obj.secondRatioTop = val.default.secondRatioTop;
      obj.secondDirectSelling = val.default.secondDirectSelling;
      obj.secondRatioCustomer = val.default.secondRatioCustomer;
      // 类型为数字类型，当为空时会自动带入null
      for (let i in obj) {
        if (obj[i] == null || obj[i] == "null") {
          delete obj[i];
        }
      }
      addAgentTop(obj).then(res => {
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