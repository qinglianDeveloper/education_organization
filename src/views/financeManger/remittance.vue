<!-- 对公打款审核 -->
<template>
  <div class="remittance">
    <!-- 搜索 -->
    <Row>
      <div class="search" ref="search">
        <Form :model="searchForm" ref="searchForm" style="display:flex">
          <FormItem label="订单号" :label-width="80">
            <Input type="text" placeholder="请输入订单号" v-model="searchForm.orderNo" />
          </FormItem>
          <FormItem label="手机号" :label-width="70">
            <Input type="text" placeholder="请输入手机号" v-model="searchForm.searchTxt" />
          </FormItem>
          <FormItem label="状态" :label-width="40">
            <Select style="width:160px" clearable v-model="searchForm.checkStatus">
              <Option value>全部</Option>
              <Option value="PASS">通过</Option>
              <Option value="UNPASS">未通过</Option>
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
        <template slot-scope="{row}" slot="checkStatus">
          <Tag :color="colorTags(row.checkStatus)">{{row.checkStatus}}</Tag>
        </template>

        <template slot="action" slot-scope="{row,index}">
          <Button
            type="success"
            size="small"
            @click="handleMake(row,index)"
            style="margin-right:6px"
            :disabled="row.checkStatus=='待审核'?false:true"
            v-if="menuBtns.indexOf('finance:publicPay:update')>-1"
          >通过</Button>
          <Button
            type="error"
            size="small"
            @click="handleRefuse(row,index)"
            style="margin-right:6px"
            :disabled="row.checkStatus=='待审核'?false:true"
            v-if="menuBtns.indexOf('finance:publicPay:update')>-1"
          >拒绝</Button>
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
import { getPublicPay, updatePublicPay } from "@/api";
import { dateFormat } from "@/utils/current";
import { mapState } from "vuex";
export default {
  name: "remittance",
  data() {
    return {
      searchForm: { pageNumber: 1, pageSize: 10 },
      loading: false,
      tableHeight: 0,
      isStatus: false,
      columns: [
        { type: "selection", width: 60, align: "center", fixed: "left" },
        {
          title: "订单号",
          key: "orderNo",
          align: "center",
          minWidth: 200,
          tooltip: true
        },
        {
          title: "商品名称",
          key: "productName",
          align: "center",
          minWidth: 160
        },
        {
          title: "支付金额",
          key: "totalPriceActual",
          align: "center",
          minWidth: 100
        },
        {
          title: "公司名称",
          key: "companyName",
          align: "center",
          minWidth: 200
        },
        {
          title: "姓名",
          key: "customerName",
          align: "center",
          minWidth: 100
        },
        {
          title: "手机号",
          key: "mobile",
          align: "center",
          minWidth: 140
        },
        {
          title: "提交时间",
          key: "orderTime",
          align: "center",
          minWidth: 170
        },
        {
          title: "完成时间",
          key: "finishTime",
          align: "center",
          minWidth: 170
        },
        {
          title: "状态",
          slot: "checkStatus",
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
    this.getPublicPay();
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
     * tags标签颜色
     */
    colorTags(status) {
      if (status == "通过") {
        return "green";
      } else if (status == "未通过") {
        return "red";
      } else if (status == "待审核") {
        return "blue";
      }
    },

    /**
     * 获取对公列表
     */
    getPublicPay() {
      getPublicPay(this.searchForm).then(res => {
        if (res.code == 200) {
          // console.log(res);
          res.result.content.forEach(item => {
            if (item.orderTime) {
              item.orderTime = dateFormat(item.orderTime);
            }
            if (item.finishTime) {
              item.finishTime = dateFormat(item.finishTime);
            }
          });
          this.data = res.result.content;
          this.changeLanguage(this.data);
          // console.log(this.data);
          this.total = res.result.totalElements;
        }
      });
    },
    /**
     * 语言切换
     */
    changeLanguage(arr) {
      arr.forEach(item => {
        switch (item.checkStatus) {
          case "PASS":
            item.checkStatus = "通过";
            break;
          case "UNPASS":
            item.checkStatus = "未通过";
            break;
          case "PEND":
            item.checkStatus = "待审核";
            break;
        }
      });
      return arr;
    },
    /**
     * 搜索按钮事件
     */
    handleSearch() {
      this.getPublicPay();
    },
    /**
     * 通过按钮
     */
    handleMake(row, index) {
      let obj = {};
      obj.orderNo = row.orderNo;
      obj.checkStatus = "PASS";
      console.log(obj);
      this.$Modal.confirm({
        title: "确认通过",
        content: "您确认要审核通过吗?一旦确认将无法更改！",
        onOk: () => {
          updatePublicPay(obj).then(res => {
            // console.log(res);
            if (res.code == 200) {
              this.$Message.success("状态变更成功！");
              this.getPublicPay();
            } else {
              this.$Message.error("状态变更失败！");
            }
          });
        }
      });
    },
    /**
     * 拒绝按钮
     */
    handleRefuse(row, index) {
      let obj = {};
      obj.orderNo = row.orderNo;
      obj.checkStatus = "UNPASS";
      console.log(obj);
      this.$Modal.confirm({
        title: "确认拒绝",
        content: "您确认拒绝通过吗?一旦确认将无法更改！",
        onOk: () => {
          updatePublicPay(obj).then(res => {
            // console.log(res);
            if (res.code == 200) {
              this.$Message.success("状态变更成功！");
              this.getPublicPay();
            } else {
              this.$Message.error("状态变更失败！");
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
      this.getPublicPay();
    },

    /**
     * 换每页条数时的回调，返回切换后的每页条数
     */
    changePageSize(v) {
      this.searchForm.pageSize = v;
      this.getPublicPay();
    }
  }
};
</script>
<style lang="scss" scoped>
.remittance {
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