    <!-- 用户详情-咨询记录 -->
<template>
  <div class="consult-log">
    <!-- 表格部分 -->
    <Row>
      <div class="table">
        <Table
          border
          ref="table"
          :columns="columns"
          :data="data"
          :loading="loading"
          :height="tableHeight"
          size="small"
        >
          <template slot="action" slot-scope="{row,index}">
            <Button type="primary" size="small" @click="handleShow(row,index)">查看</Button>
          </template>
        </Table>
      </div>
    </Row>
    <!-- 分页部分 -->
    <Row type="flex" justify="end" class="page">
      <div ref="footer" class="footer">
        <Page
          :current="pageNumber"
          :total="total"
          @on-change="changePage"
          @on-page-size-change="changePageSize"
          :page-size-opts="[10,20,50]"
          show-total
          size="small"
        ></Page>
      </div>
    </Row>
  </div>
</template>
<script>
export default {
  name: "consult-log",
  data() {
    return {
      loading: false,
      tableHeight: 0,
      /* 标题 */
      columns: [
        { title: "编号", key: "number", minWidth: 100, align: "center" },
        { title: "用户手机号", key: "phone", minWidth: 120, align: "center" },
        { title: "客户名称", key: "userName", minWidth: 120, align: "center" },
        {
          title: "咨询开始时间",
          key: "startTime",
          minWidth: 160,
          align: "center"
        },
        {
          title: "咨询结束时间",
          key: "endTime",
          minWidth: 160,
          align: "center"
        }
      ],
      /* 内容 */
      data: [
        {
          number: "321",
          phone: "1351472583",
          userName: "测试号",
          startTime: "2019-10-10 14:31:00",
          endTime: "2019-10-10 14:31:00"
        }
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