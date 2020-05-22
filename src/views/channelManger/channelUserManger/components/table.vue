<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-04-27 10:51:36
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-05-08 15:25:04
 -->
<template>
  <div>
    <Row>
      <Alert show-icon>
        已选择
        <span class="select-count">{{selectCount}}</span> 项
      </Alert>
    </Row>
    <Row>
      <Table
        :columns="columns"
        :data="data"
        border
        ref="table"
        :loading="loading"
        :height="tableHeight"
        @on-selection-change="changeSelect"
        class="content"
      >
        <template slot="status" slot-scope="{row}">
          <Tag :color="row.status=='ENABLE'?'green':'red'">{{row.status=='ENABLE'?'启用':'禁用'}}</Tag>
        </template>
        <template slot="qrcodeUrl" slot-scope="{row}">
          <imageView :src="row.qrcodeUrl" />
        </template>
        <template slot="action" slot-scope="{row}">
          <Button
            size="small"
            style="margin-right:6px"
            type="default"
            @click="handleDetail(row)"
            v-if="menuBtns.indexOf('agent:isvAgent:info')>-1"
          >详情</Button>
          <Button
            size="small"
            style="margin-right:6px"
            type="success"
            @click="handleEdit(row)"
            v-if="menuBtns.indexOf('agent:isvAgent:update')>-1"
          >编辑</Button>
          <Button
            size="small"
            type="primary"
            @click="handleAssignSales(row)"
            :disabled="row.salesId?true:false"
            v-if="menuBtns.indexOf('agent:isvAgent:assignSales')>-1"
          >指派销售</Button>
        </template>
      </Table>
    </Row>
    <Row type="flex" justify="end" class="page">
      <div ref="footer" class="footer">
        <Page
          :current="searchForm.pageNumber"
          :total="total"
          @on-change="changePage"
          @on-page-size-change="changePageSize"
          :page-size-opts="[10,20,50]"
          show-total
          show-elevator
          show-sizer
        ></Page>
      </div>
    </Row>
  </div>
</template>
<script>
import imageView from "@/components/imageView";
import { getIsvList } from "@/api";
export default {
  props: {
    tableHeight: {},
    menuBtns: {}
  },
  components: {
    imageView
  },
  created() {
    this.getTableData();
  },
  data() {
    return {
      selectCount: 0,
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center",
          fixed: "left"
        },
        { title: "ID", key: "id", align: "center", minWidth: 100 },
        {
          title: "公司简称",
          key: "channelName",
          align: "center",
          minWidth: 140
        },
        {
          title: "企业名称",
          key: "companyName",
          align: "center",
          minWidth: 240
        },
        { title: "手机号", key: "mobilePhone", align: "center", minWidth: 160 },
        { title: "所属销售", key: "salesName", align: "center", minWidth: 120 },
        { title: "二维码", slot: "qrcodeUrl", align: "center", minWidth: 100 },
        { title: "邀请码", key: "inviteCode", align: "center", minWidth: 100 },
        {
          title: "佣金比例",
          key: "commissionRate",
          align: "center",
          minWidth: 140
        },
        { title: "状态", slot: "status", align: "center", minWidth: 100 },
        {
          title: "操作",
          slot: "action",
          align: "center",
          fixed: "right",
          minWidth: 220
        }
      ],
      data: [],
      loading: true,
      searchForm: { pageNumber: 1, pageSize: 10 },
      total: 0
    };
  },
  methods: {
    getTableData() {
      getIsvList(this.searchForm).then(res => {
        if (res.code == 200) {
          this.loading = false;
          this.total = res.result.totalElements;
          this.data = res.result.content;
        }
      });
    },
    handleSearch(val) {
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      this.searchForm.companyName = val.companyName;
      this.searchForm.salesName = val.salesName;
      this.getTableData();
    },
    channgeTableData() {
      this.searchForm = {
        pageNumber: 1,
        pageSize: 10
      };
      this.getTableData();
    },
    changeSelect(val) {
      if (val[0]) {
        this.selectCount = val.length;
      } else {
        this.selectCount = 0;
      }
    },
    // 详情按钮
    handleDetail(row) {
      this.$emit("detailChannel", row.id);
    },
    // 编辑按钮
    handleEdit(row) {
      this.$emit("editChannel", row.id);
    },
    // 指派销售
    handleAssignSales(row) {
      this.$emit("assignSales", row);
    },
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getTableData();
    },
    changePageSize(v) {
      this.searchForm.pageSize = v;
      this.getTableData();
    }
  }
};
</script>
<style lang="scss" scoped>
.footer {
  margin-top: 20px;
}
</style>