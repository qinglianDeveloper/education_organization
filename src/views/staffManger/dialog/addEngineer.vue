<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-04-28 14:25:44
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-04-28 15:38:02
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
      @submitData="addEngineer"
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
import formModal from "../components/formEngineer";
import { addEngineer } from "@/api";
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
        level: "",
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
    addEngineer(val) {
      this.loading = true;
      val.groupId = this.teamInfo.id;
      addEngineer(val).then(res => {
        if (res.code == 200) {
          this.loading = false;
          this.$Message.success("添加工程师成功!");
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