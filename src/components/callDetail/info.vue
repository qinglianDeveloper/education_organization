    <!-- 用户详情-基础信息 -->
<template>
  <div class="info">
    <Form :model="userInfo" :label-width="100" disabled>
      <FormItem label="用户昵称：">
        <Input v-model="userInfo.name" style="width:400px" />
      </FormItem>
      <FormItem label="用户ID：">
        <Input v-model="userInfo.userCode" style="width:400px" />
      </FormItem>
      <FormItem label="客户名称：">
        <Input v-model="userInfo.cstName" style="width:400px" />
      </FormItem>
      <FormItem label="手机号：">
        <Input v-model="userInfo.mobile" style="width:400px" />
      </FormItem>
      <FormItem label="注册时间：">
        <Input v-model="userInfo.registrationTime" style="width:400px" />
      </FormItem>
      <FormItem label="账号状态：">
        <Input v-model="userInfo.status" style="width:400px" />
      </FormItem>
      <FormItem label="身份：">
        <Input v-model="userInfo.identity" style="width:400px" />
      </FormItem>
      <FormItem label="用户类型：">
        <Input v-model="userInfo.type" style="width:400px" />
      </FormItem>
      <FormItem label="等级：">
        <Input v-model="userInfo.grade" style="width:400px" />
      </FormItem>
      <FormItem label="积分：">
        <Input v-model="userInfo.integral" style="width:400px" />
      </FormItem>
    </Form>
  </div>
</template>
<script>
import { getUserInfo } from "@/api";
export default {
  props: { userId: Number },
  name: "info",
  data() {
    return {
      userInfo: {}
    };
  },
  created() {
    // console.log(this.userId);
    this.getUserInfo();
  },
  methods: {
    /**
     * 获取用户信息
     */
    getUserInfo() {
      getUserInfo(this.userId).then(res => {
        console.log(res);
        if (res.code == 200) {
          if (res.result) {
            this.userInfo = res.result;
            this.changeLanguage(this.userInfo);
          }
          // console.log(this.userInfo);
        }
      });
    },
    /**
     * 语言切换
     */
    changeLanguage(item) {
      switch (item.type) {
        case "ORDINARY":
          item.type = "普通用户";
          break;
        case "SALES":
          item.type = "销售";
          break;
        case "AGENT":
          item.type = "代理";
          break;
        case "CUSTOMERSERVICE":
          item.type = "客服";
          break;
        case "ENGINEER":
          item.type = "工程师";
          break;
        case "INNER":
          item.type = "内部人员";
          break;
      }
      switch (item.status) {
        case "ENABLE":
          item.status = "有效";
          break;
        case "DISABLE":
          item.status = "无效";
          break;
      }
      return item;
    }
  }
};
</script>
<style lang="scss" scoped>
.info {
  padding: 10px 20px;
}
</style>