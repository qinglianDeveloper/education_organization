<!-- 用户详情-系统上云订单 -->
<template>
  <div class="system-order">
    <Table :columns="columns" border :loading="loading" :height="tableHeight"></Table>
    <!-- 分页 -->
    <Row type="flex" justify="end" class="page">
      <div ref="footer" class="footer">
        <Page
          :current="pageNumber"
          :total="total"
          @on-change="changePage"
          @on-page-size-change="changePageSize"
          :page-size-opts="[10,20,50]"
          show-total
          show-elevator
          show-sizer
        ></Page>
      </div>
    </Row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      tableHeight: 0,
      columns: [
        { title: "订单ID", key: "orderID", minWidht: 100 },
        { title: "订单编号", key: "orderNumber", minWidht: 100 },
        { title: "用户ID", key: "userName", minWidht: 100 },
        { title: "公司名称", key: "companyName", minWidht: 100 },
        { title: "邮箱", key: "email", minWidht: 100 },
        { title: "手机号", key: "phone", minWidht: 100 },
        { title: "状态", key: "status", minWidht: 100 },
        { title: "创建时间", key: "createTime", minWidht: 100 },
        { title: "销售人员", key: "market", minWidht: 100 }
      ],
      pageNumber: 1,
      total: 0
    };
  },
  mounted() {
    this.init();
  },
  destroyed() {
    // 销毁全局方法
    window.onresize = null;
  },
  methods: {
    init() {
      // 计算页面高度
      this.pageHeight();
      window.onresize = () => {
        this.pageHeight();
      };
    },
    /**
     * 页面&表格高度
     */
    pageHeight() {
      let pageHeight = Number(
        document.getElementsByClassName("single-page")[0].clientHeight
      );
      let footerHeight = this.$refs.footer.clientHeight;
      this.tableHeight = pageHeight - footerHeight - 99;
    },
    /**
     * 分页
     */
    changePage() {},
    changePageSize() {}
  }
};
</script>
<style lang="scss" scoped>
.footer {
  margin-top: 2vh;
}
</style>