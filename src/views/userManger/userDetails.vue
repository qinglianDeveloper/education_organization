    <!-- 用户详情 -->
<template>
  <div class="user-details">
    <!-- 返回按钮 -->
    <div class="btn">
      <Button type="default" size="small" icon="md-close" @click="handleClose">返回用户列表</Button>
    </div>
    <!-- 内容 -->
    <Tabs type="card">
      <TabPane label="基础信息" name="name1">
        <info :userId="userID"></info>
      </TabPane>
      <TabPane label="云账户" name="name2">
        <account :userId="userID"></account>
      </TabPane>
      <TabPane label="订单记录" name="name3">
        <order-log :userId="userID"></order-log>
      </TabPane>
      <TabPane label="工单记录" name="name4">
        <work-log :userId="userID"></work-log>
      </TabPane>
      <!--  <TabPane label="咨询记录" name="name5">
        <consult-log :userId="userID"></consult-log>
      </TabPane>-->
      <TabPane label="消费明细" name="name6">
        <consume-log :userId="userID"></consume-log>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import info from "@/components/userDetails/info";
import account from "@/components/userDetails/account";
import orderLog from "@/components/userDetails/orderLog";
import workLog from "@/components/userDetails/workLog";
// import consultLog from "@/components/userDetails/consultLog";
import consumeLog from "@/components/userDetails/consumeLog";

export default {
  name: "user-details",
  components: { info, account, orderLog, workLog, consumeLog },
  data() {
    return {
      userID: null,
      userInfo: {}
    };
  },
  created() {
    this.init();
  },
  methods: {
    /**
     * 页面初始化
     */
    init() {
      this.getRouter();
    },

    /**
     * 跳转路由传参内容
     */
    getRouter() {
      this.userID = this.$route.query.userID * 1;
      // console.log(this.userID);
    },

    /**
     * 获取用户消费明细
     */
    // getUserConsume(id) {
    //   getUserConsume(id).then(res => {
    //     console.log(res);
    //     if (res.code == 200) {
    //       this.userInfo = res.result;
    //     }
    //   });
    // },

    /**
     * 返回上一页
     */
    handleClose() {
      this.$Modal.confirm({
        title: "确认返回",
        content: "您确认要离开?",
        onOk: () => {
          this.$router.go(-1);
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.user-details {
  padding: 16px;
  position: relative;
  .btn {
    position: absolute;
    top: 16px;
    right: 16px;
    z-index: 999;
  }
}
</style>