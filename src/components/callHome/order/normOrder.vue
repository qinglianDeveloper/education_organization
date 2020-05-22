<!-- 标准化服务订单 --->
<template>
  <div class="system-order">
    <!-- 内容 -->
    <Row>
      <Table
        :columns="columns"
        :data="data"
        border
        ref="table"
        :loading="loading"
        :height="tableHeight"
        @on-selection-change="changeSelect"
        class="content"
        size="small"
      >
        <!-- 状态 -->
        <template slot-scope="{row}" slot="status">
          <Tag :color="tagsColor(row.status)">{{row.status}}</Tag>
        </template>

        <!-- 开票状态 -->
        <template slot-scope="{row}" slot="invioceStatus">
          <Tag :color="row.invioceStatus=='已开票'?'green':'red'">{{row.invioceStatus}}</Tag>
        </template>

        <template slot="action" slot-scope="{row,index}">
          <Button
            type="primary"
            size="small"
            @click="handleShow(row,index)"
            style="margin-right:6px"
          >查看</Button>
          <Button
            type="success"
            size="small"
            @click="handleOrder(row,index)"
            style="margin-right:6px"
            :disabled="verify(row,index)"
          >工单</Button>
          <Button
            type="error"
            size="small"
            @click="handleClose(row,index)"
            :disabled="row.status=='待支付'?false:true"
          >关闭</Button>
        </template>
      </Table>
    </Row>
    <!-- 分页 -->
    <Row type="flex" justify="end" class="page">
      <div ref="footer" class="footer">
        <Page
          :current="searchForm.pageNumber"
          :total="total"
          @on-change="changePage"
          @on-page-size-change="changePageSize"
          :page-size-opts="[10,20,50]"
          show-total
          show-elevator
          show-sizer
          size="small"
        ></Page>
      </div>
    </Row>
  </div>
