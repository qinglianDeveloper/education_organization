<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-04-28 16:25:03
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-05-08 10:41:33
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
      ></Table>
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
import { getSalesPerformance } from "@/api";
export default {
  props: {
    menuBtns: {},
    tableHeight: {}
  },
  data() {
    return {
      selectCount: 0,
      columns: [],
      data: [],
      loading: true,
      searchForm: {
        pageNumber: 1,
        pageSize: 10
      },
      total: 0
    };
  },
  methods: {
    getColumns(val) {
      this.columns = [
        { type: "selection", width: 60, align: "center", fixed: "left" },
        { title: "姓名", key: "salesName", minWidth: 100, align: "center" },
        {
          title: "区域代理",
          key: "agentTopCount",
          minWidth: 100,
          align: "center"
        },
        {
          title: "用户代理",
          key: "isvcount",
          minWidth: 100,
          align: "center"
        },
        {
          title: `${val}月-云订单业绩`,
          key: "yunPerformance",
          minWidth: 160,
          align: "center"
        },
        {
          title: `${val}月-标准服务业绩`,
          key: "platformPerformance",
          align: "center",
          width: 160
        },
        {
          title: `${val}月-业绩总计`,
          key: "totalPerformanceThisMonth",
          align: "center",
          minWidth: 160
        },
        {
          title: "业绩总计",
          key: "totalPerformanceALL",
          align: "center",
          width: 160,
          fixed: "right"
        }
      ];
    },
    getTableData() {
      getSalesPerformance(this.searchForm).then(res => {
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
      this.searchForm.salesName = val.salesName;

      this.searchForm.year = val.year;
      this.searchForm.month = val.month;

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