    <!-- 用户详情-消费记录 -->
<template>
  <div class="consume-log">
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
import { getUserConsume } from "@/api";
import { dateFormat } from "@/utils/current";
export default {
  name: "consume-log",
  props: { userId: Number },
  data() {
    return {
      loading: false,
      tableHeight: 0,
      /* 标题 */
      columns: [
        { title: "订单ID", key: "orderID", minWidth: 100, align: "center" },
        {
          title: "订单编号",
          key: "orderNo",
          minWidth: 220,
          align: "center"
        },
        {
          title: "交易流水号",
          key: "payName",
          minWidth: 160,
          align: "center"
        },
        {
          title: "支付时间",
          key: "orderTime",
          minWidth: 170,
          align: "center"
        },
        {
          title: "产品名称",
          key: "productName",
          minWidth: 160,
          align: "center"
        },
        {
          title: "支付方式",
          key: "payType",
          minWidth: 100,
          align: "center"
        },
        {
          title: "订单金额",
          key: "rakebackAmount",
          minWidth: 100,
          align: "center"
        },
        {
          title: "佣金",
          key: "totalPriceActual",
          minWidth: 100,
          align: "center"
        },
        {
          title: "积分",
          key: "credit",
          minWidth: 100,
          align: "center"
        }
      ],
      /* 内容 */
      data: [],
      searchForm: { pageNumber: 1, pageSize: 10 },
      total: 0
    };
  },
  created() {
    this.getUserConsume();
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
    getUserConsume() {
      this.searchForm.userId = this.userId;
      getUserConsume(this.searchForm).then(res => {
        console.log(res);
        if (res.code == 200) {
          res.result.content.forEach(item => {
            if (item.orderTime) {
              item.orderTime = dateFormat(item.orderTime);
              // console.log(item.createdTime);
            }
          });
          this.data = res.result.content;
          this.total = res.result.totalElements;
        }
      });
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
     * 页码改变的回调，返回改变后的页码
     */
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getUserConsume();
    },

    /**
     * 换每页条数时的回调，返回切换后的每页条数
     */
    changePageSize(v) {
      this.searchForm.pageSize = v;
      this.getUserConsume();
    }
  }
};
</script>
<style lang="scss" scoped>
.footer {
  margin-top: 2vh;
}
</style>