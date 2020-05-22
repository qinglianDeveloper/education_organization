<!-- 用户中心-客户信息 -->
<template>
  <div class="client-info">
    <Form :model="clientInfo" :label-width="90">
      <FormItem label="客户名称：" class="formitem">
        <span>{{clientInfo.name}}</span>
      </FormItem>
      <FormItem label="简称：" class="formitem">
        <span>{{clientInfo.shortName}}</span>
      </FormItem>
      <FormItem label="编号：" class="formitem">
        <span>{{clientInfo.code}}</span>
      </FormItem>
      <FormItem label="上级客户：" class="formitem">
        <span>{{clientInfo.parentCstName}}</span>
      </FormItem>
      <FormItem label="关联业务：" class="formitem">
        <span>{{clientInfo.relationBusiness}}</span>
      </FormItem>
      <FormItem label="产品标签：" class="formitem">
        <span>{{clientInfo.productTag}}</span>
      </FormItem>
      <FormItem label="状态：" class="formitem">
        <span>{{clientInfo.status=="ENABLE"?"开启":"关闭"}}</span>
      </FormItem>
      <FormItem label="类型：" class="formitem">
        <span>{{clientInfo.type}}</span>
      </FormItem>
      <FormItem label="备注：" class="formitem">
        <span>{{clientInfo.remark}}</span>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import { getClient } from "@/api";
export default {
  props: { phone: String },
  data() {
    return {
      clientInfo: {}
    };
  },
  watch: {
    phone(val) {
      if (val) {
        this.getClient();
        console.log("客户-phone：", val);
      }
    }
  },
  created() {
    // console.log("phone", this.phone);
    // this.getClient();
  },
  methods: {
    getClient() {
      let obj = {};
      obj.mobile = this.phone;
      getClient(obj).then(res => {
        console.log("客户", obj, res);
        if (res.code == 200) {
          this.clientInfo = res.result[0];
          // console.log(this.clientInfo);
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.client-info {
  padding: 0 10px;

  .formitem {
    background: #eee;
    border-radius: 4px;
    padding: 0 10px;
  }
}
</style>