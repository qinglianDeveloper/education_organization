<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-05-23 14:14:30
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-05-25 22:11:41
--> 
<template>
  <div class="trainlist">
    <Row>
      <div class="header" ref="header">
        <div class="title">
          <span>每日健康列表</span>
        </div>
      </div>
      <Divider style="margin:10px 0" />
    </Row>
    <!-- 搜索 -->
    <Row>
      <div class="search">
        <Form :model="orgInfo" style="display:flex;float:left" :label-width="100">
          <FormItem label="教育机构名称:">
            <span>{{orgInfo.orgName}}</span>
          </FormItem>
          <FormItem label="联系人:">
            <span>{{orgInfo.con}}</span>
          </FormItem>
          <FormItem label="联系电话:">
            <span>{{orgInfo.phone}}</span>
          </FormItem>
        </Form>
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
        <template slot-scope="{row}" slot="temperatureHome">
          <Tag :color="changeTemp(row.temperatureHome)">{{row.temperatureHome }}℃</Tag>
        </template>
        <template slot-scope="{row}" slot="cough">
          <Tag :color="row.cough==1?'red':'green'">{{row.cough==1?'是':'否'}}</Tag>
        </template>
        <template slot-scope="{row}" slot="healthCode">
          <Tag :color="codeColor(row.healthCode)">{{row.healthCode | changeCode}}</Tag>
        </template>
        <template slot-scope="{row}" slot="temperatureOrg">
          <Tag :color="changeTemp(row.temperatureOrg)">{{row.temperatureOrg}}℃</Tag>
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
import { getEveryDayInfoList } from "@/api";
import { dateFormat } from "@/utils/current";
export default {
  data() {
    return {
      orgInfo: {},
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center",
          fixed: "left"
        },
        {
          title: "姓名",
          key: "userName",
          align: "center",
          minWidth: 110
        },
        {
          title: "填报日期",
          key: "creationDate",
          align: "center",
          minWidth: 180
        },
        {
          title: "居家测温",
          slot: "temperatureHome",
          align: "center",
          minWidth: 100
        },
        {
          title: "是否咳嗽",
          slot: "cough",
          align: "center",
          minWidth: 100
        },
        {
          title: "粤康码",
          slot: "healthCode",
          align: "center",
          minWidth: 100
        },
        {
          title: "机构测温",
          slot: "temperatureOrg",
          align: "center",
          minWidth: 100
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
    this.orgInfo = this.$route.query;
    this.searchForm.organizationId = this.orgInfo.id;
    this.searchForm.creationDate = this.orgInfo.date;
    this.getTableInfo();
  },
  mounted() {
    this.init();
  },
  destroyed() {
    // 销毁全局方法
    window.onresize = null;
  },
  filters: {
    changeCode(msg) {
      switch (msg) {
        case 0:
          return "绿码";
          break;
        case 1:
          return "红码";
          break;
        case 2:
          return "黄码";
          break;
      }
    }
  },
  methods: {
    changeTemp(msg) {
      if (msg > 37.3) {
        return "red";
      } else {
        return "green";
      }
    },
    codeColor(msg) {
      switch (msg) {
        case 0:
          return "success";
          break;
        case 1:
          return "error";
          break;
        case 2:
          return "warning";
          break;
      }
    },
    getTableInfo() {
      getEveryDayInfoList(this.searchForm).then(res => {
        if (res.code == 200) {
          res.result.content.forEach(item => {
            if (item.creationDate) {
              item.creationDate = dateFormat(item.creationDate);
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
    changeSelect() {},
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