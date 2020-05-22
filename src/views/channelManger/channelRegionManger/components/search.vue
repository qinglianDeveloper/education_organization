<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-04-28 16:09:18
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-04-28 22:59:09
 -->
<template>
  <Row class="search">
    <Form :model="fromData" style="display:flex;float:left" :label-width="80">
      <FormItem label="企业名称">
        <Input v-model="fromData.companyName" placeholder="请输入企业名称" />
      </FormItem>
      <FormItem label="所属销售">
        <Input v-model="fromData.salesName" placeholder="请输入所属销售" />
      </FormItem>
    </Form>
    <Button type="primary" @click="handleSearch" style="float:right;margin:11px 0">搜索</Button>
  </Row>
</template>
<script>
export default {
  data() {
    return {
      fromData: {
        companyName: "",
        salesName: ""
      },
      statusList: [],
      menuBtns: []
    };
  },
  methods: {
    handleSearch() {
      this.$emit("handleSearch", this.fromData);
    }
  }
};
</script>
<style lang="scss" scoped>
.search {
  border: 1px solid #dcdee2;
  border-radius: 4px;
  padding: 0 6px;
  margin-bottom: 10px;
  .ivu-form {
    .ivu-form-item {
      margin: 10px 0;
      margin-right: 12px;
    }
  }
}
</style>