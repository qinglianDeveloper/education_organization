<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-04-27 16:44:49
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-05-08 10:59:28
 -->
<template>
  <Modal
    v-model="status"
    title="添加组员"
    :mask-closable="false"
    :width="600"
    @on-cancel="handleCancle"
  >
    <formModal
      ref="formData"
      :teamInfo="teamInfo"
      :formValidate="formValidate"
      @submitData="addSales"
      :isEdit="true"
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
import { salesSave } from "@/api";
import bus from "@/utils/bus";
export default {
  props: {
    addStatus: {
      type: Boolean
    },
    teamInfo: {
      type: Object
    }
  },
  watch: {
    addStatus(val) {
      this.status = val;
      this.$refs.formData.handleReset();
    }
  },
  components: { formModal },
  data() {
    return {
      status: false,
      loading: false,
      formValidate: {
        userId: "",
        username: "",
        name: "",
        isLeader: "",
        salesType: "",
        remark: ""
      }
    };
  },
  methods: {
    handleCancle() {
      this.status = false;
      this.$emit("handleCancle");
    },
    handleSubmit() {
      this.$refs.formData.handleSubmit();
    },
    addSales(val) {
      this.loading = true;
      val.salesTeamId = this.teamInfo.id;
      salesSave(val).then(res => {
        if (res.code == 200) {
          this.loading = false;
          this.$Message.success("添加销售成功!");
          this.$emit("handleCancle");
          bus.$emit("updataTable", 1);
        } else {
          this.loading = false;
        }
      });
    }
  }
};
</script>