</template>
<script>
import { getUserOrderStandard, closeOrder, getByOrderId } from "@/api";
import { dateFormat } from "@/utils/current";
import { mapState } from "vuex";
export default {
  name: "system-order",
  props: { phone: String },
  data() {
    return {
      searchForm: { pageNumber: 1, pageSize: 10 },
      total: 0,
      selectCount: 0, //选中的条数
      loading: true,
      tableHeight: 0,
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center",
          fixed: "left"
        },
        { title: "订单ID", key: "id", align: "center", minWidth: 100 },
        {
          title: "订单编号",
          key: "mainOrderNo",
          align: "center",
          minWidth: 240
        },
        {
          title: "姓名",
          key: "userName",
          align: "center",
          minWidth: 100
        },
        {
          title: "手机号",
          key: "mobile",
          align: "center",
          minWidth: 160
        },
        {
          title: "商品ID",
          key: "productId",
          align: "center",
          minWidth: 100
        },
        {
          title: "订单金额",
          key: "totalPriceOrigin",
          align: "center",
          minWidth: 100
        },
        {
          title: "状态",
          slot: "status",
          align: "center",
          minWidth: 120
        },
        {
          title: "支付方式",
          key: "payType",
          align: "center",
          minWidth: 100
        },
        {
          title: "来源",
          key: "platformFrom",
          align: "center",
          minWidth: 100
        },
        {
          title: "下单时间",
          key: "orderTime",
          align: "center",
          minWidth: 170
        },
        {
          title: "支付时间",
          key: "payTime",
          align: "center",
          minWidth: 170
        },
        {
          title: "开票状态",
          slot: "invioceStatus",
          align: "center",
          minWidth: 100
        },
        {
          title: "操作",
          slot: "action",
          align: "center",
          minWidth: 200,
          fixed: "right"
        }
      ],
      data: [],
      modalVisible: false,
      modalTitle: "变更订单状态",
      // 下拉框内容
      options: [
        { value: "", label: "全部" },
        { value: "UNPAID", label: "待支付" },
        { value: "TOBEDISTRIBUTED", label: "待分配" },
        { value: "PENDING", label: "待处理" },
        { value: "WAITFORACCEPTANCE", label: "待验收" },
        { value: "ACCOMPLISH", label: "已完成" },
        { value: "CLOSEFORORDER", label: "交易关闭" },
        { value: "WAITFORACCOUNTCHECKING", label: "等待对账" },
        { value: "PREPAID", label: "已支付" },
        { value: "UNPASS", label: "对账审核不通过" }
      ]
    };
  },
  created() {
    this.getStandard();
  },
  destroyed() {
    // 销毁全局方法
    window.onresize = null;
  },
  mounted() {
    this.init();
  },
  watch: {
    phone(val) {
      if (val) {
        this.getStandard();
      }
    }
  },
  methods: {
    verify(row, index) {
      if (
        row.status == "待支付" ||
        row.status == "交易关闭" ||
        row.status == "等待对账" ||
        row.status == "对账审核不通过"
      ) {
        return true;
      }
    },
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
        document.getElementsByClassName("call-relevance")[0].clientHeight
      );
      this.tableHeight = pageHeight - 180;
    },
    /**
     * 获取列表数据
     */
    getStandard() {
      this.searchForm.searchTxt = this.phone;
      getUserOrderStandard(this.searchForm).then(res => {
        console.log("标准", this.searchForm, res);
        if (res.code == 200) {
          res.result.content.forEach(item => {
            if (item.orderTime) {
              item.orderTime = dateFormat(item.orderTime);
            }
            if (item.payTime) {
              item.payTime = dateFormat(item.payTime);
            }
          });
          // 状态英文切换中文
          res.result.content = this.changeLanguage(res.result.content);
          this.data = res.result.content;
          this.total = res.result.totalElements;
          this.loading = false;
        }
      });
    },
    /**
     * 语言切换
     */
    changeLanguage(arr) {
      arr.forEach(item => {
        switch (item.status) {
          case "UNPAID":
            item.status = "待支付";
            break;
          case "TOBEDISTRIBUTED":
            item.status = "待分配";
            break;
          case "PENDING":
            item.status = "待处理";
            break;
          case "WAITFORACCEPTANCE":
            item.status = "待验收";
            break;
          case "ACCOMPLISH":
            item.status = "已完成";
            break;
          case "CLOSEFORORDER":
            item.status = "交易关闭";
            break;
          case "WAITFORACCOUNTCHECKING":
            item.status = "等待对账";
            break;
          case "PREPAID":
            item.status = "已支付";
            break;
          case "UNPASS":
            item.status = "对账审核不通过";
            break;
        }
        switch (item.payType) {
          case "WXPAY":
            item.payType = "微信支付";
            break;
          case "PUBLICPAY":
            item.payType = "对公支付";
            break;
        }
        switch (item.platformFrom) {
          case "WXAPP":
            item.platformFrom = "小程序";
            break;
          case "OFFLINE":
            item.platformFrom = "线下";
            break;
        }
        switch (item.invioceStatus) {
          case "NOTINVOICED":
            item.invioceStatus = "未开票";
            break;
          case "MAKEOUTINVOICE":
            item.invioceStatus = "已开票";
            break;
        }
      });
      return arr;
    },
    /**
     * 标签颜色
     */
    tagsColor(status) {
      switch (status) {
        case "待支付":
          return "blue";
          break;
        case "待分配":
          return "blue";
          break;
        case "待处理":
          return "blue";
          break;
        case "待验收":
          return "blue";
          break;
        case "已完成":
          return "green";
          break;
        case "交易关闭":
          return "red";
          break;
        case "等待对账":
          return "volcano";
          break;
        case "已支付":
          return "blue";
          break;
        case "对账审核不通过":
          return "magenta";
          break;
      }
    },

    /**
     * 表格选中
     */
    changeSelect(e) {
      let column_status = {};
      e.map((item, index) => {
        this.data.map((item1, index1) => {
          if (item.id == item1.id) {
            column_status[item.id] = true;
          }
        });
      });
      this.column_status = column_status;
      this.selectList = e;
      this.selectCount = e.length;
    },
    /**
     * 行内操作
     */
    handleShow(row, index) {
      // console.log(row, index);
      this.$router.push({
        name: "orderDetails",
        query: {
          type: "serverOrder",
          id: row.id
        }
      });
    },
    handleOrder(row, index) {
      // console.log(row);
      this.$router.push({
        name: "workDetails",
        query: {
          from: "Order",
          workID: row.orderId
        }
      });
    },
    handleClose(row, index) {
      this.$Modal.confirm({
        title: "确认关闭订单",
        content: "订单关闭后将不能恢复，您确认关闭订单？",
        onOk: () => {
          closeOrder({ id: row.id }).then(res => {
            if (res.code == 200) {
              this.$Message.success("订单关闭成功！");
              this.getStandard();
            }
          });
        }
      });
    },

    /**
     * 页码改变的回调，返回改变后的页码
     */
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getStandard();
    },

    /**
     * 换每页条数时的回调，返回切换后的每页条数
     */
    changePageSize(v) {
      this.searchForm.pageSize = v;
      this.getStandard();
    }
  }
};
</script>
<style lang="scss" scoped>
.system-order {
  //   padding: 16px;
  .header {
    display: flex;
    justify-content: space-between;
    .title {
      color: #2d8cf0;
      font-size: 16px;
      line-height: 32px;
    }
  }
  .search {
    border: 1px solid #dcdee2;
    border-radius: 4px;
    padding-left: 6px;
    margin-bottom: 10px;
    .ivu-form {
      .ivu-form-item {
        margin: 10px 0;
        margin-right: 12px;
      }
    }
  }
  .footer {
    margin-top: 2vh;
  }
}
</style>