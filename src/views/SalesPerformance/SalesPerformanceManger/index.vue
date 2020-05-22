<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-05-07 17:00:38
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-05-08 09:51:49
 -->
<template>
  <div class="sales">
    <div ref="header">
      <headerBtns></headerBtns>
    </div>
    <div ref="search">
      <searchForm @handleSearch="handleSearch" :form="form"></searchForm>
    </div>
    <tableData ref="tableData" :tableHeight="tableHeight"></tableData>
  </div>
</template>
<script>
import destroyTableHeight from "@/mixins/destroyTableHeight";
import headerBtns from "./components/headerBtns";
import searchForm from "./components/search";
import tableData from "./components/table";
export default {
  components: { headerBtns, searchForm, tableData },
  mixins: [destroyTableHeight],
  data() {
    return {
      tableHeight: 0,
      form: {
        date: "",
        year: "",
        month: ""
      },
      month: ""
    };
  },
  created() {
    //获取完整的日期
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    month = month < 10 ? "0" + month : month;
    var mydate = year.toString() + "-" + month.toString();
    this.form.date = mydate;

    let arr = mydate.split("-");
    this.form.year = arr[0];
    this.form.month = arr[1];
  },
  mounted() {
    this.handleSearch();
  },
  methods: {
    // 表格高度
    pageHeight() {
      let pageHeight = Number(
        document.getElementsByClassName("single-page")[0].clientHeight
      );
      let headerHeight = this.$refs.header.clientHeight;
      let searchHeight = this.$refs.search.clientHeight;
      this.tableHeight = pageHeight - headerHeight - searchHeight - 128;
    },
    handleSearch(val) {
      if (val) {
        this.form = val;
      }
      this.$refs.tableData.getColumns(this.form.month);
      this.$refs.tableData.handleSearch(this.form);
    }
  }
};
</script>
<style lang="scss" scoped>
.sales {
  padding: 16px;
}
</style>