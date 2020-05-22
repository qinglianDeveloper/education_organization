    <!-- 用户详情-工单记录 -->
<template>
  <div class="work-log">
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
          :current="searchForm.pageNumber"
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
import { getUserWorkOrder } from "@/api";
import { dateFormat } from "@/utils/current";
export default {
  props: { userId: Number },
  name: "work-log",
  data() {
    return {
      searchForm: { pageNumber: 1, pageSize: 10 },
      loading: false,
      tableHeight: 0,
      /* 标题 */
      columns: [
        { title: "编号", key: "workOrderNum", minWidth: 200, align: "center" },
        { title: "标题", key: "orderTitle", minWidth: 180, align: "center" },
        { title: "优先级", key: "priority", minWidth: 120, align: "center" },
        { title: "状态", key: "status", minWidth: 80, align: "center" },
        {
          title: "创建时间",
          key: "createdTime",
          minWidth: 170,
          align: "center"
        },
        {
          title: "创建人",
          key: "creator",
          minWidth: 100,
          align: "center"
        },
        { title: "类型", key: "type", minWidth: 100, align: "center" }
      ],
      /* 内容 */
      data: [],
      total: 0
    };
  },
  created() {
    this.getUserWorkOrder();
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
    getUserWorkOrder() {
      this.searchForm.userId = this.userId;
      getUserWorkOrder(this.searchForm).then(res => {
        if (res.code == 200) {
          console.log("工单", res);
          res.result.content.forEach(item => {
            if (item.createdTime) {
              item.createdTime = dateFormat(item.createdTime);
            }
          });
          this.data = res.result.content;
          this.changeLanguage(this.data);
          this.total = res.result.totalElements;
        }
      });
    },
    /**
     * 语言切换
     */
    changeLanguage(arr) {
      arr.forEach(item => {
        switch (item.priority) {
          case "HIGH":
            item.priority = "高";
            break;
          case "MIDDLE":
            item.priority = "中";
            break;
          case "LOW":
            item.priority = "低";
            break;
        }
        switch (item.status) {
          case "DISALLOW":
            item.status = "待分配";
            break;
          case "DISAFFECT":
            item.status = "待受理";
            break;
          case "ACCEPT":
            item.status = "已受理";
            break;
          case "SOLVE":
            item.status = "已解决";
            break;
          case "CLOSE":
            item.status = "已关闭";
            break;
        }
      });
      return arr;
    },
    /**
     * 页码改变的回调，返回改变后的页码
     */
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getUserWorkOrder();
    },

    /**
     * 换每页条数时的回调，返回切换后的每页条数
     */
    changePageSize(v) {
      this.searchForm.pageSize = v;
      this.getUserWorkOrder();
    }
  }
};
</script>
<style lang="scss" scoped>
.footer {
  margin-top: 2vh;
}
</style>