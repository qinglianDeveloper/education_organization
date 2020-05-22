<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-04-30 15:00:24
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-05-03 10:09:46
 -->

<template>
  <Row class="search">
    <Form :model="fromData" style="display:flex;float:left">
      <FormItem label="企业名称" :label-width="80">
        <Input v-model="fromData.companyName" placeholder="请输入企业名称" />
      </FormItem>
      <FormItem label="所属区域代理" :label-width="100">
        <Input v-model="fromData.regionalAgent" placeholder="所属区域代理" />
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
        regionalAgent: ""
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