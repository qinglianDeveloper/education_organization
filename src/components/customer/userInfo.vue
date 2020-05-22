<!-- 呼叫中心-用户信息 -->
<template>
  <div class="user-info">
    <Form :model="userInfo" :label-width="90">
      <FormItem label="用户昵称：" class="formitem">
        <span>{{userInfo.name}}</span>
      </FormItem>
      <FormItem label="用户ID：" class="formitem">
        <span>{{userInfo.id}}</span>
      </FormItem>
      <FormItem label="客户名称：" class="formitem">
        <span>{{userInfo.cstName}}</span>
      </FormItem>
      <FormItem label="手机号：" class="formitem">
        <span>{{userInfo.mobile}}</span>
      </FormItem>
      <FormItem label="注册时间：" class="formitem">
        <span>{{userInfo.createdTime}}</span>
      </FormItem>
      <FormItem label="账号状态：" class="formitem">
        <span>{{userInfo.status=="ENABLE"?"开启":"关闭"}}</span>
      </FormItem>
      <FormItem label="身份：" class="formitem">
        <span>{{userInfo.cstName}}</span>
      </FormItem>
      <FormItem label="等级：" class="formitem">
        <span>{{userInfo.degree}}</span>
      </FormItem>
      <FormItem label="积分：" class="formitem">
        <span>{{userInfo.credit}}</span>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import { getCallUser } from "@/api";
export default {
  props: { openId: String },
  data() {
    return {
      userInfo: {}
    };
  },
  watch: {
    openId(val) {
      if (val) {
        this.getCallUser();
      }
    }
  },
  methods: {
    getCallUser() {
      let obj = {};
      obj.openId = this.openId;
      getCallUser(obj).then(res => {
        if (res.code == 200) {
          // console.log("用户", res);
          this.userInfo = res.result[0];
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.user-info {
  .formitem {
    background: #eee;
    border-radius: 4px;
    padding: 0 10px;
  }
}
</style>