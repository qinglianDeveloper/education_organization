<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-05-23 14:14:30
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-05-23 16:29:35
--> 
<template>
  <div class="trainlist">
    <Row>
      <div class="header" ref="header">
        <div class="title">
          <span>培训机构列表</span>
        </div>
        <div class="export-btn">
          <Button type="primary" icon="md-add" @click="add">新建</Button>
        </div>
      </div>
      <Divider style="margin:10px 0" />
    </Row>
    <!-- 搜索 -->
    <Row>
      <div class="search">
        <Form
          :model="searchForm"
          ref="searchForm"
          style="display:flex;float:left"
          :label-width="100"
        >
          <FormItem label="教育机构名称">
            <Input v-model="searchForm.orgName" placeholder="请输入教育机构名称" />
          </FormItem>
          <FormItem label="负责人姓名">
            <Input v-model="searchForm.principalName" placeholder="请输入负责人姓名" />
          </FormItem>
        </Form>
        <div style="float:right;margin:11px 0">
          <Button type="primary" @click="handleSearch">搜索</Button>
          <Button @click="handleReset" style="margin-left:6px">重置</Button>
        </div>
      </div>
    </Row>
    <!-- 表格 -->
    <Row>
      <Table
        :columns="columns"
        :data="data"
        border
        ref="table"
        :loading="loading"
        :height="tableHeight"
        @on-selection-change="changeSelect"
      >
        <template slot="action" slot-scope="{row,index}">
          <Button type="success" size="small" @click="handleDetails(row,index)">查看详情</Button>
        </template>
      </Table>
    </Row>
    <!-- 分页 -->
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
import { getOrgList } from "@/api";
import { dateFormat } from "@/utils/current";
export default {
  data() {
    return {
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center",
          fixed: "left"
        },
        {
          title: "机构所在区域",
          key: "areaDetail",
          align: "center",
          minWidth: 180
        },
        {
          title: "教育机构名称",
          key: "orgName",
          align: "center",
          minWidth: 200
        },
        {
          title: "负责人姓名",
          key: "principalName",
          align: "center",
          minWidth: 160
        },
        {
          title: "负责人电话号码",
          key: "principalMobile",
          align: "center",
          minWidth: 160
        },
        {
          title: "登记时间",
          key: "createdTime",
          align: "center",
          minWidth: 170
        },
        {
          title: "操作",
          slot: "action",
          align: "center",
          width: 130,
          fixed: "right"
        }
      ],
      data: [],
      loading: true,
      tableHeight: 0,
      searchForm: {
        pageNumber: 1,
        pageSize: 10
      },
      total: 0
    };
  },
  created() {
    this.getTableInfo();
  },
  mounted() {
    this.init();
  },
  destroyed() {
    // 销毁全局方法
    window.onresize = null;
  },
  methods: {
    getTableInfo() {
      getOrgList(this.searchForm).then(res => {
        if (res.code == 200) {
          res.result.content.forEach(item => {
            if (item.createdTime) {
              item.createdTime = dateFormat(item.createdTime);
            }
          });
          this.data = res.result.content;
          this.total = res.result.totalElements;
          this.loading = false;
        }
      });
    },
    init() {
      // 计算页面高度
      this.pageHeight();
      window.onresize = () => {
        this.pageHeight();
      };
    },
    /**
     * 页面&表格高度
     */
    pageHeight() {
      let pageHeight = Number(
        document.getElementsByClassName("single-page")[0].clientHeight
      );
      let headerHeight = this.$refs.header.clientHeight;
      let footerHeight = this.$refs.footer.clientHeight;
      this.tableHeight = pageHeight - headerHeight - footerHeight - 123;
    },
    add() {},
    handleSearch() {
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      this.getTableInfo();
    },
    handleReset() {
      this.searchForm = {
        pageNumber: 1,
        pageSize: 10,
        orgName: "",
        principalName: ""
      };
      this.getTableInfo();
    },
    changeSelect() {},
    handleDetails() {},
    changePage(e) {
      this.searchForm.pageNumber = e;
      this.getTableInfo();
    },
    changePageSize(e) {
      this.searchForm.pageSize = e;
      this.getTableInfo();
    }
  }
};
</script>
<style lang="scss" scoped>
.trainlist {
  padding: 16px;
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
  .search {
    border: 1px solid #dcdee2;
    border-radius: 4px;
    padding: 0 6px;
    margin-bottom: 10px;
    overflow: hidden;
    .ivu-form {
      .ivu-form-item {
        margin: 10px 0;
        margin-right: 12px;
      }
    }
  }
  .footer {
    margin-top: 10px;
  }
}
</style>