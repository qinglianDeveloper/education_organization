<!-- 提现管理 -->
<template>
  <div class="withdrawal-manger">
    <!-- 搜索 -->
    <Row>
      <div class="search" ref="search">
        <Form :model="searchForm" ref="searchForm" style="display:flex">
          <FormItem label="提现单号" :label-width="80">
            <Input type="text" placeholder="请输入提现单号" v-model="searchForm.orderNo" />
          </FormItem>
          <!-- <FormItem label="手机号" :label-width="70">
            <Input type="text" placeholder="请输入手机号" v-model="searchForm.phone" />
          </FormItem>-->
          <FormItem label="状态" :label-width="40">
            <Select clearable style="width:120px" v-model="searchForm.status">
              <Option value="UNSOLVE">待处理</Option>
              <Option value="FINISHED">已完成</Option>
              <Option value="CANCLE">已取消</Option>
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
        <!-- 是否有发票 -->
        <template slot-scope="{row}" slot="isInvoice">
          <Tag :color="row.isInvoice==1?'green':'default'">{{row.isInvoice==1?'是':'否'}}</Tag>
        </template>
        <template slot-scope="{row}" slot="bankAccount">{{row.bankAccount?row.bankAccount:"--"}}</template>
        <template
          slot-scope="{row}"
          slot="alipayAccount"
        >{{row.alipayAccount?row.alipayAccount:"--"}}</template>
        <!-- 根据类型判断真实姓名 -->
        <template slot-scope="{row}" slot="name">
          <!-- {{row.alipayAccountName}} -->
          <span>{{selectName(row)}}</span>
        </template>
        <!-- 状态 -->
        <template slot-scope="{row}" slot="status">
          <Tag :color="row.status=='已完成'?'green':'red'">{{row.status}}</Tag>
        </template>

        <template slot="action" slot-scope="{row,index}">
          <Button
            type="primary"
            size="small"
            @click="handleMake(row,index)"
            style="margin-right:6px"
            :disabled="row.status=='待处理'?false:true"
            v-if="menuBtns.indexOf('finance:cashRecord:update')>-1"
          >状态变更</Button>
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
import { getCash, finishCash } from "@/api";
import { dateFormat } from "@/utils/current";
import { mapState } from "vuex";
export default {
  name: "withdrawal-manger",
  data() {
    return {
      searchForm: { pageNumber: 1, pageSize: 10 },
      loading: true,
      tableHeight: 0,
      columns: [
        { type: "selection", width: 60, align: "center", fixed: "left" },
        {
          title: "提现单号",
          key: "orderNo",
          align: "center",
          minWidth: 200,
          tooltip: true
        },
        {
          title: "提现金额",
          key: "price",
          align: "center",
          minWidth: 100
        },
        {
          title: "实际到账",
          key: "actualMoney",
          align: "center",
          minWidth: 100
        },
        {
          title: "提现渠道",
          key: "type",
          align: "center",
          minWidth: 100
        },
        {
          title: "银行账号",
          slot: "bankAccount",
          align: "center",
          minWidth: 150
        },
        {
          title: "支付宝账号",
          slot: "alipayAccount",
          align: "center",
          minWidth: 150
        },
        {
          title: "真实姓名",
          slot: "name",
          align: "center",
          minWidth: 100
        },
        {
          title: "银行名称",
          key: "bankName",
          align: "center",
          minWidth: 100
        },
        {
          title: "发票",
          slot: "isInvoice",
          align: "center",
          minWidth: 100
        },
        {
          title: "申请时间",
          key: "submitTime",
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
          slot: "status",
          align: "center",
          minWidth: 100
        },
        {
          title: "操作",
          slot: "action",
          align: "center",
          minWidth: 100,
          fixed: "right"
        }
      ],
      data: [],
      total: 0
    };
  },
  created() {
    this.getCash();
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
    selectName(row) {
      // console.log(row);
      let name = "";
      if (row.type == "银行转账") {
        // console.log(row.bankAccountName, 1);
        name = row.bankAccountName;
      } else if (row.type == "支付宝") {
        // console.log(row.alipayAccountName, 2);
        name = row.alipayAccountName;
      }
      // console.log(name);
      return name;
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
        document.getElementsByClassName("single-page")[0].clientHeight
      );
      let searchHeight = this.$refs.search.clientHeight;
      let footerHeight = this.$refs.footer.clientHeight;
      this.tableHeight = pageHeight - searchHeight - footerHeight - 63;
      // console.log(this.tableHeight);
    },
    /**
     * 获取提现列表
     */
    getCash() {
      getCash(this.searchForm).then(res => {
        // console.log(res);
        if (res.code == 200) {
          res.result.content.forEach(item => {
            if (item.submitTime) {
              item.submitTime = dateFormat(item.submitTime);
            }
            if (item.finishTime) {
              item.finishTime = dateFormat(item.finishTime);
            }
          });
          this.data = res.result.content;
          this.changeLanguage(this.data);
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
        switch (item.type) {
          case "ALIPAY":
            item.type = "支付宝";
            break;
          case "WXPAY":
            item.type = "微信支付";
            break;
          case "BANK":
            item.type = "银行转账";
            break;
        }
        switch (item.status) {
          case "UNSOLVE":
            item.status = "待处理";
            break;
          case "FINISHED":
            item.status = "已完成";
            break;
          case "CANCLE":
            item.status = "已取消";
            break;
        }
      });
      return arr;
    },
    /**
     * 搜索按钮事件
     */
    handleSearch() {
      this.getCash();
    },
    /**
     * 状态变更按钮
     */
    handleMake(row, index) {
      this.$Modal.confirm({
        title: "确认变更",
        content: "您确认要变更提现状态吗?一旦确认将无法变更！",
        onOk: () => {
          finishCash(row.id).then(res => {
            // console.log(res);
            if (res.code == 200) {
              this.$Message.success("状态变更成功！");
              this.getCash();
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
      this.getCash();
    },

    /**
     * 换每页条数时的回调，返回切换后的每页条数
     */
    changePageSize(v) {
      this.searchForm.pageSize = v;
      this.getCash();
    }
  }
};
</script>
<style lang="scss" scoped>
.withdrawal-manger {
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