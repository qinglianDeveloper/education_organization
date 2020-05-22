<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-02-16 15:46:36
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-05-06 14:08:00
 -->
<!-- 渠道审核 --->
<template>
  <div class="wrap-page">
    <div ref="header">
      <headerBtns></headerBtns>
    </div>
    <div ref="search">
      <search @handleSearch="handleSearch"></search>
    </div>
    <div ref="table">
      <tableData
        ref="tableData"
        :tableHeight="tableHeight"
        @detailChannel="detailChannel"
        @editChannel="editChannel"
      ></tableData>
    </div>
    <!-- 详情渠道 -->
    <detail :status="detailStatus" :detailId="detailId" @handleCancle="detailCancle"></detail>
    <!-- 编辑渠道 -->
    <edit
      :status="editStatus"
      :editId="editId"
      @handleCancle="editCancle"
      @channgeTableData="channgeTableData"
    ></edit>
  </div>
</template>
<script>
import detail from "./dialog/detail";
import destroyTableHeight from "@/mixins/destroyTableHeight";
import menuBtns from "@/mixins/menuBtns";
import headerBtns from "./components/headerBtns";
import search from "./components/search";
import tableData from "./components/table";
import edit from "./dialog/edit";
export default {
  name: "channelDirect",
  components: { headerBtns, search, tableData, detail, edit },
  mixins: [destroyTableHeight, menuBtns],
  data() {
    return {
      tableHeight: 0,
      detailId: "",
      detailStatus: false,
      editId: "",
      editStatus: false
    };
  },

  methods: {
    // 表格高度
    pageHeight() {
      let pageHeight = Number(
        document.getElementsByClassName("single-page")[0].clientHeight
      );
      let headerHeight = this.$refs.header.clientHeight;
      let searchHeight = this.$refs.search.clientHeight;
      this.tableHeight = pageHeight - headerHeight - searchHeight - 138;
      console.log(this.tableHeight);
    },
    channgeTableData() {
      this.$refs.tableData.channgeTableData();
    },
    handleSearch(val) {
      this.$refs.tableData.handleSearch(val);
    },
    detailChannel(id) {
      this.detailId = id;
      this.detailStatus = true;
    },
    detailCancle() {
      this.detailStatus = false;
    },
    editChannel(id) {
      this.editId = id;
      this.editStatus = true;
    },
    editCancle() {
      this.editStatus = false;
    }
  }
};
</script>
<style lang="scss">
.wrap-page {
  padding: 16px;
}
</style>