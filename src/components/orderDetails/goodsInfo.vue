<!-- 商品信息 -->
<template>
  <div class="goods-info">
    <Form disabled :label-width="100" :model="goodsInfo">
      <FormItem label="来源：">
        <Input type="text" style="width:400px" v-model="goodsInfo.platformFrom" />
      </FormItem>
      <FormItem label="所属销售：">
        <Input type="text" style="width:400px" v-model="goodsInfo.belongSales" />
      </FormItem>
      <FormItem label="所属渠道：">
        <Input type="text" style="width:400px" v-model="goodsInfo.belongChannelType" />
      </FormItem>
      <FormItem label="商品ID：">
        <Input type="text" style="width:400px" v-model="goodsInfo.productId" />
      </FormItem>
      <FormItem label="商品名称：">
        <Input type="text" style="width:400px" v-model="goodsInfo.productName" />
      </FormItem>
    </Form>
  </div>
</template>
<script>
export default {
  name: "goods-info",
  props: { order: Object },
  data() {
    return {
      goodsInfo: {}
    };
  },
  watch: {
    order(val) {
      this.goodsInfo = val;
      // console.log(val);
    }
  }
};
</script>
<style lang="scss" scoped>
.goods-info {
  padding: 6px 80px;
}
</style>