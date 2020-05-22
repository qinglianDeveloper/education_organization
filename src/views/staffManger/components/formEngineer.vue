<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-04-27 17:01:29
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-04-28 23:56:21
 -->
<template>
  <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
    <FormItem label="所属团队:">
      <span>{{teamInfo.title}}</span>
    </FormItem>
    <FormItem label="用户姓名:" prop="username">
      <!-- 用户选择组件 -->
      <UserSelect @selectUser="selectUser" @userChange="userChange" :data="formValidate.username"></UserSelect>
    </FormItem>
    <FormItem label="真实姓名:" prop="name">
      <Input v-model="formValidate.name" placeholder="请输入用户真实姓名"></Input>
    </FormItem>
    <FormItem label="是否为领导:" prop="isLeader">
      <RadioGroup v-model="formValidate.isLeader">
        <Radio :label="0">普通员工</Radio>
        <Radio :label="1">领导</Radio>
      </RadioGroup>
    </FormItem>
    <FormItem label="工程师级别:" prop="level">
      <RadioGroup v-model="formValidate.level">
        <Radio label="ADVANCED">高级</Radio>
        <Radio label="MIDDLE">中级</Radio>
        <Radio label="PRIMARY">初级</Radio>
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
    }
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
            max: 10,
            message: "字数超出限制",
            trigger: "blur"
          }
        ],
        isLeader: [
          {
            required: true,
            message: "请选择工程师职位",
            trigger: "change",
            type: "number"
          }
        ],
        level: [
          { required: true, message: "请选择工程师级别", trigger: "change" }
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