<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-04-27 16:58:15
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-05-18 14:04:27
 -->
<template>
  <Modal
    v-model="status"
    title="编辑组员"
    :mask-closable="false"
    :width="600"
    @on-cancel="handleCancle"
  >
    <formModal
      ref="formData"
      :teamInfo="teamInfo"
      :formValidate="formValidate"
      @submitData="editSales"
      :isEdit="false"
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
import { getSalesInfo, salesUpdate } from "@/api";
import bus from "@/utils/bus";
export default {
  props: {
    editStatus: {
      type: Boolean,
      default: false
    },
    userId: {}
  },
  watch: {
    editStatus(val) {
      this.status = val;
      this.$refs.formData.handleReset();
      if (val) {
        this.getSalesInfo(this.userId);
      }
    }
  },
  components: { formModal },
  data() {
    return {
      id: "",
      status: false,
      loading: false,
      teamInfo: {},
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
    // 获取用户详情
    getSalesInfo(id) {
      getSalesInfo(id).then(res => {
        if (res.code == 200) {
          for (let i in this.formValidate) {
            this.formValidate[i] ? this.formValidate[i] : "";
            for (let j in res.result) {
              if (i == j) {
                this.formValidate[i] = res.result[j];
              }
            }
          }
          this.teamInfo.title = res.result.teamName;
          this.teamInfo.id = res.result.salesTeamId;
          this.id = res.result.id;
        }
      });
    },
    handleCancle() {
      this.status = false;
      this.$emit("handleCancle");
    },
    handleSubmit() {
      this.$refs.formData.handleSubmit();
    },
    editSales(val) {
      this.loading = true;
      val.id = this.id;
      val.salesTeamId = this.teamInfo.id;
      salesUpdate(val).then(res => {
        this.loading = false;
        if (res.code == 200) {
          this.$Message.success("销售编辑成功!");
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