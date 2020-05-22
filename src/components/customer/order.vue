<!-- 呼叫中心-订单 -->
<template>
  <div class="call-order">
    <div class="menu">
      <Button type="primary" size="small" @click="clickTabs('orderYun')">上云订单</Button>
      <Button type="primary" size="small" @click="clickTabs('orderNorm')">标准化订单</Button>
      <Button type="primary" size="small" @click="clickTabs('orderAtypia')">非标准化订单</Button>
    </div>
    <div class="content">
      <!-- 上云订单 -->
      <div class="yun" v-show="showYun">
        <!-- <p style="color:#2d8cf0">上云订单</p> -->
        <Table :columns="columnYun" :data="dataYun" size="small" border :height="tableHeight">
          <template slot="action" slot-scope="{row,index}">
            <Button
              type="primary"
              size="small"
              @click="handleStatus(row,index)"
              :disabled="row.yunStatus=='注册完成'?true:false"
            >{{row.yunStatus=="注册完成"?"注册完成":"变更状态"}}</Button>
          </template>
        </Table>
      </div>
      <!-- 标准化订单 -->
      <div class="norm" v-show="showNorm">
        <!-- <p style="color:#2d8cf0">标准化订单</p> -->
        <Table :columns="columnNorm" :data="dataNorm" size="small" border :height="tableHeight">
          <template slot="action" slot-scope="{row,index}">
            <Button
              type="primary"
              size="small"
              @click="handleShow(row,index)"
              style="margin-right:6px"
            >查看</Button>
            <Button
              type="error"
              size="small"
              @click="handleClose(row,index)"
              :disabled="row.status=='待支付'?false:true"
            >关闭</Button>
          </template>
        </Table>
      </div>
      <!-- 非标准化订单 -->
      <div class="atypia" v-show="showAtypia">
        <!-- <p style="color:#2d8cf0">非标准化订单</p> -->
        <Table :columns="columnAtypia" :data="dataAtypia" size="small" border :height="tableHeight">
          <template slot="action" slot-scope="{row,index}">
            <Button
              type="primary"
              size="small"
              @click="handleShow(row,index)"
              style="margin-right:6px"
            >查看</Button>
            <Button
              type="error"
              size="small"
              @click="handleClose(row,index)"
              :disabled="row.status=='待支付'?false:true"
            >关闭</Button>
          </template>
        </Table>
      </div>
    </div>
    <!-- 分页 -->
    <Row type="flex" justify="end" class="page">
      <div ref="footer" class="footer">
        <Page
          :current="searchForm.pageNumber"
          :total="total"
          @on-change="changePage"
          @on-page-size-change="changePageSize"
          :page-size-opts="[10,20,50]"
          size="small"
          show-total
        ></Page>
      </div>
    </Row>
    <!-- 弹框 -->
    <Modal
      :title="modalTitle"
      v-model="modalVisible"
      :mask-closable="false"
      :styles="{top: '140px'}"
      width="640"
    >
      <Form ref="order" :model="order" :rules="rules" :label-width="80">
        <FormItem label="状态：" prop="yunStatus">
          <RadioGroup v-model="order.yunStatus">
            <Radio label="已提交" style="margin-right:14px" value="SUBMITTED"></Radio>
            <Radio label="已发送邮件" style="margin-right:14px" value="SENTMAIL"></Radio>
            <Radio label="注册完成" style="margin-right:14px" value="REGISTRCOMPLETE"></Radio>
            <Radio label="实名认证完成" style="margin-right:14px" value="CERTIFICATION"></Radio>
            <Radio label="注册失败" value="REGISTRATIONFAILED"></Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="账号：" v-show="order.yunStatus=='注册完成'?true:false">
          <Input v-model="order.account" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="default" @click="modalVisible=false">取消</Button>
        <Button type="primary" @click="handleSubmit('orderStatus')">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import {
  getUserOrderYun,
  getUserOrderStandard,
  getUserOrderOff,
  changeYunStatus
} from "@/api";
import { dateFormat } from "@/utils/current";
export default {
  props: { openId: String },
  data() {
    return {
      searchForm: { pageNumber: 1, pageSize: 10 },
      total: 0,
      tableHeight: 0,
      columnYun: [
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
          title: "邮箱",
          key: "email",
          align: "center",
          minWidth: 200
        },
        {
          title: "状态",
          key: "yunStatus",
          align: "center",
          minWidth: 140
        }
      ],
      dataYun: [],
      columnNorm: [
        {
          title: "订单编号",
          key: "mainOrderNo",
          align: "center",
          minWidth: 220
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
          title: "下单时间",
          key: "orderTime",
          align: "center",
          minWidth: 170
        }
      ],
      dataNorm: [],
      columnAtypia: [
        {
          title: "订单编号",
          key: "mainOrderNo",
          align: "center",
          minWidth: 220
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
          title: "下单时间",
          key: "orderTime",
          align: "center",
          minWidth: 170
        }
      ],
      dataAtypia: [],
      showYun: true,
      showNorm: false,
      showAtypia: false,
      totalYun: 0,
      totalNorm: 0,
      totalAtypia: 0,
      // 上云
      order: { yunStatus: "", id: null },
      rules: {
        yunStatus: [
          { required: true, message: "状态必须选一个", trigger: "blur" }
        ]
      },
      modalVisible: false,
      modalTitle: "变更订单状态"
    };
  },
  watch: {
    openId(val) {
      if (val) {
        this.getOrder();
      }
    }
  },
  destroyed() {
    // 销毁全局方法
    window.onresize = null;
  },
  methods: {
    menuClick() {},
    init() {
      // 计算页面高度
      this.pageHeight();
      window.onresize = () => {
        this.pageHeight();
      };
    },
    /**
     * 获取订单数据
     */
    getOrder() {
      this.getUserOrderYun();
      this.getUserOrderStandard();
      this.getUserOrderOff();
    },
    // 上云订单
    getUserOrderYun() {
      this.searchForm.openid = this.openId;
      getUserOrderYun(this.searchForm).then(res => {
        // console.log("上云", "id:" + this.openId, res);
        if (res.code == 200) {
          res.result.content.forEach(item => {
            if (item.createdTime) {
              item.createdTime = dateFormat(item.createdTime);
              // console.log(item.createdTime);
            }
          });
          this.dataYun = res.result.content;
          this.YunLanguage(this.dataYun);
          this.totalYun = res.result.totalElements;
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
      this.searchForm.openid = this.openId;
      getUserOrderStandard(this.searchForm).then(res => {
        // console.log("标准", "id:" + this.openId, res);
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
          this.dataNorm = res.result.content;
          this.StandardLanguage(this.dataNorm);
          this.totalNorm = res.result.totalElements;
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
      this.searchForm.openid = this.openId;
      getUserOrderOff(this.searchForm).then(res => {
        // console.log("非标准", "id:" + this.openId, res);
        if (res.code == 200) {
          res.result.content.forEach(item => {
            if (item.orderTime) {
              item.orderTime = dateFormat(item.orderTime);
            }
            if (item.payTime) {
              item.payTime = dateFormat(item.payTime);
            }
          });
          this.dataAtypia = res.result.content;
          this.OrderOffLanguage(this.dataAtypia);
          this.totalAtypia = res.result.totalElements;
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
     * 页面&表格高度
     */
    pageHeight() {
      let pageHeight = Number(
        document.getElementsByClassName("single-page")[0].clientHeight
      );
      let footerHeight = this.$refs.footer.clientHeight;
      this.tableHeight = pageHeight - footerHeight - 96;
    },
    // 标准/非标准
    handleShow() {},
    handleOrder() {},
    handleClose() {},
    /**
     * 选择左侧菜单
     */
    // clickTabs(v) {
    //   console.log(v);
    // },
    clickTabs(v) {
      //   console.log(v);
      if (v == "orderYun") {
        this.showYun = true;
        this.showNorm = false;
        this.showAtypia = false;
        this.total = this.totalYun;
        this.getUserOrderYun();
        this.searchForm.pageNumber = 1;
      } else if (v == "orderNorm") {
        this.showYun = false;
        this.showNorm = true;
        this.showAtypia = false;
        this.total = this.totalNorm;
        this.getUserOrderStandard();
        this.searchForm.pageNumber = 1;
      } else if (v == "orderAtypia") {
        this.showYun = false;
        this.showNorm = false;
        this.showAtypia = true;
        this.total = this.totalAtypia;
        this.getUserOrderOff();
        this.searchForm.pageNumber = 1;
      }
    },

    /**
     * 上云状态变更按钮事件
     */
    handleStatus(row, index) {
      this.modalVisible = true;
      console.log(row);
      this.order.yunStatus = row.yunStatus;
      this.order.id = row.id;
    },
    changeRadio(v) {
      console.log(v);
    },

    /**
     * 弹框确定按钮
     */
    handleSubmit() {
      switch (this.order.yunStatus) {
        case "已提交":
          this.order.yunStatus = "SUBMITTED";
          break;
        case "已发送邮件":
          this.order.yunStatus = "SENTMAIL";
          break;
        case "注册完成":
          this.order.yunStatus = "REGISTRCOMPLETE";
          break;
        case "实名认证完成":
          this.order.yunStatus = "CERTIFICATION";
          break;
        case "注册失败":
          this.order.yunStatus = "REGISTRATIONFAILED";
          break;
      }
      console.log(this.order);
      changeYunStatus(this.order).then(res => {
        if (res.code == 200) {
          // console.log(res);
          this.$Message.success(res.message);
          this.getUserOrderYun();
          this.modalVisible = false;
        } else {
          this.$Message.error(res.message);
        }
      });
      // this.modalVisible = false;
    },

    /**
     * 页码改变的回调，返回改变后的页码
     */
    changePage(v) {
      this.searchForm.pageNumber = v;
      if (this.showYun) {
        this.getUserOrderYun();
      }
      if (this.showNorm) {
        this.getUserOrderStandard();
      }
      if (this.showAtypia) {
        this.getUserOrderOff();
      }
    },

    /**
     * 换每页条数时的回调，返回切换后的每页条数
     */
    changePageSize(v) {
      this.searchForm.pageSize = v;
      if (this.showYun) {
        this.getUserOrderYun();
      }
      if (this.showNorm) {
        this.getUserOrderStandard();
      }
      if (this.showAtypia) {
        this.getUserOrderOff();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.call-order {
  // height: calc(100vh - 226px);
  .menu {
    display: flex;
    margin-bottom: 10px;
    button {
      margin-right: 6px;
    }
  }
  .yun,
  .norm,
  .atypia {
    margin-bottom: 14px;
  }
}
</style>