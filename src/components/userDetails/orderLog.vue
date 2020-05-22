    <!-- 用户详情-订单记录 -->
<template>
  <div class="order-log">
    <Row>
      <Col span="3" class="menu-left">
        <Menu theme="light" active-name="systemOrder" width="auto" @on-select="changeMenu">
          <MenuItem name="systemOrder">系统上云</MenuItem>
          <MenuItem name="serverOrder">标准化订单</MenuItem>
          <MenuItem name="offstandardOrder">非标准化订单</MenuItem>
        </Menu>
      </Col>
      <Col span="21">
        <div class="main">
          <!-- <div class="system-order" v-show="sys"> -->
          <Table :columns="columns" border :loading="loading" :height="tableHeight" :data="data"></Table>
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
          <!-- </div> -->
          <!-- <div class="server-order" v-show="ser">标准化订单</div> -->
          <!-- <div class="offstandard-order" v-show="off">非标准化订单</div> -->
        </div>
      </Col>
    </Row>
  </div>
</template>
<script>
// import systemOrder from "@/components/orderLog/systemOrder";
import { getUserOrderYun, getUserOrderStandard, getUserOrderOff } from "@/api";
import { dateFormat } from "@/utils/current";
export default {
  props: { userId: Number },
  name: "order-log",
  data() {
    return {
      searchForm: { pageNumber: 1, pageSize: 10 },
      //   sys: true,
      //   ser: false,
      //   off: false,
      loading: true,
      tableHeight: 0,
      columns: [
        { title: "订单ID", key: "id", align: "center", minWidth: 100 },
        {
          title: "订单编号",
          key: "mainOrderNo",
          align: "center",
          minWidth: 220
        },
        {
          title: "用户ID",
          key: "userId",
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
          title: "注册平台",
          key: "type",
          align: "center",
          minWidth: 100
        },
        {
          title: "邮箱",
          key: "email",
          align: "center",
          minWidth: 200
        },
        {
          title: "手机号",
          key: "cellphone",
          align: "center",
          minWidth: 140
        },
        {
          title: "状态",
          key: "yunStatus",
          align: "center",
          minWidth: 140
        },
        {
          title: "创建时间",
          key: "createdTime",
          align: "center",
          minWidth: 170
        },
        {
          title: "销售人员",
          key: "sales",
          align: "center",
          minWidth: 100
        }
      ],
      total: 0,
      data: [],
      status: "systemOrder"
    };
  },
  created() {
    this.getUserOrderYun();
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
      if (document.getElementsByClassName("single-page")[0]) {
        let pageHeight = Number(
          document.getElementsByClassName("single-page")[0].clientHeight
        );
        let footerHeight = this.$refs.footer.clientHeight;
        this.tableHeight = pageHeight - footerHeight - 99;
      } else {
        let pageHeight = Number(
          document.getElementsByClassName("user-details")[0].clientHeight
        );
        this.tableHeight = pageHeight - 240;
      }
    },
    // 上云订单
    getUserOrderYun() {
      // console.log("上", this.userId);
      this.searchForm.userId = this.userId;
      getUserOrderYun(this.searchForm).then(res => {
        // console.log(res);
        if (res.code == 200) {
          res.result.content.forEach(item => {
            if (item.createdTime) {
              item.createdTime = dateFormat(item.createdTime);
              // console.log(item.createdTime);
            }
          });
          this.data = res.result.content;
          this.YunLanguage(this.data);
          this.total = res.result.totalElements;
          this.loading = false;
        }
      });
    },
    /**
     * 语言切换
     */
    YunLanguage(arr) {
      arr.forEach(item => {
        // if(item.yunStatus)
        switch (item.yunStatus) {
          case "SUBMITTED":
            item.yunStatus = "已提交";
            break;
          case "SENTMAIL":
            item.yunStatus = "已发送邮件";
            break;
          case "REGISTRCOMPLETE":
            item.yunStatus = "注册完成";
            break;
          case "CERTIFICATION":
            item.yunStatus = "实名认证完成";
            break;
          case "REGISTRATIONFAILED":
            item.yunStatus = "注册失败";
            break;
        }
        switch (item.type) {
          case "ALIYUN":
            item.type = "阿里云";
            break;
          case "TENGXUNYUN":
            item.type = "腾讯云";
            break;
          case "HUAWEIYUN":
            item.type = "华为云";
            break;
          case "BAIDUYUN":
            item.type = "百度云";
            break;
          case "JINSHANYUN":
            item.type = "金山云";
            break;
        }
      });
      return arr;
    },

    // 标准订单
    getUserOrderStandard() {
      // console.log("标", this.userId);
      this.searchForm.userId = this.userId;
      getUserOrderStandard(this.searchForm).then(res => {
        // console.log(res);
        if (res.code == 200) {
          res.result.content.forEach(item => {
            if (item.orderTime) {
              item.orderTime = dateFormat(item.orderTime);
              // console.log(item.createdTime);
            }
            if (item.payTime) {
              item.payTime = dateFormat(item.payTime);
              // console.log(item.createdTime);
            }
          });
          this.data = res.result.content;
          this.StandardLanguage(this.data);
          this.total = res.result.totalElements;
          this.loading = false;
        }
      });
    },
    /**
     * 语言切换
     */
    StandardLanguage(arr) {
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

    // 非标准订单
    getUserOrderOff() {
      // console.log("非", this.userId);
      this.searchForm.userId = this.userId;
      getUserOrderOff(this.searchForm).then(res => {
        // console.log("非标准", res);
        if (res.code == 200) {
          res.result.content.forEach(item => {
            if (item.orderTime) {
              item.orderTime = dateFormat(item.orderTime);
            }
            if (item.payTime) {
              item.payTime = dateFormat(item.payTime);
            }
          });
          this.data = res.result.content;
          this.OrderOffLanguage(this.data);
          this.total = res.result.totalElements;
          this.loading = false;
        }
      });
    },
    /**
     * 语言切换
     */
    OrderOffLanguage(arr) {
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
     * 左侧菜单点击事件
     */
    changeMenu(v) {
      this.status = v;
      if (v == "systemOrder") {
        this.searchForm = { pageNumber: 1, pageSize: 10 };
        this.columns = [
          { title: "订单ID", key: "id", align: "center", minWidth: 100 },
          {
            title: "订单编号",
            key: "mainOrderNo",
            align: "center",
            minWidth: 220
          },
          {
            title: "用户ID",
            key: "userId",
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
            title: "注册平台",
            key: "type",
            align: "center",
            minWidth: 100
          },
          {
            title: "邮箱",
            key: "email",
            align: "center",
            minWidth: 200
          },
          {
            title: "手机号",
            key: "cellphone",
            align: "center",
            minWidth: 140
          },
          {
            title: "状态",
            key: "yunStatus",
            align: "center",
            minWidth: 140
          },
          {
            title: "创建时间",
            key: "createdTime",
            align: "center",
            minWidth: 170
          },
          {
            title: "销售人员",
            key: "sales",
            align: "center",
            minWidth: 100
          }
        ];
        this.getUserOrderYun();
      } else if (v == "serverOrder") {
        this.searchForm = { pageNumber: 1, pageSize: 10 };
        this.columns = [
          { title: "订单ID", key: "orderId", align: "center", minWidth: 100 },
          {
            title: "订单编号",
            key: "mainOrderNo",
            align: "center",
            minWidth: 220
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
            key: "status",
            align: "center",
            minWidth: 100
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
            key: "invioceStatus",
            align: "center",
            minWidth: 100
          }
        ];
        this.getUserOrderStandard();
      } else if (v == "offstandardOrder") {
        this.searchForm = { pageNumber: 1, pageSize: 10 };
        this.columns = [
          { title: "订单ID", key: "id", align: "center", minWidth: 100 },
          {
            title: "订单编号",
            key: "mainOrderNo",
            align: "center",
            minWidth: 220
          },
          {
            title: "商品名称",
            key: "productName",
            align: "center",
            minWidth: 160
          },
          {
            title: "单价",
            key: "productPriceOrigin",
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
            title: "手机号",
            key: "mobile",
            align: "center",
            minWidth: 160
          },
          {
            title: "状态",
            key: "status",
            align: "center",
            minWidth: 100
          },
          {
            title: "支付方式",
            key: "payType",
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
            key: "invioceStatus",
            align: "center",
            minWidth: 100
          }
        ];
        this.getUserOrderOff();
      }
    },
    /**
     * 页码改变的回调，返回改变后的页码
     */
    changePage(v) {
      this.searchForm.pageNumber = v;
      if (this.status == "systemOrder") {
        this.getUserOrderYun();
      } else if (this.status == "serverOrder") {
        this.getUserOrderStandard();
      } else if (this.status == "offstandardOrder") {
        this.getUserOrderOff();
      }
    },

    /**
     * 换每页条数时的回调，返回切换后的每页条数
     */
    changePageSize(v) {
      this.searchForm.pageSize = v;
      if (this.status == "systemOrder") {
        this.getUserOrderYun();
      } else if (this.status == "serverOrder") {
        this.getUserOrderStandard();
      } else if (this.status == "offstandardOrder") {
        this.getUserOrderOff();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.order-log {
  height: 100%;
  .menu-left {
    height: 100vh;
  }
  .main {
    padding: 0 16px;
    .footer {
      margin-top: 2vh;
    }
  }
}
</style>