<!-- 商品属性 -->
<template>
  <div class="goods-property">
    <Form disabled :label-width="100" :model="goodsProperty">
      <FormItem v-for="(item,index) in arr" :key="index" :label="item.attributeName+'：'">
        <Input type="text" style="width:400px" v-model="item.attributeValue" />
      </FormItem>
    </Form>
  </div>
</template>
<script>
export default {
  name: "goods-Property",
  props: { order: Object },
  data() {
    return {
      goodsProperty: {},
      arr: []
    };
  },
  watch: {
    order: function(val) {
      // console.log(val);
      let brr = val.productSpecsName;
      this.changeArr(brr);
    }
  },
  methods: {
    changeArr(brr) {
      if (brr) {
        let arr = brr.replace(/\'/g, '"');
        this.arr = JSON.parse(arr);
        // console.log(this.arr);
      } else {
        return;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.goods-property {
  padding: 6px 80px;
}
</style>