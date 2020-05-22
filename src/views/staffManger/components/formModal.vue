<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-04-27 17:01:29
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-05-08 11:02:30
 -->
<template>
  <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="90">
    <FormItem label="所属团队:">
      <span>{{teamInfo.title}}</span>
    </FormItem>
    <FormItem label="用户姓名:" prop="username">
      <!-- 用户选择组件 -->
      <UserSelect
        v-if="isEdit"
        @selectUser="selectUser"
        @userChange="userChange"
        :data="formValidate.username"
      ></UserSelect>
      <span v-else>{{formValidate.username}}</span>
    </FormItem>
    <FormItem label="真实姓名:" prop="name">
      <Input v-model="formValidate.name" placeholder="请输入用户真实姓名"></Input>
    </FormItem>
    <FormItem label="销售职位:" prop="isLeader">
      <RadioGroup v-model="formValidate.isLeader">
        <Radio :label="0">普通员工</Radio>
        <Radio :label="1">领导</Radio>
      </RadioGroup>
    </FormItem>
    <FormItem label="销售类型:" prop="salesType">
      <RadioGroup v-model="formValidate.salesType">
        <Radio label="Telesales">电销</Radio>
        <Radio label="ChannelSales">渠道销售</Radio>
        <Radio label="UserSales">客户销售</Radio>
      </RadioGroup>
    </FormItem>
    <FormItem label="备注:" prop="remark">
      <Input
        v-model="formValidate.remark"
        type="textarea"
        maxlength="100"
        show-word-limit
        :rows="4"
        placeholder="Enter something..."
      ></Input>
    </FormItem>
  </Form>
</template>
<script>
import UserSelect from "@/components/common/userSelect";
export default {
  props: {
    teamInfo: {
      type: Object
    },
    formValidate: {
      type: Object
    },
    isEdit: {}
  },
  components: {
    UserSelect
  },
  data() {
    return {
      ruleValidate: {
        username: [
          {
            required: true,
            message: "请选择用户",
            trigger: "change"
          }
        ],
        name: [
          {
            required: true,
            message: "请输入用户真实姓名",
            trigger: "blur"
          },
          {
            type: "string",
            max: 20,
            message: "字数超出限制",
            trigger: "blur"
          }
        ],
        isLeader: [
          {
            required: true,
            message: "请选择销售职位",
            trigger: "change",
            type: "number"
          }
        ],
        salesType: [
          { required: true, message: "请选择销售类型", trigger: "change" }
        ]
      },
      timer: null,
      dropdownStatus: false,
      userlist: []
    };
  },
  methods: {
    selectUser(val) {
      this.formValidate.username = val.username;
      this.formValidate.userId = val.userId;
    },
    userChange(val) {
      this.formValidate.username = val.username;
      this.formValidate.userId = val.userId;
    },
    handleSubmit() {
      this.$refs["formValidate"].validate(valid => {
        if (valid) {
          if (!this.formValidate.userId) {
            this.$Message.error("请选择正确的用户！");
            return;
          }
          this.$emit("submitData", this.formValidate);
        }
      });
    },
    handleCancle() {
      this.$emit("handleCancle");
    },
    handleReset() {
      this.$refs["formValidate"].resetFields();
      this.dropdownStatus = false;
    }
  }
};
</script>
<style lang="scss" scoped>
</style>