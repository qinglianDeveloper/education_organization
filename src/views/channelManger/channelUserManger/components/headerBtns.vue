<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-04-27 15:02:12
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-05-07 16:18:13
 -->
<template>
  <Row>
    <div class="header">
      <div class="title">
        <span>用户代理管理</span>
      </div>
      <div class="export-btn">
        <Button
          type="primary"
          icon="md-add"
          @click="add"
          v-if="menuBtns.indexOf('agent:isvAgent:add')>-1"
        >新建</Button>
      </div>
    </div>
    <Divider style="margin:10px 0" />
  </Row>
</template>
<script>
export default {
  props: {
    menuBtns: {}
  },
  methods: {
    add() {
      this.$emit("addIsv");
    }
  }
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