<!--
 * @Author: your name
 * @Date: 2019-12-23 09:43:15
 * @LastEditTime : 2019-12-24 15:27:36
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \lwy_admin_web\src\views\customerService\customerRelevance.vue
 -->
<!-- 关联在线客服 -->
<template>
  <div class="customer-relevance">
    <div class="left">
      <div class="call-relevance">
        <Tabs size="small">
          <TabPane label="客户信息">
            <client :openId="openId"></client>
          </TabPane>
          <TabPane label="用户信息">
            <user-info :openId="openId"></user-info>
          </TabPane>
          <TabPane label="订单信息">
            <order :openId="openId"></order>
          </TabPane>
          <TabPane label="工单信息">
            <workOrder :openId="openId"></workOrder>
          </TabPane>
          <TabPane label="查询功能">
            <userList :openId="openId"></userList>
          </TabPane>
        </Tabs>
      </div>
    </div>
  </div>
</template>
<script>
import order from "@/components/customer/order";
import userInfo from "@/components/customer/userInfo";
import client from "@/components/customer/client";
import workOrder from "@/components/customer/workOrder";
import userList from "@/components/customer/userList";
export default {
  components: { order, userInfo, client, workOrder, userList },
  name: "customer-relevance",
  data() {
    return {
      openId: ""
    };
  },
  created() {
    //let local = sessionStorage.getItem("");
    // console.log(111, top);
    // console.log(333, window);
    // console.log(222, parent);
    // this.openId = this.$router.query.openid;
    // console.log("这是openID", this.openId);
    // this.openId = "oU2sp44DNBIriqTC2XbYkBvweqAQ";
  },
  mounted() {
    this.openId = this.$router.currentRoute.query.openid;
    // console.log("这是openID", this.openId);
  }
};
</script>
<style lang="scss" scoped>
.customer-relevance {
  height: 100%;
  .left {
    width: 350px;
    // background: pink;
  }
}
</style>