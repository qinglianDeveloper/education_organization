<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-04-28 16:25:03
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-05-08 15:26:28
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
        border
        ref="table"
        :columns="columns"
        :data="data"
        :loading="loading"
        :height="tableHeight"
        @on-selection-change="changeSelect"
      >
        <template slot="status" slot-scope="{row}">
          <Tag :color="row.status=='ENABLE'?'green':'red'">{{row.status=='ENABLE'?'启用':'禁用'}}</Tag>
        </template>
        <template slot="qrcodeUrl" slot-scope="{row}">
          <imageView :src="row.qrcodeUrl" />
        </template>
        <template slot-scope="{ row }" slot="action">
          <Button
            type="primary"
            size="small"
            style="margin-right: 5px"
            @click="handleDetail(row)"
          >详情</Button>

          <Button type="primary" size="small" style="margin-right: 5px" @click="handleEdit(row)">编辑</Button>
        </template>
      </Table>
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
    </Row>
  </div>
</template>
<script>
import imageView from "@/components/imageView";
import { listByAgentForTop } from "@/api";
export default {
  props: {
    menuBtns: {},
    tableHeight: {}
  },
  components: {
    imageView
  },
  created() {
    this.searchForm.agentCode = this.$route.query.agentCode;
    this.getTableData();
  },
  data() {
    return {
      selectCount: 0,
      columns: [
        { type: "selection", width: 60, align: "center", fixed: "left" },
        { title: "ID", key: "id", minWidth: 100, align: "center" },
        {
          title: "公司简称",
          key: "channelName",
          minWidth: 160,
          align: "center"
        },
        {
          title: "企业名称",
          key: "companyName",
          minWidth: 220,
          align: "center"
        },
        {
          title: "所属区域代理",
          key: "agentCompanyName",
          minWidth: 140,
          align: "center"
        },
        { title: "二维码", slot: "qrcodeUrl", align: "center", width: 140 },
        { title: "邀请码", key: "inviteCode", align: "center", width: 140 },
        {
          title: "默认区域-直销-用户佣金比例",
          key: "commissionRate",
          align: "center",
          minWidth: 220
        },
        { title: "状态", slot: "status", minWidth: 100, align: "center" },
        {
          title: "操作",
          slot: "action",
          align: "center",
          fixed: "right",
          width: 160
        }
      ],
      data: [],
      loading: true,
      searchForm: {
        pageNumber: 1,
        pageSize: 10,
        agentCode: ""
      },
      total: 0
    };
  },
  methods: {
    getTableData() {
      listByAgentForTop(this.searchForm).then(res => {
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
      this.searchForm.regionalAgent = val.regionalAgent;
      this.getTableData();
    },
    channgeTableData() {
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
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