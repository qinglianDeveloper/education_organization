<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-02-16 15:46:36
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-04-28 16:36:47
 -->
<template>
  <!-- 要删掉的 -->
  <Row type="flex" justify="end" class="page">
    <div class="footer">
      <Page
        :current="fromData.pageNumber"
        :total="total"
        :page-size="fromData.pageSize"
        @on-change="changePage"
        @on-page-size-change="changePageSize"
        :page-size-opts="[10,20,50]"
        show-total
        show-elevator
        show-sizer
      ></Page>
    </div>
  </Row>
</template>
<script>
import bus from "@/utils/bus";
export default {
  props: ["fromData", "total"],
  methods: {
    changePage(v) {
      this.$emit("changePage", v);
      bus.$emit("pagesTotal", v);
    },
    changePageSize(v) {
      bus.$emit("pageSizeClicl", v);
      this.$emit("clickPageSize", v);
    }
  }
};
</script>
<style lang="scss" scoped>
.footer {
  margin-top: 2vh;
}
</style>