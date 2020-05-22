<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-04-28 14:25:44
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-04-28 23:47:40
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
      @submitData="editService"
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
import formModal from "../components/formService";
import { getServiceInfo, customerServiceAE } from "@/api";
import bus from "@/utils/bus";
export default {
  props: {
    editStatus: {
      type: Boolean
    },
    userId: {}
  },
  watch: {
    editStatus(val) {
      this.status = val;
      this.$refs.formData.handleReset();
      if (val) {
        this.getServiceInfo(this.userId);
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
        jxUsername: "",
        jxPassword: ""
      }
    };
  },
  methods: {
    // 获取用户详情
    getServiceInfo(id) {
      getServiceInfo(id).then(res => {
        if (res.code == 200) {
          for (let i in this.formValidate) {
            this.formValidate[i] ? this.formValidate[i] : "";
            for (let j in res.result) {
              if (i == j) {
                this.formValidate[i] = res.result[j];
              }
            }
          }
          this.formValidate.username = res.result.userName;
          this.teamInfo.title = res.result.groupName;
          this.teamInfo.id = res.result.groupId;
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
    editService(val) {
      this.loading = true;
      val.id = this.id;
      val.groupId = this.teamInfo.id;
      customerServiceAE(val).then(res => {
        if (res.code == 200) {
          this.loading = false;
          this.$Message.success("客服编辑成功!");
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