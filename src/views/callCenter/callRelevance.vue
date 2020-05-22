<!-- 关联呼叫中心 -->
<template>
  <div class="callHome-relevance">
    <div class="call-relevance">
      <Tabs size="small" style="height:100%">
        <TabPane label="客户信息">
          <client :phone="phone"></client>
        </TabPane>
        <TabPane label="用户信息">
          <user-info :phone="phone"></user-info>
        </TabPane>
        <TabPane label="订单信息">
          <order :phone="phone"></order>
        </TabPane>
        <TabPane label="工单信息">
          <workOrder :phone="phone"></workOrder>
        </TabPane>
        <TabPane label="查询功能">
          <userList :phone="phone"></userList>
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>
<script>
import order from "@/components/callHome/order";
import userInfo from "@/components/callHome/userInfo";
import client from "@/components/callHome/client";
import workOrder from "@/components/callHome/workOrder";
import userList from "@/components/callHome/userList";
export default {
  components: { order, userInfo, client, workOrder, userList },
  name: "callHome-relevance",
  data() {
    return {
      phone: ""
    };
  },
  created() {},
  mounted() {
    this.phone = this.$router.currentRoute.query.phone;
    console.log("测试呼叫中心拿路由", this.$router);
    console.log("测试呼叫中心拿手机号", this.phone);
    // console.log("这是openID", this.openId);
  }
};
</script>
<style lang="scss" scoped>
.callHome-relevance {
  height: 100%;
  min-width: 850px;
  // background: pink;
  .call-relevance {
    height: 100%;
  }
}
</style>