<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-04-27 15:02:12
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-05-07 17:11:22
 -->
<template>
  <Row>
    <div class="header">
      <div class="title">
        <span>销售业绩管理列表</span>
      </div>
      <div class="export-btn"></div>
    </div>
    <Divider style="margin:10px 0" />
  </Row>
</template>
<script>
export default {
  props: {
    menuBtns: {}
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  padding: 0 6px;
  .title {
    color: #2d8cf0;
    font-weight: bold;
    line-height: 32px;
  }
}
</style>