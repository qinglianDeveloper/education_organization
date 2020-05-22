<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-04-28 16:17:08
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-04-30 14:33:15
 -->
<template>
  <Row>
    <div class="header">
      <div class="title">
        <span>区域渠道管理</span>
      </div>
      <div class="export-btn">
        <Button
          type="primary"
          icon="md-add"
          @click="add"
          v-if="menuBtns.indexOf('agent:topAgent:add')>-1"
        >新建</Button>
        <!-- v-if="menuBtns.indexOf('agent:topAgent:add')>-1" -->
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
      this.$emit("addChannel");
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