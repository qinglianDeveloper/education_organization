<!-- 标准化服务订单详情 -->
<template>
  <div class="order-details">
    <div class="close">
      <Button type="default" @click="handleClose" size="small">返回上一页</Button>
    </div>
    <Tabs :animated="false">
      <TabPane label="订单信息">
        <order-info :order="order"></order-info>
      </TabPane>
      <TabPane label="商品信息">
        <goods-info :order="order"></goods-info>
      </TabPane>
      <TabPane label="商品属性" v-if="isProperty">
        <goods-property :order="order"></goods-property>
      </TabPane>
      <TabPane label="联系人信息">
        <person-info :order="order"></person-info>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
/* 引入tabs组件 */
import orderInfo from "@/components/orderDetails/orderInfo";
import goodsInfo from "@/components/orderDetails/goodsInfo";
import goodsProperty from "@/components/orderDetails/goodsProperty";
import personInfo from "@/components/orderDetails/personInfo";
import { getStandardDetails, getoffstandardDetails } from "@/api";
import { dateFormat } from "@/utils/current";
export default {
  name: "order-details",
  components: { orderInfo, goodsInfo, goodsProperty, personInfo },
  data() {
    return {
      id: "",
      order: {},
      isProperty: true
    };
  },
  created() {
    this.init();
  },
  methods: {
    /**
     * 页面初始化
     */
    init() {
      this.getRouter();
    },
    /**
     * 获取路由传参
     */
    getRouter() {
      this.id = this.$route.query.id;
      let type = this.$route.query.type;
      // console.log(type);
      if (type == "serverOrder") {
        this.isProperty = true;
        getStandardDetails({ id: this.id }).then(res => {
          // console.log(res);
          if (res.code == 200) {
            this.order = res.result;
            if (this.order.orderTime) {
              this.order.orderTime = dateFormat(this.order.orderTime);
            }
            if (this.order.payTime) {
              this.order.payTime = dateFormat(this.order.payTime);
            }
            this.changeLanguage(this.order);
            // console.log(this.order);
          }
        });
      } else if (type == "offStandard") {
        this.isProperty = false;
        getoffstandardDetails({ id: this.id }).then(res => {
          // console.log(res);
          if (res.code == 200) {
            this.order = res.result;
            if (this.order.orderTime) {
              this.order.orderTime = dateFormat(this.order.orderTime);
            }
            if (this.order.payTime) {
              this.order.payTime = dateFormat(this.order.payTime);
            }
            this.changeLanguage(this.order);
            // console.log(this.order);
          }
        });
      }
    },
    /**
     * 语言切换
     */
    changeLanguage(obj) {
      switch (obj.status) {
        case "UNPAID":
          obj.status = "待支付";
          break;
        case "TOBEDISTRIBUTED":
          obj.status = "待分配";
          break;
        case "PENDING":
          obj.status = "待处理";
          break;
        case "WAITFORACCEPTANCE":
          obj.status = "待验收";
          break;
        case "ACCOMPLISH":
          obj.status = "已完成";
          break;
        case "CLOSEFORORDER":
          obj.status = "交易关闭";
          break;
        case "WAITFORACCOUNTCHECKING":
          obj.status = "等待对账";
          break;
        case "PREPAID":
          obj.status = "已支付";
          break;
        case "UNPASS":
          obj.status = "对账审核不通过";
          break;
      }
      switch (obj.payType) {
        case "WXPAY":
          obj.payType = "微信支付";
          break;
        case "PUBLICPAY":
          obj.payType = "对公支付";
          break;
      }
      switch (obj.platformFrom) {
        case "WXAPP":
          obj.platformFrom = "小程序";
          break;
        case "OFFLINE":
          obj.platformFrom = "线下";
          break;
      }
      switch (obj.invioceStatus) {
        case "invioceStatus":
          obj.invioceStatus = "未开票";
          break;
        case "MAKEOUTINVOICE":
          obj.invioceStatus = "已开票";
          break;
      }
      switch (obj.type) {
        case "YUNORDER":
          obj.type = "上云订单";
          break;
        case "STANDARDORDER":
          obj.type = "标准化服务订单";
          break;
        case "UNSTANDARDORDER":
          obj.type = "非标准化服务";
          break;
      }
      return obj;
    },

    /**
     * 返回上一页
     */
    handleClose() {
      this.$Modal.confirm({
        title: "确认返回",
        content: "您确认要离开?",
        onOk: () => {
          this.$router.go(-1);
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.order-details {
  padding: 16px;
  position: relative;
  .close {
    position: absolute;
    top: 16px;
    right: 16px;
    z-index: 999;
  }
}
</style>