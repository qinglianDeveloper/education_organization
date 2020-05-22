<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-02-16 15:46:36
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-05-07 16:33:22
 -->
<!-- 用户代理管理 --->
<template>
  <div class="index">
    <!-- {{menuBtns}} -->
    <div ref="header">
      <headerBtns @addIsv="addIsv" :menuBtns="menuBtns"></headerBtns>
    </div>
    <div ref="search">
      <searchForm @handleSearch="handleSearch"></searchForm>
    </div>
    <tableData
      ref="tableData"
      :tableHeight="tableHeight"
      :menuBtns="menuBtns"
      @detailChannel="detailChannel"
      @editChannel="editChannel"
      @assignSales="assignSales"
    ></tableData>
    <!-- 新增用户代理 -->
    <add :status="addStatus" @handleCancle="addCancle" @channgeTableData="channgeTableData"></add>
    <!-- 详情用户代理 -->
    <detail :status="detailStatus" :detailId="detailId" @handleCancle="detailCancle"></detail>
    <!-- 编辑用户代理 -->
    <edit
      :status="editStatus"
      :editId="editId"
      @channgeTableData="channgeTableData"
      @handleCancle="editCancle"
    ></edit>
    <!-- 指派销售 -->
    <assign
      :status="assingStatus"
      :assingRow="assingRow"
      @channgeTableData="channgeTableData"
      @handleCancle="assignCancle"
    ></assign>
  </div>
</template>
<script>
import detail from "./dialog/detail";
import destroyTableHeight from "@/mixins/destroyTableHeight";
import menuBtns from "@/mixins/menuBtns";
import headerBtns from "./components/headerBtns";
import searchForm from "./components/search";
import tableData from "./components/table";
import add from "./dialog/add";
import edit from "./dialog/edit";
import assign from "./dialog/assignSales";
export default {
  name: "channelUserManger",
  components: { headerBtns, searchForm, tableData, add, detail, edit, assign },
  mixins: [destroyTableHeight, menuBtns],
  data() {
    return {
      tableHeight: 0,
      addStatus: false,
      detailStatus: false,
      editStatus: false,
      assingStatus: false,
      detailId: "",
      editId: "",
      assingRow: {}
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
      this.tableHeight = pageHeight - headerHeight - searchHeight - 128;
    },
    handleSearch(val) {
      this.$refs.tableData.handleSearch(val);
    },
    channgeTableData() {
      this.$refs.tableData.channgeTableData();
    },
    addIsv() {
      this.addStatus = true;
    },
    addCancle() {
      this.addStatus = false;
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
    },
    assignSales(row) {
      this.assingRow = row;
      this.assingStatus = true;
    },
    assignCancle() {
      this.assingStatus = false;
    }
  }
};
</script>
<style scope lang="scss">
.index {
  padding: 16px;
}
</style>