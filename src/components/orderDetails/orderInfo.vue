<!-- 订单信息 -->
<template>
  <div class="order-info">
    <Form disabled :label-width="100" :model="orderInfo">
      <FormItem label="订单ID：">
        <Input type="text" style="width:400px" v-model="orderInfo.id" />
      </FormItem>
      <FormItem label="订单编号：">
        <Input type="text" style="width:400px" v-model="orderInfo.orderNo" />
      </FormItem>
      <FormItem label="下单时间：">
        <Input type="text" style="width:400px" v-model="orderInfo.orderTime" />
      </FormItem>
      <FormItem label="支付时间：">
        <Input type="text" style="width:400px" v-model="orderInfo.payTime" />
      </FormItem>
      <FormItem label="支付方式：">
        <Input type="text" style="width:400px" v-model="orderInfo.payType" />
      </FormItem>
      <FormItem label="订单状态：">
        <Input type="text" style="width:400px" v-model="orderInfo.status" />
      </FormItem>
      <FormItem label="订单金额：">
        <Input type="text" style="width:400px" v-model="orderInfo.totalPriceActual" />
      </FormItem>
      <FormItem label="订单类型：">
        <Input type="text" style="width:400px" v-model="orderInfo.type" />
      </FormItem>
      <FormItem label="交易流水号：">
        <Input type="text" style="width:400px" v-model="orderInfo.serialNumber" />
      </FormItem>
      <FormItem label="支付状态：">
        <Input type="text" style="width:400px" v-model="orderInfo.payStatus" />
      </FormItem>
      <!-- <FormItem label="附件下载：">
        <Input type="text" style="width:400px" v-model="orderInfo.payStatus" />
      </FormItem>-->
    </Form>
    <div style="display:flex;align-items:center" v-if="orderInfo.file?true:false">
      <span style="padding:10px 12px 10px 0;width:100px;display:inline-block;text-align:right">附件下载：</span>

      <a :href="orderInfo.file" class="load">下载附件</a>
    </div>
  </div>
</template>
<script>
export default {
  name: "order-info",
  props: { order: Object },
  data() {
    return {
      orderInfo: {}
    };
  },
  created() {},
  watch: {
    order(val) {
      this.orderInfo = val;
      // console.log(val);
    }
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
.order-info {
  padding: 6px 80px;
  .load {
    border: 1px solid #2d8cf0;
    border-radius: 4px;
    display: inline-block;
    line-height: 28px;
    height: 28px;
    padding: 0 10px;
  }
}
</style>