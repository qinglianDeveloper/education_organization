<!-- 区域渠道管理 --->
<template>
  <div class="wrap-page">
    <div ref="header">
      <headerBtns :menuBtns="menuBtns" @addChannel="addChannel"></headerBtns>
    </div>
    <div ref="search">
      <searchForm @handleSearch="handleSearch"></searchForm>
    </div>
    <div ref="table">
      <tableData
        ref="tableData"
        :tableHeight="tableHeight"
        :menuBtns="menuBtns"
        @detailChannel="detailChannel"
        @editChannel="editChannel"
        @handlesaleList="handlesaleList"
      ></tableData>
    </div>

    <!-- 新增渠道 -->
    <add :status="addStatus" @handleCancle="addCancle" @channgeTableData="channgeTableData"></add>
    <!-- 详情渠道 -->
    <detail :status="detailStatus" :detailId="detailId" @handleCancle="detailCancle"></detail>
    <!-- 编辑渠道 -->
    <edit
      :status="editStatus"
      :editId="editId"
      @channgeTableData="channgeTableData"
      @handleCancle="editCancle"
    ></edit>
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
export default {
  name: "channel-check",
  components: {
    headerBtns,
    searchForm,
    tableData,
    add,
    detail,
    edit
  },
  mixins: [destroyTableHeight, menuBtns],

  data() {
    return {
      tableHeight: 0, //表格高度
      addStatus: false,
      detailStatus: false,
      editStatus: false,
      detailId: "",
      editId: ""
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
    },
    handleSearch(val) {
      this.$refs.tableData.handleSearch(val);
    },
    channgeTableData() {
      this.$refs.tableData.channgeTableData();
    },
    addChannel() {
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
    handlesaleList(row, index) {
      this.$router.push({
        name: "channelDirect",
        query: { agentCode: row.agentCode }
      });
    }
  }
};
</script>
<style scope lang="scss">
.wrap-page {
  padding: 16px;
}
.table-list {
  height: 70vh;
  overflow: auto;
}
</style>