<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-05-23 14:53:38
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-05-24 10:09:52
--> 
<template>
  <div class="trainlist">
    <Row>
      <div class="header" ref="header">
        <div class="title">
          <span>学生教师信息列表</span>
        </div>
        <!-- <div class="export-btn">
          <Button type="primary" icon="md-add" @click="add">新建</Button>
        </div>-->
      </div>
      <Divider style="margin:10px 0" />
    </Row>
    <Row>
      <!-- 教师 -->
      <Tabs :value="TabsValue" @on-click="clickTabs">
        <TabPane label="教师" name="teacher">
          <Table
            :columns="columnsTeacher"
            :data="dataTeacher"
            border
            ref="table"
            :loading="loadingTeacher"
            :height="tableHeight"
            @on-selection-change="changeSelectTeacher"
          >
            <template slot="action" slot-scope="{row,index}">
              <Button type="success" size="small" @click="handleDetails(row,index)">查看详情</Button>
            </template>
          </Table>
        </TabPane>
        <!-- 学生 -->
        <TabPane label="学生" name="student">
          <Table
            :columns="columnsStuden"
            :data="dataStuden"
            border
            ref="table"
            :loading="loadingStuden"
            :height="tableHeight"
            @on-selection-change="changeSelectStuden"
          >
            <template slot="action" slot-scope="{row,index}">
              <Button type="success" size="small" @click="handleDetails(row,index)">查看详情</Button>
            </template>
          </Table>
        </TabPane>
      </Tabs>
    </Row>
    <!-- 分页 -->
    <Row type="flex" justify="end" class="page">
      <div ref="footer" class="footer">
        <Page
          :current="searchForm.pageNumber"
          :page-size="searchForm.pageSize"
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
    <!-- 详情弹框 -->
    <Modal v-model="modalStatus" :title="modalTitle"></Modal>
  </div>
</template>
<script>
import { getTeacherList, getStudentList } from "@/api";
import { dateFormat } from "@/utils/current";
export default {
  data() {
    return {
      TabsValue: "teacher",
      columnsTeacher: [
        {
          type: "selection",
          width: 60,
          align: "center",
          fixed: "left"
        },
        {
          title: "教师姓名",
          align: "center",
          key: "name",
          minWidth: 100
        },
        {
          title: "提交时间",
          align: "center",
          key: "registrationTime",
          minWidth: 160
        },
        {
          title: "操作",
          slot: "action",
          align: "center",
          width: 130,
          fixed: "right"
        }
      ],
      dataTeacher: [],
      loadingTeacher: false,
      tableHeight: 0,
      columnsStuden: [
        {
          type: "selection",
          width: 60,
          align: "center",
          fixed: "left"
        },
        {
          title: "学生姓名",
          align: "center",
          key: "name",
          minWidth: 100
        },
        {
          title: "提交时间",
          align: "center",
          key: "registrationTime",
          minWidth: 160
        },
        {
          title: "操作",
          slot: "action",
          align: "center",
          width: 130,
          fixed: "right"
        }
      ],
      dataStuden: [],
      loadingStuden: false,
      searchForm: {
        pageNumber: 1,
        pageSize: 10
      },
      total: 0,
      modalStatus: false,
      modalTitle: ""
    };
  },
  created() {
    this.searchForm.orgId = this.$route.query.id;
    this.TabsValue = "teacher";
    this.getTableData();
  },
  mounted() {
    this.init();
  },
  destroyed() {
    // 销毁全局方法
    window.onresize = null;
  },
  methods: {
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
      this.tableHeight = pageHeight - headerHeight - footerHeight - 120;
    },
    getTableData() {
      if (this.TabsValue == "teacher") {
        getTeacherList(this.searchForm).then(res => {
          if (res.code == 200) {
            res.result.content.forEach(item => {
              if (item.registrationTime) {
                item.registrationTime = dateFormat(item.registrationTime);
              }
            });
            this.dataTeacher = res.result.content;
            this.total = res.result.totalElements;
          }
        });
      } else if (this.TabsValue == "student") {
        getStudentList(this.searchForm).then(res => {
          if (res.code == 200) {
            res.result.content.forEach(item => {
              if (item.registrationTime) {
                item.registrationTime = dateFormat(item.registrationTime);
              }
            });
            this.dataStuden = res.result.content;
            this.total = res.result.totalElements;
          }
        });
      }
    },
    changeSelectTeacher() {},
    changeSelectStuden() {},
    clickTabs(name) {
      this.TabsValue = name;
      //   console.log(name);
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      this.getTableData();
    },
    handleDetails(row, index) {
      if (this.TabsValue == "teacher") {
        this.modalTitle = "教师详情";
      } else if (this.TabsValue == "student") {
        this.modalTitle = "学生详情";
      }
      this.modalStatus = true;
    },
    changePage(e) {
      this.searchForm.pageNumber = e;
      this.getTableData();
    },
    changePageSize(e) {
      this.searchForm.pageSize = e;
      this.getTableData();
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
  .footer {
    margin-top: 10px;
  }
}
</style>