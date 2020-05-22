<!-- 发票管理 --->
<template>
  <div class="invoice-manger">
    <!-- 搜索 -->
    <Row>
      <div class="search" ref="search">
        <Form :model="searchForm" ref="searchForm" style="display:flex">
          <FormItem label="订单号" :label-width="60">
            <Input type="text" placeholder="请输入订单号" v-model="searchForm.orderNo" />
          </FormItem>
          <FormItem label="收件人姓名" :label-width="90">
            <Input type="text" placeholder="请输入收件人姓名" v-model="searchForm.recipient" />
          </FormItem>
          <FormItem label="状态" :label-width="40">
            <!-- <Input type="text" placeholder="全部" v-model="searchForm.status" />
            -->
            <Select style="width:160px" clearable v-model="searchForm.status">
              <Option value>全部</Option>
              <Option value="NOTINVOICED">未开票</Option>
              <Option value="MAKEOUTINVOICE">已开票</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="handleSearch">搜索</Button>
          </FormItem>
        </Form>
      </div>
    </Row>
    <!-- 内容 -->
    <Row>
      <Table
        :columns="columns"
        :data="data"
        border
        ref="table"
        :loading="loading"
        :height="tableHeight"
        class="content"
      >
        <!-- 状态 -->
        <template slot-scope="{row}" slot="status">
          <Tag :color="row.status=='已开票'?'green':'red'">{{row.status}}</Tag>
        </template>

        <template slot="action" slot-scope="{row,index}">
          <Button
            type="primary"
            size="small"
            @click="handleMake(row,index)"
            style="margin-right:6px"
            :disabled="row.status=='已开票'"
            v-if="menuBtns.indexOf('finance:invoiceRecord:update')>-1"
          >状态变更</Button>
          <Button
            type="error"
            size="small"
            @click="handleDele(row,index)"
            :disabled="row.status=='已开票'"
            v-if="menuBtns.indexOf('finance:invoiceRecord:delete')>-1"
          >删除</Button>
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
        ></Page>
      </div>
    </Row>
  </div>
</template>
<script>
import { getInvoice, removeInvoice, finishInvoice } from "@/api";
import { mapState } from "vuex";
export default {
  name: "invoice-manger",
  data() {
    return {
      searchForm: { pageNumber: 1, pageSize: 10 },
      loading: false,
      tableHeight: 0,
      columns: [
        { type: "selection", width: 60, align: "center", fixed: "left" },
        { title: "开票编号", key: "id", align: "center", minWidth: 100 },
        {
          title: "关联订单",
          key: "orderNo",
          align: "center",
          minWidth: 200,
          tooltip: true
        },
        {
          title: "发票总额",
          key: "totalPrice",
          align: "center",
          minWidth: 100
        },
        {
          title: "抬头类型",
          key: "invoiceTitle",
          align: "center",
          minWidth: 100
        },
        {
          title: "发票类型",
          key: "invoiceType",
          align: "center",
          minWidth: 140
        },
        {
          title: "纳税人识别号",
          key: "taxPayerNum",
          align: "center",
          minWidth: 140,
          tooltip: true
        },
        {
          title: "备注",
          key: "remark",
          align: "center",
          minWidth: 140,
          tooltip: true
        },
        {
          title: "寄送方式",
          key: "sendType",
          align: "center",
          minWidth: 100
        },
        {
          title: "收件人姓名",
          key: "recipient",
          align: "center",
          minWidth: 130
        },
        {
          title: "邮寄地址",
          key: "address",
          align: "center",
          minWidth: 160,
          tooltip: true
        },
        {
          title: "状态",
          slot: "status",
          align: "center",
          minWidth: 100
        },
        {
          title: "操作",
          slot: "action",
          align: "center",
          minWidth: 160,
          fixed: "right"
        }
      ],
      data: [],
      total: 0
    };
  },
  created() {
    this.getInvoice();
  },
  mounted() {
    this.init();
  },
  destroyed() {
    // 销毁全局方法
    window.onresize = null;
  },
  computed: {
    ...mapState({
      menuBtns: state => state.menu.menuBtns
    })
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
      let searchHeight = this.$refs.search.clientHeight;
      let footerHeight = this.$refs.footer.clientHeight;
      this.tableHeight = pageHeight - searchHeight - footerHeight - 63;
      // console.log(this.tableHeight);
    },
    /**
     * 获取发票列表
     */
    getInvoice() {
      // console.log(this.searchForm);
      getInvoice(this.searchForm).then(res => {
        if (res.code == 200) {
          // console.log(res);
          this.data = res.result.content;
          this.total = res.result.totalElements;
          this.changeLanguage(this.data);
        }
      });
    },
    /**
     * 语言切换
     */
    changeLanguage(arr) {
      arr.forEach(item => {
        switch (item.status) {
          case "NOTINVOICED":
            item.status = "未开票";
            break;
          case "MAKEOUTINVOICE":
            item.status = "已开票";
            break;
        }
      });
      return arr;
    },
    /**
     * 搜索按钮事件
     */
    handleSearch() {
      // console.log(row);
      this.getInvoice();
    },
    /**
     * 状态变更按钮事件
     */
    handleMake(row, index) {
      // console.log(row);
      this.$Modal.confirm({
        title: "状态变更",
        content: "您确认要把状态切换成已开票？",
        onOk: () => {
          // console.log(row.id);
          finishInvoice(row.orderNo).then(res => {
            // console.log(res);
            if (res.code == 200) {
              this.$Message.success("状态变更成功");
              this.getInvoice();
            } else {
              this.$Message.error("状态变更失败");
            }
          });
        }
      });
    },
    /**
     * 删除按钮事件
     */
    handleDele(row, index) {
      console.log(row);
      this.$Modal.confirm({
        title: "删除开票记录",
        content: "您确认要删除当前开票记录？",
        onOk: () => {
          removeInvoice(row.id).then(res => {
            // console.log(res);
            if (res.code == 200) {
              this.$Message.success("删除成功");
              this.getInvoice();
            } else {
              this.$Message.error("删除失败");
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
      this.getInvoice();
    },

    /**
     * 换每页条数时的回调，返回切换后的每页条数
     */
    changePageSize(v) {
      this.searchForm.pageSize = v;
      this.getInvoice();
    }
  }
};
</script>
<style lang="scss" scoped>
.invoice-manger {
  padding: 16px;
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